"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    utils = require("../../libs/utils"),
    consts = require("../../libs/consts"),
    Schema = mongoose.Schema;

module.exports = function() {
    var tagScheduleSchema = new Schema({
        weekDays: {type: Array, default: []},
        fromHour : {type: Number, required: true},
        fromMinute : {type: Number, required: true},
        toHour : {type: Number, required: true},
        toMinute : {type: Number, required: true},
        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},
        heatSetpoint: {type: Number, required: true},
        coolSetpoint: {type: Number, required: true},
        creator: {type: Schema.Types.ObjectId, ref: "user", required: true},
        creatorRole: {type: String, required: true},
        isActive: {type: Boolean, default:true}
    });

    tagScheduleSchema.path("fromHour").validate(function (value) {
        return value >=0 && value <=23 && utils.isWholeNumber(value);
    }, "Invalid from hour");

    tagScheduleSchema.path("toHour").validate(function (value) {
        return value >=0 && value <=23 && utils.isWholeNumber(value);
    }, "Invalid to hour");

    tagScheduleSchema.path("fromMinute").validate(function (value) {
        return value >=0 && value <=59 && utils.isWholeNumber(value);
    }, "Invalid from minute");

    tagScheduleSchema.path("toMinute").validate(function (value) {
        return value >=0 && value <=59 && utils.isWholeNumber(value);
    }, "Invalid to minute");

    tagScheduleSchema.path("weekDays").validate(function (value) {
        for(var i =0; i < value.length; i++) {
            if(value[i] < 1 || value[i] > 7 || !utils.isWholeNumber(value[i])) {
                return false;
            }
        }

        return true;
    }, "Invalid week day");

    tagScheduleSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    tagScheduleSchema.path("creator").set(function (newValue) {
        this.previousCreator = this.creator;
        return newValue;
    });

    tagScheduleSchema.pre("save", function (next) {
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
        }/*
         Example:
         I am trying to set fromTime: 00:10 ~ toTime: 17:50(edited)
         After convert it to UTC
         it will be fromTime: 23:10 ~ toTime: 16:50
         */
        /*else if(obj.fromHour > obj.toHour) {
         error = new Error("fromHour should be less or equal toHour");
         error.status = 422;
         return next(error);
         }*/ else if (obj.fromHour === obj.toHour && obj.fromMinute >= obj.toMinute) {
            error = new Error("In equals hours fromMinute should be less toMinute");
            error.status = 422;
            return next(error);
        } else if (obj.heatSetpoint >= obj.coolSetpoint) {
            error = new Error(consts.SERVER_ERRORS.TAG.SCHEDULE.MIN_IS_MORE_OR_EQUAL_MAX);
            error.status = 422;
            return next(error);
        } else {
            return next();
        }
    });

    mongoose.model("tagschedule", tagScheduleSchema);
};