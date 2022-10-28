"use strict";

var consts = require("../../../../libs/consts"),
    utils = require("../../../../libs/utils"),
    moment = require("moment"),
    _ = require("lodash"),
    MetricCalculation = require("./metrics-calculator").MetricCalculator,
    EquivalenciesCalculator = require("../../../../general/core/calculation/equivalencies-calculator").
        EquivalenciesCalculator;

/*If > 1 year, group by month
 If < 1 year & > 60 days, group by week
 If < 60 days & > 3 days, group by day
 If < 3 days, group by hour*/
function getCustomDimensionPeriod(startDate, endDate) {

    var start = moment.utc(startDate);
    var end = moment.utc(endDate);
    var customGroupDimension = "";

    if (end.diff(start, "years") >= 1) {
        customGroupDimension = "1month";
    } else if ((end.diff(start, "days") >= 60) && (end.diff(start, "days") < 365)) {
        customGroupDimension = "P1W";
    } else if ((end.diff(start, "days") >= 3) && (end.diff(start, "days") < 60)) {
        customGroupDimension = "1day";
    } else if (end.diff(start, "days") < 3) {
        customGroupDimension = "1hour";
    }

    return customGroupDimension;
}

function getCustomGroupDimension(startDate, endDate) {

    var start = moment.utc(startDate);
    var end = moment.utc(endDate);
    var customGroupDimension = "";

    if (end.diff(start, "years") >= 1) {
        customGroupDimension = consts.DIMENSIONS.MONTH;
    } else if ((end.diff(start, "days") >= 60) && (end.diff(start, "days") < 365)) {
        customGroupDimension = consts.DIMENSIONS.WEEK;
    } else if ((end.diff(start, "days") >= 3) && (end.diff(start, "days") < 60)) {
        customGroupDimension = consts.DIMENSIONS.DATE;
    } else if (end.diff(start, "days") < 3) {
        customGroupDimension = consts.DIMENSIONS.HOUR;
    }

    return customGroupDimension;
}

/**
 * Function calculates co2 avoided data
 * @param {number} kwh
 * @param {object} tempoIQResult
 * @returns {number}
 */
function getCO2AvoidedValue(kwh, tempoIQResult) {
    var equivCalc = new EquivalenciesCalculator(kwh, tempoIQResult.dataPoints[0].ts,
        tempoIQResult.dataPoints[tempoIQResult.dataPoints.length -1].ts);
    var data = equivCalc.calc();
    return data.co2AvoidedInKilograms;
}

function getValueBySummaryMethod(total, values, tempoIQItem) {
    switch (tempoIQItem.summaryMethod) {
        case consts.METRIC_SUMMARY_METHODS.Total:
            return total;
        case  consts.METRIC_SUMMARY_METHODS.Average:
            return total / values.length;
        case consts.METRIC_SUMMARY_METHODS.Count:
            return values.length;
        case  consts.METRIC_SUMMARY_METHODS.Minimum:
            return _.min(values);
        case consts.METRIC_SUMMARY_METHODS.Maximum:
            return _.max(values);
        default:
            return total;
    }
}

/**
 * Function creates one number array from all segment values
 * @param {array} tempoIQResults
 * @param {boolean} useSummaryMethod
 * @param {string} widgetType
 * @returns {array}
 */
function getSegmentCommonValues(tempoIQResults, useSummaryMethod, widgetType) {
    var rawData = [];
    for (var i = 0; i < tempoIQResults.length; i++) {
        var sensor = tempoIQResults[i].tempoIQParam.sensor;
        var metricId = tempoIQResults[i].tempoIQParam.type;
        var rateMultiplier = (tempoIQResults[i].tempoIQParam.rate &&
        utils.isNumber(tempoIQResults[i].tempoIQParam.rate)) ?
            tempoIQResults[i].tempoIQParam.rate : 1;

        if(tempoIQResults[i].dataPoints.length > 0) {

            var thisTotal = 0;
            var thisValues = [];

            for (var j = 0; j < tempoIQResults[i].dataPoints.length; j++) {
                var values = tempoIQResults[i].dataPoints[j].values;
                if (values[sensor] && values[sensor][metricId]) {
                    //rawData.push(values[sensor][metricId]);

                    thisTotal += values[sensor][metricId];
                    thisValues.push(values[sensor][metricId]);
                }
            }

            if (useSummaryMethod) {
                var value = getValueBySummaryMethod(thisTotal, thisValues, tempoIQResults[i].tempoIQParam);
                if(widgetType === consts.BOILERPLATE_WIDGET_TYPES.CO2Avoided ) {
                    value = getCO2AvoidedValue(value, tempoIQResults[i]);
                } else if(widgetType === consts.BOILERPLATE_WIDGET_TYPES.Reimbursement) {
                    value *= rateMultiplier;
                }
                rawData.push(value);
            } else {
                rawData.push.apply(rawData, thisValues);
            }
        }
    }

    return rawData;
}

/**
 * Function creates one number array from all segment values
 * @param {array} tempoIQResults
 * @returns {array}
 */
function getSegmentCommonValuesForKpi(tempoIQResults) {
    var rawData = [];
    for (var i = 0; i < tempoIQResults.length; i++) {
        var sensor = tempoIQResults[i].tempoIQParam.sensor;
        var metricId = tempoIQResults[i].tempoIQParam.type;

        for(var j=0; j < tempoIQResults[i].dataPoints.length; j++) {
            var values = tempoIQResults[i].dataPoints[j].values;
            if(values[sensor] && values[sensor][metricId]) {
                rawData.push(values[sensor][metricId]);
            }
        }
    }

    return rawData;
}

