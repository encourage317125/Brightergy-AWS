"use strict";

var //express = require("express"),
    moment = require("moment"),
    consts = require("../../../../libs/consts"),
//router = express.Router(),
//_ = require("lodash"),
//log = require("../../../../libs/log")(module),
    utils = require("../../../../libs/utils"),
    async = require("async"),
    widgetDAO = require("../../dao/widget-dao"),
    tagDAO = require("../../../../general/core/dao/tag-dao"),
    presentationDAO = require("../../dao/presentation-dao"),
    presentationCalculator = require("../presentation/presentation-calculator"),
    energyEquivalenciesWidgetCalculator = require("./energy-equivalencies-widget-calculator"),
    solarWidgetCalculator = require("./solar-widget-calculator"),
    graphWidgetCalculator = require("./graph-widget-calculator"),
    weatherWidgetCalculator = require("./weather-widget-calculator"),
    cacheHelper = require("../../../../libs/cache-helper");

function getDataSources(presentation, finalCallback) {
    var presentationId = presentation._id.toString();

    async.waterfall([
        function(callback) {
            tagDAO.getTagsFullHierarchyByEntityIds("Presentation", [presentationId], null, null, callback);
        },
        function(foundItems, callback) {
            var dataSources = foundItems[presentationId];
            tagDAO.filterTagsByTypeA(dataSources, consts.TAG_TYPE.Node, consts.TAG_TYPE.Scope,
                function(err,sensorTags) {
                    if(err) {
                        callback(err);
                    } else {
                        callback(null, dataSources, sensorTags);
                    }
                });
        },
        function(dataSources, sensorTags, callback) {
            tagDAO.filterTagsByTypeA(dataSources, consts.TAG_TYPE.Metric, consts.TAG_TYPE.Scope,
                function(err,metricTags) {
                    if(err) {
                        callback(err);
                    } else {
                        callback(null, dataSources, sensorTags, metricTags);
                    }
                });
        }
    ], function(err, dataSources, sensorTags, metricTags) {
        if(err) {
            finalCallback(err);
        } else {
            finalCallback(null, dataSources, sensorTags, metricTags);
        }
    });
}

function startLoadingData(cachedData, presentation, widget, widgetType, tempoIQItems, socket, finalCallback) {
    if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Solar) {
        solarWidgetCalculator.calculateData(cachedData, widget, presentation, tempoIQItems, socket, finalCallback);
    } else if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Graph) {
        graphWidgetCalculator.calculateData(cachedData, widget, presentation, tempoIQItems, socket, finalCallback);
    } else if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.EnergyEquivalencies) {
        energyEquivalenciesWidgetCalculator.calculateData(cachedData, widget, presentation,
            tempoIQItems, socket, finalCallback);
    } else if(widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Weather) {
        weatherWidgetCalculator.getWeatherWidgetData(widget, presentation, tempoIQItems, socket, finalCallback);
    } else if(widgetType === consts.PRESENTATION_ENERGY_DATA) {
        presentationCalculator.calculateEnergyData(cachedData, presentation, tempoIQItems, socket, finalCallback);
    }
}

/**
 * Runs calculation for widget
 *
 * @access  private
 * @param   {object} presentation
 * @param   {object} widget - express request object
 * @param   {string} widgetType
 * @param   {object} tempoIQItems
 * @param   {object} response
 * @param   {object} next
 * @return  {array}
 */
function runWidgetCaclulator(presentation, widget, widgetType, tempoIQItems, socket, finalCallback) {
    if(socket) {
        var presentationId = presentation._id.toString();
        var widgetId = widgetType === consts.PRESENTATION_ENERGY_DATA ? presentationId: widget._id.toString();
        cacheHelper.getCachedElementData(presentationId + ":" +  widgetId, null, function(cacheErr, loadedObj) {
            if(cacheErr) {
                utils.presentationErrorHandler(cacheErr, socket, finalCallback);
            } else {

                if(!loadedObj) {
                    loadedObj = [];
                }

                var lastDate = utils.getLastDateFromTempoIQResults(loadedObj);
                utils.removeDuplicateTempoIQDates(loadedObj, lastDate);

                var cachedData =  {
                    tempoIQCachedResults: loadedObj,
                    lastDate: lastDate
                };

                startLoadingData(cachedData, presentation, widget, widgetType, tempoIQItems, socket, finalCallback);
            }
        });
    } else {
        //ajax

        var tempIQCachedData =  {
            tempoIQCachedResults: [],
            lastDate: null
        };

        startLoadingData(tempIQCachedData, presentation, widget, widgetType, tempoIQItems, socket, finalCallback);
    }

    /*var presentationId = presentation._id.toString();
    var widgetId = widgetType === consts.PRESENTATION_ENERGY_DATA ? presentationId: widget.widget._id.toString();
    cacheUtils.getWidgetData('MANUAL_SOCKET', presentationId, widgetId, function(cacheErr, loadedObj) {
        if(cacheErr) {
            utils.presentationErrorHandler(cacheErr, socket, finalCallback)
        } else {

            if(!loadedObj) {
                loadedObj = [];
            }

            var lastDate = utils.getLastDateFromTempoIQResults(loadedObj);
            utils.removeDuplicateTempoIQDates(loadedObj, lastDate);

            var tempIQCachedData =  {
                tempoIQCachedResults: loadedObj,
                lastDate: lastDate
            };

            startLoadingData(tempIQCachedData, presentation, widget, widgetType, tempoIQItems, socket, finalCallback);
        }
    });*/
}

