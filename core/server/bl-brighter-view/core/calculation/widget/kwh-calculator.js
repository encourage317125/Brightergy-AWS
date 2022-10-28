"use strict";

var //_ = require("lodash"),
    //moment = require("moment"),
    //utils = require("../../../../libs/utils"),
    consts = require("../../../../libs/consts");

function kWhCalculator(tempoIQParam, dataPoints) {
    this.sensor = tempoIQParam.sensor;
    this.dataPoints = dataPoints;
    this.isDataExists = false;
    this.metric = tempoIQParam.type;
    this.metricName = tempoIQParam.metricName;
    //log.info("total: "+ this.dataPoints.length);

    if(tempoIQParam.summaryMethod === consts.METRIC_SUMMARY_METHODS.Median) {

        for (var i = 0; i < this.dataPoints.length; i++) {
            for (var sensor in this.dataPoints[i].values) {
                if (this.dataPoints[i].values[sensor][this.metric]) {
                    this.dataPoints[i].values[sensor][this.metric] /= 2;
                }
            }
        }
    }
}

/**
 * Function calculates total kilowatt value
 * @access public
 * @returns {number}
 */
kWhCalculator.prototype.getTotalKwh = function() {
    var kwh = 0;

    /*for (var i = 0; i < this.dataPoints.length;i++) {
        var valuesObj = this.dataPoints[i].values;

        if(this.sensor) {
            if(valuesObj[this.sensor]) {
                kwh += (valuesObj[this.sensor][this.metric] / 1000);
            }
        } else {
            //if sensor not specified, data is exists
            var key = null;
            this.isDataExists = true;
            for(key in valuesObj) {
                if (valuesObj.hasOwnProperty(key)) {
                    kwh += (valuesObj[key][this.metric] / 1000);
                }
            }
        }
    }*/
    for (var i = 0; i < this.dataPoints.length;i++) {
        var valuesObj = this.dataPoints[i].values;

        if(valuesObj[this.sensor]) {
            kwh += valuesObj[this.sensor][this.metric] / 1000;
        }
    }
    return kwh;

};

/**
 * Function calculates current generation
 * @access public
 * @returns {number}
 */
kWhCalculator.prototype.getCurrentGeneration = function () {
    var currentGeneration = 0;
    if(this.dataPoints.length > 0) {
        var valuesObj = this.dataPoints[this.dataPoints.length - 1].values;

        currentGeneration += (valuesObj[this.sensor][this.metric] / 1000);

        /*if(this.sensor) {
            if(valuesObj[this.sensor]) {
                currentGeneration += (valuesObj[this.sensor][this.metric] / 1000);
            }
        } else {
            //if sensor not specified, data is exists
            this.isDataExists = true;
            var key = null;
            for (key in valuesObj) {
                if (valuesObj.hasOwnProperty(key)) {
                    currentGeneration += (valuesObj[key][this.metric] / 1000);
                }
            }
        }*/
    }
    return currentGeneration;
};

function isDataBySensorExists(sensor, dataPoint) {

    if(!sensor) {
        return true;
    }

    for(var key in dataPoint.values) {
        if(key.indexOf(sensor) > -1) {
            return true;
        }
    }
    return false;
}

/**
 * Function calculates hourly data in internal format
 * @access private
 * @param {string} sensor - webbox inverter,etc
 * @param {array} dataPoints - tempoiq data array
 * @param {string} metric
 * @returns {object}
 */
function getDataByHour(sensor, metricName, dataPoints, metric) {
    var dataByHour = {
        metricName: metricName,
        data: {}
    };

    var isValidSensor  = false;
    if(dataPoints.length > 0) {
        isValidSensor = isDataBySensorExists(sensor, dataPoints[0]);
    }

    if(isValidSensor) {
        for (var i = 0; i < dataPoints.length; i++) {
            if(dataPoints[i].values[sensor] && dataPoints[i].values[sensor][metric]) {
                var isString = typeof dataPoints[i].ts === "string";
                var val = (dataPoints[i].values[sensor][metric] / 1000);

                dataByHour.data[isString ?
                    dataPoints[i].ts :
                    dataPoints[i].ts.toISOString()] = {
                    val: val,
                    max: val,
                    min: val
                };
            }
        }
    }

    return dataByHour;
}

/**
 * Function calculates data by specified interval
 * @access public
 * @param {string} interval
 * @returns {object}
 */
kWhCalculator.prototype.getEnergyDataByInterval = function(interval) {
    if(interval === consts.BRIGHTERVIEW_INTERVALS.Hourly) {
        return getDataByHour(this.sensor, this.metricName, this.dataPoints, this.metric);
    } else {
        var dataByHour = getDataByHour(this.sensor, this.metricName, this.dataPoints, this.metric);
        /*//get all dates
        var dates = Object.keys(dataByHour.data);
        var label = null;

        var graphDataList = {
            metricName: this.metricName,
            data: {}
        };
        if (dates.length > 0) {
            //var startDay = new Date(tempodbAnswer.dataPoints[0].t).getDate();
            var start = utils.getDateByInterval(dates[0], interval);
            //log.info("start kwh %s", start);
            var totalVal = 0;
            //var totalkWh = 0;
            var values = [];

            var dateEnergy = null;
            for (var i = 0; i < dates.length; i++) {

                if (utils.compareDatesByInterval(start, dates[i], interval)) {

                    totalVal += dataByHour.data[dates[i]].val;
                    //totalkWh += dataByHour[dates[i]].kWh;
                    values.push(dataByHour.data[dates[i]].val);

                    if (interval === consts.BRIGHTERVIEW_INTERVALS.Daily) {
                        dateEnergy = dates[i];
                    } else if (interval === consts.BRIGHTERVIEW_INTERVALS.Weekly) {
                        dateEnergy = start;
                    } else if(interval === consts.BRIGHTERVIEW_INTERVALS.Monthly) {
                        dateEnergy = start;
                    } else if(interval === consts.BRIGHTERVIEW_INTERVALS.Yearly) {
                        dateEnergy = start;
                    }
                } else {
                    //startDay = new Date(tempodbAnswer.dataPoints[i].t).getDate()
                    start = utils.getDateByInterval(dates[i], interval);

                    label = moment.utc(dateEnergy).hour(0).minute(0).second(0).millisecond(0).toISOString();

                    graphDataList.data[label] = {
                        "val": totalVal,
                        "max": _.max(values),
                        "min": _.min(values)
                    };

                    //values = [];
                    totalVal = dataByHour.data[dates[i]].val;
                    //totalkWh = dataByHour[dates[i]].kWh;
                    values.push(dataByHour.data[dates[i]].val);
                }

                dataByHour.data[dates[i]] = null;
            }

            label = moment.utc(dateEnergy).hour(0).minute(0).second(0).millisecond(0).toISOString();

            graphDataList.data[label] = {
                "val": totalVal,
                "max": _.max(values),
                "min": _.min(values)
            };

        }

        this.dataPoints = null;
        dataByHour = null;
        dates = null;

        return graphDataList;
        */
        return dataByHour;
    }
};

exports.kWhCalculator = kWhCalculator;