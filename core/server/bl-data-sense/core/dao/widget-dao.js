"use strict";

var mongoose = require("mongoose"),
    Widget = mongoose.model("ds_widget"),
    Tag = mongoose.model("tag"),
    async = require("async"),
    //log = require("../../../libs/log")(module),
    //utils = require("../../../libs/utils"),
    //moment = require("moment"),
    dashboardDAO = require("./dashboard-dao"),
    permissionsUtils = require("../../../general/core/user/permissions-utils"),
    consts = require("../../../libs/consts"),
    cacheHelper = require("../../../libs/cache-helper"),
    tagBindingUtils = require("../../../libs/tag-binding-utils"),
    ObjectId = mongoose.Types.ObjectId;

function getWidgetsByIds(widgetIds, currentUser, callback) {
    if(currentUser && !permissionsUtils.userHaveAccessToAnalyze(currentUser)) {
        var error = new Error(consts.SERVER_ERRORS.DASHBOARD.NOT_ACCESSIBLE_ANALYZE_APP);
        error.status = 422;
        callback(error);
    } else {
        Widget.find({_id: {$in: widgetIds}})
            .populate("metric")
            .populate("compareMetric")
            .lean()
            .exec(function (err, findWidgets) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, findWidgets);
            }
        });
    }
}

function getWidgetById(selectedWidgetId, user, callback) {
    if(user && !permissionsUtils.userHaveAccessToAnalyze(user)) {
        var error = new Error(consts.SERVER_ERRORS.DASHBOARD.NOT_ACCESSIBLE_ANALYZE_APP);
        error.status = 422;
        callback(error);
    } else {
        Widget.findById(selectedWidgetId)
            .populate("metric")
            .populate("compareMetric")
            .exec(function (err, findWidget) {
            if(err) {
                callback(err, null);
            } else {
                if(findWidget) {
                    callback(null, findWidget);
                } else {
                    var error = new Error(consts.SERVER_ERRORS.WIDGET.WIDGET_NOT_EXISTS + selectedWidgetId);
                    error.status = 422;
                    callback(error, null);
                }
            }
        });
    }
}

function deleteWidgetById(dashboardId, selectedWidgetId, currentUser, finalCallback) {
    async.waterfall([
        function (callback) {
            dashboardDAO.getDashboardById(dashboardId, currentUser, callback);
        },
        function (findDashboard, callback) {
            var index = -1;
            for(var i=0; i < findDashboard.widgets.length; i++) {
                if(findDashboard.widgets[i].widget._id.toString() === selectedWidgetId) {
                    index = i;
                    break;
                }
            }
            if(index < 0) {
                var error = new Error(consts.SERVER_ERRORS.WIDGET.WIDGET_NOT_ADDED_TO_DASHBOARD);
                error.status = 422;
                callback(error);
            } else {
                findDashboard.widgets.splice(index, 1);
                dashboardDAO.saveDashboard(findDashboard, callback);
            }
        },
        function (savedDashboard, callback) {
            getWidgetById(selectedWidgetId, currentUser, function (findWidgetErr, findWidget) {
                if(findWidgetErr) {
                    callback(findWidgetErr, null);
                } else {
                    var widgetId = findWidget._id.toString();
                    var dashId = savedDashboard._id.toString();
                    Widget.remove({_id: findWidget._id}).exec(function(deleteErr, deleteResult) {
                        if(deleteErr) {
                            callback(deleteErr, null);
                        } else {
                            cacheHelper.deleteAppEntityWidgetCache(dashId, widgetId, callback);
                        }
                    });
                }
            });
        }
    ], function (err, deleteResult) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, deleteResult);
        }
    });
}

