"use strict";

require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
    config = require("../../config/environment"),
    availableWidgetModel = mongoose.model("bv_availableWidget"),
    async = require("async"),
    log = require("../libs/log")(module),
    utils = require("../libs/utils");

mongoose.connect(config.get("db:connection"), config.get("db:options"));

function insertData() {
    var graphAvailableWidget = new availableWidgetModel({
        name: "graph",
        parameters: {
            primaryColor: {
                isVisible: true,
                color: "98a3d0",
                label: "Title Background Color"
            },
            secondaryColor: {
                isVisible: true,
                color: "5163ad",
                label: "Generation Graph"
            },
            tertiaryColor: {
                isVisible: true,
                color: "0d233a",
                label: "Temperature Graph"
            },
            fourthColor: {
                isVisible: true,
                color: "bf1fbf",
                label: "Humidity Graph"
            },
            fifthColor: {
                isVisible: true,
                color: "0d4b75",
                label: "Current Power Graph"
            },
            sixthColor: {
                isVisible: true,
                color: "d9e803",
                label: "Max Power Graph"
            },
            seventhColor: {
                isVisible: true,
                color: "18f20c",
                label: "Weather Graph"
            },
            headerFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: 1.500,
                content: null,
                label: "Title",
                visible: true
            },
            subHeaderFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal1Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal2Font: {
                color: "4d759e",
                name: "BentonSans, sans-serif",
                size: 1.000,
                content: null,
                label: "Labels",
                visible: true
            },


            backgroundColor: "ffffff",
            backgroundImage: null,
            backgroundColorLabel: "Body Background Color",
            backgroundImageLabel: "Background Image",
            backgroundColorVisible: true,
            backgroundImageVisible: true,

            transitionIn: null,
            transitionOut: null,

            colCount: 9,
            colPosition: 1,
            rowCount: 7,
            rowPosition: 1,
            timelineRowPosition: null,
            previousTimelineRowPosition: null,
            startDate: null,
            endDate: null,
            resizedOnTimeline: false,
            duration: 20,

            minimumRows: 2,
            minimumCols: 2,

            widgetGraphCurrentPower: false,
            widgetGraphCurrentPowerChartType: "bar",
            widgetGraphDateRange: "All",
            widgetGraphGeneration: true,
            widgetGraphGenerationChartType: "bar",
            widgetGraphInterval: "Daily",
            widgetGraphStartDate: null,
            widgetGraphEndDate: null,
            widgetGraphHumidity: false,
            widgetGraphHumidityChartType: "bar",
            widgetGraphIrradiance: false,
            widgetGraphIrradianceChartType: "bar",
            widgetGraphCombineInverters: true,
            widgetGraphInverter: null,
            widgetGraphBlockLabel: "Charting Colors",
            widgetGraphWeather: false,
            widgetGraphTemperature: false,
            wIdgetGraphTemperatureChartType: "bar",
            widgetGraphMaxPower: "bar",
            widgetGraphMaxPowerChartType: false,

            widgetHowDoesSolarWorkStepOneDuration: 3,
            widgetHowDoesSolarWorkStepOneText: "Solar panels absorb sunlight and convert it to DC electricity.",
            widgetHowDoesSolarWorkStepTwoDuration: 3,
            widgetHowDoesSolarWorkStepTwoText: "DC electricity from the solar panels travels to the " +
                                                "inverter where it is converted to AC electricity.",
            widgetHowDoesSolarWorkStepThreeDuration: 3,
            widgetHowDoesSolarWorkStepThreeText: "From the inverter, AC electricity passes to the " +
                                                "electric service panel (breaker box) and routed to power your school.",
            widgetHowDoesSolarWorkStepFourDuration: 3,
            widgetHowDoesSolarWorkStepFourText: "When your solar system generates more power than your " + 
                                                "school is consuming, excess electricity is routed to " +
                                                "the power grid. This earns credits on the school's " +
                                                "bill (called net-metering).",
            widgetHowDoesSolarWorkOverallDuration: 15,

            widgetIFrameUrl: null,

            widgetSolarGenerationkWh: true,
            widgetSolarGenerationCurrent: false,
            widgetSolarGenerationReimbursement: false,
            widgetSolarGenerationDateRange: "All",
            widgetSolarGenerationStartDate: null,
            widgetSolarGenerationEndDate: null,
            widgetSolarGenerationOrientation: "Vertical",
            widgetSolarGenerationInverter: null,
            widgetSolarGenerationCombineInverters: true,

            widgetTotalCO2OffsetinTrees: null,
            widgetTotalEGin60WattBulbs: null,
            widgetTotalEGinFewerVehicles: null,
            widgetTotalEGinGasSaved: null,

            widgetURL: null,

            widgetTextareaContent: null,

            widgetWeatherType: "Minimal",

            widgetEnergyCO2Kilograms: false,
            widgetEnergyGreenhouseKilograms: false,
            widgetEnergyType: "Cars Removed",
            widgetEnergyOrientation: "Horizontal",
            widgetEnergyDateRange: "Month",
            widgetEnergyStartDate: null,
            widgetEnergyEndDate: null,
            widgetEnergyInverter: null,
            widgetEnergyCombineInverters: true

        }
    });

    var energyEquivalenciesAvailableWidget = new availableWidgetModel({
        name: "energy equivalencies",
        parameters: {
            primaryColor: {
                isVisible: true,
                color: "dee9a5",
                label: "Title Background Color"
            },
            secondaryColor: {
                isVisible: false,
                color: "98ca57",
                label: null
            },
            tertiaryColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fourthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fifthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            sixthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            seventhColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            headerFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: 2.200,
                content: "Reduced Greenhouse Emissions",
                label: "Title",
                visible: true
            },
            subHeaderFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: 1.000,
                content: null,
                label: "Supporting Text",
                visible: true
            },
            normal1Font: {
                color: "008dc3",
                name: "BentonSans, sans-serif",
                size: 4.300,
                content: null,
                label: "Calculation Text",
                visible: true
            },
            normal2Font: {
                color: "4e4f53",
                name: "BentonSans, sans-serif",
                size: 2.200,
                content: null,
                label: "Basis Text",
                visible: true
            },


            backgroundColor: "ffffff",
            backgroundImage: null,
            backgroundColorLabel: "Body Background Color",
            backgroundImageLabel: "Background Image",
            backgroundColorVisible: true,
            backgroundImageVisible: true,

            transitionIn: null,
            transitionOut: null,

            colCount: 8,
            colPosition: 1,
            rowCount: 4,
            rowPosition: 1,
            timelineRowPosition: null,
            previousTimelineRowPosition: null,
            startDate: null,
            endDate: null,
            resizedOnTimeline: false,
            duration: 10,

            minimumRows: 2,
            minimumCols: 2,

            widgetGraphCurrentPower: false,
            widgetGraphCurrentPowerChartType: "bar",
            widgetGraphDateRange: "Month",
            widgetGraphGeneration: true,
            widgetGraphGenerationChartType: "bar",
            widgetGraphInterval: "Daily",
            widgetGraphStartDate: null,
            widgetGraphEndDate: null,
            widgetGraphHumidity: false,
            widgetGraphHumidityChartType: "bar",
            widgetGraphIrradiance: false,
            widgetGraphIrradianceChartType: "bar",
            widgetGraphCombineInverters: true,
            widgetGraphInverter: null,
            widgetGraphBlockLabel: "Charting Colors",
            widgetGraphWeather: false,
            widgetGraphTemperature: false,
            wIdgetGraphTemperatureChartType: "bar",
            widgetGraphMaxPower: "bar",
            widgetGraphMaxPowerChartType: false,

            widgetHowDoesSolarWorkStepOneDuration: 3,
            widgetHowDoesSolarWorkStepOneText: "Solar panels absorb sunlight and convert it to DC electricity.",
            widgetHowDoesSolarWorkStepTwoDuration: 3,
            widgetHowDoesSolarWorkStepTwoText: "DC electricity from the solar panels travels to the " +
                                                "inverter where it is converted to AC electricity.",
            widgetHowDoesSolarWorkStepThreeDuration: 3,
            widgetHowDoesSolarWorkStepThreeText: "From the inverter, AC electricity passes to the electric " + 
                                                "service panel (breaker box) and routed to power your school.",
            widgetHowDoesSolarWorkStepFourDuration: 3,
            widgetHowDoesSolarWorkStepFourText: "When your solar system generates more power than your school " +
                                                "is consuming, excess electricity is routed to the power grid." +
                                                "This earns credits on the school's bill (called net-metering).",
            widgetHowDoesSolarWorkOverallDuration: 15,

            widgetIFrameUrl: null,

            widgetSolarGenerationkWh: true,
            widgetSolarGenerationCurrent: false,
            widgetSolarGenerationReimbursement: false,
            widgetSolarGenerationDateRange: "All",
            widgetSolarGenerationStartDate: null,
            widgetSolarGenerationEndDate: null,
            widgetSolarGenerationOrientation: "Vertical",
            widgetSolarGenerationInverter: null,
            widgetSolarGenerationCombineInverters: true,

            widgetTotalCO2OffsetinTrees: null,
            widgetTotalEGin60WattBulbs: null,
            widgetTotalEGinFewerVehicles: null,
            widgetTotalEGinGasSaved: null,

            widgetURL: null,

            widgetTextareaContent: null,

            widgetWeatherType: "Minimal",

            widgetEnergyCO2Kilograms: false,
            widgetEnergyGreenhouseKilograms: false,
            widgetEnergyType: "Cars Removed",
            widgetEnergyOrientation: "Horizontal",
            widgetEnergyDateRange: "All",
            widgetEnergyStartDate: null,
            widgetEnergyEndDate: null,
            widgetEnergyInverter: null,
            widgetEnergyCombineInverters: true

        }
    });

    var howDoesSolarWorkAvailableWidget = new availableWidgetModel({
        name: "how does solar work",
        parameters: {
            primaryColor: {
                isVisible: true,
                color: "9bd3d0",
                label: "Title Background Color"
            },
            secondaryColor: {
                isVisible: false,
                color: "28b1b4",
                label: null
            },
            tertiaryColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fourthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fifthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            sixthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            seventhColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            headerFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: 1.500,
                content: null,
                label: "Title",
                visible: true
            },
            subHeaderFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal1Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal2Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },


            backgroundColor: "ffffff",
            backgroundImage: null,
            backgroundColorLabel: null,
            backgroundImageLabel: null,
            backgroundColorVisible: false,
            backgroundImageVisible: false,

            transitionIn: null,
            transitionOut: null,

            colCount: 16,
            colPosition: 1,
            rowCount: 7,
            rowPosition: 1,
            timelineRowPosition: null,
            previousTimelineRowPosition: null,
            startDate: null,
            endDate: null,
            resizedOnTimeline: false,
            duration: 15,

            minimumRows: 2,
            minimumCols: 2,

            widgetGraphCurrentPower: false,
            widgetGraphCurrentPowerChartType: "bar",
            widgetGraphDateRange: "Month",
            widgetGraphGeneration: true,
            widgetGraphGenerationChartType: "bar",
            widgetGraphInterval: "Daily",
            widgetGraphStartDate: null,
            widgetGraphEndDate: null,
            widgetGraphHumidity: false,
            widgetGraphHumidityChartType: "bar",
            widgetGraphIrradiance: false,
            widgetGraphIrradianceChartType: "bar",
            widgetGraphCombineInverters: true,
            widgetGraphInverter: null,
            widgetGraphBlockLabel: "Charting Colors",
            widgetGraphWeather: false,
            widgetGraphTemperature: false,
            wIdgetGraphTemperatureChartType: "bar",
            widgetGraphMaxPower: "bar",
            widgetGraphMaxPowerChartType: false,

            widgetHowDoesSolarWorkStepOneDuration: 3,
            widgetHowDoesSolarWorkStepOneText: "Solar panels absorb sunlight and convert it to DC electricity.",
            widgetHowDoesSolarWorkStepTwoDuration: 3,
            widgetHowDoesSolarWorkStepTwoText: "DC electricity from the solar panels travels to the inverter " +
                                                "where it is converted to AC electricity.",
            widgetHowDoesSolarWorkStepThreeDuration: 3,
            widgetHowDoesSolarWorkStepThreeText: "From the inverter, AC electricity passes to the electric " + 
                                                "service panel (breaker box) and routed to power your school.",
            widgetHowDoesSolarWorkStepFourDuration: 3,
            widgetHowDoesSolarWorkStepFourText: "When your solar system generates more power than your school " +
                                                "is consuming, excess electricity is routed to the power grid. " +
                                                "This earns credits on the school's bill (called net-metering).",
            widgetHowDoesSolarWorkOverallDuration: 15,

            widgetIFrameUrl: null,

            widgetSolarGenerationkWh: true,
            widgetSolarGenerationCurrent: false,
            widgetSolarGenerationReimbursement: false,
            widgetSolarGenerationDateRange: "All",
            widgetSolarGenerationStartDate: null,
            widgetSolarGenerationEndDate: null,
            widgetSolarGenerationOrientation: "Vertical",
            widgetSolarGenerationInverter: null,
            widgetSolarGenerationCombineInverters: true,

            widgetTotalCO2OffsetinTrees: null,
            widgetTotalEGin60WattBulbs: null,
            widgetTotalEGinFewerVehicles: null,
            widgetTotalEGinGasSaved: null,

            widgetURL: null,

            widgetTextareaContent: null,

            widgetWeatherType: "Minimal",

            widgetEnergyCO2Kilograms: false,
            widgetEnergyGreenhouseKilograms: false,
            widgetEnergyType: "Cars Removed",
            widgetEnergyOrientation: "Horizontal",
            widgetEnergyDateRange: "Month",
            widgetEnergyStartDate: null,
            widgetEnergyEndDate: null,
            widgetEnergyInverter: null,
            widgetEnergyCombineInverters: true

        }
    });

    var iframeAvailableWidget = new availableWidgetModel({
        name: "iframe",
        parameters: {
            primaryColor: {
                isVisible: true,
                color: "fde8a5",
                label: "Title Background Color"
            },
            secondaryColor: {
                isVisible: false,
                color: "e2b93b",
                label: null
            },
            tertiaryColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fourthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fifthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            sixthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            seventhColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            headerFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: 1.500,
                content: null,
                label: "Title",
                visible: true
            },
            subHeaderFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal1Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal2Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },


            backgroundColor: "FFFFFF",
            backgroundImage: null,
            backgroundColorLabel: null,
            backgroundImageLabel: null,
            backgroundColorVisible: false,
            backgroundImageVisible: false,

            transitionIn: null,
            transitionOut: null,

            colCount: 16,
            colPosition: 1,
            rowCount: 7,
            rowPosition: 1,
            timelineRowPosition: null,
            previousTimelineRowPosition: null,
            startDate: null,
            endDate: null,
            resizedOnTimeline: false,
            duration: 20,

            minimumRows: 2,
            minimumCols: 2,

            widgetGraphCurrentPower: false,
            widgetGraphCurrentPowerChartType: "bar",
            widgetGraphDateRange: "Month",
            widgetGraphGeneration: true,
            widgetGraphGenerationChartType: "bar",
            widgetGraphInterval: "Daily",
            widgetGraphStartDate: null,
            widgetGraphEndDate: null,
            widgetGraphHumidity: false,
            widgetGraphHumidityChartType: "bar",
            widgetGraphIrradiance: false,
            widgetGraphIrradianceChartType: "bar",
            widgetGraphCombineInverters: true,
            widgetGraphInverter: null,
            widgetGraphBlockLabel: "Charting Colors",
            widgetGraphWeather: false,
            widgetGraphTemperature: false,
            wIdgetGraphTemperatureChartType: "bar",
            widgetGraphMaxPower: "bar",
            widgetGraphMaxPowerChartType: false,

            widgetHowDoesSolarWorkStepOneDuration: 3,
            widgetHowDoesSolarWorkStepOneText: "Solar panels absorb sunlight and convert it to DC electricity.",
            widgetHowDoesSolarWorkStepTwoDuration: 3,
            widgetHowDoesSolarWorkStepTwoText: "DC electricity from the solar panels travels to the inverter " +
                                                "where it is converted to AC electricity.",
            widgetHowDoesSolarWorkStepThreeDuration: 3,
            widgetHowDoesSolarWorkStepThreeText: "From the inverter, AC electricity passes to the electric " + 
                                                "service panel (breaker box) and routed to power your school.",
            widgetHowDoesSolarWorkStepFourDuration: 3,
            widgetHowDoesSolarWorkStepFourText: "When your solar system generates more power than your school " +
                                                "is consuming, excess electricity is routed to the power grid. " +
                                                "This earns credits on the school's bill (called net-metering).",
            widgetHowDoesSolarWorkOverallDuration: 15,

            widgetIFrameUrl: null,

            widgetSolarGenerationkWh: true,
            widgetSolarGenerationCurrent: false,
            widgetSolarGenerationReimbursement: false,
            widgetSolarGenerationDateRange: "All",
            widgetSolarGenerationStartDate: null,
            widgetSolarGenerationEndDate: null,
            widgetSolarGenerationOrientation: "Vertical",
            widgetSolarGenerationInverter: null,
            widgetSolarGenerationCombineInverters: true,

            widgetTotalCO2OffsetinTrees: null,
            widgetTotalEGin60WattBulbs: null,
            widgetTotalEGinFewerVehicles: null,
            widgetTotalEGinGasSaved: null,

            widgetURL: null,

            widgetTextareaContent: null,

            widgetWeatherType: "Minimal",

            widgetEnergyCO2Kilograms: false,
            widgetEnergyGreenhouseKilograms: false,
            widgetEnergyType: "Cars Removed",
            widgetEnergyOrientation: "Horizontal",
            widgetEnergyDateRange: "Month",
            widgetEnergyStartDate: null,
            widgetEnergyEndDate: null,
            widgetEnergyInverter: null,
            widgetEnergyCombineInverters: true

        }
    });

    var imageAvailableWidget = new availableWidgetModel({
        name: "image",
        parameters: {
            primaryColor: {
                isVisible: true,
                color: "fbb3bf",
                label: "Title Background Color"
            },
            secondaryColor: {
                isVisible: false,
                color: "eb617b",
                label: null
            },
            tertiaryColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fourthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fifthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            sixthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            seventhColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            headerFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: 1.500,
                content: null,
                label: "Title",
                visible: true
            },
            subHeaderFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal1Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal2Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },


            backgroundColor: "FFFFFF",
            backgroundImage: null,
            backgroundColorLabel: null,
            backgroundImageLabel: null,
            backgroundColorVisible: false,
            backgroundImageVisible: false,

            transitionIn: null,
            transitionOut: null,

            colCount: 6,
            colPosition: 1,
            rowCount: 4,
            rowPosition: 1,
            timelineRowPosition: null,
            previousTimelineRowPosition: null,
            startDate: null,
            endDate: null,
            resizedOnTimeline: false,
            duration: 10,

            minimumRows: 2,
            minimumCols: 2,

            widgetGraphCurrentPower: false,
            widgetGraphCurrentPowerChartType: "bar",
            widgetGraphDateRange: "Month",
            widgetGraphGeneration: true,
            widgetGraphGenerationChartType: "bar",
            widgetGraphInterval: "Daily",
            widgetGraphStartDate: null,
            widgetGraphEndDate: null,
            widgetGraphHumidity: false,
            widgetGraphHumidityChartType: "bar",
            widgetGraphIrradiance: false,
            widgetGraphIrradianceChartType: "bar",
            widgetGraphCombineInverters: true,
            widgetGraphInverter: null,
            widgetGraphBlockLabel: "Charting Colors",
            widgetGraphWeather: false,
            widgetGraphTemperature: false,
            wIdgetGraphTemperatureChartType: "bar",
            widgetGraphMaxPower: "bar",
            widgetGraphMaxPowerChartType: false,

            widgetHowDoesSolarWorkStepOneDuration: 3,
            widgetHowDoesSolarWorkStepOneText: "Solar panels absorb sunlight and convert it to DC electricity.",
            widgetHowDoesSolarWorkStepTwoDuration: 3,
            widgetHowDoesSolarWorkStepTwoText: "DC electricity from the solar panels travels to the inverter " +
                                                "where it is converted to AC electricity.",
            widgetHowDoesSolarWorkStepThreeDuration: 3,
            widgetHowDoesSolarWorkStepThreeText: "From the inverter, AC electricity passes to the electric " +
                                                "service panel (breaker box) and routed to power your school.",
            widgetHowDoesSolarWorkStepFourDuration: 3,
            widgetHowDoesSolarWorkStepFourText: "When your solar system generates more power than your school " + 
                                                "is consuming, excess electricity is routed to the power grid. " +
                                                "This earns credits on the school's bill (called net-metering).",
            widgetHowDoesSolarWorkOverallDuration: 15,

            widgetIFrameUrl: null,

            widgetSolarGenerationkWh: true,
            widgetSolarGenerationCurrent: false,
            widgetSolarGenerationReimbursement: false,
            widgetSolarGenerationDateRange: "All",
            widgetSolarGenerationStartDate: null,
            widgetSolarGenerationEndDate: null,
            widgetSolarGenerationOrientation: "Vertical",
            widgetSolarGenerationInverter: null,
            widgetSolarGenerationCombineInverters: true,

            widgetTotalCO2OffsetinTrees: null,
            widgetTotalEGin60WattBulbs: null,
            widgetTotalEGinFewerVehicles: null,
            widgetTotalEGinGasSaved: null,

            widgetURL: null,

            widgetTextareaContent: null,

            widgetWeatherType: "Minimal",

            widgetEnergyCO2Kilograms: false,
            widgetEnergyGreenhouseKilograms: false,
            widgetEnergyType: "Cars Removed",
            widgetEnergyOrientation: "Horizontal",
            widgetEnergyDateRange: "Month",
            widgetEnergyStartDate: null,
            widgetEnergyEndDate: null,
            widgetEnergyInverter: null,
            widgetEnergyCombineInverters: true

        }
    });

    var solarGenerationAvailableWidget = new availableWidgetModel({
        name: "solar generation",
        parameters: {
            primaryColor: {
                isVisible: true,
                color: "fdcda5",
                label: "Title Background Color"
            },
            secondaryColor: {
                isVisible: false,
                color: "e4984a",
                label: null
            },
            tertiaryColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fourthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fifthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            sixthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            seventhColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            headerFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: 2.200,
                content: "Solar Generation",
                label: "Title",
                visible: true
            },
            subHeaderFont: {
                color: "000000",
                name: "BentonSans, sans-serif",
                size: 0.900,
                content: "Reimbursement",
                label: "Supporting Text",
                visible: true
            },
            normal1Font: {
                color: "f3672a",
                name: "BentonSans, sans-serif",
                size: 1.800,
                content: null,
                label: "Calculation Text",
                visible: true
            },
            normal2Font: {
                color: "000000",
                name: "BentonSans, sans-serif",
                size: 1.000,
                content: null,
                label: "Basis Text",
                visible: true
            },


            backgroundColor: "FFFFFF",
            backgroundImage: null,
            backgroundColorLabel: "Body Background Color",
            backgroundImageLabel: null,
            backgroundColorVisible: true,
            backgroundImageVisible: false,

            transitionIn: null,
            transitionOut: null,

            colCount: 5,
            colPosition: 1,
            rowCount: 5,
            rowPosition: 1,
            timelineRowPosition: null,
            previousTimelineRowPosition: null,
            startDate: null,
            endDate: null,
            resizedOnTimeline: false,
            duration: 10,

            minimumRows: 2,
            minimumCols: 2,

            widgetGraphCurrentPower: false,
            widgetGraphCurrentPowerChartType: "bar",
            widgetGraphDateRange: "Month",
            widgetGraphGeneration: true,
            widgetGraphGenerationChartType: "bar",
            widgetGraphInterval: "Daily",
            widgetGraphStartDate: null,
            widgetGraphEndDate: null,
            widgetGraphHumidity: false,
            widgetGraphHumidityChartType: "bar",
            widgetGraphIrradiance: false,
            widgetGraphIrradianceChartType: "bar",
            widgetGraphCombineInverters: true,
            widgetGraphInverter: null,
            widgetGraphBlockLabel: "Charting Colors",
            widgetGraphWeather: false,
            widgetGraphTemperature: false,
            wIdgetGraphTemperatureChartType: "bar",
            widgetGraphMaxPower: "bar",
            widgetGraphMaxPowerChartType: false,

            widgetHowDoesSolarWorkStepOneDuration: 3,
            widgetHowDoesSolarWorkStepOneText: "Solar panels absorb sunlight and convert it to DC electricity.",
            widgetHowDoesSolarWorkStepTwoDuration: 3,
            widgetHowDoesSolarWorkStepTwoText: "DC electricity from the solar panels travels to the inverter " +
                                                "where it is converted to AC electricity.",
            widgetHowDoesSolarWorkStepThreeDuration: 3,
            widgetHowDoesSolarWorkStepThreeText: "From the inverter, AC electricity passes to the electric " +
                                                "service panel (breaker box) and routed to power your school.",
            widgetHowDoesSolarWorkStepFourDuration: 3,
            widgetHowDoesSolarWorkStepFourText: "When your solar system generates more power than your school " +
                                                "is consuming, excess electricity is routed to the power grid. " +
                                                "This earns credits on the school's bill (called net-metering).",
            widgetHowDoesSolarWorkOverallDuration: 15,

            widgetIFrameUrl: null,

            widgetSolarGenerationkWh: true,
            widgetSolarGenerationCurrent: false,
            widgetSolarGenerationReimbursement: false,
            widgetSolarGenerationDateRange: "All",
            widgetSolarGenerationStartDate: null,
            widgetSolarGenerationEndDate: null,
            widgetSolarGenerationOrientation: "Vertical",
            widgetSolarGenerationInverter: null,
            widgetSolarGenerationCombineInverters: true,

            widgetTotalCO2OffsetinTrees: null,
            widgetTotalEGin60WattBulbs: null,
            widgetTotalEGinFewerVehicles: null,
            widgetTotalEGinGasSaved: null,

            widgetURL: null,

            widgetTextareaContent: null,

            widgetWeatherType: "Minimal",

            widgetEnergyCO2Kilograms: false,
            widgetEnergyGreenhouseKilograms: false,
            widgetEnergyType: "Cars Removed",
            widgetEnergyOrientation: "Horizontal",
            widgetEnergyDateRange: "Month",
            widgetEnergyStartDate: null,
            widgetEnergyEndDate: null,
            widgetEnergyInverter: null,
            widgetEnergyCombineInverters: true

        }
    });

    var textAreaAvailableWidget = new availableWidgetModel({
        name: "textarea",
        parameters: {
            primaryColor: {
                isVisible: true,
                color: "e1a3ca",
                label: "Title Background Color"
            },
            secondaryColor: {
                isVisible: false,
                color: "cf5ba2",
                label: null
            },
            tertiaryColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fourthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fifthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            sixthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            seventhColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            headerFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: 1.500,
                content: null,
                label: "Title",
                visible: true
            },
            subHeaderFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal1Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal2Font: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },


            backgroundColor: "FFFFFF",
            backgroundImage: null,
            backgroundColorLabel: "Body Background Color",
            backgroundImageLabel: "Background Image",
            backgroundColorVisible: true,
            backgroundImageVisible: true,

            transitionIn: null,
            transitionOut: null,

            colCount: 5,
            colPosition: 1,
            rowCount: 2,
            rowPosition: 1,
            timelineRowPosition: null,
            previousTimelineRowPosition: null,
            startDate: null,
            endDate: null,
            resizedOnTimeline: false,
            duration: 10,

            minimumRows: 2,
            minimumCols: 2,

            widgetGraphCurrentPower: false,
            widgetGraphCurrentPowerChartType: "bar",
            widgetGraphDateRange: "Month",
            widgetGraphGeneration: true,
            widgetGraphGenerationChartType: "bar",
            widgetGraphInterval: "Daily",
            widgetGraphStartDate: null,
            widgetGraphEndDate: null,
            widgetGraphHumidity: false,
            widgetGraphHumidityChartType: "bar",
            widgetGraphIrradiance: false,
            widgetGraphIrradianceChartType: "bar",
            widgetGraphCombineInverters: true,
            widgetGraphInverter: null,
            widgetGraphBlockLabel: "Charting Colors",
            widgetGraphWeather: false,
            widgetGraphTemperature: false,
            wIdgetGraphTemperatureChartType: "bar",
            widgetGraphMaxPower: "bar",
            widgetGraphMaxPowerChartType: false,

            widgetHowDoesSolarWorkStepOneDuration: 3,
            widgetHowDoesSolarWorkStepOneText: "Solar panels absorb sunlight and convert it to DC electricity.",
            widgetHowDoesSolarWorkStepTwoDuration: 3,
            widgetHowDoesSolarWorkStepTwoText: "DC electricity from the solar panels travels to the inverter " +
                                                "where it is converted to AC electricity.",
            widgetHowDoesSolarWorkStepThreeDuration: 3,
            widgetHowDoesSolarWorkStepThreeText: "From the inverter, AC electricity passes to the electric " +
                                                "service panel (breaker box) and routed to power your school.",
            widgetHowDoesSolarWorkStepFourDuration: 3,
            widgetHowDoesSolarWorkStepFourText: "When your solar system generates more power than your school " +
                                                "is consuming, excess electricity is routed to the power grid. " +
                                                "This earns credits on the school's bill (called net-metering).",
            widgetHowDoesSolarWorkOverallDuration: 15,

            widgetIFrameUrl: null,

            widgetSolarGenerationkWh: true,
            widgetSolarGenerationCurrent: false,
            widgetSolarGenerationReimbursement: false,
            widgetSolarGenerationDateRange: "All",
            widgetSolarGenerationStartDate: null,
            widgetSolarGenerationEndDate: null,
            widgetSolarGenerationOrientation: "Vertical",
            widgetSolarGenerationInverter: null,
            widgetSolarGenerationCombineInverters: true,

            widgetTotalCO2OffsetinTrees: null,
            widgetTotalEGin60WattBulbs: null,
            widgetTotalEGinFewerVehicles: null,
            widgetTotalEGinGasSaved: null,

            widgetURL: null,

            widgetTextareaContent: null,

            widgetWeatherType: "Minimal",

            widgetEnergyCO2Kilograms: false,
            widgetEnergyGreenhouseKilograms: false,
            widgetEnergyType: "Cars Removed",
            widgetEnergyOrientation: "Horizontal",
            widgetEnergyDateRange: "Month",
            widgetEnergyStartDate: null,
            widgetEnergyEndDate: null,
            widgetEnergyInverter: null,
            widgetEnergyCombineInverters: true

        }
    });

    var weatherAvailableWidget = new availableWidgetModel({
        name: "weather",
        parameters: {
            primaryColor: {
                isVisible: true,
                color: "ae93c6",
                label: "Title Background Color"
            },
            secondaryColor: {
                isVisible: false,
                color: "82489c",
                label: null
            },
            tertiaryColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fourthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            fifthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            sixthColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            seventhColor: {
                isVisible: false,
                color: "ffffff",
                label: null
            },
            headerFont: {
                color: "000000",
                name: "BentonSans, sans-serif",
                size: 1.300,
                content: null,
                label: "Current Date",
                visible: true
            },
            subHeaderFont: {
                color: "ffffff",
                name: "BentonSans, sans-serif",
                size: null,
                content: null,
                label: null,
                visible: false
            },
            normal1Font: {
                color: "b5b5ba",
                name: "BentonSans, sans-serif",
                size: 1.100,
                content: null,
                label: "Weather Labels",
                visible: true
            },
            normal2Font: {
                color: "92949b",
                name: "BentonSans, sans-serif",
                size: 0.900,
                content: null,
                label: "Measures",
                visible: true
            },


            backgroundColor: "FFFFFF",
            backgroundImage: null,
            backgroundColorLabel: "Body Background Color",
            backgroundImageLabel: null,
            backgroundColorVisible: true,
            backgroundImageVisible: false,

            transitionIn: null,
            transitionOut: null,

            colCount: 5,
            colPosition: 1,
            rowCount: 2,
            rowPosition: 1,
            timelineRowPosition: null,
            previousTimelineRowPosition: null,
            startDate: null,
            endDate: null,
            resizedOnTimeline: false,
            duration: 10,

            minimumRows: 2,
            minimumCols: 2,

            widgetGraphCurrentPower: false,
            widgetGraphCurrentPowerChartType: "bar",
            widgetGraphDateRange: "Month",
            widgetGraphGeneration: true,
            widgetGraphGenerationChartType: "bar",
            widgetGraphInterval: "Daily",
            widgetGraphStartDate: null,
            widgetGraphEndDate: null,
            widgetGraphHumidity: false,
            widgetGraphHumidityChartType: "bar",
            widgetGraphIrradiance: false,
            widgetGraphIrradianceChartType: "bar",
            widgetGraphCombineInverters: true,
            widgetGraphInverter: null,
            widgetGraphBlockLabel: "Charting Colors",
            widgetGraphWeather: false,
            widgetGraphTemperature: false,
            wIdgetGraphTemperatureChartType: "bar",
            widgetGraphMaxPower: "bar",
            widgetGraphMaxPowerChartType: false,

            widgetHowDoesSolarWorkStepOneDuration: 3,
            widgetHowDoesSolarWorkStepOneText: "Solar panels absorb sunlight and convert it to DC electricity.",
            widgetHowDoesSolarWorkStepTwoDuration: 3,
            widgetHowDoesSolarWorkStepTwoText: "DC electricity from the solar panels travels to the inverter " +
                                                "where it is converted to AC electricity.",
            widgetHowDoesSolarWorkStepThreeDuration: 3,
            widgetHowDoesSolarWorkStepThreeText: "From the inverter, AC electricity passes to the electric " +
                                                "service panel (breaker box) and routed to power your school.",
            widgetHowDoesSolarWorkStepFourDuration: 3,
            widgetHowDoesSolarWorkStepFourText: "When your solar system generates more power than your school " +
                                                "is consuming, excess electricity is routed to the power grid. " +
                                                "This earns credits on the school's bill (called net-metering).",
            widgetHowDoesSolarWorkOverallDuration: 15,

            widgetIFrameUrl: null,

            widgetSolarGenerationkWh: true,
            widgetSolarGenerationCurrent: false,
            widgetSolarGenerationReimbursement: false,
            widgetSolarGenerationDateRange: "All",
            widgetSolarGenerationStartDate: null,
            widgetSolarGenerationEndDate: null,
            widgetSolarGenerationOrientation: "Vertical",
            widgetSolarGenerationInverter: null,
            widgetSolarGenerationCombineInverters: true,

            widgetTotalCO2OffsetinTrees: null,
            widgetTotalEGin60WattBulbs: null,
            widgetTotalEGinFewerVehicles: null,
            widgetTotalEGinGasSaved: null,

            widgetURL: null,

            widgetTextareaContent: null,

            widgetWeatherType: "Minimal",

            widgetEnergyCO2Kilograms: false,
            widgetEnergyGreenhouseKilograms: false,
            widgetEnergyType: "Cars Removed",
            widgetEnergyOrientation: "Horizontal",
            widgetEnergyDateRange: "Month",
            widgetEnergyStartDate: null,
            widgetEnergyEndDate: null,
            widgetEnergyInverter: null,
            widgetEnergyCombineInverters: true

        }
    });

    var widgetsToInsert = [graphAvailableWidget, energyEquivalenciesAvailableWidget, 
        howDoesSolarWorkAvailableWidget, iframeAvailableWidget, imageAvailableWidget, 
        solarGenerationAvailableWidget, textAreaAvailableWidget, weatherAvailableWidget];

    async.each(widgetsToInsert, function(widget, callback) {
        widget.save(function (saveErr) {
           if(saveErr) {
               callback(saveErr);
           } else {
               callback(null);
           }
        });
    }, function (err) {
        if(err) {
            log.info("available widget save error: " + err);
        } else {
            log.info("available widgets saved");
        }

        process.exit();
    });
}

availableWidgetModel.remove({}, function(err) {
    if(err) {
        utils.logError(err);
    } else {
        log.info("available widgets collection cleared");
        insertData();
    }
});