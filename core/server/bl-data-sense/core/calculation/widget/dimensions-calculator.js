"use strict";

var //log = require("../../../../libs/log")(module),
    _ = require("lodash"),
    moment = require("moment"),
    consts = require("../../../../libs/consts"),
    regions = require("../../../../libs/countries"),
    utils = require("../../../../libs/utils"),
    tmpBindingTags = [];

// -------------------------------------------------------------------------------------------------------------

/**
 * Constructor
 *
 * @access public
 * @param {array} tempoIQDataPoints
 * @param {object} tempoIQParam
 * @param {object} widget
 * @param {boolean} isViewerTime
 * @param {number} viewerTZOffset
 * @returns {void}
 */
function DimensionsCalculator(tempoIQDataPoints, tempoIQParam, widget, isViewerTime, viewerTZOffset) {
    this.tempoIQDataPoints = tempoIQDataPoints;
    this.tempoIQParam = tempoIQParam;
    this.groupDimension = widget.groupDimension;
    this.customGroupDimension = null;
    
    if(widget.type === consts.DATA_SENSE_WIDGET_TYPES.Timeline && !widget.groupDimension && !widget.subDay) {
        console.log("Set up TIMELINE groupDimension");
        this.groupDimension = tempoIQParam.calculatedDimension;
    } else if (widget.type === consts.DATA_SENSE_WIDGET_TYPES.Kpi) {
        this.groupDimension = null;
    }

    if(widget.groupDimension === consts.DIMENSIONS.CUSTOM) {
        this.customGroupDimension = widget.customGroupDimension;
    }

    this.useViewerTime = isViewerTime && viewerTZOffset && utils.isNumber(viewerTZOffset);

    if(this.useViewerTime) {
        this.msOffset = (-1 * tempoIQParam.deviceOffset + parseInt(viewerTZOffset)) * 60000;
    }

    this.pivotDimension = widget.pivotDimension;
}

/**
 * Get continent from country name
 *
 * @access private
 * @param {string} country name
 * @returns {string}
 */
function getContinent( country ) {
    if (country.length === 2) {
        return regions.continents[regions.countries[country].continent];
    }
    else if(country.length === 3) {
        return regions.continents[regions.countries[country.substr(0,2)].continent];
    }
    else {
        var countries = _.values(regions.countries);
        var countryDetail = _.where(countries,{"name": country});

        if (countryDetail.length) {
            return regions.continents[countryDetail[0].continent];
        }
    }

    return null;
}

// -------------------------------------------------------------------------------------------------------------

/**
 * Functions returns value from tempoiq data
 *
 * @access private
 * @param {object} valueObj - tempoiq values object
 * @param {object} tempoIQParam - tempoiq query parameters
 * @returns {number}
 */
function getValue(valueObj, tempoIQParam) {
    var thisTotal = 0;

    if(valueObj[tempoIQParam.sensor]) {
        thisTotal = valueObj[tempoIQParam.sensor][tempoIQParam.type];
    } else {
        thisTotal = 0;
    }
    return thisTotal;
}

function getWeekLabel(date) {
    var week = date.week();
    //if week is 1 in december, then it is first week in next year
    if(week === 1 && date.months() === 11) {
        return "Week " + week + " " + (date.years() + 1);
    } else {
        return "Week " + date.format("W, YYYY");
    }
}


// -------------------------------------------------------------------------------------------------------------

/**
 * Function returns label for the date
 *
 * @access private
 * @param {object} startDate
 * @param {string} dimension
 * @returns {string}
 */
