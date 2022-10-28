"use strict";

var fs = require("fs"),
    json2csv = require("json2csv"),
    wkhtmltopdf = require("wkhtmltopdf"),
    path = require("path"),
    moment = require("moment"),
    _ = require("lodash"),
    utils= require("../../../libs/utils"),
    domain = utils.getDomain(false),
    async = require("async");

function checkExportDir(callback) {
    var coreBaseDir = path.join(__dirname, "../../../../client/exported");
    fs.readdir(coreBaseDir, function(readErr, files) {
        if(readErr) {
            fs.mkdir(coreBaseDir, function(mkErr) {
                callback(mkErr, coreBaseDir);
            });
        }
        else {
            callback(null, coreBaseDir);
        }
    });
}

function convertElectricDemandTableToCsv(inputData) {
    try {
        var fields = ["date"];
        var sourceFieldsName = [];
        var exportData = [];
        var i = 0, j = 0;

        //get all sourcenames
        for (i = 0; i < inputData.series.length; i++) {
            sourceFieldsName.push(inputData.series[i].name);
        }


        //build csv valid table
        for (i = 0; i < inputData.categories.length; i++) {
            var exportItem = {
                date: moment(inputData.categories[i], "h:mm:ssa, MMM DD, YYYY").toISOString()
            };

            for (j = 0; j < inputData.series.length; j++) {
                var val = _.isUndefined(inputData.series[j].data[i]) ? null : inputData.series[j].data[i];
                exportItem[sourceFieldsName[j]] = val;
            }

            exportData.push(exportItem);
        }

        fields.push.apply(fields, sourceFieldsName);

        return {
            values: exportData,
            fields: fields
        };
    } catch(e) {
        utils.logError(e);
        return null;
    }
}

function convertElectricDemandTableToHTMLTable(inputData) {
    try {
        var finalStr = "<table border=\"1\"><tr><th>Date</th>";
        var sourceFieldsName = [];
        var i = 0, j = 0;

        //get all sourcenames
        for (i = 0; i < inputData.series.length; i++) {
            sourceFieldsName.push(inputData.series[i].name);
            finalStr += "<th>" + inputData.series[i].name + "</th>";
        }

        //build html table
        finalStr += "</tr>";


        for (i = 0; i < inputData.categories.length; i++) {
            finalStr += "<tr>";

            finalStr += "<td>" + moment(inputData.categories[i], "h:mm:ssa, MMM DD, YYYY").toISOString() + "</td>";

            for (j = 0; j < inputData.series.length; j++) {
                var val = _.isUndefined(inputData.series[j].data[i]) ? null : inputData.series[j].data[i];

                finalStr += "<td>" + val + "</td>";
            }


            finalStr += "</tr>";
        }

        return finalStr;
    } catch(e) {
        e.table = inputData;
        utils.logError(e);
        return null;
    }
}

function convertTableToCSV(inputData) {
    try {
        var fields = ["date"];
        var sourceFieldsName = [];
        var sourceFieldsId = {};
        var exportData = [];
        var i = 0, j = 0;
        var sourceName = null;
        var sourceId = null;

        //get all sourcenames
        for (i = 0; i < inputData.length; i++) {
            var sourcesId = Object.keys(inputData[i].sources);
            for (j = 0; j < sourcesId.length; j++) {
                sourceId = sourcesId[j];
                sourceName = inputData[i].sources[sourceId].name;
                if (sourceFieldsName.indexOf(sourceName) < 0) {
                    sourceFieldsName.push(sourceName);
                    sourceFieldsId[sourceName] = sourceId;
                }
            }
        }


        //build csv valid table
        for (i = 0; i < inputData.length; i++) {
            var exportItem = {
                date: inputData[i].date//,
                //percent: inputData[i].percent
            };

            for (j = 0; j < sourceFieldsName.length; j++) {
                sourceName = sourceFieldsName[j];
                sourceId = sourceFieldsId[sourceName];
                var val = _.isUndefined(inputData[i].sources[sourceId]) ? null : inputData[i].sources[sourceId].value;
                exportItem[sourceName] = val;
            }

            exportData.push(exportItem);
        }

        fields.push.apply(fields, sourceFieldsName);

        return {
            values: exportData,
            fields: fields
        };
    } catch(e) {
        utils.logError(e);
        return null;
    }
}

