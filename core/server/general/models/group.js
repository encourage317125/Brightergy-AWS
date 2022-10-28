"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

module.exports = function() {
    var groupSchema = new Schema({
        name: {type: String, required: true},
        information: {type: String, required: false},
        children: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, required: true},
            name : {type: String, required: false},
            sourceType: { type: String, required: true, trim: true}
        }],
        creator: {type: Schema.Types.ObjectId, ref: "user", required: true},
        creatorRole: {type: String, required: true},
        usersWithAccess: [{
            _id:false,
            id : {type: Schema.Types.ObjectId, ref: "user", required: true}
        }]
    });

    groupSchema.path("creatorRole").set(function (newValue) {
        this.previousCreatorRole = this.creatorRole;
        return newValue;
    });

    groupSchema.path("creator").set(function (newValue) {
        this.previousCreator = this.creator;
        return newValue;
    });

    mongoose.model("group", groupSchema);
};
