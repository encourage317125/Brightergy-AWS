"use strict";

var consts = require("../../../libs/consts"),
    async = require("async"),
    fs = require("fs"),
    json2csv = require("json2csv"),
    wkhtmltopdf = require("wkhtmltopdf"),
    wkhtmltoimage = require("wkhtmltoimage"),
    exportDir = "./client/exported/",
    baseExportPath = __dirname + "/../../../../client/exported/";

function checkExportDir(callback) {
    fs.readdir(exportDir, function(readErr, files) {
        if(readErr) {
            fs.mkdir(exportDir, callback);
        }
        else {
            callback(null);
        }
    });
}

function exportWidget(widgetId, exportFormat, exportFile, exportData, finalCallback) {
    exportFile = decodeURI(exportFile);
    var exportedFilePath = "./client/exported/" + exportFile + "." + exportFormat;

    if (exportFormat === "csv") {
        json2csv({data: exportData.values, fields: exportData.fields}, function(err, csv) {
            if (err) {
                finalCallback(err);
            } else {
                fs.writeFile(exportedFilePath, csv, function(writeErr) {
                    if (writeErr) {
                        finalCallback(writeErr);
                    } else {
                        finalCallback(null, {exportedResourceUrl: "/exported/" + exportFile + "." + exportFormat});
                    }
                });
            }
        });
    } else if (exportFormat === "pdf") {
        var exportedTime = (new Date()).getTime();
        var exportedImage = "exported-" + exportedTime + ".png";

        async.waterfall([
            function(callback) {
                if(exportData.chart) {
                    var chartStyle = "";
                    var cssFiles = [];

                    cssFiles.push(consts.CLIENT_CSS_FILES.LIBRARY.NVD3, consts.CLIENT_CSS_FILES.COMMON[0],
                        consts.CLIENT_CSS_FILES.ANALYZE_APP[0]);

                    async.map(cssFiles, function(cssFile, childCallback) {
                        fs.readFile(cssFile, "utf8", function(err, cssContent) {
                            if (err) {
                                childCallback(err);
                            } else {
                                childCallback(null, cssContent);
                            }
                        });
                    }, function(err, results) {
                        if (err) {
                            callback(err);
                        } else {
                            chartStyle = results.join("");
                            chartStyle = exportData.style ? chartStyle + exportData.style : chartStyle;

                            var chartHtml = "<html><head><style>" + chartStyle + "</style></head>" + 
                                "<body style='border:0; margin: 0;'>" + exportData.chart + "</body></html>";

                            var reader = wkhtmltoimage.generate(chartHtml);
                            var writeStream = fs.createWriteStream("./client/exported/" + exportedImage);
                            reader.pipe(writeStream);
                            reader.on("end", function() {
                                callback(null);
                            });

                            writeStream.on("error", function(err) {
                                callback(err);
                            });
                        }
                    });
                }
                else {
                    callback(null);
                }
            },
            function(callback) {
                var cssStyle = " div.page-pdf { float: left; margin-top: 30px; width: 100%;} ";
                cssStyle += " thead,tfoot { display: table-row-group !important;} ";
                cssStyle += " tr { page-break-inside: avoid !important;} ";
                cssStyle += " th,td {padding: 10px; white-space: nowrap; text-align: left;}";
                cssStyle += " h1,h2 {text-align: center;} ";
                
                cssStyle = "<style>" + cssStyle + "</style>";
                
                var exportHtml = "<html><head>" + cssStyle + "</head>" + 
                    "<body style='border:0; margin: 0;'>" + exportData.title;

                if(exportData.chart) {
                    exportHtml += "<img src='" + baseExportPath + exportedImage + "' width='100%'>";
                }

                if(exportData.data) {
                    exportHtml += exportData.data;
                }

                exportHtml += "</body></html>";

                // write html contents to check
                fs.writeFile("./client/exported/exported.html", exportHtml, function(err) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log("exporting html written.");
                    }
                });

                var readerPdf = wkhtmltopdf(exportHtml);
                var writeStreamPdf = fs.createWriteStream(exportedFilePath);
                readerPdf.pipe(writeStreamPdf);
                readerPdf.on("end", function() {
                    if(exportData.chart) {
                        fs.unlinkSync("./client/exported/" + exportedImage);
                    }
                    callback(null, {exportedResourceUrl: "/exported/" + exportFile + "." + exportFormat});
                });

                writeStreamPdf.on("error", function(err) {
                    callback(err);
                });
            }
        ], function (finalErr, finalResult) {
            if(finalErr) {
                finalCallback(finalErr, null);
            } else {
                finalCallback(null, finalResult);
            }
        });
    }
}

