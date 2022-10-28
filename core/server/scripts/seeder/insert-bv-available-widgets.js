"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    availableWidgetModel = mongoose.model("bv_availableWidget"),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertBVAvailablewidgets(finalCallback) {
    availableWidgetModel.remove({}, function(err, retval) {
        if(err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (retcallback) {
                    var widgetsToInsert = [];
                    widgetsToInsert.push({
                        "_id" : new ObjectId("54515da56109431200c5c1bc"),
                        "name" : "Graph",
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
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 20,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 7,
                            "colPosition" : 1,
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
                        "icon" : null,
                        "__v" : 0
                    });
                    widgetsToInsert.push({
                        "_id" : new ObjectId("54515da56109431200c5c1bd"),
                        "name" : "Energy Equivalencies",
                        "parameters" : {
                            "widgetGraphCombineInverters" : true,
                            "widgetEnergyCombineInverters" : true,
                            "widgetEnergyInverter" : null,
                            "widgetEnergyEndDate" : null,
                            "widgetEnergyStartDate" : null,
                            "widgetEnergyDateRange" : "All",
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
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 4,
                            "colPosition" : 1,
                            "colCount" : 8,
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
                                "label" : "Basis Text",
                                "content" : null,
                                "size" : 2.2,
                                "name" : "BentonSans, sans-serif",
                                "color" : "4e4f53"
                            },
                            "normal1Font" : {
                                "visible" : true,
                                "label" : "Calculation Text",
                                "content" : null,
                                "size" : 4.3,
                                "name" : "BentonSans, sans-serif",
                                "color" : "008dc3"
                            },
                            "subHeaderFont" : {
                                "visible" : true,
                                "label" : "Supporting Text",
                                "content" : null,
                                "size" : 1,
                                "name" : "BentonSans, sans-serif",
                                "color" : "ffffff"
                            },
                            "headerFont" : {
                                "visible" : true,
                                "label" : "Title",
                                "content" : "Reduced Greenhouse Emissions",
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
                                "color" : "98ca57"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "dee9a5"
                            }
                        },
                        "icon" : null,
                        "__v" : 0
                    });
                    widgetsToInsert.push({
                        "_id" : new ObjectId("54515da56109431200c5c1be"),
                        "name" : "How Does Solar Work",
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
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 15,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 7,
                            "colPosition" : 1,
                            "colCount" : 16,
                            "transitionOut" : null,
                            "transitionIn" : null,
                            "backgroundImageVisible" : false,
                            "backgroundColorVisible" : false,
                            "backgroundImageLabel" : null,
                            "backgroundColorLabel" : null,
                            "backgroundImage" : null,
                            "backgroundColor" : "ffffff",
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
                                "color" : "28b1b4"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "9bd3d0"
                            }
                        },
                        "icon" : null,
                        "__v" : 0
                    });
                    widgetsToInsert.push({
                        "_id" : new ObjectId("54515da56109431200c5c1bf"),
                        "name" : "iFrame",
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
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 20,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 7,
                            "colPosition" : 1,
                            "colCount" : 16,
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
                                "color" : "e2b93b"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "fde8a5"
                            }
                        },
                        "icon" : null,
                        "__v" : 0
                    });
                    widgetsToInsert.push({
                        "_id" : new ObjectId("54515da56109431200c5c1c0"),
                        "name" : "Image",
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
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 4,
                            "colPosition" : 1,
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
                        "icon" : null,
                        "__v" : 0
                    });
                    widgetsToInsert.push({
                        "_id" : new ObjectId("56445dd6142cfffcc1c82afd"),
                        "name" : "Video",
                        "__v" : 0,
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
                            "videoType": "",
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
                            "widgetHowDoesSolarWorkStepOneText" : "Solar panels absorb sunlight and convert it " +
                                    "to DC electricity.",
                            "widgetHowDoesSolarWorkStepOneDuration" : 3,
                            "widgetHowDoesSolarWorkStepFourText" : "When your solar system generates more power " +
                                    "than your school is consuming, excess electricity is routed to the " +
                                    "power grid. This earns credits on the school's bill (called net-metering).",
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
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 4,
                            "colPosition" : 1,
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
                        "icon" : null
                    });
                    widgetsToInsert.push({
                        "_id" : new ObjectId("54515da56109431200c5c1c1"),
                        "name" : "Solar Generation",
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
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 5,
                            "colPosition" : 1,
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
                        "icon" : null,
                        "__v" : 0
                    });
                    widgetsToInsert.push({
                        "_id" : new ObjectId("54515da56109431200c5c1c2"),
                        "name" : "TextArea",
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
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 2,
                            "colPosition" : 1,
                            "colCount" : 5,
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
                        "icon" : null,
                        "__v" : 0
                    });
                    widgetsToInsert.push({
                        "_id" : new ObjectId("54515da56109431200c5c1c3"),
                        "name" : "Weather",
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
                            "widgetGraphDateRange" : "Month",
                            "widgetGraphCurrentPowerChartType" : "bar",
                            "widgetGraphCurrentPower" : false,
                            "widgetBorderColor" : null,
                            "widgetRandomColor" : null,
                            "duration" : 10,
                            "resizedOnTimeline" : false,
                            "endDate" : null,
                            "startDate" : null,
                            "minimumCols" : 2,
                            "minimumRows" : 2,
                            "previousTimelineRowPosition" : null,
                            "timelineRowPosition" : null,
                            "rowPosition" : 1,
                            "rowCount" : 2,
                            "colPosition" : 1,
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
                                "color" : "82489c"
                            },
                            "primaryColor" : {
                                "label" : "Title Background Color",
                                "isVisible" : true,
                                "color" : "ae93c6"
                            }
                        },
                        "icon" : null,
                        "__v" : 0
                    });

                    async.each(widgetsToInsert, function(widget, callback) {
                        var widgetModel = new availableWidgetModel(widget);
                        widgetModel.save(function (saveErr) {
                           if(saveErr) {
                               callback(saveErr, null);
                           } else {
                               callback(null, consts.OK);
                           }
                        });
                    }, function (err, result) {
                        if(err) {
                            log.info("available widget save error: " + err);
                        } else {
                            retcallback(null, consts.OK);
                        }
                    });
                }
            ], function (err, result){
                if (err) {
                    var correctErr = utils.convertError(err);
                    log.error(correctErr);
                } else {
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertBVAvailablewidgets = insertBVAvailablewidgets;