function getTempoDBItem(metric, metricName, startDate, endDate, family, deviceId, sensor, interval) {
    var tempoIQParamObject = {
        startDate: startDate,
        endDate: endDate,
        family: family,
        device: deviceId,
        sensor: utils.encodeSeriesKey(sensor.deviceID),
        interval: interval || sensor.interval,
        metricName: metricName,
        latitude: sensor.latitude,
        longitude: sensor.longitude,
        type: metric.metricID,
        summaryMethod: metric.summaryMethod,
        metricType: metric.metricType

    };

    tempoIQParamObject.endDate = utils.addOneDay(tempoIQParamObject.endDate);
    return tempoIQParamObject;
}

function getFamilyByDevice(device) {
    if(/Web Box/i.test(device) || /WebBox/i.test(device)) {
        return consts.WEBBOX;
    } else if(/eGauge/i.test(device)) {
        return consts.EGAUGE;
    } else if(/Enphase/i.test(device)) {
        return consts.ENPHASE;
    } else {
        return null;
    }
}

/**
 * generates tempo iq parameters
 *
 * @access  private
 * @param   {object} widget - express request object
 * @param   {string} widgetType
 * @param   {object} startDate
 * @param   {object} endDate
 * @param   {array} commonDataLoggers
 * @param   {array} tempoDBItems
 * @return  {void}
 */
