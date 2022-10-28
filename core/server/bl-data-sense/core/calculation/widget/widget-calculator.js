"use strict";

var _ = require("lodash"),
    EquivalenciesCalculator =
        require("../../../../general/core/calculation/equivalencies-calculator").EquivalenciesCalculator,
    DimensionsCalculator = require("./dimensions-calculator").DimensionsCalculator,
    MetricCalculation = require("./metrics-calculator").MetricCalculator,
//forecastWrapper = require("../../../../general/core/forecast/forecast-wrapper"),
    //tempoiq = require("../../../../general/core/tempoiq/tempoiq-wrapper"),
    dataProvider = require("dataprovider-service"),
//moment = require("moment"),
    consts = require("../../../../libs/consts"),
    utils = require("../../../../libs/utils"),
    calcUtils = require("./calculator-utils"),
    async = require("async"),
    SPAC = require("./single-point-aggregation-calculator").SinglePointAggregationCalculator,
    BoilerplateWidgetCalculator = require("./boilerplate-widget-calculator").BoilerplateWidgetCalculator,
    KpiWidgetCalculator = require("./kpi-widget-calculator").KpiWidgetCalculator,
    cacheHelper = require("../../../../libs/cache-helper");
    //log = require("../../../../libs/log")(module);
// -------------------------------------------------------------------------------------------------------------

/**
 * Function generates widget data format
 * @access public
 * @param {object} widget
 * @param {string} widgetId
 * @param {array} results
 * @returns {object}
 */
function getWidgetDataFormat(widget, widgetId, results, callback) {
    if (widget.type === consts.DATA_SENSE_WIDGET_TYPES.Boilerplate) {
        var boilerCalc = new BoilerplateWidgetCalculator();
        var boilerReturnObj = {};
        switch (widget.boilerplateType) {
            case consts.BOILERPLATE_WIDGET_TYPES.CurrentPower:
                boilerReturnObj[widgetId] = boilerCalc.getCurrentPowerData(results);
                callback(null, boilerReturnObj);
                break;
            case consts.BOILERPLATE_WIDGET_TYPES.SystemInformation:
            case consts.BOILERPLATE_WIDGET_TYPES.Location:
            case consts.BOILERPLATE_WIDGET_TYPES.Weather:
                boilerCalc.getInformations(widget, function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        boilerReturnObj[widgetId] = result;
                        callback(null, boilerReturnObj);
                    }
                });
                break;
            case consts.BOILERPLATE_WIDGET_TYPES.EnergyConsumed:
                boilerReturnObj[widgetId] = boilerCalc.getEnergyConsumedData(results);
                callback(null, boilerReturnObj);
                break;
            case consts.BOILERPLATE_WIDGET_TYPES.EnergyProduced:
                boilerReturnObj[widgetId] = boilerCalc.getEnergyProducedData(results);
                callback(null, boilerReturnObj);
                break;
            case consts.BOILERPLATE_WIDGET_TYPES.CO2Avoided:
                boilerReturnObj[widgetId] = boilerCalc.geCO2AvoidedData(results);
                callback(null, boilerReturnObj);
                break;
            case  consts.BOILERPLATE_WIDGET_TYPES.Reimbursement:
                boilerReturnObj[widgetId] = boilerCalc.getReimbursementData(results);
                callback(null, boilerReturnObj);
                break;
            case consts.BOILERPLATE_WIDGET_TYPES.CommunicationMonitoring:
                boilerReturnObj[widgetId] = boilerCalc.getLastConnection(widget);
                callback(null, boilerReturnObj);
                break;
            default:
                callback(null, boilerReturnObj);
                break;
        }
    } else if (widget.type === consts.DATA_SENSE_WIDGET_TYPES.Kpi) {
        var kpiCalc = new KpiWidgetCalculator();
        var kpiReturnObj = {};

        kpiReturnObj[widgetId] = kpiCalc.getCurrentData(widget, results);

        callback(null, kpiReturnObj);
    } else {
        BoilerplateWidgetCalculator.changeLastConnectionTime(widget, function(changeErr, changeSuccess) {
            if(changeErr) {
                callback(changeErr, null);
            }
            else {
                var returnObj = {};
                returnObj[widgetId] = {
                    primaryDateRange: results[0],
                    compareDateRange: results[1]
                };
                callback(null, returnObj);
            }
        });
    }

}

// -------------------------------------------------------------------------------------------------------------

