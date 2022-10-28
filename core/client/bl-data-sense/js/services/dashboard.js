'use strict';

angular.module('blApp.dataSense.services')
    .service('dashboardService', ['$http', 'utilService', '$rootScope', '$timeout','blSocket', 'toggleService',
        function($http, utilService, $rootScope, $timeout, blSocket, toggleService) {
            var service = this;

            $rootScope.socketRequest = {
                request: 'getDashboardData',
                data: {}
            };
            $rootScope.socketId = null;
            $rootScope.loadedHistoricalData = false;
            $rootScope.cachedWidgetData = {};

            this.realtimeDashboard = null;
            var viewerTZOffset = -moment().zone();

            this.cleanDashboardForStoreInDB = function (dashboard) {
                var clean = angular.copy(dashboard);
                angular.forEach(dashboard.widget, function (w) {
                    delete w.bLoaded;
                    delete w.dataSource;
                });
                return clean;
            };

            /*
            var service = this;
            var viewerTZOffset = -moment().zone();

            blSocket.on('init', function(data){
                console.log('INIT WEB SOCKET');
            });

            blSocket.on('connect', function(data){
                console.log('SOCKET CONNECT EVENT');
                service.socketConnected = true; 
            });
            */
            
            blSocket.on('connected', function(data){
                $rootScope.socketId = data.socketId;
                console.log('SOCKET CONNECTED', data.socketId);
                //$rootScope.$emit('socketConnected', data);

                if(service.realtimeDashboard) {
                    $rootScope.socketRequest.data.socketId = data.socketId;
                    $rootScope.socketRequest.data.dashboards =  [service.realtimeDashboard._id];
                    $rootScope.socketRequest.data.viewerTZOffset = viewerTZOffset;

                    blSocket.emit($rootScope.socketRequest.request, $rootScope.socketRequest.data);
                }
                
                $rootScope.socketRequest = {
                    request: 'getDashboardData',
                    data: {}
                };
            });
            
            blSocket.on('dashboardData', function(data) {
                var i;
                //var dashboard = null, i, j;
                //var isSelectedDashboardUpdated = false;
                
                if (data.success === 1) {
                    
                    for (var widgetId in data.message) {
                        if (data.message.hasOwnProperty(widgetId)) {
                            var widgetData = data.message[widgetId.toString()];
                            var dashboardId = widgetData.dashboardId;
                            var isHistorical = widgetData.isHistorical;

                            service.realtimeDashboard.widgetsDataLoaded = isHistorical;

                            //delete widgetData['dashboardId'];
                            //delete widgetData['isHistorical'];

                            if (dashboardId === service.realtimeDashboard._id) {
                                for (i = 0; i <  service.realtimeDashboard.widgets.length; i++) {
                                    if (widgetId === service.realtimeDashboard.widgets[i].widget._id) {
                                        service.realtimeDashboard.widgets[i].widget.bLoaded = true;
                                        service.realtimeDashboard.widgets[i].widget.dataSource = 
                                        service.parseWidgetData(service.realtimeDashboard.widgets[i],
                                            widgetData,true);
                                    }
                                }
                            }
                        }
                    }
                    
                    if(service.realtimeDashboard.isRealTimeDateRange) {
                        $rootScope.$emit('datasenseDataReceived', {'socketData': data.message});
                    }
                }
            });

            blSocket.on('disconnect', function(data) {
                $rootScope.socketId = null;
                $rootScope.$emit('socketDisconnected', data);
            });
            
            /**
             * Update cached widget data when the widget updated
             * @param {object} widgetWrapper
             * @returns : result delivered to {callback} function
             */
            
            this.updateCachedWidgetData = function(widgetWrapper) {
                $rootScope.cachedWidgetData[widgetWrapper.widget._id] = widgetWrapper.widget.dataSource;
            };

            /**
             * Send 'getDashboardData' request via socket.io
             * @param {object} dashboard
             * @returns : result delivered to {callback} function
             */
            this.emitGetDashboardData = function(dashboard) {
                if($rootScope.socketId !== null) {
                    blSocket.emit('getDashboardData', 
                        {
                            'socketId': $rootScope.socketId,
                            'dashboards': [dashboard._id],
                            'viewerTZOffset': viewerTZOffset
                        },
                        function(result) {
                            console.log('==WEB SOCKET EMIT CALLBACK==', arguments);
                        });
                }
            };

            /**
             * Send 'getDashboardData' request via socket.io
             * @param {object} dashboard
             * @returns : result delivered to {callback} function
             */
            this.socketGetWidgetsData = function (dashboard) {
                // $rootScope.socketCallbacks['getDashboardData'] = callback;

                this.initWidgetData(dashboard);

                
                $rootScope.socketRequest = {
                    request: 'getDashboardData',
                    data: {
                        'dashboards': [dashboard._id]
                    }
                };

                this.realtimeDashboard = dashboard;
                this.emitGetDashboardData(dashboard); 
            };

            /**
             * Call api to retrieve all dashboard object
             * api - /ds/dashboardapi/find/all_data
             * method - GET
             * @return {object}
             */
            this.getAccountDashboards = function () {
                console.log('[DASHBOARD SERVICE] - Retrieving account Dashboard data...');

                var apiUrl = '/analyze/dashboards?searchKey=all_data';
                if ($rootScope.isViewer) {
                    apiUrl += '&isViewer=true';
                }

                return $http.get(apiUrl)
                    .then(function (dashboards) {
                        console.log(apiUrl);
                        if (dashboards.length) {
                            console.log('[DASHBOARD SERVICE] - Dashboards successfully found: ');
                            console.log(dashboards);
                        } else {
                            console.log('[DASHBOARD SERVICE] - Dashboard data not found.');
                        }
                        return dashboards;
                    });
            };

            /**
             * Call api to retrieve a single dashboard object
             * api - /ds/dashboardapi/find/_id
             * method - GET
             * @param {string} dashboardId dashboard id
             * @return {object}
             */
            this.getDashboardById = function (dashboardId) {
                //console.log('[DASHBOARD SERVICE] - Retrieving single Dashboard object...');
                var apiUrl = '/analyze/dashboards/' + dashboardId;
                if ($rootScope.isViewer) {
                    apiUrl += '?isViewer=true';
                }
                return $http.get(apiUrl);
            };

            /**
             * Call api to retrieve specified dashboard object
             * api - /ds/dashboardapi/find/collection
             * method - GET
             * @param {string} collectionTitle An search key - collection title
             * @return {object}
             */
            this.getDashboardsByTitle = function (collectionTitle) {
                console.log('Getting A Dashboard...');
                var apiUrl = '/analyze/dashboards?searchKey=' + collectionTitle;

                return $http.get(apiUrl);
            };

            /**
             * Call api to create a single dashboard object
             * api - /ds/dashboardapi/
             * method - POST
             * @param {string} dashboardObj dashboard data
             * @return {promise}
             */
            this.createDashboard = function (dashboardObj) {
                console.log('[DASHBOARD SERVICE] - Creating new Dashboard...');

                var apiUrl = '/analyze/dashboards';
                var _endDate = new Date();
                var _startDate = new Date();
                _startDate.setMonth(_endDate.getMonth() - 1);

                var inputJson = {
                    title: dashboardObj.title,
                    collections: dashboardObj.collections,
                    isPrivate: dashboardObj.isPrivate,
                    default: dashboardObj.default,
                    startDate: _startDate,
                    endDate: _endDate,
                    bpLock: dashboardObj.bpLock,
                    layout: {
                        selectedStyle: 2,
                        widgets: {
                            'column0': [],
                            'column1': []
                        }
                    }
                };

                return $http
                    .post(apiUrl, inputJson)
                    .then(function (ds) {
                        console.log('[DASHBOARD SERVICE] - Created Dashboard' + dashboardObj.title);
                        console.log(ds);
                        if (inputJson.bpLock) {
                            $rootScope.Dsmodifyable = false;
                        } else {
                            $rootScope.Dsmodifyable = true;
                        }

                        return ds;
                    });
            };

            this.updateDashboard = function (dashboard) {
                console.log('[DASHBOARD SERVICE] - Updating Dashboard...');
                var apiUrl = '/analyze/dashboards/' + dashboard._id,
                    clean = this.cleanDashboardForStoreInDB(dashboard);
                return $http.put(apiUrl, clean).then(function(resp) {
                    if (dashboard.bpLock) {
                        $rootScope.Dsmodifyable = false;
                    } else {
                        $rootScope.Dsmodifyable = true;
                    }
                    console.log('[DASHBOARD SERVICE] - Dashboard Updated');
                    return resp;
                });
            };

            /**
             * Call api to delete a single dashboard object
             * api - /ds/dashboardapi/_id
             * method - DELETE
             * @param {object} dashboard object
             * @return {object}
             */
            this.deleteDashboard = function (dashboard) {
                var dashboardId = dashboard._id;
                var dashboardName = dashboard.title;
                var apiUrl = '/analyze/dashboards/' + dashboardId;
                console.log('[DASHBOARD SERVICE] - Deleting Dashboard [' + dashboardName + ']...');

                return $http
                    .delete(apiUrl)
                    .then(function () {
                        console.log('[DASHBOARD SERVICE] - Deleted Dashboard [' + dashboardName + ']');
                        return dashboard;
                    });
            };

            /**
             * Call api to get dashboard's metrics
             * api - /ds/dashboardapi/metrics/dashboardid
             * method - GET
             * @param {object} dashboard object
             * @return {object}
             */
            this.getDashboardMetrics = function(dashboard) {
                var dashboardId = dashboard._id;
                var dashboardName = dashboard.title;
                var apiUrl = '/analyze/dashboards/' + dashboardId + '/metrics';
                if ($rootScope.isViewer) {
                    apiUrl += '?isViewer=true';
                }
                return $http
                    .get(apiUrl)
                    .then(function (data) {
                        console.log('[DASHBOARD SERVICE] - Get Dashboard Metrics [' + dashboardName + ']', data);
                        return data;
                    });
            };

            /**
             * Call api to save date ranges
             * api - /ds/dashboardapi
             * method - POST
             * @param {object} data the date range to save
             * @return {object}
             */
            this.saveDateRanges = function(data) {
                console.log(data);
                console.log('[DASHBOARD SERVICE] - Saving date ranges...');
                var apiUrl = '/analyze/dashboards/' + data._id;

                delete data.__v;
                        
                return $http
                    .put(apiUrl, data)
                    .then(function(resp) {
                        console.log('[DASHBOARD SERVICE] - Date ranges saved successfully.');
                        return resp;
                    });
            };

            /**
             * Utility function for checking if Single Point Widget
             *
             * @param widget
             * @return {bool}
             */
            this.isSinglePointWidget = function(widget) {
                return widget.type === 'Equivalencies' || widget.type === 'Boilerplate';
            };

            /**
             * Utility function for initializing widget data
             *
             * @param dashboard
             */
            this.initWidgetData = function (dashboard) {
                for (var i = 0; i < dashboard.widgets.length; i++) {
                    dashboard.widgets[i].widget.dataSource = [];
                    
                    if (!(dashboard.widgets[i].widget._id in $rootScope.cachedWidgetData)) {
                        $rootScope.cachedWidgetData[dashboard.widgets[i].widget._id] = [];
                    }
                }
            };

            /**
             * Description?
             *
             * @param dataSource
             * @param item
             */
            this.appendSocketChunks = function (dataSource, item) {
                var flag = false;
                
                for (var i=0;i<dataSource.length;i++) {
                    if ((dataSource[i].key === item.key) && (dataSource[i].isPrimaryRange === item.isPrimaryRange)) {
                        
                        if ((typeof dataSource[i].values !== 'undefined') && (dataSource[i].values.length)) {
                            
                            flag = false;
                            
                            for (var j = 0; j < dataSource[i].values.length; j++) {
                                if (dataSource[i].values[j].label === item.values[0].label) {
                                // || (dataSource[i].values[j].date === item.values[0].date) 
                                    //dataSource[i].values[j].value += item.values[0].value;
                                    dataSource[i].values[j].value = item.values[0].value;
                                    flag = true;
                                }
                            }

                            if (! flag) {
                                dataSource[i].values = dataSource[i].values.concat(item.values);
                                dataSource[i].values.shift();
                            }
                        }
                        else {
                            dataSource[i].values = item.values;
                        }

                        return dataSource;
                    }
                }

                dataSource.push(item);
                return dataSource;
            };

            /**
             * Utility function for adding aggregate data to dataSource
             *
             * @param tmpDataSource array
             * @param aggData data
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
            // TODO: avoid duplication for primary and compare range parsing by defining a new function.
            this.parseWidgetData = function(widgetWrapper, widgetData, isRealTime) {
                //var iteratorIndex = 0;
                //var dateLabels = [];
                var dataSource = [];
                var tmpDataSource = [];
                var tmpDataSourceObj = null;
                var metricType = '';
                var isPrimaryDateRange = true;

                if (isRealTime) {
                    if (widgetData.isHistorical) {
                        widgetWrapper.widget.dataSource = [];
                        tmpDataSource = [];
                        $rootScope.cachedWidgetData[widgetWrapper.widget._id] = [];
                    }
                    else {
                        tmpDataSource = angular.copy($rootScope.cachedWidgetData[widgetWrapper.widget._id]);
                    }
                }

                widgetWrapper.widget.dateLabels = [];
                
                for (var dateRangeType in widgetData) {
                    
                    if (widgetData.hasOwnProperty(dateRangeType)) {
                        
                        if (dateRangeType === 'primaryDateRange' || dateRangeType === 'compareDateRange') {
                            isPrimaryDateRange = dateRangeType === 'primaryDateRange';

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
                                
                                angular.forEach(widgetData[dateRangeType], function (segment) {
                                    
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
                                                isPrimaryDateRange: isPrimaryDateRange
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

                                                if (('singlePointAggregation' in metric[metricType]) &&
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
                
                
                if (isRealTime) {
                    $rootScope.cachedWidgetData[widgetWrapper.widget._id] = angular.copy(tmpDataSource);
                }

                dataSource = angular.copy(tmpDataSource);
                if (tmpDataSourceObj !== null) {
                    tmpDataSourceObj = dataSource;
                    return tmpDataSourceObj;
                }

                return dataSource;
            };

            /**
             * Call api to load the data of all widgets in the current dashboard
             * api - /data/ds/dashboardId
             * method - GET
             * @param dashboard
             */
            this.getWidgetsData = function (dashboard) {
                var apiUrl = '/analyze/dashboards/' + dashboard._id + '/widgets',
                    config = {};
                var service =  this;
                if (dashboard.isViewerTime) {
                    config.headers = {
                        viewerTZOffset: moment().utcOffset()
                    };
                }

                return $http
                    .get(apiUrl, config)
                    .then(function (resp) {
                        toggleService.hidePleaseWait();
                        dashboard.widgetsDataLoaded = true;
                        angular.forEach(dashboard.widgets, function (widgetWrapper, widgetIndex) {
                            var tmpWidgetData = resp[widgetIndex][widgetWrapper.widget._id];
                            widgetWrapper.widget.bLoaded = true;
                            widgetWrapper.widget.dataSource =
                                service.parseWidgetData(widgetWrapper, tmpWidgetData, false);
                            tmpWidgetData = null;
                        });
                        return dashboard;

                            /*
                             if (widgetWrapper.widget.type === 'Kpi') {
                             angular.forEach(tmpWidgetData, function(dateRangeValue, dateRangeKey) {
                             angular.forEach(dateRangeValue, function(metricValue, metricKey) {
                             widgetWrapper.widget.dataSource.push({
                             key: metricKey,
                             isPrimaryDateRange: (dateRangeKey === 'primaryDateRange'),
                             value: metricValue
                             });
                             });
                             });
                             } else {

                             }
                             */
                    });
            };

            /**
             * Call api to get all analyze collections
             * api - /analyze/dashboards/collections
             * method - GET
             * @return {HttpPromise} A Promise
             */
            this.getAllCollections = function() {
                var apiUrl = '/analyze/dashboards/collections';
                return $http.get(apiUrl).then(function(resp) {
                    return resp && resp.collections ? resp.collections : resp;
                });
            };

            /**
             * Call api to send email for dashboard link
             * api - /analyze/dashboards/collections
             * method - POST
             * @param
             * @return {array}
             */
            this.sendDashboardLinkEmail = function(data) {
                var apiUrl = '/notifications/email/dashboardlink';

                return $http.post(apiUrl, data);
            };

            /**
             * Call api to export dashboard
             * api - /analyze/dashboards/export
             * method - GET
             * @param
             * @return {array}
             */
            this.exportDashboard = function(dashboardId, exportData, exportFile, callback) {
                var apiUrl = '/analyze/dashboards/export/' + dashboardId;

                $http.post(apiUrl, {
                    exportData: exportData,
                    exportFile: exportFile
                }).then(function (response) {
                    callback(null, response);
                }, function (error) {
                    callback(error);
                });
            };

            /**
             *
             */
            this.setLegendData = function (data, isPrimaryDateRange, isPrimaryMetric, value) {
                data[isPrimaryDateRange ? 'primaryDateRange' : 'compareDateRange']
                    [isPrimaryMetric ? 'primaryMetric' : 'compareMetric']
                    = (typeof value !== 'undefined') ? value : false;
            };

            /**
             *
             */
            this.getLegendData = function (data, isPrimaryDateRange, isPrimaryMetric) {
                if (!data) {
                    return false;
                }
                return data[isPrimaryDateRange ? 'primaryDateRange' : 'compareDateRange']
                    [isPrimaryMetric ? 'primaryMetric' : 'compareMetric'];
            };
        }
    ]);