function convertDataLoggersToTempoDBMeta(widget, widgetType, startDate, endDate, commonDataLoggers, tempoDBItems) {
    for(var dataLoggerIndex = 0; dataLoggerIndex < commonDataLoggers.length; dataLoggerIndex++) {
        var dataLogger = commonDataLoggers[dataLoggerIndex];
        var deviceId = null;
        var family = getFamilyByDevice(dataLogger.device);
        if(family === consts.WEBBOX) {
            deviceId = utils.getParsedWebBox(dataLogger.deviceID);
        } else {
            deviceId = utils.encodeSeriesKey(dataLogger.deviceID);
        }

        for(var sensorIndex = 0; sensorIndex < dataLogger.childTags.length; sensorIndex++) {
            var sensor = dataLogger.childTags[sensorIndex];
            var metrics = sensor.childTags;

            var obj = null;

            if (metrics && (metrics.length > 0)){

                for(var metricIndex =0; metricIndex < metrics.length; metricIndex++) {
                    var metric = metrics[metricIndex];
                    obj = null;

                    if(widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Solar || 
                        widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.EnergyEquivalencies || 
                        widgetType === consts.PRESENTATION_ENERGY_DATA) {

                        if(metric.name === consts.METRIC_NAMES.kWh) {
                            obj = getTempoDBItem(metric, consts.METRIC_NAMES.kWh,
                                startDate, endDate, family, deviceId, sensor);
                            tempoDBItems.push(obj);
                        }
                    } else if(widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Graph) {

                        var isHumidity = widget.parameters.widgetGraphHumidity;
                        var isTemperature = widget.parameters.widgetGraphTemperature;
                        var isWeather = widget.parameters.widgetGraphWeather;
                        var isGeneration = widget.parameters.widgetGraphGeneration;
                        var isCurrentPower = widget.parameters.widgetGraphCurrentPower;
                        var isMaxPower = widget.parameters.widgetGraphMaxPower;

                        /*if((isGeneration ||isCurrentPower || isMaxPower) && metric.name === consts.METRIC_NAMES.kWh) {
                            obj = getTempoDBItem(metric, consts.METRIC_NAMES.kWh,
                                startDate, endDate, family, deviceId, sensor);
                            tempoDBItems.push(obj);
                        }*/

                        if(isGeneration && metric.name === consts.METRIC_NAMES.kWh) {
                            obj = getTempoDBItem(metric, consts.METRIC_NAMES.kWh,
                                startDate, endDate, family, deviceId, sensor, widget.parameters.widgetGraphInterval);
                            tempoDBItems.push(obj);
                        } else if(isCurrentPower && metric.name === consts.METRIC_NAMES.kW) {
                            obj = getTempoDBItem(metric, consts.METRIC_NAMES.kW,
                                startDate, endDate, family, deviceId, sensor, widget.parameters.widgetGraphInterval);
                            tempoDBItems.push(obj);
                        } else if(isMaxPower && metric.name === consts.METRIC_NAMES.WattsMax) {
                            obj = getTempoDBItem(metric, consts.METRIC_NAMES.WattsMax,
                                startDate, endDate, family, deviceId, sensor, widget.parameters.widgetGraphInterval);
                            tempoDBItems.push(obj);
                        }

                        if((isTemperature || isWeather || isHumidity) && sensor.Latitude && sensor.Longitude) {
                            obj = getTempoDBItem(metric, consts.temperature, 
                                startDate, endDate, family, deviceId, sensor, widget.parameters.widgetGraphInterval);
                            tempoDBItems.push(obj);
                        }

                    } else if(widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Weather) {
                        if(sensor.latitude && sensor.longitude && 
                            ((sensor.latitude !== 0) && (sensor.longitude !== 0))) {
                            obj = getTempoDBItem(metric, consts.temperature, 
                                startDate, endDate, family, deviceId, sensor);
                            tempoDBItems.push(obj);
                        }
                    }
                }
            } else {
                if (widgetType === "weather") {
                    var tempoSensor = sensor;
                    if (!tempoSensor.longitude || !tempoSensor.latitude) {
                        tempoSensor.longitude = dataLogger.longitude;
                        tempoSensor.latitude = dataLogger.latitude;
                    }
                    var defaultMetric = {summaryMethod: "Average", metricID: "W"};
                    obj = getTempoDBItem(defaultMetric, consts.temperature,
                     startDate, endDate, family, deviceId, tempoSensor);
                    tempoDBItems.push(obj);
                }
            }
        }

    }
}

function convertSensorParentToTempoDBMeta(widget, widgetType, startDate, endDate, commonDataLoggers, tempoDBItems) {

    for(var dataLoggerIndex = 0; dataLoggerIndex < commonDataLoggers.length; dataLoggerIndex++) {
        var dataLogger = commonDataLoggers[dataLoggerIndex];
        var deviceId = null;
        var family = getFamilyByDevice(dataLogger.device);
        if(family === consts.WEBBOX) {
            deviceId = utils.getParsedWebBox(dataLogger.deviceID);
        } else {
            deviceId = utils.encodeSeriesKey(dataLogger.deviceID);
        }

        for(var sensorIndex = 0; sensorIndex < dataLogger.childTags.length; sensorIndex++) {
            var sensor = dataLogger.childTags[sensorIndex];
            var metrics = sensor.childTags;

            var obj = null;

            if (metrics && (metrics.length > 0)) {
                for(var metricIndex =0; metricIndex < metrics.length; metricIndex++) {

                    var metric = metrics[metricIndex];

                    obj = getTempoDBItem(metric, consts.temperature,
                     startDate, endDate, family, deviceId, dataLogger);
                    tempoDBItems.push(obj);
                }
            } else {
                if (widgetType === "weather") {
                    var defaultMetric = {summaryMethod: "Average", metricID: "W"};
                    obj = getTempoDBItem(defaultMetric, consts.temperature, 
                        startDate, endDate, family, deviceId, dataLogger);
                    tempoDBItems.push(obj);
                }
            }
        }

    }

}

function addDataLoggers(widget, widgetType, startDate, endDate, dataLoggers, commonTempoDBItems) {
    var thisDataLoggers = [];
    for(var dataLoggerIndex = 0; dataLoggerIndex < dataLoggers.length; dataLoggerIndex++) {
        var dataLogger = dataLoggers[dataLoggerIndex];
        convertDataLoggersToTempoDBMeta(widget, widgetType, startDate, endDate, [dataLogger], commonTempoDBItems);
        thisDataLoggers.push(dataLogger);
    }
}

