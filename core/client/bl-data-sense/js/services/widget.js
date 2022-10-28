'use strict';

angular.module('blApp.dataSense.services')
    .service('widgetService', ['$http', '$q', 'dashboardService',
        function($http, $q, dashboardService) {
            function cleanWidgetForStoreInDB(widget) {
                var clean = angular.copy(widget);
                delete clean.bLoaded;
                delete clean.dataSource;
                return clean;
            }
            /**
             * Call api to create new widget
             * api - /ds/widgetapi
             * method - POST
             * @param widget
             * @param dashboard
             */
            this.createWidget = function (widget, dashboard) {
                var apiUrl = '/analyze/dashboards/' + dashboard._id + '/widgets';
                return $http
                    .post(apiUrl, widget)
                    .then(function (newWidget) {
                        return {
                            widget: newWidget
                        };
                    });
                    /*.then(function(result) {
                        var newWidget = result.data.message;
                        var selectedDashboard = {
                            '_id': dashboard._id,
                            'widgets': dashboard.widgets
                                       .concat([{widget: newWidget}])
                        };
                        return dashboardService.updateDashboard(selectedDashboard);
                    });*/
                /*$http.post(apiUrl, inputJson).success(function(data) {
                    if (data.success === 1) {
                        var resultWidget = data.message;
                        var selectedDashboard = {};
                        selectedDashboard._id = dashboard._id;
                        selectedDashboard.widgets = angular.copy(dashboard.widgets);
                        selectedDashboard.widgets.push({rowPosition: null, colPosition: null, widget: resultWidget});
                        
                        angular.forEach(selectedDashboard.widgets, function(value, key) {
                            delete value.widget.bLoaded;
                            delete value.widget.dataSource;
                        });
                    
                        dashboardService.updateDashboard(selectedDashboard).then(function (result) {
                            if (result.data.success === 1) {
                                callback(null, {
                                    dashboard: result.data.message,
                                    widgetWrapper: {
                                        rowPosition: null,
                                        colPosition: null,
                                        widget: resultWidget
                                    }
                                });
                            } else {
                                callback(result.data.message);
                            }
                        });
                    } else {
                        callback(data.message);
                    }
                }).error(function(resp) {
                    callback(resp);
                });*/
            };

            /**
             * Call api to update widget 
             * api - /ds/widgetapi
             * method - PUT
             * @param widget
             * @param dashboard
             */
            this.updateWidget = function (widget, dashboard) {
                var apiUrl = '/analyze/dashboards/' + dashboard._id +
                    '/widgets/' + widget._id;

                var selectedDashboard = {
                    '_id': dashboard._id,
                    'widgets':dashboard.widgets
                        .map(function (w) {
                            if (w.widget._id === widget._id) {
                                angular.extend(w, {
                                    widget: widget
                                });
                            }
                            return w;
                        })
                };

                return $q
                    .all([
                        $http.put(apiUrl, cleanWidgetForStoreInDB(widget)),
                        dashboardService.updateDashboard(selectedDashboard)
                    ])
                    .then(function (values){
                        // values[0] means  updatedWidget
                        // values[1] means updatedDashboard
                        return {
                            widget: values[0]
                        };
                    });
                /*$http.put(apiUrl, widget).success(function(data) {
                    if (data.success === 1) {
                        var resultWidget = data.message;
                        var selectedDashboard = {};
                        selectedDashboard._id = dashboard._id;
                        selectedDashboard.widgets = angular.copy(dashboard.widgets);
                        angular.forEach(selectedDashboard.widgets, function(value, key) {
                            if (value.widget._id === resultWidget._id) {
                                value.widget = angular.copy(resultWidget);
                            }
                            delete value.widget.bLoaded;
                            delete value.widget.dataSource;
                        });
                        
                        dashboardService.updateDashboard(selectedDashboard).then(function (result) {
                            if (result.data.success === 1) {
                                callback(null, {
                                    dashboard: result.data.message,
                                    widgetWrapper: {
                                        widget: resultWidget
                                    }
                                });
                            } else {
                                callback(result.data.message);
                            }
                        });
                    } else {
                        callback(data.message);
                    }
                }).error(function(resp) {
                    callback(resp);
                });*/
            };

            /* Utility function for checking if Single Point Widget
             *
             * @param widget object
             */
            this.isSinglePointWidget = function(widget) {
                if (widget.type === 'Equivalencies' || widget.type === 'Boilerplate') {
                    return true;
                }

                return false;
            };

            /**
             * Utility function for adding aggregate data to dataSource
             *
             * @param dataSource array
             * @param aggregate data
             */
            this.addAggregationData = function (tmpDataSource, aggData) {
                var item;
                var sliceCount = -1;
                //var options = ['Median', 'Mode', 'Min', 'Max', 'Total', 'Average', 'Count'];

                for(var i = tmpDataSource.length-1; i >= 0; i--) {
                    if (('isAggregation' in tmpDataSource[i]) && (tmpDataSource[i].isAggregation)) {
                        sliceCount--;
                    } else {
                        break;
                    }
                }

                item = tmpDataSource.slice(sliceCount);

                for (i = 0; i < aggData.length; i++) {
                    var newItem = {};
                    angular.copy(item[0], newItem);

                    for (var j = 0; j < item[0].values.length; j++) {
                        newItem.values[j].value = aggData[i].value;
                    }
                    newItem.key = item[0].key + ' [' + aggData[i].function + ']';
                    newItem.isAggregation = true;

                    if (sliceCount === -1) {
                        tmpDataSource.push(newItem);
                    }
                    else {
                        for (var k=tmpDataSource.length-1; k >= 0; k--) {
                            if(tmpDataSource[k].key === newItem.key) {
                                tmpDataSource[k] = newItem;
                            }
                        }
                    }
                }
            };

            /**
             * Utility function for parsing widget data for specified widget
             *
             * @param widgetWrapper
             * @param widgetData
             */
            this.parseWidgetData = function(widgetWrapper, widgetData, isRealTime) {
                //var iteratorIndex = 0;
                var dateLabels = [];
                var dataSource = [];
                var tmpDataSource = [];
                var tmpDataSourceObj = null;
                var metricType = '';
                var isPrimaryDateRange = true;
                var service = this;

                //widgetWrapper.widget.dataSource = [];
                widgetWrapper.widget.dateLabels = dateLabels;
                //tmpWidgetData = data.message[widgetIndex][widgetWrapper.widget._id];

                for (var dateRangeType in widgetData) {

                    if (widgetData.hasOwnProperty(dateRangeType)) {

                        if (dateRangeType === 'primaryDateRange' || dateRangeType === 'compareDateRange') {
                            isPrimaryDateRange = (dateRangeType === 'primaryDateRange') ? true : false;

                            if (widgetWrapper.widget.type === 'Kpi') {
                                angular.forEach(widgetData[dateRangeType], function(metricValue, metricKey) {
                                    tmpDataSource.push({
                                        key: metricKey,
                                        isPrimaryDateRange: isPrimaryDateRange,
                                        value: metricValue
                                    });
                                });
                            } 
                            else if (!(!isPrimaryDateRange && service.isSinglePointWidget(widgetWrapper.widget))) {

                                angular.forEach(widgetData[dateRangeType], function (segment, sindex) {

                                    angular.forEach(segment, function (values, segmentName) {
                                        var item = {
                                            key: segmentName,
                                            segmentName: segmentName,
                                            isPrimaryDateRange: isPrimaryDateRange,
                                            isAggregation: false
                                        };

                                        if (!isPrimaryDateRange) {
                                            item.key = item.key + ' [Comparison]';
                                        }

                                        angular.forEach(values, function(metric, mindex) {
                                            item = {
                                                key: segmentName,
                                                segmentName: segmentName,
                                                isPrimaryRange: isPrimaryDateRange
                                            };

                                            metricType = Object.keys(metric)[0];
                                            var newItem = angular.copy(item);
                                            newItem.isPrimaryMetric = (metricType === 'primaryMetric') ? true : false;
                                            newItem.values = null;

                                            if (metric[metricType].data.length > 0 ||
                                                service.isSinglePointWidget(widgetWrapper.widget)) {
                                                newItem.values = metric[metricType].data;
                                            }

                                            if (newItem.values) {
                                                if (isRealTime && !widgetData.isHistorical) {
                                                    service.appendSocketChunks(tmpDataSource, newItem);
                                                }
                                                else {
                                                    tmpDataSource.push(newItem);
                                                }

                                                if (('singlePointAggregation' in  metric[metricType]) &&
                                                    (metric[metricType].singlePointAggregation.length > 0)) {
                                                    service.addAggregationData(tmpDataSource,
                                                        metric[metricType].singlePointAggregation);
                                                }
                                            }
                                        });
                                    });
                                });
                            }
                        } else {
                            if (tmpDataSourceObj === null) {
                                tmpDataSourceObj = {};
                            }
                            tmpDataSourceObj[dateRangeType] = widgetData[dateRangeType];
                        }
                    }
                }
                
                dataSource = angular.copy(tmpDataSource);
                if (tmpDataSourceObj !== null) {
                    tmpDataSourceObj.values = dataSource;
                    return tmpDataSourceObj;
                }

                return dataSource;
            };

            /**
             * Call api to load the specific widget data in the given dashboard
             * api - /data/ds/dashboardId/widgetId
             * method - GET
             * @param dashboard
             * @param widgetWrapper
             * @param callback
             */
            this.getWidgetData = function(dashboard, widgetWrapper) {
                var apiUrl = '/analyze/dashboards/' + dashboard._id +
                    '/widgets/' + widgetWrapper.widget._id + '/widgetdata';
                var req = {
                    method: 'GET',
                    url: apiUrl
                };
                var service = this;

                if (dashboard.isViewerTime) {
                    req.headers.viewerTZOffset = moment().utcOffset();
                }

                return $http(req)
                    .then(function (widgetData) {
                        var tmpWidgetData;

                        tmpWidgetData = widgetData[widgetWrapper.widget._id];
                        widgetWrapper.widget.bLoaded = true;
                        widgetWrapper.widget.dataSource = service.parseWidgetData(widgetWrapper,tmpWidgetData,false);
                        tmpWidgetData = null;
                        return $q.when(widgetWrapper);
                    });
                    /*.then(function (widgetWrapper) {
                        dashboard.widgets
                    })*/
                /*$http(req).success(function (data) {
                    if (data.success === 1) {
                        var tmpWidgetData = null;

                        tmpWidgetData = data.message[widgetWrapper.widget._id];
                        widgetWrapper.widget.bLoaded = true;
                        widgetWrapper.widget.dataSource = 
                            service.parseWidgetData(widgetWrapper,tmpWidgetData,false);
                        tmpWidgetData = null;

                        callback(null);
                    }
                }).error(function (resp) {
                    console.log(resp);
                    callback(resp);
                });*/
            };

            this.removeWidgetFromDashboard = function (dashboardId, widgetId) {
                var apiUrl = '/analyze/dashboards/' + dashboardId + '/widgets/' + widgetId;
                return $http
                    .delete(apiUrl)
                    .then(function(resp) {
                        console.log('removeWidget success from backend');
                        console.log(resp);
                        return resp;
                    });
            };

            this.exportWidget = function(widgetId, exportFormat, exportFile, exportData) {
                var apiUrl = '/analyze/dashboards/export/widget/' + widgetId;
                var reqData = {
                    exportFormat: exportFormat,
                    exportFile: exportFile,
                    exportData: exportData
                };

                return $http.post(apiUrl, reqData);
            };
        }
    ]);
