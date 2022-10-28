'use strict';

angular.module('blApp.dataSense.services')
    .service('widgetUtilService', function() {
        var service = this;
        this.getGroupDimension = function() {
            return [
                {
                    id: 1,
                    name: 'CONTINENT',
                    value: 'Continent'
                },
                {
                    id: 2,
                    name: 'COUNTRY',
                    value: 'Country'
                },
                {
                    id: 3,
                    name: 'STATE',
                    value: 'State'
                },
                {
                    id: 4,
                    name: 'CITY',
                    value: 'City'
                },
                {
                    id: 5,
                    name: 'ZIP_CODE',
                    value: 'Zip code'
                },
                {
                    id: 6,
                    name: 'LATITUDE',
                    value: 'Latitude'
                },
                {
                    id: 7,
                    name: 'LONGITUDE',
                    value: 'Longitude'
                },
                {
                    id: 8,
                    name: 'YEAR',
                    value: 'Year'
                },
                {
                    id: 9,
                    name: 'MONTH_OF_YEAR',
                    value: 'Month of the Year'
                },
                {
                    id: 10,
                    name: 'WEEK_OF_YEAR',
                    value: 'Week of the Year'
                },
                {
                    id: 11,
                    name: 'DAY_OF_MONTH',
                    value: 'Day of the Month'
                },
                {
                    id: 12,
                    name: 'DAY_OF_WEEK',
                    value: 'Day of the Week'
                },
                {
                    id: 13,
                    name: 'HOUR_OF_DAY',
                    value: 'Hour of the Day'
                },
                {
                    id: 14,
                    name: 'MINUTE_OF_HOUR',
                    value: 'Minute of the Hour'
                },
                {
                    id: 15,
                    name: 'MONTH',
                    value: 'Month'
                },
                {
                    id: 16,
                    name: 'WEEK',
                    value: 'Week'
                },
                {
                    id: 17,
                    name: 'DATE',
                    value: 'Date'
                },
                {
                    id: 18,
                    name: 'HOUR',
                    value: 'Hour'
                },
                {
                    id: 19,
                    name: 'MINUTE',
                    value: 'Minute'
                },
                {
                    id: 20,
                    name: 'MONTH_INDEX',
                    value: 'Month Index'
                },
                {
                    id: 21,
                    name: 'WEEK_INDEX',
                    value: 'Week Index'
                },
                {
                    id: 22,
                    name: 'DAY_INDEX',
                    value: 'Day Index'
                },
                {
                    id: 23,
                    name: 'HOUR_INDEX',
                    value: 'Hour Index'
                },
                {
                    id: 24,
                    name: 'MINUTE_INDEX',
                    value: 'Minute Index'
                },
                {
                    id: 25,
                    name: 'ACCOUNT',
                    value: 'Account'
                },
                {
                    id: 26,
                    name: 'TEAM_MEMBER_WITH_ACCESS',
                    value: 'Team Members with Access'
                },
                {
                    id: 27,
                    name: 'SOURCE_TYPE',
                    value: 'Source Type'
                },
                {
                    id: 28,
                    name: 'ACCESS_METHOD',
                    value: 'Access Method'
                },
                {
                    id: 29,
                    name: 'SCOPE_MANUFACTURER',
                    value: 'Scope Manufacturer - manufacturer of metric’s scope'
                },
                {
                    id: 30,
                    name: 'SCOPE_DEVICE',
                    value: 'Scope Device - device name of metric’s scope'
                },
                {
                    id: 31,
                    name: 'NODE_MANUFACTURER',
                    value: 'Node Manufacturer - manufacturer of metric’s node'
                },
                {
                    id: 32,
                    name: 'NODE_DEVICE',
                    value: 'Node Device - device name of metric’s node'
                },
                {
                    id: 33,
                    name: 'CUSTOM',
                    value: '--Custom--'
                }
            ];
        };

        this.getKpiSummaryMethod = function() {
            return [
                {
                    id: 1,
                    name: 'Total',
                    value: 'Total'
                },
                {
                    id: 2,
                    name: 'Average',
                    value: 'Average'
                },
                {
                    id: 3,
                    name: 'Count',
                    value: 'Count'
                },
                {
                    id: 4,
                    name: 'Maximum',
                    value: 'Maximum'
                },
                {
                    id: 5,
                    name: 'Minimum',
                    value: 'Minimum'
                }
            ];
        };
        
        this.getTimelineGroupDimension = function() {
            return [
                {
                    id: 8,
                    name: 'YEAR',
                    value: 'Year'
                },
                {
                    id: 15,
                    name: 'MONTH',
                    value: 'Month'
                },
                {
                    id: 16,
                    name: 'WEEK',
                    value: 'Week'
                },
                {
                    id: 17,
                    name: 'DATE',
                    value: 'Date'
                },
                {
                    id: 18,
                    name: 'HOUR',
                    value: 'Hour'
                },
                {
                    id: 19,
                    name: 'MINUTE',
                    value: 'Minute'
                }
            ];
        };
        this.getPivotDimension = function() {
            return [
                {
                    id: 'minute',
                    name: 'Minute'
                },
                {
                    id: 'hour',
                    name: 'Hour'
                },
                {
                    id: 'day',
                    name: 'Day'
                }
            ];
        };
        this.getShowUpTo = function() {
            return [
                {
                    id: '5',
                    name: '5 slices'
                },
                {
                    id: '10',
                    name: '10 slices'
                },
                {
                    id: '20',
                    name: '20 slices'
                },
                {
                    id: '25',
                    name: '25 slices'
                },
                {
                    id: '50',
                    name: '50 slices'
                }
            ];
        };
        this.getOrientation = function() {
            return [
                {
                    id: 'vertical',
                    name: 'Vertical'
                },
                {
                    id: 'horizontal',
                    name: 'Horizontal'
                }
            ];
        };
        this.getEquivalenciesType = function() {
            return [
                {
                    id: 'Cars Removed',
                    name: 'Cars Removed'
                }, {
                    id: 'Waste Recycled',
                    name: 'Waste Recycled'
                }, {
                    id: 'Gallons Gas Saved',
                    name: 'Gallons Gas Saved'
                }, {
                    id: 'Tanker Gas Saved',
                    name: 'Tanker Gas Saved'
                }, {
                    id: 'Energy Homes Generated',
                    name: 'Energy Homes Generated'
                }, {
                    id: 'Electricity Homes Generated',
                    name: 'Electricity Homes Generated'
                }, {
                    id: 'Coal Eliminated',
                    name: 'Coal Eliminated'
                }, {
                    id: 'Oil Unneeded',
                    name: 'Oil Unneeded'
                }, {
                    id: 'Propane Cylinders',
                    name: 'Propane Cylinders'
                }, {
                    id: 'Plants Idled',
                    name: 'Plants Idled'
                }, {
                    id: 'Seedling Grown',
                    name: 'Seedling Grown'
                }, {
                    id: 'Forests Preserved',
                    name: 'Forests Preserved'
                }, {
                    id: 'Forests Conversion Prevented',
                    name: 'Forests Conversion Prevented'
                }
            ];
        };
        this.getBoilerplatesType = function() {
            return [
                {
                    id: 'Boilerplate Communication Monitoring',
                    name: 'Communication Monitoring'
                },{
                    id: 'Boilerplate Energy Consumed',
                    name: 'Energy Consumed'
                },{
                    id: 'Boilerplate Energy Produced',
                    name: 'Energy Produced'
                },{
                    id: 'Boilerplate System Information',
                    name: 'System Information'
                },{
                    id: 'Boilerplate Weather',
                    name: 'Weather'
                },{
                    id: 'Boilerplate Location',
                    name: 'Location'
                },{
                    id: 'Boilerplate Current Power',
                    name: 'Current Power'
                },{
                    id: 'Boilerplate CO2 Avoided',
                    name: 'CO2 Avoided'
                },{
                    id: 'Boilerplate Reimbursement',
                    name: 'Reimbursement'
                }
            ];
        };
        this.getBoilerplateTypeAsName = function(id) {
            return {
                'Boilerplate Communication Monitoring': 'Communication Monitoring',
                'Boilerplate Energy Consumed': 'Energy Consumed',
                'Boilerplate Energy Produced': 'Energy Produced',
                'Boilerplate System Information': 'System Information',
                'Boilerplate Weather': 'Weather',
                'Boilerplate Location': 'Location',
                'Boilerplate Current Power': 'Current Power',
                'Boilerplate CO2 Avoided': 'CO2 Avoided',
                'Boilerplate Reimbursement': 'Reimbursement'
            }[id];
        };
        this.getRowsPerTable = function () {
            return [
                {
                    id: '5',
                    name: '5 Rows'
                },
                {
                    id: '10',
                    name: '10 Rows'
                },
                {
                    id: '15',
                    name: '15 Rows'
                },
                {
                    id: '20',
                    name: '20 Rows'
                },

            ];
        };
        this.getEquivalenciesItemInfo = function(type) {
            var drawInfos = {
                'Electricity Homes Generated': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'building',
                    class: 'blue',
                    description: 'Generated',
                    unit: 'for Homes Electricity',
                    field: 'homeElectricityUse'
                }, 'Seedling Grown': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'hand-leaf',
                    class: 'green-dark',
                    description: 'Tree seeding',
                    unit: 'for 10 Years',
                    field: 'numberOfTreeSeedlingsGrownFor10Years'
                }, 'Gallons Gas Saved': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'stander',
                    class: 'green',
                    description: 'Saved',
                    unit: 'Gallons of Gas',
                    field: 'gallonsOfGasoline'
                }, 'Forests Conversion Prevented': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'leaf',
                    class: 'purple-dark',
                    description: 'Prevented',
                    unit: 'acres of foreset from conversion to cropland',
                    field: 'acresOfUSForestsStoringCarbonForOneYear'
                }, 'Cars Removed': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'car',
                    class: 'purple',
                    description: 'Removed',
                    unit: 'Cars',
                    field: 'passengerVehiclesPerYear'
                }, 'Waste Recycled': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'recycled',
                    class: 'blue-dark',
                    description: 'Recycled',
                    unit: 'Tons of Waste',
                    field: 'tonsOfWasteRecycledInsteadOfLandfilled'
                }, 'Forests Preserved': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'forests',
                    class: 'yellow',
                    description: 'Preserved',
                    unit: 'Acres of US forests',
                    field: 'acresOfUSForestPreservedFromConversionToCropland'
                }, 'Plants Idled': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'factory',
                    class: 'grey-dark',
                    description: 'Idled',
                    unit: 'Coal Fired Power Plants',
                    field: 'coalFiredPowerPlantEmissionsForOneYear'
                }, 'Coal Eliminated': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'railcar',
                    class: 'grey',
                    description: 'Eliminated',
                    unit: 'Railcars of coal',
                    field: 'railcarsOfCoalburned'
                }, 'Energy Homes Generated': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'house',
                    class: 'red-dark',
                    description: 'Generated',
                    unit: 'Energy for homes',
                    field: 'homeEnergyUse'
                }, 'Oil Unneeded': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'oil-drum',
                    class: 'red',
                    description: 'Unneeded',
                    unit: 'Barrels of Oil',
                    field: 'barrelsOfOilConsumed'
                }, 'Propane Cylinders': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'propane-cylinder',
                    class: 'yellow-dark',
                    description: 'Unburned',
                    unit: 'Propane cylinders',
                    field: 'propaneCylindersUsedForHomeBarbecues'
                }, 'Tanker Gas Saved': {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'truck',
                    class: 'grey-light',
                    description: 'Saved',
                    unit: 'Tanker Trucks of Gas',
                    field: 'tankerTrucksFilledWithGasoline'
                }
            };
            if (typeof drawInfos[type] === 'undefined') {
                return {
                    title: 'Reduced greenhouse emissions over the past 30 days',
                    icon: 'building',
                    class: 'green',
                    description: '',
                    unit: '',
                    field: 'homeElectricityUse'
                };
            }
            // Disable multi-color concept
            drawInfos[type].class = 'green';
            return angular.copy(drawInfos[type]);
        };

        this.getAggregateOptions = function () {
            return [{
                function: 'Median'
            }, {
                function: 'Mode'
            }, {
                function: 'Min'
            }, {
                function: 'Max'
            }, {
                function: 'Total'
            }, {
                function: 'Average'
            }, {
                function: 'Count'
            }];
        };

        /**
         * Convert data.
         * @param data
         * @param unit
         * @param frictionSize
         * @returns {*}
         */

        this.convertFormat = function (data, unit, frictionSize) {
            var unitPosition, unitPosition2,
                loweredUnit = unit.toLowerCase(),
                result,
                logPos,
                unitList = {
                    w : ['tw','gw','mw', 'kw', 'w'],
                    wh : ['twh', 'gwh', 'mwh', 'kwh', 'wh'],
                    wp : ['twp','gwp','mwp', 'kwp', 'wp'],
                    kg : ['mt', 'kt', 't', 'kg', 'g']
                },
                formatUnits = {
                    'tw' : 'tW',
                    'gw' : 'gW',
                    'mw' : 'mW',
                    'kw' : 'kW',
                    'w' : 'W',

                    'twh' : 'tWh',
                    'gwh' : 'gWh',
                    'mwh' : 'mWh',
                    'kwh' : 'kWh',
                    'wh' : 'Wh',

                    'twp' : 'tWp',
                    'gwp' : 'gWp',
                    'mwp' : 'mWp',
                    'kwp' : 'kWp',
                    'wp' : 'Wp',

                    'gt' : 'Gt',
                    'mt' : 'Mt',
                    'kt' : 'Kt',
                    't' : 't',
                    'kg' : 'kg',
                    'g' : 'g'
                };
            if (data === null) {
                result = {
                    value: 0,
                    unit: loweredUnit
                };
            } else {
                logPos = Math.floor(Math.log(data) / Math.log(1000));
                if ((unitPosition = unitList.w.indexOf(loweredUnit)) > -1) {
                    unitPosition -= logPos;
                    unitPosition2 = Math.min(Math.max(0, unitPosition), unitList.w.length - 1);
                    logPos += unitPosition - unitPosition2;
                    result = {
                        value: data / Math.pow(1000, logPos),
                        unit: unitList.w[unitPosition2]
                    };
                } else if ((unitPosition = unitList.wh.indexOf(loweredUnit)) > -1) {
                    unitPosition -= logPos;
                    unitPosition2 = Math.min(Math.max(0, unitPosition), unitList.w.length - 1);
                    logPos += unitPosition - unitPosition2;
                    result = {
                        value: data / Math.pow(1000, logPos),
                        unit: unitList.wh[unitPosition2]
                    };
                } else if ((unitPosition = unitList.wp.indexOf(loweredUnit)) > -1) {
                    unitPosition -= logPos;
                    unitPosition2 = Math.min(Math.max(0, unitPosition), unitList.w.length - 1);
                    logPos += unitPosition - unitPosition2;
                    result = {
                        value: data / Math.pow(1000, logPos),
                        unit: unitList.wp[unitPosition2]
                    };
                } else if ((unitPosition = unitList.kg.indexOf(loweredUnit)) > -1) {
                    unitPosition -= logPos;
                    unitPosition2 = Math.min(Math.max(0, unitPosition), unitList.w.length - 1);
                    logPos += unitPosition - unitPosition2;
                    result = {
                        value: data / Math.pow(1000, logPos),
                        unit: unitList.kg[unitPosition2]
                    };
                } else {
                    result = {
                        value: 0,
                        unit: loweredUnit
                    };
                }
            }
            result.unit = formatUnits[result.unit];
            return result;
        };

        this.convertFormatFromString = function (data, baseUnit, frictionSize) {
            var values;
            var unitList = [
                'tw','gw','mw', 'kw', 'w',
                'twh', 'gwh', 'mwh', 'kwh', 'wh',
                'twp','gwp','mwp', 'kwp', 'wp',
                'mt', 'kt', 't', 'kg', 'g'];
            if (typeof data !== 'string') {
                return {
                    value: 0,
                    unit: baseUnit
                };
            }
            values = data.split(' ');
            values[0] = parseInt(values[0]);
            if (values.length < 2 ||
                !(!isNaN(values[0]) && unitList.indexOf(values[1].toLowerCase()) > -1 )) {
                return {
                    value: values[0],
                    unit: values[1]
                };
            }
            return service.convertFormat(values[0], values[1], frictionSize);
        };
    });