function addDataLoggersByFacilities(widget, widgetType, startDate, endDate, dataLoggers, commonTempoDBItems) {
    var thisDataLoggers = [];
    for(var dataLoggerIndex = 0; dataLoggerIndex < dataLoggers.length; dataLoggerIndex++) {
        var dataLogger = dataLoggers[dataLoggerIndex];
        thisDataLoggers.push(dataLogger);
    }
    convertDataLoggersToTempoDBMeta(widget, widgetType, startDate, endDate, thisDataLoggers, commonTempoDBItems);
}

/**
 * generates tempo iq parameters
 *
 * @access  private
 * @param   {object} widget - express request object
 * @param   {string} widgetType
 * @param   {object} startDate
 * @param   {object} endDate
 * @param   {object} dataSources
 * @param   {object} dataLoggersBySensors
 * @param   {object} dataLoggersByMetrics
 * @return  {array}
 */
function generateTempoItemsList(widget, widgetType, startDate, endDate,
                                dataSources, dataLoggersBySensors, dataLoggersByMetrics) {

    var tempoIQQueryParams = [],
        usedataLoggerGEO = false,
        i, item;
    for(i=0; i < dataSources.length; i++) {
        item = dataSources[i];

        if(item.tagType === consts.TAG_TYPE.Facility) {
            addDataLoggersByFacilities(widget, widgetType, startDate, endDate, item.childTags, tempoIQQueryParams);
        } else if(item.tagType === consts.TAG_TYPE.Scope) {
            addDataLoggers(widget, widgetType, startDate, endDate, [item], tempoIQQueryParams);
        } else if ((widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Weather) && 
            (item.tagType === consts.TAG_TYPE.Node) && (!item.latitude || !item.longitude)) {
            usedataLoggerGEO = true;
        }
    }

    if (usedataLoggerGEO) {
        convertSensorParentToTempoDBMeta(widget, widgetType, 
            startDate, endDate, dataLoggersBySensors, tempoIQQueryParams);
    } else {

        for(i=0; i < dataLoggersBySensors.length; i++) {
            item = dataLoggersBySensors[i];

            addDataLoggers(widget, widgetType, startDate, endDate, [item], tempoIQQueryParams);
        }

        for(i=0; i < dataLoggersByMetrics.length; i++) {
            item = dataLoggersByMetrics[i];

            addDataLoggers(widget, widgetType, startDate, endDate, [item], tempoIQQueryParams);
        }
    }

    return tempoIQQueryParams;
}

