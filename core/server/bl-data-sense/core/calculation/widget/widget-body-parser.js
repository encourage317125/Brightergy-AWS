"use strict";

var  _ = require("lodash"),
    moment = require("moment"),
//log = require("../../../../libs/log")(module),
    utils = require("../../../../libs/utils"),
//dataSourceUtils = require("../../../../libs/data-source-utils"),
    consts = require("../../../../libs/consts"),
    async = require("async"),
//sensorDAO = require("../../../../general/core/dao/sensor-dao"),
//dataSourceDAO = require("../../../../general/core/dao/data-source-dao"),
    tagDAO = require("../../../../general/core/dao/tag-dao"),
    userDAO = require("../../../../general/core/dao/user-dao"),
    accountDAO = require("../../../../general/core/dao/account-dao"),
    dashboardDAO = require("../../dao/dashboard-dao"),
    widgeCalculator = require("./widget-calculator");
//widgetDAO = require("../../dao/widget-dao");

// --------------------------------------------------------------------------------------------------

/**
 * Common dataLoggers info to tempodb metadata
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getFamilyByDevice(device) {
    if(/Web Box/i.test(device) || /WebBox/i.test(device)) {
        return consts.WEBBOX;
    } else if(/eGauge/i.test(device)) {
        return consts.EGAUGE;
    } else if(/Enphase/i.test(device)) {
        return consts.ENPHASE;
    } else {
        return null;
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Get users and accounts for specified tags
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getUsersAndAccounts(segments, finalCallback) {
    var tags = [];
    var accessibleUsers = [];
    var userIds = [], accountIds = [];
    var userNames = [], accountNames = [];
    
    var dimensionData = [];
    var availableUsers = [];
    var availableAccounts = [];

    async.eachSeries(segments, function(segment, segmentCallback) {

        tags = segment.tags;
        accessibleUsers = [];
        userIds = [];
        accountIds = [];
        userNames = [];
        accountNames = [];

        for(var i=0; i<tags.length; i++) {
            accessibleUsers = _.uniq(_.union(accessibleUsers, tags[i].usersWithAccess), "id");
        }

        userIds = _.pluck(accessibleUsers, "id");

        async.waterfall([
            function(callback) {
                userDAO.getUsersByParams({_id: {$in: userIds}},function(err, users){
                    userNames = _.map(users, function(user) {
                        return user.firstName + " " + user.lastName;
                    });
                    
                    _.each(users, function(user) {
                        accountIds = _.union(accountIds,user.accounts);
                    });

                    callback(null, userNames);
                });
            },
            function(userNames, callback) {
                accountDAO.getAccountsByParams({_id: {$in: accountIds}},function(err,accounts) {
                    accountNames = _.map(accounts, function(account) {
                        return account.name;
                    });
                    callback(null, userNames, accountNames);
                });
            }
        ], function (err, userNames, accountNames) {
            if (err) {
                segmentCallback(err);
            } else {
                dimensionData[segment.name] = {
                    "accessibleUsers": userNames,
                    "accessibleAccounts": accountNames
                };
                
                availableUsers = _.uniq(_.union(availableUsers,userNames));
                availableAccounts = _.uniq(_.union(availableAccounts,accountNames));

                segmentCallback(null);
            }
        });
    }, function(err){
        if(err) {
            finalCallback(err);
        } else {
            var dimensionHelper = {
                "availableUsers": availableUsers,
                "availableAccounts": availableAccounts,
                "data": dimensionData

            };
            finalCallback(null,dimensionHelper);
        }
    });
    
}

// --------------------------------------------------------------------------------------------------

/**
 * Common dataLoggers info to tempodb metadata
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getAnTempoIQParam(isSubDayOption, dataLoggerTag, sensorTag, metricTag, widget, legend,
                           dateRangeType, dateRange, metricPairType, dimensionHelper, tempoIQQueryParams) {

    var isPrimaryDateRange = (dateRangeType === "primaryDateRange") ? true : false;
    var deviceId = null;
    var family = null;
    var tempoIQParamObject = {};
    var facilityTag = dataLoggerTag.parentTag;

    if(typeof facilityTag === "undefined") {
        facilityTag = {
            country: "not specified",
            state: "not specified",
            city: "not specified",
            zip: "not specified"
        };
    }

    var thisDateRange = (dateRangeType === "primaryDateRange") ? dateRange[0] : dateRange[1];
    family = getFamilyByDevice(dataLoggerTag.device);

    if(family === consts.WEBBOX) {
        deviceId = utils.getParsedWebBox(dataLoggerTag.deviceID);
    } else {
        deviceId = utils.encodeSeriesKey(dataLoggerTag.deviceID);
    }

    if(thisDateRange.startDate && thisDateRange.endDate) {

        tempoIQParamObject = {
            startDate: thisDateRange.startDate,
            endDate: thisDateRange.endDate,
            family: family,
            device: deviceId,
            sensor: utils.encodeSeriesKey(sensorTag.deviceID),
            interval: sensorTag.interval,
            metricName: (metricPairType === "primaryMetric") ? widget.metric.name : widget.compareMetric.name,
            latitude: sensorTag.latitude,
            longitude: sensorTag.longitude,
            accessMethod: sensorTag.accessMethod,
            type: metricTag.metricID,
            country: facilityTag.country,
            state: facilityTag.state,
            city: facilityTag.city,
            zip: facilityTag.postalCode,
            isPrimaryDateRange: isPrimaryDateRange,
            isPrimaryMetric: (metricPairType === "primaryMetric") ? true : false,
            dataLoggerManufacturer: dataLoggerTag.manufacturer,
            sensorManufacturer: sensorTag.manufacturer,
            summaryMethod: metricTag.summaryMethod,
            metricType: metricTag.metricType,
            rate: metricTag.rate,
            deviceOffset: utils.getOffsetByTimeZone(dataLoggerTag.timezone)
        };

        if(dimensionHelper) {
            tempoIQParamObject.availableUsers = dimensionHelper.availableUsers;
            tempoIQParamObject.users = dimensionHelper.data[legend].accessibleUsers;
            tempoIQParamObject.availableAccounts = dimensionHelper.availableAccounts;
            tempoIQParamObject.accounts = dimensionHelper.data[legend].accessibleAccounts;
        }

        // Add TempoIQParam if Custom Group Dimension
        if(widget.groupDimension === consts.DIMENSIONS.CUSTOM) {
            tempoIQParamObject.scopeId = dataLoggerTag._id.toString();
            tempoIQParamObject.nodeId = sensorTag._id.toString();
            tempoIQParamObject.metricId = metricTag._id.toString();
        }

        // if(isSubDayOption && isPrimaryDateRange && dataLoggerTag.timezone) {
        if(isSubDayOption && dataLoggerTag.timezone) {
            //change utc time to device local time, IF it is sub day option
            var offset = utils.getOffsetByTimeZone(dataLoggerTag.timezone);

            tempoIQParamObject.startDate = moment.utc(tempoIQParamObject.startDate).add(offset, "m");
            tempoIQParamObject.endDate = moment.utc(tempoIQParamObject.endDate).add(offset, "m");
        }

        // if(!(isSubDayOption && isPrimaryDateRange)) {
        if(!isSubDayOption) {
            //if user specified sub day , do not add additional time
            //otherwise if user selected 2014-12-01T00:00:00 to 2014-12-03T00:00:00,
            //end date should be 2014-12-03T23:59:59
            tempoIQParamObject.endDate = utils.addOneDay(tempoIQParamObject.endDate);
        }   

        tempoIQQueryParams.push(tempoIQParamObject);
    }

    return;
}

// --------------------------------------------------------------------------------------------------

function makeTempoIQQueryParams(isSubDayOption, widget, dataLoggerTag, dimensionHelper, tagsHelper,
                                dateRangeType, dateRange, metricPairType, finalCallback) {

    //var availableMetricTags = [];
    var sensorTags = tagsHelper.sensorTags;
    var metricTags = tagsHelper.metricTags;
    var legend = tagsHelper.segmentName;

    var metric = (metricPairType === "primaryMetric") ? widget.metric : widget.compareMetric;

    /*var allMetricTagIds = _.pluck(metricTags, "_id");
     if (metric) {
     availableMetricTags = _.filter(allMetricTagIds, function(metricTagId) {
     return metricTagId.toString() === metric._id.toString();
     });
     }*/

    var correctMetricTags = null;

    //var allMetricNames = _.pluck(metricTags, "name");

    if (metric) {
        correctMetricTags = _.filter(metricTags, function(tag) {
            return tag.name === metric.name;
        });
    }

    if(!correctMetricTags || correctMetricTags.length === 0) {
        finalCallback(null,[]);
    }
    else {
        var tempoIQQueryParams = [];

        var metricsToUse = _.filter(correctMetricTags, function(tag) {
            return metric._id.toString() === tag._id.toString();
        });

        var metricToUse = metricsToUse.length > 0 ? metricsToUse[0] : correctMetricTags[0];

        sensorTags.forEach(function(sensorTag){
            getAnTempoIQParam(isSubDayOption, dataLoggerTag, sensorTag, metricToUse, widget,
                legend, dateRangeType, dateRange, metricPairType,
                dimensionHelper, tempoIQQueryParams);
        });

        finalCallback(null,tempoIQQueryParams);
    }

}