/**
 * Functions converts tempoiq data from common format
 * @access private
 * @param {array} tempoDBResults
 * @param {boolean} isViewerTime
 * @param {number} viewerTZOffset
 * @param {array} tempoIQItems - segment tempoiq query parameters
 * @param {object} widget - widget body
 * @param {string} segmentName
 * @returns {object}
 */
function convertTempoDBCalculatedData(tempoDBResults, isViewerTime, viewerTZOffset, widget, segmentName) {

    //var startConverting = new Date();

    var returnObject = {};
    var i = 0;
    var allSegmentValues = null;
    var metricCalc = null;
    var calc = null;

    if (widget.type === consts.DATA_SENSE_WIDGET_TYPES.Equivalencies) {

        var equivResult = {};

        var equivTotal = 0;

        for (i = 0; i < tempoDBResults.length; i++) {

            metricCalc = new MetricCalculation(tempoDBResults[i]);

            //calculate data by metric
            tempoDBResults[i] = metricCalc.getMetricData();

            calc = new DimensionsCalculator(tempoDBResults[i].dataPoints, tempoDBResults[i].tempoIQParam,
                widget, null, null);

            equivTotal += calc.getTotalValue();

            calc = null;

        }

        var startDate = utils.getFirstDateFromTempoIQResults(tempoDBResults);
        var endDate = utils.getLastDateFromTempoIQResults(tempoDBResults);

        var equivCalc = new EquivalenciesCalculator(equivTotal, startDate, endDate);

        equivResult[segmentName] = {
            data: equivCalc.calc(),
            tempoIQResults: tempoDBResults
        };

        return equivResult;
    } else if(BoilerplateWidgetCalculator.isCurrentPowerWidget(widget)) {
        //we should find total values for that segment
        calcUtils.calculateValuesByMetric(tempoDBResults);
        allSegmentValues = calcUtils.getSegmentCommonValues(tempoDBResults, false, widget.boilerplateType);
        returnObject = {};
        returnObject[segmentName] = {
            data: {
                total: allSegmentValues
            },
            tempoIQResults: tempoDBResults
        };

        return returnObject;

    } else if (BoilerplateWidgetCalculator.isEnergyConsumedWidget(widget) ||
        BoilerplateWidgetCalculator.isEnergyProducedWidget(widget) ||
        BoilerplateWidgetCalculator.isCO2AvoidedWidget(widget) ||
        BoilerplateWidgetCalculator.isReimbursementWidget(widget)) {
        calcUtils.calculateValuesByMetric(tempoDBResults);
        allSegmentValues = calcUtils.getSegmentCommonValues(tempoDBResults, true, widget.boilerplateType);
        var lastMonthSegmentValues = calcUtils.getSegmentLastMonthCommonValues(tempoDBResults, widget.boilerplateType);
        returnObject = {};
        returnObject[segmentName] = {
            data: {
                total: allSegmentValues,
                lastMonth: lastMonthSegmentValues
            },
            tempoIQResults: tempoDBResults
        };

        return returnObject;
    } else {

        //tempoDBResults is array of tempodb results per segment, so need process each result and find sum

        var convertedDataItem = [],
            dtos = [],
            currentData = null,
            thisDates = null,
            allDates = [];

        for (i = 0; i < tempoDBResults.length; i++) {

            metricCalc = new MetricCalculation(tempoDBResults[i]);

            //calculate data by metric
            tempoDBResults[i] = metricCalc.getMetricData();

            calc = new DimensionsCalculator(tempoDBResults[i].dataPoints, tempoDBResults[i].tempoIQParam, widget,
                isViewerTime, viewerTZOffset);

            currentData = calc.getData();

            thisDates = Object.keys(currentData);
            allDates.push.apply(allDates, thisDates);

            dtos.push(currentData);
        }

        allDates = _.uniq(allDates);

        if (widget.groupDimension === consts.DIMENSIONS.DATE ||
            widget.groupDimension === consts.DIMENSIONS.HOUR ||
            widget.groupDimension === consts.DIMENSIONS.MINUTE ||
            widget.groupDimension === consts.DIMENSIONS.MONTH  ||
            widget.groupDimension === consts.DIMENSIONS.WEEK) {
            allDates.sort(function(a,b) {
                var dateA = new Date(a), dateB = new Date(b);
                return dateA.getTime() - dateB.getTime();
            });
        } else {
            allDates.sort();
        }

        //summarize results

        for (i = 0; i < allDates.length; i++) {

            convertedDataItem.push({
                date: allDates[i],
                label: null,
                value: 0
            });

            for (var j = 0; j < dtos.length; j++) {

                if(dtos[j][allDates[i]]) {
                    convertedDataItem[i].value += dtos[j][allDates[i]].value;
                    convertedDataItem[i].label = dtos[j][allDates[i]].label;
                }
            }
        }

        allDates = null;
        dtos = null;

        var singlePointCalculator = new SPAC(convertedDataItem, widget);

        var singlePointAggregationValue = singlePointCalculator.getAggregationValue();

        returnObject = {};
        returnObject[segmentName] = {
            data: convertedDataItem,
            tempoIQResults: tempoDBResults,
            singlePointAggregation: singlePointAggregationValue
        };

        //var endConverting = new Date();

        //log.error("CONVERTING TIME: " + (endConverting - startConverting) / 1000);

        return returnObject;
    }
}