function getLabelByDimension(startDate, dimension) {
    var date = moment.utc(startDate);
    switch(dimension) {
        case consts.DIMENSIONS.DATE:
            return date.format("MMMM DD, YYYY");
        case consts.DIMENSIONS.DAY_INDEX:
            return date.format("MMMM DD, YYYY");
        case consts.DIMENSIONS.HOUR:
            return date.format("ha, MMMM DD, YYYY");
        case consts.DIMENSIONS.HOUR_INDEX:
            return date.format("ha, MMMM DD, YYYY");
        case consts.DIMENSIONS.MINUTE:
            return date.format("h:mma, MMMM DD, YYYY");
        case consts.DIMENSIONS.MINUTE_INDEX:
            return date.format("h:mma, MMMM DD, YYYY");
        case consts.DIMENSIONS.MONTH:
            return date.format("MMMM, YYYY");
        case consts.DIMENSIONS.MONTH_INDEX:
            return date.format("MMMM, YYYY");
        case consts.DIMENSIONS.WEEK:
            return getWeekLabel(date);
        case consts.DIMENSIONS.WEEK_INDEX:
            return getWeekLabel(date);
        case consts.DIMENSIONS.YEAR:
            return date.format("YYYY");
        case consts.DIMENSIONS.DAY_OF_WEEK:
            return date.format("dddd");
        case consts.DIMENSIONS.DAY_OF_MONTH:
            return "Day " + date.format("DD");
        case consts.DIMENSIONS.MONTH_OF_YEAR:
            return date.format("MMMM");
        case consts.DIMENSIONS.HOUR_OF_DAY:
            return date.format("ha");
        case consts.DIMENSIONS.MINUTE_OF_HOUR:
            return "Minute " + date.format("mm");
        case consts.DIMENSIONS.WEEK_OF_YEAR:
            return "Week " + date.format("W");
        default :
            return null;
    }
}

// -------------------------------------------------------------------------------------------------------------

/**
 * Function returns date
 *
 * @access private
 * @param {object} baseDate
 * @param {boolean} isViewerTime
 * @param {number} msOffset
 * @returns {object}
 */

function getDate(baseDate, isViewerTime, msOffset) {

    if(typeof baseDate === "string") {
        baseDate = new Date(baseDate);
    }

    return isViewerTime ?
        new Date(baseDate.getTime() + msOffset) :
        baseDate;
}

// --------------------------------------------------------------------------------------------------

/**
 * Recursive function for getting all tags by visiting every node in abstract tag tree (abstract means db relation)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */

function findTagsRecursive(childTags) {
    for (var i = 0; i < childTags.length; i++) {
        if (childTags[i].visible === true) {
            tmpBindingTags.push(childTags[i]._id);
        }

        if (!childTags[i].children.length && (i === childTags.length - 1 )) {
            return true;
        } else {
            findTagsRecursive(childTags[i].children);
        }
    }
}

// -------------------------------------------------------------------------------------------------------------

/**
 * Functions calculates data based on dimension
 * @access public
 * @returns {array}
 */
