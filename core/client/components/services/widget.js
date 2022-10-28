'use strict';

angular.module('blApp.components.services')
    .service('widgetService', ['$http', '$compile', 'toggleService',
        function($http, $compile, toggleService) {

            // shuffle array
            function shuffle(o) {
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
            }

            function getWidgetTypeColors(colorReturned) {
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
                        randColors = shuffle(colors);
                    }
                    returns.push(randColors.pop());
                }
                return returns;

            }

            this.getAvailableWidgets = function (scope) {
                var apiUrl = '/present/presentations/widgets/available';
                return $http
                    .get(apiUrl)
                    .then(function (availableWidgets) {
                        var colors = getWidgetTypeColors(availableWidgets.length);

                        for (var i = 0; i < availableWidgets.length; i++) {
                            availableWidgets[i].used = {};
                            availableWidgets[i].used.instanceNumber = 0;
                            availableWidgets[i].parameters.widgetRandomColor = colors[i].primaryColor;
                            availableWidgets[i].parameters.widgetBorderColor = colors[i].secondaryColor;
                        }
                        scope.dynamicWidgets = availableWidgets;
                        console.log('Available Widgets', availableWidgets);
                        return availableWidgets;
                    });
            };

            this.getWidgetsInfo = function (presentationId, flag, scope) {
                scope.componentsWidget = false;
                var apiUrl = '/present/presentations/' + presentationId + '/widgets';
                return $http
                    .get(apiUrl)
                    .then(function (widgets) {
                        for (var i = 0; i < widgets.length; i++) {
                            for (var j = 0; j < scope.dynamicWidgets.length; j++) {
                                if (widgets[i].name === scope.dynamicWidgets[j].name) {
                                    //Yakov
                                    scope.dynamicWidgets[j].used.instanceNumber++;
                                    widgets[i].parameters.widgetRandomColor =
                                        scope.dynamicWidgets[j].parameters.widgetRandomColor;
                                    widgets[i].parameters.widgetBorderColor =
                                        scope.dynamicWidgets[j].parameters.widgetBorderColor;
                                    break;
                                }
                            }
                        }
                        scope.getWidgetsInfo2(widgets);
                        //scope.$apply(); Need recheck
                    });
            };

            this.getTimelineInfo = function (presentationId, type, complie, scope, preview, widgetId) {
                var apiUrl = '/present/presentations/' + presentationId + '/timeline';
                return $http
                    .get(apiUrl)
                    .then(function (timelineDatas) {
                        if (timelineDatas.timeline && timelineDatas.timeline.date) {
                            for (var i = 0; i < timelineDatas.timeline.date.length; i++) {
                                for (var j = 0; j < scope.dynamicWidgets.length; j++) {
                                    if (timelineDatas.timeline.date[i].availableWidgetId ===
                                        scope.dynamicWidgets[j]._id) {
                                        timelineDatas.timeline.date[i].backgroundColor =
                                            scope.dynamicWidgets[j].parameters.widgetRandomColor;
                                        break;
                                    }
                                }
                            }
                        }
                        scope.timelineDatas = timelineDatas;
                        if (timelineDatas.length === 0) {
                            //$('#timeline-embed').html('');
                            timelineDatas = {
                                'timeline': {
                                    'type': 'default',
                                    'text': 'default',
                                    'startDate': '2014,2,18,9,0,0',
                                    'headline': 'default',
                                    'date': []
                                }
                            };
                        }
                        console.log('Timeline Datas', timelineDatas);
                        console.log(timelineDatas);
                        switch (type) {
                            case 'init':
                                var timelineConfig = {
                                    'width': 1124,
                                    'height': 220,
                                    'debug': true,
                                    'source': timelineDatas,
                                    'start_zoom_adjust': '5',
                                    'start_at_slide': '1'
                                };

                                createStoryJS(timelineConfig, complie, scope);
                                break;
                            case 'save':
                                VMM.fireEvent(global, VMM.Timeline.Config.events['data_ready'], timelineDatas);
                                console.log('resize save');
                                var buildMarkers = timenav.getMarkers();
                                console.log(buildMarkers);
                                console.log('new widget id');
                                console.log(widgetId);
                                var openedWidgetNumber = 0;
                                for (var bmi = 0; bmi < buildMarkers.length; bmi++) {
                                    if (buildMarkers[bmi].widgetid === widgetId) {
                                        openedWidgetNumber = bmi;
                                    }
                                }
                                if (openedWidgetNumber > 0) {
                                    timenav.setMarker(openedWidgetNumber, 'easeInOutExpo', 1000);
                                }

                                if (preview === false) {
                                    toggleService.togglePleaseWait();
                                }
                                break;
                            case 'delete':
                                if (window.createStoryJSParams.isInited) {
                                    VMM.fireEvent(global, VMM.Timeline.Config.events['data_ready'], timelineDatas);
                                } else {
                                    window.createStoryJSParams.callbacks.push(function () {
                                        VMM.fireEvent(global, VMM.Timeline.Config.events['data_ready'], timelineDatas);
                                    });
                                }
                                if (preview === false) {
                                    toggleService.togglePleaseWait();
                                }
                                break;
                        }
                    });
            };

            function saveWidgetsPositionInTimeline(widget, scope) {
                var buildMarkers = timenav.getMarkers();
                var openedWidgetNumber = 0;
                for (var bmi = 2; bmi < buildMarkers.length; bmi++) {
                    if (buildMarkers[bmi].widgetid === widget._id) {
                        openedWidgetNumber = bmi;
                    }
                    var widgetNewParam = {};
                    widgetNewParam._id = buildMarkers[bmi].widgetid;

                    widgetNewParam.parameters = {};
                    widgetNewParam.parameters.previousTimelineRowPosition = -1;
                    widgetNewParam.parameters.resizedOnTimeline = false;
                    widgetNewParam.parameters.timelineRowPosition = buildMarkers[bmi]['track_row'];
                    var apiUrl = '/present/presentations/widgets/' + widgetNewParam._id;
                    $http
                        .put(apiUrl, widgetNewParam)
                        .then(function (updatedWidget) {
                            angular.forEach(scope.widgets, function (w) {
                                if (w._id === updatedWidget._id) {
                                    angular.extend(w.parameters, {
                                        previousTimelineRowPosition:
                                          updatedWidget.parameters.previousTimelineRowPosition,
                                        timelineRowPosition: updatedWidget.parameters.timelineRowPosition
                                    });
                                }
                            });

                            angular.forEach(scope.timelineDatas.timeline.date, function (obj) {
                                if (obj.widgetId === updatedWidget._id) {
                                    angular.extend(obj, {
                                        previousTimelineRowPosition:
                                            updatedWidget.parameters.previousTimelineRowPosition,
                                        resizedOnTimeline: updatedWidget.parameters.resizedOnTimeline,
                                        timelineRowPosition: updatedWidget.parameters.timelineRowPosition
                                    });
                                }
                            });
                            /*$.each(scope.widgets, function (idx, obj) {
                                if (obj._id === updatedWidget._id) {
                                    scope.widgets[idx].parameters.previousTimelineRowPosition =
                                        updatedWidget.parameters.previousTimelineRowPosition;
                                    scope.widgets[idx].parameters.resizedOnTimeline =
                                        updatedWidget.parameters.resizedOnTimeline;
                                    scope.widgets[idx].parameters.timelineRowPosition =
                                        updatedWidget.parameters.timelineRowPosition;
                                }
                            });*/
                            /*$.each(scope.timelineDatas.timeline.date, function (idx, obj) {
                                if (obj.widgetId === updatedWidget._id) {
                                    scope.timelineDatas.timeline.date[idx].previousTimelineRowPosition =
                                        updatedWidget.parameters.previousTimelineRowPosition;
                                    scope.timelineDatas.timeline.date[idx].resizedOnTimeline =
                                        updatedWidget.parameters.resizedOnTimeline;
                                    scope.timelineDatas.timeline.date[idx].timelineRowPosition =
                                        updatedWidget.parameters.timelineRowPosition;
                                }
                            });*/
                            toggleService.hidePleaseWait();
                        });
                }
                if (openedWidgetNumber > 0){
                    timenav.setMarker(openedWidgetNumber, 'easeInOutExpo', 1000);
                }
            }

            this.saveWidget = function (presentationId, widget, editFlag, scope) {
                /*saveWidgetsPositionInTimeline*/
                var req = {
                    method: widget._id ? 'PUT' : 'POST',
                    url: '/present/presentations/widgets/' + (widget._id || ''),
                    data: widget
                };

                return $http(req)
                    .then(function (updatedWidget) {
                        var firstWidget;
                        console.log('Edit function');
                        if (scope.timelineDatas.timeline.date.length === 0){
                            firstWidget = scope.timelineDatas.timeline.startDate;
                        } else {
                            firstWidget = scope.timelineDatas.timeline.date[0].startDate;
                        }
                        var dateArr = firstWidget.split(',');
                        var startPointArr = updatedWidget.parameters.startDate.split(':');
                        var itemStartPoint = parseInt(startPointArr[0], 10) * 60 + parseInt(startPointArr[1], 10);
                        var itemEndPoint = itemStartPoint + parseInt(updatedWidget.parameters.duration);
                        var endSec = parseInt(itemEndPoint) % 60;
                        var endMin = parseInt(itemEndPoint / 60);
                        var startDate = dateArr[0] + ',' + dateArr[1] + ',' + dateArr[2] + ',' +
                            dateArr[3] + ',' + startPointArr[0] + ',' + startPointArr[1];
                        var endDate = dateArr[0] + ',' + dateArr[1] + ',' + dateArr[2] + ',' +
                            dateArr[3] + ',' + endMin + ',' + endSec;

                        //Yakov
                        var timelineData = {
                            'asset': {},
                            'availableWidgetId': updatedWidget.availableWidgetId,
                            'colPosition': updatedWidget.parameters.colPosition,
                            'endDate': endDate,
                            'headline': updatedWidget.name,
                            'icon': updatedWidget.icon,
                            'backgroundColor': updatedWidget.parameters.widgetRandomColor,
                            'rowPosition': updatedWidget.parameters.rowPosition,
                            'startDate': startDate,
                            'previousTimelineRowPosition': updatedWidget.parameters.previousTimelineRowPosition,
                            'resizedOnTimeline': updatedWidget.parameters.resizedOnTimeline,
                            'timelineRowPosition': updatedWidget.parameters.timelineRowPosition,
                            'widgetId': updatedWidget._id
                        };

                        if (!editFlag) {
                            var length = (scope.widgets).length;
                            scope.widgets[length - 1]._id = updatedWidget._id;
                            scope.widgets[length - 1].parameters.parametersId =
                                updatedWidget.parameters.parametersId;
                            scope.widgets[length - 1].parameters.subHeaderFont.fontId =
                                updatedWidget.parameters.subHeaderFont.fontId;
                            scope.widgets[length - 1].parameters.normal2Font.fontId =
                                updatedWidget.parameters.normal2Font.fontId;
                            scope.widgets[length - 1].parameters.normal1Font.fontId =
                                updatedWidget.parameters.normal1Font.fontId;
                            scope.widgets[length - 1].parameters.headerFont.fontId =
                                updatedWidget.parameters.headerFont.fontId;
                            scope.widgets[length - 1].parameters.primaryColor.colorId =
                                updatedWidget.parameters.primaryColor.colorId;
                            scope.widgets[length - 1].parameters.secondaryColor.colorId =
                                updatedWidget.parameters.secondaryColor.colorId;
                            scope.widgets[length - 1].parameters.tertiaryColor.colorId =
                                updatedWidget.parameters.tertiaryColor.colorId;
                            scope.widgets[length - 1].parameters.fourthColor.colorId =
                                updatedWidget.parameters.fourthColor.colorId;
                            scope.widgets[length - 1].parameters.fifthColor.colorId =
                                updatedWidget.parameters.fifthColor.colorId;
                            scope.widgets[length - 1].parameters.sixthColor.colorId =
                                updatedWidget.parameters.sixthColor.colorId;
                            scope.widgets[length - 1].parameters.seventhColor.colorId =
                                updatedWidget.parameters.sixthColor.seventhColor;
                            scope.widgets[length - 1] = scope.compileWidget(scope.widgets[length - 1], false);
                            scope.timelineDatas.timeline.date.push(timelineData);
                        } else {
                            var widgetId = updatedWidget._id;
                            $.each(scope.timelineDatas.timeline.date, function (idx, date) {
                                if (date.widgetId === widgetId) {
                                    scope.timelineDatas.timeline.date.splice(idx, 1, timelineData);
                                }
                            });
                            $.each(scope.widgets, function (idx, widget) {
                                if (widget._id === widgetId) {
                                    scope.widgets[idx] = scope.compileWidget(scope.widgets[idx], false);
                                }
                            });
                        }

                        VMM.fireEvent(global, VMM.Timeline.Config.events['data_ready'], scope.timelineDatas);
                        saveWidgetsPositionInTimeline(updatedWidget, scope);
                        return updatedWidget;
                    }, function (resp) {
                        VMM.fireEvent(global, VMM.Timeline.Config.events['data_ready'], scope.timelineDatas);
                        toggleService.hidePleaseWait();
                        return resp;
                    });
            };

            this.deleteWidgetById = function (widgetInstanceID) {
                var apiUrl = '/present/presentations/widgets/' + widgetInstanceID;
                return $http.delete(apiUrl);
            };

            /**
             * Retrieves the presentation graph widget by Id
             * API: /data/graphWidget/{widgetId}
             * Method: GET
             * @param {string} widgetId
             * @param {string} presentationId
             * @return {object}
             */

            this.getGraphWidget = function (widgetId, presentationId) {
                var apiUrl = '/present/presentations/' + presentationId + '/widgets/graph/' + widgetId;
                return $http.get(apiUrl);
            };

            // Weird; weather widget by PresentationId?
            this.getWeatherWidget = function (presentationId) {
                var apiUrl = '/present/presentations/' + presentationId + '/widgets/weatherdata';
                return $http.get(apiUrl);
            };

            this.getEnergyEquivalenciesWidget = function (widgetId, presentationId) {
                var apiUrl = '/present/presentations/' + presentationId + '/widgets/energyequivalencies/' + widgetId;
                return $http.get(apiUrl);
            };

            this.getSolarGenerationWidget = function (widgetId, presentationId) {
                var apiUrl = '/present/presentations/' + presentationId + '/widgets/solargeneration/' + widgetId;
                return $http.get(apiUrl);
            };
        }
    ]);