function createWidget(dashboardId, widgetObj, user, callback) {
    if (!permissionsUtils.userHaveAccessToAnalyze(user)) {
        var error = new Error(consts.SERVER_ERRORS.DASHBOARD.NOT_ACCESSIBLE_ANALYZE_APP);
        error.status = 422;
        callback(error);
    } else {

        if (widgetObj.metric && widgetObj.metric._id) {
            widgetObj.metric = widgetObj.metric._id;
        }
        if (widgetObj.compareMetric && widgetObj.compareMetric._id) {
            widgetObj.compareMetric = widgetObj.compareMetric._id;
        }

        async.waterfall([
            function (cb) {
                dashboardDAO.getDashboardById(dashboardId, user, cb);
            },
            function (dashboard, cb) {
                widgetObj.creator = user._id;
                widgetObj.creatorRole = user.role;
                var thisWidgetObjModel = new Widget(widgetObj);
                thisWidgetObjModel.save(function (err, savedWidget) {
                    if (err) {
                        cb(err, null);
                    } else {
                        //callback(null, savedWidget);
                        cb(null, dashboard, savedWidget);
                    }
                });
            },
            function (dashboard, savedWidget, cb) {
                dashboard.widgets.push({
                    widget: savedWidget._id
                });

                dashboardDAO.saveDashboard(dashboard, function (saveErr, savedDashboard) {
                    if (saveErr) {

                        //need remove widget
                        Widget.remove({_id: savedWidget._id}).exec(function (deleteErr, deleteResult) {
                            if (deleteErr) {
                                cb(deleteErr, null);
                            } else {
                                cb(saveErr);
                            }
                        });
                    } else {
                        cb(null, savedWidget);
                    }
                });
            },
            function (savedWidget, cb) {
                getWidgetById(savedWidget._id, user, cb);
            }
        ], function (err, result) {
            if (err) {
                callback(null, err);
            } else {
                callback(null, result);
            }
        });
    }
}

function updateWidget(dashboardId, widgetObj, widgetId, user, callback) {
    if(!permissionsUtils.userHaveAccessToAnalyze(user)) {
        var error = new Error(consts.SERVER_ERRORS.DASHBOARD.NOT_ACCESSIBLE_ANALYZE_APP);
        error.status = 422;
        callback(error);
    } else {

        if (widgetObj.metric && widgetObj.metric._id) {
            widgetObj.metric = widgetObj.metric._id;
        }
        if (widgetObj.compareMetric && widgetObj.compareMetric._id) {
            widgetObj.compareMetric = widgetObj.compareMetric._id;
        }

        async.waterfall([
            function (cb) {
                getWidgetById(widgetId, user, cb);
            },
            function(foundWidget, cb) {
                var paramsToChange = Object.keys(widgetObj);

                paramsToChange.forEach(function (param) {
                    foundWidget[param] = widgetObj[param];
                });

                foundWidget.save(cb);
            },
            function(savedWidget, affected, cb) {
                cacheHelper.deleteAppEntityWidgetCache(dashboardId, savedWidget._id.toString(),
                    function(cacheErr, cacheResult) {
                    if(cacheErr) {
                        cb(cacheErr);
                    } else {
                        cb(null, savedWidget);
                    }
                });

            }
        ], function (err, savedWidget) {
            if(err) {
                callback(err);
            } else {
                getWidgetById(savedWidget._id, user, callback);
            }
        });
    }
}

function populateMetrics(dashboard, finalCallback) {
    async.waterfall([
        function(callback){
            Tag.populate(dashboard, {
                path: "widgets.widget.metric",
                model: "tag"
            }, callback);
        },
        function(populatedWidgets, callback){
            Tag.populate(dashboard, {
                path: "widgets.widget.compareMetric",
                model: "tag"
            }, callback);
        },
    ], function (err, populatedDashboard) {
        if(err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, populatedDashboard);
        }
    });
}

function getWidgetsByParams(params, finalCallback) {
    Widget.find(params, function (err, result) {
        if(err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, result);
        }
    });
}

/**
 * Function saves widget and removes cache
 *
 * @access  private
 * @param   {object} dashboard
 * @param   {object} widget
 * @param   {function} callback
 * @return  void
 */
