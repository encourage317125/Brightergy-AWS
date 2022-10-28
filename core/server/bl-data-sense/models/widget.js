"use strict";

var mongoose = require("mongoose"),
    Tag = mongoose.model("tag"),
    //uniqueValidator = require("mongoose-unique-validator"),
    consts = require("../../libs/consts"),
    Schema = mongoose.Schema,
    utils = require("../../libs/utils");

module.exports = function() {
    var widgetSchema = new Schema({
        type: {type: String, required: true, enum: consts.ALLOWED_DATA_SENSE_WIDGET_TYPES},
        title: {type: String, required: true},
        titleShow: {type: Boolean, default: true},
        collapsed: {type: Boolean, default: false},
        groupDimension: {type: String, default: null},
        customGroupDimension: {
            groupBySegment: {type: Boolean, default: false},
            definedGroups: [{
                name: { type: String, required: true, default: "Untitled", trim: true},
                segmentId: {type: String, required: true},
                tagBindings: [{
                    _id: false,
                    id: {type: Schema.Types.ObjectId, ref: "tag", required: true},
                    tagType: { type: String, required: false, trim: true, enum: consts.TAG_TYPES}
                }],
                treedata: {type: Array, default: []},
                isExpanded: {type: Boolean, default: false},
                expandedNodes: {type: Array, default: []}
            }]
        },
        pivotDimension: {type: String, default: null},

        boilerplateType: {type: String, default: null},
        boilerplateSystemPower: {type: Number, default: null},
        boilerplateCommissioning: {type: Date, default: null},
        boilerplateLocation: {type: String, default: null},

        lastConnected: {type: Date, default: null},

        rowsPerTable: {type: Number, default: null},
        displayedColumns: {type: Array, default: []},

        drillDown: {type: String, default: null},
        imageUrl: {type: String, default: null},

        showUpTo: {type: Number, default: null},

        orientation: {type: String, default: null},
        equivType: {type: String, default: null},
        co2Kilograms: { type: Boolean, default: false},
        greenhouseKilograms: { type: Boolean, default: false},
        co2Pounds: { type: Boolean, default: false},
        greenhousePounds: { type: Boolean, default: false},
        showAllTime: {type: Boolean, default: false},

        summaryMethod: {type: String, default: null},
        label: {type: String, default: null},
        compareLabel: {type: String, default: null},

        metric: {type: Schema.Types.ObjectId, ref: "tag", default: null},
        compareMetric: {type: Schema.Types.ObjectId, ref: "tag", default: null},
        compareAsBar: { type: Boolean, default: false},

        legendStatus: {type: Schema.Types.Mixed},
        legendVisible: {type: Boolean, default: false},

        singlePointAggregation: [
            {
                _id: false,
                function: { type: String, required: true, enum: consts.ALLOWED_SINGLE_POINT_AGGREGATION},
                title: { type: String, required: false, trim: true}
            }
        ],

        creator: {type: Schema.Types.ObjectId, ref: "user", required: true},
        creatorRole: {type: String, required: true},

        startDate: { type: Date, default: null},
        endDate: { type: Date, default: null},
        compareStartDate: { type: Date, default: null},
        compareEndDate: { type: Date, default: null},

        segments: [
            {
                _id: false,
                id: { type: Schema.Types.ObjectId, required: true, default: null},
                name: { type: String, required: true, default: "Untitled", trim: true},
                tagBindings: [{
                    _id: false,
                    id: {type: Schema.Types.ObjectId, ref: "tag", required: true},
                    tagType: { type: String, required: false, trim: true, enum: consts.TAG_TYPES}
                }]
            }
        ]
    });

    //widgetSchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    var summaryMethodTypes = ["Average", "Minimum", "Maximum", "Total", "Count"];

    widgetSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    widgetSchema.path("creator").set(function (newValue) {
        this.previousCreator = this.creator;
        return newValue;
    });

    widgetSchema.pre("save", function (next) {

        //console.log("pre save")

        var obj = this;
        var error;

        var isUnknownBoilerPlateType = consts.ALLOWED_BOILERPLATE_WIDGET_TYPES.indexOf(obj.boilerplateType) < 0;

        if (utils.isCreratorRoleChanged(obj)) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.CAN_NOT_CHANGE_CREATOR_ROLE);
            error.status = 422;
            return next(error);
        } else if (utils.isCreatorChanged(obj)) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.CAN_NOT_CHANGE_CREATOR);
            error.status = 422;
            return next(error);
        } else if(obj.metric && obj.compareMetric && obj.metric.toString() === obj.compareMetric.toString()) {
            error = new Error(consts.SERVER_ERRORS.WIDGET.NOT_UNIQUE_DATA_SENSE_WIDGET_METRICS);
            error.status = 422;
            return next(error);
        } else if(obj.type !== consts.DATA_SENSE_WIDGET_TYPES.Image && !obj.metric) {
            error = new Error(consts.SERVER_ERRORS.WIDGET.METRIC_REQUIRED);
            error.status = 422;
            return next(error);
        } else if((obj.boilerplateType && isUnknownBoilerPlateType) || 
            (obj.type === consts.DATA_SENSE_WIDGET_TYPES.Boilerplate && isUnknownBoilerPlateType)) {
            //if boilerplateType not null, it should be correct and it is required for boilerplate widget
            error = new Error(consts.SERVER_ERRORS.WIDGET.UNKNOWN_BOILERPLATE_TYPE);
            error.status = 422;
            return next(error);
        } else if(obj.startDate && obj.endDate && obj.startDate > obj.endDate) {
            error = new Error(consts.SERVER_ERRORS.DASHBOARD.INCORRECT_DATA_RANGE);
            error.status = 422;
            return next(error);
        } else if(obj.compareStartDate && obj.compareEndDate && obj.compareStartDate > obj.compareEndDate) {
            error = new Error(consts.SERVER_ERRORS.DASHBOARD.INCORRECT_DATA_RANGE);
            error.status = 422;
            return next(error);
        } else {
            return next();
        }
    });
    
    widgetSchema.path("summaryMethod").validate(function(value, respond) {

        if (!value) {
            respond(true);
        } else {

            if (summaryMethodTypes.indexOf(value) > -1) {
                respond(true);
            } else {
                respond(false);
            }
        }

    }, "summary method can only be one of the following elements - Average, Minimum, Maximum, Total and Count");
    
    widgetSchema.path("metric").validate(function (value, respond) {

        if(!value) {
            respond(true);
        } else {

            Tag.findOne({_id: value}, function (err, doc) {
                if (err || !doc) {
                    respond(false);
                } else {
                    respond(true);
                }
            });
        }

    }, "metric does not exist");

    widgetSchema.path("compareMetric").validate(function (value, respond) {

        if(!value) {
            respond(true);
        } else {

            Tag.findOne({_id: value}, function (err, doc) {
                if (err || !doc) {
                    respond(false);
                } else {
                    respond(true);
                }
            });
        }

    }, "compareMetric does not exist");

    mongoose.model("ds_widget", widgetSchema);
};