// -------------------------------------------------------------------------------------------------------------

/**
 * Functions adds rollup to pipeline object
 *
 * @access private
 * @param {object} pipeline
 * @param {object} tempoIQItem
 * @param {string} period
 * @returns {object}
 */
function setPipelineByDimension(pipeline, tempoIQItem, period) {
    var fold = utils.getFoldBySummaryMethod(tempoIQItem);

    pipeline.functions.push({
        "name": "rollup",
        "arguments": [fold, period]
    });

}

// -------------------------------------------------------------------------------------------------------------

/**
 * Functions returns tempoiq pipeline object by group dimension
 *
 * @access private
 * @param {object} tempoIQItem - segment tempoiq query parameters
 * @param {string} widgetGroupDimension
 * @returns {object}
 */
function getTempoIQPipeline(tempoIQItem, widgetGroupDimension, widget) {
    var widgetType = widget.type;
    var pipeline = {
        "functions":[]
    };

    //||tempoIQItem.metricName === consts.METRIC_NAMES.Reimbursement

    if(tempoIQItem.metricType === consts.METRIC_TYPE.Calculated &&
        (tempoIQItem.metricName === consts.METRIC_NAMES.Wh ||
        tempoIQItem.metricName === consts.METRIC_NAMES.kWh)) {

        pipeline.functions.push({
            "name": "rollup",
            "arguments": ["mean", "1hour"]
        });
    }

    if(tempoIQItem.metricName === consts.METRIC_NAMES.Reimbursement &&
        tempoIQItem.family !== consts.ENPHASE) {

        pipeline.functions.push({
            "name": "rollup",
            "arguments": ["mean", "1hour"]
        });
    }

    var customGroupDimension = calcUtils.getCustomDimensionPeriod(tempoIQItem.startDate, tempoIQItem.endDate);
    tempoIQItem.calculatedDimension = calcUtils.getCustomGroupDimension(tempoIQItem.startDate, tempoIQItem.endDate);

    //in boilerplat we show one value, so we can group data
    if(BoilerplateWidgetCalculator.isCurrentPowerWidget(widget)){
        setPipelineByDimension(pipeline, tempoIQItem, customGroupDimension);
    } else if(BoilerplateWidgetCalculator.isEnergyConsumedWidget(widget) ||
        BoilerplateWidgetCalculator.isEnergyProducedWidget(widget) ||
        BoilerplateWidgetCalculator.isCO2AvoidedWidget(widget) ||
        BoilerplateWidgetCalculator.isReimbursementWidget(widget)) {
        setPipelineByDimension(pipeline, tempoIQItem, "P1W");
    } else if (widgetType === consts.DATA_SENSE_WIDGET_TYPES.Timeline &&
        !widgetGroupDimension) {// && !widgetGroupDimension
        setPipelineByDimension(pipeline, tempoIQItem, customGroupDimension);
    } else if (widgetGroupDimension) {
        switch (widgetGroupDimension) {
            case consts.DIMENSIONS.DATE:
                setPipelineByDimension(pipeline, tempoIQItem, "1day");
                break;
            case consts.DIMENSIONS.DAY_INDEX:
                setPipelineByDimension(pipeline, tempoIQItem, "1day");
                break;
            case consts.DIMENSIONS.HOUR:
                setPipelineByDimension(pipeline, tempoIQItem, "1hour");
                break;
            case consts.DIMENSIONS.HOUR_INDEX:
                setPipelineByDimension(pipeline, tempoIQItem, "1hour");
                break;
            case consts.DIMENSIONS.MINUTE:
                //setPipelineByDimension(pipeline, tempoIQItem, "1min");
                break;
            case consts.DIMENSIONS.MINUTE_INDEX:
                //setPipelineByDimension(pipeline, tempoIQItem, "1min");
                break;
            case consts.DIMENSIONS.MONTH:
                setPipelineByDimension(pipeline, tempoIQItem, "1month");
                break;
            case consts.DIMENSIONS.MONTH_INDEX:
                setPipelineByDimension(pipeline, tempoIQItem, "1month");
                break;
            case consts.DIMENSIONS.WEEK:
                setPipelineByDimension(pipeline, tempoIQItem, "P1W");
                break;
            case consts.DIMENSIONS.WEEK_INDEX:
                setPipelineByDimension(pipeline, tempoIQItem, "P1W");
                break;
            case consts.DIMENSIONS.YEAR:
                setPipelineByDimension(pipeline, tempoIQItem, "1year");
                break;
            case consts.DIMENSIONS.DAY_OF_WEEK:
                setPipelineByDimension(pipeline, tempoIQItem, "1day");
                break;
            case consts.DIMENSIONS.DAY_OF_MONTH:
                setPipelineByDimension(pipeline, tempoIQItem, "1day");
                break;
            case consts.DIMENSIONS.MONTH_OF_YEAR:
                setPipelineByDimension(pipeline, tempoIQItem, "1month");
                break;
            case consts.DIMENSIONS.HOUR_OF_DAY:
                setPipelineByDimension(pipeline, tempoIQItem, "1hour");
                break;
            case consts.DIMENSIONS.MINUTE_OF_HOUR:
                //setPipelineByDimension(pipeline, tempoIQItem, "1min");
                break;
            case consts.DIMENSIONS.WEEK_OF_YEAR:
                setPipelineByDimension(pipeline, tempoIQItem, "P1W");
                break;
            default :
                //setPipelineByDimension(pipeline, tempoIQItem.metricName, customGroupDimension);
                break;
        }
    }

    return pipeline;
}

