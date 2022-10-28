"use strict";

var moment = require("moment"),
    //log = require("../../../../libs/log")(module),
    consts = require("../../../../libs/consts"),
    utils = require("../../../../libs/utils"),
    //forecastWrapper = require("../../../../general/core/forecast/forecast-wrapper"),
    widgetDAO = require("../../dao/widget-dao.js"),
    calcUtils = require("./calculator-utils"),
    weatherSrvc = require("weather-service");

/**
 * Constructor
 * @returns {void}
 */
function BoilerplateWidgetCalculator() {

}

function getCurrentPowerLabel(sum) {
    if(Math.abs(sum) > 1000) {
        return sum/1000 + " kW";
    } else if(Math.abs(sum) < 1) {
        return sum * 1000 + " mW";
    } else {
        return sum + " W";
    }
}

/**
 * Function calculates data for boilerplate current power widget
 * @param {array} results - widget results
 * @returns {object}
 */
BoilerplateWidgetCalculator.prototype.getCurrentPowerData = function(results) {
    var totalValues = calcUtils.getTotalWidgetValues(results, "total");

    var positiveValues = utils.getPositiveValues(totalValues);

    var negativeValues = utils.getNegativeValues(totalValues);

    totalValues = null;

    var returnObj = {};

    returnObj.Production = null;
    returnObj.Consumption = null;

    if(positiveValues.length > 0) {
        var positiveSum = utils.getArraySum(positiveValues);
        positiveValues = null;

        returnObj.Production = getCurrentPowerLabel(positiveSum);
    }

    if(negativeValues.length > 0) {
        var negativeSum = utils.getArraySum(negativeValues);
        negativeValues = null;

        returnObj.Consumption = getCurrentPowerLabel(negativeSum);
    }

    return returnObj;
};

BoilerplateWidgetCalculator.prototype.getInformations = function(widget, retCallback) {
    var returnObj = {};
    returnObj.Temperature = null;
    returnObj.WeatherStatus = null;

    returnObj.PVSystemPower = widget.boilerplateSystemPower ? widget.boilerplateSystemPower : null;
    returnObj.Commissioning = 
        widget.boilerplateCommissioning ? moment(widget.boilerplateCommissioning).format("ll") : null;
    returnObj.Location = widget.boilerplateLocation ? widget.boilerplateLocation : null;

    var geoDataItem = {"latitude": widget.metric.latitude, "longitude": widget.metric.longitude};
    if (!geoDataItem.latitude || !geoDataItem.longitude) {
        retCallback(consts.SERVER_ERRORS.GENERAL.GEO_NOT_EXIST, null);
    } else {
        weatherSrvc.getCurrent(geoDataItem.latitude, geoDataItem.longitude, 0)
            .then(function (currentWeather) {
                returnObj.Temperature = currentWeather.temperature;
                returnObj.WeatherStatus = currentWeather.summary;
                returnObj.ForecastLink = consts.FORECAST_URL_WITH_GEO +
                    geoDataItem.latitude + "," + geoDataItem.longitude;
                returnObj.GooglemapLink = consts.GOOGLEMAP_URL_WITH_GEO +
                    geoDataItem.latitude + "," + geoDataItem.longitude;
                retCallback(null, returnObj);
            })
            .catch(retCallback);
    }
};

function getEnergyValues(results, isPositive) {
    var totalValues = calcUtils.getTotalWidgetValues(results, "total");
    var lastMonthValues = calcUtils.getTotalWidgetValues(results, "lastMonth");

    totalValues = isPositive ? utils.getPositiveValues(totalValues): utils.getNegativeValues(totalValues);
    lastMonthValues = isPositive ? utils.getPositiveValues(lastMonthValues) : utils.getNegativeValues(lastMonthValues);

    var totalSum = null;
    var lastMonthSum = null;

    if(totalValues.length > 0) {
        totalSum = utils.getArraySum(totalValues);
        lastMonthSum = utils.getArraySum(lastMonthValues);
    }

    return {
        total: totalSum,
        lastMonth: lastMonthSum
    };
}

BoilerplateWidgetCalculator.prototype.geCO2AvoidedData = function(results) {
    return getEnergyValues(results, true);
};

BoilerplateWidgetCalculator.prototype.getEnergyConsumedData = function(results) {
    return getEnergyValues(results, false);
};

BoilerplateWidgetCalculator.prototype.getEnergyProducedData = function(results) {
    return getEnergyValues(results, true);
};

BoilerplateWidgetCalculator.prototype.getReimbursementData = function(results) {
    return getEnergyValues(results, true);
};

BoilerplateWidgetCalculator.isCurrentPowerWidget = function(widget) {
    return widget.type === consts.DATA_SENSE_WIDGET_TYPES.Boilerplate && 
           widget.boilerplateType === consts.BOILERPLATE_WIDGET_TYPES.CurrentPower;
};

BoilerplateWidgetCalculator.isEnergyProducedWidget = function(widget) {
    return widget.type === consts.DATA_SENSE_WIDGET_TYPES.Boilerplate &&
        widget.boilerplateType === consts.BOILERPLATE_WIDGET_TYPES.EnergyProduced;
};

BoilerplateWidgetCalculator.isEnergyConsumedWidget = function(widget) {
    return widget.type === consts.DATA_SENSE_WIDGET_TYPES.Boilerplate &&
        widget.boilerplateType === consts.BOILERPLATE_WIDGET_TYPES.EnergyConsumed;
};

BoilerplateWidgetCalculator.isCO2AvoidedWidget = function(widget) {
    return widget.type === consts.DATA_SENSE_WIDGET_TYPES.Boilerplate &&
        widget.boilerplateType === consts.BOILERPLATE_WIDGET_TYPES.CO2Avoided;
};


BoilerplateWidgetCalculator.isReimbursementWidget = function(widget) {
    return widget.type === consts.DATA_SENSE_WIDGET_TYPES.Boilerplate &&
        widget.boilerplateType === consts.BOILERPLATE_WIDGET_TYPES.Reimbursement;
};


BoilerplateWidgetCalculator.prototype.getLastConnection = function(widget) {
    var returnObj = {};
    returnObj.lastConnected = widget.lastConnected ? widget.lastConnected: null;
    returnObj.lastConnectedFromNow = widget.lastConnected ? moment(widget.lastConnected).fromNow(): null;
                
    return returnObj;
};

/**
 * Function change last connection time of bolierplate widget
 * @access public
 * @param {object} widget
 * @returns {object}
 */
BoilerplateWidgetCalculator.changeLastConnectionTime = function(widget, callback) {
    widgetDAO.getWidgetsByParams({
        type: consts.DATA_SENSE_WIDGET_TYPES.Boilerplate, 
        boilerplateType: consts.BOILERPLATE_WIDGET_TYPES.CommunicationMonitoring
    }, 
    function (findErr, findResult) {
        if(findErr || findResult.length === 0) {
            //log.info(consts.NOT_FOUND_BOILERPLATE_COMMUNICATION_MONITORING_WIDGET);
            callback(null, null);
        }
        else {
            var boilerplateWidget = findResult[0];
            boilerplateWidget.lastConnected = moment().format();
            
            boilerplateWidget.save(function (saveErr, savedWidget) {
                if(saveErr) {
                    callback(saveErr, null);
                }
                else {
                    callback(null, consts.OK);
                }
            });
        }
    });
};


exports.BoilerplateWidgetCalculator = BoilerplateWidgetCalculator;