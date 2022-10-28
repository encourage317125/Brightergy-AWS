"use strict";

var _ = require("lodash"),
    consts = require("../../../../libs/consts");

/**
 * Constructor
 * @access public
 * @param {array} convertedDataItem
 * @param {object} widget
 * @returns {void}
 */
function SinglePointAggregationCalculator(convertedDataItem, widget) {
    this.convertedDataItem = convertedDataItem;
    this.singlePointAggregation = widget.singlePointAggregation;
    this.widgetType = widget.type;

    if(!this.singlePointAggregation) {
        this.singlePointAggregation = [];
    }
}

/**Function calculates sum value
 * @access private
 * @returns {number}
 */
function getSum(values) {
    return  _.reduce(values, function(sum, num) {
        return sum + num;
    });
}

/**Function calculates mode value
 * @access private
 * @returns {number}
 */
function getMode(values) {
    //http://stackoverflow.com/questions/18878571/underscore-js-find-the-most-frequently-occurring-value-in-an-array
    var pairs =  _.chain(values).countBy().pairs().value();

    var maxRepeatableTime = _.chain(values).countBy().pairs().max(_.last).value()[1];

    if(maxRepeatableTime > 1) {

        var modePairs = _.filter(pairs, function (pair) {
            return pair[1] === maxRepeatableTime;
        });

        if(modePairs.length > 1) {
            //return array

            var modes = _.map(modePairs, function(pair) {
                return parseFloat(pair[0]);
            });

            return modes;
        } else {
            return parseFloat(modePairs[0][0]);
        }
    } else {
        return null;
    }
}

/**Function calculates median value
 * @access private
 * @returns {number}
 */
function getMedian(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2) {
        return values[half];
    } else {
        return (values[half - 1] + values[half]) / 2.0;
    }
}

/**
 * Function calculates single point value
 * @access public
 * @returns {number}
 */
SinglePointAggregationCalculator.prototype.getAggregationValue = function() {
    var calculatedSinglePointAggregationValues = [];
    if(this.widgetType === consts.DATA_SENSE_WIDGET_TYPES.Timeline ||
        this.widgetType === consts.DATA_SENSE_WIDGET_TYPES.Bar) {

        var allNumbers = _.pluck(this.convertedDataItem, "value");

        if (allNumbers.length > 0) {

            for (var i = 0; i < this.singlePointAggregation.length; i++) {

                var thisValue = null;

                var func = this.singlePointAggregation[i].function;
                var title = this.singlePointAggregation[i].title || null;

                switch (func) {
                    case consts.SINGLE_POINT_AGGREGATION.Median:
                        thisValue = {
                            title: title,
                            value: getMedian(allNumbers),
                            function: func
                        };
                        break;
                    case consts.SINGLE_POINT_AGGREGATION.Mode:
                        thisValue = {
                            title: title,
                            value: getMode(allNumbers),
                            function: func
                        };
                        break;
                    case consts.SINGLE_POINT_AGGREGATION.Min:
                        thisValue = {
                            title: title,
                            value: _.min(allNumbers),
                            function: func
                        };
                        break;
                    case consts.SINGLE_POINT_AGGREGATION.Max:
                        thisValue = {
                            title: title,
                            value: _.max(allNumbers),
                            function: func
                        };
                        break;
                    case  consts.SINGLE_POINT_AGGREGATION.Total:
                        thisValue = {
                            title: title,
                            value: getSum(allNumbers),
                            function: func
                        };
                        break;
                    case  consts.SINGLE_POINT_AGGREGATION.Average:
                        thisValue = {
                            title: title,
                            value: getSum(allNumbers) / allNumbers.length,
                            function: func
                        };
                        break;
                    case  consts.SINGLE_POINT_AGGREGATION.Count:
                        thisValue = {
                            title: title,
                            value: allNumbers.length,
                            function: func
                        };
                        break;

                }

                if (thisValue) {
                    calculatedSinglePointAggregationValues.push(thisValue);
                }
            }
        }
        allNumbers = null;
    }
    return calculatedSinglePointAggregationValues;
};

exports.SinglePointAggregationCalculator = SinglePointAggregationCalculator;