"use strict";

var //log = require("../../../../libs/log")(module),
    utils = require("../../../../libs/utils"),
    consts = require("../../../../libs/consts"),
    //tempoiq = require("../../../../general/core/tempoiq/tempoiq-wrapper"),
    dataProvider = require("dataprovider-service"),
    moment = require("moment"),
    async = require("async"),
    cacheHelper = require("../../../../libs/cache-helper");

/**
 * Function sends presentation data via websocket
 * @access private
 * @param {object} loadedData - data to sens
 * @param {object} presentationDTO
 * @param {boolean} isCompleted
 * @param {object} socket
 * @returns {void}
 */
function sendPresentationData(loadedData, presentationDTO, isCompleted, socket) {
    var obj = {
        presentationId: presentationDTO._id,
        presentationData: loadedData,
        isCompleted: isCompleted
    };
    var finalResult = new utils.serverAnswer(true, obj);
    socket.emit(consts.WEBSOCKET_EVENTS.PRESENTATION_DATA, finalResult);
}

/**
 * Function calculates partial presentation data and sends to socket with flag isCompleted=false
 * @access private
 * @param {object} err
 * @param {object} totalTempoIQResults
 * @param {object} tempoIQResult
 * @param {object} presentationDTO
 * @param {object} socket
 * @param {function} callback
 * @returns {object}
 */
function processTempoIQItem(err, totalTempoIQResults, tempoIQResult, presentationDTO, socket, callback) {
    if(err) {
        callback(err);
    } else {
        //collect total data
        totalTempoIQResults.push(tempoIQResult);
        if(socket) {
            var loadedData = process(totalTempoIQResults, presentationDTO);
            sendPresentationData(loadedData, presentationDTO, false, socket);
        }

        callback(null, tempoIQResult);
    }
}

function process(results, presentationDTO) {
    var generatedSince = null,
        lastUpdated = null;

    for(var i = 0; i < results.length;i++) {
        //log.info("process: " + results[i].dataPoints.length);

        if(results[i].dataPoints.length > 0) {

            var thisGeneratedSince = moment(results[i].dataPoints[0].ts);
            var thisLastUpdated = moment(results[i].dataPoints[results[i].dataPoints.length - 1].ts);

            //log.info("thisGeneratedSince %s", thisGeneratedSince.toISOString());
            //log.info("thisLastUpdated %s", thisLastUpdated.toISOString());

            if (!generatedSince || thisGeneratedSince < generatedSince) {
                //log.info("set thisGeneratedSince");
                generatedSince = thisGeneratedSince;
            }

            if (!lastUpdated || thisLastUpdated > lastUpdated) {
                lastUpdated = thisLastUpdated;
            }

            //log.info("first:" + results[i].dataPoints[0].t)
            //log.info("last:" + results[i].dataPoints[results[i].dataPoints.length - 1].t)
        }
    }

    var returnObj = {
        "generatingSince": generatedSince,
        "lastUpdated": lastUpdated,
        "systemSize": presentationDTO.systemSize
    };

    return returnObj;
}

function calculateEnergyData(cachedData, presentationDTO, tempoIQQueryParams, socket, finalCallback) {

    var loadAllExistingData = !cachedData.lastDate;
    var totalTempoIQResults = cachedData.tempoIQCachedResults;
    async.map(tempoIQQueryParams, function(tempoIQParam, callback) {

        var selection = {
            "devices": {
                "key": tempoIQParam.sensor
            },
            "sensors": {
                "key": tempoIQParam.type
            }
        };

        var options = {
            selection: selection,
            pipeline: null,
            queryItem: tempoIQParam
        };

        if(loadAllExistingData) {
            dataProvider.loadAllExistingData(null, options, function (err, result) {
                processTempoIQItem(err, totalTempoIQResults, result, presentationDTO, socket, callback);
            });
        } else {
            if(cachedData.lastDate) {
                tempoIQParam.startDate = cachedData.lastDate;
            }

            if(!tempoIQParam.endDate) {
                tempoIQParam.endDate = moment.utc();
            }

            var range = {
                start: tempoIQParam.startDate,
                end: tempoIQParam.endDate
            };

            dataProvider.loadData(range, null, options, function(err, result) {
                processTempoIQItem(err, totalTempoIQResults, result, presentationDTO, socket, callback);
            });
        }
        //tempodb.loadAllExistingData(options, callback);

    }, function (err, results) {
        if(err) {
            utils.presentationErrorHandler(err, socket, finalCallback);
        } else {

            var loadedData = process(totalTempoIQResults, presentationDTO);

            if(socket) {

                var presentationId = presentationDTO._id.toString();

                cacheHelper.setElementData(presentationId + ":" + presentationId,
                    consts.PRESENT_TEMPOIQ_CACHE_TTL, totalTempoIQResults, function(cacheErr, cacheResult) {

                        results = null;
                        totalTempoIQResults = null;

                        if(cacheErr) {
                            utils.presentationErrorHandler(cacheErr, socket, finalCallback);
                        } else {
                            //send full data for that widget
                            sendPresentationData(loadedData, presentationDTO, true, socket);
                            loadedData = null;
                        }
                    });

            } else {
                finalCallback(null, loadedData);
            }
        }
    });
}

exports.calculateEnergyData = calculateEnergyData;