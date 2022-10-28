"use strict";

var mongoose = require("mongoose"),
    moment = require("moment"),
    utils = require("../../libs/utils"),
    consts = require("../../libs/consts"),
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

    var presentationSchema = new Schema({
        name: { type: String, required: true, trim: true},
        awsAssetsKeyPrefix: { type: String, default: null, trim: true},
        Latitude: {type: Number, default: null},
        Logo: {type: String, default: null, trim: true},
        Longitude: {type: Number, default: null},
        createdDate: {type: Date, default: null},
        webBox: {type: String, default: null, trim: true},
        systemSize: {type: Number, default: null},
        systemSizeView: {type: Boolean, default: false},
        generatingSinceView: {type: Boolean, default: false},
        lastUpdatedView: {type: Boolean, default: false},
        titleView: {type: Boolean, default: false},
        IsNewPresentation: {type: Boolean, default: false},
        isTemplate: {type: Boolean, default: false},
        reimbursementRate: {type: Number, default: null},
        creatorName: {type: String, default: null, trim: true},
        creator: {type: Schema.Types.ObjectId, ref: "user", default: null},
        description: {type: String, default: null, trim: true},

        /*
        parents: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            tag: { type: String, required: false, trim: true},
            tagType: { type: String, required: false, trim: true}
        }],
        children: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},

            tagType: { type: String, required: false, trim: true}
        }],
        */

        tagBindings: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, ref: "tag", required: true},
            //tag: { type: String, required: false, trim: true, enum: consts.TAG_TYPES},
            tagType: { type: String, required: false, trim: true, enum: consts.TAG_TYPES}
        }],

        creatorRole: {type: String, required: true},

        parameters: {
            //colors
            backgroundColor: {type: String, default: "f2672a", trim: true},
            primaryColor: {
                color: { type: String, default: null, trim: true},
                isVisible: { type: Boolean, default: true},
                label: { type: String, default: "Title Background Color", trim: true}
            },
            secondaryColor: defaultColorObject,
            tertiaryColor: defaultColorObject,
            fourthColor: defaultColorObject,
            fifthColor: defaultColorObject,
            sixthColor: defaultColorObject,
            seventhColor: defaultColorObject,
            //fonts
            headerFont: {
                color: { type: String, default: "ffffff", trim: true},
                name: { type: String, default: "BentonSans, sans-serif", trim: true},
                size: { type: Number, default: 4},
                content: { type: String, default: null, trim: true},
                label: { type: String, default: "Header", trim: true},
                visible: { type: Boolean, default: true}
            },
            subHeaderFont: {
                color: { type: String, default: "f9d8ca", trim: true},
                name: { type: String, default: "BentonSans, sans-serif", trim: true},
                size: { type: Number, default: 0.9},
                content: { type: String, default: null, trim: true},
                label: { type: String, default: null, trim: true},
                visible: { type: Boolean, default: true}
            },
            normal1Font: defaultFontObject,
            normal2Font: defaultFontObject,

            startDate: { type: Date, default: null},
            endDate: { type: Date, default: null}
        },
        bpLock: {type: Boolean, default:false, trim: true}
    });

    presentationSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    presentationSchema.path("creator").set(function (newValue) {
        this.previousCreator = this.creator;
        return newValue;
    });

    presentationSchema.pre("save", function (next) {

        //console.log("pre save")

        var obj = this;
        if (!obj.createdDate) {
            obj.createdDate = moment.utc();
        }

        var error;
        if (utils.isCreratorRoleChanged(obj)) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.CAN_NOT_CHANGE_CREATOR_ROLE);
            error.status = 422;
            return next(error);
        } else if (utils.isCreatorChanged(obj)) {
            error = new Error(consts.SERVER_ERRORS.GENERAL.CAN_NOT_CHANGE_CREATOR);
            error.status = 422;
            return next(error);
        } else {
            return next();
        }
    });

    mongoose.model("bv_presentation", presentationSchema);
};