function saveWidgetAndDeleteCache(dashboard, widget, callback) {

    widget.save(function(err, savedWidget) {
        if(err) {
            callback(err);
        } else {
            cacheHelper.deleteAppEntityWidgetCache(dashboard._id.toString(), savedWidget._id.toString(),
                function(cacheErr, cacheResult) {
                if(cacheErr) {
                    callback(cacheErr);
                } else {
                    callback(null, savedWidget);
                }
            });
        }
    });
}

/**
 * Create Segments of Dashboard
 *
 * @access  public
 * @param   currentUser object
 * @param   dashboard object
 * @param   widget object
 * @param   segments array of Segments object
 * @param   callback
 * @return  void
 */
function createSegments(currentUser, dashboard, widget, segments, callback) {

    if (!widget.segments) {
        widget.segments = [];
    }

    segments.forEach(function(newSegment) {
        var i= 0, stop = false;
        widget.segments.forEach(function(widgetSegment) {
            if (!stop && newSegment && widgetSegment.name === newSegment.name) {
                widget.segments.splice(i, 1);
                stop = true;
            }
            i++;
        });
        newSegment.id = new ObjectId();
        widget.segments.push(newSegment);
    });

    tagBindingUtils.bindTags("AnalyzeWidget", widget._id, segments, function(error, result) {
        if (error) {
            callback(error, null);
        }
        else {
            saveWidgetAndDeleteCache(dashboard, widget, callback);
        }
    });

}

// --------------------------------------------------------------------------------------------------

/**
 * Create Segments of widget
 *
 * @access  public
 * @param   currentUser object
 * @param   dashboard object
 * @param   widget object
 * @param   segments array of Segments object
 * @param   callback
 * @return  void
 */
function updateSegments(currentUser, dashboard, widget, segments, callback) {

    segments.forEach(function(newSegment) {
        var i= 0, stop = false;
        widget.segments.forEach(function(dashboardSegment) {
            if (!stop && newSegment && newSegment.id && dashboardSegment.id.toString() === newSegment.id.toString()) {
                widget.segments.splice(i, 1);
                stop = true;
            }
            i++;
        });
        widget.segments.push(newSegment);
    });
    tagBindingUtils.bindTags("AnalyzeWidget", widget._id, segments, function(error, result) {
        if (error) {
            callback(error, null);
        }
        else {
            saveWidgetAndDeleteCache(dashboard, widget, callback);
        }
    });
}

/**
 * Remove Segments of widget
 *
 * @access  public
 * @param   currentUser object
 * @param   dashboard object
 * @param   widget object
 * @param   segments array of Segments object
 * @param   callback
 * @return  void
 */
function removeSegments(currentUser, dashboard, widget, segments, callback) {

    //saveDashboard(dashboard, callback);

    tagBindingUtils.unbindTags("AnalyzeWidget", widget._id, segments, function(error, result) {
        if (error) {
            callback(error, null);
        }
        else {
            segments.forEach(function(segmentToRemove) {
                var i= 0;
                widget.segments.forEach(function(widgetSegment) {
                    if (segmentToRemove &&
                        segmentToRemove.id &&
                        widgetSegment.id.toString() === segmentToRemove.id.toString()) {
                        widget.segments.splice(i, 1);
                    }
                    i++;
                });
            });
            saveWidgetAndDeleteCache(dashboard, widget, callback);
        }
    });
}

exports.populateMetrics = populateMetrics;
exports.deleteWidgetById = deleteWidgetById;
exports.getWidgetById = getWidgetById;
exports.createWidget = createWidget;
exports.updateWidget = updateWidget;
exports.getWidgetsByIds = getWidgetsByIds;
exports.getWidgetsByParams = getWidgetsByParams;
exports.createSegments = createSegments;
exports.updateSegments = updateSegments;
exports.removeSegments = removeSegments;