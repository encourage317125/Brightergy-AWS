"use strict";

var log = require("../../../../libs/log")(module),
    utils = require("../../../../libs/utils"),
    kWhCalculator = require("./kwh-calculator").kWhCalculator,
    //tempoiq = require("../../../../general/core/tempoiq/tempoiq-wrapper"),
    dataProvider = require("dataprovider-service"),
    moment = require("moment"),
    calcUtils = require("./calculator-utils"),
    async = require("async"),
    cacheHelper = require("../../../../libs/cache-helper"),
    consts = require("../../../../libs/consts");

/**
 * Function calculates data from one tempoiq result
 * @access private
 * @param {object} widgetDTO - widget body
 * @param {object} tempoDBItem - tempoiq query parameters
 * @param {object} tempodbAnswer
 * @returns {void}
 */
function SolarDTO(widgetDTO, tempoDBItem, tempodbAnswer) {

    //log.info("first %s", tempodbAnswer.dataPoints[0].ts);
    //log.info("last %s", tempodbAnswer.dataPoints[tempodbAnswer.dataPoints.length - 1].ts);

    var calc = new kWhCalculator(tempoDBItem, tempodbAnswer.dataPoints);

    this.kWhGenerated = calc.getTotalKwh();
    this.currentGeneration = calc.getCurrentGeneration();
    this.reimbursement = 0;
    this.startDate = null;
    this.endDate = null;
    //this.device = tempodbAnswer.selection.devices.attributes.Device;
    //log.info("device: "+ this.device);
    this.sensor = tempoDBItem.sensor;
    this.isCachedItem = tempodbAnswer.isCachedItem;

    if(widgetDTO.presentation.reimbursementRate && this.kWhGenerated) {
        this.reimbursement = widgetDTO.presentation.reimbursementRate * this.kWhGenerated;
    }

    if(tempodbAnswer.dataPoints.length > 0) {
        this.startDate = moment(tempodbAnswer.dataPoints[0].ts);
        this.endDate = moment(tempodbAnswer.dataPoints[tempodbAnswer.dataPoints.length - 1].ts);
    }
}

/**
 * Function calculates data
 * @access private
 * @param {array} results - tempoiq results
 * @param {array} tempoDBItems - tempoiq query parameters
 * @param {object} widgetDTO - widget body
 * @returns {object}
 */
function process(results, widgetDTO) {
    var dtos = [];

    for(var i = 0; i < results.length;i++) {
        log.info("process: " + results[i].dataPoints.length);
        var solarDTO = new SolarDTO(widgetDTO, results[i].tempoIQParam, results[i]);
        dtos.push(solarDTO);
    }

    var returnObj = {
        kWhGenerated: 0,
        currentGeneration: 0,
        reimbursement: 0,
        startDate: null,
        endDate: null
    };

    for(i = 0; i< dtos.length; i++) {
        returnObj.kWhGenerated += dtos[i].kWhGenerated;
        if(!dtos[i].isCachedItem) {
            returnObj.currentGeneration += dtos[i].currentGeneration;
        }
        returnObj.reimbursement += dtos[i].reimbursement;

        if(dtos[i].startDate) {
            if(!returnObj.startDate || dtos[i].startDate < returnObj.startDate) {
                returnObj.startDate = dtos[i].startDate;
            }
        }

        if(dtos[i].endDate) {
            if(!returnObj.endDate || dtos[i].endDate > returnObj.endDate) {
                returnObj.endDate = dtos[i].endDate;
            }
        }
    }

    return returnObj;
}

function processTempoIQItems(err, totalTempoIQResults, tempoIQResult, presentation, widgetDTO, socket, callback) {
    if(err) {
        callback(err);
    } else {
        totalTempoIQResults.push(tempoIQResult);
        if(socket) {
            //collect total data
            var loadedData = process(totalTempoIQResults, widgetDTO);
            calcUtils.sendWidgetData(loadedData, presentation, widgetDTO, false, socket);

        }

        callback(null, tempoIQResult);
    }
}

/**
 * Entry point to the module, functions returns solar widget data
 * @access public
 * @param {object} widgetDTO - widget body
 * @param {array} tempoDBItems - tempoiq query parameters
 * @param {object}response
 * @param {object} next obj
 * @returns {object}
 */
function calculateData(cachedData, widgetDTO, presentation, tempoDBItems, socket, finalCallback) {

    var loadAllExistingData = widgetDTO.parameters.widgetSolarGenerationDateRange === "All" && !cachedData.lastDate;
    var totalTempoIQResults = cachedData.tempoIQCachedResults;

    async.map(tempoDBItems, function(tempoDBItem, callback) {

        var selection = {
            "devices": {
                "key": tempoDBItem.sensor
            },
            "sensors": {
                "key": tempoDBItem.type
            }
        };

        var pipeline = calcUtils.getTempoIQPipeline(false, tempoDBItem);

        var options = {
            selection: selection,
            pipeline: pipeline,
            queryItem: tempoDBItem
        };

        if(loadAllExistingData) {
            //load ell data
            dataProvider.loadAllExistingData(null, options, function(err, result) {
                processTempoIQItems(err, totalTempoIQResults, result, presentation, widgetDTO, socket, callback);
            });
        } else {

            if(cachedData.lastDate) {
                tempoDBItem.startDate = cachedData.lastDate;
            }

            if(!tempoDBItem.endDate) {
                tempoDBItem.endDate = moment.utc();
            }

            var range = {
                start: tempoDBItem.startDate,
                end: tempoDBItem.endDate
            };

            dataProvider.loadData(range, null, options, function(err, result) {
                processTempoIQItems(err, totalTempoIQResults, result, presentation, widgetDTO, socket, callback);
            });
        }

    }, function (err, results) {
        if(err) {
            utils.presentationErrorHandler(err, socket, finalCallback);
        } else {
            var loadedData = process(totalTempoIQResults, widgetDTO);



            if(socket) {

                cacheHelper.setElementData(presentation._id.toString() + ":" + widgetDTO._id.toString(),
                    consts.PRESENT_TEMPOIQ_CACHE_TTL, totalTempoIQResults, function(cacheErr, cacheResult) {

                    results = null;
                    totalTempoIQResults = null;

                    if(cacheErr) {
                        utils.presentationErrorHandler(cacheErr, socket, finalCallback);
                    } else {
                        //send full data for that widget
                        calcUtils.sendWidgetData(loadedData, presentation, widgetDTO, true, socket);
                        loadedData = null;
                    }
                });
            } else {
                finalCallback(null, loadedData);
            }
        }
    });
}

exports.calculateData = calculateData;