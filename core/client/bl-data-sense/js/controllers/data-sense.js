'use strict';

angular.module('blApp.dataSense.controllers')
    .controller('DataSenseController',
        ['$scope', '$rootScope', '$http', '$timeout', '$location', '$uibModal', 'widgetService', 'widgetUtilService',
            'dashboardService' , 'presentationService', 'UserService', 'toggleService', 'notifyService', '$window',
        function ($scope, $rootScope, $http, $timeout, $location, $uibModal, widgetService, widgetUtilService,
                  dashboardService, presentationService, UserService, toggleService, notifyService, $window) {
            $rootScope.errors = null;
            $rootScope.permissions = null;
            $rootScope.currentUser = null;
            $rootScope.allDashboards = [];
            $rootScope.dashboards = [];
            $rootScope.orderedDashboards = [];
            $rootScope.isViewer = false;
            $rootScope.Dsmodifyable = true;
            $rootScope.embedDialogShow = false;
            $rootScope.embedDashboardHtml = '';
            $scope.togglePanel = false;
            $scope.copyLabel = '';
            $scope.dashboardLink = '';
            $scope.shareInfo = {};

            $rootScope.selectedCollection = null;
            $rootScope.selectedDashboard = {};
            $rootScope.selectedDashboardId = '';
            $rootScope.selectedDashboardMetrics = [];
            $rootScope.collectionNames = [];
            $rootScope.selectedDashboardColumnWidgets = {};
            $rootScope.consts = {
                DATA_SENSE_WIDGET_TYPES: {  
                    Timeline: 'Timeline',
                    Bar: 'Bar',
                    Pie: 'Pie',
                    Image: 'Image',
                    Equivalencies: 'Equivalencies',
                    Table: 'Table',
                    Kpi: 'Kpi',
                    Boilerplate: 'Boilerplate'
                },
                DIMENSIONS: {
                    COUNT_OF_DATAPOINTS: 'Count of Datapoints',
                    INTERVAL: 'Interval',
                    COUNTRY: 'Country',
                    STATE: 'State',
                    CITY: 'City',
                    ZIP_CODE: 'Zip code',
                    //ACCOUNT: 'Account',
                    ACCESS_METHOD: 'Access Method',
                    //LATITUDE: 'Latitude',
                    //LONGITUDE: 'Longitude',
                    //USES_IN_DASHBOARD: 'Uses in Dashboard',
                    //USES_IN_PRESENTATION: 'Uses in Presentation',
                    //USES_IN_BRIGHTERLINK: 'Uses in BrighterLink',
                    //SOURCE_TYPE: 'Source Type',
                    //MANUFACTURER: 'Manufacturer',
                    //DEVICE: 'Device',
                    //TEAM_MEMBER_WITH_ACCESS: 'Team Members with Access',
                    MINUTE_INDEX: 'Minute Index',
                    HOUR_INDEX: 'Hour Index',
                    DAY_INDEX: 'Day Index',
                    WEEK_INDEX: 'Week Index',
                    MONTH_INDEX: 'Month Index',
                    MINUTE: 'Minute',
                    HOUR: 'Hour',
                    DATE: 'Date',
                    WEEK: 'Week',
                    MONTH: 'Month',
                    YEAR: 'Year',
                    MINUTE_OF_HOUR: 'Minute of the Hour',
                    HOUR_OF_DAY: 'Hour of the Day',
                    DAY_OF_WEEK: 'Day of the Week',
                    DAY_OF_MONTH: 'Day of the Month',
                    WEEK_OF_YEAR: 'Week of the Year',
                    MONTH_OF_YEAR: 'Month of the Year'
                }
            };
            //$rootScope.processingWidget = false;

            $rootScope.isBP = null;
            $rootScope.isBrighterViewManager = null; //for now
            $rootScope.isAdmin = null;
            $rootScope.isTM = null;
            $scope.imgUrl = $rootScope.baseCDNUrl + '/bl-data-sense/assets/img/';
            $scope.deleteConfirm = false;
            $scope.segments = [];
            $scope.isAllSegment = false;
            $scope.downloadCaption = 'Download PDF';

            /****
             * Get all dashboards via API, then remove the ones for which the user does not have access
             * Once the visible-by-permission dashboard list is populated,
             *  check to see if selectedDashboard still exists.
             * If not, goTo the first dashboard in the list.
             ****/

            $scope.getDashboards = function(dashboards) {
                $rootScope.collectionNames = [];
                $rootScope.allDashboards = $scope.appendModifyable(dashboards);
                $rootScope.dashboards = [];
                $rootScope.selectedDashboard = null;
                $rootScope.orderedDashboards = [];

                var iteratorIndex = 0;

                //If there are no dashboards returned, stop rendering
                if(typeof $rootScope.allDashboards === 'undefined'
                    || Object.keys($rootScope.allDashboards).length < 1) {
                    toggleService.hidePleaseWait();
                    return;
                }

                angular.forEach($rootScope.allDashboards, function (value, key) {
                    $rootScope.collectionNames.push(key);
                    angular.forEach(value, function (val, k) {
                        $rootScope.dashboards[iteratorIndex++] = val;
                    });
                });

                if ($rootScope.selectedDashboardId === '') {
                    // load the last-viewed dashboard.
                    if ($rootScope.currentUser){
                        $scope.goToDashboard({ _id : $rootScope.currentUser.lastEditedDashboardId }, true);
                    }
                } else {
                    $scope.renderDashboard();
                }

                // order All dashboards
                var userCollections, itemDashboard, itemCollection;
                userCollections = $rootScope.currentUser ? $rootScope.currentUser.collections : null;

                if(!userCollections || userCollections === undefined || userCollections.length === 0) {
                    angular.forEach($rootScope.allDashboards, function (collection, key) {
                        itemCollection = {'text': key, 'collection': true, 'dashboards': []};
                        
                        angular.forEach(collection, function (ds, k) {
                            itemDashboard = {'text': ds.title, 'collection': false, 'dashboard': ds};
                            itemCollection.dashboards.push(itemDashboard);
                        });

                        $rootScope.orderedDashboards.push(itemCollection);
                    });
                }
                else {
                    var remainCollections = angular.copy($rootScope.collectionNames);
                    var remainDashboards = angular.copy($rootScope.dashboards);
                    var posCollection = -1, posDashboard = -1;

                    // fill collection from userCollections
                    angular.forEach(userCollections, function (collection, colIdx) {
                        posCollection = -1;
                        if((posCollection = remainCollections.indexOf(collection.text)) !== -1) {
                            remainCollections.splice(posCollection, 1);
                            
                            itemCollection = {'text': collection.text, 'collection': true, 'dashboards': []};

                            // get dashboards from userCollections
                            angular.forEach(collection.dashboards, function (dsId, k) {
                                posDashboard = -1;
                                for(var i=0; i<remainDashboards.length; i++) {
                                    if(remainDashboards[i]._id === dsId) {
                                        posDashboard = i;
                                        break;
                                    }
                                }

                                if(posDashboard !== -1 ) {
                                    if(itemCollection.text === remainDashboards[posDashboard].collections[0]) {
                                        itemDashboard = {'text': remainDashboards[posDashboard].title, 
                                            'collection': false, 'dashboard': remainDashboards[posDashboard]};
                                        itemCollection.dashboards.push(itemDashboard);

                                        remainDashboards.splice(posDashboard, 1);
                                    }
                                }
                            });

                            // get dashboards from remainDashboards
                            angular.forEach(remainDashboards, function (dashboard, dsIdx) {
                                if(itemCollection.text === dashboard.collections[0]) {
                                    itemDashboard = {'text': dashboard.title, 'collection': false, 
                                        'dashboard': dashboard};
                                    itemCollection.dashboards.push(itemDashboard);
                                }
                            });

                            // remove added dashboard from remainDashboards
                            if(itemCollection.dashboards.length > 0) {
                                angular.forEach(itemCollection.dashboards, function (ds, dsIdx) { 
                                    posDashboard = remainDashboards.indexOf(ds.dashboard._id);
                                    if(posDashboard !== -1) {
                                        remainDashboards.splice(posDashboard, 1);
                                    }
                                });
                            }

                            $rootScope.orderedDashboards.push(itemCollection);
                        }
                    });
                    
                    // fill collection from remainCollections
                    angular.forEach(remainCollections, function (collection, colIdx) {
                        itemCollection = {'text': collection, 'collection': true, 'dashboards': []};

                        // get dashboard from remainDashboards
                        angular.forEach(remainDashboards, function (dashboard, dsIdx) {
                            if(itemCollection.text === dashboard.collections[0]) {
                                itemDashboard = {'text': dashboard.title, 'collection': false, 
                                    'dashboard': dashboard};
                                itemCollection.dashboards.push(itemDashboard);
                            }
                        });

                        // remove added dashboard from remainDashboards
                        if(itemCollection.dashboards.length > 0) {
                            angular.forEach(itemCollection.dashboards, function (ds, dsIdx) { 
                                posDashboard = remainDashboards.indexOf(ds.dashboard._id);
                                if(posDashboard !== -1) {
                                    remainDashboards.splice(posDashboard, 1);
                                }
                            });
                            $rootScope.orderedDashboards.push(itemCollection);
                        }
                    });
                }

                $scope.$emit('updateUserCollections', {});
            };

            $scope.init = function(errors, permissions, currentUser, dashboards) {
                toggleService.showPleaseWait();
                $rootScope.errors = errors;
                $rootScope.permissions = permissions;
                $rootScope.currentUser = currentUser;
                if (!currentUser && !permissions) {
                    $rootScope.isViewer = true;
                }
                if (currentUser) {
                    $rootScope.isBP = (currentUser.role === 'BP');
                    $rootScope.isBrighterViewManager = (currentUser.role === 'BP'); //for now
                    $rootScope.isAdmin = (currentUser.role === 'Admin');
                    $rootScope.isTM = (currentUser.role === 'TM');
                }

                if ($rootScope.permissions){
                    $scope.file = {
                        'uploadGeneralAssets': $rootScope.permissions.uploadGeneralAssets,
                        'uploadAccountAssets': $rootScope.permissions.uploadAccountAssets,
                        'uploadPresentationAssets': $rootScope.permissions.uploadPresentationAssets
                    };
                    $scope.file1 = {
                        'uploadGeneralAssets': $rootScope.permissions.uploadGeneralAssets,
                        'uploadAccountAssets': false, 'uploadPresentationAssets': false
                    };
                    $scope.file2 = {
                        'uploadGeneralAssets': false,
                        'uploadAccountAssets': $rootScope.permissions.uploadAccountAssets,
                        'uploadPresentationAssets': false
                    };
                    $scope.file3 = {
                        'uploadGeneralAssets': false,
                        'uploadAccountAssets': false,
                        'uploadPresentationAssets': $rootScope.permissions.uploadPresentationAssets
                    };
                }
                $timeout(function() {
                    $scope.getDashboards(dashboards);
                }, 2000);
            };

            $scope.appendModifyable = function(allDashboards) {
                if ($rootScope.currentUser){
                    var userRole = $rootScope.currentUser.role;
                    if (allDashboards._id) { // if parameter is not array of dashboard collection ?
                        allDashboards.modifyable = (userRole === 'BP')
                            || (userRole === 'Admin' && allDashboards.creatorRole !== 'BP')
                            || (allDashboards.creatorRole === 'TM' && 
                                allDashboards.creator === $rootScope.currentUser._id);
                        return allDashboards;
                    }

                    angular.forEach(allDashboards, function (collection) {
                        angular.forEach(collection, function (dashboard) {
                            var bpLock = dashboard.bpLock;
                            if ((userRole === 'BP' && dashboard.creator === $rootScope.currentUser._id) || 
                                (userRole === 'BP' && dashboard.creator !== $rootScope.currentUser._id && !bpLock) ||
                                (userRole === 'Admin' && dashboard.creatorRole !== 'BP') ||
                                (dashboard.creatorRole === 'TM' && dashboard.creator === $rootScope.currentUser._id)) {
                                dashboard.modifyable = true;
                            } else {
                                dashboard.modifyable = false;
                            }
                        });
                    });
                }
                return allDashboards;
            };

            $scope.openNewWidgetDialog = function() {
                /*if ($rootScope.selectedDashboard.parents.length === 0) {
                    notyfy({
                        text: '<strong>At lease one segment should be added to Dashboard before adding widgets.
                            </strong><br><div class="click-close">{Click this bar to Close}',
                        type: 'success',
                        dismissQueue: true
                    });
                    return;
                }*/

                var modalInstance = $uibModal.open({
                    templateUrl: 'modalAddNewWidget.html',
                    controller: 'AddNewWidgetController',
                    resolve: {
                        'selectedWidget': null
                    }
                });

                modalInstance.result.then(function(inputJson) {
                    //$rootScope.processingWidget = true;
                    toggleService.showPleaseWait();
                    if (inputJson.type === $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Pie) {
                        inputJson.showUpTo = parseInt(inputJson.showUpTo);
                    }
                    widgetService
                        .createWidget(inputJson, $rootScope.selectedDashboard)
                        .then(function(newWidget) {
                            $rootScope.selectedDashboard.widgets.push(newWidget);
                            return dashboardService.updateDashboard($rootScope.selectedDashboard);
                        })
                        .then(function() {
                            var newWR =
                                $rootScope.selectedDashboard.widgets[$rootScope.selectedDashboard.widgets.length - 1];
                            if (newWR.widget.type === $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Image) {
                                newWR.widget.bLoaded = true;
                                return newWR;
                            }
                            return widgetService.getWidgetData($rootScope.selectedDashboard, newWR);
                            /*$scope.applyAddedWidgetToDashboard(updatedDashboard);*/
                        })
                        .then(function() {
                            $scope.updateDashboardList($rootScope.selectedDashboard);
                            toggleService.hidePleaseWait();
                            $rootScope.$broadcast('selectedDashboardChanged', {});
                        });
                    /*widgetService.createWidget(inputJson, $rootScope.selectedDashboard, function(err, data) {
                        if (err) {
                            toggleService.hidePleaseWait();
                            console.log(err);
                        } else {
                            $scope.applyAddedWidgetToDashboard(data);
                        }
                    });*/
                }, function() {
                    console.log('[DATA SENSE] Modal dismissed');
                });
            };

            $scope.updateDashboardList = function (updatedDashboard) {
                angular.forEach($rootScope.dashboards, function(dashboard, idx) {
                    $rootScope.dashboards[idx] = updatedDashboard;
                });
            };

            $scope.applyAddedWidgetToDashboard = function(updatedDashboard) {
                angular.forEach($rootScope.dashboards, function(dashboard) {
                    if (dashboard._id === updatedDashboard._id) {
                        var createdWidget = updatedDashboard.widgets[updatedDashboard.widgets.length - 1];
                        dashboard.widgets.push(createdWidget);

                        if (createdWidget.widget.type !== $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Image) {
                            createdWidget.widget.bLoaded = false;
                            widgetService
                                .getWidgetData(dashboard, createdWidget)
                                .then(function(wr) {
                                    toggleService.hidePleaseWait();
                                    $rootScope.$broadcast('selectedDashboardChanged', {});
                                });
                        } else {
                            createdWidget.widget.bLoaded = true;
                            toggleService.hidePleaseWait();
                            $rootScope.$broadcast('selectedDashboardChanged', {});
                        }
                    }
                });
            };

            $scope.toggleDashboardRemove = function (dashboard) {
                var animationAction = 'flipInX';
                dashboard.isRemoving = dashboard.isRemoving ? false : true;
                console.log('toggleDashboardRemove', dashboard.isRemoving);
                angular.element('#ds-dashboard-' + dashboard._id + ' .delete-box')
                .removeClass(animationAction + ' animated')
                .addClass(animationAction + ' animated')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass(animationAction + ' animated');
                });
            };

            /*$scope.updateDashboard = function (evt) {
                var pos = $(evt.target).offset();
                pos.top += $(evt.target).height() + 10;
                $scope.$broadcast(broadcastEvents.OpenDashboardUpdateDlg, $rootScope.selectedDashboard, pos);
            };*/

            $scope.deleteDashboard = function(dashboard) {
                dashboardService
                    .deleteDashboard(dashboard)
                    .then(function(data) {
                        console.log('DASHBOARD removed: ', dashboard);
                        var delIndex = -1;
                        var nextDashboardId = null;
                        var nextDashboardIndex = -1;

                        angular.forEach($rootScope.allDashboards[dashboard.collections[0]], function(ds, idx) {
                            if (ds._id === dashboard._id) {
                                delIndex = idx;
                            }
                        });
                        if (delIndex !== -1) {
                            $rootScope.allDashboards[dashboard.collections[0]].splice(delIndex, 1);
                            delIndex = -1;
                            //If the collection has no dashboards related to it, remove that collection
                            //Otherwise, fetch the next dashboard id in the same collection
                            if ($rootScope.allDashboards[dashboard.collections[0]].length < 1) {
                                delete $rootScope.allDashboards[dashboard.collections[0]];
                            } else {
                                nextDashboardId = $rootScope.allDashboards[dashboard.collections[0]][0]._id;
                            }
                        }
                        angular.forEach($rootScope.dashboards, function(ds, idx) {
                            if (ds._id === dashboard._id) {
                                delIndex = idx;
                            }
                        });
                        if (delIndex !== -1) {
                            $rootScope.dashboards.splice(delIndex, 1);
                        }
                        angular.forEach($rootScope.dashboards, function(ds, idx) {
                            if (ds._id === nextDashboardId) {
                                nextDashboardIndex = idx;
                            }
                        });

                        if ($rootScope.dashboards.length > 0) {
                            if (nextDashboardIndex !== -1) {
                                $scope.goToDashboard($rootScope.dashboards[nextDashboardIndex], true);
                            } else {
                                $scope.goToDashboard($rootScope.dashboards[0], true);
                            }
                            $scope.checkRemoved = false;
                        } else {
                            $rootScope.$broadcast('deletedAllDashboards');
                            $scope.goToDashboard(null, true);
                            $scope.checkRemoved = true;
                        }

                        // remove from ordered dashboards
                        var colIdx = -1, dsIdx = -1;
                        angular.forEach($rootScope.orderedDashboards, function(collection, i) {
                            if (collection.text === dashboard.collections[0]) {
                                colIdx = i;
                                angular.forEach(collection.dashboards, function(ds, j) {
                                    if(ds.dashboard._id === dashboard._id) {
                                        dsIdx = j;
                                    }
                                });
                            }
                        });
                        if(colIdx !== -1 && dsIdx !== -1) {
                            $rootScope.orderedDashboards[colIdx].dashboards.splice(dsIdx, 1);
                            if($rootScope.orderedDashboards[colIdx].dashboards.length === 0) {
                                $rootScope.orderedDashboards.splice(colIdx, 1);
                            }
                        }

                        $scope.$emit('updateUserCollections', {});
                    });
            };

            $scope.goToDashboard = function (dashboard, isChangeLocation) {
                if (dashboard === null) {
                    if (isChangeLocation) {
                        $location.path('/').replace();
                    }
                    return;
                }
                if (isChangeLocation) {
                    $location.path('/' + dashboard._id).replace();
                }
            };

            $scope.renderDashboard = function() {
                if (typeof $rootScope.dashboards === 'undefined' || $rootScope.dashboards.length < 1) {
                    if ($location.absUrl().indexOf('commondashboard') > 0 && !$rootScope.selectedDashboardId){
                        $window.location = './404';
                    } else {
                        $scope.clearDashboard();
                    }
                    //$location.path('/').replace();
                    return;
                }
                var isFindDashboard = false;
                angular.forEach($rootScope.dashboards, function(ds, idx) {
                    if (ds._id === $rootScope.selectedDashboardId) {
                        if (ds.bpLock) {
                            $rootScope.Dsmodifyable = false;
                        } else {
                            $rootScope.Dsmodifyable = true;
                        }
                        isFindDashboard = true;
                        $rootScope.selectedDashboard = ds;
                    }
                });
                if( !isFindDashboard ) {
                    // If the selected dashboard doesn't exists
                    //  then load the dashboard in the order of Last-Viewed, Previous-Viewed.
                    if( $rootScope.currentUser && $rootScope.currentUser.lastEditedDashboardId && 
                        ($rootScope.selectedDashboardId === $rootScope.currentUser.lastEditedDashboardId )) {
                        $scope.goToDashboard({ _id : $rootScope.currentUser.previousEditedDashboardId }, true);
                    } else {
                        if ($rootScope.currentUser && $rootScope.dashboards) {
                            $scope.goToDashboard($rootScope.dashboards[0], true);
                        } else {
                            $window.location = './404';
                        }
                    }
                    //$scope.clearDashboard();
                    return;
                } else {
                    $rootScope.$broadcast('collapseDashboardSidebar',
                        {collectionName: $rootScope.selectedDashboard.collections[0]});
                }
                //Save the last edited dashboard into User info.
                if ($rootScope.currentUser) {
                    if( $rootScope.selectedDashboard._id !== $rootScope.currentUser.lastEditedDashboardId ) {
                        $rootScope.currentUser.previousEditedDashboardId = $rootScope.currentUser.lastEditedDashboardId;
                        $rootScope.currentUser.lastEditedDashboardId = $rootScope.selectedDashboard._id;
                        UserService.updateUser({user: $rootScope.currentUser});
                    }
                }

                // Clear every widget content in the dashboard so that widget loading icon appear
                if ($rootScope.selectedDashboard.widgetsDataLoaded === true) {
                    $rootScope.selectedDashboard.widgetsDataLoaded = false;
                    angular.forEach($rootScope.selectedDashboard.widgets, function(value, key) {
                        value.widget.bLoaded = false;
                    });
                }

                var dashboard = $rootScope.selectedDashboard;
                var tempAllSegment = dashboard.isAllSegment;
                if (typeof dashboard.fetched !== 'undefined' && dashboard.fetched === true) {
                    $rootScope.selectedDashboard = dashboard;
                    $rootScope.appName = $rootScope.selectedDashboard.title;
                    $scope.doActionAfterDashboardSelected(dashboard);
                } else {
                    dashboardService
                        .getDashboardById(dashboard._id)
                        .then(function (ds) {
                            dashboard = $scope.appendModifyable(ds);
                            dashboard.isAllSegment = tempAllSegment;

                            angular.forEach(
                                $rootScope.allDashboards[dashboard.collections[0]], function(dashboardObj, index) {
                                    if (dashboardObj._id === dashboard._id) {
                                        $rootScope.allDashboards[dashboard.collections[0]][index] =
                                            angular.copy(dashboard);
                                        $rootScope.allDashboards[dashboard.collections[0]][index].fetched = true;
                                        angular.forEach($rootScope.dashboards, function(refObj, refIndex) {
                                            if (refObj._id === dashboard._id) {
                                                $rootScope.dashboards[refIndex] =
                                                    $rootScope.allDashboards[dashboard.collections[0]][index];
                                                $rootScope.selectedDashboard = $rootScope.dashboards[refIndex];
                                                $rootScope.appName = $rootScope.selectedDashboard.title;
                                            }
                                        });
                                    }
                                }
                            );
                            $scope.doActionAfterDashboardSelected(dashboard);
                        });
                }
            };
            $scope.clearDashboard = function() {
                $rootScope.appName = '';
                if ($scope.checkRemoved) {
                    $rootScope.selectedDashboard = null;
                } else {
                    $rootScope.selectedDashboard = {};
                }
            };

            $scope.doActionAfterDashboardSelected = function(dashboard) {
                dashboardService.getDashboardMetrics(dashboard).then(function (metrics) {
                    $rootScope.selectedDashboardMetrics = metrics;
                });

                $rootScope.$broadcast('selectedDashboardChanged', {});
            };

            $scope.getChartInfo = function(widget) {
                var chartDoc = angular.element(document.querySelector('.ds-widget-content-' + widget._id))[0].
                    innerHTML;
                var svgWidth = angular.element(document.querySelector('.ds-widget-content-' + widget._id)).
                    width();
                var svgHeight = angular.element(document.querySelector('.ds-widget-content-' + widget._id)).
                    height() + 50;

                if (widget.type === $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Timeline) {
                    chartDoc = '<div class="ds-timeline-widget">' + chartDoc + '</div>';
                } else if (widget.type === $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Pie) {
                    // svgWidth = angular.element(document.querySelector('#pie-widget-'+widget._id+'-0')).
                    //     width();
                    chartDoc = '<div class="ds-pie-widget" style="margin-bottom: 80px; margin-top: -50px;">' +
                        chartDoc + '</div>';
                } else if (widget.type === $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Bar) {
                    chartDoc = '<div class="ds-bar-widget" style="float:none; width:auto">' + 
                        chartDoc + '</div>';
                } else if (widget.type === $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                    var classStr = 'ds-equivalencies-widget ' + widget.drawInfo.class;
                    if (widget.isGreenView) {
                        classStr += ' ds-equivalencies-widget-container-green';
                    }
                    chartDoc = '<div class="ds-equivalencies-widget-container">' +
                        '<div class="' + classStr + '"><h4>' + widget.title + '</h4>' + 
                        '<div class="ds-equivalencies-widget-content">' + chartDoc + '</div></div></div>';
                    var elWidget = angular.element(document.querySelector('.ds-widget-content-' + widget._id));
                    svgWidth = elWidget.parent().parent().width();
                } else if (widget.type === $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Table) {
                    chartDoc = angular.element(document.querySelector('.ds-widget-content-' + 
                        widget._id + ' table.table'))[0].outerHTML;
                    chartDoc = '<div class="ds-table-widget">' + chartDoc + '</div>';
                } else if (widget.type === $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Kpi) {
                    chartDoc = '<div class="ds-kpi-widget">' + chartDoc + '</div>';
                }

                chartDoc = '<div style="margin: 20px auto; width: ' + svgWidth + 'px;">' + 
                    chartDoc + '</div>';
                        
                return {html: chartDoc, width: svgWidth, height: svgHeight};
            };

            /**
             * Decide columns by layoutStyle
             * @param {string} layoutStyle
             * @returns {object}
             */
            $scope.getColumnsByLayoutStyle = function (layoutStyle) {
                if (layoutStyle === 1) {
                    return [
                        {'name': 'column0', 'class': 'col-md-12'}
                    ];
                } else if (layoutStyle === 2) {
                    return [
                        {'name': 'column0', 'class': 'col-md-6'},
                        {'name': 'column1', 'class': 'col-md-6'}
                    ];
                } else if(layoutStyle === 3) {
                    return [
                        {'name' : 'column0', 'class' : 'col-md-3'},
                        {'name' : 'column1', 'class' : 'col-md-3'},
                        {'name' : 'column2', 'class' : 'col-md-3'},
                        {'name' : 'column3', 'class' : 'col-md-3'}
                    ];
                } else if(layoutStyle === 4) {
                    return [
                        {'name' : 'column0', 'class' : 'col-md-4'},
                        {'name' : 'column1', 'class' : 'col-md-8'}
                    ];
                } else if(layoutStyle === 5) {
                    return [
                        {'name' : 'column0', 'class' : 'col-md-3'},
                        {'name' : 'column1', 'class' : 'col-md-6'},
                        {'name' : 'column2', 'class' : 'col-md-3'}
                    ];
                } else if(layoutStyle === 6) {
                    return [
                        {'name' : 'column0', 'class' : 'col-md-8'},
                        {'name' : 'column1', 'class' : 'col-md-4'}
                    ];
                }

                // return columns of layoutStyle 2
                return [
                    {'name': 'column0', 'class': 'col-md-6'},
                    {'name': 'column1', 'class': 'col-md-6'}
                ];
            };

            $scope.downloadDashboardPdf = function(downloadCallback) {
                $scope.downloadCaption = 'Downloading...';

                var exportData = {
                    'title': '<h1>' + $rootScope.selectedDashboard.title + '</h1>',
                    'chart': '',
                    'widgets': [],
                    'dateRange': '<h5>' + moment.utc($rootScope.selectedDashboard.startDate).format('MMM DD YYYY') + 
                        ' - ' + moment.utc($rootScope.selectedDashboard.endDate).format('MMM DD YYYY') + '</h5>'
                };
                var exportFile = encodeURI($rootScope.selectedDashboard.title + '_' + (new Date()).getTime());
                var columnsInfo = $scope.getColumnsByLayoutStyle($rootScope.selectedDashboard.layout.selectedStyle);
                var dashboardDoc = '<div class="wrapper"><div class="row">';
                
                angular.forEach(columnsInfo, function(columnInfo) {
                    dashboardDoc += '<div id="' + columnInfo.name + '" class="drop-container ' + columnInfo.class +
                        '" style="position: relative;">';
                    
                    angular.forEach($rootScope.selectedDashboardColumnWidgets[columnInfo.name], function(columnWidget) {
                        if(columnWidget.type !== $rootScope.consts.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                            dashboardDoc += '<h6>' + columnWidget.title + '</h6>';
                        }
                        dashboardDoc += '<div class="widget-drag widget-container clear-fix" id="widget-container-' +
                            columnWidget._id + '">WIDGET_IMG_' + columnWidget._id + '</div>';
                        var widgetInfo = $scope.getChartInfo(columnWidget);
                        widgetInfo.key = 'WIDGET_IMG_' + columnWidget._id;
                        exportData.widgets.push(widgetInfo);
                    });
                    dashboardDoc += '</div>';
                });
                
                dashboardDoc += '</div></div>';
                exportData.chart = dashboardDoc;

                dashboardService.exportDashboard($rootScope.selectedDashboard._id, exportData, exportFile,
                    function(err, message) {
                        if(downloadCallback) {
                            downloadCallback(err, message);
                        }
                        else {
                           if (message) {
                                $rootScope.selectedDashboard.exportedResourceUrl = message.exportedResourceUrl;
                                $timeout(function() {
                                    angular.element(document.querySelector('.exported-dashboard-' +
                                        $rootScope.selectedDashboard._id))[0].click();
                                }, 0);
                            } else {
                                notyfy({
                                    text: '<strong>Error occurred while trying to save exported document. ' +
                                        'Please try again later.</strong><br><div class="click-close">' +
                                        '{Click this bar to Close}',
                                    type: 'error',
                                    dismissQueue: true
                                });
                            }

                            $scope.downloadCaption = 'Download PDF';
                            $scope.togglePanel = false;
                        }
                    });
            };

            //SHARE
            $scope.sendLink = function(event) {
                if($scope.shareInfo.sending) {
                    return false;
                }

                var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                var message = '';
                var subject = 'Brightergy Dashboard';
                
                if(!$scope.shareInfo.email || $scope.shareInfo.email === undefined) {
                    $scope.shareInfo.emailError = 'Email required';
                    return false;
                }
                else if(!pattern.test($scope.shareInfo.email)) {
                    $scope.shareInfo.emailError = 'Invaild Email';
                    return false; 
                } else {
                    $scope.shareInfo.emailError = '';
                }
                if ($scope.shareInfo.subject){
                    subject = $scope.shareInfo.subject;
                }
                if ($scope.shareInfo.message){
                    message = $scope.shareInfo.message;
                }
                $scope.shareInfo.sending = true;

                var jsonData = {
                    'email' : $scope.shareInfo.email,
                    'link' : $scope.dashboardLink,
                    'subject' : subject,
                    'message' : message,
                    'dashboardTitle' : $rootScope.selectedDashboard.title
                };
                
                var sendLinkCallback = function(linkData) {
                    dashboardService
                        .sendDashboardLinkEmail(linkData).then(function() {
                            notifyService.successNotify('Successfully sent dashboard link! Please check your email.');
                            //$scope.toggleSharePanel(event);
                            $scope.togglePanel = false;
                            $scope.shareInfo.sending = false;
                        }, function(error) {
                            notifyService.errorNotify(error);
                            $scope.shareInfo.sending = false;
                        });
                };

                if($scope.shareInfo.withPDF) {
                    $scope.downloadDashboardPdf(function (downloadErr, downloadPDF) {
                        if(downloadPDF) {
                            jsonData.pdfPath = downloadPDF.exportedPath;
                            sendLinkCallback(jsonData);
                        }
                        else {
                            notyfy({
                                text: '<strong>Error occurred while trying to save exported document. ' +
                                    'Please try again later.</strong><br><div class="click-close">' +
                                    '{Click this bar to Close}',
                                type: 'error',
                                dismissQueue: true
                            });
                        }
                    });
                }
                else {
                    sendLinkCallback(jsonData);
                }
            };

            $scope.embedWebpage = function(){
                var embedPageLink = $location.protocol() + '://' + $location.host() + ':' +
                        $location.port() + '/commondashboard#!/' + $rootScope.selectedDashboard._id;
                $rootScope.embedDashboardHtml = '<iframe src="' + embedPageLink + 
                        '" width="1200" height="800" scrolling="yes" frameborder="0" />';
                $rootScope.embedDialogShow = true;
            };
            //END SHARE

            //when click dashboard, render dashboard
            $scope.routerDashboard = function(dashboardId, event) {
                if ($rootScope.selectedDashboard._id === dashboardId) {
                    $scope.renderDashboard();
                } else {
                    if((event.metaKey || event.ctrlKey)
                    && ($scope.pressedKeyCode === 17 || $scope.pressedKeyCode === 91)) {
                        var openUrl = $location.absUrl();
                        openUrl = openUrl.replace($location.url(), '/' + dashboardId);

                        window.open(openUrl);
                    }
                    else {
                        $location.path('/' + dashboardId).replace();
                    }
                }
            };

            $scope.toggleSharePanel = function(event) {
                $scope.dashboardLink = $location.protocol() + '://' + $location.host() + ':' +
                    $location.port() + '/datasense#!/' + $rootScope.selectedDashboard._id;
                if ($scope.togglePanel){
                    $scope.copyLabel = '';
                    $scope.shareInfo = {};
                }
                $scope.togglePanel = !($scope.togglePanel);
                $rootScope.embedDialogShow = false;
                $rootScope.embedDashboardHtml = '';
                event.stopPropagation();
            };

            window.onkeydown = function(event) {
                var keyCode = event.keyCode ? event.keyCode: event.which;
                $scope.pressedKeyCode = keyCode;
            };
            window.onkeyup = function(event) {
                $scope.pressedKeyCode = null;
            };
            $scope.copyLink = function() {
                $scope.copyLabel = 'Copied!';
            };
            window.onclick = function(event) {
                var parent = event.srcElement;
                var inClick = false;
                if (parent) {
                    while (parent.parentElement) {
                        parent = parent.parentElement;
                        if (parent.localName === 'share-dialog') {
                            inClick = true;
                            event.stopPropagation();
                            break;
                        }
                    }
                }
                if ($scope.togglePanel && !inClick) {
                    $scope.togglePanel = false;
                    $rootScope.embedDialogShow = false;
                    $scope.$apply();
                    $scope.copyLabel = '';
                    $rootScope.embedDashboardHtml = '';
                }
            };

            $scope.$on('updateSegments', function(message, options) {
                //console.log('[DATA SENSE] Accepted updateSegments signal');

                $scope.segments = options.segments;
                $scope.isAllSegment = options.isAllSegment;

                if ($scope.selectedDashboard) {
                    $scope.selectedDashboard.segments = $scope.segments;
                }
                //$scope.$apply();
            });

            $scope.$on('renderDashboard', function(message, options) {
                $scope.renderDashboard();
            });

            $scope.$on('updateUserCollections', function(message, options) {
                var userCollections = angular.copy($rootScope.orderedDashboards);
                var dsIds = [];

                angular.forEach(userCollections, function (collection, colIdx) {
                    delete collection.collection;
                    dsIds = [];
                    angular.forEach(collection.dashboards, function (ds, dsIdx) {
                        dsIds.push(ds.dashboard._id); 
                    });

                    collection.dashboards = dsIds;
                });

                if ($rootScope.currentUser) {
                    $rootScope.currentUser.collections = userCollections;
                    UserService.updateUser({user: $rootScope.currentUser}).then(function (result) {
                        console.log('User collections have been changed successfully!');
                    }, function (err) {
                        console.log('User collections have been failed to save for reason - ', err);
                    });
                }
                
            });

            $scope.init(renderErrors, renderPermissions, renderCurrentUser, renderDashboards);
        }
    ]);
