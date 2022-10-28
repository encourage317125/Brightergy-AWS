"use strict";

var moment = require("moment"),
    widgetDAO = require("./dao/widget-dao"),
    presentationDAO = require("./dao/presentation-dao");

function getTimeLineDate(thisDate) {
    if(!thisDate) {
        return null;
    } else {
        var sep = ",";
        var line = thisDate.year() + sep + (thisDate.month() + 1) + sep + thisDate.date() +
            sep + thisDate.hours() + sep + thisDate.minutes() + sep + thisDate.seconds();
        return line;
    }
}

function getTimeline(presentationId, callback) {
    presentationDAO.getPresentationById(presentationId, null, function (presentationErr, findPresentation) {
        if (presentationErr) {
            callback(presentationErr, null);
        } else {
            //get widgets
            widgetDAO.getWidgetsByPresentationId(presentationId, null, function (widgetErr, widgets) {
                if (widgetErr) {
                    callback(widgetErr, null);
                } else {
                    //let"s dance

                    var timelineDTO = {
                        timeline: {
                            headline: findPresentation.name,
                            text: findPresentation.name,
                            type: "default",
                            startDate: getTimeLineDate(moment.utc(findPresentation.parameters.startDate)),
                            date: []
                        }
                    };

                    for(var i = 0;i < widgets.length; i++) {

                        var fullStartDate = null;

                        if(widgets[i].parameters.startDate) {
                            var arr = widgets[i].parameters.startDate.split(":");
                            if(arr.length === 2) {
                                var min = parseInt(arr[0]);
                                var sec = parseInt(arr[1]);

                                fullStartDate = moment.utc(findPresentation.parameters.startDate)
                                    .add(1, "hours").add(min, "minutes").add(sec, "seconds");
                            }
                        }

                        console.log("end date: "+ moment.utc(widgets[i].parameters.endDate).toISOString());

                        var timelineItemDTO = {
                            startDate: getTimeLineDate(fullStartDate),
                            endDate: getTimeLineDate(moment.utc(widgets[i].parameters.endDate)),
                            widgetId: widgets[i]._id,
                            availableWidgetId: widgets[i].availableWidgetId,
                            headline: widgets[i].name,
                            icon: widgets[i].icon,
                            rowPosition: widgets[i].parameters.rowPosition,
                            colPosition: widgets[i].parameters.colPosition,
                            backgroundColor: widgets[i].parameters.primaryColor.color,
                            timelineRowPosition: widgets[i].parameters.timelineRowPosition,
                            previousTimelineRowPosition : widgets[i].parameters.previousTimelineRowPosition,
                            resizedOnTimeline : widgets[i].parameters.resizedOnTimeline
                        };

                        timelineDTO.timeline.date.push(timelineItemDTO);
                    }

                    callback(null, timelineDTO);
                }
            });
        }
    });
}

exports.getTimeline = getTimeline;