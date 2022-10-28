"use strict";

var config = require("../../../config/environment"),
    mongoose = require("mongoose"),
    Presentation = mongoose.model("bv_presentation"),
    postFind = require("mongoose-post-find"),
    Schema = mongoose.Schema;

module.exports = function() {

    var defaultColorObject = {
        color: { type: String, default: null, trim: true},
        isVisible: { type: Boolean, default: false},
        label: { type: String, default: null, trim: true}
    };

    var defaultFontObject = {
        color: { type: String, default: null, trim: true},
        name: { type: String, default: "BentonSans, sans-serif", trim: true},
        size: { type: Number, default: null},
        content: { type: String, default: null, trim: true},
        label: { type: String, default: null, trim: true},
        visible: { type: Boolean, default: false}
    };

    var defaultParameters = {
        //colors
        primaryColor: defaultColorObject,
        secondaryColor: defaultColorObject,
        tertiaryColor: defaultColorObject,
        fourthColor: defaultColorObject,
        fifthColor: defaultColorObject,
        sixthColor: defaultColorObject,
        seventhColor: defaultColorObject,
        //fonts
        headerFont: defaultFontObject,
        subHeaderFont: defaultFontObject,
        normal1Font: defaultFontObject,
        normal2Font: defaultFontObject,

        backgroundColor: { type: String, default: null, trim: true},
        backgroundImage: { type: String, default: null, trim: true},
        backgroundColorLabel: { type: String, default: null, trim: true},
        backgroundImageLabel: { type: String, default: null, trim: true},
        backgroundColorVisible: { type: Boolean, default: false},
        backgroundImageVisible: { type: Boolean, default: false},

        transitionIn: { type: String, default: null, trim: true},
        transitionOut: { type: String, default: null, trim: true},

        colCount: { type: Number, default: null},
        colPosition: { type: Number, default: null},
        rowCount: { type: Number, default: null},
        rowPosition: { type: Number, default: null},
        timelineRowPosition: { type: Number, default: null},
        previousTimelineRowPosition: { type: Number, default: null},
        minimumRows: { type: Number, default: null},
        minimumCols: { type: Number, default: null},
        startDate: { type: String, default: null},
        endDate: { type: Date, default: null},
        resizedOnTimeline: { type: Boolean, default: false},
        duration: { type: Number, default: null},

        widgetRandomColor: { type: String, default: null, trim: true},
        widgetBorderColor: { type: String, default: null, trim: true},

        widgetGraphCurrentPower: { type: Boolean, default: false},
        widgetGraphCurrentPowerChartType: { type: String, default: null, trim: true},
        widgetGraphDateRange: { type: String, default: null, trim: true},
        widgetGraphGeneration: { type: Boolean, default: false},
        widgetGraphGenerationChartType: { type: String, default: null},
        widgetGraphInterval: { type: String, default: null, trim: true},
        widgetGraphStartDate: { type: Date, default: null},
        widgetGraphEndDate: { type: Date, default: null},
        widgetGraphHumidity: { type: Boolean, default: false},
        widgetGraphHumidityChartType: { type: String, default: null, trim: true},
        widgetGraphIrradiance: { type: Boolean, default: false},
        widgetGraphIrradianceChartType: { type: String, default: null, trim: true},
        widgetGraphCombineInverters: { type: Boolean},
        widgetGraphInverter: { type: String, default: null, trim: true},
        widgetGraphBlockLabel: { type: String, default: null, trim: true},
        widgetGraphWeather: { type: Boolean, default: false},
        widgetGraphTemperature: { type: Boolean, default: false},
        wIdgetGraphTemperatureChartType: { type: String, default: null, trim: true},
        widgetGraphMaxPower: { type: Boolean, default: false},
        widgetGraphMaxPowerChartType: { type: String, default: null, trim: true},

        widgetHowDoesSolarWorkStepFourDuration: { type: Number, default: null},
        widgetHowDoesSolarWorkStepFourText: { type: String, default: null, trim: true},
        widgetHowDoesSolarWorkStepOneDuration: { type: Number, default: null},
        widgetHowDoesSolarWorkStepOneText: { type: String, default: null, trim: true},
        widgetHowDoesSolarWorkStepThreeDuration: { type: Number, default: null},
        widgetHowDoesSolarWorkStepThreeText: { type: String, default: null, trim: true},
        widgetHowDoesSolarWorkStepTwoDuration: { type: Number, default: null},
        widgetHowDoesSolarWorkStepTwoText: { type: String, default: null, trim: true},
        widgetHowDoesSolarWorkOverallDuration: { type: Number, default: null},

        widgetIFrameUrl: { type: String, default: null, trim: true},

        widgetSolarGenerationkWh: { type: Boolean, default: false},
        widgetSolarGenerationCurrent: { type: Boolean, default: false},
        widgetSolarGenerationReimbursement: { type: Boolean, default: false},
        widgetSolarGenerationDateRange: { type: String, default: null, trim: true},
        widgetSolarGenerationStartDate: { type: Date, default: null},
        widgetSolarGenerationEndDate: { type: Date, default: null},
        widgetSolarGenerationOrientation: { type: String, default: null, trim: true},
        widgetSolarGenerationInverter: { type: String, default: null, trim: true},
        widgetSolarGenerationCombineInverters: { type: Boolean, default: false},

        widgetTotalCO2OffsetinTrees: { type: Number, default: null},
        widgetTotalEGin60WattBulbs: { type: Number, default: null},
        widgetTotalEGinFewerVehicles: { type: Number, default: null},
        widgetTotalEGinGasSaved: { type: Number, default: null},

        widgetURL: { type: String, default: null, trim: true},
        videoType: { type: String, default: null, trim: true},

        widgetTextareaContent: { type: String, default: null, trim: true},

        widgetWeatherType: { type: String, default: null, trim: true},

        widgetEnergyCO2Kilograms: { type: Boolean, default: false},
        widgetEnergyGreenhouseKilograms: { type: Boolean, default: false},
        widgetEnergyType: { type: String, default: null, trim: true},
        widgetEnergyOrientation: { type: String, default: null, trim: true},
        widgetEnergyDateRange: { type: String, default: null, trim: true},
        widgetEnergyStartDate: { type: Date, default: null},
        widgetEnergyEndDate: { type: Date, default: null},
        widgetEnergyInverter: { type: String, default: null, trim: true},
        widgetEnergyCombineInverters: { type: Boolean, default: false}
    };

    var availableWidgetSchema = new Schema({
        name: { type: String, required: true, trim: true},
        icon: { type: String, default: null, trim: true},
        parameters: defaultParameters
    });

    var widgetSchema = new Schema({
        name: { type: String, default: null, trim: true},
        availableWidgetId: {type: Schema.Types.ObjectId, ref: "bv_availableWidget", required: true},
        icon: {type: String, default: null, trim: true},
        presentation: {type: Schema.Types.ObjectId, ref: "bv_presentation", required: true},
        parameters: defaultParameters
    });

    function setWidgetIcons(results, done) {
        //console.log("set icon");
        var icons = config.get("availablewidgeticons");
        for (var i = 0; i < results.length; i++) {
            results[i].icon = icons[results[i].name];
        }
        done(null, results); //Results must be passed to callback
    }

    availableWidgetSchema.plugin(postFind, {
        find: setWidgetIcons
    });

    widgetSchema.plugin(postFind, {
        find: setWidgetIcons
    });

    //validate available widget and set widget name
    widgetSchema.pre("save", function (next) {
        var self = this;

        AvailableWidget.findOne({_id: self.availableWidgetId}, function (err, doc) {
            if (err || !doc) {
                self.invalidate("availableWidgetId", "available widget does not exists");
                var error = new Error("available widget does not exists");
                error.status = 422;
                next(error);
            } else {
                self.name = doc.name;
                next();
            }
        });
    });

    //validate presentation
    widgetSchema.path("presentation").validate(function (value, respond) {

        Presentation.findOne({_id: value}, function (err, doc) {
            if (err || !doc) {
                respond(false);
            } else {
                respond(true);
            }
        });

    }, "presentation does not exists");

    var AvailableWidget = mongoose.model("bv_availableWidget", availableWidgetSchema);
    mongoose.model("bv_widget", widgetSchema);
};

