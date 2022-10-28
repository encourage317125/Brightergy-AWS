'use strict';

angular.module('blApp.management.controllers').controller(
    'AvailableWidgetController',
        ['$scope', '$rootScope', '$compile', '$http', '$timeout', 'widgetService', 'toggleService', 'PRESENT_CONFIG',
        function ($scope, $rootScope, $compile, $http, $timeout, widgetService, toggleService, PRESENT_CONFIG) {
            $scope.imgUrl = $rootScope.baseCDNUrl + '/bl-bv-management/assets/img/';
            
            // shuffle array
            $scope.shuffle= function (o) {
                var c = angular.copy(o);
                var j, x, i = c.length;
                while (i) {
                    j = Math.floor(Math.random() * i);
                    i--;
                    x = c[i];
                    c[i] = c[j];
                    c[j] = x;
                }
                return c;
            };

            $scope.getWidgetTypeColors = function (colorReturned) {
                //Generate colors Randomly: Following statement should be replaced with random color generating.....
                var colors = [{'primaryColor': 'ae93c6', 'secondaryColor': '82489c'}, {
                    'primaryColor': '98a3d0',
                    'secondaryColor': '5163ad'
                }, {'primaryColor': '93c9ed', 'secondaryColor': '0095cf'}, {
                    'primaryColor': '9bd3d0',
                    'secondaryColor': '28b1b4'
                }, {'primaryColor': 'b4e0bd', 'secondaryColor': '68bf7a'}, {
                    'primaryColor': 'dee9a5',
                    'secondaryColor': '98ca57'
                }, {'primaryColor': 'fff6ab', 'secondaryColor': 'e5d944'}, {
                    'primaryColor': 'fde8a5',
                    'secondaryColor': 'e2b93b'
                }, {'primaryColor': 'fdcda5', 'secondaryColor': 'e4984a'}, {
                    'primaryColor': 'fcbba7',
                    'secondaryColor': 'e87356'
                }, {'primaryColor': 'fbb3bf', 'secondaryColor': 'eb617b'}, {
                    'primaryColor': 'e1a3ca',
                    'secondaryColor': 'cf5ba2'
                }];
                var randColors = [],
                    returns = [];
                for (var idx = 0; idx < colorReturned; idx++) {
                    if (randColors.length < 1){
                        randColors = $scope.shuffle(colors);
                    }
                    returns.push(randColors.pop());
                }
                return returns;

            };

            $scope.init = function (availableWidgets) {
                if($rootScope.isAdmin) {
                    $rootScope.selectedAccountId = $rootScope.currentUser.accounts[0];
                }
                $rootScope.retrieveAllImagesInFolder(null, 'general');

                var colors = $scope.getWidgetTypeColors(availableWidgets.length);
                for (var i = 0; i < availableWidgets.length; i++) {
                    availableWidgets[i].used = {};
                    availableWidgets[i].used.instanceNumber = 0;
                    availableWidgets[i].parameters.widgetRandomColor = colors[i].primaryColor;
                    availableWidgets[i].parameters.widgetBorderColor = colors[i].secondaryColor;
                }
                $rootScope.dynamicWidgets = availableWidgets;
            };

            $scope.saveAvailableWidget = function (widgetId, row, col) {
                $timeout(function(){
                    $rootScope['widgetParam'] = {};
                    var widgetParam = $.grep($rootScope['dynamicWidgets'], function(e) {
                        if (e._id.toString() === widgetId.toString()) {
                            e.used.instanceNumber++;
                            return true;
                        } else {
                            return false;
                        }
                    })[0];

                    widgetParam.availableWidgetId = widgetParam._id;
                    widgetParam.presentation = $rootScope.presentationDetails;
                    /*angular.copy(widgetParam, $rootScope['widgetParam']);*/
                    delete widgetParam._id;
                    //Yakov

                    angular.extend(widgetParam.parameters, {
                        'previousTimelineRowPosition': -1,
                        'resizedOnTimeline': false,
                        // set position for widget
                        'rowPosition': parseInt(row),
                        'colPosition': parseInt(col),
                        'rowCount': parseInt(widgetParam.parameters.rowCount),
                        'colCount': parseInt(widgetParam.parameters.colCount),
                        'left': col * PRESENT_CONFIG.GridWidth + col - 1,
                        'top': row * PRESENT_CONFIG.GridHeight  + row + 2,
                        'height': PRESENT_CONFIG.GridHeight * parseInt(widgetParam.parameters.rowCount) +
                                  parseInt(widgetParam.parameters.rowCount) - 1,
                        'width': PRESENT_CONFIG.GridWidth * parseInt(widgetParam.parameters.colCount) +
                                 parseInt(widgetParam.parameters.colCount) - 1

                    });

                    //set start point for widget
                    var startPointMin = $('.timenav-line').attr('minute');
                    var startPointSecond = $('.timenav-line').attr('second');
                    var startPoint = startPointMin ? [startPointMin, startPointSecond].join(':') : '00:00';

                    angular.extend(widgetParam.parameters, {
                        'startDate': startPoint,
                        // control standard parameter
                        'top': widgetParam.parameters.rowPosition * PRESENT_CONFIG.GridHeight +
                               widgetParam.parameters.rowPosition + 2,
                        'left': widgetParam.parameters.colPosition * PRESENT_CONFIG.GridWidth +
                                widgetParam.parameters.colPosition - 1
                    });


                    if (PRESENT_CONFIG.GridRowCnt < widgetParam.parameters.rowPosition
                                                    + widgetParam.parameters.rowCount) {
                        angular.extend(widgetParam.parameters, {
                            'rowPosition': PRESENT_CONFIG.GridRowCnt - widgetParam.parameters.rowCount,
                            'top': PRESENT_CONFIG.GridHeight * widgetParam.parameters.rowPosition +
                                   widgetParam.parameters.rowPosition + 2
                        });
                    }

                    if (PRESENT_CONFIG.GridColCnt < widgetParam.parameters.colPosition
                                                    + widgetParam.parameters.colCount) {
                        angular.extend(widgetParam.parameters, {
                            colPosition: PRESENT_CONFIG.GridColCnt - widgetParam.parameters.colCount,
                            left: widgetParam.parameters.colPosition * PRESENT_CONFIG.GridWidth +
                                  widgetParam.parameters.colPosition - 1
                        });
                    }

                    if (widgetParam.name === 'Energy Equivalencies') {
                        widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-cars.png';
                    }

                    angular.copy(widgetParam, $rootScope['widgetParam']);
                    $rootScope.widgets.push(widgetParam);

                    toggleService.togglePleaseWait();
                    widgetService.saveWidget($rootScope.presentationId, $rootScope['widgetParam'], false, $rootScope);
                    //widgetService.getTimelineInfo($rootScope.presentationId, 'save', $compile,  $scope, false,
                    // new_widget_id);
                }, 10);
            };

            $scope.init(renderAvailableWidgets);
        }
    ]);