"use strict";

var _                   = require("lodash");
var moment              = require("moment");
var async               = require("async");
var utils               = require("../../../libs/utils");
var log                 = require("../../../libs/log")(module);
var consts              = require("../../../libs/consts");
var dataProvider        = require("dataprovider-service");
var equivCalc           = require("../../../general/core/calculation/equivalencies-calculator").EquivalenciesCalculator;
var actualPredictedCalc = require("./actual-predicted-energy");
var calcUtils           = require("./calculator-utils");

function getPowerData(tempoiqResponse) {
    var tmpResult = _.map(tempoiqResponse.dataPoints, function(point) {
        var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
            var metric = _.first(_.keys(el)); // We are expecting powr or Pac
            var val = el[metric];
            return _.isNumber(val) ? parseFloat(val) : 0;
        }), function(sum, x) {
            return sum + x;
        }, 0.0);

        //var date = moment.utc(point.ts);

        return {
            "category": point.ts,
            "series": sumOfNodes / 1000
        };
    });
    var result = {
        "categories": _.pluck(tmpResult, "category"),
        "series": _.pluck(tmpResult, "series")
    };
    tmpResult = null;

    return result;
}

function getEnergyData(tempoiqResponse, dateTimeUtils) {
    var tmp = _.map(tempoiqResponse.dataPoints, function(point) {
        var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
            var metric = _.first(_.keys(el)); // We are expecting powr or Pac
            var val = el[metric];
            return _.isNumber(val) ? parseFloat(val) : 0;
        }), function(sum, x) {
            return sum + x;
        }, 0.0);

        return {
            "ts": point.ts,
            "kWh": sumOfNodes / 1000.0
        };
    });

    var byMonth = _.groupBy(tmp, function(el) {
        return moment(el.ts).format("YYYY-MM");
    });

    var series = [];
    var categories = [];
    var keys = Object.keys(byMonth);

    var totalProduction = 0;

    for(var i=0; i < keys.length; i++) {
        var kWhs = _.pluck(byMonth[keys[i]], "kWh");
        var t = moment(_.first(byMonth[keys[i]]).ts).utc().startOf("month");

        series.push([t.format("YYYY"), t.valueOf(), _.first(kWhs), _.max(kWhs), _.min(kWhs), _.last(kWhs)]);

        categories.push(dateTimeUtils.formatDate(t));

        totalProduction += _.sum(kWhs);
    }

    tmp = null;
    byMonth = null;

    return {
        "series": series,
        "categories": categories,
        "totalProduction": totalProduction
    };
}

function getPredictedData(tempoiqResponse, interval, facilitiesList) {
    var categories = actualPredictedCalc.createCategories(interval.start, interval.end, interval.dateRange);

    var actual = actualPredictedCalc.transformTempoiqResponse(tempoiqResponse, interval.dateRange, facilitiesList);
    var predictionObject = new actualPredictedCalc.PredictionObject(actual, facilitiesList);

    var predictedValue = 0;

    _.each(categories, function(category) {
        var categoryPredictedValue = predictionObject.predict(category);
        log.silly("category = " + category + ", categoryPredictedValue = " + categoryPredictedValue);

        predictedValue += (categoryPredictedValue? categoryPredictedValue: 0);
    });

    var facilitiesData = {};
    var facilityObj = facilitiesList[_.keys(facilitiesList)[0]]; // because it's only one facility
    facilitiesData[facilityObj.id] = {
        "facilityId": facilityObj.id,
        "constEmissionFactor": facilityObj.constEmissionFactor,
        "kwh": predictedValue
    };
    
    var thisEquivCalc = new equivCalc(facilitiesData);
    var equivData = thisEquivCalc.calc();

    categories = null;
    actual = null;
    predictionObject = null;

    return {
        predictedAnnualGeneration: predictedValue,
        predictedCarbonAvoided: equivData.avoidedCarbon
    };
}