function exportDashboard(dashboardId, exportFile, exportData, finalCallback) {
    exportFile = decodeURI(exportFile);
    var exportedFilePath = "./client/exported/" + exportFile + ".pdf";
    var chartStyle = "";

    async.waterfall([
        function(callback) {
            var cssFiles = [];

            cssFiles.push(consts.CLIENT_CSS_FILES.LIBRARY.NVD3, consts.CLIENT_CSS_FILES.COMMON[0],
                consts.CLIENT_CSS_FILES.ANALYZE_APP[0]);

            async.map(cssFiles, function(cssFile, childCallback) {
                fs.readFile(cssFile, "utf8", function(err, cssContent) {
                    if (err) {
                        childCallback(err);
                    } else {
                        childCallback(null, cssContent);
                    }
                });
            }, function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    chartStyle = results.join("");
                    chartStyle += " .ng-hide {display: none !important}";

                    async.mapSeries(exportData.widgets, function(widget, widgetCallback) {
                        var chartHtml = "<html><head><style>" + chartStyle + "</style></head>" + 
                            "<body style='border:0; margin: 0;'>" + widget.html + "</body></html>";

                        var reader = wkhtmltoimage.generate(chartHtml, {width: widget.width});
                        var exportedImage = "exported-" + (new Date()).getTime() + ".png";
                        var writeStream = fs.createWriteStream("./client/exported/" + exportedImage);
                        /*
                        // write image html contents to check
                        fs.writeFile("./client/exported/" + exportedImage + ".html", chartHtml, function(err) {
                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log("exporting html written.");
                            }
                        });
                        */
                        reader.pipe(writeStream);
                        widget.image = null;
                        reader.on("end", function() {
                            widget.image = exportedImage;
                            widgetCallback(null, widget);
                        });

                        writeStream.on("error", function(err) {
                            widgetCallback(err);
                        });
                    }, function(widgetErr, widgetResults) {
                        if(widgetErr) {
                            callback(widgetErr);
                        }
                        else {
                            callback(null, widgetResults);
                        }
                    });
                }
            });
        },
        function(widgets, callback) {
            var cssStyle = " .wrapper { margin-top: 30px; width: 100%;} .wrapper:after{ clear: both;} ";
            cssStyle += " .widget-container {page-break-inside: avoid !important;}";
            cssStyle += " h1,h6 {text-align: center;} h6 {margin: 0 0 10px 0;} ";
            cssStyle += " h5 {text-align: right; padding-right: 10px;} ";
            cssStyle += " .col-md-3, .col-md-4, .col-md-6, .col-md-8, .col-md-12 { float: left;}";
            cssStyle += " .col-md-3 { width: 25%; } .col-md-4 { width: 33.33%; } .col-md-6 { width: 50%; }";
            cssStyle += " .col-md-8 { width: 66.66%; } .col-md-12 { width: 100%; }";

            cssStyle = "<style>" + cssStyle + "</style>";
            
            var exportHtml = "<html><head>" + cssStyle + "</head>" + 
                "<body style='border:0; margin: 0;'>" + exportData.title + exportData.dateRange + 
                exportData.chart + "</body></html>";

            async.eachSeries(widgets, function(widget, widgetCallback) {
                var imageHtml = "<img src='" + baseExportPath + widget.image + "' width='100%'>";
                exportHtml = exportHtml.replace(widget.key, imageHtml);
            
                widgetCallback(null);
            }, function(widgetErr) {
                if(widgetErr) {
                    callback(widgetErr);
                }
                else {
                    // write html contents to check
                    fs.writeFile("./client/exported/exported-dashboard.html", exportHtml, function(err) {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            console.log("exporting html written.");
                        }
                    });

                    var readerPdf = wkhtmltopdf(exportHtml);
                    var writeStreamPdf = fs.createWriteStream(exportedFilePath);
                    readerPdf.pipe(writeStreamPdf);
                    readerPdf.on("end", function() {
                        callback(null, widgets);
                    });

                    writeStreamPdf.on("error", function(err) {
                        callback(err);
                    });
                }
            });
        },
        function(widgets, callback) {
            async.each(widgets, function(widget, widgetCallback) {
                fs.unlinkSync("./client/exported/" + widget.image);
                widgetCallback(null);
            }, function(widgetErr) {
                if(widgetErr) {
                    callback(widgetErr);
                }
                else {
                    callback(null, {
                        exportedResourceUrl: "/exported/" + exportFile + ".pdf",
                        exportedPath: baseExportPath + exportFile + ".pdf"
                    });
                }
            });
        }
    ], function (finalErr, finalResult) {
        if(finalErr) {
            finalCallback(finalErr, null);
        } else {
            finalCallback(null, finalResult);
        }
    });
}

exports.checkExportDir = checkExportDir;
exports.exportWidget = exportWidget;
exports.exportDashboard = exportDashboard;