"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    //config = require("../../../config/environment"),
    //uniqueValidator = require("mongoose-unique-validator"),
    //utils = require("../../libs/utils"),
    consts = require("../../libs/consts"),
    //route53Utils = require("../core/aws/route53-utils"),
    Schema = mongoose.Schema;
    
module.exports = function() {
    var tagRuleSchema = new Schema({
        tagType: {type: String, required: true},
        allowedChildrenTagTypes: { type: Array, default: []},
        allowedParentTagTypes: { type: Array, default: []},
        creator: {type: Schema.Types.ObjectId, ref: "user", required: true},
        creatorRole: {type: String, required: true}
    });

    tagRuleSchema.path("tagType").set(function (newValue) {
        this.previousTagType = this.tagType;
        return newValue;
    });

    tagRuleSchema.pre("save", function (next) {
        var obj = this;
        if (obj.previousTagType && (obj.tagType !== obj.previousTagType)) {
            var error = new Error(consts.SERVER_ERRORS.TAG.RULE.CAN_NOT_CHANGE_RULE_TYPE);
            error.status = 422;
            return next(error);
        } else {
            return next();
        }
    });

    mongoose.model("tagrule", tagRuleSchema);
};