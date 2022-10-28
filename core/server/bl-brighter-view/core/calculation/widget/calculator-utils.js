"use strict";

var consts = require("../../../../libs/consts"),
    utils = require("../../../../libs/utils");

/**
 * Functions returns tempoiq pipeline object for bv widgets
 * @access public
 * @param {boolean} isGraphWidget
 * @returns {object}
 */
function getTempoIQPipeline(isGraphWidget, tempoIQItem) {
    //set watthour grouping
    var pipeline = {
        "functions":[]
    };

    //max power is calculated metric but it does not require hourly rollup
    if(tempoIQItem.metricName !== consts.METRIC_NAMES.WattsMax &&
        tempoIQItem.metricType === consts.METRIC_TYPE.Calculated) {
        pipeline.functions.push({
            "name": "rollup",
            "arguments": ["mean", "1hour"]
        });
    }

    var fold = utils.getFoldBySummaryMethod(tempoIQItem);


    //EE and Solar widgets uses totalkWh, so we can use big period
    /*pipeline.functions.push({
     "name": "rollup",
     "arguments": [fold, "1year"]
     });*/

    if(isGraphWidget) {
        //graph widget, find period by interval
        var period = null;

        switch(tempoIQItem.interval) {
            case consts.BRIGHTERVIEW_INTERVALS.Hourly:
                period = "1hour";
                break;
            case consts.BRIGHTERVIEW_INTERVALS.Daily:
                period = "1day";
                break;
            case consts.BRIGHTERVIEW_INTERVALS.Weekly:
                period = "P1W";
                break;
            case consts.BRIGHTERVIEW_INTERVALS.Monthly:
                period = "1month";
                break;
            case consts.BRIGHTERVIEW_INTERVALS.Yearly:
                period = "1year";
                break;
        }

        if(period) {
            pipeline.functions.push({
                "name": "rollup",
                "arguments": [fold, period]
            });
        }
    }

    if(pipeline.functions.length === 0) {
        return null;
    }
    return pipeline;
}

/**
 * Function sends widget data via websocket
 * @access private
 * @param {object} loadedData - data to sens
 * @param {object} presentation
 * @param {object} widget
 * @param {boolean} isCompleted
 * @param {object} socket
 * @returns {void}
 */
function sendWidgetData(loadedData, presentation, widget, isCompleted, socket) {
    var obj = {
        presentationId: presentation._id,
        widgetId: widget._id,
        widgetData: loadedData,
        isCompleted: isCompleted
    };
    var finalResult = new utils.serverAnswer(true, obj);
    socket.emit(consts.WEBSOCKET_EVENTS.PRESENTATION_DATA, finalResult);
}

exports.getTempoIQPipeline = getTempoIQPipeline;
exports.sendWidgetData = sendWidgetData;
