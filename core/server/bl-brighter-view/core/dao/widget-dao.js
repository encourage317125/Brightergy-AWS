"use strict";

var mongoose = require("mongoose"),
    Widget = mongoose.model("bv_widget"),
    utils = require("../../../libs/utils"),
    moment = require("moment"),
    async = require("async"),
    presentationDAO = require("./presentation-dao"),
    permissionsUtils = require("../../../general/core/user/permissions-utils"),
    consts = require("../../../libs/consts"),
    cacheHelper = require("../../../libs/cache-helper");

function getWidgetsByPresentationId(selectedPresentationId, currentUser, callback) {
    if(currentUser && !permissionsUtils.userHaveAccessToPresent(currentUser)) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.NOT_ACCESSIBLE_PRESENT_APP);
        error.status = 422;
        callback(error);
    } else {
        Widget.find({presentation: selectedPresentationId}).populate("presentation")
            .lean()
            .sort("parameters.startDate 1").exec(function (err, widgets) {
            if (err) {
                callback(err, null);
            } else {
                /*if (widgets.length > 0) {
                    presentationDAO.getPresentationById(selectedPresentationId,
                    currentUser, function(findPresentationErr, findPresentation) {
                        if(findPresentationErr) {
                            callback(findPresentationErr, null);
                        } else {
                            for(var i=0; i< widgets.length; i++) {
                                widgets[i].presentation = findPresentation;
                            }
                            callback(null, widgets);

                        }
                    })
                } else {
                    callback(null, widgets);
                }*/
                callback(null, widgets);
            }
        });
    }
}

function getWidgetById(selectedWidgetId, user, callback) {
    if(user && !permissionsUtils.userHaveAccessToPresent(user)) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.NOT_ACCESSIBLE_PRESENT_APP);
        error.status = 422;
        callback(error);
    } else {
        Widget.find({_id: selectedWidgetId}).populate("presentation")
            .sort("parameters.startDate 1").exec(function (err, findWidgets) {
            if(err) {
                callback(err, null);
            } else {
                if(findWidgets && findWidgets.length > 0) {
                    /*if (user && !permissionsUtils.userHaveAccessToPresentation(user, findWidgets[0].presentation)) {
                        callback(new Error(consts.WIDGETS_NOT_ACCESSIBLE))
                    }  else {
                        callback(null, findWidgets[0]);
                    }*/
                    presentationDAO.getPresentationById(findWidgets[0].presentation._id,
                        user, function(findPresentationErr, findPresentation) {
                        if(findPresentationErr) {
                            callback(findPresentationErr, null);
                        } else {
                            callback(null, findWidgets[0]);
                        }
                    });
                } else {
                    var error = new Error(consts.SERVER_ERRORS.WIDGET.WIDGET_NOT_EXISTS + selectedWidgetId);
                    error.status = 422;
                    callback(error, null);
                }
            }
        });
    }
}

function deleteWidgetById(selectedWidgetId, currentUser, callback) {
    getWidgetById(selectedWidgetId, currentUser, function (findWidgetErr, findWidget) {
        if(findWidgetErr) {
            callback(findWidgetErr, null);
        } else {
            Widget.remove({_id: findWidget._id}).exec(function(deleteErr, deleteResult) {
                if(deleteErr) {
                    callback(deleteErr, null);
                } else {
                    //callback(null, consts.OK);
                    cacheHelper.deleteAppEntityWidgetCache(findWidget.presentation._id.toString(),
                        findWidget._id.toString(), callback);
                }
            });
        }
    });
}

function batchInsert(widgets, callback) {
    async.each(widgets, function (widget, widgetInsertCallback) {
        widget.save(function (createErr, createdWidget) {
            if(createErr) {
                widgetInsertCallback(createErr, null);
            } else {
                widgetInsertCallback(null, createdWidget);
            }
        });    

    }, function (widgetsError, widgetsResult) {
        if(widgetsError) {
            callback(widgetsError, null);
        } else {
            callback(null, widgetsResult);
        }
    });
}

