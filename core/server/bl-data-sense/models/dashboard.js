"use strict";

var mongoose = require("mongoose"),
    //uniqueValidator = require("mongoose-unique-validator"),
    consts = require("../../libs/consts"),
    Schema = mongoose.Schema,
    utils = require("../../libs/utils"),
    cacheHelper = require("../../libs/cache-helper");

module.exports = function() {
    var dashboardSchema;
    dashboardSchema = new Schema({
        title: {type: String, required: true},
        layout: {
            selectedStyle: {type: Number, required: true},
            includePrimary: {type: Boolean, default: false},
            widgets: {type: Schema.Types.Mixed, required: true}
        },
        collections: { type: Array, default: [], required: true},
        widgets: [
            {
                _id: false,
                widget: {type: Schema.Types.ObjectId, ref: "ds_widget", default: null}
            }
        ],
        awsAssetsKeyPrefix: { type: String, default: null, trim: true},
        creator: {type: Schema.Types.ObjectId, ref: "user", required: true},

        startDate: { type: Date, required: true},
        endDate: { type: Date, required: true},
        compareStartDate: { type: Date, default: null},
        compareEndDate: { type: Date, default: null},
        isRealTimeDateRange: {type: Boolean, default: false},

        isPrivate: { type: Boolean, default: false},

        subDay: { type: String, default: null, trim: true},

        /*
        parents: [
            {
                _id: false,
                id: {type: Schema.Types.ObjectId, required: true},
                tagType: { type: String, required: true, trim: true}
            }
        ],
        children: [
            {
                _id: false,
                id: {type: Schema.Types.ObjectId, required: true},
                tagType: { type: String, required: true, trim: true}
            }
        ],
        */

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
        ],

        default: {type: Boolean, default: false},

        creatorRole: {type: String, required: true},
        isViewerTime: { type: Boolean, default: false},
        bpLock: {type: Boolean, default:false, trim: true}
    });

    //dashboardSchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

    dashboardSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    dashboardSchema.path("creator").set(function (newValue) {
        this.previousCreator = this.creator;
        return newValue;
    });

    dashboardSchema.pre("save", function (next) {

        var obj = this;
        var error;
        
        if (utils.isCreratorRoleChanged(obj)) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.CAN_NOT_CHANGE_CREATOR_ROLE);
            error.status = 422;
            return next(error);
        } else if (utils.isCreatorChanged(obj)) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.CAN_NOT_CHANGE_CREATOR);
            error.status = 422;
            return next(error);
        } else if(utils.hasDuplicateItems(obj.collections)){
            error = new Error(consts.SERVER_ERRORS.DASHBOARD.NOT_UNIQUE_COLLECTIONS);
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
        } else if(obj.subDay && consts.ALLOWED_SUB_DAY.indexOf(obj.subDay) < 0) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.NOT_ALLOWED_SUB_DAY);
            error.status = 422;
            return next(error);
        } else {
            var primaryDateRangeChanged = obj.isModified("startDate") || obj.isModified("endDate");
            var compareDateRangeChanged = obj.isModified("compareStartDate") || obj.isModified("compareEndDate");

            if(primaryDateRangeChanged || compareDateRangeChanged) {
                cacheHelper.deleteSingleAppEntityCache(obj._id.toString(), function(err, res) {
                    if(err) {
                        return next(err);
                    } else {
                        return next();
                    }

                });
            } else {

                return next();
            }
        }
    });

    mongoose.model("ds_dashboard", dashboardSchema);
};
