"use strict";

var //log = require("../../../../libs/log")(module),
    //_ = require("lodash"),
    //moment = require("moment"),
    //utils = require("../../../../libs/utils"),
    consts = require("../../../../libs/consts");

/**
 * Constructor
 * @access public
 * @param {object} tempoIQResult
 * @returns {void}
 */
function MetricCalculator(tempoIQResult) {
    this.tempoIQResult = tempoIQResult;
}

function divide(divider, dataPoints, metricId, sensor) {
    for (var i = 0; i < dataPoints.length; i++) {
        if (dataPoints[i].values[sensor] && dataPoints[i].values[sensor][metricId]) {
            dataPoints[i].values[sensor][metricId] /= divider;
        }
    }
}

/**
 * Function for calculating data by metric
 * @access public
 * @returns {array}
 */
MetricCalculator.prototype.getMetricData = function() {
    if(!this.tempoIQResult.isProcessedByMetricCalculator) {
        var metricId = this.tempoIQResult.tempoIQParam.type;
        var sensor = this.tempoIQResult.tempoIQParam.sensor;
        var metricsToCalculate = [consts.METRIC_NAMES.kWh, consts.METRIC_NAMES.kW, consts.METRIC_NAMES.Reimbursement];

        if (metricsToCalculate.indexOf(this.tempoIQResult.tempoIQParam.metricName) > -1) {
            //convert to kW/kWh
            divide(1000, this.tempoIQResult.dataPoints, metricId, sensor);
        }

        if (this.tempoIQResult.tempoIQParam.summaryMethod === consts.METRIC_SUMMARY_METHODS.Median) {
            divide(2, this.tempoIQResult.dataPoints, metricId, sensor);
        }

        this.tempoIQResult.isProcessedByMetricCalculator = true;
    }

    return this.tempoIQResult;
};

exports.MetricCalculator = MetricCalculator;