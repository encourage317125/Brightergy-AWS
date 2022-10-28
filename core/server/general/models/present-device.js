"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

module.exports = function() {
    var prsentDeviceSchema = new Schema({

        deviceName: {type: String, require: true},
        connectionType: {type: String, default: null, trim: true},
        ethernetState: {type: Boolean, default: false, trim: true},
        ethernetDevice: {type: String, default: null, trim: true},
        ethernetIpType: {type: String, default: null, trim: true},
        ethernetIpAddress: {type: String, default: null, trim: true},
        mask: {type: String, default: null, trim: true},
        gateway: {type: String, default: null, trim: true},
        dns1: {type: String, default: null, trim: true},
        dns2: {type: String, default: null, trim: true},
        wifiMask: {type: String, default: null, trim: true},
        wifiGateway: {type: String, default: null, trim: true},
        wifiDns: {type: String, default: null, trim: true},
        wifiAuthenticationMode: {type: String, default: null, trim: true},
        wifiPassword: {type: String, default: null},
        wifiState: {type: Boolean, default: false},
        wifiIpAddress: {type: String, default: null, trim: true},
        wifiName: {type: String, default: null, trim: true},
        wifiOpenState: {type: Boolean, default: false},
        enableCleanup: {type: Boolean, default: false},
        timeOfExecution: {type: String, default: null, trim: true},
        clearCache: {type: Boolean, default: false},
        clearOfflineData: {type: Boolean, default: false},
        clearSessions: {type: Boolean, default: false},
        clearCookies: {type: Boolean, default: false},
        clearHistory: {type: Boolean, default: false},
        clearFormData: {type: Boolean, default: false},
        clearPasswords: {type: Boolean, default: false},
        enableScheduleBrowserRestart: {type: Boolean, default: false},
        configureScheduleBrowserRestart: {type: String, default: null, trim: true},
        showStatusOnBrowser: {type: Boolean, default: false},
        timeIntervalToMonitorStatus: {type: Number, default: null},
        timeIntervalToReport: {type: Number, default: null},
        preventSuspension: {type: Boolean, default: false},
        durationToAttemptReconnection: {type: Number, default: null},
        enableAutomaticUpdateNewVersion: {type: Boolean, default: false},
        scheduleUpdateNewVersion: {type: String, default: null, trim: true},
        remoteUpdatePath: {type: String, default: null, trim: true},
        remoteApkPath: {type: String, default: null, trim: true},
        userEmail: {type: String, default: null, trim: true},
        presentationId: {type: Schema.Types.ObjectId, require: true},
        deviceId: {type: String, default: null, trim: true},
        deviceToken: {type: String, default: null, trim: true},

        // this field is increased every time config was modified
        version: {type: Number, default: 0},

        // this flag is set when the request to device was sent (through push notification)
        // reset each time device was modified
        infoRequestWasSent: {type: Boolean, default: false}

    });

    // increment version each modification
    prsentDeviceSchema.pre("save", function(next) {
        this.version += 1;
        this.infoRequestWasSent = false;
        next();
    });

    prsentDeviceSchema.pre("update", function(next) {
        this.version += 1;
        this.infoRequestWasSent = false;
        next();
    });
    // -----

    mongoose.model("presentdevice", prsentDeviceSchema);
};
