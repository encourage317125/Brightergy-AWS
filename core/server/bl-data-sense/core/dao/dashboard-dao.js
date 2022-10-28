"use strict";

var mongoose = require("mongoose"),
    Dashboard = mongoose.model("ds_dashboard"),
    Widget = mongoose.model("ds_widget"),
    async = require("async"),
    _ = require("lodash"),
    utils = require("../../../libs/utils"),
    //log = require("../../../libs/log")(module),
    //config = require("../../../../config/environment"),
    permissionsUtils = require("../../../general/core/user/permissions-utils"),
    widgetDAO = require("./widget-dao"),
    ObjectId = mongoose.Types.ObjectId,
    tagBindingUtils = require("../../../libs/tag-binding-utils"),
    consts = require("../../../libs/consts"),
    tagDAO = require("../../../general/core/dao/tag-dao"),
    cacheHelper = require("../../../libs/cache-helper");


// --------------------------------------------------------------------------------------------------

/**
 * Get Dashboards by params
 *
 * @access  public
 * @param   Params object
 * @param   callback
 * @return  void
 */
function getDashboardsByParams(params, callback) {
    Dashboard.find(params)
        .lean()
        .exec(function (err, findDashboards) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, findDashboards);
            }
        });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get Dashboard by Id
 *
 * @access  public
 * @param   Dashboard Id
 * @param   User object
 * @param   callback
 * @return  void
 */
function getDashboardById(selectedDashboardId, user, finalCallback) {
    if(user && !permissionsUtils.userHaveAccessToAnalyze(user)) {
        var error = new Error(consts.SERVER_ERRORS.DASHBOARD.NOT_ACCESSIBLE_ANALYZE_APP);
        error.status = 422;
        finalCallback(error);
    } else {
        async.waterfall([
            function(callback) {
                Dashboard.findById(selectedDashboardId)
                    .populate("widgets.widget")
                    .populate("widgets.widget.metric")
                    .exec(callback);
            },
            function(findDashboard, callback) {
                if(!findDashboard) {
                    var error = new Error(consts.SERVER_ERRORS.DASHBOARD.DASHBOARD_NOT_EXISTS + selectedDashboardId);
                    error.status = 422;
                    callback(error);
                } else {
                    callback(null, findDashboard);
                }
            },
            function(findDashboard, callback) {
                if (user) {
                    permissionsUtils.userHaveAccessToDashboard(user, findDashboard, function(accessErr, accessResult) {
                        if(accessErr) {
                            callback(accessErr);
                        } else {
                            callback(null, findDashboard, accessResult);
                        }
                    });
                } else {
                    callback(null, findDashboard, "Viewer");
                }
            },
            function(findDashboard, accessResult, callback) {
                if(accessResult) {
                    callback(null, findDashboard);
                } else {
                    var error = new Error(consts.SERVER_ERRORS.DASHBOARD.DASHBOARD_NOT_ACCESSIBLE);
                    error.status = 422;
                    callback(error);
                }
            },
            function(findDashboard, callback) {
                widgetDAO.populateMetrics(findDashboard, callback);
            }
        ], function (err, result) {
            if(err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, result);
            }
        });
    }
}

// -------------------------------------------------------------------------------------

/**
 * Add dashboard asset key
 *
 * @access  public
 * @param   string
 * @param   number
 * @return  array
 */
function createDashboardFolder(savedDashboard, currentUser, callback) {
    //var keyPrefix = config.get("aws:assets:generalassetskeyprefix");
    var awsAssetsKeyPrefix = utils.generateRandomString(12);
    
    getDashboardsByParams({awsAssetsKeyPrefix : awsAssetsKeyPrefix}, function (searchErr, searchResult) {
        if(searchErr) {
            callback(searchErr);
        }
        else {
            if(searchResult.length > 0) {
                awsAssetsKeyPrefix += utils.generateRandomString(4);
            }
            
            savedDashboard.awsAssetsKeyPrefix = awsAssetsKeyPrefix;
            savedDashboard.save(function (saveDashboardErr, updatedDashboard) {
                if (saveDashboardErr) {
                    callback(saveDashboardErr, null);
                } else {
                    getDashboardById(savedDashboard._id, currentUser, callback);
                }
            });
        }
    });
    
}

// --------------------------------------------------------------------------------------------------

/**
 * Create Dashboard
 *
 * @access  public
 * @param   Dashboard object
 * @param   User object
 * @param   callback
 * @return  void
 */