function loadData(clientObject, inspectedFacility, energyYear) {
    var socket = clientObject.socket;
    var solarTags = clientObject.solarTags;
    //var dateRange = clientObject.dateRange;

    if (!inspectedFacility) {
        var finalResult = new utils.serverAnswer(true, {});
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, finalResult);
        return;
    }

    var pipelinePower = {
        "functions":[{
            "name": "rollup",
            "arguments": ["max", "1day"]
        }]
    };

    var pipelineEnergy = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] // average energy by hour
        }, {
            "name": "rollup",
            "arguments": ["sum", "1day"] // Wh data - EOD result
        }]
    };

    var pipelineEnergyPredicted = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] // kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"]
        }]
    };

    var selectedSources = {
        selectedFacilities: [inspectedFacility],
        selectedScopes: [],
        selectedNodes: []
    };

    var tmp  = calcUtils.getTempoIQParametersByUserSources(false, solarTags, selectedSources);
    var selection = tmp.selection;

   /* var powerStartDate = moment.utc().startOf("year"); // During last 12 month
    var powerEndDate = moment.utc();
    var energyStartDate =  moment.utc([energyYear, 0, 1]);
    var energyEndDate = null;

    if(!energyStartDate.isValid()) {
        energyStartDate = moment.utc().startOf("year");
    }
    energyEndDate = energyStartDate.clone().endOf("year");
    var energyDateRange = energyStartDate.year();
    */

    var rangePower = clientObject.dateTimeUtils.getYearRange("year");
    var rangeEnergy = clientObject.dateTimeUtils.getRangeForYear(energyYear);
    var energyDateRange = rangeEnergy.start.year();

    //we need loda data for previous year for predicted data
    /*var energyStartDatePredicted = energyStartDate.clone().subtract(1, "year");
     var energyStartDatePredictedOriginal = energyStartDate.clone().subtract(1, "year");
     var energyEndDatePredicted = energyEndDate.clone();
     */

    var tempoiqOptionsPower = {
        selection: selection,
        pipeline: pipelinePower
    };

    var tempoiqOptionsEnergy = {
        selection: selection,
        pipeline: pipelineEnergy
    };

    var tempoiqOptsPredicted = {
        selection: selection,
        pipeline: pipelineEnergyPredicted
    };

    var predictedInterval = actualPredictedCalc.calculateDateInterval("year", null, clientObject.dateTimeUtils);

    if (selection.devices.or.length === 0) {
        var err = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_EMPTY_SELECTION);
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, new utils.serverAnswer(false, err));
        return;
    }

    async.waterfall([
        function( cb) {
            var rangePredicted = {
                start: predictedInterval.dataStart,
                end: predictedInterval.dataEnd
            };

            //make requests to tempoiq
            async.parallel([
                function(cb) {
                    dataProvider.loadData(rangePower, clientObject.dateTimeUtils, tempoiqOptionsPower, cb);
                },
                function(cb) {
                    dataProvider.loadData(rangeEnergy, clientObject.dateTimeUtils, tempoiqOptionsEnergy, cb);
                },
                function(cb) {
                    dataProvider.loadData(rangePredicted, clientObject.dateTimeUtils, tempoiqOptsPredicted, cb);
                }
            ], cb);
        },
        function(tempoiqData, cb) {
            var potentialPower = 0;
            var facilityImage = "NOIMAGE";
            var usedFacility = _.filter(tmp.facilitiesList, function(fac) {
                return fac.id === inspectedFacility;
            });

            if(usedFacility.length > 0 && usedFacility[0].potentialPower) {
                potentialPower = usedFacility[0].potentialPower;
            }

            if(usedFacility.length > 0 && usedFacility[0].facilityImage) {
                facilityImage = usedFacility[0].facilityImage;
            }

            var resEnergy = getEnergyData(tempoiqData[1], clientObject.dateTimeUtils);
            var predicted = getPredictedData(tempoiqData[2], predictedInterval, tmp.facilitiesList);
            var res = {
                "power": getPowerData(tempoiqData[0]),
                "energySeries": resEnergy.series,
                "energyCategories": resEnergy.categories,
                "energyTotalProduction": resEnergy.totalProduction,
                "predictedAnnualGeneration": predicted.predictedAnnualGeneration,
                "predictedCarbonAvoided": predicted.predictedCarbonAvoided,
                "facilityImage": facilityImage
            };

            tempoiqData = null;
            cb(null, res);
        }
    ], function(finalErr, res) {
        var finalResult = null;
        if (finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, finalResult);
        } else {
            var result = {
                "predictedAnnualGeneration": res["predictedAnnualGeneration"],
                "predictedCarbonAvoided": res["predictedCarbonAvoided"],
                "energyChart": {
                    "series": res["energySeries"],
                    "categories": res["energyCategories"],
                    "totalProduction": res["energyTotalProduction"],
                    "year": energyDateRange
                },
                "powerChart": res["power"],
                "facilityImage": res["facilityImage"]

            };

            if(inspectedFacility === clientObject.inspectedFacility && energyYear === clientObject.facilityEnergyYear) {
                finalResult = new utils.serverAnswer(true, result);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, finalResult);
            }
            res = null;
            result = null;
            finalResult = null;
        }
    });
}

exports.loadData = loadData;
