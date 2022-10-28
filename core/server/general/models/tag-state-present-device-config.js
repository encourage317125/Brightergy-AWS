"use strict";

// TODO:: moved to core-service

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    consts = require("../../libs/consts");

module.exports = function() {
    var tagStatePresentDeviceConfigSchema = new Schema({
        dataType: {type: String, enum: consts.TAG_STATE_DATATYPES},

        deviceID: {type: String, trim: true, required: true},

        tag: {type: Schema.Types.ObjectId, ref: "tag", required: true},

        initialized: {type: Boolean, default: false},
        presentationID: {type: String, default: null, trim: true},
        userEmail: {type: String, default: null, trim: true},
        userPassword: {type: String, default: null, trim: true},

        generalSetting: {
            URL: {type: String, default: null, trim: true},
            startDsrOnBoot: {type: Boolean, default: false},
            deviceName: {type: String, default: null, trim: true}
        },
        networkSetting: {
            connectionType: {type: String, default: null, trim: true},
            ethernetState: {type: Boolean, default: false},
            ethernetDevice: {type: String, default: null, trim: true},
            ethernetIpType: {type: String, default: null, trim: true},
            ip: {type: String, default: null, trim: true},
            mask: {type: String, default: null, trim: true},
            gateway: {type: String, default: null, trim: true},
            dns1: {type: String, default: null, trim: true},
            dns2: {type: String, default: null, trim: true},
            wifiState: {type: Boolean, default: false},
            wifiOpenState: {type: Boolean, default: false},
            wifiName: {type: String, default: null, trim: true},
            wifiSecurity: {type: String, default: null, trim: true},
            wifiPassword: {type: String, default: null, trim: true},
            wifiIpType: {type: String, default: null, trim: true},
            wifiIp: {type: String, default: null, trim: true},
            wifiGateway: {type: String, default: null, trim: true},
            wifiDns1: {type: String, default: null, trim: true},
            wifiDns2: {type: String, default: null, trim: true}          
        },
        browserSetting: {
            scheduleCleanup: {
                enableCleanup: {type: Boolean, default: false},
                timeOfExecution: {
                    type: {type: String, default: null, trim: true},
                    interval: {type: Number, default: null},
                    time: {type: String, default: null, trim: true},
                    dayOfWeek: {type: String, default: null, trim: true},
                    dayOfMonth: {type: Number, default: null}
                }/*,
                clearCache: {type: Boolean, default: false},
                clearOfflineData: {type: Boolean, default: false},
                clearSessions: {type: Boolean, default: false},
                clearCookies: {type: Boolean, default: false},
                clearHistory: {type: Boolean, default: false},
                clearFormData: {type: Boolean, default: false},
                clearPasswords: {type: Boolean, default: false}*/
            },
            scheduleBrowserRestart: {
                enableScheduleBrowserRestart: {type: Boolean, default: false},
                configureScheduleBrowserRestart: {
                    type: {type: String, default: null, trim: true},
                    interval: {type: Number, default: null},
                    time: {type: String, default: null, trim: true},
                    dayOfWeek: {type: String, default: null, trim: true},
                    dayOfMonth: {type: Number, default: null}
                }
            },
            showStatusOnBrowser: {type: Boolean, default: false}
        },
        deviceStatusReporter: {
            timeIntervalToMonitorStatus: {type: Number, default: null},
            timeIntervalToReport: {type: Number, default: null},
            preventSuspension: {type: Boolean, default: false},
            /*ftpCredentials: {
                ftpHost: {type: String, default: null, trim: true},
                ftpUsername: {type: String, default: null, trim: true},
                ftpPassword: {type: String, default: null, trim: true}
            },*/
            durationToAttempReconnection: {type: Number, default: null}
        },
        password: {type: String, default: null, trim: true},
        remoteConfigureSetting: {
            automaticUpdate: {
                enableAutomaticUpdate: {type: Boolean, default: false},
                periodicalCheck: {
                    type: {type: String, default: null, trim: true},
                    interval: {type: Number, default: null}
                }
            },
            remoteConfigurePath: {type: String, default: null, trim: true}
        },
        remoteUpdateNewVersion: {
            automaticUpdate: {
                enableAutomaticUpdateNewVersion: {type: Boolean, default: false},
                scheduleUpdateNewVersion: {
                    type: {type: String, default: null, trim: true},
                    interval: {type: Number, default: null},
                    time: {type: String, default: null, trim: true},
                    dayOfWeek: {type: String, default: null, trim: true},
                    dayOfMonth: {type: Number, default: null}
                }
            },
            remoteUpdatePath: {type: String, default: null, trim: true}
        },
        importExport: {
            importPath: {type: String, default: null, trim: true},
            exportPath: {type: String, default: null, trim: true}
        }

    });
    
    mongoose.model("presentDeviceConfig", tagStatePresentDeviceConfigSchema, "tagstates");
};