function createDashboard(dashboardObj, currentUser, callback) {
    if(!permissionsUtils.userHaveAccessToAnalyze(currentUser)) {
        var error = new Error(consts.SERVER_ERRORS.DASHBOARD.NOT_ACCESSIBLE_ANALYZE_APP);
        error.status = 422;
        callback(error);
    } 
    else {
        dashboardObj.creator = currentUser._id;
        dashboardObj.creatorRole = currentUser.role;
        
        var thisDashboardObj = new Dashboard(dashboardObj);
        createDashboardFolder(thisDashboardObj, currentUser, function (createErr, dashboardWithFolder) {
            if(createErr) {
                callback(createErr);
            }
            else {
                dashboardWithFolder.save(function (err, savedDashboard) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, savedDashboard);
                    }
                });
            }    
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Save Dashboard
 *
 * @access  public
 * @param   Dashboard object
 * @param   callback
 * @return  void
 */
function saveDashboard(dashboard, callback) {
    dashboard.save(function (saveErr, savedDashboard) {
        if (saveErr) {
            callback(saveErr, null);
        } else {
            callback(null, savedDashboard);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Function saves dashboard and removes cache
 *
 * @access  private
 * @param   {object} dashboard
 * @param   {function} callback
 * @return  void
 */
function saveDashboardAndDeleteCache(dashboard, callback) {

    saveDashboard(dashboard, function(err, savedDashboard) {
        if(err) {
            callback(err);
        } else {
            cacheHelper.deleteSingleAppEntityCache(dashboard._id.toString(), function(cacheErr, cacheResult) {
                if(cacheErr) {
                    callback(cacheErr);
                } else {
                    callback(null, savedDashboard);
                }
            });
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Create or Update Dashboard
 *
 * @access  public
 * @param   Dashboard object
 * @param   User object
 * @param   callback
 * @return  void
 */
function editDashboard(dashboardObj, dashboardId, currentUser, callback) {
    if(!permissionsUtils.userHaveAccessToAnalyze(currentUser)) {
        var error = new Error(consts.SERVER_ERRORS.DASHBOARD.NOT_ACCESSIBLE_ANALYZE_APP);
        error.status = 422;
        callback(error);
    } 
    else {
        getDashboardById(dashboardId, currentUser, function (findErr, findDashboard) {
            if (findErr) {
                callback(findErr, null);
            } else {
                var error;
                if (findDashboard.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP) {
                    error = new Error(consts.SERVER_ERRORS.DASHBOARD.ONLY_BP_CAN_SAVE_DASHBOARD);
                    error.status = 422;
                    callback(error, null);
                } else if(dashboardObj.isPrivate && findDashboard.creator.toString() !== currentUser._id.toString()) {
                    error = new Error(consts.SERVER_ERRORS.DASHBOARD.CAN_NOT_MARK_PRIVATE_DASHBOARD);
                    error.status = 422;
                    callback(error, null);
                } else {
                    var paramsToChange = Object.keys(dashboardObj);

                    paramsToChange.forEach(function (param) {
                        findDashboard[param] = dashboardObj[param];
                    });

                    //saveDashboard(findDashboard, callback);
                    saveDashboardAndDeleteCache(findDashboard, callback);
                }
            }
        });
    }
}

// -------------------------------------------------------------------------------------

/**
 * Add dashboard asset key and save
 *
 * @access  public
 * @param   string
 * @param   number
 * @return  array
 */
function createDashboardFolderAndSave(savedDashboard, callback) {
    var awsAssetsKeyPrefix = utils.generateRandomString(16);
    getDashboardsByParams({awsAssetsKeyPrefix : awsAssetsKeyPrefix}, function (searchErr, searchResult) {
        if(searchErr) {
            callback(searchErr);
        }
        else {
            if(searchResult.length > 0) {
                awsAssetsKeyPrefix += utils.generateRandomString(4);
            }
            savedDashboard.awsAssetsKeyPrefix = awsAssetsKeyPrefix;
            savedDashboard.save(function (saveDashboardErr, updatedDashboard) {
                if (saveDashboardErr) {
                    callback(saveDashboardErr, null);
                } else {
                    callback(null, updatedDashboard);
                }
            });
        }
    });
    
}

// --------------------------------------------------------------------------------------------------

/**
 * Filter Dashboards by collection
 *
 * @access  public
 * @param   array of Dashboard objects
 * @return  collection
 */
function filterDashboardsByCollection(dashboards, collection) {
    var filteredDashboards = _.filter(dashboards, function(dashboard) {
        return dashboard.collections.indexOf(collection) >= 0;
    });

    return filteredDashboards;
}

// --------------------------------------------------------------------------------------------------

/**
 * Group Dashboard objects by collection
 *
 * @access  public
 * @param   array of Dashboard objects
 * @return  array of Dashboard objects grouped by collection
 */
function getDashboardsByCollection(dashboards) {
    var collections  = [];
    for(var i=0; i < dashboards.length; i++) {
        collections = _.union(collections, dashboards[i].collections);
    }

    var result = {};

    for(i=0; i < collections.length; i++) {
        var thisCollection = collections[i];
        result[thisCollection] = filterDashboardsByCollection(dashboards, thisCollection);
    }

    return result;
}

// --------------------------------------------------------------------------------------------------

/**
 * Find Dashboards of user
 *
 * @access  public
 * @param   User object
 * @param   Search string
 * @param   callback
 * @return  void
 */
function getDashboardsByUser(currentUser, findNameMask, finalCallback) {
    var params = {$and: []};

    if(findNameMask) {
        params.$and.push(
            {title : new RegExp(findNameMask, "i")}
        );
    }

    permissionsUtils.getAppObjectByUser(currentUser, Dashboard, consts.APP_ENTITY_TYPE.DASHBOARD, params, 
        function(err, foundDashboards, findUserTags, findObjectTags) {
            if(err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, getDashboardsByCollection(foundDashboards));
            }
        });

}

// --------------------------------------------------------------------------------------------------

/**
 * Validate Dashboard
 *
 * @access  public
 * @param   Dashboard Object
 * @param   callback
 * @return  void
 */
function validate(dashboardObj, callback) {
    var dashboard = new Dashboard(dashboardObj);
    dashboard.validate(function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Remove Dashboard Document and all related Widget Documents
 *
 * @access private
 * @param Dashboard Object
 * @param callback
 * @return void
 */
function removeDashboard(selectedDashboard, callback) {
    var dashbordIdStr = selectedDashboard._id.toString();
    Dashboard.remove({_id: selectedDashboard._id}).exec(function(removeErr, removeResult) {
        if(removeErr) {
            callback(removeErr, null);
        } else {
            async.each(selectedDashboard.widgets, function(widgetObj, cb) {
                console.log(widgetObj.widget._id);
                Widget.remove({_id: widgetObj.widget._id}).exec(function(removeErr, removeResult) {
                    if (removeErr) {
                        console.log(removeErr);
                    } else {
                        console.log("Widget successfully deleted!!!");
                    }
                    cb(null);
                });
            }, function() {
                //callback(null, consts.OK);
                cacheHelper.deleteSingleAppEntityCache(dashbordIdStr, callback);
            });
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Remove Segments of Dashboard
 *
 * @access  public
 * @param   User object
 * @param   Dashboard object
 * @param   array of Segments object
 * @param   callback
 * @return  void
 */
function removeSegments(currentUser, dashboard, segments, callback) {

    //saveDashboard(dashboard, callback);

    tagBindingUtils.unbindTags("Dashboard", dashboard._id, segments, function(error, result) {
        if (error) {
            callback(error, null);
        }
        else {
            segments.forEach(function(segmentToRemove) {
                var i= 0;
                dashboard.segments.forEach(function(dashboardSegment) {
                    if (segmentToRemove &&
                        segmentToRemove.id &&
                        dashboardSegment.id.toString() === segmentToRemove.id.toString()) {
                        dashboard.segments.splice(i, 1);
                    }
                    i++;
                });
            });
            saveDashboardAndDeleteCache(dashboard, callback);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Delete Dashboard
 *
 * @access  public
 * @param   Dashboard Id
 * @param   User object
 * @param   callback
 * @return  void
 */
function deleteDashboardById(selectedDashboardId, currentUser, callback) {
    getDashboardById(selectedDashboardId, currentUser, function(findErr, findDashboard) {
        if(findErr) {
            callback(findErr, null);
        } else {

            var bpRoleCheck = findDashboard.creatorRole === consts.USER_ROLES.BP && 
                currentUser.role !== consts.USER_ROLES.BP;
            var adminRoleCheck = findDashboard.creatorRole === consts.USER_ROLES.Admin && 
                currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin;
            var tmRoleCheck = findDashboard.creator.toString() !== currentUser._id.toString() && 
                currentUser.role === consts.USER_ROLES.TM;

            if(bpRoleCheck || adminRoleCheck || tmRoleCheck) {
                var error = new Error(consts.SERVER_ERRORS.DASHBOARD.CAN_NOT_DELETE_DASHBOARD);
                error.status = 422;
                callback(error, null);
            } else {
                if(findDashboard.segments && findDashboard.segments.length > 0) {
                    removeSegments(currentUser, findDashboard, findDashboard.segments, function(err, result) {
                        if(err) {
                            callback(err);
                        } else {
                            removeDashboard(findDashboard, callback);
                        }
                    });
                } else {
                    removeDashboard(findDashboard, callback);
                }
            }
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get metrics by widget type
 *
 * @access  private
 * @param   {array} foundMetrics
 * @return  {object}
 */
function filterMetricsByWidgets(foundMetrics) {
    var returnObj = {};

    var metrics = _.map(foundMetrics, function(metric) {
        return {
            _id: metric._id,
            name: metric.name
        };
    });

    var prefix = "Boilerplate ";
    var boilerplateCurrentPower = "Boilerplate Current Power";
    var boilerplateCO2Avoided = "Boilerplate CO2 Avoided";
    var boilerplateReimbursement = "Boilerplate Reimbursement";

    var boilerplatewidgets = _.map(consts.ALLOWED_BOILERPLATE_WIDGET_TYPES, function(type) {
        return prefix + type;
    });

    var commonWidgets = _.filter(consts.ALLOWED_DATA_SENSE_WIDGET_TYPES, function(type) {
        return type !== consts.DATA_SENSE_WIDGET_TYPES.Boilerplate;
    });

    var widgetTypes = _.union(commonWidgets, boilerplatewidgets);

    var restrictedTypes = [consts.DATA_SENSE_WIDGET_TYPES.Equivalencies,
        boilerplateCurrentPower, boilerplateCO2Avoided, boilerplateReimbursement];

    widgetTypes.forEach(function(widgetType) {
        if(restrictedTypes.indexOf(widgetType) < 0) {
            returnObj[widgetType] = metrics;
        }
    });

    returnObj[boilerplateCurrentPower] = _.filter(metrics, function(metric) {
        return metric.name === consts.METRIC_NAMES.Watts;
    });

    returnObj[boilerplateCO2Avoided] = _.filter(metrics, function(metric) {
        return metric.name === consts.METRIC_NAMES.kWh;
    });

    returnObj[consts.DATA_SENSE_WIDGET_TYPES.Equivalencies] = _.filter(metrics, function(metric) {
        return metric.name === consts.METRIC_NAMES.kWh;
    });

    returnObj[boilerplateReimbursement] = _.filter(metrics, function(metric) {
        return metric.name === consts.METRIC_NAMES.Reimbursement;
    });

    metrics = null;

    return returnObj;
}

// --------------------------------------------------------------------------------------------------

/**
 * Get Metrics of Dashboard
 *
 * @access  public
 * @param   Dashboard Id
 * @param   User Object
 * @param   callback
 * @return  void
 */
function getAvailableMetrics(selectedDashboardId, currentUser, callback) {
    tagDAO.getMetricsFromTags("Dashboard", selectedDashboardId.toString(), null, null, function(error, foundMetrics) {
        if(error) {
            callback(error);
        } else {
            var metricsByWidgets = filterMetricsByWidgets(foundMetrics);
            callback(null, metricsByWidgets);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Create Segments of Dashboard
 *
 * @access  public
 * @param   User object
 * @param   Dashboard object
 * @param   array of Segments object
 * @param   callback
 * @return  void
 */
function createSegments(currentUser, dashboard, segments, callback) {

    if (!dashboard.segments) {
        dashboard.segments = [];
    }

    segments.forEach(function(newSegment) {
        var i= 0, stop = false;
        dashboard.segments.forEach(function(dashboardSegment) {
            if (!stop && newSegment && dashboardSegment.name === newSegment.name) {
                dashboard.segments.splice(i, 1);
                stop = true;
            }
            i++;
        });
        newSegment.id = new ObjectId();
        dashboard.segments.push(newSegment);
    });

    tagBindingUtils.bindTags("Dashboard", dashboard._id, segments, function(error, result) {
         if (error) {
             callback(error, null);
         }
        else {
             saveDashboardAndDeleteCache(dashboard, callback);
         }
    });

}

// --------------------------------------------------------------------------------------------------

/**
 * Create Segments of Dashboard
 *
 * @access  public
 * @param   User object
 * @param   Dashboard object
 * @param   array of Segments object
 * @param   callback
 * @return  void
 */
function updateSegments(currentUser, dashboard, segments, callback) {

    segments.forEach(function(newSegment) {
        var i= 0, stop = false;
        dashboard.segments.forEach(function(dashboardSegment) {
            if (!stop && newSegment && newSegment.id && dashboardSegment.id.toString() === newSegment.id.toString()) {
                dashboard.segments.splice(i, 1);
                stop = true;
            }
            i++;
        });
        dashboard.segments.push(newSegment);
    });
    tagBindingUtils.bindTags("Dashboard", dashboard._id, segments, function(error, result) {
         if (error) {
             callback(error, null);
         }
        else {
             saveDashboardAndDeleteCache(dashboard, callback);
         }
    });
}

// ------------------------------------------------------------------------

function createdDefaultDashboardsSegments(savedDashboard, createUser, callback) {
    var userId = createUser._id.toString();
    tagDAO.getTagsByEntityIds("User", [userId], consts.TAG_TYPE.Facility, null, function(tagsErr, foundTags) {
        if(tagsErr) {
            callback(tagsErr);
        } else {

            var userFacilities = foundTags[userId];
            if (userFacilities.length > 0) {
                var segments = [];
                userFacilities.forEach(function (facility) {
                    segments.push({
                        "name": facility.name,
                        "tagBindings": [{
                            "tagType": facility.tagType,
                            "id": facility._id.toString()
                        }]
                    });
                });

                createSegments(createUser, savedDashboard, segments, function (saveSegmErr, dashboard) {
                    if (saveSegmErr) {
                        callback(saveSegmErr);
                    } else {
                        callback(null, createUser);
                    }
                });

            } else {
                callback(null, createUser);
            }
        }

    });
}

// ------------------------------------------------------------------------


/**
 * Create a default dashboard in dashboard collection
 *
 * @access  public
 * @param   currentUser
 * @param   callback
 * @return  object
 */
function createNewDefaultDashboard(createUser, dashboard, finalCallback) {
    var defaultDashboardObj = {};
    var dashboardWidgets = [];

    /*defaultDashboardObj.title = dashboard.title;
    defaultDashboardObj.startDate = dashboard.startDate;
    defaultDashboardObj.endDate = dashboard.endDate;
    defaultDashboardObj.creator = createUser._id;
    defaultDashboardObj.creatorRole = createUser.role;
    defaultDashboardObj.default = false;
    defaultDashboardObj.isPrivate = true;
    defaultDashboardObj.segments = [];
    defaultDashboardObj.compareEndDate = dashboard.compareEndDate;
    defaultDashboardObj.compareStartDate = dashboard.compareStartDate;
    defaultDashboardObj.widgets = [];
    defaultDashboardObj.awsAssetsKeyPrefix = dashboard.awsAssetsKeyPrefix;
    defaultDashboardObj.collections = [];
    defaultDashboardObj.collections.push("Default " + createUser.name + " Collection");
    defaultDashboardObj.layout = dashboard.layout;
    */

    defaultDashboardObj = _.cloneDeep(dashboard.toObject());
    defaultDashboardObj.creator = createUser._id;
    defaultDashboardObj.creatorRole = createUser.role;
    defaultDashboardObj.collections = [];
    defaultDashboardObj.collections.push("Default " + createUser.name + " Collection");
    defaultDashboardObj.widgets = [];
    defaultDashboardObj.default = false;
    defaultDashboardObj.isPrivate = true;
    defaultDashboardObj.segments = [];
    defaultDashboardObj.awsAssetsKeyPrefix = utils.generateRandomString(16);

    defaultDashboardObj = new Dashboard(defaultDashboardObj);
    defaultDashboardObj._id = mongoose.Types.ObjectId();

    async.each(dashboard.widgets, function(dashboardWidget, callback) {
        var widgetObj = {};
        var widget = dashboardWidget.widget.toObject();

        widgetObj = _.cloneDeep(widget);

        widgetObj.creator = createUser._id;
        widgetObj.creatorRole = createUser.role;
        widgetObj.metric = widget.metric;
        widgetObj.compareMetric = widget.compareMetric;

        widgetObj = new Widget(widgetObj);
        widgetObj._id = mongoose.Types.ObjectId();

        /*widgetObj.type = widget.type;
        widgetObj.title = widget.title;
        widgetObj.metric = widget.metric;
        widgetObj.creator = createUser._id;
        widgetObj.creatorRole = createUser.role;
        widgetObj.compareMetric = widget.compareMetric;
        widgetObj.greenhousePounds = widget.greenhousePounds;
        widgetObj.co2Pounds = widget.co2Pounds;
        widgetObj.greenhouseKilograms = widget.greenhouseKilograms;
        widgetObj.co2Kilograms = widget.co2Kilograms;
        widgetObj.equivType = widget.equivType;
        widgetObj.orientation = widget.orientation;
        widgetObj.showUpTo = widget.showUpTo;
        widgetObj.imageUrl = widget.imageUrl;
        widgetObj.drillDown = widget.drillDown;
        widgetObj.displayedColumns = widget.displayedColumns;
        widgetObj.rowsPerTable = widget.rowsPerTable;
        widgetObj.pivotDimension = widget.pivotDimension;
        widgetObj.groupDimension = widget.groupDimension;
        widgetObj.titleShow = widget.titleShow;
        */

        widgetObj.save(function (err, savedWidget) {
            if (err) {
                console.log("Error" + err);
                callback(err, null);
            } else {
                var newWidget = {"widget" : savedWidget._id};
                dashboardWidgets.push(newWidget);
                callback(null, savedWidget);
            }
        });
    }, function(err){
        if(err) {
            finalCallback(err, null);
        }
        else {
            defaultDashboardObj.widgets =  dashboardWidgets;
            console.log("DEFAULT DASHBOARD CREATING...");
            defaultDashboardObj.save(function (err, savedDashboard) {
                if (err) {
                    console.log("Error" + err);
                    finalCallback(err, null);
                } else {
                    createdDefaultDashboardsSegments(savedDashboard, createUser, finalCallback);
                    //var dashboardId = new Array();
                    //dashboardId.push(savedDashboard._id);
                    //finalCallback(null, createUser);
                }
            });
        }
    });

    //delete defaultDashboardObj.children;//don't update  relationships
    //delete defaultDashboardObj.parents;
}

// ------------------------------------------------------------------------

/**
 * Create a default dashboards in user collection
 *
 * @access  public
 * @param   currentUser
 * @param   callback
 * @return  object
 */
function createDefaultDashboards(createUser, finalCallback) {
    async.waterfall([
        function(wCallback) {
            // in other way, find can be find({collection: 'default'}) or find({collection: {$in: ['default']}})
            Dashboard.find({"default": true, "creatorRole":"BP"})
                .populate("widgets.widget")
                .lean()
                .sort("-__v")
                .exec(wCallback);
        },
        function(findDashboards, wCallback) {
            async.each(findDashboards, function(dashboard, eCallback) {
                createNewDefaultDashboard(createUser,dashboard,eCallback);
            }, function(err){
                if(err) {
                    wCallback("Error occurred", null);
                }
                else {
                    wCallback(null, createUser);
                }
            });
        
        }
    ], function (err) {
        if(err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, createUser);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get All Dashboards
 *
 * @access  public
 * @param   callback
 * @return  void
 */
function getDashboardsAll(callback) {
    Dashboard.find().lean().exec(function (err, findDashboards) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, findDashboards);
        }
    });
}

// --------------------------------------------------------------------------------------------------
exports.createDashboard = createDashboard;
exports.editDashboard = editDashboard;
exports.getDashboardById = getDashboardById;
exports.deleteDashboardById = deleteDashboardById;
exports.getDashboardsByUser = getDashboardsByUser;
exports.getDashboardsByCollection = getDashboardsByCollection;
exports.getAvailableMetrics = getAvailableMetrics;
exports.getDashboardsByParams = getDashboardsByParams;
exports.saveDashboard = saveDashboard;
exports.createSegments = createSegments;
exports.updateSegments = updateSegments;
exports.removeSegments = removeSegments;
exports.validate = validate;
exports.createDashboardFolderAndSave = createDashboardFolderAndSave;
exports.createDefaultDashboards = createDefaultDashboards;
exports.getDashboardsAll = getDashboardsAll;
