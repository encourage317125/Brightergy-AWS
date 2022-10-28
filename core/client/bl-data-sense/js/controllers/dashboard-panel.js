'use strict';
angular.module('blApp.dataSense.controllers')
    .controller('DashboardPanelCtrl',
        ['$scope', '$rootScope', '$uibModal', '$timeout', 'dashboardService', 'presentationService', 'toggleService',
        function ($scope, $rootScope, $uibModal, $timeout, dashboardService, presentationService, toggleService) {
            $scope.userInputSearchDashboards = '';
            $scope.reallyDelete = false;
            $scope.addStarterDashboard = true;
            $scope.reordering = false;
            $scope.sortDashboards = [];
            $scope.sortingLog = [];

            /*
             * Make sortable dashboards
             */
            $scope.showSortableDashboards = function () {
                $scope.reordering = true; 
                $scope.sortDashboards = angular.copy($rootScope.orderedDashboards);

                $scope.sortableOptions = {
                    connectWith: '.sort-list.collections',
                    placeholder: 'ds-panel-placeholder',
                    update: function(e, ui) {
                        if(ui.item.scope() === undefined) {
                            return;
                        }
                        else {
                            var dropTarget = ui.item.sortable.droptarget;

                            if(ui.item.scope().dashboard) {
                                if(angular.element(dropTarget).hasClass('collections')) {
                                    // cancel if dashboard moves to collections list
                                    ui.item.sortable.cancel();    
                                }
                                /*
                                else if(ui.item.sortable.dropindex === 0) {
                                    // cancel if dashboard moves to top
                                    ui.item.sortable.cancel();
                                }
                                */
                            }
                            else if(ui.item.scope().collection) {
                                if(angular.element(dropTarget).hasClass('dashboards')) {
                                    // cancel if collection moves to dashboards list
                                    ui.item.sortable.cancel();    
                                }
                            }
                        }
                        
                    },
                    stop: function(e, ui) {
                        //console.log('stop', $scope.sortDashboards);
                    }
                };
            };

            $scope.applyReordering = function () {
                $rootScope.orderedDashboards = angular.copy($scope.sortDashboards);
                $scope.reordering = false;

                $scope.$emit('updateUserCollections', {});
            };

            $scope.cancelReordering = function () {
                $scope.reordering = false; 
            };

            // Check if a dashboard is currently selected, used for active class in the dashboard menu
            $scope.isSelectedDashboard = function (dashboard) {
                if ($rootScope.selectedDashboard !== null) {
                    if (dashboard._id === $rootScope.selectedDashboard._id) {
                        return true;
                    }
                }
                return false;
            };

            /*$scope.isDashboardInCollection = function (dashboard, collectionTitle) {
             if (dashboard !== null) {
             if (dashboard.collections[0] === collectionTitle)
             return true;
             }
             return false;
             };*/

            $scope.closeActionsDropdown = function (evt) {
                if (!evt) {
                    return;
                }
                var dropDownObj = $(evt.target).closest('.nav-second-level-item').find('.ds-lmenu-actions').
                    data('$dropdownController');
                if (dropDownObj) {
                    dropDownObj.toggle(false);
                }
            };

            // Create a new dashboard with the title and collectionName entered in the modal.
            $scope.addDashboard = function(inputJson) {
                dashboardService.createDashboard(inputJson.dashboardObj).then(function (newDashboard) {
                    $rootScope.selectedDashboard = newDashboard;
                    newDashboard.modifyable = true;

                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                    toggleService.hidePleaseWait();
                    
                    var isCollectionExists = false;
                    angular.forEach($rootScope.allDashboards, function (collection, key) {
                        if (key === newDashboard.collections[0]) {
                            collection.push(newDashboard);
                            $rootScope.dashboards[$rootScope.dashboards.length] = collection[collection.length - 1];
                            isCollectionExists = true;
                        }
                    });
                    // If the new collectionName does not exist in the collections, create a new one and
                    //  add the new dashboard to it.
                    if (!isCollectionExists) {
                        $rootScope.collectionNames.push(newDashboard.collections[0]);
                        $rootScope.allDashboards[newDashboard.collections[0]] = [newDashboard];
                        $rootScope.dashboards[$rootScope.dashboards.length] =
                            $rootScope.allDashboards[newDashboard.collections[0]][0];
                    }

                    // add dashboard to ordered list
                    angular.forEach($rootScope.orderedDashboards, function (collection, key) {
                        if (collection.text === newDashboard.collections[0]) {
                            collection.dashboards.push({
                                'text': newDashboard.title,
                                'collection': false,
                                'dashboard': newDashboard
                            });
                            isCollectionExists = true;
                        }
                    });
                    if (!isCollectionExists) {
                        var newCollection = {
                            'text': newDashboard.collections[0],
                            'collection': true,
                            'dashboards': []
                        };
                        newCollection.dashboards.push({
                            'text': newDashboard.title,
                            'collection': false,
                            'dashboard': newDashboard
                        });
                        $rootScope.orderedDashboards.push(newCollection);
                    }

                    $scope.$emit('updateUserCollections', {});

                    $scope.goToDashboard($rootScope.dashboards[$rootScope.dashboards.length - 1], true);
                });
            };


            // Updates the selected dashboard with the title and collectionName entered in the modal.
            $scope.updateDashboard = function(inputJson) {
                var oldCollectionName = inputJson.oldCollectionName;
                dashboardService.updateDashboard(inputJson.dashboardObj).then(function (updateDashboard) {
                    toggleService.hidePleaseWait();
                    var currentDashboard = null;
                    var updateCollection = updateDashboard.collections[0];
                    updateDashboard.modifyable = true;

                    angular.forEach($rootScope.allDashboards, function(dashboards, collectionName) {
                        angular.forEach(dashboards, function(dashboard, idx) {
                            if (dashboard._id === updateDashboard._id) {
                                currentDashboard = dashboard;
                            }
                        });
                    });

                    if (currentDashboard === null) {
                        return false;
                    }

                    // If the selected dashboard has a new collection inputted, change its collection
                    if (currentDashboard.collections.length < 1 || oldCollectionName !== updateCollection) {
                        var idxOfAllDashboards = -1;
                        var idxOfCollections = -2;
                        angular.forEach($rootScope.allDashboards[oldCollectionName], function (dashboard, i) {
                            if (dashboard._id === currentDashboard._id) {
                                idxOfAllDashboards = i;
                            }
                        });
                        // Remove the updated dashboard from the previous collection,
                        //  if the previous collection has no dashboard, delete that collection
                        if (idxOfAllDashboards > -1) {
                            $rootScope.allDashboards[oldCollectionName].splice(idxOfAllDashboards, 1);
                            if ($rootScope.allDashboards[oldCollectionName].length === 0) {
                                delete $rootScope.allDashboards[oldCollectionName];
                                idxOfCollections = $rootScope.collectionNames.indexOf(oldCollectionName);
                                $rootScope.collectionNames.splice(idxOfCollections, 1);
                            }
                        }
                        // Insert the updated dashboard into the new collection
                        if (typeof $rootScope.allDashboards[updateCollection] === 'undefined') {
                            $rootScope.collectionNames.push(updateCollection);
                            $rootScope.allDashboards[updateCollection] = [currentDashboard];
                        } else {
                            $rootScope.allDashboards[updateCollection].push(currentDashboard);
                        }
                    }

                    //reorder dashboards
                    if(oldCollectionName !== updateCollection) {
                        // remove from old collection dashboards
                        var colIdx = -1, dsIdx = -1;
                        angular.forEach($rootScope.orderedDashboards, function(collection, i) {
                            if (collection.text === currentDashboard.collections[0]) {
                                colIdx = i;
                                angular.forEach(collection.dashboards, function(ds, j) {
                                    if(ds.dashboard._id === currentDashboard._id) {
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

                        // add to new
                        var isCollectionExists = false;
                        angular.forEach($rootScope.orderedDashboards, function (collection, key) {
                            if (collection.text === updateCollection) {
                                collection.dashboards.push({
                                    'text': updateDashboard.title,
                                    'collection': false,
                                    'dashboard': updateDashboard
                                });
                                isCollectionExists = true;
                            }
                        });
                        if (!isCollectionExists) {
                            var newCollection = {
                                'text': updateCollection,
                                'collection': true,
                                'dashboards': []
                            };
                            newCollection.dashboards.push({
                                'text': updateDashboard.title,
                                'collection': false,
                                'dashboard': updateDashboard
                            });
                            $rootScope.orderedDashboards.push(newCollection);
                        }
                    }
                    else {
                        angular.forEach($rootScope.orderedDashboards, function (collection, key) {
                            if (collection.text === updateCollection) {
                                angular.forEach(collection.dashboards, function (ds, d) {
                                    if(ds.dashboard._id === currentDashboard._id) {
                                        ds.dashboard = updateDashboard;
                                        ds.text = updateDashboard.title;
                                    }
                                });
                            }
                        });
                    }

                    $scope.$emit('updateUserCollections', {});

                    // Updates the selected dashboard's title and collection name
                    // Change the app name in the navigation bar
                    currentDashboard.title = updateDashboard.title;
                    currentDashboard.isPrivate = updateDashboard.isPrivate;
                    currentDashboard.default = updateDashboard.default;
                    currentDashboard.collections = [updateCollection];
                    $rootScope.appName = $rootScope.selectedDashboard.title;
                });
            };

            $scope.openDashboardDialog = function (selectedDashboard, evt) {
                var modalInstance;
                
                dashboardService.getAllCollections().then(function (allCollections) {
                    if (selectedDashboard) {
                        var userRole = $rootScope.currentUser.role;
                        // User can update selected dashboard
                        if ((userRole === 'BP') || (userRole === 'Admin' && selectedDashboard.creatorRole !== 'BP')
                            || (selectedDashboard.creatorRole === 'TM'
                            && selectedDashboard.creator === $rootScope.currentUser._id)) {
                            //$scope.closeActionsDropdown(evt);
                                    
                            modalInstance = $uibModal.open({
                                templateUrl: 'modalDashboardUpdate.html',
                                controller: 'DashboardUpdateController',
                                windowClass: 'bl-modal-dashboard-update-wrapper',
                                backdrop: 'false',
                                resolve: {
                                    'allCollections': function() {
                                        return allCollections;
                                    },
                                    'selectedDashboard': function () {
                                        return selectedDashboard;
                                    }
                                }
                            });

                            // Remove animation and position the modal next to edit dashboard button
                            modalInstance.opened.then(function() {
                                $timeout(function() {
                                    var btnDom = $(evt.target).closest('.nav-second-level-item'),
                                        modalDom = $('.bl-modal-dashboard-update-wrapper .modal-dialog'),
                                        offset = btnDom.offset();

                                    modalDom.css('position', 'absolute');
                                    modalDom.css('left', offset.left + btnDom.width() + 30);
                                    modalDom.css('top', 140);
                                });
                            });
                        } else { // Do not have permission
                            console.error(' ** FAIL ON UPDATE DASHBOARD - no permission ** ');
                            return;
                        }
                    } else {
                        modalInstance = $uibModal.open({
                            templateUrl: 'modalDashboardUpdate.html',
                            controller: 'DashboardUpdateController',
                            windowClass: 'bl-modal-dashboard-update-wrapper',
                            resolve: {
                                'allCollections': function() {
                                    return allCollections;
                                },
                                'selectedDashboard': null
                            }
                        });

                        // Remove animation and position the modal below add dashboard button
                        modalInstance.opened.then(function() {
                            $timeout(function() {
                                var btnDom = $(evt.target).closest('button'),
                                    modalDom = $('.bl-modal-dashboard-update-wrapper .modal-dialog'),
                                    offset = btnDom.offset(),
                                    marginTop =  parseFloat(modalDom.css('margin-top'));

                                modalDom.css('position', 'absolute');
                                modalDom.css('left', offset.left);
                                modalDom.css('top', offset.top + btnDom.outerHeight() - marginTop);
                            });
                        });
                    }

                    modalInstance.result.then(function(inputJson) {
                        toggleService.showPleaseWait();
                        if (inputJson.isEditMode) {
                            $scope.updateDashboard(inputJson);
                        } else {
                            $scope.addDashboard(inputJson);
                        }
                    }, function() {
                        console.log('[DATA SENSE] Dashboard Modal Dismissed.');
                    });
                });
            };

        }
    ]);

angular.module('blApp.dataSense.controllers')
    .controller('AccorionItemCtrl', ['$scope', '$rootScope', '$stateParams',
        function ($scope, $rootScope, $stateParams) {
            if ($rootScope.selectedDashboardId !== '') {
                var selectedDashboardCollectionName = '';
                angular.forEach($rootScope.dashboards, function(ds, idx) {
                    if (ds._id === $rootScope.selectedDashboardId) {
                        selectedDashboardCollectionName = ds.collections[0];
                    }
                });
                $scope.$parent.isopen = (selectedDashboardCollectionName === $scope.collection.text);
            }
            $scope.$watch('isopen', function(newvalue, oldvalue, scope) {
                scope.$parent.isopen = newvalue;
            });
            $scope.$on('collapseDashboardSidebar', function(message, options) {
                if (options.collectionName === $scope.collection.text) {
                    $scope.isopen = true;
                }
            });
        }
    ]);