/**
 * Function creates one number array from all widget segments values
 * @param {array} results - widget results
 * @param {string} type
 * @returns {array}
 */
function getTotalWidgetValues(results, type) {
    var total = [];
    for (var dateRangeIndex = 0; dateRangeIndex < results.length; dateRangeIndex++) {
        var result = results[dateRangeIndex];
        for (var segmentIndex = 0; segmentIndex < result.length; segmentIndex++) {
            var segmentName = Object.keys(result[segmentIndex])[0];

            if (result[segmentIndex][segmentName][0].primaryMetric.data[type]) {
                total.push.apply(total, result[segmentIndex][segmentName][0].primaryMetric.data[type]);
            }

            if (result[segmentIndex][segmentName].length > 1 &&
                result[segmentIndex][segmentName][1].compareMetric.data[type]) {
                total.push.apply(total, result[segmentIndex][segmentName][1].compareMetric.data[type]);
            }
        }
        result = null;
    }

    return total;
}


/**
* Function creates one number array from all widget segments values
* @param {array} results - widget results
* @returns {array}
*/
function getTotalWidgetValuesForKpi(results) {
    var total = [];

    for (var dateRangeIndex = 0; dateRangeIndex < results.length; dateRangeIndex++) {
        var primarySubTotal = [];
        var compareSubTotal = [];
        var result = results[dateRangeIndex];

        for (var segmentIndex = 0; segmentIndex < result.length; segmentIndex++) {
            var segmentName = Object.keys(result[segmentIndex])[0];

            if (result[segmentIndex][segmentName][0].primaryMetric.data) {
                primarySubTotal = _.union(primarySubTotal, result[segmentIndex][segmentName][0].primaryMetric.data);
            }

            if (result[segmentIndex][segmentName].length > 1 && 
                result[segmentIndex][segmentName][1].compareMetric.data) {
                compareSubTotal = _.union(compareSubTotal, result[segmentIndex][segmentName][1].compareMetric.data);
            }
        }
        total.push({primaryMetric: primarySubTotal, compareMetric: compareSubTotal});
    }

    return total;
}

/**
 * Function creates one number array from all widget segments values for last month
 * @param {array} tempoIQResults
 * @param {string} widgetType
 * @returns {array}
 */
function getSegmentLastMonthCommonValues(tempoIQResults, widgetType) {
    //var lastDate = null;
    var rawData = [];
    var i=0;

    /*//find last date
    for (i = 0; i < tempoIQResults.length; i++) {
        if(tempoIQResults[i].dataPoints.length > 0) {
            var thisLastDate = tempoIQResults[i].dataPoints[tempoIQResults[i].dataPoints.length - 1].ts;
            if(!lastDate || lastDate < thisLastDate) {
                lastDate = thisLastDate;
            }
        }
    }
    if(lastDate) {
    */
    //substract one month and convert to js date
    var minusMonths = moment.utc().add(-1, "months").toDate();


    for (i = 0; i < tempoIQResults.length; i++) {
        var sensor = tempoIQResults[i].tempoIQParam.sensor;
        var metricId = tempoIQResults[i].tempoIQParam.type;
        var rateMultiplier = (tempoIQResults[i].tempoIQParam.rate &&
        utils.isNumber(tempoIQResults[i].tempoIQParam.rate)) ?
            tempoIQResults[i].tempoIQParam.rate : 1;

        if(tempoIQResults[i].dataPoints.length > 0) {

            var thisTotal = 0;
            var thisValues = [];

            for (var j = tempoIQResults[i].dataPoints.length - 1; j > 0; j--) {
                if (tempoIQResults[i].dataPoints[j].ts > minusMonths) {
                    var values = tempoIQResults[i].dataPoints[j].values;
                    if (values[sensor] && values[sensor][metricId]) {
                        thisTotal +=  values[sensor][metricId];
                        thisValues.push(values[sensor][metricId]);
                    }
                } else {
                    break;
                }
            }

            var value = getValueBySummaryMethod(thisTotal, thisValues, tempoIQResults[i].tempoIQParam);
            if(widgetType === consts.BOILERPLATE_WIDGET_TYPES.CO2Avoided ) {
                value = getCO2AvoidedValue(value, tempoIQResults[i]);
            } else if(widgetType === consts.BOILERPLATE_WIDGET_TYPES.Reimbursement) {
                value *= rateMultiplier;
            }
            rawData.push(value);
            //rawData.push(getValueBySummaryMethod(thisTotal, thisValues, tempoIQResults[i].tempoIQParam));
        }
    }
    //}

    return rawData;
}


/**
 * Function calculates data by metric (converts watts to kW, etc)
 * @param {object} tempoIQResults
 * @returns {number}
 */

function calculateValuesByMetric(tempoIQResults) {
    for (var i = 0; i < tempoIQResults.length; i++) {
        var metricCalc = new MetricCalculation(tempoIQResults[i]);

        //calculate data by metric
        tempoIQResults[i] = metricCalc.getMetricData();
    }
}

exports.getCustomDimensionPeriod = getCustomDimensionPeriod;
exports.getCustomGroupDimension = getCustomGroupDimension;
exports.getSegmentCommonValues = getSegmentCommonValues;
exports.getTotalWidgetValues = getTotalWidgetValues;
exports.getSegmentLastMonthCommonValues = getSegmentLastMonthCommonValues;
exports.calculateValuesByMetric = calculateValuesByMetric;
exports.getSegmentCommonValuesForKpi = getSegmentCommonValuesForKpi;
exports.getTotalWidgetValuesForKpi = getTotalWidgetValuesForKpi;
