'use strict';

angular.module('blApp.management.controllers').controller(
    'CanvasController',
    ['$scope', '$rootScope', '$compile', '$http', '$timeout', '$sce', 'widgetService',
        'toggleService', 'presentationService', 'projectService', 'notifyService',
        'PRESENT_CONFIG',
        function ($scope, $rootScope, $compile, $http, $timeout, $sce, widgetService,
                  toggleService, presentationService, projectService, notifyService,
                  PCONFIG) {

            var sunTimer, sunTimer1, sunTimer2, panelTimer, panelTimer1, greenBoxTimer,
                greenBoxTimer1, blueBoxTimer, blueBoxTimer1, step1Timer, step2Timer, step3Timer,
                step4Timer, solarDurationStepTimer1, solarDurationStepTimer2, solarDurationStepTimer3,
                solarDurationStepTimer4;

            $scope.imgUrl = $rootScope.baseCDNUrl + '/bl-bv-management/assets/img/';
            $scope.editFlag = false;
            $scope.highchartsNG = {};
            $scope.widgetTmplLoaded = {};

            $scope.videoconf = {
                preload: 'none',
                sources: [],
                theme: {
                    url: '/lib/videogular/videogular.css'
                },
                plugins: {
                    controls: {
                        autoHide: true,
                        autoHideTime: 5000
                    }
                }
            };
            $rootScope.videoAPI = [];
            $scope.onPlayerReady = function(API, widgetID) {
                if (typeof $rootScope.videoAPI[widgetID] === 'undefined') {
                    $rootScope.videoAPI[widgetID] = [];
                }
                $rootScope.videoAPI[widgetID][0] = API;
                console.log($rootScope.videoAPI);
            };

            $scope.onPresentVideoPlayerReady = function(API, widgetID) {
                if (typeof $rootScope.videoAPI[widgetID] === 'undefined') {
                    $rootScope.videoAPI[widgetID] = [];
                }
                $rootScope.videoAPI[widgetID][1] = API;
                console.log($rootScope.videoAPI);
            };
            //widgetService.getWidgetsInfo($rootScope.presentationId, false, $rootScope);

/*
            $rootScope.$watch('widgetParam.parameters.widgetURL', function(newValue, oldValue) {
                console.log('asdasdasdasd');
                $rootScope.videoAPI[$rootScope.widgetParam._id][0].changeSource(
                  [{src: $rootScope.widgetParam.parameters.widgetURL,
                      type: $rootScope.widgetParam.parameters.videoType}]
                );
            });
*/

            //Edit presentation Name
            $scope.setfocusToPname = function() {
                $scope.bLabel = true;
                $scope.presetationTempName = $rootScope.presentationDetails.name;
                var PnameInput = document.getElementById('presentationname');
                PnameInput.focus();
                PnameInput.select();
            };

            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

            $scope.savePresentName = function () {
                if (!$rootScope.Bvmodifyable) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    $scope.presetationTempName = $rootScope.presentationDetails.name;
                    $scope.bLabel = false;
                    return false;
                } else {
                    if ($scope.presetationTempName) {
                        $rootScope.presentationDetails.name = $scope.presetationTempName;
                        $rootScope.appName = $scope.presetationTempName;
                        presentationService.savePresentation(JSON.stringify($rootScope.presentationDetails),
                            $rootScope);
                        projectService.getProjectsInfo($scope);
                    }
                    $scope.presetationTempName = '';
                    $scope.bLabel = false;
                }
            };
            $rootScope.getWidgetsInfo2 = function(widgets) {
                /*var tempWidgets = [];*/

                $rootScope.widgets = widgets;

                $.each(widgets, function(idx, widget) {
                    $scope.pathHeightStep1 = 569.354;
                    $scope.foreignObjectHeightStep1 = 125;

                    $scope.pathHeightStep2 = 830.344;
                    $scope.foreignObjectHeightStep2 = 125;

                    $scope.pathHeightStep3 = 860.11;
                    $scope.foreignObjectHeightStep3 = 125;

                    $scope.pathHeightStep4 = 619.927;
                    $scope.foreignObjectHeightStep4 = 125;
                    /*
                     var build_widget = $rootScope.compileWidget(widget, false);
                     tempWidgets.push(build_widget);
                     */

                    widget.dataLoaded = false;
                    angular.extend(widget.parameters, {
                        height: PCONFIG.GridWidth * parseInt(widget.parameters.rowCount) +
                        parseInt(widget.parameters.rowCount) - 1,
                        width: PCONFIG.GridHeight * parseInt(widget.parameters.colCount) +
                        parseInt(widget.parameters.colCount) - 1,
                        top: PCONFIG.GridHeight * parseInt(widget.parameters.rowPosition) +
                        parseInt(widget.parameters.rowPosition) + 2,
                        left: PCONFIG.GridWidth * parseInt(widget.parameters.colPosition) +
                        parseInt(widget.parameters.colPosition) - 1
                    });

                    if (PCONFIG.GridRowCnt < parseInt(widget.parameters.rowPosition) +
                        parseInt(widget.parameters.rowCount)) {
                        widget.parameters.rowPosition = PCONFIG.GridRowCnt - parseInt(widget.parameters.rowCount);
                        widget.parameters.top = parseInt(widget.rowPosition) * PCONFIG.GridHeight +
                        parseInt(widget.parameters.rowPosition) + 2;
                    }

                    if (PCONFIG.GridColCnt < parseInt(widget.parameters.colPosition) +
                        parseInt(widget.parameters.colCount)) {
                        widget.parameters.colPosition = PCONFIG.GridColCnt - parseInt(widget.parameters.colCount);
                        widget.parameters.left = widget.parameters.colPosition * PCONFIG.GridWidth +
                        widget.parameters.colPosition - 1;
                    }

                    // convert StartDate and EndDate
                    angular.forEach(widget.parameters, function (val, key) {
                        if (key.match('StartDate$') || key.match('EndDate$')) {
                            widget.parameters[key] = $scope.dateFormatConvert(val);
                        }
                    });
                    //show startDate and endDate by Date Range
                    widget.graphCustom = widget.parameters.widgetGraphDateRange === '-- Custom --';
                    widget.generationCustom = widget.parameters.widgetSolarGenerationDateRange === '-- Custom --';
                    widget.energyCustom = widget.parameters.widgetEnergyDateRange === '-- Custom --';

                });
                //end widgets each

                $timeout(function(){
                    $.each(widgets, function(idx, widget) {
                        $rootScope.compileWidget(widget, false);
                    });

                    // Make sure that TMs only see the widgets at the initial timepoint
                    $('.presentationBody .widget').each(function(e){
                        var startPoint = $(this).attr('data-startpoint');
                        if (startPoint === '0:0') {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                }, 6000);

                //          $rootScope.widgets = tempWidgets ;
                //$scope.$apply(); Need recheck
            };

            /**
             * Fill widget parameter
             * @param w Widget
             * @param resize isResize
             * @returns {*}
             */

            $rootScope.compileWidget = function (w, resize) {
                var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'];
                var weekArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                w.parameters.height = PCONFIG.GridWidth * parseInt(w.parameters.rowCount) +
                parseInt(w.parameters.rowCount) - 1;
                w.parameters.width = PCONFIG.GridHeight * parseInt(w.parameters.colCount) +
                parseInt(w.parameters.colCount) - 1;

                w.parameters.top = parseInt(w.parameters.rowPosition) * PCONFIG.GridHeight +
                parseInt(w.parameters.rowPosition) + 2;
                w.parameters.left = parseInt(w.parameters.colPosition) * PCONFIG.GridWidth +
                parseInt(w.parameters.colPosition) - 1;

                if (PCONFIG.GridRowCnt < (parseInt(w.parameters.rowPosition) + parseInt(w.parameters.rowCount))) {
                    w.parameters.rowPosition = PCONFIG.GridRowCnt - parseInt(w.parameters.rowCount);
                    w.parameters.top = parseInt(w.rowPosition) * PCONFIG.GridHeight +
                    parseInt(w.parameters.rowPosition) + 2;
                }

                if (PCONFIG.GridColCnt < (w.parameters.colPosition + parseInt(w.parameters.colCount))) {
                    w.parameters.colPosition = PCONFIG.GridColCnt - parseInt(w.parameters.colCount);
                    w.parameters.left = w.parameters.colPosition * PCONFIG.GridWidth +
                    w.parameters.colPosition - 1;
                }

                // convert StartDate and EndDate
                angular.forEach(w.parameters, function (val, key) {
                    if (key.match('StartDate$') || key.match('EndDate$')) {
                        w.parameters[key] = $scope.dateFormatConvert(val);
                    }
                });

                //show startDate and endDate by Date Range
                w.graphCustom = w.parameters.widgetGraphDateRange === '-- Custom --';
                w.generationCustom = w.parameters.widgetSolarGenerationDateRange === '-- Custom --';
                w.energyCustom = w.parameters.widgetEnergyDateRange === '-- Custom --';

                switch (w.name) {
                    case 'iFrame':
                        if (!resize) {
                            w.templateName = '/bl-bv-management/views/preview/iframe.html';
                            if (!w.parameters.headerFont.content) {
                                w.parameters.bodyHeight = w.parameters.height;
                            } else {
                                w.parameters.bodyHeight = parseInt(w.parameters.height) -
                                (parseFloat(w.parameters.headerFont.size) * 14 + 10);
                            }
                            w.dataLoaded = true;
                        }
                        break;
                    case 'Image':
                        if (!resize) {
                            w.templateName = '/bl-bv-management/views/preview/image.html';
                            if (!w.parameters.headerFont.content) {
                                w.parameters.bodyHeight = w.parameters.height;
                            } else {
                                w.parameters.bodyHeight = parseInt(w.parameters.height) -
                                (parseFloat(w.parameters.headerFont.size) * 14 + 10);
                            }
                            w.dataLoaded = true;
                        }
                        break;
                    case 'Video':
                        if (!resize) {
                            w.templateName = '/bl-bv-management/views/preview/present-video.html';
                            if (!w.parameters.headerFont.content) {
                                w.parameters.bodyHeight = w.parameters.height;
                            } else {
                                w.parameters.bodyHeight = parseInt(w.parameters.height) -
                                  (parseFloat(w.parameters.headerFont.size) * 14 + 10);
                            }
                            w.dataLoaded = true;
                        }
                        break;
                    case 'TextArea':
                        if (!resize) {
                            w.templateName = '/bl-bv-management/views/preview/textarea.html';
                            var safeContent = $sce.trustAsHtml(w.parameters.widgetTextareaContent);
                            w.parameters.widgetComplieTextareaContent = safeContent;

                            if (!w.parameters.headerFont.content) {
                                w.parameters.bodyHeightPadding =  w.parameters.height;
                            } else {
                                w.parameters.bodyHeight = parseInt(w.parameters.height) -
                                (parseFloat(w.parameters.headerFont.size) * 14 + 10);
                            }

                            if (w.parameters.backgroundImage) {
                                w.parameters.backgroundShowImage = 'url(' + w.parameters.backgroundImage +
                                ') no-repeat';
                            } else {
                                w.parameters.backgroundShowImage = 'none';
                            }
                            w.dataLoaded = true;
                        }
                        break;
                    case 'Weather':
                        if (!resize) {
                            w.weatherCurrentlyIcon = 'clear-day';
                            w.weatherWindBearing = 'arrow_0';
                            if (w.parameters.widgetWeatherType === 'Minimal') {
                                w.templateName = '/bl-bv-management/views/preview/weather-minimal.html';
                            } else {
                                w.templateName = '/bl-bv-management/views/preview/weather-detailed.html';
                            }
                            widgetService.getWeatherWidget($rootScope.presentationId).then(function (weather){
                                console.log('Weather Data');
                                console.log(weather);
                                w.dataLoaded = true;
                                if (Object.keys(weather.currently).length !== 0) {
                                    w.weatherCurrentlyTemperature = parseInt(weather.currently.temperature);
                                    w.weatherCurrentlyTemperatureMin = parseInt(weather.daily.data[0].temperatureMin);
                                    w.weatherCurrentlyTemperatureMax = parseInt(weather.daily.data[0].temperatureMax);
                                    w.weatherCurrentlyWindSpeed = parseFloat(weather.currently.windSpeed);
                                    w.weatherCurrentlySummary = weather.currently.summary;
                                    w.weatherCurrentlyIcon = weather.currently.icon;
                                    w.weatherCurrentlyPressure = parseInt(weather.currently.pressure);
                                    w.weatherCurrentlyVisibility = parseInt(weather.currently.visibility);
                                    w.weatherCurrentlyHumidity = parseInt(weather.currently.humidity);
                                    var newDate = new Date(parseInt(weather.currently.currentTime) * 1000);
                                    var day = newDate.getDate();
                                    var monthName = monthArray[newDate.getMonth()];
                                    w.weatherCurrentlyDate = 'Today, ' + monthName + ' ' + day;
                                }

                                var weekData = [];
                                $.each(weather.daily.data, function(idx, data) {
                                    if (idx > 0 && idx < 7) {
                                        var id = idx - 1,
                                            className = idx === 1 ? 'first' : '';
                                        var newDate = new Date(parseInt(data.currentTime) * 1000);
                                        var weekName = weekArray[newDate.getUTCDay()];
                                        var temperatureValue = parseInt((parseFloat(data.temperatureMin) +
                                        parseFloat(data.temperatureMax)) / 2);
                                        weekData[id] = {
                                            'week': weekName,
                                            'icon': data.icon,
                                            'temperature': temperatureValue,
                                            'class': className};
                                    }
                                });
                                w.weatherWeekDatas = weekData;
                                if (parseInt(weather.currently.windBearing, 10) >= 337 ||
                                    parseInt(weather.currently.windBearing, 10) < 23) {
                                    w.weatherWindBearing = 'arrow_0';
                                } else if (parseInt(weather.currently.windBearing, 10) >= 23 &&
                                    parseInt(weather.currently.windBearing, 10) < 68) {
                                    w.weatherWindBearing = 'arrow_0_90';
                                } else if (parseInt(weather.currently.windBearing, 10) >= 68 &&
                                    parseInt(weather.currently.windBearing, 10) < 113) {
                                    w.weatherWindBearing = 'arrow_90';
                                } else if (parseInt(weather.currently.windBearing, 10) >= 113 &&
                                    parseInt(weather.currently.windBearing, 10) < 158) {
                                    w.weatherWindBearing = 'arrow_90_180';
                                } else if (parseInt(weather.currently.windBearing, 10) >= 158 &&
                                    parseInt(weather.currently.windBearing, 10) < 203) {
                                    w.weatherWindBearing = 'arrow_180';
                                } else if (parseInt(weather.currently.windBearing, 10) >= 203 &&
                                    parseInt(weather.currently.windBearing, 10) < 248) {
                                    w.weatherWindBearing = 'arrow_180_270';
                                } else if (parseInt(weather.currently.windBearing, 10) >= 248 &&
                                    parseInt(weather.currently.windBearing, 10) < 293) {
                                    w.weatherWindBearing = 'arrow_270';
                                } else if (parseInt(weather.currently.windBearing, 10) >= 293 &&
                                    parseInt(weather.currently.windBearing, 10) < 337) {
                                    w.weatherWindBearing = 'arrow_270_360';
                                }
                            });
                        }
                        w.weatherTemperatureFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * 6.3
                                                        * w.parameters.width;
                        w.weatherSign1FontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * 3.5 * w.parameters.width;
                        w.weatherSign2FontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * 2 * w.parameters.width;
                        w.weatherSummary1FontSize = parseFloat(PCONFIG.ResponsiveValue.weather) *
                        parseFloat(w.parameters.normal1Font.size) * w.parameters.width;
                        w.weatherWindSpeedFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * 3
                                                    * w.parameters.width;
                        w.weatherMphFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) *  0.9 * w.parameters.width;
                        w.weatherMeasuresFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) *
                        parseFloat(w.parameters.normal2Font.size) * w.parameters.width;
                        w.weatherDateFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) *
                        parseFloat(w.parameters.headerFont.size) * w.parameters.width;
                        w.weatherSummary2FontSize = parseFloat(PCONFIG.ResponsiveValue.weather) *
                        parseFloat(w.parameters.normal1Font.size) * w.parameters.width;
                        w.weatherInfoFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * 2.5 * w.parameters.width;
                        w.weatherPercentFontSize = 0.8;
                        w.weatherWeekDayFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * 1.2
                                                    * w.parameters.width;
                        w.weatherWeekTemperatureFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * 2.5 *
                        w.parameters.width;
                        w.weatherSign3FontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * 1.8 * w.parameters.width;
                        w.weatherSign4FontSize = parseFloat(PCONFIG.ResponsiveValue.weather) * w.parameters.width;
                        break;
                    case 'Energy Equivalencies':
                        if (w.parameters.widgetEnergyOrientation === 'Horizontal') {
                            if (!resize) {
                                w.templateName = '/bl-bv-management/views/preview/horizontal-energy/';
                                switch (w.parameters.widgetEnergyType) {
                                    case 'Cars Removed':
                                        w.templateName += 'cars.html';
                                        break;
                                    case 'Energy Homes Generated':
                                        w.templateName += 'energy-home.html';
                                        break;
                                    case 'Waste Recycled':
                                        w.templateName += 'waste-tones.html';
                                        break;
                                    case 'Electricity Homes Generated':
                                        w.templateName += 'eletrcity-home.html';
                                        break;
                                    case 'Gallons Gas Saved':
                                        w.templateName += 'gallons.html';
                                        break;
                                    case 'Coal Eliminated':
                                        w.templateName += 'railcars.html';
                                        break;
                                    case 'Tanker Gas Saved':
                                        w.templateName += 'tanker.html';
                                        break;
                                    case 'Oil Unneeded':
                                        w.templateName += 'barrels.html';
                                        break;
                                    case 'Plants Idled':
                                        w.templateName += 'coal.html';
                                        break;
                                    case 'Forests Conversion Prevented':
                                        w.templateName += 'acres-corpland.html';
                                        break;
                                    case 'Propane Cylinders':
                                        w.templateName += 'propane.html';
                                        break;
                                    case 'Forests Preserved':
                                        w.templateName += 'acres.html';
                                        break;
                                    case 'Seedling Grown':
                                        w.templateName += 'tree.html';
                                        break;
                                }
                            }
                            w.parameters.energyTitleSize = PCONFIG.ResponsiveValue.energy.title *
                            parseFloat(w.parameters.headerFont.size) * w.parameters.width;
                            w.parameters.energyInveterValue = PCONFIG.ResponsiveValue.energy.inveterValue *
                            parseFloat(w.parameters.normal1Font.size) * w.parameters.width;
                            w.parameters.energyInveterName = PCONFIG.ResponsiveValue.energy.inveterName *
                            parseFloat(w.parameters.normal2Font.size) * w.parameters.width;
                            w.parameters.energyTopName = PCONFIG.ResponsiveValue.energy.topName * w.parameters.width;
                            w.parameters.energyLineFont = PCONFIG.ResponsiveValue.energy.lineFont * w.parameters.width;
                            w.parameters.energyPoundFont = PCONFIG.ResponsiveValue.energy['poundFont'] *
                            parseFloat(w.parameters.subHeaderFont.size) * w.parameters.width;
                        } else {
                            if (!resize) {
                                w.templateName = '/bl-bv-management/views/preview/verticalEnergy/';
                                switch (w.parameters.widgetEnergyType) {
                                    case 'Cars Removed':
                                        w.templateName += 'cars.html';
                                        break;
                                    case 'Energy Homes Generated':
                                        w.templateName += 'energy-home.html';
                                        break;
                                    case 'Waste Recycled':
                                        w.templateName += 'waste-tones.html';
                                        break;
                                    case 'Electricity Homes Generated':
                                        w.templateName += 'eletrcity-home.html';
                                        break;
                                    case 'Gallons Gas Saved':
                                        w.templateName += 'gallons.html';
                                        break;
                                    case 'Coal Eliminated':
                                        w.templateName += 'railcars.html';
                                        break;
                                    case 'Tanker Gas Saved':
                                        w.templateName += 'tanker.html';
                                        break;
                                    case 'Oil Unneeded':
                                        w.templateName += 'barrels.html';
                                        break;
                                    case 'Plants Idled':
                                        w.templateName += 'coal.html';
                                        break;
                                    case 'Forests Conversion Prevented':
                                        w.templateName += 'acres-corpland.html';
                                        break;
                                    case 'Propane Cylinders':
                                        w.templateName += 'propane.html';
                                        break;
                                    case 'Forests Preserved':
                                        w.templateName += 'acres.html';
                                        break;
                                    case 'Seedling Grown':
                                        w.templateName += 'tree.html';
                                        break;
                                }
                            }
                            if (!(w.parameters.widgetEnergyCO2Kilograms ||
                                w.parameters.widgetEnergyGreenhouseKilograms)) {
                                w.parameters.energyTitleSize = PCONFIG.ResponsiveValue.verticalEnergy.title1 *
                                parseFloat(w.parameters.headerFont.size) *
                                w.parameters.width;
                            } else if (!(w.parameters.widgetEnergyCO2Kilograms &&
                                w.parameters.widgetEnergyGreenhouseKilograms)) {
                                w.parameters.energyTitleSize = PCONFIG.ResponsiveValue.verticalEnergy.title2 *
                                parseFloat(w.parameters.headerFont.size) *
                                w.parameters.width;
                            } else if (w.parameters.widgetEnergyCO2Kilograms &&
                                w.parameters.widgetEnergyGreenhouseKilograms) {
                                w.parameters.energyTitleSize = PCONFIG.ResponsiveValue.verticalEnergy.title3 *
                                parseFloat(w.parameters.headerFont.size) *
                                w.parameters.width;
                            }

                            w.parameters.energyInveterValue = PCONFIG.ResponsiveValue.verticalEnergy.inveterValue *
                            parseFloat(w.parameters.normal1Font.size) *
                            w.parameters.width;
                            w.parameters.energyInveterName = PCONFIG.ResponsiveValue.verticalEnergy.inveterName *
                            parseFloat(w.parameters.normal2Font.size) *
                            w.parameters.width;
                            w.parameters.energyTopName = PCONFIG.ResponsiveValue.verticalEnergy.topName
                                                            * w.parameters.width;
                            w.parameters.energyLineFont = PCONFIG.ResponsiveValue.verticalEnergy.lineFont
                                                            * w.parameters.width;
                            w.parameters.energyPoundFont = PCONFIG.ResponsiveValue.verticalEnergy.poundFont *
                            parseFloat(w.parameters.subHeaderFont.size) *
                            w.parameters.width;
                        }
                        if (!resize) {
                            widgetService.getEnergyEquivalenciesWidget(w._id, $rootScope.presentationId)
                                .then(function (wd){
                                    console.log('EE widget data');
                                    console.log(wd);
                                    w.dataLoaded = true;
                                    var energyParam = {
                                        'widgetEnergyParamCars': wd.passengerVehiclesPerYear,
                                        'widgetEnergyParamCoal': wd.coalFiredPowerPlantEmissionsForOneYear,
                                        'widgetEnergyParamAcres': wd.acresOfUSForestsStoringCarbonForOneYear,
                                        'widgetEnergyParamAcresCorpland':
                                                                wd.acresOfUSForestPreservedFromConversionToCropland,
                                        'widgetEnergyParamBarrels': wd.barrelsOfOilConsumed,
                                        'widgetEnergyParamElectricityHome': wd.homeElectricityUse,
                                        'widgetEnergyParamEnergyHome': wd.homeEnergyUse,
                                        'widgetEnergyParamGallons': wd.gallonsOfGasoline,
                                        'widgetEnergyParamProPane': wd.propaneCylindersUsedForHomeBarbecues,
                                        'widgetEnergyParamRailcars': wd.railcarsOfCoalburned,
                                        'widgetEnergyParamTanker': wd.tankerTrucksFilledWithGasoline,
                                        'widgetEnergyParamTree': wd.numberOfTreeSeedlingsGrownFor10Years,
                                        'widgetEnergyParamTones': wd.tonsOfWasteRecycledInsteadOfLandfilled,
                                        'co2AvoidedInKilograms': wd.co2AvoidedInKilograms,
                                        'greenhouseEmissionsInKilograms': wd.greenhouseEmissionsInKilograms
                                    };
                                    angular.forEach(energyParam, function (val, key) {
                                        energyParam[key] = parseFloat(val).toFixed(3);
                                    });
                                    angular.extend(w.parameters, energyParam);
                                });
                        }
                        //$scope.drawEnergyWidget(widget._id, widget);
                        break;
                    case 'Graph':
                        if (!resize) {
                            w.templateName = '/bl-bv-management/views/preview/graph.html';
                            if (!w.parameters.headerFont.content) {
                                w.parameters.bodyHeight =  w.parameters.height;
                            } else {
                                w.parameters.bodyHeight = parseInt(w.parameters.height)
                                - (parseFloat(w.parameters.headerFont.size) * 14 + 10);
                            }
                            var secondColor = '#' + w.parameters.secondaryColor.color;
                            var thirdColor = '#' + w.parameters.tertiaryColor.color;
                            var fourthColor = '#' + w.parameters.fourthColor.color;
                            var fifthColor = '#' + w.parameters.fifthColor.color;
                            var sixthColor = '#' + w.parameters.sixthColor.color;
                            var seventhColor = '#' + w.parameters.seventhColor.color;

                            $scope.drawChart(w._id, false, w.parameters.width, w.parameters.height,
                                w.parameters.widgetGraphInterval, w.parameters.widgetGraphDateRange,
                                secondColor, thirdColor, fourthColor, fifthColor, sixthColor,
                                seventhColor, w.parameters.normal2Font.color,
                                w.parameters.normal2Font.size, w.parameters.normal2Font.name,
                                w.parameters.backgroundImage, w.parameters.backgroundColor);
                        } else {
                            if ($scope.highchartsNG[w._id]) {
                                angular.extend($scope.highchartsNG[w._id], {
                                    size: {
                                        'width': w.parameters.width,
                                        'height': w.parameters.height
                                    }
                                });
                            }
                        }
                        break;
                    case 'How Does Solar Work':
                        if (!w.parameters.headerFont.content) {
                            w.parameters.bodyHeight = w.parameters.height;
                        } else {
                            w.parameters.bodyHeight = parseInt(w.parameters.height)
                            - (parseFloat(w.parameters.headerFont.size) * 14 + 10);
                        }
                        w.templateName = '/bl-bv-management/views/preview/solar.html';
                        w.dataLoaded = true;
                        break;
                    case 'Solar Generation':
                        if (!resize) {
                            if (w.parameters.widgetSolarGenerationOrientation === 'Horizontal') {
                                w.templateName = '/bl-bv-management/views/preview/generation-horizontal.html';
                            } else {
                                w.templateName = '/bl-bv-management/views/preview/generation-vertical.html';
                            }
                        }

                        w.generationCurrentDisplay = w.parameters.widgetSolarGenerationCurrent ? 'block' : 'none';
                        w.generationTotalDisplay = w.parameters.widgetSolarGenerationkWh ? 'block' : 'none';

                        if (w.parameters.widgetSolarGenerationCurrent && w.parameters.widgetSolarGenerationkWh) {
                            w.generationTotalMarginTop = 5;
                            w.generationVerticalTotalMarginTop = 5;
                            w.generationVerticalTotalBorder = '1px solid #d8d7dd';
                            w.generationTopHeight = 21;
                            w.generationBottomHeight = 79;
                        } else {
                            w.generationTotalMarginTop = 0;
                            w.generationVerticalTotalMarginTop = 0;
                            w.generationVerticalTotalBorder = '0px';
                            w.generationTopHeight = 34;
                            w.generationBottomHeight = 66;
                        }

                        w.generationTitleFontSize = parseFloat(PCONFIG.ResponsiveValue.generation) *
                        parseFloat(w.parameters.headerFont.size) *
                        w.parameters.width;
                        // widget.generationSummaryFontSize = parseFloat(PCONFIG.ResponsiveValue.generation)
                        // * 1.7 * widget.parameters.width;
                        w.generationSummaryFontSize = 0.0024999468 * parseFloat(w.parameters.normal2Font.size) *
                        w.parameters.width;
                        w.generationReimbursementFontSize = 0.00277772 * parseFloat(w.parameters.subHeaderFont.size) *
                        w.parameters.width;
                        // widget.generationValueFontSize =
                        // parseFloat(PCONFIG.ResponsiveValue.generation) * 3.5 * widget.parameters.width;
                        w.generationValueFontSize = 0.0025734765 * parseFloat(w.parameters.normal1Font.size) *
                        w.parameters.width;
                        w.generationSignFontSize = 0.6;
                        w.generationDateFontSize = parseFloat(PCONFIG.ResponsiveValue.generation) * 0.7 *
                        w.parameters.width;

                        w.generationVerticalTitleFontSize = parseFloat(PCONFIG.ResponsiveValue.generationVertical) *
                                                        parseFloat(w.parameters.headerFont.size) * w.parameters.width;
                        w.generationVerticalSummaryFontSize = parseFloat(PCONFIG.ResponsiveValue.generationVertical)
                                                            * 1.8 * w.parameters.width;
                        w.generationVerticalValueFontSize = 2;
                        w.generationVerticalSignFontSize = 0.6;

                        if (!resize) {
                            widgetService.getSolarGenerationWidget(w._id, $rootScope.presentationId)
                                .then(function (generation){
                                    console.log('Soloar Generation Data', generation);
                                    console.log(generation);
                                    var newDate = new Date(generation.startDate),
                                        day = newDate.getDate(),
                                        year = newDate.getFullYear(),
                                        monthName = monthArray[newDate.getMonth()];
                                    w.dataLoaded = true;
                                    angular.extend(w, {
                                        'generationCurrentGeneration': parseInt(generation.currentGeneration),
                                        'generationkWhGenerated': parseInt(generation.kWhGenerated),
                                        'reimbursementValue': parseInt(generation.reimbursement),
                                        'generationSinceDate': monthName + ' ' + day + ', ' + year
                                    });
                                });
                        }
                        //$scope.getSoloarGenerationData(widget._id);
                        break;
                }
                return w;
            };

            $scope.getWeatherData = function () {
                var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'];
                var weekArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                widgetService.getWeatherWidget($rootScope.presentationId).then(function(weather) {
                    angular.forEach($rootScope.widgets, function(value, key) {
                        if ($rootScope.widgets[key]._id === $rootScope.widgetParam._id) {
                            $rootScope.widgets[key].dataLoaded = true;
                        }
                    });
                    console.log('Weather Data');
                    console.log(weather);
                    var newDate = new Date(parseInt(weather.currently.currentTime) * 1000),
                        day = newDate.getDate(),
                        monthName = monthArray[newDate.getMonth()],
                        weekData = [],
                        windBearing;

                    $.each(weather.daily.data, function(idx, data) {
                        if ((idx > 0) && (idx < 7)) {
                            var id = idx - 1,
                                className = idx === 1 ? 'first' : '';
                            var newDate = new Date(parseInt(data.currentTime) * 1000);
                            var weekName = weekArray[newDate.getUTCDay()];
                            var temperatureValue = parseInt((parseFloat(data.temperatureMin) +
                            parseFloat(data.temperatureMax)) / 2);
                            weekData[id] = {
                                'week': weekName,
                                'icon': data.icon,
                                'temperature': temperatureValue,
                                'class': className
                            };
                        }
                    });
                    console.log('Week Day', weekData);

                    if ((parseInt(weather.currently.windBearing, 10) >= 337)
                        || (parseInt(weather.currently.windBearing, 10) < 23)) {
                        windBearing = 'arrow_0';
                    } else if ((parseInt(weather.currently.windBearing, 10) >= 23)
                        && (parseInt(weather.currently.windBearing, 10) < 68)) {
                        windBearing = 'arrow_0_90';
                    } else if ((parseInt(weather.currently.windBearing, 10) >= 68)
                        && (parseInt(weather.currently.windBearing, 10) < 113)) {
                        windBearing = 'arrow_90';
                    } else if ((parseInt(weather.currently.windBearing, 10) >= 113)
                        && (parseInt(weather.currently.windBearing, 10) < 158)) {
                        windBearing = 'arrow_90_180';
                    } else if ((parseInt(weather.currently.windBearing, 10) >= 158)
                        && (parseInt(weather.currently.windBearing, 10) < 203)) {
                        windBearing = 'arrow_180';
                    } else if ((parseInt(weather.currently.windBearing, 10) >= 203)
                        && (parseInt(weather.currently.windBearing, 10) < 248)) {
                        windBearing = 'arrow_180_270';
                    } else if ((parseInt(weather.currently.windBearing, 10) >= 248)
                        && (parseInt(weather.currently.windBearing, 10) < 293)) {
                        windBearing = 'arrow_270';
                    } else if ((parseInt(weather.currently.windBearing, 10) >= 293)
                        && (parseInt(weather.currently.windBearing, 10) < 337)) {
                        windBearing = 'arrow_270_360';
                    }

                    angular.extend($rootScope.widgetParam, {
                        'weatherCurrentlyTemperature': parseInt(weather.currently.temperature),
                        'weatherCurrentlyTemperatureMin': parseInt(weather.daily.data[0].temperatureMin),
                        'weatherCurrentlyTemperatureMax': parseInt(weather.daily.data[0].temperatureMax),
                        'weatherCurrentlyWindSpeed': parseFloat(weather.currently.windSpeed),
                        'weatherCurrentlySummary': weather.currently.summary,
                        'weatherCurrentlyIcon': weather.currently.icon,
                        'weatherCurrentlyPressure': parseInt(weather.currently.pressure),
                        'weatherCurrentlyVisibility': parseInt(weather.currently.visibility),
                        'weatherCurrentlyHumidity': parseInt(weather.currently.humidity),
                        'weatherCurrentlyDate': 'Today, ' + monthName + ' ' + day,
                        'weatherWeekDatas': weekData,
                        'weatherWindBearing': windBearing
                    });
                    $scope.$apply();
                    toggleService.togglePleaseWait();
                });
            };

            $scope.getSolarGenerationData = function () {
                var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                    'October', 'November', 'December'];
                widgetService.getSolarGenerationWidget($rootScope.widgetParam._id, $rootScope.presentationId)
                    .then(function (generation) {
                        toggleService.togglePleaseWait();
                        angular.forEach($rootScope.widgets, function(value, key) {
                            if ($rootScope.widgets[key]._id === $rootScope.widgetParam._id) {
                                $rootScope.widgets[key].dataLoaded = true;
                            }
                        });

                        var newDate = new Date(generation.startDate),
                            day = newDate.getDate(),
                            year = newDate.getFullYear(),
                            monthName = monthArray[newDate.getMonth()];

                        console.log('Soloar Generation Data');
                        console.log(generation);
                        angular.extend($rootScope.widgetParam, {
                            'generationCurrentGeneration': parseInt(generation.currentGeneration),
                            'generationkWhGenerated': parseInt(generation.kWhGenerated),
                            'reimbursementValue': parseInt(generation.reimbursement),
                            'generationSinceDate': monthName + ' ' + day + ', ' + year
                        });
                    });
            };
            // End Get Widget Data Function

            // Start Get Widget Data Function
            // draw chart
            $scope.drawChart = function (widgetId, preview, width, height, interval, dateRange, secondColor,
                                         thirdColor, fourthColor, fifthColor, sixthColor, seventhColor,
                                         normal2FontColor, normal2FontSize, normal2FontName,
                                         backgroundImage, backgroundColor) {

                $scope.highchartsNG[preview ? 'preview' : widgetId] = {
                    loading: true,
                    exporting: {
                        enabled: false
                    }
                };
                if (preview) {
                    toggleService.showPleaseWait();
                }

                widgetService.getGraphWidget(widgetId, $rootScope.presentationId).then(function(res) {
                    console.log('graphic widget data', res);

                    angular.forEach($rootScope.widgets, function(value, key) {
                        if ($rootScope.widgets[key]._id === widgetId) {
                            $rootScope.widgets[key].dataLoaded = true;
                        }
                    });

                    if (!res.series || !res) {
                        //TODO: handle error
                        angular.element('#preview')
                            .html('<p style=\'color: red;\'> Oops! Seems like something wrong. Try again!</p>');
                        return;
                    } else if (!res.series.length) {
                        angular.element('#preview')
                            .html('<p style=\'color: red;\'> Oops! No widget data </p>');
                        return;
                    }

                    var maxTime = 0,
                        minTime = 0;

                    angular.extend(res, {
                        legend: {
                            enabled: true,
                            verticalAlign: 'top',
                            shadow: false,
                            borderColor: '#ccc',
                            labelFormatter: function () {
                                return this.name.split(' ')[0];
                            }
                        },
                        size: {
                            'width': width,
                            'height': height
                        },
                        loading: false
                    });
                    // extend legend options
                    // floating: true,
                    // useHTML: true


                    angular.forEach(res.series, function (s) {
                        if (s.data.length > 0) {
                            var temp = s.data[s.data.length - 1].x;
                            if (temp >= maxTime) {
                                maxTime = temp;
                            }
                        }
                    });

                    minTime = maxTime;
                    angular.forEach(res.series, function (s) {
                        if (s.data.length > 0) {
                            var temp = s.data[0].x;
                            if (temp <= minTime) {
                                minTime = temp;
                            }
                        }
                    });

                    var /*tickInterval = (maxTime - minTime) / 7,*/
                        chartContainer = preview ? '#chartPreview' : '#chartContainer-' + widgetId;

                    //TODO: can optimize
                    angular.forEach(res.yAxis, function (yAxis, idx) {
                        var axisColor = '#000';
                        switch (yAxis.title.text) {
                            case 'Current Power':
                                axisColor = fifthColor;
                                break;
                            case 'Humidity':
                                axisColor = fourthColor;
                                break;
                            case 'Temperature':
                                axisColor = thirdColor;
                                break;
                            case 'Max Power':
                                axisColor = sixthColor;
                                break;
                            case 'Weather':
                                axisColor = seventhColor;
                                break;
                            case 'Generation':
                                axisColor = secondColor;
                                break;
                        }
                        res.series[idx].color = axisColor;
                        angular.extend(yAxis.title.style, {
                            'color': axisColor
                        });
                        yAxis.title.text = '';
                        yAxis.opposite = res.series[idx].type !== 'spline';
                    });

                    if ((interval === 'Hourly') && (dateRange === '3 Days')) {
                        angular.extend(res.xAxis, {
                            dateTimeLabelFormats: {
                                hour: '%l%P',
                                day: '%l%P',
                                week: '%e %b',
                                month: '%b %y',
                                year: '%b %y'
                            },
                            lineWidth: 4,
                            lineColor: '#666'
                        });
                    } else {
                        angular.extend(res.xAxis, {
                            dateTimeLabelFormats: {
                                hour: '%l%P',
                                day: '%e %b',
                                week: '%e %b',
                                month: '%b %y',
                                year: '%b %y'
                            },
                            lineWidth: 4,
                            lineColor: '#666'
                        });
                    }
                    if (!backgroundImage) {
                        angular.extend(res, {
                            options: {
                                'chart': {
                                    backgroundColor: '#' + backgroundColor
                                }
                            }
                        });
                    } else {
                        angular.element(chartContainer).css('background-image', 'url(' + backgroundImage + ')');
                    }
                    $scope.highchartsNG[preview ? 'preview' : widgetId] = res;
                    if (preview) {
                        toggleService.hidePleaseWait();
                    }
                });
            };

            // get Energy widget data
            $scope.drawEnergyWidget = function (widgetId) {

                widgetService.getEnergyEquivalenciesWidget(widgetId, $rootScope.presentationId).then(function(wd) {
                    angular.forEach($rootScope.widgets, function(value, key) {
                        if ($rootScope.widgets[key]._id === widgetId) {
                            $rootScope.widgets[key].dataLoaded = true;
                        }
                    });

                    //newly added

                    var energyParam = {
                        'widgetEnergyParamCars': wd.passengerVehiclesPerYear,
                        'widgetEnergyParamCoal': wd.coalFiredPowerPlantEmissionsForOneYear,
                        'widgetEnergyParamAcres': wd.acresOfUSForestsStoringCarbonForOneYear,
                        'widgetEnergyParamAcresCorpland': wd.acresOfUSForestPreservedFromConversionToCropland,
                        'widgetEnergyParamBarrels': wd.barrelsOfOilConsumed,
                        'widgetEnergyParamElectricityHome': wd.homeElectricityUse,
                        'widgetEnergyParamEnergyHome': wd.homeEnergyUse,
                        'widgetEnergyParamGallons': wd.gallonsOfGasoline,
                        'widgetEnergyParamProPane': wd.propaneCylindersUsedForHomeBarbecues,
                        'widgetEnergyParamRailcars': wd.railcarsOfCoalburned,
                        'widgetEnergyParamTanker': wd.tankerTrucksFilledWithGasoline,
                        'widgetEnergyParamTree': wd.numberOfTreeSeedlingsGrownFor10Years,
                        'widgetEnergyParamTones': wd.tonsOfWasteRecycledInsteadOfLandfilled,
                        'co2AvoidedInKilograms': wd.co2AvoidedInKilograms,
                        'greenhouseEmissionsInKilograms': wd.greenhouseEmissionsInKilograms
                    };
                    angular.forEach(energyParam, function (val, key) {
                        energyParam[key] = parseFloat(val).toFixed(3);
                    });
                    // newly added end here

                    angular.extend($rootScope.widgetParam.parameters, energyParam);

                    toggleService.togglePleaseWait();
                });
            };

            //Yakov
            //Backward Widget Handler
            $scope.backwardWidget = function (widgetId) {
                if ($rootScope.presentationDetails.bpLock) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                var maxRowPosition = 0;
                $.each($scope.$root.widgets, function(idx, obj) {
                    if (obj.parameters.timelineRowPosition > maxRowPosition) {
                        maxRowPosition = obj.parameters.timelineRowPosition;
                    }
                });
                var widgetParam = $.grep($scope.$root.widgets, function(e){ return e._id === widgetId;})[0];
                if (widgetParam.parameters.timelineRowPosition === maxRowPosition) { return; }
                widgetParam.parameters.previousTimelineRowPosition = widgetParam.parameters.timelineRowPosition;
                var widgetParam2 = $.grep($scope.$root.widgets, function(e){
                    return e.parameters.timelineRowPosition === widgetParam.parameters.timelineRowPosition + 1;
                })[0];
                widgetParam2.parameters.previousTimelineRowPosition = widgetParam2.parameters.timelineRowPosition;
                widgetParam2.parameters.timelineRowPosition = widgetParam.parameters.timelineRowPosition;
                widgetParam.parameters.timelineRowPosition = widgetParam.parameters.timelineRowPosition + 1;
                $scope.widgetParam = widgetParam;
                toggleService.togglePleaseWait();
                widgetService.saveWidget(
                  $rootScope.presentationId, widgetParam, true, $scope, $compile, 'save', false);
                widgetService.saveWidget(
                  $rootScope.presentationId, widgetParam2, true, $scope, $compile, 'save', false);
            };

            //Forward Widget Handler
            $scope.forwardWidget = function (widgetId) {
                if ($rootScope.presentationDetails.bpLock) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                var minRowPosition = 9999999999;
                $.each($scope.$root.widgets, function(idx, obj) {
                    if (obj.parameters.timelineRowPosition < minRowPosition) {
                        minRowPosition = obj.parameters.timelineRowPosition;
                    }
                });
                var widgetParam = $.grep($scope.$root.widgets, function(e){ return e._id === widgetId;})[0];
                if (widgetParam.parameters.timelineRowPosition === minRowPosition) { return; }
                widgetParam.parameters.previousTimelineRowPosition = widgetParam.parameters.timelineRowPosition;
                var widgetParam2 = $.grep($scope.$root.widgets, function(e){
                    return e.parameters.timelineRowPosition === widgetParam.parameters.timelineRowPosition - 1;
                })[0];
                widgetParam2.parameters.previousTimelineRowPosition = widgetParam2.parameters.timelineRowPosition;
                widgetParam2.parameters.timelineRowPosition = widgetParam.parameters.timelineRowPosition;
                widgetParam.parameters.timelineRowPosition = widgetParam.parameters.timelineRowPosition - 1;
                $scope.widgetParam = widgetParam;
                toggleService.togglePleaseWait();
                widgetService.saveWidget($rootScope.presentationId, widgetParam, true, $scope, $compile, 'save', false);
                widgetService.saveWidget(
                  $rootScope.presentationId, widgetParam2, true, $scope, $compile, 'save', false);
            };

            // Start Open Widget Detail Modal Function
            $rootScope.openEditfieldModal = function (componentType, widgetInstanceID, row, col, preview) {
                $rootScope.isCanvasPlaying = false;
                if(!$scope.markerAction){
                    if ($('.handle-button').hasClass('handle-selected2')) {
                        $('.handle-button').click();
                    }
                    if (preview) {
                        $('#editfield_dlg .modal-body ul li:last-child')
                            .addClass('active').siblings('.active').removeClass('active');
                        $('#editfield_dlg .modal-body .tab-pane:last-child')
                            .addClass('active').siblings('.active').removeClass('active');
                        $('#editfield_dlg .modal-body .tab-pane:last-child')
                            .addClass('in').siblings('.in').removeClass('in');
                        toggleService.togglePleaseWait();
                    } else{
                        $('#editfield_dlg .modal-body ul li:first-child')
                            .addClass('active').siblings('.active').removeClass('active');
                        $('#editfield_dlg .modal-body .tab-pane:first-child')
                            .addClass('active').siblings('.active').removeClass('active');
                        $('#editfield_dlg .modal-body .tab-pane:first-child')
                            .addClass('in').siblings('.in').removeClass('in');
                        $('#editfield_dlg div.modal-body').animate({ scrollTop: 0 }, 600);
                    }

                    $timeout(function(){
                        var wp = {},
                            rootWP = {};
                        if (typeof widgetInstanceID !== 'undefined' && widgetInstanceID !== null) {
                            console.log('when edit widget');
                            console.log(widgetInstanceID);
                            wp = $.grep($rootScope.widgets, function(e){ return e._id === widgetInstanceID;})[0];
                            $scope.editFlag = true;
                        } else {
                            console.log('when save widget');
                            console.log(widgetInstanceID);
                            wp = $.grep($rootScope.dynamicWidgets, function(e){ return e.id === componentType;})[0];
                            $scope.editFlag = false;
                        }
                        angular.copy(wp, rootWP);

                        console.log(rootWP);

                        // separate start point
                        var pointArray = (rootWP.parameters.startDate).split(':');
                        rootWP.parameters.startDateMin = pointArray[0];
                        rootWP.parameters.startDateSec = pointArray[1];

                        // set position for widget
                        angular.extend(rootWP.parameters, {
                            'rowPosition': row,
                            'colPosition': col,
                            'left': col * PCONFIG.GridWidth + col - 1,
                            'top': row * PCONFIG.GridHeight  + row + 2,
                            'height': PCONFIG.GridHeight * parseInt(rootWP.parameters.rowCount) +
                            parseInt(rootWP.parameters.rowCount) - 1,
                            'width': PCONFIG.GridWidth * parseInt(rootWP.parameters.colCount) +
                            parseInt(rootWP.parameters.colCount) - 1
                        });

                        // set image url
                        $('#backgroungImage').val(rootWP.parameters.backgroundImage);
                        if (rootWP.name === 'Image') {
                            $('#imageURL').val(rootWP.parameters.widgetURL);
                        }
                        if (rootWP.name === 'Video') {
                            $('#videoURL').val(rootWP.parameters.widgetURL);
                        }

                        // convert startDate and endDate
                        angular.forEach(rootWP.parameters, function (val, key) {
                            if (key.match('StartDate$') || key.match('EndDate$')) {
                                rootWP.parameters[key] = $scope.dateFormatConvert(val);
                            }
                        });

                        // control fontpicker
                        $('#editfield_dlg .fontSelect').each(function (){
                            $(this).attr('fontpicker', 'fontpicker');
                            var htmlFont = $(this).parent().html();
                            $(this).parent().html($compile(htmlFont)($scope));
                        });

                        // control colorpiker
                        $('#editfield_dlg .color_pickers').each(function (){
                            $(this).attr('colorpicker', 'colorpicker');
                            var htmlColor = $(this).parent().html();
                            $(this).parent().html($compile(htmlColor)($scope));
                        });


                        //show startDate and endDate by Date Range
                        rootWP.graphCustom = rootWP.parameters.widgetGraphDateRange === '-- Custom --';
                        rootWP.generationCustom = rootWP.parameters.widgetSolarGenerationDateRange === '-- Custom --';
                        rootWP.energyCustom = rootWP.parameters.widgetEnergyDateRange === '-- Custom --';

                        // include custom block
                        /*var html = '';*/
                        switch (rootWP.name)
                        {
                            case 'iFrame':
                                $scope.templateCustom = '/bl-bv-management/views/custom/iframe.html';
                                break;
                            case 'Image':
                                $scope.templateCustom = '/bl-bv-management/views/custom/image.html';
                                break;
                            case 'Video':
                                $scope.templateCustom = '/bl-bv-management/views/custom/video.html';
                                break;
                            case 'TextArea':
                                $scope.templateCustom = '/bl-bv-management/views/custom/textarea.html';
                                break;
                            case 'kWh Generated':
                                $scope.templateCustom = '/bl-bv-management/views/custom/kwh.html';
                                break;
                            case 'Weather':
                                $scope.templateCustom = '/bl-bv-management/views/custom/weather.html';
                                break;
                            case 'Energy Equivalencies':
                                $scope.templateCustom = '/bl-bv-management/views/custom/energy.html';
                                break;
                            case 'Graph':
                                $scope.templateCustom = '/bl-bv-management/views/custom/graph.html';
                                // limited interval function
                                break;
                            case 'How Does Solar Work':
                                $scope.templateCustom = '/bl-bv-management/views/custom/solar.html';
                                $scope.widgetHowDoesSolarWorkStepOneDuration =
                                    rootWP.parameters.widgetHowDoesSolarWorkStepOneDuration;
                                $scope.widgetHowDoesSolarWorkStepTwoDuration =
                                    rootWP.parameters.widgetHowDoesSolarWorkStepTwoDuration;
                                $scope.widgetHowDoesSolarWorkStepThreeDuration =
                                    rootWP.parameters.widgetHowDoesSolarWorkStepThreeDuration;
                                $scope.widgetHowDoesSolarWorkStepFourDuration =
                                    rootWP.parameters.widgetHowDoesSolarWorkStepFourDuration;
                                $scope.howDoesSolarWorkDuration = rootWP.parameters.duration;
                                break;
                            case 'Solar Generation':
                                $scope.templateCustom = '/bl-bv-management/views/custom/generation.html';
                                break;
                        }

                        $rootScope.widgetParam = rootWP;

                        if (preview) {
                            $scope.previewModal();
                        }
                    }, 10);
                }

                var cbForTextarea = function () {
                    if (!tinymce.editors['textareaWidget']) {
                        tinymce.init({
                            'selector': '#textareaWidget',
                            'plugins': 'link',
                            'relative_urls': true,
                            'height': '330',
                            'toolbar': ['undo redo', 'formatselect', 'fontsizeselect', 'bold italic',
                                'alignleft aligncenter alignright alignjustify', 'bullist numlist outdent indent',
                                'link image'].join(' | '),
                            'fontsize_formats': '0.75em 1em 1.2em 1.5em 1.8em 2em 2.45em 3em',
                            'setup': function (ed) {
                                ed.on('init', function() {
                                    tinymce.activeEditor.setContent(
                                        $rootScope.widgetParam.parameters.widgetTextareaContent || '');
                                });
                            }
                        });
                    } else {
                        tinymce.activeEditor.setContent($rootScope.widgetParam.parameters.widgetTextareaContent || '');
                    }
                };

                if($scope.markerAction) {
                    $scope.markerAction = false;
                } else {
                    $('#editfield_dlg').modal().on('shown.bs.modal', function (e) {
                        if ($rootScope.widgetParam.name === 'TextArea') {
                            cbForTextarea();
                        }
                    });
                }
            };
            // End Open Widget Detail Modal Function



            // Open Preview Modal Function
            $scope.previewModal = function() {
                var rootWP = $rootScope.widgetParam;
                switch (rootWP.name)
                {
                    case 'iFrame':
                        /*
                         notyfy({
                         text: '<strong>iFrame can only be previewed directly in the presentation.' +
                         'To preview, move the timeline to the iFrame and then click the ' +
                         ''Play Presentation' button.</strong><br><div class='click-close'>' +
                         '{Click this bar to Close}',
                         type: 'warning',
                         dismissQueue: true
                         });
                         */
                        if (!rootWP.parameters.headerFont.content) {
                            rootWP.parameters.bodyHeight = rootWP.parameters.height;
                        } else {
                            rootWP.parameters.bodyHeight = parseInt(rootWP.parameters.height)
                            - (parseFloat(rootWP.parameters.headerFont.size) * 14 + 10);
                        }
                        $scope.templatePreview =  '/bl-bv-management/views/preview/iframe.html';
                        toggleService.togglePleaseWait();
                        break;
                    case 'Image':
                        if (!rootWP.parameters.headerFont.content) {
                            rootWP.parameters.bodyHeight = rootWP.parameters.height;
                        } else {
                            rootWP.parameters.bodyHeight = parseInt(rootWP.parameters.height)
                            - (parseFloat(rootWP.parameters.headerFont.size) * 14 + 10);
                        }
                        $scope.templatePreview =  '/bl-bv-management/views/preview/image.html';
                        toggleService.togglePleaseWait();
                        break;
                    case 'Video':
                        if (!rootWP.parameters.headerFont.content) {
                            rootWP.parameters.bodyHeight = rootWP.parameters.height;
                        } else {
                            rootWP.parameters.bodyHeight = parseInt(rootWP.parameters.height)
                              - (parseFloat(rootWP.parameters.headerFont.size) * 14 + 10);
                        }
                        $scope.templatePreview =  '/bl-bv-management/views/preview/video.html';
                        toggleService.togglePleaseWait();
                        break;
                    case 'TextArea':
                        if (!rootWP.parameters.headerFont.content) {
                            rootWP.parameters.bodyHeight = rootWP.parameters.height;
                        } else {
                            rootWP.parameters.bodyHeight = parseInt(rootWP.parameters.height)
                            - (parseFloat(rootWP.parameters.headerFont.size) * 14 + 10);
                        }
                        var safeContent = $sce.trustAsHtml(rootWP.parameters.widgetTextareaContent);
                        rootWP.parameters.widgetComplieTextareaContent = safeContent;

                        rootWP.parameters.backgroundShowImage = rootWP.parameters.backgroundImage
                            ? 'url(' +  rootWP.parameters.backgroundImage + ') no-repeat'
                            : 'none';
                        $scope.templatePreview =  '/bl-bv-management/views/preview/textarea.html';
                        toggleService.togglePleaseWait();
                        break;
                    case 'Weather':
                        if (rootWP.parameters.widgetWeatherType === 'Minimal') {
                            $scope.templatePreview =  '/bl-bv-management/views/preview/weather-minimal.html';
                        } else {
                            $scope.templatePreview =  '/bl-bv-management/views/preview/weather-detailed.html';
                        }

                        $scope.getWeatherData();
                        angular.extend(rootWP, {
                            weatherCurrentlyIcon: 'clear-day',
                            weatherWindBearing: 'arrow_0',
                            weatherTemperatureFontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * 6.3
                                                        * rootWP.parameters.width,
                            weatherSign1FontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * 3.5
                                                  * rootWP.parameters.width,
                            weatherSign2FontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * 2
                                                  * rootWP.parameters.width,
                            weatherSummary1FontSize: parseFloat(PCONFIG.ResponsiveValue.weather)
                                                     * parseFloat(rootWP.parameters.normal1Font.size)
                                                     * rootWP.parameters.width,
                            weatherWindSpeedFontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * 3
                                                      * rootWP.parameters.width,
                            weatherMphFontSize: parseFloat(PCONFIG.ResponsiveValue.weather) *  0.9
                                                * rootWP.parameters.width,
                            weatherMeasuresFontSize: parseFloat(PCONFIG.ResponsiveValue.weather)
                                                     * parseFloat(rootWP.parameters.normal2Font.size)
                                                     * rootWP.parameters.width,
                            weatherDateFontSize: parseFloat(PCONFIG.ResponsiveValue.weather)
                                                 * parseFloat(rootWP.parameters.headerFont.size)
                                                 * rootWP.parameters.width,
                            weatherSummary2FontSize: parseFloat(PCONFIG.ResponsiveValue.weather)
                                                     * parseFloat(rootWP.parameters.normal1Font.size)
                                                     *  rootWP.parameters.width,
                            weatherInfoFontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * 2.5
                                                 * rootWP.parameters.width,
                            weatherPercentFontSize: 0.8,
                            weatherWeekDayFontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * 1.2
                                                    * rootWP.parameters.width,
                            weatherWeekTemperatureFontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * 2.5
                            * rootWP.parameters.width,
                            weatherSign3FontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * 1.8
                                                  * rootWP.parameters.width,
                            weatherSign4FontSize: parseFloat(PCONFIG.ResponsiveValue.weather) * rootWP.parameters.width,
                            weatherliTagWidth: (parseFloat(rootWP.parameters.width) - 5) / 6
                        });
                        break;
                    case 'Energy Equivalencies':
                        if (rootWP.parameters.widgetEnergyOrientation === 'Horizontal') {
                            $scope.templatePreview = '/bl-bv-management/views/preview/horizontal-energy/';
                            switch (rootWP.parameters.widgetEnergyType) {
                                case 'Cars Removed':
                                    $scope.templatePreview += 'cars.html';
                                    break;
                                case 'Energy Homes Generated':
                                    $scope.templatePreview += 'energy-home.html';
                                    break;
                                case 'Waste Recycled':
                                    $scope.templatePreview += 'waste-tones.html';
                                    break;
                                case 'Electricity Homes Generated':
                                    $scope.templatePreview += 'eletrcity-home.html';
                                    break;
                                case 'Gallons Gas Saved':
                                    $scope.templatePreview += 'gallons.html';
                                    break;
                                case 'Coal Eliminated':
                                    $scope.templatePreview += 'railcars.html';
                                    break;
                                case 'Tanker Gas Saved':
                                    $scope.templatePreview += 'tanker.html';
                                    break;
                                case 'Oil Unneeded':
                                    $scope.templatePreview += 'barrels.html';
                                    break;
                                case 'Plants Idled':
                                    $scope.templatePreview += 'coal.html';
                                    break;
                                case 'Forests Conversion Prevented':
                                    $scope.templatePreview += 'acres-corpland.html';
                                    break;
                                case 'Propane Cylinders':
                                    $scope.templatePreview += 'propane.html';
                                    break;
                                case 'Forests Preserved':
                                    $scope.templatePreview += 'acres.html';
                                    break;
                                case 'Seedling Grown':
                                    $scope.templatePreview += 'tree.html';
                                    break;
                            }
                            angular.extend(rootWP.parameters, {
                                'energyTitleSize': parseFloat(PCONFIG.ResponsiveValue.energy.title)
                                * parseFloat(rootWP.parameters.headerFont.size)
                                * rootWP.parameters.width,
                                'energyInveterValue': parseFloat(PCONFIG.ResponsiveValue.energy['inveterValue'])
                                * parseFloat(rootWP.parameters.normal1Font.size)
                                * rootWP.parameters.width,
                                'energyInveterName': parseFloat(PCONFIG.ResponsiveValue.energy['inveterName'])
                                * parseFloat(rootWP.parameters.normal2Font.size)
                                * rootWP.parameters.width,
                                'energyTopName': parseFloat(PCONFIG.ResponsiveValue.energy['topName'])
                                * rootWP.parameters.width,
                                'energyLineFont': parseFloat(PCONFIG.ResponsiveValue.energy['lineFont'])
                                * rootWP.parameters.width,
                                'energyPoundFont': parseFloat(PCONFIG.ResponsiveValue.energy['poundFont'])
                                * parseFloat(rootWP.parameters.subHeaderFont.size)
                                * rootWP.parameters.width
                            });
                        } else {
                            $scope.templatePreview = '/bl-bv-management/views/preview/verticalEnergy/';
                            switch (rootWP.parameters.widgetEnergyType) {
                                case 'Cars Removed':
                                    $scope.templatePreview += 'cars.html';
                                    break;
                                case 'Energy Homes Generated':
                                    $scope.templatePreview += 'energy-home.html';
                                    break;
                                case 'Waste Recycled':
                                    $scope.templatePreview += 'waste-tones.html';
                                    break;
                                case 'Electricity Homes Generated':
                                    $scope.templatePreview += 'eletrcity-home.html';
                                    break;
                                case 'Gallons Gas Saved':
                                    $scope.templatePreview += 'gallons.html';
                                    break;
                                case 'Coal Eliminated':
                                    $scope.templatePreview += 'railcars.html';
                                    break;
                                case 'Tanker Gas Saved':
                                    $scope.templatePreview += 'tanker.html';
                                    break;
                                case 'Oil Unneeded':
                                    $scope.templatePreview += 'barrels.html';
                                    break;
                                case 'Plants Idled':
                                    $scope.templatePreview += 'coal.html';
                                    break;
                                case 'Forests Conversion Prevented':
                                    $scope.templatePreview += 'acres-corpland.html';
                                    break;
                                case 'Propane Cylinders':
                                    $scope.templatePreview += 'propane.html';
                                    break;
                                case 'Forests Preserved':
                                    $scope.templatePreview += 'acres.html';
                                    break;
                                case 'Seedling Grown':
                                    $scope.templatePreview += 'tree.html';
                                    break;

                            }

                            if (!(rootWP.parameters.widgetEnergyCO2Kilograms
                                || rootWP.parameters.widgetEnergyGreenhouseKilograms)) {
                                rootWP.parameters.energyTitleSize =
                                    parseFloat(PCONFIG.ResponsiveValue['verticalEnergy'].title1)
                                    * parseFloat(rootWP.parameters.headerFont.size)
                                    * rootWP.parameters.width;
                            } else if (!(rootWP.parameters.widgetEnergyCO2Kilograms
                                && rootWP.parameters.widgetEnergyGreenhouseKilograms)) {
                                rootWP.parameters.energyTitleSize =
                                    parseFloat(PCONFIG.ResponsiveValue['verticalEnergy'].title2)
                                    * parseFloat(rootWP.parameters.headerFont.size)
                                    * rootWP.parameters.width;
                            } else if (rootWP.parameters.widgetEnergyCO2Kilograms
                                && rootWP.parameters.widgetEnergyGreenhouseKilograms) {
                                rootWP.parameters.energyTitleSize =
                                    parseFloat(PCONFIG.ResponsiveValue['verticalEnergy'].title3)
                                    * parseFloat(rootWP.parameters.headerFont.size)
                                    * rootWP.parameters.width;
                            }
                            angular.extend(rootWP.parameters, {
                                energyInveterValue:parseFloat(PCONFIG.ResponsiveValue['verticalEnergy']['inveterValue'])
                                * parseFloat(rootWP.parameters.normal1Font.size)
                                * rootWP.parameters.width,
                                energyInveterName: parseFloat(PCONFIG.ResponsiveValue['verticalEnergy']['inveterName'])
                                * parseFloat(rootWP.parameters.normal2Font.size)
                                * rootWP.parameters.width,
                                energyTopName: parseFloat(PCONFIG.ResponsiveValue['verticalEnergy']['topName'])
                                * rootWP.parameters.width,
                                energyLineFont: parseFloat(PCONFIG.ResponsiveValue['verticalEnergy']['lineFont'])
                                * rootWP.parameters.width,
                                energyPoundFont: parseFloat(PCONFIG.ResponsiveValue['verticalEnergy']['poundFont'])
                                * parseFloat(rootWP.parameters.subHeaderFont.size)
                                * rootWP.parameters.width
                            });
                        }
                        $scope.drawEnergyWidget(rootWP._id);
                        break;
                    case 'Graph':
                        if (!rootWP.parameters.headerFont.content) {
                            rootWP.parameters.bodyHeight = rootWP.parameters.height;
                        } else {
                            rootWP.parameters.bodyHeight = parseInt(rootWP.parameters.height) -
                            (parseFloat(rootWP.parameters.headerFont.size) * 14 + 10);
                        }

                        $scope.templatePreview =  '/bl-bv-management/views/preview/preview-graph.html';
                        var secondColor = '#' + rootWP.parameters.secondaryColor.color;
                        var thirdColor = '#' + rootWP.parameters.tertiaryColor.color;
                        var fourthColor = '#' + rootWP.parameters.fourthColor.color;
                        var fifthColor = '#' + rootWP.parameters.fifthColor.color;
                        var sixthColor = '#' + rootWP.parameters.sixthColor.color;
                        var seventhColor = '#' + rootWP.parameters.seventhColor.color;
                        $scope.drawChart(rootWP._id, true, rootWP.parameters.width, rootWP.parameters.bodyHeight,
                            rootWP.parameters.widgetGraphInterval, rootWP.parameters.widgetGraphDateRange,
                            secondColor, thirdColor, fourthColor, fifthColor, sixthColor,
                            seventhColor, rootWP.parameters.normal2Font.color,
                            rootWP.parameters.normal2Font.size, rootWP.parameters.normal2Font.name,
                            rootWP.parameters.backgroundImage, rootWP.parameters.backgroundColor);
                        break;
                    case 'How Does Solar Work':
                        $rootScope.solarShowSteps = false;
                        $rootScope.initHDSW();
                        if (!rootWP.headerFont.content) {
                            rootWP.parameters.bodyHeight = rootWP.parameters.height;
                        } else {
                            rootWP.parameters.bodyHeight = parseInt(rootWP.parameters.height) -
                            (parseFloat(rootWP.parameters.headerFont.size) * 14 + 10);
                        }

                        $rootScope.sunAnimation();
                        $rootScope.solarDurationStep1(rootWP.parameters.widgetHowDoesSolarWorkStepOneDuration,
                            rootWP.parameters.widgetHowDoesSolarWorkStepTwoDuration,
                            rootWP.parameters.widgetHowDoesSolarWorkStepThreeDuration,
                            rootWP.parameters.widgetHowDoesSolarWorkStepFourDuration,
                            rootWP.parameters.widgetHowDoesSolarWorkStepOneText,
                            rootWP.parameters.widgetHowDoesSolarWorkStepTwoText,
                            rootWP.parameters.widgetHowDoesSolarWorkStepThreeText,
                            rootWP.parameters.widgetHowDoesSolarWorkStepFourText,
                            'preview .how-does-solar-widget');
                        $scope.templatePreview =  '/bl-bv-management/views/preview/solar.html';
                        toggleService.togglePleaseWait();
                        $timeout(function() {
                            $rootScope.solarShowSteps = true;
                        }, 800);
                        break;
                    case 'Solar Generation':
                        if (rootWP.parameters.widgetSolarGenerationOrientation === 'Horizontal') {
                            $scope.templatePreview =  '/bl-bv-management/views/preview/generation-horizontal.html';
                        } else {
                            $scope.templatePreview =  '/bl-bv-management/views/preview/generation-vertical.html';
                        }

                        rootWP.generationCurrentDisplay = rootWP.parameters.widgetSolarGenerationCurrent
                            ? 'block' : 'none';
                        rootWP.generationTotalDisplay = rootWP.parameters.widgetSolarGenerationkWh
                            ? 'block' : 'none';

                        if (rootWP.parameters.widgetSolarGenerationCurrent
                            && rootWP.parameters.widgetSolarGenerationkWh) {
                            rootWP.generationTotalMarginTop = 5;
                            rootWP.generationVerticalTotalMarginTop = 5;
                            rootWP.generationVerticalTotalBorder = '1px solid #d8d7dd';
                            rootWP.generationTopHeight = 21;
                            rootWP.generationBottomHeight = 79;
                        } else {
                            rootWP.generationTotalMarginTop = 0;
                            rootWP.generationVerticalTotalMarginTop = 0;
                            rootWP.generationVerticalTotalBorder = '0px';
                            rootWP.generationTopHeight = 34;
                            rootWP.generationBottomHeight = 66;
                        }

                        rootWP.generationTitleFontSize = parseFloat(PCONFIG.ResponsiveValue.generation)
                        * parseFloat(rootWP.parameters.headerFont.size)
                        * rootWP.parameters.width;
                        rootWP.generationSummaryFontSize = 0.0024999468 * parseFloat(rootWP.parameters.normal2Font.size)
                        * rootWP.parameters.width;
                        rootWP.generationReimbursementFontSize = 0.00277772
                        * parseFloat(rootWP.parameters.subHeaderFont.size)
                        * rootWP.parameters.width;
                        rootWP.generationValueFontSize = 0.0025734765
                        * parseFloat(rootWP.parameters.normal1Font.size)
                        * rootWP.parameters.width;
                        rootWP.generationSignFontSize = 0.6;
                        rootWP.generationDateFontSize = parseFloat(PCONFIG.ResponsiveValue.generation) * 0.7
                        * rootWP.parameters.width;

                        rootWP.generationVerticalTitleFontSize = parseFloat(PCONFIG.ResponsiveValue.generationVertical)
                                            * parseFloat(rootWP.parameters.headerFont.size) * rootWP.parameters.width;
                        rootWP.generationVerticalSummaryFontSize =parseFloat(PCONFIG.ResponsiveValue.generationVertical)
                                                                  * 1.8 * rootWP.parameters.width;
                        rootWP.generationVerticalValueFontSize = 2;
                        rootWP.generationVerticalSignFontSize = 0.6;
                        rootWP.generationVerticalDateFontSize = 0.7;
                        $scope.getSolarGenerationData();
                        break;
                }
                angular.extend($rootScope.widgetParam, rootWP);

                $scope.pathHeightStep1 = 569.354;
                $scope.foreignObjectHeightStep1 = 125;

                $scope.pathHeightStep2 = 830.344;
                $scope.foreignObjectHeightStep2 = 125;

                $scope.pathHeightStep3 = 860.11;
                $scope.foreignObjectHeightStep3 = 125;

                $scope.pathHeightStep4 = 619.927;
                $scope.foreignObjectHeightStep4 = 125;

                var duration = parseInt($rootScope.widgetParam.parameters.duration) * 1000 + 500;
                var transtionIn = $rootScope.widgetParam.parameters.transitionIn + ' animated';
                var transtionOut = $rootScope.widgetParam.parameters.transitionOut + ' animated';
                $timeout(function() {
                    $('.animation-widget')
                        .removeClass(transtionIn)
                        .addClass(transtionIn)
                        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            $(this).removeClass(transtionIn);
                        });
                }, 500);

                $timeout(function() {
                    $('.animation-widget')
                        .removeClass(transtionOut)
                        .addClass(transtionOut)
                        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            $(this).removeClass(transtionOut);
                        });
                }, duration);

                if (rootWP.name === 'Video') {
                    $timeout(function() {
                        $rootScope.videoAPI[rootWP._id][0].play();
                        console.log('playing video...........');
                    }, 2000);
                    $('#editfield_dlg').modal().on('hidden.bs.modal', function (e) {
                        $rootScope.videoAPI[rootWP._id][0].stop();
                        console.log('pausing video...........');
                    });
                }
            };
            // End Open Preview Modal Function

            $scope.saveEditfieldDlg = function (preview) {
                if ($rootScope.presentationDetails.bpLock) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                $scope.previousSetParams();
                toggleService.togglePleaseWait();
                console.log($rootScope.widgetParam.parameters.widgetURL);
                widgetService.saveWidget($rootScope.presentationId, $rootScope.widgetParam, $scope.editFlag,
                    $scope, $compile, 'save', preview);
                $('#editfield_dlg').modal('hide');
            };

            $scope.previousSetParams = function () {
                var rootWP = $rootScope.widgetParam;
                angular.extend(rootWP.parameters, {
                    height: PCONFIG.GridWidth * parseInt(rootWP.parameters.rowCount) +
                                                parseInt(rootWP.parameters.rowCount) - 1,
                    width: PCONFIG.GridHeight * parseInt(rootWP.parameters.colCount) +
                                                parseInt(rootWP.parameters.colCount) - 1,
                    top: parseInt(rootWP.parameters.rowPosition) * PCONFIG.GridHeight
                         + parseInt(rootWP.parameters.rowPosition) + 2,
                    left: parseInt(rootWP.parameters.colPosition) * PCONFIG.GridWidth
                          + parseInt(rootWP.parameters.colPosition) - 1
                });


                if (PCONFIG.GridRowCnt < parseInt(rootWP.parameters.rowPosition)
                    + parseInt(rootWP.parameters.rowCount)) {
                    rootWP.parameters.rowPosition = PCONFIG.GridRowCnt - parseInt(rootWP.parameters.rowCount);
                    rootWP.parameters.top = parseInt(rootWP.parameters.rowPosition) * PCONFIG.GridHeight
                    + parseInt(rootWP.parameters.rowPosition) + 2;
                }

                if (PCONFIG.GridColCnt < rootWP.parameters.colPosition + parseInt(rootWP.parameters.colCount)) {
                    rootWP.parameters.colPosition = PCONFIG.GridColCnt - parseInt(rootWP.parameters.colCount);
                    rootWP.parameters.left = parseInt(rootWP.parameters.colPosition) * PCONFIG.GridWidth
                    + parseInt(rootWP.parameters.colPosition) - 1;
                }

                // control start point
                var startPointSec = parseInt(rootWP.parameters.startDateSec) % 60;

                if (!rootWP.parameters.startDateMin || isNaN(rootWP.parameters.startDateMin)) {
                    rootWP.parameters.startDateMin = 0;
                }

                if (!rootWP.parameters.startDateSec || isNaN(rootWP.parameters.startDateSec)) {
                    rootWP.parameters.startDateSec = 0;
                }

                var startPointMin = parseInt(parseInt(parseInt(rootWP.parameters.startDateSec) / 60).toFixed(0))
                    + parseInt(rootWP.parameters.startDateMin);

                if (isNaN(startPointMin)) {
                    startPointMin = 0;
                }

                if (isNaN(startPointSec)) {
                    startPointSec = 0;
                }


                rootWP.parameters.startDate = startPointMin + ':' + startPointSec;

                rootWP.parameters.backgroundImage = $('#backgroungImage').val();

                // control custom paramter for Image widget
                if (rootWP.name === 'Image') {
                    rootWP.parameters.widgetURL = $('#imageURL').val();
                }
                if (rootWP.name === 'Video') {
                    rootWP.parameters.widgetURL = $('#videoURL').val();
                }

                // control custom paramter for textarea widget
                if (rootWP.name === 'TextArea') {
                    rootWP.parameters.widgetTextareaContent = tinyMCE.get('textareaWidget').getContent();
                }

                // control font selecter
                rootWP.parameters.headerFont.name = (rootWP.parameters.headerFont.name).replace(/'/g, '');
                rootWP.parameters.normal1Font.name = (rootWP.parameters.normal1Font.name).replace(/'/g, '');
                rootWP.parameters.subHeaderFont.name = (rootWP.parameters.subHeaderFont.name).replace(/'/g, '');
                rootWP.parameters.normal2Font.name = (rootWP.parameters.normal2Font.name).replace(/'/g, '');

                //control dateTime selector
                rootWP.parameters.widgetGraphStartDate = $scope.getISO8601Str(rootWP.parameters.widgetGraphStartDate);
                rootWP.parameters.widgetGraphEndDate = $scope.getISO8601Str(rootWP.parameters.widgetGraphEndDate);
                rootWP.parameters.widgetSolarGenerationStartDate =
                    $scope.getISO8601Str(rootWP.parameters.widgetSolarGenerationStartDate);
                rootWP.parameters.widgetSolarGenerationEndDate =
                    $scope.getISO8601Str(rootWP.parameters.widgetSolarGenerationEndDate);
                rootWP.parameters.widgetEnergyStartDate = $scope.getISO8601Str(rootWP.parameters.widgetEnergyStartDate);
                rootWP.parameters.widgetEnergyEndDate = $scope.getISO8601Str(rootWP.parameters.widgetEnergyEndDate);

                $rootScope.widgetParam = rootWP;
                if (!$scope.editFlag) {
                    $rootScope.widgets.push($rootScope.widgetParam);
                } else {
                    var widgetId =  $rootScope.widgetParam._id;
                    $.each($rootScope.widgets, function(idx, widget) {
                        if (widget._id === widgetId ) {
                            var tmp = {};
                            angular.copy($rootScope.widgetParam, tmp);
                            tmp.parameters.height = PCONFIG.GridWidth * parseInt(tmp.parameters.rowCount)
                            + parseInt(tmp.parameters.rowCount) - 1;
                            tmp.parameters.width = PCONFIG.GridHeight * parseInt(tmp.parameters.colCount)
                            + parseInt(tmp.parameters.colCount) - 1;
                            tmp.parameters.top = parseInt(tmp.parameters.rowPosition) * PCONFIG.GridHeight
                            + parseInt(tmp.parameters.rowPosition) + 2;
                            tmp.parameters.left = parseInt(tmp.parameters.colPosition) * PCONFIG.GridWidth
                            + parseInt(tmp.parameters.colPosition) - 1;
                            // Yakov
                            tmp.parameters.timelineRowPosition = widget.parameters.timelineRowPosition;
                            tmp.parameters.previousTimelineRowPosition = widget.parameters.previousTimelineRowPosition;
                            tmp.parameters.resizedOnTimeline = widget.parameters.resizedOnTimeline;
                            $rootScope.widgetParam.parameters.timelineRowPosition =
                                widget.parameters.timelineRowPosition;
                            $rootScope.widgetParam.parameters.previousTimelineRowPosition =
                                widget.parameters.previousTimelineRowPosition;
                            $rootScope.widgetParam.parameters.resizedOnTimeline = widget.parameters.resizedOnTimeline;
                            $rootScope.widgets.splice(idx, 1, tmp);
                        }
                    });
                }
            };

            $rootScope.initHDSW = function () {
                $timeout.cancel(sunTimer);
                $timeout.cancel(sunTimer1);
                $timeout.cancel(sunTimer2);
                $timeout.cancel(panelTimer);
                $timeout.cancel(panelTimer1);
                $timeout.cancel(greenBoxTimer);
                $timeout.cancel(greenBoxTimer1);
                $timeout.cancel(blueBoxTimer);
                $timeout.cancel(blueBoxTimer1);
                $timeout.cancel(step1Timer);
                $timeout.cancel(step2Timer);
                $timeout.cancel(step3Timer);
                $timeout.cancel(step4Timer);
                $timeout.cancel(solarDurationStepTimer1);
                $timeout.cancel(solarDurationStepTimer2);
                $timeout.cancel(solarDurationStepTimer3);
                $timeout.cancel(solarDurationStepTimer4);
                $rootScope.solarShowStep1 = false;
                $rootScope.solarShowStep2 = false;
                $rootScope.solarShowStep3 = false;
                $rootScope.solarShowStep4 = false;
                $rootScope.showAllowLarge = false;
                $rootScope.showEnergy = false;
                $rootScope.showEnergy1 = false;
                $rootScope.showInvertor = false;
                $rootScope.showMeter = false;
                $rootScope.showInvertor1 = false;
                $rootScope.showMeter1 = false;
                $rootScope.showEnergy2 = false;
                $rootScope.showInvertor2 = false;
                $rootScope.showMeter2 = false;
                $rootScope.showElectric = false;
                $rootScope.showAllowSmall = true;
            };

            $rootScope.sunAnimation = function() {
                $rootScope.showAllowSmall = true;
                $rootScope.showAllowLarge = false;
                sunTimer1 = $timeout($rootScope.sunAnimation1, 1000);
                sunTimer2 = $timeout($rootScope.sunAnimation2, 1250);
                sunTimer = $timeout($rootScope.sunAnimation,2250);
            };

            $rootScope.sunAnimation1 = function () {
                $rootScope.showAllowSmall = false;
            };

            $rootScope.sunAnimation2 = function () {
                $rootScope.showAllowLarge = true;
            };
            $rootScope.panelAnimation = function() {
                $rootScope.showEnergy1 = true;
                $rootScope.showEnergy2 = false;
                panelTimer1 = $timeout($rootScope.panelAnimation1, 1000);
                panelTimer = $timeout($rootScope.panelAnimation, 2000);
            };

            $rootScope.panelAnimation1 = function() {
                $rootScope.showEnergy1 = false;
                $rootScope.showEnergy2 = true;
            };

            $rootScope.greenBoxAnimation = function() {
                $rootScope.showInvertor1 = true;
                $rootScope.showInvertor2 = false;
                greenBoxTimer1 = $timeout($rootScope.greenBoxAnimation1, 1000);
                greenBoxTimer = $timeout($rootScope.greenBoxAnimation, 2000);
            };

            $rootScope.greenBoxAnimation1 = function() {
                $rootScope.showInvertor1 = false;
                $rootScope.showInvertor2 = true;
            };

            $rootScope.blueBoxAnimation = function() {
                $rootScope.showMeter1 = true;
                $rootScope.showMeter2 = false;
                blueBoxTimer1 = $timeout($rootScope.blueBoxAnimation1, 1000);
                blueBoxTimer = $timeout($rootScope.blueBoxAnimation, 2000);
            };

            $rootScope.blueBoxAnimation1 = function() {
                $rootScope.showMeter1 = false;
                $rootScope.showMeter2 = true;
            };

            // Start HDSW Widget Duration Step
            $rootScope.solarDurationStep1 = function(steponeduration, steptwoduration, stepthreeduration,
                                                     stepfourduration, steponecontent, steptwocontent,
                                                     stepthreecontent, stepfourcontent, elementID) {
                solarDurationStepTimer1 = $timeout(function() {
                    var strCount = 22;
                    var rowHeight = 32;
                    var stringArray = steponecontent.split(' ');
                    var lineArray = [];
                    var line = '';
                    for (var i=0; i<stringArray.length+1; i++) {
                        line = line + stringArray[i] + ' ';
                        if (line.length > strCount)
                        {
                            var temp = line.replace(stringArray[i], '');
                            lineArray.push(temp);
                            line = stringArray[i] + ' ';
                        }
                    }
                    $('#'+elementID+' .textareaStep1').html('');
                    for (i = lineArray.length-1; i >= 0; i--) {
                        var tspanText = lineArray[i];
                        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        obj.setAttributeNS(null, 'font-size', 24);
                        obj.setAttributeNS(null, 'x', 0);
                        obj.setAttributeNS(null, 'y', rowHeight * i);
                        obj.setAttributeNS(null, 'font-family', 'BentonSans');
                        obj.setAttributeNS(null, 'fill', '#FFFFFF');
                        obj.textContent = tspanText;
                        $('#'+elementID+' .textareaStep1')[0].appendChild(obj);
                    }

                    $rootScope.solarShowStep1 = true;
                    $rootScope.showEnergy = true;
                    $rootScope.panelAnimation();
                    $scope.$apply();
                    $scope.textareaStep1 = rowHeight * parseInt(lineArray.length) + 10;

                    if(parseInt($scope.textareaStep1) > 125) {
                        $scope.pathHeightStep1 = 569.354 + parseInt($scope.textareaStep1) - 125;
                        $scope.foreignObjectHeightStep1 = parseInt($scope.textareaStep1);
                    }
                    $rootScope.solarDurationStep2(steponeduration, steptwoduration, stepthreeduration,
                        stepfourduration, steponecontent, steptwocontent,
                        stepthreecontent, stepfourcontent, elementID);
                }, 10);
            };
            $rootScope.solarDurationStep2 = function(steponeduration, steptwoduration, stepthreeduration,
                                                     stepfourduration, steponecontent, steptwocontent,
                                                     stepthreecontent, stepfourcontent, elementID) {
                var time = parseInt(steponeduration,10) * 1000;
                solarDurationStepTimer2 = $timeout(function() {
                    var strCount = 22;
                    var rowHeight = 32;
                    var stringArray = steptwocontent.split(' ');
                    var lineArray = [];
                    var line = '';
                    for (var i=0; i<stringArray.length+1; i++) {
                        line = line + stringArray[i] + ' ';
                        if (line.length > strCount)
                        {
                            var temp = line.replace(stringArray[i], '');
                            lineArray.push(temp);
                            line = stringArray[i] + ' ';
                        }
                    }
                    $('#'+elementID+' .textareaStep2').html('');
                    for (i = lineArray.length-1; i >= 0; i--) {
                        var tspanText = lineArray[i];
                        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        obj.setAttributeNS(null, 'font-size', 24);
                        obj.setAttributeNS(null, 'x', 0);
                        obj.setAttributeNS(null, 'y', rowHeight*(i+1));
                        obj.setAttributeNS(null, 'font-family', 'BentonSans');
                        obj.setAttributeNS(null, 'fill', '#FFFFFF');
                        obj.textContent = tspanText;
                        $('#'+elementID+' .textareaStep2')[0].appendChild(obj);
                    }

                    $rootScope.solarShowStep2 = true;
                    $scope.$apply();
                    $scope.textareaStep2 = rowHeight * parseInt(lineArray.length) + 10;

                    if(parseInt($scope.textareaStep2) > 125) {
                        $scope.pathHeightStep2 = 830.344 + parseInt($scope.textareaStep2) - 125;
                        $scope.foreignObjectHeightStep2 = parseInt($scope.textareaStep2);
                    }
                    $rootScope.solarDurationStep3(steponeduration, steptwoduration, stepthreeduration,
                        stepfourduration, steponecontent, steptwocontent,
                        stepthreecontent, stepfourcontent, elementID);

                }, time);
            };
            $rootScope.solarDurationStep3 = function(steponeduration, steptwoduration, stepthreeduration,
                                                     stepfourduration, steponecontent, steptwocontent,
                                                     stepthreecontent, stepfourcontent, elementID) {
                var time = parseInt(steptwoduration,10) * 1000;
                solarDurationStepTimer3 = $timeout(function() {
                    var strCount = 22;
                    var rowHeight = 32;
                    var stringArray = stepthreecontent.split(' ');
                    var lineArray = [];
                    var line = '';
                    for (var i=0; i<stringArray.length+1; i++) {
                        line = line + stringArray[i] + ' ';

                        if (line.length > strCount)
                        {
                            var temp = line.replace(stringArray[i], '');
                            lineArray.push(temp);
                            line = stringArray[i] + ' ';
                        }
                    }
                    $('#'+elementID+' .textareaStep3').html('');
                    for (i = lineArray.length-1; i >= 0; i--) {
                        var tspanText = lineArray[i];
                        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        obj.setAttributeNS(null, 'font-size', 24);
                        obj.setAttributeNS(null, 'x', 0);
                        obj.setAttributeNS(null, 'y', rowHeight*(i+1));
                        obj.setAttributeNS(null, 'font-family', 'BentonSans');
                        obj.setAttributeNS(null, 'fill', '#FFFFFF');
                        obj.textContent = tspanText;
                        $('#'+elementID+' .textareaStep3')[0].appendChild(obj);
                    }

                    $rootScope.solarShowStep3 = true;
                    $rootScope.showInvertor = true;
                    $rootScope.greenBoxAnimation();
                    $scope.$apply();
                    $scope.textareaStep3 = rowHeight * parseInt(lineArray.length) + 10;
                    if(parseInt($scope.textareaStep3) > 125) {
                        $scope.pathHeightStep3 = 860.11 + parseInt($scope.textareaStep3) - 125;
                        $scope.foreignObjectHeightStep3 = parseInt($scope.textareaStep3);
                    }
                    $rootScope.solarDurationStep4(steponeduration, steptwoduration, stepthreeduration,
                        stepfourduration, steponecontent, steptwocontent,
                        stepthreecontent, stepfourcontent, elementID);

                }, time);
            };
            $rootScope.solarDurationStep4 = function(steponeduration, steptwoduration, stepthreeduration,
                                                     stepfourduration, steponecontent, steptwocontent,
                                                     stepthreecontent, stepfourcontent, elementID) {
                var time = parseInt(stepthreeduration,10) * 1000;
                solarDurationStepTimer4 = $timeout(function() {
                    var strCount = 22;
                    var rowHeight = 32;
                    var stringArray = stepfourcontent.split(' ');
                    var lineArray = [];
                    var line = '';
                    for (var i=0; i<stringArray.length+1; i++) {
                        line = line + stringArray[i] + ' ';

                        if (line.length > strCount)
                        {
                            var temp = line.replace(stringArray[i], '');
                            lineArray.push(temp);
                            line = stringArray[i] + ' ';
                        }
                    }
                    $('#'+elementID+' .textareaStep4').html('');
                    for (i = lineArray.length-1; i >= 0; i--) {
                        var tspanText = lineArray[i];
                        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        obj.setAttributeNS(null, 'font-size', 24);
                        obj.setAttributeNS(null, 'x', 0);
                        obj.setAttributeNS(null, 'y', rowHeight*(i+1));
                        obj.setAttributeNS(null, 'font-family', 'BentonSans');
                        obj.setAttributeNS(null, 'fill', '#FFFFFF');
                        obj.textContent = tspanText;
                        $('#'+elementID+' .textareaStep4')[0].appendChild(obj);
                    }

                    $rootScope.solarShowStep4 = true;
                    $rootScope.showElectric = true;
                    $rootScope.showMeter = true;
                    $rootScope.blueBoxAnimation();
                    $scope.$apply();
                    $scope.textareaStep4 = rowHeight * parseInt(lineArray.length) + 10;
                    if(parseInt($scope.textareaStep4) > 125) {
                        $scope.pathHeightStep4 = 619.927 + parseInt($scope.textareaStep4) - 125;
                        $scope.foreignObjectHeightStep4 = parseInt($scope.textareaStep4);
                    }

                }, time);
            };
            // End HDSW Widget Duration Step

            $scope.duplicateWidget = function (widgetInstanceID) {
                if ($rootScope.presentationDetails.bpLock) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }

                $timeout(function(){
                    var widgetParam = {};
                    $rootScope.widgetParam = {};
                    widgetParam = $.grep($rootScope.widgets, function(e){ return e._id === widgetInstanceID;})[0];
                    //delete widgetParam._id;
                    angular.copy(widgetParam, $rootScope.widgetParam);
                    delete $rootScope.widgetParam._id;

                    // Yakov
                    $rootScope.widgetParam.parameters.timelineRowPosition = widgetParam.parameters.timelineRowPosition;

                    // set position for widget
                    $rootScope.widgetParam.parameters.left = widgetParam.parameters.left;
                    $rootScope.widgetParam.parameters.top = widgetParam.parameters.top;
                    $rootScope.widgetParam.parameters.height = widgetParam.parameters.height;
                    $rootScope.widgetParam.parameters.width = widgetParam.parameters.width;

                    // control font selecter
                    $rootScope.widgetParam.parameters.headerFont.name =
                        ($rootScope.widgetParam.parameters.headerFont.name).replace(/'/g, '');
                    $rootScope.widgetParam.parameters.normal1Font.name =
                        ($rootScope.widgetParam.parameters.normal1Font.name).replace(/'/g, '');
                    $rootScope.widgetParam.parameters.subHeaderFont.name =
                        ($rootScope.widgetParam.parameters.subHeaderFont.name).replace(/'/g, '');
                    $rootScope.widgetParam.parameters.normal2Font.name =
                        ($rootScope.widgetParam.parameters.normal2Font.name).replace(/'/g, '');

                    //control dateTime selector
                    $rootScope.widgetParam.parameters.widgetGraphStartDate =
                        $scope.getISO8601Str($rootScope.widgetParam.parameters.widgetGraphStartDate);
                    $rootScope.widgetParam.parameters.widgetGraphEndDate =
                        $scope.getISO8601Str($rootScope.widgetParam.parameters.widgetGraphEndDate);
                    $rootScope.widgetParam.parameters.widgetSolarGenerationStartDate =
                        $scope.getISO8601Str($rootScope.widgetParam.parameters.widgetSolarGenerationStartDate);
                    $rootScope.widgetParam.parameters.widgetSolarGenerationEndDate =
                        $scope.getISO8601Str($rootScope.widgetParam.parameters.widgetSolarGenerationEndDate);
                    $rootScope.widgetParam.parameters.widgetEnergyStartDate =
                        $scope.getISO8601Str($rootScope.widgetParam.parameters.widgetEnergyStartDate);
                    $rootScope.widgetParam.parameters.widgetEnergyEndDate =
                        $scope.getISO8601Str($rootScope.widgetParam.parameters.widgetEnergyEndDate);

                    //set start point for widget

                    var startPointMin = $('.timenav-line').attr('minute');
                    var startPointSecond = $('.timenav-line').attr('second');
                    var startPoint = startPointMin === undefined
                        ? '00:00' : parseInt(startPointMin) + ':' + parseInt(startPointSecond);


                    $rootScope.widgetParam.parameters.startDate = startPoint;
                    $rootScope.widgets.push($rootScope.widgetParam);

                    console.log('Duplicate widget');
                    console.log($rootScope.widgetParam);
                    console.log($rootScope.presentationId);

                    toggleService.togglePleaseWait();
                    widgetService.saveWidget($rootScope.presentationId, $rootScope.widgetParam, false,
                        $scope, $compile,'save', false);
                    //widgetService.getTimelineInfo($rootScope.presentationId, 'delete',
                    // $compile,  $scope, false, null);
                }, 10);
            };

            $scope.deleteWidget = function (widgetInstanceID) {
                if ($rootScope.presentationDetails.bpLock) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                widgetService.deleteWidgetById(widgetInstanceID).then(function (response)  {
                    var deleteIndex, dateDeleteindex;
                    var deleteName = '';

                    $.each($rootScope.widgets, function(idx, widget) {
                        if (widget._id === widgetInstanceID) {
                            deleteIndex = idx;
                            deleteName = widget.name;
                        }
                    });
                    $.each($scope.timelineDatas.timeline.date, function(idx, date) {
                        if (date.widgetId === widgetInstanceID ) {
                            dateDeleteindex = idx;
                        }
                    });
                    $.each($scope.dynamicWidgets, function (index, dwidget) {
                        if (dwidget.name === deleteName) {
                            $scope.dynamicWidgets[index].used.instanceNumber--;
                        }
                    });
                    //Make the deleted widget invisible.
                    angular.element('.component_' + widgetInstanceID).addClass('animation-show');
                    $rootScope.widgets[deleteIndex].isDeleted = true;

                    //Delay widget deletion until it fades out.
                    $timeout(function () {
                        $rootScope.widgets.splice(deleteIndex, 1);
                    }, 500);

                    //Remove timeline widget marker
                    $scope.timelineDatas.timeline.date.splice(dateDeleteindex, 1);
                    $('#timeline-widgetInfo').html('');
                    var currentTimenavLeft = $('.timenav').position().left;
                    var currentTime = $('.time-representation').text();
                    var timeArray = currentTime.split(':');

                    $timeout(function(){
                        VMM.fireEvent(global, VMM.Timeline.Config.events['data_ready'], $scope.timelineDatas);
                        timenav.setCurrentPosition('easeInOutExpo', 1000,
                            currentTimenavLeft, timeArray[0], timeArray[1]);
                    }, 100);
                });
            };

            $scope.previewWidget = function () {
                $scope.templatePreview = '';
                toggleService.togglePleaseWait();
                $scope.previousSetParams();
                $scope.previewModal();
            };

            $scope.openParameterTab = function() {
                $rootScope.videoAPI[$rootScope.widgetParam._id][0].stop();
                console.log('pausing video...........');
            };

            // Start When Date Range is Custom, Show Date Field
            $scope.selectGraphDate = function() {
                $rootScope.widgetParam.graphCustom =
                    $rootScope.widgetParam.parameters.widgetGraphDateRange === '-- Custom --';
            };

            $scope.selectInterval = function() {
                if ($rootScope.widgetParam.parameters.widgetGraphDateRange === '-- Custom --') {
                    var startDate = $scope.dateFormatConvert2($rootScope.widgetParam.parameters.widgetGraphStartDate);
                    var endDate = $scope.dateFormatConvert2($rootScope.widgetParam.parameters.widgetGraphEndDate);
                    var newStartDate = new Date(startDate);
                    var newEndDate = new Date(endDate);
                    var startTime = newStartDate.getTime();
                    var endTime = newEndDate.getTime();
                    var diffTime = endTime - startTime;
                    var minutes=1000*60;
                    var hours=minutes*60;
                    var days=hours*24;
                    var weeks=days*7;
                    var months = weeks*4;
                    var diffWeek = Math.round(diffTime/weeks);
                    var diffMonth = Math.round(diffTime/months);
                    if (diffMonth > 1) {
                        if ($rootScope.widgetParam.parameters.widgetGraphInterval === 'Hourly'
                            || $rootScope.widgetParam.parameters.widgetGraphInterval === 'Daily') {
                            $rootScope.widgetParam.parameters.widgetGraphInterval = 'Weekly';
                            notifyService.errorNotify('Minimum Interval for this Date Range is Weekly.');
                            $('.graph-interval')
                                .removeClass('shake animated')
                                .addClass('shake animated')
                                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function() {
                                    $(this).removeClass('shake animated');
                                });
                        }
                    } else if (diffWeek > 1) {
                        if($rootScope.widgetParam.parameters.widgetGraphInterval === 'Hourly') {
                            $rootScope.widgetParam.parameters.widgetGraphInterval = 'Daily';
                            notifyService.errorNotify('Minimum Interval for this Date Range is Daily.');
                            $('.graph-interval')
                                .removeClass('shake animated')
                                .addClass('shake animated')
                                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function(){
                                    $(this).removeClass('shake animated');
                                });
                        }
                    }
                } else {
                    if ($rootScope.widgetParam.parameters.widgetGraphDateRange === 'Month') {
                        if($rootScope.widgetParam.parameters.widgetGraphInterval === 'Hourly') {
                            $rootScope.widgetParam.parameters.widgetGraphInterval = 'Daily';
                            notifyService.errorNotify('Minimum Interval for this Date Range is Daily.');
                            $('.graph-interval')
                                .removeClass('shake animated')
                                .addClass('shake animated')
                                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function(){
                                    $(this).removeClass('shake animated');
                                });
                        }
                    }

                    if ($rootScope.widgetParam.parameters.widgetGraphDateRange === 'Year'
                        || $rootScope.widgetParam.parameters.widgetGraphDateRange === 'All') {
                        if ($rootScope.widgetParam.parameters.widgetGraphInterval === 'Hourly'
                            || $rootScope.widgetParam.parameters.widgetGraphInterval === 'Daily') {
                            $rootScope.widgetParam.parameters.widgetGraphInterval = 'Weekly';
                            notifyService.errorNotify('Minimum Interval for this Date Range is Weekly.');
                            $('.graph-interval')
                                .removeClass('shake animated')
                                .addClass('shake animated')
                                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function(){
                                    $(this).removeClass('shake animated');
                                });
                        }
                    }
                }
            };

            $scope.selectGenerationDate = function() {
                $rootScope.widgetParam.generationCustom =
                    $rootScope.widgetParam.parameters.widgetSolarGenerationDateRange === '-- Custom --';
            };

            $scope.selectEnergyDate = function() {
                $rootScope.widgetParam.energyCustom =
                    $rootScope.widgetParam.parameters.widgetEnergyDateRange === '-- Custom --';
            };
            // End When Date Range is Custom, Show Date Field

            $scope.uiSelect2 = function(object) {
                var uiTemplate = object.html();
                var uiLinkFn = $compile(uiTemplate);
                var uiElement = uiLinkFn($scope);
                object.html(uiElement);
                object.find('.select2-container:first').remove();
            };

            $scope.getISO8601Str = function (date) {
/*                var d = new Date(date),
                    userOffset = d.getTimezoneOffset()*60*1000;

                return new Date(d.getTime() - userOffset).toISOString();
*/
                date = date.replace(' ', 'T');
                return date + ':00.000Z';
            };


            $scope.dateFormatConvert = function(date) {
                var day, month, year, hour, minutes, dateString;
                if (date) {
                    day = date.substring(8, 10);
                    month = date.substring(5, 7);
                    year = date.substring(0, 4);
                    hour = date.substring(11, 13);
                    minutes = date.substring(14, 16);
                    dateString = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;

                    return dateString;
                } else {
                    var newDate = new Date();
                    day = newDate.getDate();
                    month = newDate.getMonth() + 1;
                    year = newDate.getFullYear();
                    hour = newDate.getHours();
                    minutes = newDate.getMinutes();
                    if (month < 10) {
                        month = '0' + month;
                    }
                    if (day < 10) {
                        day = '0' + day;
                    }
                    if (hour < 10) {
                        hour = '0' + hour;
                    }
                    if (minutes < 10) {
                        minutes = '0' + minutes;
                    }
                    dateString = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;

                    return dateString;
                }
            };

            $scope.dateFormatConvert2 = function(date) {
                var day, month, year, secs, mins, hours, dateString;

                if (date) {
                    day = date.substring(8, 10);
                    month = date.substring(5, 7);
                    year = date.substring(0, 4);
                    hours = date.substring(11, 13);
                    mins = date.substring(14, 16);

                    if (hours.length !== 2) {
                        hours = '00';
                    }
                    if (mins.length !== 2) {
                        mins = '00';
                    }

                    dateString = month + '/' + day + '/' + year + ' ' + hours + ':' + mins + ':' + '00';

                    return dateString;
                } else {
                    var newDate = new Date();
                    day = newDate.getDate();
                    month = newDate.getMonth() + 1;
                    year = newDate.getFullYear();
                    hours = newDate.getHours();
                    mins = newDate.getMinutes();
                    secs = newDate.getSeconds();

                    if (month < 10) {
                        month = '0' + month;
                    }

                    if (day < 10) {
                        day = '0' + day;
                    }
                    if (hours < 10) {
                        hours = '0' + hours;
                    }
                    if (mins < 10) {
                        mins = '0' + mins;
                    }
                    if (secs < 10) {
                        secs = '0' + secs;
                    }
                    dateString = month + '/' + day + '/' + year + ' ' + hours + ':' + mins + ':' + secs;

                    return dateString;
                }
            };

            $scope.inverterChange = function() {
                var n = ($rootScope.widgetParam.parameters.widgetEnergyInverter).indexOf(',');
                if (n > 0) {
                    $rootScope.widgetParam.parameters.widgetEnergyCombineInverters = true;
                    $scope.$apply();
                }
            };

            $scope.soloarInverterChange = function() {
                var n = ($rootScope.widgetParam.parameters.widgetSolarGenerationInverter).indexOf(',');
                if (n > 0) {
                    $rootScope.widgetParam.parameters.widgetSolarGenerationCombineInverters = true;
                    $scope.$apply();
                }
            };

            $scope.graphInverterChange = function() {
                var n = ($rootScope.widgetParam.parameters.widgetGraphInverter).indexOf(',');
                if (n > 0) {
                    $rootScope.widgetParam.parameters.widgetGraphCombineInverters = true;
                    $scope.$apply();
                }
            };

            $scope.selectEnergyType = function() {
                if ($rootScope.widgetParam.parameters.widgetEnergyOrientation === 'Horizontal') {
                    switch($rootScope.widgetParam.parameters.widgetEnergyType) {
                        case 'Cars Removed':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'cars.png';
                            break;
                        case 'Waste Recycled':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'tons.png';
                            break;
                        case 'Gallons Gas Saved':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'gallons.png';
                            break;
                        case 'Tanker Gas Saved':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'tanker.png';
                            break;
                        case 'Energy Homes Generated':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'energy-home.png';
                            break;
                        case 'Electricity Homes Generated':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'electricity-home.png';
                            break;
                        case 'Coal Eliminated':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'railcars.png';
                            break;
                        case 'Oil Unneeded':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'barrels.png';
                            break;
                        case 'Propane Cylinders':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'propane.png';
                            break;
                        case 'Plants Idled':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'coal.png';
                            break;
                        case 'Seedling Grown':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'tree.png';
                            break;
                        case 'Forests Preserved':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'acres.png';
                            break;
                        case 'Forests Conversion Prevented':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'acres-corpland.png';
                            break;

                    }
                } else {
                    switch($rootScope.widgetParam.parameters.widgetEnergyType) {
                        case 'Cars Removed':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-cars.png';
                            break;
                        case 'Waste Recycled':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-tons.png';
                            break;
                        case 'Gallons Gas Saved':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-gallons.png';
                            break;
                        case 'Tanker Gas Saved':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-tanker.png';
                            break;
                        case 'Energy Homes Generated':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl
                            + 'vertical-energy-home.png';
                            break;
                        case 'Electricity Homes Generated':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl
                            + 'vertical-electricity-home.png';
                            break;
                        case 'Coal Eliminated':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-railcars.png';
                            break;
                        case 'Oil Unneeded':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-barrels.png';
                            break;
                        case 'Propane Cylinders':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-propane.png';
                            break;
                        case 'Plants Idled':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-coal.png';
                            break;
                        case 'Seedling Grown':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-tree.png';
                            break;
                        case 'Forests Preserved':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl + 'vertical-acres.png';
                            break;
                        case 'Forests Conversion Prevented':
                            $rootScope.widgetParam.parameters.backgroundImage = $scope.imgUrl
                            + 'vertical-acres-corpland.png';
                            break;

                    }
                }

            };

            //
            $scope.changeFontSize = function () {
                console.log('Change Font Size');
                switch($rootScope.widgetParam.name) {
                    case 'Energy Equivalencies':
                        if ($rootScope.widgetParam.parameters.widgetEnergyOrientation === 'Horizontal') {
                            angular.extend($rootScope.widgetParam.parameters, {
                                'energyTitleSize': parseFloat(PCONFIG.ResponsiveValue.energy.title)
                                * parseFloat($rootScope.widgetParam.parameters.headerFont.size)
                                * $rootScope.widgetParam.parameters.width,
                                'energyInveterValue': parseFloat(PCONFIG.ResponsiveValue.energy['inveterValue'])
                                * parseFloat($rootScope.widgetParam.parameters.normal1Font.size)
                                * $rootScope.widgetParam.parameters.width,
                                'energyInveterName': parseFloat(PCONFIG.ResponsiveValue.energy['inveterName'])
                                * parseFloat($rootScope.widgetParam.parameters.normal2Font.size)
                                * $rootScope.widgetParam.parameters.width,
                                'energyTopName': parseFloat(PCONFIG.ResponsiveValue.energy['topName'])
                                * $rootScope.widgetParam.parameters.width,
                                'energyLineFont': parseFloat(PCONFIG.ResponsiveValue.energy['lineFont'])
                                * $rootScope.widgetParam.parameters.width,
                                'energyPoundFont': parseFloat(PCONFIG.ResponsiveValue.energy['poundFont'])
                                * parseFloat($rootScope.widgetParam.parameters.subHeaderFont.size)
                                * $rootScope.widgetParam.parameters.width
                            });
                        } else {
                            if (!($rootScope.widgetParam.parameters.widgetEnergyCO2Kilograms
                                || $rootScope.widgetParam.parameters.widgetEnergyGreenhouseKilograms)) {
                                $rootScope.widgetParam.parameters.energyTitleSize =
                                    parseFloat(PCONFIG.ResponsiveValue.verticalEnergy.title1) *
                                    parseFloat($rootScope.widgetParam.parameters.headerFont.size) *
                                    $rootScope.widgetParam.parameters.width;
                            } else if (!($rootScope.widgetParam.parameters.widgetEnergyCO2Kilograms
                                && $rootScope.widgetParam.parameters.widgetEnergyGreenhouseKilograms)) {
                                $rootScope.widgetParam.parameters.energyTitleSize =
                                    parseFloat(PCONFIG.ResponsiveValue.verticalEnergy.title2) *
                                    parseFloat($rootScope.widgetParam.parameters.headerFont.size) *
                                    $rootScope.widgetParam.parameters.width;
                            } else if ($rootScope.widgetParam.parameters.widgetEnergyCO2Kilograms
                                && $rootScope.widgetParam.parameters.widgetEnergyGreenhouseKilograms) {
                                $rootScope.widgetParam.parameters.energyTitleSize =
                                    parseFloat(PCONFIG.ResponsiveValue.verticalEnergy.title3) *
                                    parseFloat($rootScope.widgetParam.parameters.headerFont.size) *
                                    $rootScope.widgetParam.parameters.width;
                            }

                            $rootScope.widgetParam.parameters.energyInveterValue =
                                parseFloat(PCONFIG.ResponsiveValue.verticalEnergy.inveterValue) *
                                parseFloat($rootScope.widgetParam.parameters.normal1Font.size) *
                                $rootScope.widgetParam.parameters.width;
                            $rootScope.widgetParam.parameters.energyInveterName =
                                parseFloat(PCONFIG.ResponsiveValue.verticalEnergy.inveterName) *
                                parseFloat($rootScope.widgetParam.parameters.normal2Font.size) *
                                $rootScope.widgetParam.parameters.width;
                            $rootScope.widgetParam.parameters.energyTopName =
                                parseFloat(PCONFIG.ResponsiveValue.verticalEnergy.topName) *
                                $rootScope.widgetParam.parameters.width;
                            $rootScope.widgetParam.parameters.energyLineFont =
                                parseFloat(PCONFIG.ResponsiveValue.verticalEnergy.lineFont) *
                                $rootScope.widgetParam.parameters.width;
                            $rootScope.widgetParam.parameters.energyPoundFont =
                                parseFloat(PCONFIG.ResponsiveValue.verticalEnergy.poundFont) *
                                parseFloat($rootScope.widgetParam.parameters.subHeaderFont.size) *
                                $rootScope.widgetParam.parameters.width;
                        }
                        break;
                    case 'Solar Generation':
                        $rootScope.widgetParam.generationTitleFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.generation) *
                            parseFloat($rootScope.widgetParam.parameters.headerFont.size) *
                            $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.generationSummaryFontSize = 0.0024999468 *
                        parseFloat($rootScope.widgetParam.parameters.normal2Font.size) *
                        $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.generationReimbursementFontSize = 0.00277772 *
                        parseFloat($rootScope.widgetParam.parameters.subHeaderFont.size) *
                        $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.generationValueFontSize = 0.0025734765 *
                        parseFloat($rootScope.widgetParam.parameters.normal1Font.size) *
                        $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.generationSignFontSize = 0.6;
                        $rootScope.widgetParam.generationDateFontSize = parseFloat(PCONFIG.ResponsiveValue.generation)
                                                                        * 0.7 * $rootScope.widgetParam.parameters.width;

                        $rootScope.widgetParam.generationVerticalTitleFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.generationVertical) *
                            parseFloat($rootScope.widgetParam.parameters.headerFont.size) *
                            $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.generationVerticalSummaryFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.generationVertical) * 1.8 *
                            $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.generationVerticalValueFontSize = 2;
                        $rootScope.widgetParam.generationVerticalSignFontSize = 0.6;
                        $rootScope.widgetParam.generationVerticalDateFontSize = 0.7;
                        break;
                    case 'Weather':
                        $rootScope.widgetParam.weatherTemperatureFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 6.3 * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherSign1FontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 3.5 * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherSign2FontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 2 * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherSummary1FontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) *
                            parseFloat($rootScope.widgetParam.parameters.normal1Font.size) *
                            $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherWindSpeedFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 3 * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherMphFontSize = parseFloat(PCONFIG.ResponsiveValue.weather) *  0.9
                                                                    * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherMeasuresFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) *
                            parseFloat($rootScope.widgetParam.parameters.normal2Font.size) *
                            $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherDateFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) *
                            parseFloat($rootScope.widgetParam.parameters.headerFont.size) *
                            $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherSummary2FontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) *
                            parseFloat($rootScope.widgetParam.parameters.normal1Font.size) *
                            $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherInfoFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 2.5 * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherPercentFontSize = 0.8;
                        $rootScope.widgetParam.weatherWeekDayFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 1.2 * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherWeekTemperatureFontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 2.5 * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherSign3FontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 1.8 * $rootScope.widgetParam.parameters.width;
                        $rootScope.widgetParam.weatherSign4FontSize =
                            parseFloat(PCONFIG.ResponsiveValue.weather) * 1 * $rootScope.widgetParam.parameters.width;
                        break;
                    case 'Graph':
                        if ($scope.highchartsNG && $scope.highchartsNG.preview) {
                            angular.forEach($scope.highchartsNG.preview.yAxis, function(yAxis) {
                                angular.extend(yAxis.title.style, {
                                    color: '#' + $rootScope.widgetParam.parameters.normal2Font.color,
                                    fontSize: $rootScope.widgetParam.parameters.normal2Font.size + 'em',
                                    fontFamily: $rootScope.widgetParam.parameters.normal2Font.name
                                });
                            });
                        }
                        break;
                }
            };

            $scope.changeGraphOptions = function () {
                console.log('Change Graph Options');
                if ($scope.highchartsNG && $scope.highchartsNG.preview && $rootScope.widgetParam.name === 'Graph') {
                    var secondColor = '#' + $rootScope.widgetParam.parameters.secondaryColor.color;
                    var thirdColor = '#' + $rootScope.widgetParam.parameters.tertiaryColor.color;
                    var fourthColor = '#' + $rootScope.widgetParam.parameters.fourthColor.color;
                    var fifthColor = '#' + $rootScope.widgetParam.parameters.fifthColor.color;
                    var sixthColor = '#' + $rootScope.widgetParam.parameters.sixthColor.color;
                    var seventhColor = '#' + $rootScope.widgetParam.parameters.seventhColor.color;

                    angular.forEach($scope.highchartsNG.preview.yAxis, function (yAxis, idx) {
                        var newColor;
                        switch (yAxis.title.text) {
                            case 'Current Power':
                                newColor = fifthColor;
                                break;
                            case 'Humidity':
                                newColor = fourthColor;
                                break;
                            case 'Temperature':
                                newColor = thirdColor;
                                break;
                            case 'Max Power':
                                newColor = sixthColor;
                                break;
                            case 'Weather':
                                newColor = seventhColor;
                                break;
                            case 'Generation':
                                newColor = secondColor;
                                break;
                        }
                        $scope.highchartsNG.preview.yAxis[idx].color = newColor;
                        angular.extend(yAxis.title.style, {
                            color: newColor
                        });
                        yAxis.title.text = '';
                    });
                    if (!$rootScope.widgetParam.parameters.backgroundImage) {
                        angular.extend($scope.highchartsNG.preview, {
                            options: {
                                'chart': {
                                    backgroundColor: '#' + $rootScope.widgetParam.parameters.backgroundColor
                                }
                            }
                        });
                    } else {
                        angular.extend($scope.highchartsNG.preview, {
                            options: {
                                'chart': {
                                    backgroundColor: 'Transparent'
                                }
                            }
                        });
                        angular.element('#chartPreview')
                            .css('background-image', 'url('+$rootScope.widgetParam.parameters.backgroundImage+')');
                    }
                }
            };

            $scope.getTotalDuration = function (index) {
                if ($rootScope.widgetParam.name === 'How Does Solar Work') {
                    var totalDuration =
                        parseInt($rootScope.widgetParam.parameters.widgetHowDoesSolarWorkStepOneDuration) +
                        parseInt($rootScope.widgetParam.parameters.widgetHowDoesSolarWorkStepTwoDuration) +
                        parseInt($rootScope.widgetParam.parameters.widgetHowDoesSolarWorkStepThreeDuration) +
                        parseInt($rootScope.widgetParam.parameters.widgetHowDoesSolarWorkStepFourDuration) + 3;
                    var errMsg = 'How Does Solar Work must be visible at least as long as the <b>SUM</b> of the Steps.';
                    if ($rootScope.widgetParam.parameters.duration < totalDuration) {

                        notifyService.errorNotify(errMsg);
                        switch(index) {
                            case 1:
                                $rootScope.widgetParam.parameters.widgetHowDoesSolarWorkStepOneDuration
                                    = $scope.widgetHowDoesSolarWorkStepOneDuration;
                                break;
                            case 2:
                                $rootScope.widgetParam.parameters.widgetHowDoesSolarWorkStepTwoDuration
                                    = $scope.widgetHowDoesSolarWorkStepTwoDuration;
                                break;
                            case 3:
                                $rootScope.widgetParam.parameters.widgetHowDoesSolarWorkStepThreeDuration
                                    = $scope.widgetHowDoesSolarWorkStepThreeDuration;
                                break;
                            case 4:
                                $rootScope.widgetParam.parameters.widgetHowDoesSolarWorkStepFourDuration
                                    = $scope.widgetHowDoesSolarWorkStepFourDuration;
                                break;
                            case 5:
                                $rootScope.widgetParam.parameters.duration = $scope.howDoesSolarWorkDuration;
                                break;
                        }
                    }
                }
            };

            $rootScope.$watch('widgetParam.parameters.widgetGraphStartDate', function() {
                console.log(' -- widget graph start date changed -- ', arguments);
            });

            $scope.widgetTemplateLoaded = function(widgetName) {
                $scope.widgetTmplLoaded[widgetName] = true;
            };
        }
    ]);