// --------------------------------------------------------------------------------------------------

/**
 * get widget data per primary/comparison metric based on segment tags
 *
 * @access  public
 * @param   {object} request - express request object
 * @param   {object} response - express response object
 * @param   {callback} next - callback
 * @param   {boolean} isDashboard - true if dashboard request
 * @return  {void}
 */
function groupingTempoIQParams(isSubDayOption, widget, dimensionHelper, tagsHelper, dateRangeType, dateRange,
                               metricPairType, finalCallback) {

    var dataloggerTags = tagsHelper.dataloggerTags;

    async.map(dataloggerTags, function(dataloggerTag, callback) {
        makeTempoIQQueryParams(isSubDayOption, widget, dataloggerTag, dimensionHelper, tagsHelper,
            dateRangeType, dateRange, metricPairType, callback);
    }, function(err, tempoIQMetas) {
        if(err) {
            finalCallback(err);
        } else {
            var tempoIQMetasPerMetricPair = _.uniq(_.flatten(tempoIQMetas));

            finalCallback(null, tempoIQMetasPerMetricPair);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * get widget data per widget based on segment tags
 *
 * @access  public
 * @param   {object} request - express request object
 * @param   {object} response - express response object
 * @param   {callback} next - callback
 * @param   {boolean} isDashboard - true if dashboard request
 * @return  {void}
 */
function convertTagToTempoIQMeta(isSubDayOption, widget, dimensionHelper, tagsHelper,
                                dateRangeType, dateRange, finalCallback) {

    var segmentName = tagsHelper.segmentName;

    var metricPairs = ["primaryMetric"];
    var tasks = [];

    if ((widget.type === consts.DATA_SENSE_WIDGET_TYPES.Timeline ||
        widget.type === consts.DATA_SENSE_WIDGET_TYPES.Kpi ||
        widget.type === consts.DATA_SENSE_WIDGET_TYPES.Table) && widget.compareMetric) {
        metricPairs = ["primaryMetric","compareMetric"];
    }

    tasks.push(function(callback) {
        groupingTempoIQParams(isSubDayOption, widget, dimensionHelper, tagsHelper, dateRangeType,
            dateRange, metricPairs[0], callback);
    });

    if(metricPairs.length > 1) {
        tasks.push(function(callback) {
            groupingTempoIQParams(isSubDayOption, widget, dimensionHelper, tagsHelper, dateRangeType,
                dateRange, metricPairs[1], callback);
        });
    }

    async.parallel(tasks, function(err, results){
        if(err) {
            finalCallback(err);
        } else {
            var tempoIQMetasPerSegment = {};
            tempoIQMetasPerSegment[segmentName] = {
                primaryMetric: results[0],
                compareMetric: results[1]
            };
            finalCallback(null, tempoIQMetasPerSegment);
        }
    });
}

/**
 * get tags by dashboard or widget segments
 *
 * @access  private
 * @param   {object} segments
 * @param   {function} finalCallback
 * @return  {void}
 */
function getEntityTags(segments, finalCallback) {
    async.map(segments, function(segment, segmentCallback) {

        async.waterfall([
            function(tagFilterCallback) {
                tagDAO.filterTagsByType(segment.tags, consts.TAG_TYPE.Scope, tagFilterCallback);
            },
            function(dataloggerTags, tagFilterCallback) {

                tagDAO.filterTagsByType(segment.tags, consts.TAG_TYPE.Node, function(err,sensorTags) {
                    if (err) {
                        tagFilterCallback(err);
                    } else {
                        tagFilterCallback(null,dataloggerTags, sensorTags);
                    }
                });
            },
            function(dataloggerTags, sensorTags, tagFilterCallback) {
                tagDAO.filterTagsByType(segment.tags, consts.TAG_TYPE.Metric, function(err, metricTags) {
                    if (err) {
                        tagFilterCallback(err);
                    } else {
                        //metricTags = _.uniq(metricTags, "name");
                        tagFilterCallback(null,dataloggerTags, sensorTags, metricTags);
                    }
                });
            },
            function(dataloggerTags, sensorTags, metricTags, tagFilterCallback) {
                var tagsHelper = {
                    "dataloggerTags" : dataloggerTags,
                    "sensorTags" : sensorTags,
                    "metricTags" : metricTags,
                    "segmentName": segment.name
                };

                tagFilterCallback(null, tagsHelper);
                //convertTagToTempoIQMeta(isSubDayOption, widget, segment, dimensionHelper, tagsHelper,
                    //dateRangeType, dateRange, tagFilterCallback);
            }
        ], function (err, tempoIQItemsPerSegment) {
            if (err) {
                segmentCallback(err);
            } else {
                segmentCallback(null,tempoIQItemsPerSegment);
            }
        });

    }, function(err, tempoIQItems) {
        if(err) {
            finalCallback(err);
        } else {
            finalCallback(null, tempoIQItems);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * get widget data per widget based on segment tags
 *
 * @access  public
 * @param   {object} request - express request object
 * @param   {object} response - express response object
 * @param   {callback} next - callback
 * @param   {boolean} isDashboard - true if dashboard request
 * @return  {void}
 */
function generateTempoItemsList(isSubDayOption, widget, dashboardTags,
                                dimensionHelper, dateRangeType, dateRange, finalCallback) {

    async.map(dashboardTags, function(tagsHelper, segmentCallback) {
        convertTagToTempoIQMeta(isSubDayOption, widget, dimensionHelper, tagsHelper,
        dateRangeType, dateRange, segmentCallback);

    }, function(err, tempoIQItems) {
        if(err) {
            finalCallback(err);
        } else {
            finalCallback(null, tempoIQItems);
        }
    });

}

/**
 * get date range based on dashboard and widget parameters
 *
 * @access  private
 * @param   {object} retrievedDashboard
 * @param   {object} widget
 * @return  {object}
 */
function getDateRange(retrievedDashboard, widget) {
    var start = retrievedDashboard.startDate;
    var end = retrievedDashboard.endDate;
    var compareStart = retrievedDashboard.compareStartDate;
    var compareEnd = retrievedDashboard.compareEndDate;

    if(widget.startDate && widget.endDate) {
        start = widget.startDate;
        end = widget.endDate;
    }

    if(widget.compareStartDate && widget.compareEndDate) {
        compareStart = widget.compareStartDate;
        compareEnd = widget.compareEndDate;
    }

    var currentDate = moment.utc();

    var primaryDataRangeDiff = 0;
    /*var compareDataRangeDiff = 0;*/

    if(retrievedDashboard.isRealTimeDateRange) {
        if(end) {
            primaryDataRangeDiff = currentDate.diff(end, "days");
        }

        /*if(retrievedDashboard.compareEndDate) {
         compareDataRangeDiff = currentDate.diff(retrievedDashboard.compareEndDate, "minutes");
         }*/
    }

    var dateRange = [
        {
            "startDate" : start?
                moment.utc(start).add(primaryDataRangeDiff, "d"):
                start,
            "endDate" : end?
                moment.utc(end).add(primaryDataRangeDiff, "d"):
                end
        },
        {
            "startDate" : compareStart?
                moment.utc(compareStart).add(primaryDataRangeDiff, "d"):
                compareStart,
            "endDate" : compareEnd?
                moment.utc(compareEnd).add(primaryDataRangeDiff, "d"):
                compareEnd
        }
    ];

    var isSubDayOption = false;

    if(retrievedDashboard.subDay) {
        isSubDayOption = true;
        dateRange[0].endDate = moment.utc();
        dateRange[0].startDate = dateRange[0].endDate.clone();

        switch(retrievedDashboard.subDay) {
            case consts.SUB_DAY.h12:
                dateRange[0].startDate.add(-12, "h");
                break;
            case consts.SUB_DAY.h6:
                dateRange[0].startDate.add(-6, "h");
                break;
            case consts.SUB_DAY.h3:
                dateRange[0].startDate.add(-3, "h");
                break;
            case consts.SUB_DAY.h1:
                dateRange[0].startDate.add(-1, "h");
                break;
            case consts.SUB_DAY.m10:
                dateRange[0].startDate.add(-10, "m");
                break;
        }

        // If compare date range is selected, sync minutes with primary date range
        if (dateRange[1].endDate && dateRange[1].startDate) {
            var primaryStartDate = moment(dateRange[0].startDate);
            var compareStartDate = moment(dateRange[1].startDate);
            var diffInDays = compareStartDate.diff(primaryStartDate, "days");
            dateRange[1].startDate = primaryStartDate.add(diffInDays, "d");
        }
    }

    if(dateRange[1].endDate && dateRange[0].endDate &&
        dateRange[1].startDate && dateRange[0].startDate) {
        var  primaryStart = moment.utc(dateRange[0].startDate);
        var  primaryEnd = moment.utc(dateRange[0].endDate);

        var diffInMinutes = primaryEnd.diff(primaryStart, "minutes");

        dateRange[1].endDate = moment.utc(dateRange[1].startDate).clone().
            add(diffInMinutes, "minutes");
    }

    return {
        dateRange: dateRange,
        isSubDayOption: isSubDayOption
    };
}

/**
 * get tags by widget segments
 *
 * @access  private
 * @param   {object} widget
 * @param   {object} dashboardTags
 * @param   {function} callback
 * @return  {void}
 */
function getWidgetTags(widget, dashboardTags, dashboardSegments, callback) {
    if(!widget.segments || widget.segments.length === 0) {
        //no widget segments
        callback(null, dashboardTags, dashboardSegments);
    } else {
        //find widget tags

        async.waterfall([
            function(cb) {
                tagDAO.getTagsFullHierarchyByEntity(widget, "AnalyzeWidget", null, null, cb);
            },
            function(widgetSegments, cb) {
                getEntityTags(widgetSegments, function(err, widgetTags) {
                    if(err) {
                        cb(err);
                    } else {
                        cb(null, widgetTags, widgetSegments);
                    }
                });
            }
        ], function(err, widgetTags, widgetSegments) {
            if(err) {
                callback(err);
            } else {
                callback(null, widgetTags, widgetSegments);
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * get widget data per widget based on segment tags
 *
 * @access  public
 * @param   {object} request - express request object
 * @param   {object} response - express response object
 * @param   {callback} next - callback
 * @param   {boolean} isDashboard - true if dashboard request
 * @return  {void}
 */
function getWidgetData(widget, dashboard, dashboardTags, dashboardSegments,  isCompared, finalCallback) {

    var dateRangePairs = ["primaryDateRange", "compareDateRange"];
    var dateRangeData = getDateRange(dashboard, widget.widget);
    var isSubDayOption = dateRangeData.isSubDayOption;
    var dateRange = dateRangeData.dateRange;

    if (! isCompared) {
        dateRangePairs = ["primaryDateRange"];
    }

    getWidgetTags(widget.widget, dashboardTags, dashboardSegments, function(findTagsErr, foundTags, segments) {
        if(findTagsErr) {
            finalCallback(findTagsErr);
        } else {
            async.map(dateRangePairs, function(dateRangeType, metricCallback){
                async.waterfall([
                    function(dimensionCallback) {
                        if ((widget.widget.groupDimension === consts.DIMENSIONS.TEAM_MEMBER_WITH_ACCESS) ||
                            (widget.widget.groupDimension === consts.DIMENSIONS.ACCOUNT)) {
                            getUsersAndAccounts(segments, dimensionCallback);
                        } else {
                            dimensionCallback(null,null);
                        }
                    }
                ],function (err, dimensionHelper) {
                    if (err) {
                        metricCallback(err);
                    } else {
                        generateTempoItemsList(isSubDayOption, widget.widget, foundTags, dimensionHelper,
                            dateRangeType, dateRange, metricCallback);
                    }
                });
            }, function(err, pairedTempoItemsPerWidget) {
                if(err) {
                    finalCallback(err);
                } else {
                    var widgetData = {};
                    for (var i = 0; i < dateRangePairs.length; i++) {
                        widgetData[dateRangePairs[i]] = pairedTempoItemsPerWidget[i];
                    }
                    finalCallback(null, widgetData);
                }
            });
        }
    });
}

// --------------------------------------------------------------------------------------------------


function processDashboard(isDashboard, viewerTZOffset, dashboardId, widgetId, socket, finalCallback) {

    dashboardDAO.getDashboardById(dashboardId, null,  function(findErr, retrievedDashboard) {

        if(findErr) {
            utils.dashboardErrorHandler(findErr, socket, finalCallback);
        } else {
            if (retrievedDashboard.widgets.length === 0) {
                utils.dashboardSuccessResponse({}, socket, finalCallback);
            } else {

                tagDAO.getTagsFullHierarchyByEntity(retrievedDashboard, "Dashboard", null, null,
                    function(findTagsErr, retrievedTagBindings) {
                        if(findTagsErr) {
                            utils.dashboardErrorHandler(findTagsErr, socket, finalCallback);
                        } else {
                            var dashboardSegments = retrievedTagBindings;

                            if (isDashboard) {

                                getEntityTags(dashboardSegments, function(dashboardTagsErr, dashboardTags){
                                    if(dashboardTagsErr) {
                                        utils.dashboardErrorHandler(dashboardTagsErr, socket, finalCallback);
                                    } else {
                                        async.map(retrievedDashboard.widgets, function(widget, widgetCallback) {

                                            async.waterfall([
                                                function(callback) {
                                                    getWidgetData(widget, retrievedDashboard,
                                                        dashboardTags, dashboardSegments, true, callback);
                                                }
                                            ], function (err, tempoIQItemsPerSegment) {
                                                if (err) {
                                                    widgetCallback(err);
                                                } else {
                                                    widgeCalculator.calculateData(tempoIQItemsPerSegment,
                                                        retrievedDashboard.isViewerTime, viewerTZOffset, widget,
                                                        dashboardId, socket, widgetCallback);
                                                }
                                            });

                                        }, function(err, widgetDatas) {
                                            if (err) {
                                                utils.dashboardErrorHandler(err, socket, finalCallback);
                                            }
                                            else {
                                                if (finalCallback) {
                                                    //we will send data for all widgets only via rest api
                                                    finalCallback(null, widgetDatas);
                                                }
                                            }

                                        });
                                    }
                                });

                            } else {
                                var retrievedWidgets = _.filter(retrievedDashboard.widgets, function (widgetParams) {
                                    return widgetParams.widget && widgetParams.widget._id.toString() === widgetId;
                                });

                                if (retrievedWidgets.length === 0) {
                                    var error = new Error(consts.SERVER_ERRORS.WIDGET.WIDGET_NOT_EXISTS + widgetId);
                                    error.status = 422;
                                    return utils.dashboardErrorHandler(
                                        error, socket, finalCallback
                                    );
                                } else {

                                    async.waterfall([

                                        function(callback) {
                                            getEntityTags(dashboardSegments, callback);
                                        },
                                        function(dashboardTags, callback) {
                                            getWidgetData(retrievedWidgets[0], retrievedDashboard, dashboardTags,
                                                dashboardSegments, true, callback);
                                        },
                                        function (tempoIQItemsPerSegment,callback) {
                                            widgeCalculator.calculateData(tempoIQItemsPerSegment,
                                                retrievedDashboard.isViewerTime, viewerTZOffset, retrievedWidgets[0],
                                                dashboardId, socket, callback);
                                        }
                                    ], function (err, widgetData) {
                                        if (err) {
                                            utils.dashboardErrorHandler(err, socket, finalCallback);
                                        }
                                        else {
                                            if (finalCallback) {
                                                finalCallback(null, widgetData);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
            }
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * parse dashboard's segments and generates widget data for all dashboard widgets
 *
 * @access  public
 * @param   {object} request - express request object
 * @param   {object} response - express response object
 * @param   {callback} next - callback
 * @param   {boolean} isDashboard - true if dashboard request
 * @return  {void}
 */
function parse(request, response, next, isDashboard) {
    var dashboardId = request.params.dashboardId;
    var widgetId = null;
    if (!isDashboard) {
        widgetId = request.params.widgetId;
    }
    var viewerTZOffset = request.get("ViewerTZOffset");
    processDashboard(isDashboard, viewerTZOffset, dashboardId, widgetId, null, function(err, result) {
        if(err) {
            return next(err);
        } else {
            return utils.successResponse(result, response, next);
        }
    });
}

function processDashboardBySocket(dashboardId, viewerTZOffset, socket) {
    processDashboard(true, viewerTZOffset, dashboardId, null, socket, null);
}

exports.parse = parse;
exports.processDashboardBySocket = processDashboardBySocket;
