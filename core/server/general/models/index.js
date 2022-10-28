"use strict";

// TODO:: moved to core-service

//require all nested models

var models = ["data-source.js", "tag.js", "tag-rule.js", "default-mapping.js",
	"manufacturer.js", "account.js", "user.js", "device.js",
	"group.js", "present-device.js", "present-devices-log.js", "tag-schedule.js",
    "tag-state-present-device-config.js", "tag-state-present-device-status.js",
    "tag-state-present-device-logcat-link.js",
    "tag-state-digi-config.js", "tag-state-digi-endlist.js", "tag-state-digi-eventlog.js",
    "tag-state-digi-status.js", "tag-state-gem-config.js", "tag-state-gateway-software.js",
    "tag-state-gateway-network.js", "tag-state-thermostat-temperature.js",
    "demouser.js"];

var l = models.length;
for (var i = 0; i < l; i++) {
    var model = "./" + models[i];
    require(model)();
}