function convertTableToHTMLTable(inputData) {
    try {
        var finalStr = "<table border=\"1\"><tr><th>Date</th>";//<th>Percent</th>
        var sourceFieldsName = [];
        var sourceFieldsId = {};
        var i = 0, j = 0;
        var sourceName = null;
        var sourceId = null;

        //get all sourcenames
        for (i = 0; i < inputData.length; i++) {
            var sourcesId = Object.keys(inputData[i].sources);
            for (j = 0; j < sourcesId.length; j++) {
                sourceId = sourcesId[j];
                sourceName = inputData[i].sources[sourceId].name;
                if (sourceFieldsName.indexOf(sourceName) < 0) {
                    finalStr += "<th>" + sourceName + "</th>";
                    sourceFieldsName.push(sourceName);
                    sourceFieldsId[sourceName] = sourceId;
                }
            }
        }

        //build html table
        finalStr += "</tr>";


        for (i = 0; i < inputData.length; i++) {
            finalStr += "<tr>";

            finalStr += "<td>" + inputData[i].date + "</td>";
            //finalStr += "<td>" + inputData[i].percent + "</td>";

            for (j = 0; j < sourceFieldsName.length; j++) {
                sourceName = sourceFieldsName[j];
                sourceId = sourceFieldsId[sourceName];
                var val = _.isUndefined(inputData[i].sources[sourceId]) ? null : inputData[i].sources[sourceId].value;

                finalStr += "<td>" + val + "</td>";
            }

            finalStr += "</tr>";
        }

        return finalStr;
    } catch(e) {
        e.table = inputData;
        utils.logError(e);
        return null;
    }
}

function exportTable(userId, exportFormat, exportData, clientAnswerExport) {

    var isElectricDemand = !_.isUndefined(exportData.categories);

    async.waterfall([
        function(cb) {
            checkExportDir(cb);
        }, function(baseExportPath, cb) {
            exportFormat = exportFormat.toLowerCase();
            var exportFile = userId + "_" + moment.utc().unix();
            var exportedFilePath = exportFile + "." + exportFormat;
            var thisPath = path.join(baseExportPath, exportedFilePath);
            var responsePath = domain + "/exported/" + exportedFilePath;

            if (exportFormat === "csv") {

                var csvSourceData = isElectricDemand ?
                    convertElectricDemandTableToCsv(exportData) : convertTableToCSV(exportData);
                if(csvSourceData === null) {
                    return cb(new Error("Wrong table data"));
                }

                json2csv({data: csvSourceData.values, fields: csvSourceData.fields}, function(err, csv) {
                    if (err) {
                        return clientAnswerExport.error(err);
                    } else {
                        fs.writeFile(thisPath, csv, function(writeErr) {
                            if (writeErr) {
                                cb(writeErr);
                            } else {
                                cb(null, responsePath);
                            }
                        });
                    }
                });
            } else if (exportFormat === "pdf") {

                var tableStr = isElectricDemand ?
                    convertElectricDemandTableToHTMLTable(exportData) : convertTableToHTMLTable(exportData);

                if(tableStr === null) {
                    return cb(new Error("Wrong table data"));
                }

                var cssStyle = "<style> div.page-pdf { float: left; margin-top: 30px; width: 100%;} ";
                cssStyle += " thead,tfoot { display: table-row-group !important;} ";
                cssStyle += " tr { page-break-inside: avoid !important;} ";
                cssStyle += " th,td {padding: 10px; white-space: nowrap; text-align: left;}";
                cssStyle += " h1,h2 {text-align: center;} </style>";

                var exportHtml = "<html><head>" + cssStyle + "</head><body style='border:0; margin: 0;'>";

                exportHtml += tableStr;
                exportHtml += "</body></html>";

                var writeStreamPdf = fs.createWriteStream(thisPath);
                var readerPdf = wkhtmltopdf(exportHtml);
                readerPdf.pipe(writeStreamPdf);
                readerPdf.on("end", function() {
                    cb(null, responsePath);
                });

                writeStreamPdf.on("error", function(err) {
                    cb(err);
                });

            } else {
                cb(new Error("Wrong export format"));
            }
        }
    ], function(err, result) {
        if(err) {
            clientAnswerExport.error(err);
        } else {
            clientAnswerExport.send(result);
        }
    });


}

exports.exportTable = exportTable;