"use strict";

var calcUtils = require("./calculator-utils");

/**
 * Constructor
 * @returns {void}
 */
function KpiWidgetCalculator() {

}

function getSum(arrayObj) {
    if (arrayObj.length === 0) {
        return null;
    }

    var total = 0;
    arrayObj.forEach(function(element) {
        total += element.value;
    });

    return total;
}

function getAverage(arrayObj) {
    if (arrayObj.length === 0) {
        return null;
    }

    var total = getSum(arrayObj);

    return parseFloat((total/(arrayObj.length)).toFixed(2));
}

function getMax(arrayObj) {
    if (arrayObj.length === 0) {
        return null;
    }

    var maxVal = -9999999999;
    arrayObj.forEach(function(element) {
        if (element.value > maxVal) {
            maxVal = element.value;
        }
    });

    return maxVal;
}

function getMin(arrayObj) {
    if (arrayObj.length === 0) {
        return null;
    }

    var minVal = 9999999999;
    arrayObj.forEach(function(element) {
        if (element.value < minVal) {
            minVal = element.value;
        }
    });

    return minVal;
}

/**
 * Function calculates data for Kpi Widget
 * @param {object} results - widget results
 * @returns {object}
 */
KpiWidgetCalculator.prototype.getCurrentData = function(widget, results) {
    var totalValues = calcUtils.getTotalWidgetValuesForKpi(results);
    var primaryValue = [], compareValue = [];
    var returnObj = {primaryDateRange: {}, compareDateRange: {}};

    for (var i=0; i<totalValues.length; i++) {
        var dateRangeData = totalValues[i];
        var primaryMetricValues = dateRangeData.primaryMetric;
        var compareMetricValues = dateRangeData.compareMetric;

        switch(widget.summaryMethod) {
            case "Total":
                primaryValue[i] = getSum(primaryMetricValues);
                compareValue[i] = getSum(compareMetricValues);
                break;
            case "Average":
                primaryValue[i] = getAverage(primaryMetricValues);
                compareValue[i] = getAverage(compareMetricValues);
                break;
            case "Minimum":
                primaryValue[i] = getMin(primaryMetricValues);
                compareValue[i] = getMin(compareMetricValues);
                break;
            case "Maximum":
                primaryValue[i] = getMax(primaryMetricValues);
                compareValue[i] = getMax(compareMetricValues);
                break;
            case "Count":
                primaryValue[i] = (primaryMetricValues.length > 0)? primaryMetricValues.length: null;
                compareValue[i] = (compareMetricValues.length > 0)? compareMetricValues.length: null;
                break;
            default:
                break;
        }
    }

    returnObj.primaryDateRange.primaryMetric = {label: widget.label, value: primaryValue[0]};
    returnObj.primaryDateRange.compareMetric = {label: widget.compareLabel, value: compareValue[0]};
    returnObj.compareDateRange.primaryMetric = {label: widget.label, value: primaryValue[1]};
    returnObj.compareDateRange.compareMetric = {label: widget.compareLabel, value: compareValue[1]};

    return returnObj;
};

exports.KpiWidgetCalculator = KpiWidgetCalculator;