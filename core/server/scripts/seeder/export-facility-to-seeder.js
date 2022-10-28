"use strict";

require("../../general/models");

var _ = require("lodash"),
    fs = require("fs"),
    path = require("path"),
    mongoose = require("mongoose"),
    argv = require("minimist")(process.argv.slice(2)),
    config = require("../../../config/environment"),
    Tag = mongoose.model("tag"),
    tagDao = require("../../general/core/dao/tag-dao.js"),
    log = require("../../libs/log")(module),
    crypto = require("crypto");


function main(callback) {
    mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {
        if (mongooseErr) {
            log.error(mongooseErr);
            process.exit(1);
        }
        log.info("mongoose connect ok: " + config.get("db:connection"));

        callback();
    });
}


function anonymize(facility) {

    function getHashSubstring(source, length) {
        return crypto.createHash("md5")
            .update(source)
            .digest("hex")
            .substring(0, length);
    }

    function generateFacilityName(name) {
        if (!name) {
            return "";
        }
        return "Facility-" + getHashSubstring(name, 8);
    }

    function generateStreet(street) {
        if (!street) {
            return "";
        }
        return "Street-" + getHashSubstring(street, 4);
    }

    function generateCity(city) {
        return city;
    }

    function generateState(state) {
        return state;
    }

    function generatePostalcode(code) {
        if (!code) {
            return "";
        }
        return parseInt(getHashSubstring(code, 4), 16);
    }

    function generateAddress(street, city, state, postalCode, country) {
        return street + ", " + city + ", " + state + " " + postalCode + ", " + country;
    }

    log.info("Anonymazing facility: " + facility.name);
    if (facility.name) {
        facility.name = generateFacilityName(facility.name);
    }
    if (facility.street) {
        facility.street = generateStreet(facility.street);
    }
    if (facility.city) {
        facility.city = generateCity(facility.city);
    }
    if (facility.state) {
        facility.state = generateState(facility.state);
    }
    if (facility.postalCode) {
        facility.postalCode = generatePostalcode(facility.postalCode);
    }
    if (facility.address) {
        facility.address = generateAddress(
            facility.street,
            facility.city,
            facility.state,
            facility.postalCode,
            facility.country);
    }
    if (facility.installStreet) {
        facility.installStreet = generateStreet(facility.installStreet);
    }
    if (facility.installCity) {
        facility.installCity = generateCity(facility.installCity);
    }
    if (facility.installState) {
        facility.installState = generateState(facility.installState);
    }
    if (facility.installPostalCode) {
        facility.installPostalCode = generatePostalcode(facility.installPostalCode);
    }

    if (facility.installAddress) {
        facility.installAddress = generateAddress(
            facility.installStreet,
            facility.installCity,
            facility.installState,
            facility.installPostalCode,
            facility.country);
    }
}


function exportFacility(facilityName, exportOptions, callback) {
    log.debug("exportFacility: " + facilityName);

    Tag.findOne({ tagType: "Facility", name: { $regex: facilityName } }, function (err, facility) {
        if (err) {
            return callback(err);
        }
        if (_.isEmpty(facility)) {
            return callback("Can't find facility using " + facilityName + " as regex");
        }

        log.info("Found facility: " + facility.name);
        var resultArray = [];

        tagDao.findTagsRecursive([facility.id], resultArray, function(err) {
            if (err) {
                return callback(err);
            }

            if (exportOptions.anonymize) {
                log.info("Anonymizing facilities");
                _.chain(resultArray)
                .filter(function(tag) {
                    return (tag.tagType === "Facility");
                }).each(anonymize).value();
            }
            var fileName = (facility.name).toLowerCase().replace(/ /g, "_") + ".json";

            var resultPath = path.join(exportOptions.outputDir, fileName);
            log.info("resulting file: " + resultPath);

            fs.writeFileSync(resultPath, JSON.stringify(resultArray, null, 2));
            callback();
        });
    });
}


// enty point
var exportOptions = {
    "outputDir": path.join(path.resolve(__dirname), "sources"),
    anonymize: argv.anonymize
};


var facilityName;
if (argv.name) {
    facilityName = argv.name;
} else {
    console.info("usage: node " + process.argv[1] + " --name '$FacilityName' [--anonymize]");
    process.exit(0);
}


var handler = exportFacility.bind(null, facilityName, exportOptions, function(err) {
    if (err) {
        log.error(err);
    }
    log.debug("Finished");
    mongoose.connection.close();
    process.exit(0);
});


main(handler);