/**
 * Common dataLoggers info to tempodb metadata
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function parse(request, response, next, widgetType) {

    if(widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Weather || widgetType === consts.PRESENTATION_ENERGY_DATA) {
        var presentationIdId = request.params.presentationId;

        presentationDAO.getPresentationById(presentationIdId, null, function (foundPresentationErr, foundPresentation) {
            if (foundPresentationErr) {
                return next(foundPresentationErr);
            } else {

                getDataSources(foundPresentation, function(err, rootDataSources, sensorTags, metricTags) {
                    if(err) {
                        return next(err);
                    } else {
                        var tempoIQQueryParams = generateTempoItemsList(null, widgetType, null, null,
                            rootDataSources, sensorTags, metricTags);

                        runWidgetCaclulator(foundPresentation, null, widgetType, tempoIQQueryParams, null,
                            function(err, result) {
                                if(err) {
                                    return next(err);
                                } else {
                                    return utils.successResponse(result, response, next);
                                }
                            });
                    }
                });
            }
        });

    } else {

        var widgetId = request.params.widgetId;

        widgetDAO.getWidgetById(widgetId, null, function (err, widgetDTO) {
            if (err) {
                return next(err);
            } else {

                presentationDAO.getPresentationById(widgetDTO.presentation._id, null,
                    function (foundPresentationErr, foundPresentation) {
                        if (foundPresentationErr) {
                            return next(foundPresentationErr);
                        } else {
                            var dateRange = null, startDate = null, endDate = null, error;

                            if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Solar) {
                                dateRange = widgetDTO.parameters.widgetSolarGenerationDateRange;
                                startDate = moment(widgetDTO.parameters.widgetSolarGenerationStartDate);
                                endDate = moment(widgetDTO.parameters.widgetSolarGenerationEndDate);
                            } else if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Graph) {
                                dateRange = widgetDTO.parameters.widgetGraphDateRange;
                                var interval = widgetDTO.parameters.widgetGraphInterval;
                                startDate = moment(widgetDTO.parameters.widgetGraphStartDate);
                                endDate = moment(widgetDTO.parameters.widgetGraphEndDate);

                                if (!interval) {
                                    error = new Error("Unknown Graph widget interval");
                                    error.status = 422;
                                    return next(error);
                                }
                            } else if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.EnergyEquivalencies) {
                                dateRange = widgetDTO.parameters.widgetEnergyDateRange;
                                startDate = moment(widgetDTO.parameters.widgetEnergyStartDate);
                                endDate = moment(widgetDTO.parameters.widgetEnergyEndDate);
                            }

                            if (!dateRange) {
                                error = new Error("Missing date range");
                                error.status = 422;
                                return next(error);
                            } else {
                                if (dateRange === "-- Custom --") {

                                    if (!startDate || !endDate || !moment(startDate).isValid() ||
                                        !moment(endDate).isValid()) {
                                        error = new Error("startDate or endDate are incorrect or not specified");
                                        error.status = 422;
                                        return next(error);
                                    }

                                } else {
                                    endDate = moment.utc().millisecond(0).add(-6, "h");
                                    //log.info("endDate1 %s", endDate.toISOString());
                                    if (dateRange === "Day") {
                                        startDate = endDate.clone().add(-1, "d");
                                    } else if (dateRange === "3 Days") {
                                        startDate = endDate.clone().add(-2, "d");
                                    } else if (dateRange === "Week") {
                                        startDate = endDate.clone().add(-1, "w");
                                    } else if (dateRange === "Month") {
                                        startDate = endDate.clone().add(-1, "months");
                                    } else if (dateRange === "Year") {
                                        startDate = endDate.clone().add(-1, "years");
                                    } else if (dateRange === "All") {
                                        startDate = null;
                                        endDate = null;
                                    } else {
                                        error = new Error("Unknown data range");
                                        error.status = 422;
                                        return next(error);
                                    }

                                    //log.info("endDate2 %s", endDate.toISOString());
                                    //log.info("startDate1 %s", startDate.toISOString());
                                }

                                getDataSources(foundPresentation,
                                    function(err, rootDataSources, sensorTags, metricTags) {
                                        if(err) {
                                            return next(err);
                                        } else {
                                            var tempoIQQueryParams = generateTempoItemsList(widgetDTO, widgetType,
                                                startDate, endDate, rootDataSources, sensorTags, metricTags);

                                            runWidgetCaclulator(foundPresentation, widgetDTO, widgetType,
                                                tempoIQQueryParams, null,
                                                function(err, result) {
                                                    if(err) {
                                                        return next(err);
                                                    } else {
                                                        return utils.successResponse(result, response, next);
                                                    }
                                                });
                                        }
                                    });
                            }

                        }
                    });
            }
        });
    }
}

function getWidgetTypeByName(widgetName) {
    switch(widgetName) {
        case "Graph":
            return consts.BRIGHTERVIEW_WIDGET_TYPES.Graph;
        case "Energy Equivalencies":
            return consts.BRIGHTERVIEW_WIDGET_TYPES.EnergyEquivalencies;
        case "Solar Generation":
            return consts.BRIGHTERVIEW_WIDGET_TYPES.Solar;
        case "Weather":
            return consts.BRIGHTERVIEW_WIDGET_TYPES.Weather;
        default:
            return null;

    }
}

/**
 * Functions calculates data for one widget
 * @access private
 * @param {object} presentation
 * @param {object} widgetDTO
 * @param {object} rootDataSources
 * @param {object} sensorTags
 * @param {object} metricTags
 * @param {object} socket
 * @returns {void}
 */
