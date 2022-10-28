"use strict";

// TODO:: moved to core-service

var AWS = require("aws-sdk"),
    config = require("../../../../config/environment"),
    awsUtils = require("./utils");

function getParams(companyName, isCREATE) {
    var params = {
        ChangeBatch: {
            Changes: [
                {
                    Action: isCREATE? "CREATE" : "DELETE",
                    ResourceRecordSet: {
                        Name: companyName + config.get("aws:route53:resourcerecordsetbasename"),
                        Type: "CNAME",
                        ResourceRecords: [
                            {
                                Value: config.get("aws:route53:resourcerecordvalue")
                            }
                        ],
                        TTL: 60
                    }
                }
            ]
        },
        HostedZoneId: config.get("aws:route53:hostedzoneid")
    };

    return params;
}

function addCNAME(companyName, callback) {
    awsUtils.setCredentials(AWS);

    var route53 = new AWS.Route53();
    var params = getParams(companyName, true);
    route53.changeResourceRecordSets(params, callback);
}

function deleteCNAME(companyName, callback) {
    awsUtils.setCredentials(AWS);

    var route53 = new AWS.Route53();
    var params = getParams(companyName, false);
    route53.changeResourceRecordSets(params, callback);
}

exports.addCNAME = addCNAME;
exports.deleteCNAME = deleteCNAME;