// -------------------------------------------------------------------------------------------------------------

/**
 * Functions loads segment data from tempoiq
 * @access private
 * @param {array} cachedTempoIQResults
 * @param {array} tempoIQItems - segment tempoiq query parameters
 * @param {boolean} isViewerTime
 * @param {number} viewerTZOffset
 * @param {object} widget - widget body
 * @param {function} callback
 * @returns {void}
 */
function loadItemData(cachedTempoIQResults, isViewerTime, viewerTZOffset, tempoIQItems, segmentName, widget, callback) {

    async.map(tempoIQItems, function (tempoIQItem, callback) {

        //var options = null;
        var pipeline = getTempoIQPipeline(tempoIQItem, widget.groupDimension, widget);


        var selection = {
            "devices": {
                "key": tempoIQItem.sensor
            },
            "sensors": {
                "key": tempoIQItem.type
            }
        };

        var lastDate = cachedTempoIQResults.lastDate;
        if(lastDate) {
            tempoIQItem.startDate = lastDate;
        }

        var options = {
            selection: selection,
            pipeline: pipeline,
            options: {queryItem: tempoIQItem}
        };

        var range = {
            start: tempoIQItem.startDate,
            end: tempoIQItem.endDate
        };

        if (lastDate || (widget.showAllTime !== true &&
            !(BoilerplateWidgetCalculator.isEnergyConsumedWidget(widget) ||
            BoilerplateWidgetCalculator.isEnergyProducedWidget(widget) ||
            BoilerplateWidgetCalculator.isCO2AvoidedWidget(widget) ||
            BoilerplateWidgetCalculator.isReimbursementWidget(widget)))) {
            dataProvider.loadData(range, null, options, function (tempodberr, tempoDBResult) {
                    if (tempodberr) {
                        callback(tempodberr);
                    } else {
                        callback(null, tempoDBResult);
                    }
                });
        } else {
            dataProvider.loadAllExistingData(options, function (tempodberr, tempoDBResult) {
                if (tempodberr) {
                    callback(tempodberr);
                } else {
                    callback(null, tempoDBResult);
                }
            });
        }

    }, function (err, results) {
        if (err) {
            callback(err);
        } else {

            results.push.apply(results, cachedTempoIQResults.tempoIQCachedResults);

            var convertedDataItem = convertTempoDBCalculatedData(results, isViewerTime, viewerTZOffset,
                widget, segmentName);
            callback(null, convertedDataItem);
        }
    });
}

