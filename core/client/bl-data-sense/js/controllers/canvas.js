'use strict';

angular.module('blApp.dataSense.controllers').controller(
    'CanvasController',
        ['$scope', '$rootScope', '$compile', '$http', '$timeout', '$sce', '$q', '$filter', '$uibModal', 'widgetService',
        'toggleService', 'ngTableParams', 'dashboardService', 'widgetUtilService', 'utilService', 'notifyService',
        'ANALYZE_CONSTS',
        function ($scope, $rootScope, $compile, $http, $timeout, $sce, $q, $filter, $uibModal, widgetService,
                  toggleService, NgTableParams, dashboardService, widgetUtilService, utilService, notifyService,
                ANALYZE_CONSTS) {
            $rootScope.layoutPanelShown = false;
            $scope.showXAxisLabel = true;

            $scope.columns = [
                {'name' : 'column0', 'class' : 'col-md-3'},
                {'name' : 'column1', 'class' : 'col-md-6'},
                {'name' : 'column2', 'class' : 'col-md-3'}
            ];
            $scope.columnWidgets = {};
            $rootScope.selectedDashboardColumnWidgets = {};
            $scope.widgetparams = {};
            $scope.tableColumns = [{title: '1', field:'1'},{title: '2', field:'2'},{title: '3', field:'3'}];

            /**
             * Define config for ui-sortable directory
             */
            $scope.sortableOptions = {
                placeholder: 'ds-widget-placeholder',
                connectWith: '.drop-container',
                handle: '.ds-widget-drag-handler',
                stop: function (e, ui) {
                    // it should redraw widget after its drag n drop is over
                    //var target = angular.element(ui.item.context).scope().widget;
                    //$scope.drawChart(target);
                    // it should save updated widgets position to dashboard
                    var selectedDashboard = {
                        '_id': $rootScope.selectedDashboard._id,
                        'layout': {
                            'includePrimary':  $scope.isIncludePrimary,
                            'selectedStyle': $rootScope.selectedDashboard.layout.selectedStyle,
                            'widgets': $scope.gatherWidgetIDs()
                        }
                    };

                    dashboardService.updateDashboard(selectedDashboard).then(function (resp) {
                        //Re-arrange widgets by their stored position in the db
                        $rootScope.selectedDashboard.layout = resp.layout;
                        $scope.makeColumnWidgets(true);
                        $scope.drawDashboardWidgets();
                    });
                }
            };

            // gather widget ids of each layout's column 
            $scope.gatherWidgetIDs = function () {

                var widgetIDs = {};
                for (var idx = 0; idx < $scope.columns.length; idx++) {
                    var columnName = $scope.columns[idx].name,
                        columnDOM = angular.element('[data-id='+columnName+']'),
                        widgetDOMs = columnDOM.find('.widget-container');
                    widgetIDs[columnName] = widgetDOMs.map(function(wdIndex, wd) {
                            return angular.element(wd).scope().widget._id;
                        }).toArray();
                }

                return widgetIDs;
            };

            /**
             * Define root scope event handlers
             */
            $rootScope.$on('selectedDashboardChanged', function() {
                $scope.makeColumnWidgets();
                $scope.drawDashboardWidgets();
                $scope.chooseLayout($rootScope.selectedDashboard.layout.selectedStyle);
                $scope.isIncludePrimary = $rootScope.selectedDashboard.layout.includePrimary;
            });

            $rootScope.$on('changedSegmentOrDateRange', function() {
                dashboardService.getDashboardMetrics($rootScope.selectedDashboard).then(function (metrics) {
                    $rootScope.selectedDashboardMetrics = metrics;
                });

                // Clear every widget content in the dashboard so that widget loading icon appear
                $rootScope.selectedDashboard.widgetsDataLoaded = false;
                angular.forEach($rootScope.selectedDashboard.widgets, function(value, key) {
                    value.widget.bLoaded = false;
                    d3.select('#widget-container-' + value.widget._id).selectAll('svg')
                        .html('');
                    /*
                    if (value.widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Table) {
                        // clear table widget contents
                        // angular.element("#table-widget-" + value.widget._id).html("");
                        var params = Object.keys(value.widget);
                        params.forEach(function(param) {
                            widgetWrapper.widget[param] = data.widgetWrapper.widget[param];
                        });
                        widgetWrapper.widget.bLoaded = false;
                        updatedWidgetWrapper = widgetWrapper;
                    }
                    */
                });

                $scope.makeColumnWidgets();
                $scope.drawDashboardWidgets();
            });

            $rootScope.$on('deletedAllDashboards', function () {
                $scope.columnWidgets = null;
                $rootScope.selectedDashboardColumnWidgets = $scope.columnWidgets;
            });

            $rootScope.$on('datasenseDataReceived', function(message, options) {
                angular.forEach($rootScope.selectedDashboard.widgets, function(value, key) {
                    if (value.widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                        value.widget.drawInfo = widgetUtilService.getEquivalenciesItemInfo(value.widget.equivType);
                    }

                    $timeout(function(){
                        $scope.drawChart(value.widget);
                    }, 500);
                });
                toggleService.hidePleaseWait();
            });

            /**
             * Call getWidgetData service for drawing Dashboard widgets
             * @param {string}
             * @return {object}
             */
            $scope.drawDashboardWidgets = function() {
                window.onresize = null;
                if ($rootScope.selectedDashboard.widgetsDataLoaded) {
                    angular.forEach($rootScope.selectedDashboard.widgets, function(widgetWrapper, widgetIndex) {
                        if (widgetWrapper.widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                            widgetWrapper.widget.drawInfo =
                                widgetUtilService.getEquivalenciesItemInfo(widgetWrapper.widget.equivType);
                        }
                        if (widgetWrapper.widget.type !== ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Image) {
                            $scope.drawChart(widgetWrapper.widget);
                            widgetWrapper.widget.bLoaded = true;
                        }
                    });
                    return false;
                }
                
                
                if ($rootScope.selectedDashboard.isRealTimeDateRange) {
                    console.log('START SOCKET AAA========');
                    dashboardService.socketGetWidgetsData($rootScope.selectedDashboard);
                } else {
                    //console.log('START NORMAL BBB======');
                    dashboardService
                        .getWidgetsData($rootScope.selectedDashboard)
                        .then(function(dashboard){
                            angular.forEach($rootScope.selectedDashboard.widgets, function (wr) {
                                if (wr.widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                                    wr.widget.drawInfo =
                                        widgetUtilService.getEquivalenciesItemInfo(wr.widget.equivType);
                                }
                                $scope.drawChart(wr.widget);
                            });
                        });
                }
            };

            /**
             * Decide columns by layout
             * @param {string} layout
             * @returns {object}
             */
            $scope.getColumnsByLayoutStyle = function (layout) {
                var columnsLayout;
                try {
                    if (layout.includePrimary) {
                        columnsLayout = [
                            {'name': 'primary', 'class': 'col-md-12', 'reserved': true}
                        ];
                    } else {
                        columnsLayout = [];
                    }
                    switch(layout.selectedStyle) {
                        case 1:
                            return columnsLayout.concat([
                                {'name': 'column0', 'class': 'col-md-12'}
                            ]);
                        case 2:
                            return columnsLayout.concat([
                                {'name': 'column0', 'class': 'col-md-6'},
                                {'name': 'column1', 'class': 'col-md-6'}
                            ]);
                        case 3:
                            return columnsLayout.concat([
                                {'name' : 'column0', 'class' : 'col-md-3'},
                                {'name' : 'column1', 'class' : 'col-md-3'},
                                {'name' : 'column2', 'class' : 'col-md-3'},
                                {'name' : 'column3', 'class' : 'col-md-3'}
                            ]);
                        case 4:
                            return columnsLayout.concat([
                                {'name' : 'column0', 'class' : 'col-md-4'},
                                {'name' : 'column1', 'class' : 'col-md-8'}
                            ]);
                        case 5:
                            return columnsLayout.concat([
                                {'name' : 'column0', 'class' : 'col-md-3'},
                                {'name' : 'column1', 'class' : 'col-md-6'},
                                {'name' : 'column2', 'class' : 'col-md-3'}
                            ]);
                        case 6:
                            return columnsLayout.concat([
                                {'name' : 'column0', 'class' : 'col-md-8'},
                                {'name' : 'column1', 'class' : 'col-md-4'}
                            ]);
                        default:
                            // return columns of layoutStyle 2
                            return columnsLayout.concat([
                                {'name': 'column0', 'class': 'col-md-6'},
                                {'name': 'column1', 'class': 'col-md-6'}
                            ]);
                    }
                } catch (e) {
                    return ([
                        {'name': 'column0', 'class': 'col-md-6'},
                        {'name': 'column1', 'class': 'col-md-6'}
                    ]);
                }
            };

            /**
             * Depends on selected layout, change widget columns
             *
             */
            $scope.makeColumnWidgets = function (ignoreReserved) {
                ignoreReserved = ignoreReserved || false;

                if (!$rootScope.selectedDashboard) {
                    return ;
                }

                var layout = $rootScope.selectedDashboard.layout,
                    reservedWidgets = [];
                $scope.columns = $scope.getColumnsByLayoutStyle(layout);

                // init widget slots
                // if column has property named 'reserve' like primary column, then we keep widget slot
                angular.forEach($scope.columns, function (col) {
                    if (!(col.reserved && $scope.columnWidgets[col.name]) || ignoreReserved) {
                        $scope.columnWidgets[col.name] = [];
                    } else {
                        reservedWidgets = reservedWidgets.concat($scope.columnWidgets[col.name]);
                    }
                });
                var selectedDashboardWidgets = $rootScope.selectedDashboard.widgets;

                // Here's the how we arrange layout
                // Step 1. Load widgets saved in dashboard.layout.widgets, and arrange them by their stored position

                var arrangedWIDs = [];
                angular.forEach(layout.widgets, function(wIDs, columnName) {
                    // get widget by widgetID
                    arrangedWIDs = arrangedWIDs.concat(wIDs);
                    angular.forEach(wIDs, function (wID) {
                        var findout = selectedDashboardWidgets.filter(function (w) {
                                return w.widget._id === wID;
                            }).shift();
                        if (findout && findout.widget
                            && $scope.columnWidgets[columnName].indexOf(findout.widget) === -1) {
                            $scope.columnWidgets[columnName].push(findout.widget);
                        }
                    });
                });

                // Step 2. Load widgets saved in dashboard.widgets, and arrange them in turn.
                var columnCount = $scope.columns.length;
                if (layout.includePrimary) {
                    columnCount = columnCount - 1;
                }

                angular.forEach(selectedDashboardWidgets, function(value, key){
                    if (!value.widget) {
                        return;
                    }
                    if (value.widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                        value.widget.drawInfo = widgetUtilService.getEquivalenciesItemInfo(value.widget.equivType);
                    }
                    // Check if widget already has it's slot (checkout if any slot has this widget to avoid conflict
                    if (reservedWidgets.indexOf(value.widget) === -1 && arrangedWIDs.indexOf(value.widget._id) < 0) {
                        $scope.columnWidgets['column' + (key % columnCount)].push(value.widget);
                    }
                });

                $rootScope.selectedDashboardColumnWidgets = $scope.columnWidgets;
            };

            /**
             * Toggle layout panel
             */
            $rootScope.layoutPanelToggle = function(){
                $('.lay_'+$scope.layoutStyle).addClass('active');
                $rootScope.layoutPanelShown = !$rootScope.layoutPanelShown;
            };

            /**
             * When select a layout on layout panel, it will be saved
             * @param {integer} styleIndex Layout style index
             */
            $scope.chooseLayout = function(styleIndex){
                $('.bl-layout-icon').removeClass('active');
                $('.lay_'+styleIndex).addClass('active');
                $scope.layoutStyle = styleIndex;
            };

            /**
             * Set the showPrimary flag for showing primary widget on dashboard
             */
            $scope.showPrimaryWidget = function(){
                if($scope.showPrimary === 0){
                    $scope.showPrimary = 1;
                } else{
                    $scope.showPrimary = 0;
                }
            };

            /**
             * Save layout information
             * @param {string}
             * @return {object}
             */
            /*$scope.saveLayouts = function(){
             $scope.showPrimaryChecked = $scope.showPrimary;
             $scope.layoutStyleChecked = $scope.layoutStyle;
             $rootScope.layoutPanelToggle();
             };*/

            /**
             * Update dashboard and widgets when saved layout
             * @param {string}
             * @return {object}
             */
            $scope.saveLayout = function() {
                if (!$rootScope.Dsmodifyable) {
                    notifyService.errorNotify('Dashboard is locked. Therefore you don\'t have permission to update.');
                    return false;
                }
                if (typeof $rootScope.selectedDashboard !== 'undefined' && $rootScope.selectedDashboard !== null ) {
                    $rootScope.layoutPanelToggle();

                    var selectedDashboard = {
                        '_id': $rootScope.selectedDashboard._id,
                        'layout': {
                            'selectedStyle': $scope.layoutStyle,
                            'includePrimary': $scope.isIncludePrimary
                        }
                    };

                    if (!($scope.layoutStyle === $rootScope.selectedDashboard.layout.selectedStyle
                        && $scope.isIncludePrimary === $rootScope.selectedDashboard.layout.includePrimary)) {
                        $rootScope.selectedDashboard.layout = selectedDashboard.layout;
                    }

                    $scope.makeColumnWidgets();
                    $scope.drawDashboardWidgets();
                    $timeout(function() {
                        angular.extend(selectedDashboard.layout, {
                            'widgets': $scope.gatherWidgetIDs()
                        });
                        dashboardService.updateDashboard(selectedDashboard);
                    }, 500);
                } else {
                    return false;
                }

            };

            /**
             * Preserved funciton
             * @param {string}
             * @return {object}
             */
            $rootScope.updateWidgetFunc = function(segments, daterange , compareDateRange) {

            };

            /**
             * Utility funciton for converting number to day of week
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.dayOfWeekAsString = function(dayIndex) {
                return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][dayIndex];
            };

            /**
             * Utility function for generating colors in given scheme
             * @param {string} baseColor from which series of colors generated
             * @param {string} sliceCount number of gradually changing color series
             * @return {array}
             */
            $scope.widgetColorScheme = function(baseColor, sliceCount) {
                /* Manipulate lightness attribute to generate series of gradually changing colors
                 * range [80, 220]
                 * 80 - darkest
                 * 220 - brightest
                 */
                var colorArray = [];
                var hslBase = d3.rgb(baseColor).hsl();
                var range = 220 - 80;
                var step    = range / sliceCount;

                for (var i = 0; i < sliceCount ; i++) {
                    var l = (step * i + 80) / 240.0;
                    var rgb = d3.hsl(hslBase.h, hslBase.s, l).rgb();
                    colorArray.push(rgb);
                }
                return colorArray;
            };

            /**
             * Utility function for generating data source for a specified segment in pie
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.getSlicedData = function(orgData, sliceCount, groupDimension) {
                var dataSource = [];

                var sortedValues = orgData.values.sort(function(a,b) {return parseFloat(b.value)-parseFloat(a.value);});
                var topSlices = sortedValues.slice(0,sliceCount);
                //var processedObject = {};
                var otherVal = {
                    label: 'Others',
                    date: '',
                    value: 0
                };
                var otherSumArray;
                var isOriginBaseGroupDimension = (groupDimension === 'Account' ||  
                                                groupDimension === 'Team Members with Access') ? true : false;

                dataSource.key = orgData.key;
                dataSource.values = topSlices;

                if (sortedValues.length > sliceCount && !isOriginBaseGroupDimension) {
                    otherSumArray = orgData.values.slice(sliceCount,orgData.values.length);

                    for (var i = 0; i < otherSumArray.length; i++) {
                        otherVal.value = otherVal.value + otherSumArray[i].value;
                    }

                    if (otherSumArray.length > 0) {
                        otherVal.date = otherSumArray[0].date;
                    }

                    if (otherVal.value) {
                        dataSource.values.push(otherVal);
                    }
                }

                return dataSource;
            };

            /**
             * Draw chart for each dashboard widget by nvd3
             * @param {object} widgetData The widget data including widgetType and dimensions, values
             * @return {object}
             */
            $scope.drawChart = function(widgetData) {

                var colorsArray = d3.scale.category10().range();
                var isShowLegend = widgetData.legendVisible ? widgetData.legendVisible : false;
                if (widgetData.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Timeline) {

                    nv.addGraph(function() {
                        var chart = null;
                        var itemVals, minY = 0, maxY = 0, minY2 = 0, maxY2 = 0;
                        var revisedYRange, revisedY2Range, segmentId;
                        var defColors = d3.scale.category10().range();
                        var colorIndex = -1;
                        var shadesColorIndex = 0;
                        var countSPA = widgetData.singlePointAggregation.length;
                        var colorArray = [];
                        /**
                         * If the widget contains compareMetric,
                         *  then use custom defined linePlusLineChart with dual y-axis
                         * Otherwise use simple lineChart with single y-axis
                         */
                        if (widgetData.compareMetric === null) {

                            angular.forEach(widgetData.dataSource, function(source, idx) {
                                if (!source.isAggregation) {
                                    itemVals = $.map(source.values, function (item) {
                                        return item.value;
                                    });
                                    if (idx === 0) {
                                        minY = Math.min.apply(Math, itemVals);
                                        maxY = Math.max.apply(Math, itemVals);
                                    } else {
                                        minY = Math.min(minY, Math.min.apply(Math, itemVals));
                                        maxY = Math.max(maxY, Math.max.apply(Math, itemVals));
                                    }
                                    source.color = defColors[++colorIndex];
                                    colorArray = $scope.widgetColorScheme(defColors[colorIndex], countSPA+1);
                                    shadesColorIndex = 0;
                                } else {
                                    source.color = colorArray[++shadesColorIndex];
                                }
                                segmentId = $scope.segmentName2Id(source.segmentName);
                                if (widgetData.legendStatus && segmentId) {
                                    source.disabled = dashboardService.getLegendData(
                                        widgetData.legendStatus[segmentId],
                                        source.isPrimaryDateRange,
                                        source.isPrimaryMetric
                                    );
                                }
                            });
                            revisedYRange = $scope.reviseMinMaxRange(minY, maxY, true);
                            chart = nv.models.lineChart()
                                //Adjust chart margins to give the x-axis some breathing room.
                                .margin({left: 100})
                                .x(function(d, i) {
                                    return i;
                                    //return Date.parse(d.date);
                                })
                                .y(function (d) {
                                    return d.value;
                                })
                                //.interpolate('linear')
                                //We want nice looking tooltips and a guideline!
                                .useInteractiveGuideline(true)
                                //Show the legend, allowing users to turn on/off line series.
                                .showLegend(isShowLegend)
                                //Show the y-axis
                                .showYAxis(true)
                                //Show the x-axis
                                .showXAxis(true)
                                //how fast do you want the lines to transition?
                                .transitionDuration(350)
                                .color(defColors)
                                .height(270);
                                //.yScale().domain([minY, maxY]);

                            chart.lines.yDomain(revisedYRange);

                            chart.size(function (d) {
                                return 28;
                            });

                            chart.xAxis     //Chart x-axis settings
                                //.axisLabel('Date/Time')
                                .rotateLabels(-45)
                                /*.tickFormat(function(d,i) {
                                 if (typeof i === 'undefined' || i >=  widgetData.dataSource[0].values.length)
                                 return '';
                                 return widgetData.dataSource[0].values[i].label;
                                 })*/
                                .tickFormat(function(d) {
                                    if(d in widgetData.dataSource[0].values) {
                                        return widgetData.dataSource[0].values[d].label;
                                    } else {
                                        return '';
                                    }
                                    //return new Date(d).toDateString().substring(4);
                                })
                                .orient('bottom');

                            chart.yAxis     //Chart y-axis settings
                                .axisLabel(widgetData.metric.name)
                                .tickFormat(function (d) {
                                    return $scope.numberFormat(d);
                                });

                            chart.isArea(true);
                            chart.legend.dispatch.on('stateChange.line', function(d,i){
                                $scope.updateLegendStatus(widgetData);
                            });
                            d3.select('#timeline-widget-' + widgetData._id + ' svg')
                                .html('')
                                .datum(widgetData.dataSource)
                                .call(chart);
                            /*.selectAll('text')
                             .style('text-anchor','end')
                             .attr('dx', '-.8em')
                             .attr('dy', '.15em')
                             .attr('transform', function(d) {
                             return 'rotate(-15)';
                             });*/
                        } else {
                            angular.forEach(widgetData.dataSource, function ( source, idx ) {
                                itemVals = $.map(source.values, function(item){ return item.value; });
                                if (!source.isPrimaryMetric) {
                                    source.bar = false;
                                    source.metricName = widgetData.compareMetric.name;
                                    if (idx === 1) {
                                        minY2 = Math.min.apply(Math, itemVals);
                                        maxY2 = Math.max.apply(Math, itemVals);
                                    } else {
                                        minY2 = Math.min( minY2 , Math.min.apply(Math, itemVals));
                                        maxY2 = Math.max( maxY2 , Math.max.apply(Math, itemVals));
                                    }
                                } else {
                                    source.bar = true;
                                    source.metricName = widgetData.metric.name;
                                    if (idx === 0) {
                                        minY = Math.min.apply(Math, itemVals);
                                        maxY = Math.max.apply(Math, itemVals);
                                    } else {
                                        minY = Math.min( minY , Math.min.apply(Math, itemVals));
                                        maxY = Math.max( maxY , Math.max.apply(Math, itemVals));
                                    }
                                }
                                if (!source.isAggregation) {
                                    source.color = defColors[++colorIndex];
                                    colorArray = $scope.widgetColorScheme(defColors[colorIndex], countSPA+1);
                                    shadesColorIndex = 0;
                                } else {
                                    source.color = colorArray[++shadesColorIndex];
                                }
                                segmentId = $scope.segmentName2Id(source.segmentName);
                                if (widgetData.legendStatus && segmentId) {
                                    source.disabled = dashboardService.getLegendData(
                                        widgetData.legendStatus[segmentId],
                                        source.isPrimaryDateRange,
                                        source.isPrimaryMetric
                                    );
                                }
                            });

                            revisedYRange = $scope.reviseMinMaxRange(minY, maxY, true);
                            revisedY2Range = $scope.reviseMinMaxRange(minY2, maxY2, true);

                            if (widgetData.compareAsBar) {
                                chart = nv.models.linePlusBarChart2()
                                    .margin({top: 30, right: 80, bottom: 50, left: 80})
                                    .x(function(d, i) {
                                        return i;
                                        //return Date.parse(d.date);
                                    })
                                    .y(function(d) {
                                        return d.value;
                                    })
                                    .interpolate('linear')
                                    .useInteractiveGuideline(true)
                                    //Show the legend, allowing users to turn on/off line series.
                                    .showLegend(isShowLegend)
                                    .color(d3.scale.category20().range())
                                    .height(270);
                            } else {
                                chart = nv.models.linePlusLineChart()
                                    .margin({left: 100, right: 100})
                                    .x(function(d, i) {
                                        return i;
                                        //return Date.parse(d.date);
                                    })
                                    .y(function(d) {
                                        return d.value;
                                    })
                                    .interpolate('linear')
                                    .useInteractiveGuideline(true)
                                    //Show the legend, allowing users to turn on/off line series.
                                    .showLegend(isShowLegend)
                                    .color(d3.scale.category10().range())
                                    .height(270);
                            }

                            chart.bars.yDomain(revisedYRange);
                            chart.lines.yDomain(revisedY2Range);

                            chart.size(function (d) {
                                return 28;
                            });

                            chart.xAxis     //Chart x-axis settings
                                //.axisLabel('Date/Time')
                                .rotateLabels(-45)
                                /*.tickFormat(function(d,i) {
                                 if (typeof i === 'undefined' || i >=  widgetData.dataSource[0].values.length)
                                 return '';
                                 return widgetData.dataSource[0].values[i].label;
                                 })*/
                                .tickFormat(function(d) {
                                    if(d in widgetData.dataSource[0].values) {
                                        return widgetData.dataSource[0].values[d].label;
                                    } else {
                                        return '';
                                    }
                                    //return new Date(d).toDateString().substring(4);
                                })
                                .orient('bottom');

                            chart.y1Axis     //Chart y-axis settings
                                .axisLabel(widgetData.metric.name)
                                .tickFormat(function (d) {
                                    return $scope.numberFormat(d);
                                });

                            chart.y2Axis
                                .axisLabel(widgetData.compareMetric.name)
                                .tickFormat(function (d) {
                                    return $scope.numberFormat(d);
                                });


                            if (chart.isArea) {
                                chart.isArea(true);
                            }
                            chart.legend.dispatch.on('stateChange.linePlusBar', function(d,i){
                                $scope.updateLegendStatus(widgetData);
                            });

                            d3.select('#timeline-widget-' + widgetData._id + ' svg')
                                .html('')
                                .datum(widgetData.dataSource)
                                .transition()
                                .duration(0)
                                .call(chart);
                        }

                        // nv.utils.windowResize(chart.update);
                        nv.utils.windowResize(function() {
                            d3.select('#timeline-widget-' + widgetData._id + ' svg').call(chart);
                        });
                        return chart;
                    });
                } else if (widgetData.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Bar) {
                    var chart = null;
                    var itemVals, minY = 0, maxY = 0, segmentId;
                    var revisedYRange;
                    var defColors = d3.scale.category20().range();
                    var colorIndex = -1;
                    var shadesColorIndex = 0;
                    var countSPA = widgetData.singlePointAggregation.length;
                    var colorArray = [];

                    nv.addGraph(function() {
                        angular.forEach(widgetData.dataSource, function (source, idx) {
                            if (!source.isAggregation) {
                                source.bar = true;
                                itemVals = $.map(source.values, function (item) {
                                    return item.value;
                                });
                                if (idx === 0) {
                                    minY = Math.min.apply(Math, itemVals);
                                    maxY = Math.max.apply(Math, itemVals);
                                } else {
                                    minY = Math.min(minY, Math.min.apply(Math, itemVals));
                                    maxY = Math.max(maxY, Math.max.apply(Math, itemVals));
                                }
                                source.color = defColors[++colorIndex];
                                colorArray = $scope.widgetColorScheme(defColors[colorIndex], countSPA+1);
                                shadesColorIndex = 0;
                                colorIndex = colorIndex + 2;
                            } else {
                                source.bar = false;
                                source.color = colorArray[++shadesColorIndex];
                            }
                            segmentId = $scope.segmentName2Id(source.segmentName);
                            if (widgetData.legendStatus && segmentId) {
                                source.disabled = dashboardService.getLegendData(
                                    widgetData.legendStatus[segmentId],
                                    source.isPrimaryDateRange,
                                    source.isPrimaryMetric
                                );
                            }
                        });
                        if (minY === maxY) {
                            minY = 0;
                        }
                        revisedYRange = $scope.reviseMinMaxRange(minY, maxY, true);

                        if (widgetData.singlePointAggregation.length < 1) {
                            // Bar chart without SPA values
                            chart = nv.models.multiBarChart()
                                .x(function (d, i) {
                                    return i;
                                })
                                .y(function (d) {
                                    return d.value;
                                })
                                .color(d3.scale.category10().range())
                                .transitionDuration(350)
                                .showLegend(isShowLegend)
                                .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                                .rotateLabels(0)      //Angle to rotate x-axis labels.
                                .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                                .groupSpacing(0.2)    //Distance between each group of bars.
                                .height(270);

                            //chart = $scope.setGroupDimension(chart, widgetData);
                            chart.multibar.yDomain(revisedYRange);

                            chart.xAxis     //Chart x-axis settings
                                .rotateLabels(-45)
                                .tickFormat(function (d) {
                                    if (d in widgetData.dataSource[0].values) {
                                        return widgetData.dataSource[0].values[d].label;
                                    } else {
                                        return '';
                                    }
                                })
                                .orient('bottom');

                            chart.yAxis
                                .axisLabel(widgetData.metric.name)
                                .tickFormat(function (d) {
                                    return $scope.numberFormat(d);
                                });

                            chart.margin({left: 80});
                            chart.legend.dispatch.on('stateChange.multiBar', function(d,i){
                                $scope.updateLegendStatus(widgetData);
                            });
                            d3.select('#bar-widget-' + widgetData._id + ' svg')
                                .html('')
                                .datum(widgetData.dataSource)
                                .call(chart);
                        } else {
                            // Bar chart with SPA values
                            chart = nv.models.linePlusBarChart2()
                                .margin({top: 30, right: 80, bottom: 50, left: 80})
                                .x(function(d, i) {
                                    return i;
                                    //return Date.parse(d.date);
                                })
                                .y(function(d) {
                                    return d.value;
                                })
                                .interpolate('linear')
                                .useInteractiveGuideline(true)
                                //Show the legend, allowing users to turn on/off line series.
                                .showLegend(isShowLegend)
                                .color(d3.scale.category20().range())
                                .height(270);

                            chart.bars.yDomain(revisedYRange);
                            chart.lines.yDomain(revisedYRange);

                            chart.size(function (d) {
                                return 28;
                            });

                            chart.xAxis     //Chart x-axis settings
                                .rotateLabels(-45)
                                .tickFormat(function(d) {
                                    if(d in widgetData.dataSource[0].values) {
                                        return widgetData.dataSource[0].values[d].label;
                                    } else {
                                        return '';
                                    }
                                })
                                .orient('bottom');

                            chart.y1Axis     //Chart y-axis settings
                                .axisLabel(widgetData.metric.name)
                                .tickFormat(function (d) {
                                    return $scope.numberFormat(d);
                                });

                            chart.y2Axis
                                .axisLabel(widgetData.metric.name)
                                .tickFormat(function (d) {
                                    return $scope.numberFormat(d);
                                });

                            if (chart.isArea) {
                                chart.isArea(true);
                            }
                            chart.legend.dispatch.on('stateChange.multiBar', function(d,i){
                                $scope.updateLegendStatus(widgetData);
                            });
                            d3.select('#bar-widget-' + widgetData._id + ' svg')
                                .html('')
                                .datum(widgetData.dataSource)
                                .transition()
                                .duration(0)
                                .call(chart);
                        }

                        // nv.utils.windowResize(chart.update);
                        nv.utils.windowResize(function() {
                            d3.select('#bar-widget-' + widgetData._id + ' svg').call(chart);
                        });
                        return chart;
                    });
                }  else if (widgetData.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Pie) {// Pie Widget
                    var i;
                    if (widgetData.groupDimension === '--Custom--' 
                        && widgetData.customGroupDimension.groupBySegment) { // Group by Segment -> One Pie
                        var dataSource = [];
                        
                        for (i = 0; i < widgetData.dataSource.length; i++) {
                            if (widgetData.dataSource[i].values && widgetData.dataSource[i].values.length > 0) {
                                dataSource.push({
                                    date: widgetData.dataSource[i].key,
                                    label: widgetData.dataSource[i].key,
                                    value: widgetData.dataSource[i].values[0].value
                                });
                            }
                        }
                        
                        nv.addGraph(function() {
                            var defColorArray = d3.scale.category10().range();
                            var colorArray = $scope.widgetColorScheme(defColorArray[0],
                                dataSource.length);

                            /*var total = d3.sum(dataSource, function(d){
                                return d.value;
                            });*/

                            var chart = nv.models.pieChartBottomLegend()
                                .x(function(d) {
                                    //var subTotal = d3.sum(d.values, function(e){return e.value;});
                                    //return  d.key + '-' + d3.round(100* subTotal / total, 1) + '%';
                                    //return (d.values.length > 1) ?
                                    // '[' + d.values[0].date + '-' + d.values[d.values.length-1].date + ']'
                                    // : d.values[0].date;
                                    return d.label;
                                })
                                .y(function(d) {
                                    return d.value;
                                })
                                .color(colorArray)
                                .showLabels(true)
                                .labelType('percent')
                                .labelThreshold(0.05)
                                .donut(true)
                                .donutLabelsOutside(true)
                                .noData('No Data')
                                .tooltips(true)
                                .donutRatio(0.65)
                                .showLegend(true);

                            /*chart.legend.dispatch.on('stateChange.pie', function(d,i){
                                $scope.updateLegendStatus(widgetData, index, d['disabled']);
                            });*/
                            
                            d3.select('#pie-widget-' + widgetData._id + ' svg')
                                .html('')
                                .datum(dataSource)
                                .transition().duration(700)
                                .call(chart);

                            nv.utils.windowResize(chart.update);
                            /*nv.utils.windowResize(function() {
                                d3.select('#pie-widget-' + widgetData._id + ' svg').call(chart);
                            });*/
                            return chart;
                        });
                        
                    } else {
                        var j, defaultLegendData=[], legendStatues;
                        for (i = 0; i < widgetData.dataSource.length; i++) {
                            if (widgetData.dataSource[i].values && widgetData.dataSource[i].values.length > 0) {
                                for (j = 0; j < widgetData.dataSource[i].values.length; j++) {
                                    defaultLegendData.push({date: widgetData.dataSource[i].values[j].date, value: 1});
                                }
                                break;
                            }
                        }
                        angular.forEach(widgetData.dataSource, function(pieDataSource, index) {
                            if(pieDataSource) {
                                if ( !pieDataSource.values || pieDataSource.values.length === 0) {
                                    pieDataSource.values = defaultLegendData;
                                }
                                nv.addGraph(function() {

                                    var dataSource = [];
                                    dataSource = $scope.getSlicedData(widgetData.dataSource[index],
                                        widgetData.showUpTo || 1, widgetData.groupDimension);

                                    segmentId = $scope.segmentName2Id(pieDataSource.segmentName);
                                    if (widgetData.legendStatus && segmentId) {
                                        legendStatues = dashboardService.getLegendData(
                                            widgetData.legendStatus[segmentId],
                                            pieDataSource.isPrimaryDateRange,
                                            pieDataSource.isPrimaryMetric
                                        );
                                        if (legendStatues instanceof Array) {
                                            angular.forEach(dataSource.values, function ( source, idx ) {
                                                source.disabled = legendStatues[idx];
                                            });
                                        }
                                    }


                                    var defColorArray = d3.scale.category10().range();
                                    var colorArray = $scope.widgetColorScheme(defColorArray[index],
                                        dataSource.values.length);

                                    /*var total = d3.sum(dataSource, function(d){
                                        return d.value;
                                    });*/

                                    var chart = nv.models.pieChartBottomLegend()
                                        .x(function(d) {
                                            //var subTotal = d3.sum(d.values, function(e){return e.value;});
                                            //return  d.key + '-' + d3.round(100* subTotal / total, 1) + '%';
                                            //return (d.values.length > 1) ?
                                            // '[' + d.values[0].date + '-' + d.values[d.values.length-1].date + ']'
                                            // : d.values[0].date;
                                            return d.label;
                                        })
                                        .y(function(d) {
                                            return d.value;
                                        })
                                        .color(colorArray)
                                        .showLabels(true)
                                        .labelType('percent')
                                        .labelThreshold(0.05)
                                        .donut(true)
                                        .donutLabelsOutside(true)
                                        .noData('No Data')
                                        .tooltips(true)
                                        .donutRatio(0.65)
                                        .showLegend(isShowLegend);

                                    chart.legend.dispatch.on('stateChange.pie', function(d,i){
                                        $scope.updateLegendStatus(widgetData, index, d['disabled']);
                                    });
                                    d3.select('#pie-widget-' + widgetData._id + '-' + index + ' svg')
                                        .html('')
                                        .datum(dataSource.values)
                                        .transition().duration(700)
                                        .call(chart);

                                    nv.utils.windowResize(chart.update);
                                    /*nv.utils.windowResize(function() {
                                        d3.select('#pie-widget-' + widgetData._id + ' svg').call(chart);
                                    });*/
                                    return chart;
                                });
                            }
                        });
                    }

                } else if (widgetData.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Table) {// Table Widget
                    var currentDimension,
                        groupDimension = widgetData.groupDimension ? widgetData.groupDimension : 'Date',
                        colors = d3.scale.category10().range(),
                        dashboardEndDate = new Date($rootScope.selectedDashboard.endDate);

                    console.log ('Table Data source ', widgetData.dataSource);

                    var getDimension = function(date) {
                        switch(groupDimension) {
                            case 'Year':
                                return $filter('date')(date, 'yyyy');
                            case 'Month':
                                return $filter('date')(date, 'yyyy-MM');
                            case 'Week':
                                return $filter('date')(date, 'yyyy-MM-dd');
                            case 'Date':
                                return $filter('date')(date, 'yyyy-MM-dd');
                            case 'Hour':
                                return $filter('date')(date, 'yyyy-MM-dd-HH');
                            case 'Minute':
                                return $filter('date')(date, 'yyyy-MM-dd-HH-mm');
                            case 'Account': case 'Team Members with Access': case '--Custom--':
                                return date;
                            default:
                                return $filter('date')(date, 'yyyy-MM-dd');
                        }
                    };

                    var createDefaultDataForTableDatasource = function(data, key, label, columns) {
                        data[key] = {
                            'dimension': label
                        };
                        angular.forEach(columns, function( col, idx) {
                            data[key][idx] = 0;
                        });
                    };

                    var checkDateRange = function(date) {
                        if(date > dashboardEndDate) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    };

                    var bDataParseError = false;
                    var metricCount = 1;
                    var metricNames = (widgetData.metric) ? [widgetData.metric.name] : [];
                    
                    // Collect widget names and widget count.
                    if ( widgetData.compareMetric !== null && typeof widgetData.compareMetric === 'object'
                        && typeof widgetData.compareMetric._id !== 'undefined') {
                        metricCount = 2;
                        metricNames.push(widgetData.compareMetric.name);
                    }

                    var drawInfo = {
                        columns: [],
                        param: {},
                        data: [],
                        mapData: {},
                        keys: [],
                        segments: [],
                        segmentNames: []
                    };
                    
                    // Collect segment names
                    angular.forEach(widgetData.dataSource, function (source, idx) {
                        var segIdx;
                        if ((segIdx = drawInfo.segmentNames.indexOf(source.key)) < 0) {
                            drawInfo.segmentNames.push(source.key);
                            drawInfo.segments.push({
                                title: source.key,
                                colCnt: 1
                                /*color: colors[(drawInfo.segmentNames.length - 1) % 10]*/
                            });
                        } else {
                            drawInfo.segments[segIdx].colCnt += 1;

                        }
                    });

                    // Check if response data is correct.
                    angular.forEach(drawInfo.segments, function (segment, idx) {
                        if (segment.colCnt !== metricCount) {
                            bDataParseError = true;
                        }
                    });

                    // create table columns from dataSource
                    angular.forEach(widgetData.dataSource, function (source, idx) {
                        var metricName = metricNames[0];

                        if(!source.isPrimaryMetric && metricNames.length > 1) {
                            metricName = metricNames[1];
                        }

                        drawInfo.columns.push({
                            title: metricName,
                            field: idx,
                            visible: true,
                            color: colors[idx % 10]
                        });
                    });

                    angular.forEach(widgetData.dataSource, function (source, idx) {
                        angular.forEach(source.values, function (value, idx2) {
                            if (groupDimension === 'Account' || groupDimension === 'Team Members with Access') {
                                currentDimension = getDimension(value.date);
                                if (typeof drawInfo.mapData[currentDimension] === 'undefined') {
                                    drawInfo.keys.push(currentDimension);
                                    createDefaultDataForTableDatasource(
                                        drawInfo.mapData, currentDimension, value.label, drawInfo.columns);
                                }
                                if (typeof value.value === 'number') {
                                    drawInfo.mapData[currentDimension][idx] += value.value;
                                }
                            } else if (groupDimension === '--Custom--') {
                                currentDimension = getDimension(value.date);
                                if (typeof drawInfo.mapData[currentDimension] === 'undefined') {
                                    drawInfo.keys.push(currentDimension);
                                    createDefaultDataForTableDatasource(
                                        drawInfo.mapData, currentDimension, value.label, drawInfo.columns);
                                }
                                if (typeof value.value === 'number') {
                                    drawInfo.mapData[currentDimension][idx] += value.value;
                                }
                            } else {
                                var curDate = new Date(value.date);

                                if(checkDateRange(curDate)) {
                                    currentDimension = getDimension(curDate);
                                    if (typeof drawInfo.mapData[currentDimension] === 'undefined') {
                                        drawInfo.keys.push(currentDimension);
                                        createDefaultDataForTableDatasource(
                                            drawInfo.mapData, currentDimension, value.label, drawInfo.columns);
                                    }
                                    if (typeof value.value === 'number') {
                                        drawInfo.mapData[currentDimension][idx] += value.value;
                                    }
                                }
                            }
                        });
                    });
                    drawInfo.keys.sort();
                    drawInfo.columns.unshift({
                        title: groupDimension,
                        field: 'dimension',
                        visible: true
                    });
                    angular.forEach(drawInfo.keys, function (key, idx) {
                        angular.forEach( drawInfo.mapData[key], function ( v, k ) {
                            if (typeof drawInfo.mapData[key][k] === 'number') {
                                drawInfo.mapData[key][k] = $scope.numberFormat(drawInfo.mapData[key][k]);
                            }
                        });
                        drawInfo.data.push(drawInfo.mapData[key]);

                    });

                    var tableParamsLoaded = false;
                    if(widgetData.drawInfo && widgetData.drawInfo.param) {
                        tableParamsLoaded = true;
                    }
                        
                    if(tableParamsLoaded) {
                        widgetData.drawInfo.param.parameters({
                            page: 1,
                            count: (widgetData.rowsPerTable === null) ? 5 : widgetData.rowsPerTable
                        }, true);

                        widgetData.drawInfo.param.settings({
                            counts: [],
                            total: drawInfo.keys.length,
                            getData: function ($defer, params) {
                                $defer.resolve(drawInfo.data.slice((params.page() - 1) * params.count(),
                                    params.page() * params.count()));
                            }
                        });

                        $timeout(function() {
                            widgetData.drawInfo.columns = drawInfo.columns;
                            widgetData.drawInfo.data = drawInfo.data;
                            widgetData.drawInfo.mapData = drawInfo.mapData;
                            widgetData.drawInfo.keys = drawInfo.keys;
                            widgetData.drawInfo.segments = drawInfo.segments;
                            widgetData.drawInfo.segmentNames = drawInfo.segmentNames;
                                
                            widgetData.drawInfo.param.reload();
                        }, 100);
                    }
                    else {
                        widgetData.drawInfo = drawInfo;

                        widgetData.drawInfo.param = new NgTableParams({
                            page: 1,
                            count: (widgetData.rowsPerTable === null) ? 5 : widgetData.rowsPerTable
                        }, {
                            counts: [],
                            total: drawInfo.keys.length,
                            getData: function ($defer, params) {
                                $defer.resolve(drawInfo.data.slice((params.page() - 1) * params.count(),
                                    params.page() * params.count()));
                            }
                        });
                    }
                    
                    widgetData.bLoaded = true;
                    
                    console.log('Table drawInfo', drawInfo);

                } else if (widgetData.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                    // Equivalencies Widget
                    
                    widgetData.drawInfo.segments = [];
                    angular.forEach(widgetData.dataSource, function (segmentValue, idx) {
                        var segment = {
                            value: segmentValue.values[widgetData.drawInfo.field],
                            color: colorsArray[idx % 10]
                        };
                        if (widgetData.co2Kilograms) {
                            segment.co2Kilograms = {
                                visible: true,
                                value: segmentValue.values.co2AvoidedInKilograms
                            };
                        }
                        if (widgetData.greenhouseKilograms) {
                            segment.greenhouseKilograms = {
                                visible: true,
                                value: segmentValue.values.greenhouseEmissionsInKilograms
                            };
                        }
                        widgetData.drawInfo.segments.push(segment);
                    });
                    widgetData.bLoaded = true;
                } else if (widgetData.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Kpi) {
                    // KPI Widget

                    widgetData.drawInfo = {
                        metrics: []
                    };

                    angular.forEach(widgetData.dataSource, function(metricValue, idx) {
                        if (typeof metricValue.value.value === 'undefined' || metricValue.value.value === null ) {
                            return;
                        }

                        var metricData = {
                            isPrimaryDateRange: metricValue.isPrimaryDateRange,
                            isPrimaryMetric: (metricValue.key === 'primaryMetric'),
                            label: metricValue.value.label,
                            value: metricValue.value.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            color: colorsArray[idx % 10]
                        };
                        widgetData.drawInfo.metrics.push(metricData);
                    });
                } else if (widgetData.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Boilerplate) {
                    widgetData.drawInfo = {};
                    switch (widgetData.boilerplateType) {
                        case 'Current Power':
                            widgetData.drawInfo.Production =
                                widgetUtilService.convertFormatFromString(widgetData.dataSource.Production, 'W');
                            widgetData.drawInfo.Consumption =
                                widgetUtilService.convertFormatFromString(widgetData.dataSource.Consumption, 'W');
                            break;
                        case 'Communication Monitoring':
                            widgetData.drawInfo.lastConnected = widgetData.dataSource.lastConnected ?
                                widgetData.dataSource.lastConnected : 'Now';
                            widgetData.drawInfo.lastConnectedFromNow = widgetData.dataSource.lastConnectedFromNow ?
                                widgetData.dataSource.lastConnectedFromNow : 'Now';
                            break;
                        case 'Energy Consumed':
                            widgetData.drawInfo.lastMonth =
                                widgetUtilService.convertFormat(widgetData.dataSource.lastMonth, 'Wh');
                            widgetData.drawInfo.total =
                                widgetUtilService.convertFormat(widgetData.dataSource.total, 'Wh');
                            break;
                        case 'Energy Produced':
                            widgetData.drawInfo.lastMonth =
                                widgetUtilService.convertFormat(widgetData.dataSource.lastMonth, 'Wh');
                            widgetData.drawInfo.total =
                                widgetUtilService.convertFormat(widgetData.dataSource.total, 'Wh');
                            break;
                        case 'Reimbursement':
                            widgetData.drawInfo.lastMonth =
                                widgetData.dataSource.lastMonth ? widgetData.dataSource.lastMonth : 0;
                            widgetData.drawInfo.total =
                                widgetData.dataSource.total ? widgetData.dataSource.total : 0;
                            break;
                        case 'CO2 Avoided':
                            widgetData.drawInfo.lastMonth =
                                widgetUtilService.convertFormat(widgetData.dataSource.lastMonth, 'Kg');
                            widgetData.drawInfo.total =
                                widgetUtilService.convertFormat(widgetData.dataSource.total, 'Kg');
                            break;
                        case 'System Information':
                            break;
                        case 'Weather':
                            break;
                        case 'Location':
                            break;
                    }
                    widgetData.bLoaded = true;
                }
            };

            /**
             * Remove widget from dashboard
             * @param {object} widget Removed widget
             * @return {object}
             */
            $scope.removeWidget = function (widget) {
                $scope.closeActionsDropdown();
                widgetService
                    .removeWidgetFromDashboard($rootScope.selectedDashboard._id, widget._id)
                    .then(function() {
                        //Make the deleted widget invisible.
                        angular.element(document.querySelector('#widget-container-' + widget._id))
                            .addClass('fading-out');
                        widget.isDeleted = true;
                        //Delay widget deletion until it fades out.
                        $timeout(function() {
                            angular.forEach($scope.columns, function (column) {
                                var widgetsOfColumn = $scope.columnWidgets[column.name];
                                angular.forEach(widgetsOfColumn, function (w, wIdx) {
                                    if (widget._id === w._id) {
                                        $scope.columnWidgets[column.name].splice(wIdx, 1);
                                    }
                                });
                            });
                            var selectedDashboardWidgets = $rootScope.selectedDashboard.widgets;
                            angular.forEach(selectedDashboardWidgets, function(w, wIdx) {
                                if (w.widget._id === widget._id) {
                                    $rootScope.selectedDashboard.widgets.splice(wIdx, 1);
                                }
                            });
                        }, 1500);
                    });
            };

            /**
             * Reflect updated widget in dashboard as soon as it is updated
             * @param {object} updatedWidgetWrapper updated widget wrapper
             * @return {object}
             */
            $scope.applyUpdatedWidgetToDashboard = function(updatedWidgetWrapper) {
                /*var updatedWidgetWrapper;*/
                var selectedDashboardWR = $rootScope.selectedDashboard.widgets.filter(function (w) {
                    return w.widget._id === updatedWidgetWrapper.widget._id;
                }).pop();

                d3.select('#widget-container-' + selectedDashboardWR.widget._id).selectAll('svg')
                    .html('');

                angular.extend(selectedDashboardWR, updatedWidgetWrapper);

                selectedDashboardWR.widget.bLoaded = false;

                if (selectedDashboardWR.widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Image) {
                    selectedDashboardWR.widget.bLoaded = true;
                    return ;
                }

                widgetService
                    .getWidgetData($rootScope.selectedDashboard, selectedDashboardWR)
                    .then(function () {
                        dashboardService.updateCachedWidgetData(selectedDashboardWR);
                        $rootScope.$broadcast('selectedDashboardChanged', {});
                    });
            };

            /**
             * Generate Html doc corresponding to widget data
             * @param {object} widget
             * @return {object}
             */
            $scope.generateDataDoc = function(widget) {
                var widgetType = widget.type, widgetDataSource = widget.dataSource;
                var generatedDoc = '<div class="wrapper-pdf">';
                var dateRangeData = {
                    primaryDateRange: [],
                    compareDateRange: []
                };

                angular.forEach(widgetDataSource, function(iterator) {
                    if (iterator.isPrimaryDateRange) {
                        dateRangeData.primaryDateRange.push(iterator);
                    } else {
                        dateRangeData.compareDateRange.push(iterator);
                    }
                });

                var metricNames = (widget.metric) ? [widget.metric.name] : [];
                    
                // Collect widget names and widget count.
                if ( widget.compareMetric !== null && typeof widget.compareMetric === 'object'
                    && typeof widget.compareMetric._id !== 'undefined') {
                    metricNames.push(widget.compareMetric.name);
                }

                if (widgetType === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Timeline ||
                    widgetType === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Pie ||
                    widgetType === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Bar ||
                    widgetType === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Table) {
                    angular.forEach(dateRangeData, function(dateRangeValue, dateRangeKey) {
                        if (dateRangeValue.length === 0) {
                            return;
                        }
                        /*
                        if (dateRangeKey === 'primaryDateRange' && $rootScope.selectedDashboard.startDate !== null &&
                            $rootScope.selectedDashboard.endDate !== null) {
                            generatedDoc += '<h4>' + $rootScope.selectedDashboard.startDate.toString() + ' - ' +
                            $rootScope.selectedDashboard.endDate.toString() + '</h4>';
                        } else if (dateRangeKey === 'compareDateRange' &&
                            $rootScope.selectedDashboard.compareStartDate !== null &&
                            $rootScope.selectedDashboard.compareEndDate !== null) {
                            generatedDoc += '<h4>' + $rootScope.selectedDashboard.compareStartDate.toString() + ' - ' +
                            $rootScope.selectedDashboard.compareEndDate.toString() + '</h4>';
                        }
                        */
                        angular.forEach(dateRangeValue, function(segmentData) {
                            if (segmentData.values.length === 0) {
                                return;
                            }

                            var dataKey = segmentData.key;
                            if(widgetType === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Table) {
                                var metricName = (!segmentData.isPrimaryMetric && metricNames.length === 2) ? 
                                    metricNames[1]: metricNames[0];
                                dataKey = dataKey + '(' + metricName + ')';
                            }
                            generatedDoc += '<div class="page-pdf"><table><thead><tr><th>Date</th><th>' +
                                dataKey + '</th></tr></thead><tbody>';
                            angular.forEach(segmentData.values, function(item) {
                                generatedDoc += '<tr><td>' + item.label + '</td><td>' + item.value + '</td></tr>';
                            });
                            generatedDoc += '</tbody></table></div>';
                        });
                    });
                } else if (widgetType === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Image) {
                    generatedDoc = '';
                } else if (widgetType === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                    angular.forEach(dateRangeData, function(dateRangeValue, dateRangeKey) {
                        if (dateRangeValue.length === 0) {
                            return;
                        }
                        /*
                        if (dateRangeKey === 'primaryDateRange' && $rootScope.selectedDashboard.startDate !== null &&
                            $rootScope.selectedDashboard.endDate !== null) {
                            generatedDoc += '<h4>' + $rootScope.selectedDashboard.startDate.toString() + ' - ' +
                            $rootScope.selectedDashboard.endDate.toString() + '</h4>';
                        } else if (dateRangeKey === 'compareDateRange' &&
                            $rootScope.selectedDashboard.compareStartDate !== null &&
                            $rootScope.selectedDashboard.compareEndDate !== null) {
                            generatedDoc += '<h4>' + $rootScope.selectedDashboard.compareStartDate.toString() + ' - ' +
                            $rootScope.selectedDashboard.compareEndDate.toString() + '</h4>';
                        }
                        */
                        angular.forEach(dateRangeValue, function(segmentData) {
                            if (typeof segmentData.values !== 'object') {
                                return;
                            }

                            generatedDoc += '<div class="page-pdf">' +
                                '<table><thead><tr><th>Field</th><th>' + segmentData.key + '</th></tr></thead><tbody>';
                            angular.forEach(segmentData.values, function(itemValue, itemKey) {
                                generatedDoc +=  '<tr><td>' + itemKey + '</td><td>' + itemValue + '</td></tr>';
                            });
                            generatedDoc += '</tbody></table></div>';
                        });
                    });
                } else if (widgetType === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Kpi) {
                    if (dateRangeData.primaryDateRange.length > 0) {
                        generatedDoc += '<h3>Summary Method: ' + widget.summaryMethod + '</h3><br>';
                    }

                    generatedDoc += '<div class="page-pdf">' +
                        '<table><thead><tr><th>Metric</th><th>Label</th><th>Value</th></tr></thead><tbody>';
                    
                    angular.forEach(dateRangeData, function(dateRangeValue, dateRangeKey) {
                        if (dateRangeValue.length === 0) {
                            return;
                        }
                        /*
                        if (dateRangeKey === 'primaryDateRange' && $rootScope.selectedDashboard.startDate !== null &&
                            $rootScope.selectedDashboard.endDate !== null) {
                            generatedDoc += '<h4>' + $rootScope.selectedDashboard.startDate.toString() + ' - ' +
                            $rootScope.selectedDashboard.endDate.toString() + '</h4>';
                        } else if (dateRangeKey === 'compareDateRange' &&
                            $rootScope.selectedDashboard.compareStartDate !== null &&
                            $rootScope.selectedDashboard.compareEndDate !== null) {
                            generatedDoc += '<h4>' + $rootScope.selectedDashboard.compareStartDate.toString() + ' - ' +
                            $rootScope.selectedDashboard.compareEndDate.toString() + '</h4>';
                        }
                        */
                        angular.forEach(dateRangeValue, function(metricData) {
                            if (typeof metricData.value.value === 'undefined' || metricData.value.value === null) {
                                return;
                            }
                            if (metricData.key === 'primaryMetric') {
                                generatedDoc += '<tr><td>' + widget.metric.name + '</td><td>' +
                                    metricData.value.label + '</td><td>' + metricData.value.value + '</td></tr>';
                            } else {
                                generatedDoc += '<tr><td>' + widget.compareMetric.name + '</td><td>' +
                                    metricData.value.label + '</td><td>' + metricData.value.value + '</td></tr>';
                            }
                        });
                    });
                    
                    generatedDoc += '</tbody></table></div><br>';
                } else {
                    generatedDoc = '';
                }
                generatedDoc += '<div style="clear: both"></div></div>';

                return generatedDoc;
            };

            /**
             * Open export widget dialog and export in appropriate format
             * @param {object} widget
             * @return {object}
             */
            $scope.exportWidget = function(widget) {
                $scope.closeActionsDropdown();

                var modalInstance = $uibModal.open({
                    templateUrl: 'modalExportWidget.html',
                    controller: 'ExportWidgetController',
                    windowClass: 'bl-modal-export-widget-wrapper'
                });

                modalInstance.result.then(function(inputJson) {
                    var exportFormat = inputJson.exportFormat;
                    var exportDataType = inputJson.exportDataType;
                    var operation = inputJson.operation;
                    var exportData = {};
                    var exportFile = encodeURI($rootScope.selectedDashboard.title + '_' + widget.title 
                        + '_' + (new Date()).getTime());

                    if (exportFormat === 'pdf') {
                        exportData = {
                            title: '<h1>' + widget.title + '</h1>',
                            style: '',
                            data: null,
                            chart: null
                        };
                        
                        var chartDoc = angular.element(document.querySelector('.ds-widget-content-' + widget._id))[0].
                            innerHTML;
                        var svgWidth = angular.element(document.querySelector('.ds-widget-content-' + widget._id)).
                            width();
                        var svgHeight = angular.element(document.querySelector('.ds-widget-content-' + widget._id)).
                            height() + 50;

                        if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Timeline) {
                            chartDoc = '<div class="ds-timeline-widget">' + chartDoc + '</div>';
                        } else if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Pie) {
                            // svgWidth = angular.element(document.querySelector('#pie-widget-'+widget._id+'-0')).
                            //    width();
                            chartDoc = '<div class="ds-pie-widget" style="margin-bottom: 80px; margin-top: -50px;">' +
                                chartDoc + '</div>';
                        } else if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Bar) {
                            chartDoc = '<div class="ds-bar-widget" style="float:none; width:auto">' + 
                                chartDoc + '</div>';
                        } else if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                            var classStr = 'ds-equivalencies-widget ' + widget.drawInfo.class;
                            if (widget.isGreenView) {
                                classStr += ' ds-equivalencies-widget-container-green';
                            }
                            chartDoc = '<div class="ds-equivalencies-widget-container">' +
                                '<div class="' + classStr + '"><div class="ds-equivalencies-widget-content">' +
                            chartDoc + '</div></div></div>';
                            svgWidth = 720;
                        } else if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Table) {
                            chartDoc = angular.element(document.querySelector('.ds-widget-content-' + 
                                widget._id + ' table.table'))[0].outerHTML;
                            chartDoc = '<div class="ds-table-widget">' + chartDoc + '</div>';
                        } else if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Kpi) {
                            chartDoc = '<div class="ds-kpi-widget">' + chartDoc + '</div>';
                        }
                        
                        chartDoc = '<div style="margin: 20px auto; width: ' + svgWidth + 'px;">' + 
                            chartDoc + '</div>';
                        
                        exportData.style = '.ng-hide {display: none !important} ';
                            // + 'svg{width: ' + svgWidth + 'px !important; height: ' + svgHeight + 'px !important;} ';

                        exportData.width = svgWidth;
                        exportData.height = svgHeight;
                        
                        if (exportDataType.chart) {
                            exportData.chart = chartDoc;
                        }
                        
                        if (exportDataType.data) {
                            exportData.data = $scope.generateDataDoc(widget);
                        }
                    } else if (exportFormat === 'csv') {
                        exportData = {
                            fields: [],
                            values: []
                        };
                        var widgetDataSource = widget.dataSource;
                        if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Timeline ||
                            widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Pie ||
                            widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Bar ||
                            widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Table) {

                            angular.forEach(widgetDataSource, function(segmentData) {
                                console.log(segmentData);
                                var dateRangeValue = '';
                                if (segmentData.isPrimaryDateRange) {
                                    if ($rootScope.selectedDashboard.startDate !== null &&
                                        $rootScope.selectedDashboard.endDate !== null) {
                                        dateRangeValue = $rootScope.selectedDashboard.startDate.toString() + ' - ' +
                                        $rootScope.selectedDashboard.endDate.toString();
                                    }
                                } else {
                                    if ($rootScope.selectedDashboard.compareStartDate !== null &&
                                        $rootScope.selectedDashboard.compareEndDate !== null) {
                                        dateRangeValue = $rootScope.selectedDashboard.compareStartDate.toString() +
                                        ' - ' + $rootScope.selectedDashboard.compareEndDate.toString();
                                    }
                                }
                                var metricValue =
                                    (segmentData.isPrimaryMetric)? widget.metric.name: widget.compareMetric.name;
                                var segmentName = segmentData.key;
                                angular.forEach(segmentData.values, function(item) {
                                    var rowData = {
                                        DateRange: dateRangeValue,
                                        Metric: metricValue,
                                        Segment: segmentName,
                                        Date: item.label,
                                        Value: item.value
                                    };
                                    exportData.values.push(rowData);
                                });
                            });
                            exportData.fields.push('DateRange', 'Metric', 'Segment', 'Date', 'Value');
                        } else if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Equivalencies) {
                            angular.forEach(widgetDataSource, function(segmentData) {
                                var dateRangeValue = '';
                                if (segmentData.isPrimaryDateRange) {
                                    if ($rootScope.selectedDashboard.startDate !== null &&
                                        $rootScope.selectedDashboard.endDate !== null) {
                                        dateRangeValue = $rootScope.selectedDashboard.startDate.toString() + ' - ' +
                                        $rootScope.selectedDashboard.endDate.toString();
                                    }
                                } else {
                                    if ($rootScope.selectedDashboard.compareStartDate !== null &&
                                        $rootScope.selectedDashboard.compareEndDate !== null) {
                                        dateRangeValue = $rootScope.selectedDashboard.compareStartDate.toString() +
                                        ' - ' + $rootScope.selectedDashboard.compareEndDate.toString();
                                    }
                                }
                                var metricValue =
                                    (segmentData.isPrimaryMetric)? widget.metric.name: widget.compareMetric.name;
                                var segmentName = segmentData.key;
                                angular.forEach(segmentData.values, function(itemValue, itemKey) {
                                    var rowData = {
                                        DateRange: dateRangeValue,
                                        Metric: metricValue,
                                        Segment: segmentName,
                                        Field: itemKey,
                                        Value: itemValue
                                    };
                                    exportData.values.push(rowData);
                                });
                            });
                            exportData.fields.push('DateRange', 'Metric', 'Segment', 'Field', 'Value');
                        } else if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Kpi) {
                            angular.forEach(widgetDataSource, function(metricData) {
                                if (typeof metricData.value.value === 'undefined' || metricData.value.value === null) {
                                    return;
                                }
                                var dateRangeValue = '';
                                if (metricData.isPrimaryDateRange) {
                                    if ($rootScope.selectedDashboard.startDate !== null &&
                                        $rootScope.selectedDashboard.endDate !== null) {
                                        dateRangeValue = $rootScope.selectedDashboard.startDate.toString() + ' - ' +
                                            $rootScope.selectedDashboard.endDate.toString();
                                    }
                                } else {
                                    if ($rootScope.selectedDashboard.compareStartDate !== null &&
                                        $rootScope.selectedDashboard.compareEndDate !== null) {
                                        dateRangeValue = $rootScope.selectedDashboard.compareStartDate.toString() +
                                            ' - ' + $rootScope.selectedDashboard.compareEndDate.toString();
                                    }
                                }
                                var metricValue = (metricData.key === 'primaryMetric')? 
                                    widget.metric.name: widget.compareMetric.name;
                                var label = metricData.value.label;
                                var value = metricData.value.value;
                                var rowData = {
                                    DateRange: dateRangeValue,
                                    Metric: metricValue,
                                    Label: label,
                                    Value: value
                                };
                                exportData.values.push(rowData);
                            });
                            exportData.fields.push('DateRange', 'Metric', 'Label', 'Value');
                        }
                    }

                    widgetService
                        .exportWidget(widget._id, exportFormat, exportFile, exportData)
                        .then(function (resp) {
                            widget.exportedResourceUrl = resp.exportedResourceUrl;
                            if (operation === 'download-content') {
                                $timeout(function() {
                                    angular.element(document.querySelector('.exported-widget-' + widget._id))[0].
                                        click();
                                }, 100);
                            }
                        }, function (errMsg) {
                            notifyService.errorNotify('Error occurred while trying to save exported document.');
                        });
                });
            };

            /**
             * Open edit widget dialog and update widget when saved
             * @param {object} widget Editted widget data
             * @return {object}
             */
            $scope.editWidget = function (widget) {
                $scope.closeActionsDropdown();

                var modalInstance = $uibModal.open({
                    templateUrl: 'modalAddNewWidget.html',
                    controller: 'AddNewWidgetController',
                    resolve: {
                        'selectedWidget': function () {
                            return widget;
                        }
                    }
                });

                modalInstance.result.then(function(inputJson) {
                    // send _id key to backend which will operate edit action
                    inputJson._id = widget._id;
                    //$rootScope.processingWidget = true;
                    if (inputJson.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Pie) {
                        inputJson.showUpTo = parseInt(inputJson.showUpTo);
                    }

                    /*widgetService.updateWidget(inputJson, $rootScope.selectedDashboard), function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            $scope.applyUpdatedWidgetToDashboard(data);
                        }
                    });*/
                    widget.bLoaded = false;
                    widgetService
                        .updateWidget(inputJson, $rootScope.selectedDashboard)
                        .then(function (updatedWidgetWrapper) {
                            $scope.applyUpdatedWidgetToDashboard(updatedWidgetWrapper);
                        });
                }, function() {
                    console.log('[DATA SENSE] Modal dismissed');
                });
            };

            /**
             * Close widget actions dropdown menu
             * @param {string}
             * @return {object}
             */
            $scope.closeActionsDropdown = function () {
                $('.ds-widget .dropdown.open').removeClass('open');
            };

            /**
             * Format y-axis tick values properly
             * @param value {number}
             * @returns {formatted string}
             */
            $scope.numberFormat = function (value) {
                var format1 = d3.format(',.02f');
                var format2 = d3.format(',d');
                if (value < 1000) {                //less than 1,000
                    return format1(value);
                } else if (value < 1000000000) {    //less than billion
                    return format2(parseInt(value));
                } else {                            // greater than billion then trim
                    var prefix = d3.formatPrefix(value);
                    return prefix.scale(value).toFixed(2) + prefix.symbol;
                }
            };

            /**
             * Revise Min / Max value for Timeline, Bar widgets
             *  ex: 0, 100, 200 ...
             * @param 
             *     min {number}  :  min 
             *     max {number}  :  max
             * @return
             *     [modifiedMin, modifiedMin] {object}
             */
            $scope.reviseMinMaxRange = function (min, max, isZeroCut) {
                var diff, rMin, rMax, offset;
                diff = (max - min) * 0.1;
                rMin = Math.floor(min - diff);
                rMax = Math.ceil(max + diff);
                diff = Math.floor(Math.log(rMax - rMin) / Math.LN10);
                if (diff > 0 && isFinite(diff) && !isNaN(diff)) {
                    offset = Math.pow(10, diff);
                    rMin = parseInt(Math.floor(rMin / offset) * offset);
                    rMax = parseInt(Math.ceil(rMax / offset) * offset);
                }
                if (isZeroCut) {
                    if (min >= 0 && rMin < 0) {
                        rMin = 0;
                    }
                    if (max <= 0 && rMax > 0) {
                        rMax = 0;
                    }
                }
                return [rMin, rMax];
            };

            //when update segment, redraw dashboard widgets
            $scope.$on('drawDashboardWidgets', function(message, options) {
                console.log('redraw');
                $scope.drawDashboardWidgets();
            });

            /**
             * Toggle widget expand / collapse status
             * @param widget {object}
             * @returns none
             */

            $scope.toggleWidget = function (widget) {
                //$( '.ds-widget-content-'+widget._id ).toggle( 'blind', {}, 500 );
                if (typeof widget.collapsed === 'undefined') {
                    widget.collapsed = true;
                } else {
                    widget.collapsed = !widget.collapsed;
                }
                widgetService.updateWidget(widget, $rootScope.selectedDashboard);
            };

            $scope.onContextMenu = function (widget) {
                $scope.rightClickedWidget = widget;
            };

            $scope.onContextMenuClose = function () {
                //$scope.rightClickedWidget = null;
                
            };

            $scope.onContextMenuItem = function(menuItem, menuItemEvent) {
                $timeout(function() {
                    if(menuItem === 'minimize') {
                        angular.element('#widget-container-' + $scope.rightClickedWidget._id 
                            + ' .ds-widget-action-toggle').trigger('click');    
                    }
                    else if(menuItem === 'edit') {
                        angular.element('#widget-container-' + $scope.rightClickedWidget._id 
                            + ' .ds-widget-action-edit').trigger('click');    
                    }
                    else if(menuItem === 'delete') {
                        angular.element('#widget-container-' + $scope.rightClickedWidget._id 
                            + ' .ds-widget-action-delete').trigger('click');    
                    }
                    else if(menuItem === 'export') {
                        angular.element('#widget-container-' + $scope.rightClickedWidget._id 
                            + ' .ds-widget-action-export').trigger('click');    
                    }  
                }, 10);
                
                menuItemEvent.stopPropagation();
            };

            /**
             * Toggle widget's legend area
             * @param widget {object}
             * @returns none
             */

            $scope.toggleLegend = function (widget) {
                if (typeof widget.legendVisible === 'undefined') {
                    widget.legendVisible = true;
                } else {
                    widget.legendVisible = !widget.legendVisible;
                }
                widgetService.updateWidget(widget, $rootScope.selectedDashboard, function(err, data) {});
                $scope.drawChart(widget);
            };

            /**
             * Maintenance legend status.
             */

            $scope.updateLegendStatus = function (widget, index, value) {
                widget.legendStatus = widget.legendStatus ? widget.legendStatus: {};
                if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Pie) {
                    var sName = widget.dataSource[index].segmentName;
                    var segmentId = $scope.segmentName2Id(sName);
                    if (!widget.legendStatus[segmentId]) {
                        widget.legendStatus[segmentId] = {
                            name: sName,
                            primaryDateRange: {
                                primaryMetric: false,
                                compareMetric: false
                            },
                            compareDateRange: {
                                primaryMetric: false,
                                compareMetric: false
                            }
                        };
                    }
                    dashboardService.setLegendData(
                        widget.legendStatus[segmentId], widget.dataSource[index].isPrimaryDateRange,
                        widget.dataSource[index].isPrimaryMetric, value
                    );
                } else if (widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Bar
                    || widget.type === ANALYZE_CONSTS.DATA_SENSE_WIDGET_TYPES.Timeline) {
                    angular.forEach (widget.dataSource, function ( series, idx ){
                        var segmentId = $scope.segmentName2Id(series.segmentName);
                        if (segmentId) {
                            if (!widget.legendStatus[segmentId]) {
                                widget.legendStatus[segmentId] = {
                                    name: series.segmentName,
                                    primaryDateRange: {
                                        primaryMetric: false,
                                        compareMetric: false
                                    },
                                    compareDateRange: {
                                        primaryMetric: false,
                                        compareMetric: false
                                    }
                                };
                            }
                            dashboardService.setLegendData(
                                widget.legendStatus[segmentId], series.isPrimaryDateRange,
                                series.isPrimaryMetric, series.disabled
                            );
                        }
                    });
                }
                widgetService.updateWidget(widget, $rootScope.selectedDashboard, function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                });
            };

            $scope.segmentId2Name = function (id) {
                var segmentName = null;
                for (var i = 0; i < $rootScope.selectedDashboard.segments; i++) {
                    if ($rootScope.selectedDashboard.segments[i].id === id) {
                        segmentName = $rootScope.selectedDashboard.segments[i].name;
                    }
                }
                return segmentName;
            };

            $scope.segmentName2Id = function (name) {
                var segmentId = null;
                for (var i = 0; i < $rootScope.selectedDashboard.segments.length; i++) {
                    if ($rootScope.selectedDashboard.segments[i].name === name) {
                        segmentId = $rootScope.selectedDashboard.segments[i].id;
                    }
                }
                return segmentId;
            };
        }
    ]);