function processWidget(presentation, widgetDTO, rootDataSources, sensorTags, metricTags, socket) {
    var widgetType = getWidgetTypeByName(widgetDTO.name);
    var widgetId = widgetDTO._id.toString();
    var tempoIQQueryParams = null;

    if(!widgetType) {
        var obj = {
            presentationId: presentation._id,
            widgetId: widgetId,
            widgetData: {},
            isCompleted: true
        };
        var finalResult = new utils.serverAnswer(true, obj);
        socket.emit(consts.WEBSOCKET_EVENTS.PRESENTATION_DATA, finalResult);
    } else {

        var error;
        if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Weather) {
            tempoIQQueryParams = generateTempoItemsList(null, widgetType, null, null,
                rootDataSources, sensorTags, metricTags);
            runWidgetCaclulator(presentation, widgetDTO, consts.BRIGHTERVIEW_WIDGET_TYPES.Weather,
                tempoIQQueryParams, socket, null);
        } else {

            var dateRange = null, startDate = null, endDate = null;

            if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Solar) {
                dateRange = widgetDTO.parameters.widgetSolarGenerationDateRange;
                startDate = moment(widgetDTO.parameters.widgetSolarGenerationStartDate);
                endDate = moment(widgetDTO.parameters.widgetSolarGenerationEndDate);
            } else if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.Graph) {
                dateRange = widgetDTO.parameters.widgetGraphDateRange;
                var interval = widgetDTO.parameters.widgetGraphInterval;
                startDate = moment(widgetDTO.parameters.widgetGraphStartDate);
                endDate = moment(widgetDTO.parameters.widgetGraphEndDate);

                if (!interval) {
                    error = new Error("Unknown Graph widget interval in widget: " + widgetId);
                    error.status = 422;
                    utils.presentationErrorHandler(
                        error, socket, null
                    );
                }
            } else if (widgetType === consts.BRIGHTERVIEW_WIDGET_TYPES.EnergyEquivalencies) {
                dateRange = widgetDTO.parameters.widgetEnergyDateRange;
                startDate = moment(widgetDTO.parameters.widgetEnergyStartDate);
                endDate = moment(widgetDTO.parameters.widgetEnergyEndDate);
            }

            if (!dateRange) {
                error = new Error("Missing date range in widget: " + widgetId);
                error.status = 422;
                utils.presentationErrorHandler(error, socket, null);
            } else {
                if (dateRange === "-- Custom --") {

                    if (!startDate || !endDate || !moment(startDate).isValid() || !moment(endDate).isValid()) {
                        error = new Error(
                                "startDate or endDate are incorrect or not specified in widget: " + widgetId);
                        error.status = 422;
                        utils.presentationErrorHandler(error, socket, null);
                    }

                } else {
                    endDate = moment.utc().millisecond(0).add(-6, "h");
                    //log.info('endDate1 %s', endDate.toISOString());
                    if (dateRange === "Day") {
                        startDate = endDate.clone().add(-1, "d");
                    } else if (dateRange === "3 Days") {
                        startDate = endDate.clone().add(-2, "d");
                    } else if (dateRange === "Week") {
                        startDate = endDate.clone().add(-1, "w");
                    } else if (dateRange === "Month") {
                        startDate = endDate.clone().add(-1, "months");
                    } else if (dateRange === "Year") {
                        startDate = endDate.clone().add(-1, "years");
                    } else if (dateRange === "All") {
                        startDate = null;
                        endDate = null;
                    } else {
                        error = new Error("Unknown data range in widget: " + widgetId);
                        error.status = 422;
                        utils.presentationErrorHandler(
                            error, socket, null
                        );
                    }

                    //log.info('endDate2 %s', endDate.toISOString());
                    //log.info('startDate1 %s', startDate.toISOString());
                }

                tempoIQQueryParams = generateTempoItemsList(widgetDTO, widgetType, startDate, endDate,
                    rootDataSources, sensorTags, metricTags);
                runWidgetCaclulator(presentation, widgetDTO, widgetType, tempoIQQueryParams, socket, null);
            }
        }
    }
}

function processPresentationBySocket(presentationId, socket) {
    async.waterfall([
        function(callback) {
            presentationDAO.getPresentationById(presentationId, null, callback);
        },
        function(presentation, callback) {
            widgetDAO.getWidgetsByPresentationId(presentation._id.toString(), null, function(err, widgets) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, presentation, widgets);
                }
            });
        },
        function(presentation, widgets, callback) {
            getDataSources(presentation, function(err, rootDataSources, sensorTags, metricTags) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, presentation, widgets, rootDataSources, sensorTags, metricTags);
                }
            });
        },
    ], function(err, presentation, widgets, rootDataSources, sensorTags, metricTags) {
        if(err) {
            utils.presentationErrorHandler(err, socket, null);
        } else {

            //run widgets in loop, so all widgets will send data to socket
            widgets.forEach(function (widget) {
                processWidget(presentation, widget, rootDataSources, sensorTags, metricTags, socket);
            });

            //run loading presentation energy data
            var tempoIQQueryParams = generateTempoItemsList(null, consts.PRESENTATION_ENERGY_DATA, null, null,
                rootDataSources, sensorTags, metricTags);

            runWidgetCaclulator(presentation, null, consts.PRESENTATION_ENERGY_DATA, tempoIQQueryParams, socket, null);
        }
    });
}

exports.parse = parse;
exports.processPresentationBySocket = processPresentationBySocket;