DimensionsCalculator.prototype.getData = function() {
    var i=0, tmpVal=0;
    var returnData = {};
    var d = null;
    var continent = getContinent(this.tempoIQParam.country);
    var label = null;
    //if rate exists, need multiple values on that rate
    var rateMultiplier = (this.tempoIQParam.rate && utils.isNumber(this.tempoIQParam.rate)) ?
        this.tempoIQParam.rate :
        1;

    var total = this.getTotalValue() * rateMultiplier;

    var latitude = ((this.tempoIQParam.latitude) && (typeof this.tempoIQParam.latitude !== "undefined")) ?
        Math.floor(this.tempoIQParam.latitude) : "Other Latitude";
    var longitude = ((this.tempoIQParam.longitude) && (typeof this.tempoIQParam.longitude !== "undefined")) ?
        Math.floor(this.tempoIQParam.longitude) : "Other Longitude";

    if(this.tempoIQDataPoints.length > 0) {
        if (typeof this.groupDimension === "undefined" || this.groupDimension === null) {
            for (i = 0; i < this.tempoIQDataPoints.length; i++) {

                d = getDate(this.tempoIQDataPoints[i].ts, this.useViewerTime, this.msOffset);

                returnData[d.toISOString()] = {
                    value: getValue(this.tempoIQDataPoints[i].values, this.tempoIQParam) * rateMultiplier,
                    label: label
                };
            }
        } else if (this.groupDimension === consts.DIMENSIONS.CONTINENT) {
            d = continent || "Other Continent";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.COUNTRY) {
            d = this.tempoIQParam.country || "Other Country";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.STATE) {
            d = this.tempoIQParam.state || "Other State";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.CITY) {
            d =  this.tempoIQParam.city || "Other City";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.ZIP_CODE) {
            d = this.tempoIQParam.zip || "Other Zipcode";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.LATITUDE) {
            returnData[latitude] = {
                value: total,
                label: latitude
            };
        } else if (this.groupDimension === consts.DIMENSIONS.LONGITUDE) {
            returnData[latitude] = {
                value: total,
                label: longitude
            };
        } else if (this.groupDimension === consts.DIMENSIONS.SOURCE_TYPE) {
            d =  this.tempoIQParam.type || "Other Metric Type";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.ACCESS_METHOD) {
            d = this.tempoIQParam.accessMethod || "Other Access Method";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.DATA_LOGGER_MANUFACTURER) {
            d =  this.tempoIQParam.dataLoggerManufacturer || "Other DataLogger manufacturer";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.DATA_LOGGER_DEVICE) {
            d =  this.tempoIQParam.device || "Other DataLogger device";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.SENSOR_MANUFACTURER) {
            d =  this.tempoIQParam.sensorManufacturer || "Other Sensor manufacturer";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.SENSOR_DEVICE) {
            d =  this.tempoIQParam.sensor || "Other Sensor device";

            returnData[d] = {
                value: total,
                label: d
            };
        } else if (this.groupDimension === consts.DIMENSIONS.TEAM_MEMBER_WITH_ACCESS) {
            if (!this.tempoIQParam.users || !this.tempoIQParam.users.length) {
                d = "Other Team Members";
                returnData[d] = {
                    value: total,
                    label: d
                };
            } else {
                for (i = 0; i < this.tempoIQParam.availableUsers.length; i++) {
                    if (this.tempoIQParam.users.indexOf(this.tempoIQParam.availableUsers[i]) > -1) {
                        tmpVal = total;
                    } else {
                        tmpVal = 0;
                    }

                    d = this.tempoIQParam.availableUsers[i];
                    returnData[d] = {
                        value: tmpVal,
                        label: d
                    };
                }
            }
            
        } else if (this.groupDimension === consts.DIMENSIONS.ACCOUNT) {
            if (!this.tempoIQParam.accounts || !this.tempoIQParam.accounts.length) {
                d = "Other Accounts";
                returnData[d] = {
                    value: total,
                    label: d
                };
            } else {
                for (i = 0; i < this.tempoIQParam.availableAccounts.length; i++) {
                    if (this.tempoIQParam.accounts.indexOf(this.tempoIQParam.availableAccounts[i]) > -1) {
                        tmpVal = total;
                    } else {
                        tmpVal = 0;
                    }

                    d = this.tempoIQParam.availableAccounts[i];
                    returnData[d] = {
                        value: tmpVal,
                        label: d
                    };
                }
            }
        } else if (this.groupDimension === consts.DIMENSIONS.CUSTOM) {
            if (!this.customGroupDimension.definedGroups || !this.customGroupDimension.definedGroups.length) {
                d = "Other Group Dimension";
                returnData[d] = {
                    value: total,
                    label: d
                };
            } else {
                if (this.customGroupDimension.groupBySegment) {
                    d = "All";

                    returnData[d] = {
                        value: total,
                        label: d
                    };
                } else {
                    for (i = 0; i < this.customGroupDimension.definedGroups.length; i++) {
                        tmpBindingTags = [];
                        findTagsRecursive(this.customGroupDimension.definedGroups[i].treedata);
                        
                        if (tmpBindingTags.indexOf(this.tempoIQParam.scopeId) > -1 ||
                            tmpBindingTags.indexOf(this.tempoIQParam.nodeId) > -1 ||
                            tmpBindingTags.indexOf(this.tempoIQParam.metricId) > -1) {
                            tmpVal = total;
                        } else {
                            tmpVal = 0;
                        }
                        
                        d = this.customGroupDimension.definedGroups[i].name;
                        
                        returnData[d] = {
                            value: tmpVal,
                            label: d
                        };
                    }
                }
            }
        } else {
            for(i = 0; i < this.tempoIQDataPoints.length; i++) {
                total = getValue(this.tempoIQDataPoints[i].values, this.tempoIQParam) * rateMultiplier;


                d = getDate(this.tempoIQDataPoints[i].ts, this.useViewerTime, this.msOffset);
                label = getLabelByDimension(d, this.groupDimension);

                returnData[d.toISOString()] = {
                    value: total,
                    label: label
                };
            }
        }
    }

    return returnData;
};

// -------------------------------------------------------------------------------------------------------------

/**
 * Function returns sum from all values for sensor
 *
 * @access public
 * @returns {number}
 */
DimensionsCalculator.prototype.getTotalValue = function() {
    var total = 0;

    for (var i = 0; i < this.tempoIQDataPoints.length;i++) {
        var valuesObj = this.tempoIQDataPoints[i].values;

        if(valuesObj[this.tempoIQParam.sensor]) {
            total += valuesObj[this.tempoIQParam.sensor][this.tempoIQParam.type];
        }
    }
    return total;
};

exports.DimensionsCalculator = DimensionsCalculator;
