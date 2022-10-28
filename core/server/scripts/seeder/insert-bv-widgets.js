"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    Widget = mongoose.model("bv_widget"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    moment = require("moment"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertBVWidgets(finalCallback) {

    Widget.remove({}, function(err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var widgets = [];
                    widgets.push({
                        "_id" : new ObjectId("545f79c2049d8b270032077c"),
                        "__v" : 0,
                        "availableWidgetId" : new ObjectId("54515da56109431200c5c1c3"),
                        "presentation" : new ObjectId("545f2abe649db6140038fc6a"),
                        "parameters" : {
                            "widgetGraphCombineInverters" : true,
                            "widgetEnergyCombineInverters" : true,
                            "widgetEnergyInverter" : null,
                            "widgetEnergyEndDate" : moment("2014-11-09T08:27:00.000Z"),
                            "widgetEnergyStartDate" : moment("2014-11-09T08:27:00.000Z"),
                            "widgetEnergyDateRange" : "Month",
                            "widgetEnergyOrientation" : "Horizontal",
                            "widgetEnergyType" : "Cars Removed",
                            "widgetEnergyGreenhouseKilograms" : false,
                            "widgetEnergyCO2Kilograms" : false,
                            "widgetWeatherType" : "Minimal",
                            "widgetTextareaContent" : null,
                            "widgetURL" : null,
                            "widgetTotalEGinGasSaved" : null,
                            "widgetTotalEGinFewerVehicles" : null,
                            "widgetTotalEGin60WattBulbs" : null,
                            "widgetTotalCO2OffsetinTrees" : null,
                            "widgetSolarGenerationCombineInverters" : true,
                            "widgetSolarGenerationInverter" : null,
                            "widgetSolarGenerationOrientation" : "Vertical",
                            "widgetSolarGenerationEndDate" : moment("2014-11-09T08:27:00.000Z"),
                            "widgetSolarGenerationStartDate" : moment("2014-11-09T08:27:00.000Z"),
                            "widgetSolarGenerationDateRange" : "All",
                            "widgetSolarGenerationReimbursement" : false,
                            "widgetSolarGenerationCurrent" : false,
                            "widgetSolarGenerationkWh" : true,
                            "widgetIFrameUrl" : null,
                            "widgetHowDoesSolarWorkOverallDuration" : 15,
                            "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels " +
                                                        "to the inverter where it is converted to AC electricity.",
                            "widgetHowDoesSolarWorkStepTwoDuration" : 3,
                            "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes to " + 
                                        "the electric service panel (breaker box) and routed to power your school.",
                            "widgetHowDoesSolarWorkStepThreeDuration" : 3,
                            "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert " +
                                                "it to DC electricity.",
                            "widgetHowDoesSolarWorkStepOneDuration" : 3,
                            "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more " + 
                                                "power than your school is consuming, excess electricity is " +
                                                "routed to the power grid. This earns credits on the school's " +
                                                "bill (called net-metering).",
                            "widgetHowDoesSolarWorkStepFourDuration" : 3,
                            "widgetGraphMaxPowerChartType" : "false",
                            "widgetGraphMaxPower" : true,
                            "wIdgetGraphTemperatureChartType" : "bar",
                            "widgetGraphTemperature" : false,
                            "widgetGraphWeather" : false,
                            "widgetGraphBlockLabel" : "Charting Colors",
                            "widgetGraphInverter" : null,
                            "widgetGraphIrradianceChartType" : "bar",
                            "widgetGraphIrradiance" : false,
                            "widgetGraphHumidityChartType" : "bar",
                            "widgetGraphHumidity" : false,
                            "widgetGraphEndDate" : moment("2014-11-09T08:27:00.000Z"),
                            "widgetGraphStartDate" : moment("2014-11-09T08:27:00.000Z"),
                            "widgetGraphInterval" : "Daily",
                            "widgetGraphGenerationChartType" : "bar",
                            "widgetGraphGeneration" : true,
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : "68bf7a",
                            "widgetRandomColor" : "b4e0bd",
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : moment("2014-11-09T09:00:10.000Z"),
                            "startDate" : "0:0",
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : -1,
                            "timelineRowPosition" : 0,
                            "rowPosition" : 0,
                            "rowCount" : 2,
                            "colPosition" : 0,
                            "colCount" : 4,
                            "transitionOut" : null,
                            "transitionIn" : null,
                            "backgroundImageVisible" : false,
                            "backgroundColorVisible" : true,
                            "backgroundImageLabel" : null,
                            "backgroundColorLabel" : "Body Background Color",
                            "backgroundImage" : null,
                            "backgroundColor" : "FFFFFF",
                            "normal2Font" : {
                                "visible" : true,
                                "label" : "Measures",
                                "content" : null,
                                "size" : 0.9,
                                "name" : "BentonSans, sans-serif",
                                "color" : "92949b"
                            },
                            "normal1Font" : {
                                "visible" : true,
                                "label" : "Weather Labels",
                                "content" : null,
                                "size" : 1.1,
                                "name" : "BentonSans, sans-serif",
                                "color" : "b5b5ba"
                            },
                            "subHeaderFont" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Current Date",
                                "content" : null,
                                "size" : 1.3,
                                "name" : "BentonSans, sans-serif",
                                "color" : "000000"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "82489c"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "ae93c6"
                            }
                        },
                        "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HcmdLWkJUY3RMUkU",
                        "name" : "weather"
                    });
                    widgets.push({
                        "_id" : new ObjectId("545f8424049d8b2700320781"),
                        "__v" : 0,
                        "availableWidgetId" : new ObjectId("54515da56109431200c5c1c0"),
                        "presentation" : new ObjectId("545f2abe649db6140038fc6a"),
                        "parameters" : {
                            "widgetGraphCombineInverters" : true,
                            "widgetEnergyCombineInverters" : true,
                            "widgetEnergyInverter" : null,
                            "widgetEnergyEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetEnergyStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetEnergyDateRange" : "Month",
                            "widgetEnergyOrientation" : "Horizontal",
                            "widgetEnergyType" : "Cars Removed",
                            "widgetEnergyGreenhouseKilograms" : false,
                            "widgetEnergyCO2Kilograms" : false,
                            "widgetWeatherType" : "Minimal",
                            "widgetTextareaContent" : null,
                            "widgetURL" : null,
                            "widgetTotalEGinGasSaved" : null,
                            "widgetTotalEGinFewerVehicles" : null,
                            "widgetTotalEGin60WattBulbs" : null,
                            "widgetTotalCO2OffsetinTrees" : null,
                            "widgetSolarGenerationCombineInverters" : true,
                            "widgetSolarGenerationInverter" : null,
                            "widgetSolarGenerationOrientation" : "Vertical",
                            "widgetSolarGenerationEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetSolarGenerationStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetSolarGenerationDateRange" : "All",
                            "widgetSolarGenerationReimbursement" : false,
                            "widgetSolarGenerationCurrent" : false,
                            "widgetSolarGenerationkWh" : true,
                            "widgetIFrameUrl" : null,
                            "widgetHowDoesSolarWorkOverallDuration" : 15,
                            "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels " +
                                                        "to the inverter where it is converted to AC electricity.",
                            "widgetHowDoesSolarWorkStepTwoDuration" : 3,
                            "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes to " + 
                                        "the electric service panel (breaker box) and routed to power your school.",
                            "widgetHowDoesSolarWorkStepThreeDuration" : 3,
                            "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert " +
                                                "it to DC electricity.",
                            "widgetHowDoesSolarWorkStepOneDuration" : 3,
                            "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more " + 
                                                "power than your school is consuming, excess electricity is " +
                                                "routed to the power grid. This earns credits on the school's " +
                                                "bill (called net-metering).",
                            "widgetHowDoesSolarWorkStepFourDuration" : 3,
                            "widgetGraphMaxPowerChartType" : "false",
                            "widgetGraphMaxPower" : true,
                            "wIdgetGraphTemperatureChartType" : "bar",
                            "widgetGraphTemperature" : false,
                            "widgetGraphWeather" : false,
                            "widgetGraphBlockLabel" : "Charting Colors",
                            "widgetGraphInverter" : null,
                            "widgetGraphIrradianceChartType" : "bar",
                            "widgetGraphIrradiance" : false,
                            "widgetGraphHumidityChartType" : "bar",
                            "widgetGraphHumidity" : false,
                            "widgetGraphEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetGraphStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetGraphInterval" : "Daily",
                            "widgetGraphGenerationChartType" : "bar",
                            "widgetGraphGeneration" : true,
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : "0095cf",
                            "widgetRandomColor" : "93c9ed",
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : moment("2014-11-09T09:00:10.000Z"),
                            "startDate" : "0:0",
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : -1,
                            "timelineRowPosition" : 5,
                            "rowPosition" : 1,
                            "rowCount" : 4,
                            "colPosition" : 10,
                            "colCount" : 6,
                            "transitionOut" : null,
                            "transitionIn" : null,
                            "backgroundImageVisible" : false,
                            "backgroundColorVisible" : false,
                            "backgroundImageLabel" : null,
                            "backgroundColorLabel" : null,
                            "backgroundImage" : null,
                            "backgroundColor" : "FFFFFF",
                            "normal2Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "subHeaderFont" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Title",
                                "content" : null,
                                "size" : 1.5,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "eb617b"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "fbb3bf"
                            }
                        },
                        "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HM0tmb3RDQ2hBYTA",
                        "name" : "image"
                    });
                    widgets.push({
                        "_id" : new ObjectId("56445decdb5d320c11f8916f"),
                        "availableWidgetId" : new ObjectId("56445dd6142cfffcc1c82afd"),
                        "presentation" : new ObjectId("545f2abe649db6140038fc6a"),
                        "parameters" : {
                            "widgetGraphCombineInverters" : true,
                            "widgetEnergyCombineInverters" : true,
                            "widgetEnergyInverter" : null,
                            "widgetEnergyEndDate" : null,
                            "widgetEnergyStartDate" : null,
                            "widgetEnergyDateRange" : "Month",
                            "widgetEnergyOrientation" : "Horizontal",
                            "widgetEnergyType" : "Cars Removed",
                            "widgetEnergyGreenhouseKilograms" : false,
                            "widgetEnergyCO2Kilograms" : false,
                            "widgetWeatherType" : "Minimal",
                            "widgetTextareaContent" : null,
                            "widgetURL" : null,
                            "widgetTotalEGinGasSaved" : null,
                            "widgetTotalEGinFewerVehicles" : null,
                            "widgetTotalEGin60WattBulbs" : null,
                            "widgetTotalCO2OffsetinTrees" : null,
                            "widgetSolarGenerationCombineInverters" : true,
                            "widgetSolarGenerationInverter" : null,
                            "widgetSolarGenerationOrientation" : "Vertical",
                            "widgetSolarGenerationEndDate" : null,
                            "widgetSolarGenerationStartDate" : null,
                            "widgetSolarGenerationDateRange" : "All",
                            "widgetSolarGenerationReimbursement" : false,
                            "widgetSolarGenerationCurrent" : false,
                            "widgetSolarGenerationkWh" : true,
                            "widgetIFrameUrl" : null,
                            "widgetHowDoesSolarWorkOverallDuration" : 15,
                            "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels " +
                                        "to the inverter where it is converted to AC electricity.",
                            "widgetHowDoesSolarWorkStepTwoDuration" : 3,
                            "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes " +
                                        "to the electric service panel (breaker box) and routed to power your school.",
                            "widgetHowDoesSolarWorkStepThreeDuration" : 3,
                            "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert it" +
                                        " to DC electricity.",
                            "widgetHowDoesSolarWorkStepOneDuration" : 3,
                            "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more power" +
                                        " than your school is consuming, excess electricity is routed" +
                                        " to the power grid. This earns credits on the school's" +
                                        " bill (called net-metering).",
                            "widgetHowDoesSolarWorkStepFourDuration" : 3,
                            "widgetGraphMaxPowerChartType" : "false",
                            "widgetGraphMaxPower" : true,
                            "wIdgetGraphTemperatureChartType" : "bar",
                            "widgetGraphTemperature" : false,
                            "widgetGraphWeather" : false,
                            "widgetGraphBlockLabel" : "Charting Colors",
                            "widgetGraphInverter" : null,
                            "widgetGraphIrradianceChartType" : "bar",
                            "widgetGraphIrradiance" : false,
                            "widgetGraphHumidityChartType" : "bar",
                            "widgetGraphHumidity" : false,
                            "widgetGraphEndDate" : null,
                            "widgetGraphStartDate" : null,
                            "widgetGraphInterval" : "Daily",
                            "widgetGraphGenerationChartType" : "bar",
                            "widgetGraphGeneration" : true,
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : "eb617b",
                            "widgetRandomColor" : "fbb3bf",
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : moment("2015-11-09T22:00:10.000Z"),
                            "startDate" : "0:0",
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : -1,
                            "timelineRowPosition" : 4,
                            "rowPosition" : 1,
                            "rowCount" : 4,
                            "colPosition" : 0,
                            "colCount" : 6,
                            "transitionOut" : null,
                            "transitionIn" : null,
                            "backgroundImageVisible" : false,
                            "backgroundColorVisible" : false,
                            "backgroundImageLabel" : null,
                            "backgroundColorLabel" : null,
                            "backgroundImage" : null,
                            "backgroundColor" : "FFFFFF",
                            "normal2Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "subHeaderFont" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Title",
                                "content" : null,
                                "size" : 1.5,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "eb617b"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "fbb3bf"
                            }
                        },
                        "icon" : "https://drive.google.com/file/d/0B5-_Q-9vUzexUU9aamNQT1VJcFU/view?usp=sharing",
                        "name" : "video",
                        "__v" : 0
                    });
                    widgets.push({
                        "_id" : new ObjectId("545f8432049d8b2700320782"),
                        "__v" : 0,
                        "availableWidgetId" : new ObjectId("54515da56109431200c5c1c1"),
                        "presentation" : new ObjectId("545f2abe649db6140038fc6a"),
                        "parameters" : {
                            "widgetGraphCombineInverters" : true,
                            "widgetEnergyCombineInverters" : true,
                            "widgetEnergyInverter" : null,
                            "widgetEnergyEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetEnergyStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetEnergyDateRange" : "Month",
                            "widgetEnergyOrientation" : "Horizontal",
                            "widgetEnergyType" : "Cars Removed",
                            "widgetEnergyGreenhouseKilograms" : false,
                            "widgetEnergyCO2Kilograms" : false,
                            "widgetWeatherType" : "Minimal",
                            "widgetTextareaContent" : null,
                            "widgetURL" : null,
                            "widgetTotalEGinGasSaved" : null,
                            "widgetTotalEGinFewerVehicles" : null,
                            "widgetTotalEGin60WattBulbs" : null,
                            "widgetTotalCO2OffsetinTrees" : null,
                            "widgetSolarGenerationCombineInverters" : true,
                            "widgetSolarGenerationInverter" : null,
                            "widgetSolarGenerationOrientation" : "Vertical",
                            "widgetSolarGenerationEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetSolarGenerationStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetSolarGenerationDateRange" : "All",
                            "widgetSolarGenerationReimbursement" : false,
                            "widgetSolarGenerationCurrent" : false,
                            "widgetSolarGenerationkWh" : true,
                            "widgetIFrameUrl" : null,
                            "widgetHowDoesSolarWorkOverallDuration" : 15,
                            "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels " +
                                                        "to the inverter where it is converted to AC electricity.",
                            "widgetHowDoesSolarWorkStepTwoDuration" : 3,
                            "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes to " + 
                                        "the electric service panel (breaker box) and routed to power your school.",
                            "widgetHowDoesSolarWorkStepThreeDuration" : 3,
                            "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert " +
                                                "it to DC electricity.",
                            "widgetHowDoesSolarWorkStepOneDuration" : 3,
                            "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more " + 
                                                "power than your school is consuming, excess electricity is " +
                                                "routed to the power grid. This earns credits on the school's " +
                                                "bill (called net-metering).",
                            "widgetHowDoesSolarWorkStepFourDuration" : 3,
                            "widgetGraphMaxPowerChartType" : "false",
                            "widgetGraphMaxPower" : true,
                            "wIdgetGraphTemperatureChartType" : "bar",
                            "widgetGraphTemperature" : false,
                            "widgetGraphWeather" : false,
                            "widgetGraphBlockLabel" : "Charting Colors",
                            "widgetGraphInverter" : null,
                            "widgetGraphIrradianceChartType" : "bar",
                            "widgetGraphIrradiance" : false,
                            "widgetGraphHumidityChartType" : "bar",
                            "widgetGraphHumidity" : false,
                            "widgetGraphEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetGraphStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetGraphInterval" : "Daily",
                            "widgetGraphGenerationChartType" : "bar",
                            "widgetGraphGeneration" : true,
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : "e5d944",
                            "widgetRandomColor" : "fff6ab",
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : moment("2014-11-09T09:00:10.000Z"),
                            "startDate" : "0:0",
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : -1,
                            "timelineRowPosition" : 6,
                            "rowPosition" : 0,
                            "rowCount" : 5,
                            "colPosition" : 5,
                            "colCount" : 5,
                            "transitionOut" : null,
                            "transitionIn" : null,
                            "backgroundImageVisible" : false,
                            "backgroundColorVisible" : true,
                            "backgroundImageLabel" : null,
                            "backgroundColorLabel" : "Body Background Color",
                            "backgroundImage" : null,
                            "backgroundColor" : "FFFFFF",
                            "normal2Font" : {
                                "visible" : true,
                                "label" : "Basis Text",
                                "content" : null,
                                "size" : 1,
                                "name" : "BentonSans, sans-serif",
                                "color" : "000000"
                            },
                            "normal1Font" : {
                                "visible" : true,
                                "label" : "Calculation Text",
                                "content" : null,
                                "size" : 1.8,
                                "name" : "BentonSans, sans-serif",
                                "color" : "f3672a"
                            },
                            "subHeaderFont" : {
                                "visible" : true,
                                "label" : "Supporting Text",
                                "content" : "Reimbursement",
                                "size" : 0.9,
                                "name" : "BentonSans, sans-serif",
                                "color" : "000000"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Title",
                                "content" : "Solar Generation",
                                "size" : 2.2,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "e4984a"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "fdcda5"
                            }
                        },
                        "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HaHJFMVNTV1BMTHM",
                        "name" : "solar generation"
                    });
                    widgets.push({
                        "_id" : new ObjectId("545f8438049d8b2700320783"),
                        "__v" : 0,
                        "availableWidgetId" : new ObjectId("54515da56109431200c5c1c2"),
                        "presentation" : new ObjectId("545f2abe649db6140038fc6a"),
                        "parameters" : {
                            "widgetGraphCombineInverters" : true,
                            "widgetEnergyCombineInverters" : true,
                            "widgetEnergyInverter" : null,
                            "widgetEnergyEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetEnergyStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetEnergyDateRange" : "Month",
                            "widgetEnergyOrientation" : "Horizontal",
                            "widgetEnergyType" : "Cars Removed",
                            "widgetEnergyGreenhouseKilograms" : false,
                            "widgetEnergyCO2Kilograms" : false,
                            "widgetWeatherType" : "Minimal",
                            "widgetTextareaContent" : null,
                            "widgetURL" : null,
                            "widgetTotalEGinGasSaved" : null,
                            "widgetTotalEGinFewerVehicles" : null,
                            "widgetTotalEGin60WattBulbs" : null,
                            "widgetTotalCO2OffsetinTrees" : null,
                            "widgetSolarGenerationCombineInverters" : true,
                            "widgetSolarGenerationInverter" : null,
                            "widgetSolarGenerationOrientation" : "Vertical",
                            "widgetSolarGenerationEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetSolarGenerationStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetSolarGenerationDateRange" : "All",
                            "widgetSolarGenerationReimbursement" : false,
                            "widgetSolarGenerationCurrent" : false,
                            "widgetSolarGenerationkWh" : true,
                            "widgetIFrameUrl" : null,
                            "widgetHowDoesSolarWorkOverallDuration" : 15,
                            "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels " +
                                                        "to the inverter where it is converted to AC electricity.",
                            "widgetHowDoesSolarWorkStepTwoDuration" : 3,
                            "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes to " + 
                                        "the electric service panel (breaker box) and routed to power your school.",
                            "widgetHowDoesSolarWorkStepThreeDuration" : 3,
                            "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert " +
                                                "it to DC electricity.",
                            "widgetHowDoesSolarWorkStepOneDuration" : 3,
                            "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more " + 
                                                "power than your school is consuming, excess electricity is " +
                                                "routed to the power grid. This earns credits on the school's " +
                                                "bill (called net-metering).",
                            "widgetHowDoesSolarWorkStepFourDuration" : 3,
                            "widgetGraphMaxPowerChartType" : "false",
                            "widgetGraphMaxPower" : true,
                            "wIdgetGraphTemperatureChartType" : "bar",
                            "widgetGraphTemperature" : false,
                            "widgetGraphWeather" : false,
                            "widgetGraphBlockLabel" : "Charting Colors",
                            "widgetGraphInverter" : null,
                            "widgetGraphIrradianceChartType" : "bar",
                            "widgetGraphIrradiance" : false,
                            "widgetGraphHumidityChartType" : "bar",
                            "widgetGraphHumidity" : false,
                            "widgetGraphEndDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetGraphStartDate" : moment("2014-11-09T09:11:00.000Z"),
                            "widgetGraphInterval" : "Daily",
                            "widgetGraphGenerationChartType" : "bar",
                            "widgetGraphGeneration" : true,
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : "5163ad",
                            "widgetRandomColor" : "98a3d0",
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : moment("2014-11-09T09:00:10.000Z"),
                            "startDate" : "0:0",
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : -1,
                            "timelineRowPosition" : 7,
                            "rowPosition" : 3,
                            "rowCount" : 3,
                            "colPosition" : 1,
                            "colCount" : 3,
                            "transitionOut" : null,
                            "transitionIn" : null,
                            "backgroundImageVisible" : true,
                            "backgroundColorVisible" : true,
                            "backgroundImageLabel" : "Background Image",
                            "backgroundColorLabel" : "Body Background Color",
                            "backgroundImage" : null,
                            "backgroundColor" : "FFFFFF",
                            "normal2Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "subHeaderFont" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Title",
                                "content" : null,
                                "size" : 1.5,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "sixthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fifthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "fourthColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "tertiaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "ffffff"
                            },
                            "secondaryColor" : {
                                "label" : null,
                                "isVisible" : false,
                                "color" : "cf5ba2"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "e1a3ca"
                            }
                        },
                        "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HUm9rY3ZRdjRFd3c",
                        "name" : "textarea"
                    });
                    widgets.push({
                        "_id" : new ObjectId("546062b6049d8b2700320788"),
                        "__v" : 0,
                        "availableWidgetId" : new ObjectId("54515da56109431200c5c1bc"),
                        "presentation" : new ObjectId("54606228049d8b2700320786"),
                        "parameters" : {
                            "widgetGraphCombineInverters" : true,
                            "widgetEnergyCombineInverters" : true,
                            "widgetEnergyInverter" : null,
                            "widgetEnergyEndDate" : null,
                            "widgetEnergyStartDate" : null,
                            "widgetEnergyDateRange" : "Month",
                            "widgetEnergyOrientation" : "Horizontal",
                            "widgetEnergyType" : "Cars Removed",
                            "widgetEnergyGreenhouseKilograms" : false,
                            "widgetEnergyCO2Kilograms" : false,
                            "widgetWeatherType" : "Minimal",
                            "widgetTextareaContent" : null,
                            "widgetURL" : null,
                            "widgetTotalEGinGasSaved" : null,
                            "widgetTotalEGinFewerVehicles" : null,
                            "widgetTotalEGin60WattBulbs" : null,
                            "widgetTotalCO2OffsetinTrees" : null,
                            "widgetSolarGenerationCombineInverters" : true,
                            "widgetSolarGenerationInverter" : null,
                            "widgetSolarGenerationOrientation" : "Vertical",
                            "widgetSolarGenerationEndDate" : null,
                            "widgetSolarGenerationStartDate" : null,
                            "widgetSolarGenerationDateRange" : "All",
                            "widgetSolarGenerationReimbursement" : false,
                            "widgetSolarGenerationCurrent" : false,
                            "widgetSolarGenerationkWh" : true,
                            "widgetIFrameUrl" : null,
                            "widgetHowDoesSolarWorkOverallDuration" : 15,
                            "widgetHowDoesSolarWorkStepTwoText" : "DC electricity from the solar panels travels " +
                                                        "to the inverter where it is converted to AC electricity.",
                            "widgetHowDoesSolarWorkStepTwoDuration" : 3,
                            "widgetHowDoesSolarWorkStepThreeText" : "From the inverter, AC electricity passes to " + 
                                        "the electric service panel (breaker box) and routed to power your school.",
                            "widgetHowDoesSolarWorkStepThreeDuration" : 3,
                            "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert " +
                                                "it to DC electricity.",
                            "widgetHowDoesSolarWorkStepOneDuration" : 3,
                            "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more " + 
                                                "power than your school is consuming, excess electricity is " +
                                                "routed to the power grid. This earns credits on the school's " +
                                                "bill (called net-metering).",
                            "widgetHowDoesSolarWorkStepFourDuration" : 3,
                            "widgetGraphMaxPowerChartType" : "false",
                            "widgetGraphMaxPower" : true,
                            "wIdgetGraphTemperatureChartType" : "bar",
                            "widgetGraphTemperature" : false,
                            "widgetGraphWeather" : false,
                            "widgetGraphBlockLabel" : "Charting Colors",
                            "widgetGraphInverter" : null,
                            "widgetGraphIrradianceChartType" : "bar",
                            "widgetGraphIrradiance" : false,
                            "widgetGraphHumidityChartType" : "bar",
                            "widgetGraphHumidity" : false,
                            "widgetGraphEndDate" : null,
                            "widgetGraphStartDate" : null,
                            "widgetGraphInterval" : "Daily",
                            "widgetGraphGenerationChartType" : "bar",
                            "widgetGraphGeneration" : true,
                            "widgetGraphDateRange" : "All",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : "28b1b4",
                            "widgetRandomColor" : "9bd3d0",
                            "duration" : 20,
                            "resizedOnTimeline" : false,
                            "endDate" : moment("2014-11-10T07:00:20.000Z"),
                            "startDate" : "0:0",
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : -1,
                            "timelineRowPosition" : 0,
                            "rowPosition" : 0,
                            "rowCount" : 7,
                            "colPosition" : 0,
                            "colCount" : 9,
                            "transitionOut" : null,
                            "transitionIn" : null,
                            "backgroundImageVisible" : true,
                            "backgroundColorVisible" : true,
                            "backgroundImageLabel" : "Background Image",
                            "backgroundColorLabel" : "Body Background Color",
                            "backgroundImage" : null,
                            "backgroundColor" : "ffffff",
                            "normal2Font" : {
                                "visible" : true,
                                "label" : "Labels",
                                "content" : null,
                                "size" : 1,
                                "name" : "BentonSans, sans-serif",
                                "color" : "4d759e"
                            },
                            "normal1Font" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "subHeaderFont" : {
                                "visible" : false,
                                "label" : null,
                                "content" : null,
                                "size" : null,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Title",
                                "content" : null,
                                "size" : 1.5,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "seventhColor" : {
                                "label" : "Weather Graph",
                                "isVisible" : true,
                                "color" : "18f20c"
                            },
                            "sixthColor" : {
                                "label" : "Max Power Graph",
                                "isVisible" : true,
                                "color" : "d9e803"
                            },
                            "fifthColor" : {
                                "label" : "Current Power Graph",
                                "isVisible" : true,
                                "color" : "0d4b75"
                            },
                            "fourthColor" : {
                                "label" : "Humidity Graph",
                                "isVisible" : true,
                                "color" : "bf1fbf"
                            },
                            "tertiaryColor" : {
                                "label" : "Temperature Graph",
                                "isVisible" : true,
                                "color" : "0d233a"
                            },
                            "secondaryColor" : {
                                "label" : "Generation Graph",
                                "isVisible" : true,
                                "color" : "5163ad"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "98a3d0"
                            }
                        },
                        "icon" : "https://docs.google.com/a/brightergy.com/uc?id=0B3-lYVkYUF8HaVRnYThybVhmdWc",
                        "name" : "graph"
                    });
                    async.each(widgets, function (widget, saveCallback) {
                        var widgetModel = new Widget(widget);
                        widgetModel.save(saveCallback);
                    }, function (saveErr, saveResult) {
                        if (saveErr) {
                            callback(saveErr);
                        } else {
                            callback(null, consts.OK);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    var correctErr = utils.convertError(err);
                    log.error(correctErr);
                    finalCallback(correctErr, null);
                } else {
                    log.info(result);
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertBVWidgets = insertBVWidgets;