function createWidget(widgetObj, user, callback) {
    if(!permissionsUtils.userHaveAccessToPresent(user)) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.NOT_ACCESSIBLE_PRESENT_APP);
        error.status = 422;
        callback(error);
    } else {

        if (widgetObj.parameters && widgetObj.parameters.startDate &&
            widgetObj.parameters.duration && widgetObj.presentation.parameters.startDate) {
            var presentationStartTime = widgetObj.presentation.parameters.startDate;
            console.log("qwerty1:" + presentationStartTime);
            if (presentationStartTime) {

                var arr = widgetObj.parameters.startDate.split(":");
                console.log(arr);
                var min = 0;
                var sec = 0;
                if (arr.length === 2) {
                    min = arr[0];
                    sec = arr[1];
                }

                widgetObj.parameters.endDate = moment.utc(presentationStartTime).add(1, "hours").add(min, "minutes")
                    .add(sec, "seconds").add(widgetObj.parameters.duration, "seconds").toISOString();

                console.log("endDate: " + widgetObj.parameters.endDate);
            }
        }

        if (widgetObj.presentation) {
            widgetObj.presentation = widgetObj.presentation._id;
        }

        console.log(widgetObj);

        var thisWidgetObjModel = new Widget(widgetObj);
        thisWidgetObjModel.save(function (err, savedWidget) {
            if (err) {
                callback(err, null);
            } else {
                //callback(null, savedWidget);
                getWidgetById(savedWidget._id, user, callback);
            }
        });
    }
}

function updateWidget(widgetObj, widgetId, user, callback) {
    if(!permissionsUtils.userHaveAccessToPresent(user)) {
        var error = new Error(consts.SERVER_ERRORS.PRESENTATION.NOT_ACCESSIBLE_PRESENT_APP);
        error.status = 422;
        callback(error);
    } else {

        if (widgetObj.parameters && widgetObj.parameters.startDate && 
            widgetObj.parameters.duration && widgetObj.presentation.parameters.startDate) {
            var presentationStartTime = widgetObj.presentation.parameters.startDate;
            console.log("qwerty1:" + presentationStartTime);
            if (presentationStartTime) {

                var arr = widgetObj.parameters.startDate.split(":");
                console.log(arr);
                var min = 0;
                var sec = 0;
                if (arr.length === 2) {
                    min = arr[0];
                    sec = arr[1];
                }

                widgetObj.parameters.endDate = moment.utc(presentationStartTime).add(1, "hours")
                .add(min, "minutes").add(sec, "seconds").add(widgetObj.parameters.duration, "seconds").toISOString();

                console.log("endDate: " + widgetObj.parameters.endDate);
            }
        }

        async.waterfall([
            function(cb) {
                getWidgetById(widgetId, user, cb);
            },
            function(foundWidget, cb) {
                utils.cloneFieldsToMongooseModel(widgetObj, foundWidget);
                foundWidget.save(cb);
            },
            function(savedWidget, affected, cb) {
                cacheHelper.deleteAppEntityWidgetCache(savedWidget.presentation._id.toString(),
                    savedWidget._id.toString(), function (cacheErr, cacheResult) {
                        if (cacheErr) {
                            cb(cacheErr);
                        } else {
                            cb(null, savedWidget);
                        }

                    });
            }

        ], function(err, res) {
            if(err) {
                callback(err);
            } else {
                callback(null, res);
            }
        });

    }
}

function validate(widgetObj, callback) {
    var widget = new Widget(widgetObj);
    widget.validate(function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

exports.validate = validate;
exports.batchInsert = batchInsert;
exports.deleteWidgetById = deleteWidgetById;
exports.getWidgetById = getWidgetById;
exports.createWidget = createWidget;
exports.updateWidget = updateWidget;
exports.getWidgetsByPresentationId = getWidgetsByPresentationId;