function getCachedTempoIQResults(cachedTempoIQData, dateRangeType, segmentName, metricIndex, metricType) {
    if(cachedTempoIQData && cachedTempoIQData[dateRangeType]) {
        for(var i=0; i < cachedTempoIQData[dateRangeType].length; i++) {
            var thisSegmentName = Object.keys(cachedTempoIQData[dateRangeType][i])[0];
            var segmentData = cachedTempoIQData[dateRangeType][i][segmentName];

            if(thisSegmentName === segmentName && segmentData.length > metricIndex &&
                segmentData[metricIndex][metricType]) {
                var tempoIQCachedResults = segmentData[metricIndex][metricType];
                var lastDate = utils.getLastDateFromTempoIQResults(tempoIQCachedResults);
                utils.removeDuplicateTempoIQDates(tempoIQCachedResults, lastDate);
                return {
                    tempoIQCachedResults: tempoIQCachedResults,
                    lastDate: lastDate
                };
            }
        }
    }

    return {
        tempoIQCachedResults: [],
        lastDate: null
    };

}

// -------------------------------------------------------------------------------------------------------------

/**
 * Description here
 *
 * @access private
 * @param {number} value
 * @param {boolean} isViewerTime
 * @param {number} viewerTZOffset
 * @param {boolean} isMonth
 * @returns {string}
 */
