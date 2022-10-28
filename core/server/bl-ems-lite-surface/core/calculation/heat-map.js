"use strict";

var _            = require("lodash");
var Promise      = require("bluebird");
var moment       = require("moment");
var log          = require("../../../libs/log")(module);
var dataProvider = require("dataprovider-service");

Promise.promisifyAll(dataProvider);

exports._processTempoiqData = function(params, tempoiqData) {
    var heatmapData = [];
    for (let i = 0; i < params.dayCount; i++) {
        var hoursCnt = i < (params.dayCount - 1) ? 24 : params.currentHour + 1;
        var hoursData = _.times(hoursCnt, _.constant(0));
        heatmapData.push(hoursData);
    }

    if (!tempoiqData || !tempoiqData.dataPoints || tempoiqData.dataPoints.length === 0) {
        return heatmapData;
    }

    var start = params.range.start;
    _.each(tempoiqData.dataPoints, function(dp) {
        var values = dp.values;
        var devices = _.keys(dp.values);
        var time = moment.utc(dp.ts, moment.defaultFormat);

        _.each(devices, function(device) {
            var metric = _.keys(values[device])[0];
            var value = values[device][metric];
            if (_.isUndefined(value)) {
                return;
            }
            var kwh = (value || 0) / 1000;

            var hours = moment.duration(time - start).asHours();
            var dayIndex = Math.floor(hours / 24);
            var hourIndex = hours % 24;
            heatmapData[dayIndex][hourIndex] += kwh;
        });
    });

    return heatmapData;
};

exports._loadTempoiqData = function(selection, params, dateTimeUtils) {
    var tempoiqOts = {
        selection: selection,
        pipeline: {
            functions: [{
                name: "rollup",
                arguments: ["mean", "1hour"]
            }]
        }
    };

    return dataProvider.loadDataAsync(params.range, dateTimeUtils, tempoiqOts);
};

exports._calcParams = function(dateRange, dateTimeUtils) {
    var range;
    switch (dateRange) {
        /* istanbul ignore next */
        case "1-day": // just for testing
            range = dateTimeUtils.getDayRange("day");
            break;
        case "week":
            range = dateTimeUtils.getWeekRange("day");
            break;
        case "month":
            range = dateTimeUtils.getNDaysRange(30, "day");
            break;
        case "6-months":
            range = dateTimeUtils.getNDaysRange(180, "day");
            break;
        default:
            var err = new Error("Unsupported dateRange: " + dateRange);
            return Promise.reject(err);
    }

    var params = {
        dayCount: Math.ceil(moment.duration(range.end - range.start).asDays()),
        range: range,
        currentHour: moment.utc().hour()
    };

    log.info(`heatMap params: dayCount=${params.dayCount}, rangeStart=${params.range.start.format()},
rangeEnd=${params.range.end.format()}`);

    return Promise.resolve(params);
};

exports.loadData = function(clientObject, element, callback) {
    var params;
    return exports
        ._calcParams(element.dateRange, clientObject.dateTimeUtils)
        .then(function(ps) {
            params = ps;
            return exports._loadTempoiqData(clientObject.selection, params, clientObject.dateTimeUtils);
        })
        .then(function(tempoiqData) {
            return exports._processTempoiqData(params, tempoiqData);
        })
        .then(function(points) {
            var res = {
                dateRange: element.dateRange,
                rangeStart: params.range.start.toISOString(),
                rangeEnd: params.range.end.toISOString(),
                points: points
            };
            element.clientAnswer.send(res);
            if (callback) {
                callback();
            }
        })
        .catch(function(err) {
            log.info("heatMap error", err);
            element.clientAnswer.error(err);
            if (callback) {
                callback(err);
            }
        });
};