function processSegments(segmentsCache, isViewerTime, viewerTZOffset, segments, dateRangeType, widget, callback) {
    var tasks = [];
    var metricPairs = ["primaryMetric"];

    if ((widget.type === consts.DATA_SENSE_WIDGET_TYPES.Timeline ||
        widget.type === consts.DATA_SENSE_WIDGET_TYPES.Kpi ||
        widget.type === consts.DATA_SENSE_WIDGET_TYPES.Table) && widget.compareMetric) {

        metricPairs = ["primaryMetric","compareMetric"];
    }

    async.map(segments, function(segment, cb) {
        var segmentName = Object.keys(segment)[0];
        var segmentParams = segment[segmentName];

        tasks = [];

        tasks.push(function(parallelCallback) {
            var cachedData = getCachedTempoIQResults(segmentsCache, dateRangeType, segmentName, 0, metricPairs[0]);
            loadItemData(cachedData, isViewerTime, viewerTZOffset, segmentParams[metricPairs[0]],
                metricPairs[0], widget, parallelCallback);
        });

        if (metricPairs.length > 1) {
            tasks.push(function(parallelCallback) {
                var cachedData = getCachedTempoIQResults(segmentsCache, dateRangeType, segmentName, 1, metricPairs[1]);
                loadItemData(cachedData, isViewerTime, viewerTZOffset, segmentParams[metricPairs[1]],
                    metricPairs[1], widget, parallelCallback);
            });
        }

        async.parallel(tasks, function(err, results){
            if(err) {
                cb(err);
            } else {
                var returnObj = {};
                returnObj[segmentName] =results;

                cb(null, returnObj);
            }
        });

    }, function (err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
}

/**
 * Functions store date in additional array for primary and compare date range and revert back result format
 * @access private
 * @param {array} result
 * @param {array} tempoIQStorage
 * @returns {void}
 */
function filterResults(result, tempoIQStorage) {
    //return result;

    for (var segmentIndex = 0; segmentIndex < result.length; segmentIndex++) {
        var segmentName = Object.keys(result[segmentIndex])[0];

        tempoIQStorage[segmentIndex] = {};
        tempoIQStorage[segmentIndex][segmentName] = [];

        if (result[segmentIndex][segmentName][0].primaryMetric) {

            tempoIQStorage[segmentIndex][segmentName][0] = {};
            tempoIQStorage[segmentIndex][segmentName][0].primaryMetric = [];

            if(result[segmentIndex][segmentName][0].primaryMetric.tempoIQResults) {
                tempoIQStorage[segmentIndex][segmentName][0].primaryMetric =
                    result[segmentIndex][segmentName][0].primaryMetric.tempoIQResults;
            }

            if(result[segmentIndex][segmentName][0].primaryMetric.data) {
                result[segmentIndex][segmentName][0].primaryMetric = {
                    data: result[segmentIndex][segmentName][0].primaryMetric.data,
                    singlePointAggregation: result[segmentIndex][segmentName][0].primaryMetric.singlePointAggregation
                };
            }
        }

        if (result[segmentIndex][segmentName].length > 1 && result[segmentIndex][segmentName][1].compareMetric) {

            tempoIQStorage[segmentIndex][segmentName][1] = {};
            tempoIQStorage[segmentIndex][segmentName][1].compareMetric = [];

            if(result[segmentIndex][segmentName][1].compareMetric.tempoIQResults) {
                tempoIQStorage[segmentIndex][segmentName][1].compareMetric =
                    result[segmentIndex][segmentName][1].compareMetric.tempoIQResults;
            }

            if(result[segmentIndex][segmentName][1].compareMetric.data) {
                result[segmentIndex][segmentName][1].compareMetric = {
                    data: result[segmentIndex][segmentName][1].compareMetric.data,
                    singlePointAggregation: result[segmentIndex][segmentName][1].compareMetric.singlePointAggregation
                };
            }
        }
    }
}

/**
 * Start loading data
 * @access public
 * @param {array} tempoDBItems - tempoiq query parameters
 * @param {boolean} isViewerTime
 * @param {number} viewerTZOffset
 * @param {object} widget - widget body
 * @param {string} dashboardId
 * @param {object} socket
 * @param {object} cachedTempoIQData
 * @param {function} finalCallback
 * @returns {void}
 */

function startLoadingData(tempoDBItems, isViewerTime, viewerTZOffset, widget, dashboardId,
                          socket, cachedTempoIQData, finalCallback) {
    var widgetId = widget.widget._id.toString();

    var tasks = [];

    tasks.push(function (callback) {
        if (tempoDBItems.primaryDateRange) {
            processSegments(cachedTempoIQData, isViewerTime, viewerTZOffset,
                tempoDBItems.primaryDateRange, "primaryDateRange", widget.widget, callback);
        } else {
            callback(null, []);
        }
    });

    tasks.push(function (callback) {
        if (tempoDBItems.compareDateRange) {
            processSegments(cachedTempoIQData, isViewerTime, viewerTZOffset,
                tempoDBItems.compareDateRange, "compareDateRange", widget.widget, callback);
        } else {
            callback(null, []);
        }
    });

    async.parallel(tasks, function (err, results) {
        if (err) {
            finalCallback(err);
        } else {
            var tempoDBStorage = {
                primaryDateRange: [],
                compareDateRange: []
            };

            filterResults(results[0], tempoDBStorage.primaryDateRange);
            filterResults(results[1], tempoDBStorage.compareDateRange);

            getWidgetDataFormat(widget.widget, widgetId, results, function(err, returnObj) {
                if (err) {
                    finalCallback(err, null);
                } else {

                    if (socket) {
                        returnObj[widgetId].isHistorical = (cachedTempoIQData === null);
                        returnObj[widgetId].dashboardId = dashboardId;
                        var finalResult = new utils.serverAnswer(true, returnObj);

                        socket.emit(consts.WEBSOCKET_EVENTS.DASHBOARD_DATA, finalResult);
                        finalResult = null;
                        returnObj = null;

                        cacheHelper.setElementData(dashboardId + ":" + widgetId,
                            consts.ANALYZE_TEMPOIQ_CACHE_TTL, tempoDBStorage, function(err, res) {
                            finalCallback(err, {});
                        });
                    } else {
                        finalCallback(null, returnObj);
                    }
                }
            });
            //finalCallback(null, returnObj);
        }
    });
}

// -------------------------------------------------------------------------------------------------------------

/**
 * Entry point to the module, functions returns data for datasense widget
 * @access public
 * @param {array} tempoDBItems - tempoiq query parameters
 * @param {boolean} isViewerTime
 * @param {number} viewerTZOffset
 * @param {object} widget - widget body
 * @param {string} dashboardId
 * @param {object} socket
 * @param {function} finalCallback
 * @returns {void}
 */
function calculateData(tempoDBItems, isViewerTime, viewerTZOffset, widget, dashboardId, socket, finalCallback) {
    if(socket) {
        var widgetId = widget.widget._id.toString();
        cacheHelper.getCachedElementData(dashboardId + ":" + widgetId, null, function(cacheErr, loadedObj) {
            if(cacheErr) {
                finalCallback(cacheErr);
            } else {
                startLoadingData(tempoDBItems, isViewerTime, viewerTZOffset, widget, dashboardId,
                    socket, loadedObj, finalCallback);
            }
        });
    } else {
        //ajax
        startLoadingData(tempoDBItems, isViewerTime, viewerTZOffset, widget, dashboardId,
            socket, null, finalCallback);
    }
}

exports.calculateData = calculateData;
