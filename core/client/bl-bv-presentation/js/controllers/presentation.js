'use strict';

angular.module('blApp.presentation.controllers')
.controller('PresentationController',
    ['$scope', '$rootScope', '$compile', '$http', '$timeout', '$sce', '$interval', 'PRESENT_CONFIG', 'socketService',
    function ($scope, $rootScope, $compile, $http, $timeout, $sce, $interval, PRESENT_CONFIG, socketService) {
            var sunTimer, sunTimer1, sunTimer2, panelTimer, panelTimer1, greenBoxTimer, greenBoxTimer1,
                blueBoxTimer, blueBoxTimer1, step1Timer, step2Timer, step3Timer, step4Timer,
                solarDurationStepTimer1, solarDurationStepTimer2, solarDurationStepTimer3, solarDurationStepTimer4;

            var PlayPresentationTimer,
                SolarDrawed = [],
                gridWidth = angular.element('.presentationBody').width() / 16,
                gridHeight = angular.element('.presentationBody').height() / 7;

            $scope.presentationId = '';
            $scope.tempPresentationDetails = {};
            $scope.presentationDetails = {};
            $scope.highchartsNG = {};
            $scope.isPlaying = false;

            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

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

            //socketService.socketInit();

            $scope.getPresentationInfo = function() {
                var apiUrl = '/present/presentations/' + $scope.presentationId;
                $http
                    .get(apiUrl)
                    .then(function(prst) {
                        $scope.presentationDetails = angular.copy(prst);
                        $scope.tempPresentationDetails = angular.copy(prst);

                        if ($scope.tempPresentationDetails.parameters.backgroundImage) {
                            $scope.tempPresentationDetails.parameters.backgroundImage =
                                'url(' + $scope.tempPresentationDetails.parameters.backgroundImage + ') repeat-x';
                        } else {
                            $scope.tempPresentationDetails.parameters.backgroundImage = 'none';
                        }

                        var presentationTitleWidth = $('.header_pt').width();
                        $scope.headerFontSize = parseFloat($scope.tempPresentationDetails.parameters.headerFont.size) *
                        (presentationTitleWidth / 1600);

                        $scope.presentationLogo = $scope.presentationDetails.Logo ? true : false;
                        $scope.systemSize = $scope.presentationDetails.systemSize + ' KW';
                        console.log('Presentation Details');
                        console.log($scope.tempPresentationDetails);

                        $scope.systemSize = $scope.presentationDetails.systemSize + 'KW';
                        //$scope.$apply();

                        //Yakov
                        var apiUrl = '/present/presentations/' + $scope.presentationId + '/energydata';
                        return $http.get(apiUrl);
                    })
                    .then(function(prstEnergy) {
                        var presentationInfo = prstEnergy,
                            monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                                'August', 'September', 'October', 'November', 'December'];

                        if (presentationInfo.generatingSince) {
                            var generatingSinceDay = presentationInfo.generatingSince.substring(8, 10);
                            var generatingSinceMonth = presentationInfo.generatingSince.substring(5, 7);
                            var generatingSinceYear = presentationInfo.generatingSince.substring(0, 4);
                            var generatingSinceMonthName = monthArray[parseInt(generatingSinceMonth, 10) - 1];
                            $scope.generatingSinceDate = generatingSinceMonthName + ' ' + generatingSinceDay
                            + ', ' + generatingSinceYear;
                        }

                        if (presentationInfo.lastUpdated) {
                            var lastUpdatedDay = presentationInfo.lastUpdated.substring(8, 10);
                            var lastUpdatedMonth = presentationInfo.lastUpdated.substring(5, 7);
                            var lastUpdatedYear = presentationInfo.lastUpdated.substring(0, 4);
                            var lastUpdatedHour = parseInt((presentationInfo.lastUpdated).substring(11, 13), 10);
                            var lastUpdatedMinutes = presentationInfo.lastUpdated.substring(14, 16);

                            var timeSuffix = lastUpdatedHour > 12 ? 'pm' : 'am';

                            if (lastUpdatedHour > 12) {
                                lastUpdatedHour = lastUpdatedHour - 12;
                            }

                            var lastUpdatedMonthName = monthArray[parseInt(lastUpdatedMonth, 10) - 1];
                            $scope.lastUpdatedDate = lastUpdatedHour + ':' + lastUpdatedMinutes + timeSuffix + ' '
                            + lastUpdatedMonthName + ' ' + lastUpdatedDay + ', '
                            + lastUpdatedYear;
                        }

                        $timeout(function () {
                            var presentationTitleWidget = $('.header_pt').width();
                            var logoWidth = $('.pt_logo ').width();
                            var informationWidth = $('.pt_infomation').width();
                            var titleWidth = presentationTitleWidget - informationWidth - logoWidth - 40;
                            angular.element('.pt_title .pn').width(titleWidth - 40);
                        }, 100);
                    });
            };

            $rootScope.$on('PresentDataReceived', function(message, options) {
                console.log('emitted for draw widgets with web socket.......................');
                console.log(options);
                var widgets = message.targetScope.widgets;
                var widget = options.widget;
                var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
                var weekArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var newDate, day, month, year, hour, minutes, monthName;

                switch (widget.name) {
                    case 'Graph': 
                        widget.templateName = '/bl-bv-presentation/views/widget/graph.html';
                        if ((widget.parameters.headerFont.content === null) ||
                             (widget.parameters.headerFont.content === '')) {
                            widget.parameters.bodyHeightPadding = 100;
                        } else {
                            widget.parameters.bodyHeightPadding = 
                                (($scope.GridHeight * parseInt(widget.parameters.rowCount) - 6) -
                                (parseFloat(widget.parameters.headerFont.size) * 14 + 10))/
                                ($scope.GridHeight * parseInt(widget.parameters.rowCount)) * 100;
                        }
                        var secondColor = '#' + widget.parameters.secondaryColor.color;
                        var thirdColor = '#' + widget.parameters.tertiaryColor.color;
                        var fourthColor = '#' + widget.parameters.fourthColor.color;
                        var fifthColor = '#' + widget.parameters.fifthColor.color;
                        var sixthColor = '#' + widget.parameters.sixthColor.color;
                        var seventhColor = '#' + widget.parameters.seventhColor.color;

                        var chartWidth = widget.parameters.width - 8;
                        var chartHeight = (widget.parameters.height - 8) * (widget.parameters.bodyHeightPadding/100);

                        $scope.drawRealtimeChart(options.socketData.widgetData, options.socketData.widgetId,
                             chartWidth, chartHeight, widget.parameters.widgetGraphInterval, 
                             widget.parameters.widgetGraphDateRange, secondColor, thirdColor, 
                             fourthColor, fifthColor, sixthColor, seventhColor, 
                             widget.parameters.normal2Font.color, widget.parameters.normal2Font.size, 
                             widget.parameters.normal2Font.name, widget.parameters.backgroundImage, 
                             widget.parameters.backgroundColor);
                        break;
                    case 'iFrame':
                        widget.templateName = '/bl-bv-presentation/views/widget/iframe.html';
                        widget.parameters.widgetComplieIFrameUrl = 
                            $sce.trustAsResourceUrl(widget.parameters.widgetIFrameUrl);
                        if ((widget.parameters.headerFont.content === null) || 
                            (widget.parameters.headerFont.content === '')) {
                            widget.parameters.bodyHeightPadding = 100;
                        } else {
                            widget.parameters.bodyHeightPadding = 
                                (($scope.GridHeight * parseInt(widget.parameters.rowCount) - 6) - 
                                (parseFloat(widget.parameters.headerFont.size) * 14 + 10))/
                                ($scope.GridHeight * parseInt(widget.parameters.rowCount)) * 100;
                        }
                        break;
                    case 'Image':
                        widget.templateName = '/bl-bv-presentation/views/widget/image.html';
                        if ((widget.parameters.headerFont.content === null) ||
                            (widget.parameters.headerFont.content === '')) {
                            widget.parameters.bodyHeightPadding = 100;
                        } else {
                            widget.parameters.bodyHeightPadding =
                                (($scope.GridHeight * parseInt(widget.parameters.rowCount) - 6) -
                                (parseFloat(widget.parameters.headerFont.size) * 14 + 10))/
                                ($scope.GridHeight * parseInt(widget.parameters.rowCount)) * 100;
                        }
                        break;
                    case 'Video':
                        widget.templateName = '/bl-bv-presentation/views/widget/video.html';
                        widget.parameters.newLeft = widget.parameters.orgColPosition * $(window).width() / 16;
                        widget.parameters.newTop = widget.parameters.orgRowPosition * $scope.GridHeight;
                        widget.parameters.newWidth = widget.parameters.orgColCount * $(window).width() / 16;
                        console.log(widget.parameters);
                        break;
                    case 'TextArea':
                        widget.templateName = '/bl-bv-presentation/views/widget/textarea.html';

                        var tempContent = widget.parameters.widgetTextareaContent ? 
                            widget.parameters.widgetTextareaContent.toString() : '';
                        widget.parameters.widgetTextareaContent = $sce.trustAsHtml(tempContent);


                        if ((widget.parameters.headerFont.content === null) || 
                            (widget.parameters.headerFont.content === '')) {
                            widget.parameters.bodyHeightPadding = 100;
                        } else {
                            widget.parameters.bodyHeightPadding = 
                                (($scope.GridHeight * parseInt(widget.parameters.rowCount) - 6) - 
                                (parseFloat(widget.parameters.headerFont.size) * 14 + 10))/
                                ($scope.GridHeight * parseInt(widget.parameters.rowCount)) * 100;
                        }
                        if((widget.parameters.backgroundImage !== null) && (widget.parameters.backgroundImage !== '')) {
                            widget.parameters.backgroundShowImage =  
                                'url(' + widget.parameters.backgroundImage + ') no-repeat';
                        } else {
                            widget.parameters.backgroundShowImage = 'none';
                        }
                        break;
                    case 'Weather':
                        if (widget.parameters.widgetWeatherType === 'Minimal') {
                            widget.templateName = '/bl-bv-presentation/views/widget/weather-minimal.html';
                        } else {
                            widget.templateName = '/bl-bv-presentation/views/widget/weather-detailed.html';
                        }
                        var weather = options.socketData.widgetData;
                        console.log('Weather Data');
                        console.log(weather);
                        if (Object.keys(weather.currently).length !== 0) {
                            widget.weatherCurrentlyTemperature = parseInt(weather.currently.temperature);
                            widget.weatherCurrentlyTemperatureMin = parseInt(weather.daily.data[0].temperatureMin);
                            widget.weatherCurrentlyTemperatureMax = parseInt(weather.daily.data[0].temperatureMax);
                            widget.weatherCurrentlyWindSpeed = parseFloat(weather.currently.windSpeed);
                            widget.weatherCurrentlySummary = weather.currently.summary;
                            widget.weatherCurrentlyIcon = weather.currently.icon;
                            widget.weatherCurrentlyPressure = parseInt(weather.currently.pressure);
                            widget.weatherCurrentlyVisibility = parseInt(weather.currently.visibility);
                            widget.weatherCurrentlyHumidity = parseInt(weather.currently.humidity);
                            newDate = new Date(parseInt(weather.currently.currentTime) * 1000);
                            day = newDate.getDate();
                            month = newDate.getMonth() + 1;
                            year = newDate.getFullYear();
                            hour = newDate.getHours();
                            minutes = newDate.getMinutes();
                            monthName = monthArray[newDate.getMonth()];
                            widget.weatherCurrentlyDate = 'Today, ' + monthName + ' ' + day;
                        }
                        console.log(weather.daily.data);
                        var weekData = [];
                        $.each(weather.daily.data, function(idx, data) {
                            if ((idx > 0) && (idx < 7)) {
                                var id = idx - 1;
                                var className;
                                if (idx === 1) {
                                    className = 'first';
                                } else {
                                    className = '';
                                }
                                newDate = new Date(parseInt(data.currentTime) * 1000);
                                var weekName = weekArray[newDate.getUTCDay()];
                                var temperatureValue = 
                                    parseInt((parseFloat(data.temperatureMin) + parseFloat(data.temperatureMax)) / 2);
                                weekData[id] = 
                                    { week: weekName, icon: data.icon, temperature: temperatureValue, class: className};
                            }
                        });
                        widget.weatherWeekDatas = weekData;
                        if ((parseInt(weather.currently.windBearing, 10) >= 337) || 
                            (parseInt(weather.currently.windBearing, 10) < 23)) {
                            widget.weatherWindBearing = 'arrow_0';
                        } else if ((parseInt(weather.currently.windBearing, 10) >= 23) && 
                            (parseInt(weather.currently.windBearing, 10) < 68)) {
                            widget.weatherWindBearing = 'arrow_0_90';
                        } else if ((parseInt(weather.currently.windBearing, 10) >= 68) && 
                            (parseInt(weather.currently.windBearing, 10) < 113)) {
                            widget.weatherWindBearing = 'arrow_90';
                        } else if ((parseInt(weather.currently.windBearing, 10) >= 113) && 
                            (parseInt(weather.currently.windBearing, 10) < 158)) {
                            widget.weatherWindBearing = 'arrow_90_180';
                        } else if ((parseInt(weather.currently.windBearing, 10) >= 158) && 
                            (parseInt(weather.currently.windBearing, 10) < 203)) {
                            widget.weatherWindBearing = 'arrow_180';
                        } else if ((parseInt(weather.currently.windBearing, 10) >= 203) && 
                            (parseInt(weather.currently.windBearing, 10) < 248)) {
                            widget.weatherWindBearing = 'arrow_180_270';
                        } else if ((parseInt(weather.currently.windBearing, 10) >= 248) && 
                            (parseInt(weather.currently.windBearing, 10) < 293)) {
                            widget.weatherWindBearing = 'arrow_270';
                        } else if ((parseInt(weather.currently.windBearing, 10) >= 293) && 
                            (parseInt(weather.currently.windBearing, 10) < 337)) {
                            widget.weatherWindBearing = 'arrow_270_360';
                        }
                        widget.weatherTemperatureFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 6.3 * widget.parameters.width;
                        widget.weatherSign1FontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 3.5 * widget.parameters.width;
                        widget.weatherSign2FontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 2 * widget.parameters.width;
                        widget.weatherSummary1FontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather *
                            parseFloat(widget.parameters.normal1Font.size) * 
                            widget.parameters.width;
                        widget.weatherWindSpeedFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 3 * widget.parameters.width;
                        widget.weatherMphFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather *  0.9 * widget.parameters.width;
                        widget.weatherMeasuresFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather *
                            parseFloat(widget.parameters.normal2Font.size) * 
                            widget.parameters.width;
                        widget.weatherDateFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather *
                            parseFloat(widget.parameters.headerFont.size) * 
                            widget.parameters.width;
                        widget.weatherSummary2FontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather *
                            parseFloat(widget.parameters.normal1Font.size) * 
                            widget.parameters.width;
                        widget.weatherInfoFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 2.5 * widget.parameters.width;
                        widget.weatherPercentFontSize = 0.8;
                        widget.weatherWeekDayFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 1.2 * widget.parameters.width;
                        widget.weatherWeekTemperatureFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 2.5 * widget.parameters.width;
                        widget.weatherSign3FontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 1.8 * widget.parameters.width;
                        widget.weatherSign4FontSize = 
                            PRESENT_CONFIG.ResponsiveValue.weather * 1 * widget.parameters.width;
                        break;
                    case 'Energy Equivalencies':
                        if (widget.parameters.widgetEnergyOrientation === 'Horizontal') {
                            switch (widget.parameters.widgetEnergyType) {
                                case 'Cars Removed':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/cars.html';
                                    break;
                                case 'Energy Homes Generated':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/energy-home.html';
                                    break;
                                case 'Waste Recycled':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/waste-tones.html';
                                    break;
                                case 'Electricity Homes Generated':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/eletrcity-home.html';
                                    break;
                                case 'Gallons Gas Saved':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/gallons.html';
                                    break;
                                case 'Coal Eliminated':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/railcars.html';
                                    break;
                                case 'Tanker Gas Saved':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/tanker.html';
                                    break;
                                case 'Oil Unneeded':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/barrels.html';
                                    break;
                                case 'Plants Idled':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/coal.html';
                                    break;
                                case 'Forests Conversion Prevented':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/acres-corpland.html';
                                    break;
                                case 'Propane Cylinders':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/acres-corpland.html';
                                    break;
                                case 'Forests Preserved':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/acres.html';
                                    break;
                                case 'Seedling Grown':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/horizontal-energy/tree.html';
                                    break;

                            }

                            widget.parameters.energyTitleSize = 
                                PRESENT_CONFIG.ResponsiveValue.energy.title *
                                parseFloat(widget.parameters.headerFont.size) * 
                                widget.parameters.width;
                            widget.parameters.energyInveterValue = 
                                PRESENT_CONFIG.ResponsiveValue.energy.inveterValue *
                                parseFloat(widget.parameters.normal1Font.size) * 
                                widget.parameters.width;
                            widget.parameters.energyInveterName = 
                                PRESENT_CONFIG.ResponsiveValue.energy.inveterName *
                                parseFloat(widget.parameters.normal2Font.size) * 
                                widget.parameters.width;
                            widget.parameters.energyTopName = 
                                PRESENT_CONFIG.ResponsiveValue.energy.topName *
                                widget.parameters.width;
                            widget.parameters.energyLineFont = 
                                PRESENT_CONFIG.ResponsiveValue.energy.lineFont *
                                widget.parameters.width;
                            widget.parameters.energyPoundFont = 
                                PRESENT_CONFIG.ResponsiveValue.energy.poundFont *
                                parseFloat(widget.parameters.subHeaderFont.size) * 
                                widget.parameters.width;
                        } else {
                            switch (widget.parameters.widgetEnergyType) {
                                case 'Cars Removed':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/cars.html';
                                    break;
                                case 'Energy Homes Generated':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/energy-home.html';
                                    break;
                                case 'Waste Recycled':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/waste-tones.html';
                                    break;
                                case 'Electricity Homes Generated':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/eletrcity-home.html';
                                    break;
                                case 'Gallons Gas Saved':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/gallons.html';
                                    break;
                                case 'Coal Eliminated':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/railcars.html';
                                    break;
                                case 'Tanker Gas Saved':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/tanker.html';
                                    break;
                                case 'Oil Unneeded':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/barrels.html';
                                    break;
                                case 'Plants Idled':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/coal.html';
                                    break;
                                case 'Forests Conversion Prevented':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/acres-corpland.html';
                                    break;
                                case 'Propane Cylinders':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/propane.html';
                                    break;
                                case 'Forests Preserved':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/acres.html';
                                    break;
                                case 'Seedling Grown':
                                    widget.templateName = 
                                        '/bl-bv-presentation/views/widget/vertical-energy/tree.html';
                                    break;

                            }

                            if ((!widget.parameters.widgetEnergyCO2Kilograms) && 
                                (!widget.parameters.widgetEnergyGreenhouseKilograms)) {
                                widget.parameters.energyTitleSize = 
                                    PRESENT_CONFIG.ResponsiveValue.verticalEnergy.title1 *
                                    parseFloat(widget.parameters.headerFont.size) * 
                                    widget.parameters.width;
                            } else if (!(widget.parameters.widgetEnergyCO2Kilograms && 
                                widget.parameters.widgetEnergyGreenhouseKilograms)) {
                                widget.parameters.energyTitleSize = 
                                    PRESENT_CONFIG.ResponsiveValue.verticalEnergy.title2 *
                                    parseFloat(widget.parameters.headerFont.size) * 
                                    widget.parameters.width;
                            } else if (widget.parameters.widgetEnergyCO2Kilograms && 
                                widget.parameters.widgetEnergyGreenhouseKilograms) {
                                widget.parameters.energyTitleSize = 
                                    PRESENT_CONFIG.ResponsiveValue.verticalEnergy.title3 *
                                    parseFloat(widget.parameters.headerFont.size) * 
                                    widget.parameters.width;
                            }

                            widget.parameters.energyInveterValue = 
                                PRESENT_CONFIG.ResponsiveValue.verticalEnergy.inveterValue *
                                parseFloat(widget.parameters.normal1Font.size) * 
                                widget.parameters.width;
                            widget.parameters.energyInveterName = 
                                PRESENT_CONFIG.ResponsiveValue.verticalEnergy.inveterName *
                                parseFloat(widget.parameters.normal2Font.size) * 
                                widget.parameters.width;
                            widget.parameters.energyTopName = 
                                PRESENT_CONFIG.ResponsiveValue.verticalEnergy.topName *
                                widget.parameters.width;
                            widget.parameters.energyLineFont = 
                                PRESENT_CONFIG.ResponsiveValue.verticalEnergy.lineFont *
                                widget.parameters.width;
                            widget.parameters.energyPoundFont = 
                                PRESENT_CONFIG.ResponsiveValue.verticalEnergy.poundFont *
                                parseFloat(widget.parameters.subHeaderFont.size)  * 
                                widget.parameters.width;
                        }
                        console.log(widget._id);
                        var res = options.socketData.widgetData;
                        console.log('EE widgdt data');
                        console.log(res);
                        widget.parameters.widgetEnergyParamCars = 
                            parseFloat(res.passengerVehiclesPerYear).toFixed(1);
                        widget.parameters.widgetEnergyParamCoal = 
                            parseFloat(res.coalFiredPowerPlantEmissionsForOneYear).toFixed(1);
                        widget.parameters.widgetEnergyParamAcres = 
                            parseFloat(res.acresOfUSForestsStoringCarbonForOneYear).toFixed(1);
                        widget.parameters.widgetEnergyParamAcresCorpland = 
                            parseFloat(res.acresOfUSForestPreservedFromConversionToCropland).toFixed(1);
                        widget.parameters.widgetEnergyParamBarrels = 
                            parseFloat(res.barrelsOfOilConsumed).toFixed(1);
                        widget.parameters.widgetEnergyParamElectricityHome = 
                            parseFloat(res.homeElectricityUse).toFixed(1);
                        widget.parameters.widgetEnergyParamEnergyHome = 
                            parseFloat(res.homeEnergyUse).toFixed(1);
                        widget.parameters.widgetEnergyParamGallons = 
                            parseFloat(res.gallonsOfGasoline).toFixed(1);
                        widget.parameters.widgetEnergyParamProPane = 
                            parseFloat(res.propaneCylindersUsedForHomeBarbecues).toFixed(1);
                        widget.parameters.widgetEnergyParamRailcars = 
                            parseFloat(res.railcarsOfCoalburned).toFixed(1);
                        widget.parameters.widgetEnergyParamTanker = 
                            parseFloat(res.tankerTrucksFilledWithGasoline).toFixed(1);
                        widget.parameters.widgetEnergyParamTree = 
                            parseFloat(res.numberOfTreeSeedlingsGrownFor10Years).toFixed(1);
                        widget.parameters.widgetEnergyParamTones = 
                            parseFloat(res.tonsOfWasteRecycledInsteadOfLandfilled).toFixed(1);
                        widget.parameters.co2AvoidedInPounds = 
                            parseFloat(res.co2AvoidedInPounds).toFixed(1);
                        widget.parameters.greenhouseEmissionsInPounds = 
                            parseFloat(res.greenhouseEmissionsInPounds).toFixed(1);
                        break;
                    case 'How Does Solar Work':
                        if ((widget.parameters.headerFont.content === null) || 
                            (widget.parameters.headerFont.content === '')) {
                            widget.parameters.bodyHeightPadding = 100;
                        } else {
                            widget.parameters.bodyHeightPadding = 
                                (($scope.GridHeight * parseInt(widget.parameters.rowCount) - 6) - 
                                    (parseFloat(widget.parameters.headerFont.size) * 14 + 10))/
                                ($scope.GridHeight * parseInt(widget.parameters.rowCount)) * 100;
                        }
                        widget.templateName = '/bl-bv-presentation/views/widget/solar.html';
                        break;
                    case 'Solar Generation':

                        if (widget.parameters.widgetSolarGenerationOrientation === 'Horizontal') {
                            widget.templateName = '/bl-bv-presentation/views/widget/generation-horizontal.html';
                        } else {
                            widget.templateName = '/bl-bv-presentation/views/widget/generation-vertical.html';
                        }

                        if (widget.parameters.widgetSolarGenerationCurrent === true) {
                            widget.generationCurrentDisplay = 'block';
                        } else {
                            widget.generationCurrentDisplay = 'none';
                        }

                        if (widget.parameters.widgetSolarGenerationkWh === true) {
                            widget.generationTotalDisplay = 'block';
                        } else {
                            widget.generationTotalDisplay = 'none';
                        }

                        if ((widget.parameters.widgetSolarGenerationCurrent === true) && 
                            (widget.parameters.widgetSolarGenerationkWh === true)) {
                            widget.generationTotalMarginTop = 5;
                            widget.generationVerticalTotalMarginTop = 5;
                            widget.generationVerticalTotalBorder = '1px solid #d8d7dd';
                            widget.generationTopHeight = 21;
                            widget.generationBottomHeight = 79;
                        } else {
                            widget.generationTotalMarginTop = 0;
                            widget.generationVerticalTotalMarginTop = 0;
                            widget.generationVerticalTotalBorder = '0px';
                            widget.generationTopHeight = 34;
                            widget.generationBottomHeight = 66;
                        }

                        widget.generationTitleFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.generation *
                            parseFloat(widget.parameters.headerFont.size) * 
                            widget.parameters.width;
                        widget.generationSummaryFontSize = 
                            0.0024999468 * parseFloat(widget.parameters.normal2Font.size) * 
                            widget.parameters.width;
                        widget.generationReimbursementFontSize = 
                            0.00277772 * parseFloat(widget.parameters.subHeaderFont.size) * 
                            widget.parameters.width;
                        widget.generationValueFontSize = 
                            0.0025734765 * parseFloat(widget.parameters.normal1Font.size) * 
                            widget.parameters.width;
                        widget.generationSignFontSize = 0.6;
                        widget.generationDateFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.generation * 0.7 * widget.parameters.width;

                        widget.generationVerticalTitleFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.generationVertical *
                            parseFloat(widget.parameters.headerFont.size) * 
                            widget.parameters.width;
                        widget.generationVerticalSummaryFontSize = 
                            PRESENT_CONFIG.ResponsiveValue.generationVertical * 1.8 * widget.parameters.width;
                        widget.generationVerticalValueFontSize = 2;
                        widget.generationVerticalSignFontSize = 0.6;
                        widget.generationVerticalDateFontSize = 0.7;

                        var generation = options.socketData.widgetData;
                        console.log(widget._id);
                        console.log('Soloar Generation Data');
                        console.log(generation);
                        widget.generationCurrentGeneration = parseInt(generation.currentGeneration);
                        widget.generationkWhGenerated = parseInt(generation.kWhGenerated);
                        widget.reimbursementValue = parseInt(generation.reimbursement);
                        newDate = new Date(generation.startDate);
                        day = newDate.getDate();
                        month = newDate.getMonth() + 1;
                        year = newDate.getFullYear();
                        monthName = monthArray[newDate.getMonth()];
                        widget.generationSinceDate = monthName + ' ' + day + ', ' + year;
                        break;
                }
                $('.loadingData').hide();
                angular.forEach($scope.highchartsNG, function (ngConfig, widgetID){
                    var target = angular.element('#chartContainer-' + widgetID),
                        targetParent = target.parent();
                    if (targetParent.is(':visible')) {
                        angular.extend(ngConfig, {
                            size: {
                                'width': targetParent.width(),
                                'height': targetParent.height()
                            }
                        });
                    }
                });

                if ($scope.isPlaying === false) {
                    var widgetsEndpoints = [];

                    for(var i=0; i<widgets.length; i++){
                        var widgetStartTime = widgets[i].parameters.startDate;
                        var widgetDuration = widgets[i].parameters.duration;
                        var widgetEndPoint = 0;

                        widgetStartTime = widgetStartTime.split(':');
                        widgetEndPoint = parseInt(widgetStartTime, 10) * 60 + parseInt(widgetStartTime[1], 10);
                        widgetEndPoint = widgetEndPoint + widgetDuration;

                        widgetsEndpoints.push(widgetEndPoint);
                    }

                    widgetsEndpoints.sort(function(a, b) { return a - b; });
                    $scope.endTime = widgetsEndpoints[widgetsEndpoints.length-1];

                    var startPoint = PRESENT_CONFIG.StartPointMin * 60 + PRESENT_CONFIG.StartPointSec;
                    $scope.refreshTime = (widgetsEndpoints[widgetsEndpoints.length-1] - startPoint) * 1000;
                    $scope.playPresentation(startPoint, $scope.endTime);
                }
                
            });

            $scope.init = function(presentation) {
                $scope.presentationId = presentation._id;
                $scope.getPresentationInfo();
                var widgets = renderLoadWidgets;
                $scope.widgetJSON = JSON.stringify(renderLoadWidgets);
                $scope.getWidgetsInfo(widgets);
                //$scope.$apply();

                var widgetsEndpoints = [];

                for(var i=0; i<widgets.length; i++){
                    var widgetStartTime = widgets[i].parameters.startDate;
                    var widgetDuration = widgets[i].parameters.duration;
                    var widgetEndPoint = 0;

                    widgetStartTime = widgetStartTime.split(':');
                    widgetEndPoint = parseInt(widgetStartTime, 10) * 60 + parseInt(widgetStartTime[1], 10);
                    widgetEndPoint = widgetEndPoint + widgetDuration;

                    widgetsEndpoints.push(widgetEndPoint);
                }

                widgetsEndpoints.sort(function(a, b) { return a - b; });
                $scope.endTime = widgetsEndpoints[widgetsEndpoints.length-1];
                var startPoint = 0;
                startPoint = parseInt(PRESENT_CONFIG.StartPointMin,10) * 60 + parseInt(PRESENT_CONFIG.StartPointSec,10);
                $scope.refreshTime = (widgetsEndpoints[widgetsEndpoints.length-1] - startPoint) * 1000;
                //$timeout(function() {
                    /*$(".loadingData").hide();
                    $scope.playPresentation(startPoint, $scope.endTime);*/
                    presentation.widgets = $scope.widgets;
                    socketService.socketGetWidgetsData(presentation);
                //},
                $scope.refreshData();
            };
            $scope.GridColCnt = 16;
            $scope.GridRowCnt = 7;
            $scope.GridWidth = gridWidth;
            $scope.GridHeight = gridHeight;
            $scope.isMobile = false;
            $scope.imgUrl = $rootScope.baseCDNUrl + '/bl-bv-presentation/assets/img/';
            $scope.systemSize = '';
            $scope.generatingSinceDate = '';
            $scope.lastUpdatedDate = '';

            var isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function() {
                    //return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    return navigator.userAgent.match(/iPhone|iPod/i);
                },
                Opera: function() {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function() {
                    return (isMobile.Android() || isMobile.BlackBerry()
                            || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };

            if((isMobile.any() && (window.innerHeight > window.innerWidth)) || (window.outerWidth < (screen.width/2))){
                $('.presentationBody').css('overflow', 'visible');
                if (!(isMobile.any())) {
                    gridWidth = ($('.presentationBody').width() - 17) / 8;
                } else {
                    gridWidth = $('.presentationBody').width() / 8;
                }
                gridHeight = gridWidth;
                var presentationHeight = gridWidth * 14;
                $('.header_pt').css('position', 'relative');
                $('.header_pt').css('height', '60px');
                $('.presentationContainer').height(presentationHeight);
                $('.presentationContainer').css('position', 'relative');
                $('.presentationContainer').css('padding-top', '5px');
                $('.presentationFooter').css('height', '25px');
                $('.presentationFooter').css('position', 'relative');
                $('.pt_description').hide();

                $scope.GridColCnt = 8;
                $scope.GridRowCnt = 14;
                $scope.GridWidth = gridWidth;
                $scope.GridHeight = gridHeight;
                $scope.isMobile = true;
            }

            $('.loadingData').show();

            $scope.widgets = [];
            $scope.modals = [];
            $scope.editFlag = false;

            $scope.sunAnimation = function() {
                $scope.showAllowSmall = true;
                $scope.showAllowLarge = false;
                sunTimer1 = $timeout($scope.sunAnimation1, 1000);
                sunTimer2 = $timeout($scope.sunAnimation2, 1250);
                sunTimer = $timeout($scope.sunAnimation,2250);
            };

            $scope.sunAnimation1 = function () {
                $scope.showAllowSmall = false;
            };

            $scope.sunAnimation2 = function () {
                $scope.showAllowLarge = true;
            };

            $scope.panelAnimation = function() {
                $scope.showEnergy1 = true;
                $scope.showEnergy2 = false;
                panelTimer1 = $timeout($scope.panelAnimation1, 1000);
                panelTimer = $timeout($scope.panelAnimation, 2000);
            };

            $scope.panelAnimation1 = function() {
                $scope.showEnergy1 = false;
                $scope.showEnergy2 = true;
            };

            $scope.greenBoxAnimation = function() {
                $scope.showInvertor1 = true;
                $scope.showInvertor2 = false;
                greenBoxTimer1 = $timeout($scope.greenBoxAnimation1, 1000);
                greenBoxTimer = $timeout($scope.greenBoxAnimation, 2000);
            };

            $scope.greenBoxAnimation1 = function() {
                $scope.showInvertor1 = false;
                $scope.showInvertor2 = true;
            };

            $scope.blueBoxAnimation = function() {
                $scope.showMeter1 = true;
                $scope.showMeter2 = false;
                blueBoxTimer1 = $timeout($scope.blueBoxAnimation1, 1000);
                blueBoxTimer = $timeout($scope.blueBoxAnimation, 2000);
            };

            $scope.blueBoxAnimation1 = function() {
                $scope.showMeter1 = false;
                $scope.showMeter2 = true;
            };

            $scope.solarDurationStep1 = function(steponeduration, steptwoduration, stepthreeduration,
                                                 stepfourduration, steponecontent, steptwocontent,
                                                 stepthreecontent, stepfourcontent, elementId) {
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
                    $('#'+elementId+' .textareaStep1').html('');
                    for (i = lineArray.length-1; i >= 0; i--) {
                        var tspanText = lineArray[i];
                        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        obj.setAttributeNS(null, 'font-size', 24);
                        obj.setAttributeNS(null, 'x', 0);
                        obj.setAttributeNS(null, 'y', rowHeight*i);
                        obj.setAttributeNS(null, 'font-family', 'Benton Sans');
                        obj.setAttributeNS(null, 'fill', '#FFFFFF');
                        obj.textContent = tspanText;
                        $('#'+elementId+' .textareaStep1')[0].appendChild(obj);
                    }

                    $scope.solarShowStep1 = true;
                    $scope.showEnergy = true;
                    $scope.panelAnimation();
                    $scope.$apply();
                    $scope.textareaStep1 = rowHeight * parseInt(lineArray.length) + 10;

                    if(parseInt($scope.textareaStep1) > 125) {
                        $scope.pathHeightStep1 = 569.354 + parseInt($scope.textareaStep1) - 125;
                        $scope.foreignObjectHeightStep1 = parseInt($scope.textareaStep1);
                    }
                    $scope.solarDurationStep2(steponeduration, steptwoduration, stepthreeduration,
                                              stepfourduration, steponecontent, steptwocontent,
                                              stepthreecontent, stepfourcontent, elementId);
                }, 10);
            };
            $scope.solarDurationStep2 = function(steponeduration, steptwoduration, stepthreeduration,
                                                 stepfourduration, steponecontent, steptwocontent,
                                                 stepthreecontent, stepfourcontent, elementId) {
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
                    $('#'+elementId+' .textareaStep2').html('');
                    for (i = lineArray.length-1; i >= 0; i--) {
                        var tspanText = lineArray[i];
                        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        obj.setAttributeNS(null, 'font-size', 24);
                        obj.setAttributeNS(null, 'x', 0);
                        obj.setAttributeNS(null, 'y', rowHeight*(i+1));
                        obj.setAttributeNS(null, 'font-family', 'Benton Sans');
                        obj.setAttributeNS(null, 'fill', '#FFFFFF');
                        obj.textContent = tspanText;
                        $('#'+elementId+' .textareaStep2')[0].appendChild(obj);
                    }

                    $scope.solarShowStep2 = true;
                    $scope.$apply();
                    $scope.textareaStep2 = rowHeight * parseInt(lineArray.length) + 10;

                    if(parseInt($scope.textareaStep2) > 125) {
                        $scope.pathHeightStep2 = 830.344 + parseInt($scope.textareaStep2) - 125;
                        $scope.foreignObjectHeightStep2 = parseInt($scope.textareaStep2);
                    }
                    $scope.solarDurationStep3(steponeduration, steptwoduration, stepthreeduration,
                        stepfourduration, steponecontent, steptwocontent,
                        stepthreecontent, stepfourcontent, elementId);

                }, time);
            };
            $scope.solarDurationStep3 = function(steponeduration, steptwoduration, stepthreeduration,
                                                 stepfourduration, steponecontent, steptwocontent,
                                                 stepthreecontent, stepfourcontent, elementId) {
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
                    $('#'+elementId+' .textareaStep3').html('');
                    for (i = lineArray.length-1; i >= 0; i--) {
                        var tspanText = lineArray[i];
                        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        obj.setAttributeNS(null, 'font-size', 24);
                        obj.setAttributeNS(null, 'x', 0);
                        obj.setAttributeNS(null, 'y', rowHeight*(i+1));
                        obj.setAttributeNS(null, 'font-family', 'Benton Sans');
                        obj.setAttributeNS(null, 'fill', '#FFFFFF');
                        obj.textContent = tspanText;
                        $('#'+elementId+' .textareaStep3')[0].appendChild(obj);
                    }

                    $scope.solarShowStep3 = true;
                    $scope.showInvertor = true;
                    $scope.greenBoxAnimation();
                    $scope.$apply();
                    $scope.textareaStep3 = rowHeight * parseInt(lineArray.length) + 10;
                    if(parseInt($scope.textareaStep3) > 125) {
                        $scope.pathHeightStep3 = 860.11 + parseInt($scope.textareaStep3) - 125;
                        $scope.foreignObjectHeightStep3 = parseInt($scope.textareaStep3);
                    }
                    $scope.solarDurationStep4(steponeduration, steptwoduration, stepthreeduration, stepfourduration,
                        steponecontent, steptwocontent, stepthreecontent, stepfourcontent, elementId);

                }, time);
            };
            $scope.solarDurationStep4 = function(steponeduration, steptwoduration, stepthreeduration,
                                                 stepfourduration, steponecontent, steptwocontent,
                                                 stepthreecontent, stepfourcontent, elementId) {
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
                    $('#'+elementId+' .textareaStep4').html('');
                    for (i = lineArray.length-1; i >= 0; i--) {
                        var tspanText = lineArray[i];
                        var obj = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        obj.setAttributeNS(null, 'font-size', 24);
                        obj.setAttributeNS(null, 'x', 0);
                        obj.setAttributeNS(null, 'y', rowHeight*(i+1));
                        obj.setAttributeNS(null, 'font-family', 'Benton Sans');
                        obj.setAttributeNS(null, 'fill', '#FFFFFF');
                        obj.textContent = tspanText;
                        $('#'+elementId+' .textareaStep4')[0].appendChild(obj);
                    }

                    $scope.solarShowStep4 = true;
                    $scope.showElectric = true;
                    $scope.showMeter = true;
                    $scope.blueBoxAnimation();
                    $scope.$apply();
                    $scope.textareaStep4 = rowHeight * parseInt(lineArray.length) + 10;
                    if(parseInt($scope.textareaStep4) > 125) {
                        $scope.pathHeightStep4 = 619.927 + parseInt($scope.textareaStep4) - 125;
                        $scope.foreignObjectHeightStep4 = parseInt($scope.textareaStep4);
                    }
                }, time);
            };


            // draw chart
            $scope.drawChart = function (widgetId, width, height, interval, dateRange,
                                         secondColor, thirdColor, fourthColor, fifthColor,
                                         sixthColor, seventhColor, normal2FontColor, normal2FontSize,
                                         normal2FontName, backgroundImage, backgroundColor) {

                var apiUrl = '/present/presentations/' + $scope.presentationId + '/widgets/graph/' + widgetId;

                $http
                    .get(apiUrl)
                    .then(function (res) {
                        console.log(res);
                        if (!res) {
                            alert('Error. Please try again');
                            return 'fail';
                        } else if (res.error) {
                            $('#preview').html('<p style=\'color: red;\'>' + res.error + '</p>');
                            return 'fail';
                        } else if (!res.series.length) {
                            $('#preview').html('<p style=\'color: red;\'>Data not exists</p>');
                            return 'fail';
                        }

                        var maxTime = 0, minTime = 0, objCnt;

                        angular.forEach(res.series, function (s) {
                            if (s.data.length > 0) {
                                objCnt = s.data.length;
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
                        console.log('Tick Interval');
                        console.log(maxTime);
                        console.log(minTime);
                        var tickInterval = (maxTime - minTime) / 7;
                        console.log(tickInterval);

                        angular.extend(res, {
                            size: {
                                'width': width,
                                'height': height
                            },
                            loading: false
                        });
                        angular.forEach(res.yAxis, function (yAxis, idx) {
                            var color = '000';
                            switch (yAxis.title.text) {
                                case 'Generation':
                                    color = secondColor;
                                    break;
                                case 'Current Power':
                                    color = fifthColor;
                                    break;
                                case 'Max Power':
                                    color = sixthColor;
                                    break;
                                case 'Humidity':
                                    color = fourthColor;
                                    break;
                                case 'Temperature':
                                    color = thirdColor;
                                    break;
                                case 'Weather':
                                    color = seventhColor;
                                    break;
                            }
                            res.series[idx].color = color;
                            angular.extend(yAxis, {
                                labels: {
                                    style: {
                                        color: color
                                    }
                                },
                                title: {
                                    text: '',
                                    opposite: res.series[idx].type !== 'spline'
                                    /*x: 0,
                                     //                                  align: 'low',
                                     //                                  rotation: 0,
                                     //                                  y: 20,
                                     style:{
                                     color: normal2FontColor,
                                     fontSize: normal2FontSize + 'em',
                                     fontFamily: normal2FontName
                                     }*/
                                }
                            });
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

                        if (objCnt > 8) {
                            console.log('Update Interval');
                            if ((interval === 'Daily') && (dateRange === 'Month')) {
                                console.log('Monday');
                                angular.extend(res.xAxis, {
                                    tickInterval: 5 * 24 * 3600 * 1000
                                });
                            } else {
                                angular.extend(res.xAxis, {
                                    tickInterval: tickInterval
                                });
                            }

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
                            angular.extend(res, {
                                options: {
                                    'chart': {
                                        backgroundColor: 'Transparent'
                                    }
                                }
                            });
                            angular.element('#chartContainer-' + widgetId)
                                .css('background-image', 'url(' + backgroundImage + ')');
                        }
                        $scope.highchartsNG[widgetId] = res;
                        return 'success';
                    });
                //          }, {buffer:false, escape: false});
            };

            $scope.drawRealtimeChart = function (widgetData, widgetId, width, height, interval, 
                dateRange, secondColor, thirdColor, fourthColor, fifthColor, sixthColor, seventhColor, 
                normal2FontColor, normal2FontSize, normal2FontName, backgroundImage, backgroundColor) {
                console.log('Realtime Graph data');
                console.log(widgetData);
                var res = widgetData;
                if(res === null) {
                    alert('Error. Please try again');
                    return 'fail';
                } else if(res.hasOwnProperty('error')) {
                    console.log(res.error);
                    $('#preview').html('<p style="color: red;">' + res.error + '</p>');
                    return 'fail';
                } else if (res.series.length === 0) {
                    $('#preview').html('<p style="color: red;">Data not exists</p>');
                    return 'fail';
                }

                var maxTime=0, minTime=0, objCnt;

                angular.forEach(res.series, function(s) {
                    if (s.data.length > 0) {
                        objCnt = s.data.length;
                        var temp = s.data[s.data.length-1].x;
                        if(temp >= maxTime){
                            maxTime = temp;
                        }
                    }
                });

                minTime = maxTime;
                angular.forEach(res.series, function(s) {
                    if (s.data.length > 0) {
                        var temp = s.data[0].x;
                        if(temp <= minTime){
                            minTime = temp;
                        }
                    }
                });
                console.log('Tick Interval');
                console.log(maxTime);
                console.log(minTime);
                var tickInterval = (maxTime - minTime) / 7;
                console.log(tickInterval);

                angular.extend(res, {
                    size: {
                        'width': width,
                        'height': height
                    },
                    loading: false
                });
                angular.forEach(res.yAxis, function (yAxis, idx) {
                    var color = '000';
                    switch (yAxis.title.text) {
                        case 'Generation':
                            color = secondColor;
                            break;
                        case 'Current Power':
                            color = fifthColor;
                            break;
                        case 'Max Power':
                            color = sixthColor;
                            break;
                        case 'Humidity':
                            color = fourthColor;
                            break;
                        case 'Temperature':
                            color = thirdColor;
                            break;
                        case 'Weather':
                            color = seventhColor;
                            break;
                    }
                    res.series[idx].color = color;
                    angular.extend(yAxis, {
                        labels: {
                            style: {
                                color: color
                            }
                        },
                        title:{
                            text: '',
                            opposite: res.series[idx].type !== 'spline'
                        }
                    });
                });

                if ((interval === 'Hourly') && (dateRange === '3 Days')) {
                    angular.extend(res.xAxis, {
                        dateTimeLabelFormats : {
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
                        dateTimeLabelFormats : {
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

                if (objCnt > 8 ) {
                    console.log('Update Interval');
                    if ((interval === 'Daily') && (dateRange === 'Month')) {
                        console.log('Monday');
                        angular.extend(res.xAxis, {
                            tickInterval: 5 * 24 * 3600 * 1000
                        });
                    } else {
                        angular.extend(res.xAxis, {
                            tickInterval: tickInterval
                        });
                    }

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
                    angular.extend(res, {
                        options: {
                            'chart': {
                                backgroundColor: 'Transparent'
                            }
                        }
                    });
                    angular.element('#chartContainer-'+widgetId).css(
                        'background-image', 'url(' + backgroundImage + ')');
                }
                $scope.highchartsNG[widgetId] = res;
                return 'success';
            };                        

            // get Energy widget data
            $scope.drawEnergyWidget = function (widgetId, wp) {
                var apiUrl = '/present/presentations/' + $scope.presentationId +
                    '/widgets/energyequivalencies/' + widgetId;
                $http
                    .get(apiUrl)
                    .then(function(res) {
                        console.log('EE widgdt data');
                        console.log(res[0]);
                        wp.parameters.widgetEnergyParamCars =
                            parseFloat(res[0].passengerVehiclesPerYear).toFixed(1);
                        wp.parameters.widgetEnergyParamCoal =
                            parseFloat(res[0].coalFiredPowerPlantEmissionsForOneYear).toFixed(1);
                        wp.parameters.widgetEnergyParamAcres =
                            parseFloat(res[0].acresOfUSForestsStoringCarbonForOneYear).toFixed(1);
                        wp.parameters.widgetEnergyParamAcresCorpland =
                            parseFloat(res[0].acresOfUSForestPreservedFromConversionToCropland).toFixed(1);
                        wp.parameters.widgetEnergyParamBarrels =
                            parseFloat(res[0].barrelsOfOilConsumed).toFixed(1);
                        wp.parameters.widgetEnergyParamElectricityHome =
                            parseFloat(res[0].homeElectricityUse).toFixed(1);
                        wp.parameters.widgetEnergyParamEnergyHome =
                            parseFloat(res[0].homeEnergyUse).toFixed(1);
                        wp.parameters.widgetEnergyParamGallons =
                            parseFloat(res[0].gallonsOfGasoline).toFixed(1);
                        wp.parameters.widgetEnergyParamProPane =
                            parseFloat(res[0].propaneCylindersUsedForHomeBarbecues).toFixed(1);
                        wp.parameters.widgetEnergyParamRailcars =
                            parseFloat(res[0].railcarsOfCoalburned).toFixed(1);
                        wp.parameters.widgetEnergyParamTanker =
                            parseFloat(res[0].tankerTrucksFilledWithGasoline).toFixed(1);
                        wp.parameters.widgetEnergyParamTree =
                            parseFloat(res[0].numberOfTreeSeedlingsGrownFor10Years).toFixed(1);
                        wp.parameters.widgetEnergyParamTones =
                            parseFloat(res[0].tonsOfWasteRecycledInsteadOfLandfilled).toFixed(1);

                        $scope.$apply();
                    });
            };

            $scope.putNewData = function(widgetId) {
                var widgetsObj = JSON.parse($scope.widgetJSON);
                var oldWidget = $.grep($scope.widgets, function(e){ return e._id === widgetId;})[0];
                var newWidget = $.grep(widgetsObj, function(e){ return e._id === widgetId;})[0];
                oldWidget.parameters.rowPosition = newWidget.parameters.rowPosition;
                oldWidget.parameters.colPosition = newWidget.parameters.colPosition;
                oldWidget.parameters.rowCount = newWidget.parameters.rowCount;
                oldWidget.parameters.colCount = newWidget.parameters.colCount;
                $scope.compileWidget(oldWidget, false);
            };

            $scope.getWidgetsInfo = function(widgets) {
                if ($scope.widgets.length) {
                    $.each($scope.widgets, function(oldIdx, oldWidget) {
                        var checkId = 0;
                        $.each(widgets, function(newIdx, newWidget) {
                            if(oldWidget._id === newWidget._id) {
                                checkId = 1;
                            }
                        });
                        if (!checkId) {
                            $scope.widgets.splice(oldIdx, 1);
                        }
                    });
                    $.each(widgets, function(newIdx, newWidget) {
                        var checkId = 0;
                        $.each($scope.widgets, function(oldIdx, oldWidget) {
                            if(oldWidget._id === newWidget._id) {
                                checkId = 1;
                                angular.copy(newWidget, $scope.widgets[oldIdx]);
                            }
                        });
                        if (!checkId) {
                            $scope.widgets.push(newWidget);
                        }
                    });


                    $.each($scope.tempWidgets, function(oldIdx, oldWidget) {
                        var checkId = 0;
                        $.each(widgets, function(newIdx, newWidget) {
                            if (oldWidget._id === newWidget._id) {
                                checkId = 1;
                            }
                        });
                        if (!checkId) {
                            $scope.tempWidgets.splice(oldIdx, 1);
                        }
                    });
                    $.each(widgets, function(newIdx, newWidget) {
                        var checkId = 0;
                        $.each($scope.tempWidgets, function(oldIdx, oldWidget) {
                            if(oldWidget._id === newWidget._id) {
                                checkId = 1;
                                $scope.tempWidgets[oldIdx].rowPosition = newWidget.parameters.rowPosition;
                                $scope.tempWidgets[oldIdx].colPosition = newWidget.parameters.colPosition;
                                $scope.tempWidgets[oldIdx].rowCount = newWidget.parameters.rowCount;
                                $scope.tempWidgets[oldIdx].colCount = newWidget.parameters.colCount;
                            }
                        });
                        if (!checkId) {
                            var tempWidget = {
                                '_id': newWidget._id,
                                'rowPosition': newWidget.parameters.rowPosition,
                                'colPosition': newWidget.parameters.colPosition,
                                'rowCount': newWidget.parameters.rowCount,
                                'colCount': newWidget.parameters.colCount
                            };
                            $scope.tempWidgets.push(tempWidget);
                        }
                    });

                } else {
                    $scope.widgets = widgets ;
                    $scope.tempWidgets = [];
                    $.each(widgets, function(newIdx, newWidget) {
                        var tempWidget = {
                            '_id': newWidget._id,
                            'rowPosition': newWidget.parameters.rowPosition,
                            'colPosition': newWidget.parameters.colPosition,
                            'rowCount': newWidget.parameters.rowCount,
                            'colCount': newWidget.parameters.colCount
                        };
                        $scope.tempWidgets.push(tempWidget);
                    });
                }

                $.each($scope.widgets, function(idx, widget) {
                    $scope.pathHeightStep1 = 569.354;
                    $scope.foreignObjectHeightStep1 = 125;

                    $scope.pathHeightStep2 = 830.344;
                    $scope.foreignObjectHeightStep2 = 125;

                    $scope.pathHeightStep3 = 860.11;
                    $scope.foreignObjectHeightStep3 = 125;

                    $scope.pathHeightStep4 = 619.927;
                    $scope.foreignObjectHeightStep4 = 125;



                    var elementStart = widget.parameters.startDate;
                    /*var elementDuration = widget.parameters.duration;*/

                    elementStart = elementStart.split(':');
                    elementStart = parseInt(elementStart[0],10) * 60 + parseInt(elementStart[1],10);
                    if (widget.name) {
                        widget.weatherCurrentlyIcon = 'clear-day';
                        widget.weatherWindBearing = 'arrow_0';
                    }
                    $scope.compileWidget(widget, true);

                });
                //end widgets each
                //$scope.$apply();
            };

            // get widget instance info by five minutes
            $scope.refreshData = function () {
                $timeout(function() {
                    $scope.getPresentationInfo();
                    console.log('Get Widget Instances By Five Minutes');
                    var apiUrl = '/present/presentations/' + $scope.presentationId + '/widgets';
                    $http
                        .get(apiUrl)
                        .then(function(widgets) {
                            var widgetsEndpoints = [];
                            $scope.widgetJSON = JSON.stringify(widgets);
                            $scope.getWidgetsInfo(widgets);
                            for(var i=0; i<widgets.length; i++){
                                var widgetStartTime = widgets[i].parameters.startDate;
                                var widgetDuration = widgets[i].parameters.duration;
                                var widgetEndPoint = 0;

                                widgetStartTime = widgetStartTime.split(':');
                                widgetEndPoint = parseInt(widgetStartTime, 10) * 60 + parseInt(widgetStartTime[1], 10);
                                widgetEndPoint = widgetEndPoint + widgetDuration;

                                widgetsEndpoints.push(widgetEndPoint);
                            }
                            widgetsEndpoints.sort(function(a, b) { return a - b; });
                            $scope.endTime = widgetsEndpoints[widgetsEndpoints.length-1];
                            console.log('End Time');
                            console.log($scope.endTime);
                        });
                }, 300000);
            };

            

            $scope.compileWidget = function (widget, remote) {
                var containerWidth = $('.presentationBody').width();
                var containerHeight = $('.presentationBody').height();
                var style;

                if ($scope.isMobile) {
                    var widgetGridWidth = parseFloat(widget.parameters.colPosition) +
                                            parseFloat(widget.parameters.colCount);
                    if (parseFloat(widget.parameters.colPosition) < $scope.GridColCnt &&
                        widgetGridWidth > $scope.GridColCnt) {
                        widget.parameters.colPosition = 0;
                        widget.parameters.rowPosition = 0;
                        var originalColCount = widget.parameters.colCount;
                        var aspect = $scope.GridColCnt / originalColCount;
                        var filteredRowCount = parseInt(widget.parameters.rowCount) * aspect;

                        widget.parameters.orgColCount = originalColCount*1;
                        widget.parameters.orgRowCount = parseInt(widget.parameters.rowCount)*1;
                        widget.parameters.orgColPosition = parseInt(widget.parameters.colPosition)*1;
                        widget.parameters.orgRowPosition = parseInt(widget.parameters.rowPosition)*1;

                        widget.parameters.colCount = $scope.GridColCnt;
                        widget.parameters.rowCount = filteredRowCount;
                    } else if (parseFloat(widget.parameters.colPosition) >= $scope.GridColCnt) {

                        widget.parameters.orgColCount = parseInt(widget.parameters.colCount)*1;
                        widget.parameters.orgRowCount = parseInt(widget.parameters.rowCount)*1;
                        widget.parameters.orgColPosition = parseInt(widget.parameters.colPosition)*1;
                        widget.parameters.orgRowPosition = parseInt(widget.parameters.rowPosition)*1;

                        widget.parameters.colPosition = parseFloat(widget.parameters.colPosition) - $scope.GridColCnt;
                        widget.parameters.rowPosition = parseFloat(widget.parameters.rowPosition) + 7;
                    }
                }

                widget.parameters.orgColCount = parseInt(widget.parameters.colCount)*1;
                widget.parameters.orgRowCount = parseInt(widget.parameters.rowCount)*1;
                widget.parameters.orgColPosition = parseInt(widget.parameters.colPosition)*1;
                widget.parameters.orgRowPosition = parseInt(widget.parameters.rowPosition)*1;

                widget.parameters.height = $scope.GridHeight * parseInt(widget.parameters.rowCount);
                widget.parameters.width =  $scope.GridWidth * parseInt(widget.parameters.colCount);
                widget.parameters.heightPercent = ($scope.GridHeight * parseInt(widget.parameters.rowCount)) /
                                                    containerHeight * 100;
                widget.parameters.widthPercent =  ($scope.GridWidth * parseInt(widget.parameters.colCount)) /
                                                    containerWidth * 100;
                widget.parameters.heightPadding = ($scope.GridHeight * parseInt(widget.parameters.rowCount) - 8) /
                                                    ($scope.GridHeight * parseInt(widget.parameters.rowCount)) * 100;
                widget.parameters.widthPadding =  ($scope.GridWidth * parseInt(widget.parameters.colCount) - 8) /
                                                    ($scope.GridWidth * parseInt(widget.parameters.colCount)) * 100;
                widget.parameters.top = (parseInt(widget.parameters.rowPosition) * $scope.GridHeight) /
                                                    containerHeight * 100;
                widget.parameters.left = (parseInt(widget.parameters.colPosition) * $scope.GridWidth) /
                                                    containerWidth * 100;

                if ($scope.GridRowCnt <
                    parseInt(widget.parameters.rowPosition) + parseInt(widget.parameters.rowCount)) {
                    widget.parameters.rowPosition = $scope.GridRowCnt - parseInt(widget.parameters.rowCount);
                    widget.parameters.top = parseInt(widget.parameters.rowPosition) * $scope.GridHeight +
                                            parseInt(widget.parameters.rowPosition) + 2;
                }

                if ($scope.GridColCnt <
                    parseInt(widget.parameters.colPosition) + parseFloat(widget.parameters.colCount)) {
                    widget.parameters.colPosition = $scope.GridColCnt - parseInt(widget.parameters.colCount);
                    widget.parameters.left = widget.parameters.colPosition * $scope.GridWidth +
                                             widget.parameters.colPosition - 1;
                }


                if (parseInt(widget.parameters.colCount) === 1) {
                    style = $.grep(PRESENT_CONFIG.WidgetStyleArray, function(e){ return e.row === 1;});
                    var styleTemp = $.grep(PRESENT_CONFIG.WidgetStyleArray, function(e){
                        return e.row === parseInt(widget.parameters.rowCount);
                    });
                    style[0]['img_top'] = styleTemp[0]['img_top'];
                } else {
                    style = $.grep(PRESENT_CONFIG.WidgetStyleArray, function(e){
                        return e.row === parseInt(widget.parameters.rowCount);
                    });
                }

                widget.parameters.style = style[0];

                // contvert startDate and endDate
                widget.parameters.widgetGraphStartDate =
                    $scope.dateFormatConvert(widget.parameters.widgetGraphStartDate);
                widget.parameters.widgetGraphEndDate = $scope.dateFormatConvert(widget.parameters.widgetGraphEndDate);
                widget.parameters.widgetSolarGenerationStartDate =
                    $scope.dateFormatConvert(widget.parameters.widgetSolarGenerationStartDate);
                widget.parameters.widgetSolarGenerationEndDate =
                    $scope.dateFormatConvert(widget.parameters.widgetSolarGenerationEndDate);
                widget.parameters.widgetEnergyStartDate =
                    $scope.dateFormatConvert(widget.parameters.widgetEnergyStartDate);
                widget.parameters.widgetEnergyEndDate = $scope.dateFormatConvert(widget.parameters.widgetEnergyEndDate);

                //show startDate and endDate by Date Range
                widget.graphCustom = widget.parameters.widgetGraphDateRange === '-- Custom --';
                widget.generationCustom = widget.parameters.widgetSolarGenerationDateRange === '-- Custom --';
                widget.energyCustom = widget.parameters.widgetEnergyDateRange === '-- Custom --';

            };

            $scope.getSoloarGenerationData = function (widgetId) {
                var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                                  'September', 'October', 'November', 'December'];
                var apiUrl = '/present/presentations/' + $scope.presentationId +
                    '/widgets/solargeneration/' + widgetId;
                $http
                    .get(apiUrl)
                    .then(function(generation) {
                        console.log('Soloar Generation Data');
                        console.log(generation);
                        $scope.generationCurrentGeneration = parseInt(generation.currentGeneration);
                        $scope.generationkWhGenerated = parseInt(generation.kWhGenerated);
                        var newDate = new Date(generation.startDate);
                        var day = newDate.getDate();
                        var year = newDate.getFullYear();
                        var monthName = monthArray[newDate.getMonth()];
                        $scope.generationSinceDate = monthName + ' ' + day + ', ' + year;
                        $scope.$apply();
                    });
            };

            $scope.dateFormatConvert = function(date) {
                if (date) {
                    return date.substring(0, 16).replace('T',' ');
                } else {
                    var newDate = new Date();
                    var day = newDate.getDate();
                    var month = newDate.getMonth() + 1;
                    var year = newDate.getFullYear();
                    var hour = newDate.getHours();
                    var minutes = newDate.getMinutes();
                    if (month < 10) {
                        month = '0' + month;
                    }
                    if (day < 10) {
                        day = '0' + day;
                    }
                    var dateString = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;

                    return dateString;
                }
            };

            $scope.checkWidgets = [];
            $scope.playPresentation = function(startPoint, endPoint) {

                $scope.isPlaying = true;

                var stopPoint = endPoint + 1;
                PlayPresentationTimer = $timeout(function() {
                    if (startPoint === stopPoint) {
                        console.log('End presenation');
                        $timeout.cancel(PlayPresentationTimer);
                        $('.pt_components').hide();
                        startPoint = PRESENT_CONFIG.StartPointMin * 60 + PRESENT_CONFIG.StartPointSec;
                        console.log('Before end presenation, compile widget');
                        $scope.playPresentation(startPoint, $scope.endTime);
                        $scope.checkWidgets = [];
                    } else {
                        $('.pt_components').each(function(ind, obj){
                            var elementStart = $(this).attr('data-startpoint');
                            var elementDuration = $(this).attr('data-duration');
                            var elementEnd;
                            var widgetId = $(this).attr('data-widgetId');
                            var elementId = $(this).attr('id');
                            var videoElm = null;

                            elementStart = elementStart.split(':');
                            elementStart = parseInt(elementStart[0],10) * 60 + parseInt(elementStart[1],10);
                            elementEnd = elementStart + parseInt(elementDuration,10);

                            if (startPoint >= elementStart && startPoint < elementEnd )
                            {
                                $scope.putNewData(widgetId);
                                $(this).fadeIn(300);
                                var transtionIn = $(this).attr('data-transitionIn') + ' animated';
                                var transtionOut = $(this).attr('data-transitionOut') + ' animated';
                                if (startPoint === elementStart) {
                                    $(this)
                                    .removeClass(transtionIn)
                                    .addClass(transtionIn)
                                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                        function(){
                                            $(this).removeClass(transtionIn);
                                        });
                                }

                                if ($('videogular', this).length > 0) {
                                    videoElm = $rootScope.videoAPI[widgetId][0];
                                    if (startPoint >= (elementEnd - 1)) {
                                        if (videoElm.currentState === 'play') {
                                            videoElm.stop();
                                            console.log('pausing video.............');
                                        }
                                    } else {
                                        if (videoElm.currentState !== 'play') {
                                            videoElm.play();
                                            console.log('playing video.............');
                                        }
                                    }
                                }

                                if ($(this).find('.ng-scope').hasClass('how-does-solar-widget')) {

                                    var child = $(this).find('.ng-scope');
                                    var steponeduration = child.attr('data-first-duration');
                                    var steptwoduration = child.attr('data-second-duration');
                                    var stepthreeduration = child.attr('data-third-duration');
                                    var stepfourduration = child.attr('data-fourth-duration');

                                    var steponecontent = child.attr('data-first-content');
                                    var steptwocontent = child.attr('data-second-content');
                                    var stepthreecontent = child.attr('data-third-content');
                                    var stepfourcontent = child.attr('data-fourth-content');

                                    var isDrawed = false;

                                    for(var sd=0; sd<SolarDrawed.length; sd++)
                                    {
                                        if(SolarDrawed[sd] === elementId){
                                            isDrawed = true;
                                        }
                                    }

                                    if (!isDrawed) {
                                        console.log(elementId);
                                        $scope.initHDSW();
                                        $scope.sunAnimation();
                                        $scope.solarDurationStep1(steponeduration, steptwoduration, stepthreeduration,
                                                                  stepfourduration, steponecontent, steptwocontent,
                                                                  stepthreecontent, stepfourcontent, elementId);
                                        SolarDrawed.push(elementId);
                                        $scope.solarDrawed = SolarDrawed;
                                    }
                                }

                                if (startPoint === (elementEnd-1)) {
                                    $(this)
                                    .removeClass(transtionOut)
                                    .addClass(transtionOut)
                                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                        function(){
                                            $(this).removeClass(transtionOut);
                                        });
                                    SolarDrawed = [];
                                }
                            } else {
                                $(this).fadeOut(100);
                            }
                        });

                        var newPoint = startPoint + 1;
                        $scope.playPresentation(newPoint, $scope.endTime);
                    }
                }, 1000);
            };

            $scope.initHDSW = function () {
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
                $scope.solarShowStep1 = false;
                $scope.solarShowStep2 = false;
                $scope.solarShowStep3 = false;
                $scope.solarShowStep4 = false;
                $scope.showAllowLarge = false;
                $scope.showEnergy = false;
                $scope.showEnergy1 = false;
                $scope.showInvertor = false;
                $scope.showMeter = false;
                $scope.showInvertor1 = false;
                $scope.showMeter1 = false;
                $scope.showEnergy2 = false;
                $scope.showInvertor2 = false;
                $scope.showMeter2 = false;
                $scope.showElectric = false;
                $scope.showAllowSmall = true;
            };

            var prevScreenWidth = 0;
            var prevScreenHeight = 0;

            $(document).ready(function(e){
                //var presentation_title_width = $('.header_pt').width() ;
                //var fontSize = 4 * (presentation_title_width /1600);
                //$('.header_pt .pn').css('font-size', fontSize+'em');
                $('.presentationFooter').css('width', '100%');

                // Delay
                (function(){
                    var timer = 0;
                    return function(callback, ms){
                        clearTimeout (timer);
                        timer = setTimeout(callback, ms);
                    };
                })();

                var $scope = angular.element(document.getElementsByTagName('body')[0]).scope();

                var setResize = false;

                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var windowRatio = windowHeight / windowWidth;

                $(window).resize(function(e) {
                    angular.forEach($scope.highchartsNG, function (ngConfig, widgetID){
                        var target = angular.element('#chartContainer-' + widgetID),
                            targetParent = target.parent();
                        if (targetParent.is(':visible')) {
                            angular.extend(ngConfig, {
                                size: {
                                    'width': targetParent.width(),
                                    'height': targetParent.height()
                                }
                            });
                        }
                    });

                    $('.main').css('position','relative');
                    $('.pt_sub_logo img').height(parseInt($('.header_pt').height(),10)*0.75);
                    var width = $(this).width();
                    var height = $(this).height();
                    if (!prevScreenWidth) {
                        prevScreenWidth = width;
                    }
                    if (!prevScreenHeight) {
                        prevScreenHeight = height;
                    }

                    console.log('resize start====================>');
                    console.log('prev screen width:', prevScreenWidth);
                    console.log('prev screen height:', prevScreenHeight);
                    console.log('current width:', width);
                    console.log('current height:', height);

                    if(prevScreenWidth !== width) {
                        setResize = false;
                    }

                    $scope.$apply(function() {
                        var presentationTitleWidth = $('.header_pt').width() ;
                        $scope.headerFontSize = parseFloat($scope.tempPresentationDetails.parameters.headerFont.size) *
                                                (presentationTitleWidth /1600);
                        var logoWidth = $('.pt_logo ').width();
                        var informaionWidth = $('.pt_infomation ').width();
                        var getTitleWidth = presentationTitleWidth - informaionWidth - logoWidth - 40;
                        $('.pt_title .pn'). width(getTitleWidth - 40);
                    });

                    //if(setResize){

                    var containerWidth = $('.presentationBody').width();
                    var containerHeight = $('.presentationBody').height();

                    var isMobile = {
                        Android: function() {
                            return navigator.userAgent.match(/Android/i);
                        },
                        BlackBerry: function() {
                            return navigator.userAgent.match(/BlackBerry/i);
                        },
                        iOS: function() {
                            //return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                            return navigator.userAgent.match(/iPhone|iPod/i);
                        },
                        Opera: function() {
                            return navigator.userAgent.match(/Opera Mini/i);
                        },
                        Windows: function() {
                            return navigator.userAgent.match(/IEMobile/i);
                        },
                        any: function() {
                            return (isMobile.Android() || isMobile.BlackBerry() ||
                                    isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                        }
                    };
                    var gridWidth;
                    var gridHeight;

                    if ((isMobile.any() && (window.innerHeight > window.innerWidth))
                        || window.outerWidth < (screen.width/2)) {
                        $('.main').css('position', 'inherit');
                        $('.main').css('width', 'auto');
                        $('.main').css('height', 'auto');
                        $('.pt_description').hide();

                        $('.presentationBody').css('overflow', 'visible');
                        gridWidth = $('.presentationBody').width() / 8;
                        gridHeight = gridWidth;
                        var presentationHeight = gridWidth * 14;
                        $('.header_pt').css('position', 'relative');
                        $('.header_pt').css('height', '60px');
                        $('.presentationContainer').height(presentationHeight);
                        $('.presentationContainer').css('position', 'relative');
                        $('.presentationContainer').css('padding-top', '5px');
                        $('.presentationFooter').css('height', '25px');
                        $('.presentationFooter').css('position', 'relative');
                        $('.presentationContainer').css('top', '0');

                        $scope.$apply(function() {
                            $scope.GridColCnt = 8;
                            $scope.GridRowCnt = 14;
                            $scope.GridWidth = gridWidth;
                            $scope.GridHeight = gridHeight;
                            $scope.isMobile = true;

                            $.each($scope.widgets, function(idx, widget) {
                                if($scope.isMobile){
                                    var widgetGridWidth = parseFloat(widget.parameters.colPosition) +
                                                          parseFloat(widget.parameters.colCount);
                                    if ( parseFloat(widget.parameters.colPosition) <
                                        $scope.GridColCnt && widgetGridWidth > $scope.GridColCnt) {
                                        widget.parameters.colPosition = 0;
                                        widget.parameters.rowPosition = 0;
                                        var originalColCount = widget.parameters.colCount;
                                        var aspect = $scope.GridColCnt / originalColCount;
                                        var filteredRowCount = parseInt(widget.parameters.rowCount) * aspect;

                                        widget.parameters.colCount = $scope.GridColCnt;
                                        widget.parameters.rowCount = filteredRowCount;
                                    } else if ( parseFloat(widget.parameters.colPosition) >= $scope.GridColCnt ) {
                                        console.log('widget in right half part');
                                        console.log(widget);
                                        widget.parameters.colPosition = parseFloat(widget.parameters.colPosition) -
                                                                        $scope.GridColCnt;
                                        widget.parameters.rowPosition = parseFloat(widget.parameters.rowPosition) + 7;
                                    }
                                }
                                widget.parameters.height = $scope.GridHeight * parseInt(widget.parameters.rowCount);
                                widget.parameters.width = $scope.GridWidth * parseInt(widget.parameters.colCount);
                                widget.parameters.heightPercent = $scope.GridHeight *
                                                                  parseInt(widget.parameters.rowCount) /
                                                                  containerHeight * 100;
                                widget.parameters.widthPercent = $scope.GridWidth *
                                                                 parseInt(widget.parameters.colCount) /
                                                                 containerWidth * 100;
                                widget.parameters.heightPadding = ($scope.GridHeight *
                                            parseInt(widget.parameters.rowCount) - 8) /
                                            ($scope.GridHeight * parseInt(widget.parameters.rowCount)) * 100;
                                widget.parameters.widthPadding = ($scope.GridWidth *
                                            parseInt(widget.parameters.colCount) - 8) /
                                            ($scope.GridWidth * parseInt(widget.parameters.colCount)) * 100;
                                widget.parameters.top = (parseInt(widget.parameters.rowPosition) * $scope.GridHeight) /
                                                        containerHeight * 100 ;
                                widget.parameters.left = (parseInt(widget.parameters.colPosition) * $scope.GridWidth) /
                                                        containerWidth * 100 ;

                                if ($scope.GridRowCnt <
                                    parseInt(widget.parameters.rowPosition) + parseInt(widget.parameters.rowCount)) {
                                    widget.parameters.rowPosition = $scope.GridRowCnt -
                                                                    parseInt(widget.parameters.rowCount);
                                    widget.parameters.top = parseInt(widget.parameters.rowPosition) * $scope.GridHeight
                                                            + parseInt(widget.parameters.rowPosition) + 2;
                                }

                                if ($scope.GridColCnt <
                                    parseInt(widget.parameters.colPosition) + parseFloat(widget.parameters.colCount)) {
                                    widget.parameters.colPosition = $scope.GridColCnt -
                                                                    parseInt(widget.parameters.colCount);
                                    widget.parameters.left = widget.parameters.colPosition * $scope.GridWidth +
                                                             widget.parameters.colPosition - 1;
                                }

                            });
                        });

                    } else {
                        $('.pt_description').show();

                        $('.presentationBody').css('overflow', 'hidden');
                        $('.header_pt').css('position', 'absolute');
                        $('.header_pt').css('height', '11%');
                        $('.presentationContainer').height('85%');
                        $('.presentationContainer').css('position', 'absolute');
                        $('.presentationContainer').css('padding', '0.2% 0');
                        $('.presentationFooter').css('height', '3%');
                        $('.presentationFooter').css('position', 'absolute');
                        $('.presentationContainer').css('top', '11%');

                        gridWidth = $('.presentationBody').width() / 16;
                        gridHeight = $('.presentationBody').height() / 7;

                        $scope.$apply(function() {

                            $scope.GridColCnt = 16;
                            $scope.GridRowCnt = 7;
                            $scope.GridWidth = gridWidth;
                            $scope.GridHeight = gridHeight;
                            $scope.isMobile = false;

                            $.each($scope.widgets, function(idx, widget) {

                                widget.parameters.height = $scope.GridHeight * parseInt(widget.parameters.orgRowCount);
                                widget.parameters.width =  $scope.GridWidth * parseInt(widget.parameters.orgColCount);
                                widget.parameters.heightPercent =
                                    ($scope.GridHeight * parseInt(widget.parameters.orgRowCount)) /
                                    containerHeight * 100;
                                widget.parameters.widthPercent =
                                    ($scope.GridWidth * parseInt(widget.parameters.orgColCount)) / containerWidth * 100;
                                widget.parameters.heightPadding =
                                    ($scope.GridHeight * parseInt(widget.parameters.orgRowCount) - 8) /
                                    ($scope.GridHeight * parseInt(widget.parameters.orgRowCount)) * 100;
                                widget.parameters.widthPadding =
                                    ($scope.GridWidth * parseInt(widget.parameters.orgColCount) - 8) /
                                    ($scope.GridWidth * parseInt(widget.parameters.orgColCount)) * 100;
                                widget.parameters.top =
                                    (parseInt(widget.parameters.orgRowPosition) * $scope.GridHeight) /
                                    containerHeight * 100 ;
                                widget.parameters.left =
                                    (parseInt(widget.parameters.orgColPosition) * $scope.GridWidth) /
                                    containerWidth * 100 ;

                                if ($scope.GridRowCnt <
                                    (parseInt(widget.parameters.orgRowPosition) +
                                     parseInt(widget.parameters.orgRowCount))) {
                                    widget.parameters.rowPosition = $scope.GridRowCnt -
                                                                    parseInt(widget.parameters.orgRowCount);
                                    widget.parameters.top = parseInt(widget.parameters.orgRowPosition) *
                                                $scope.GridHeight + parseInt(widget.parameters.orgRowPosition) + 2;
                                }

                                if ($scope.GridColCnt <  (parseInt(widget.parameters.orgColPosition) +
                                     parseFloat(widget.parameters.orgColCount))) {
                                    widget.parameters.colPosition = $scope.GridColCnt -
                                                                    parseInt(widget.parameters.orgColCount);
                                    widget.parameters.left = widget.parameters.orgColPosition *
                                                        $scope.GridWidth + widget.parameters.orgColPosition - 1;
                                }

                            });
                        });
                    }

                    console.log('x axis resize');
                    var ratio = width / screen.width,
                        ratioWidth = width,
                        ratioHeight = Math.round(width * windowRatio);

                    /*if(width == prevScreenWidth && height != prevScreenHeight){
                     console.log('y axis resize');
                     ratio = height/prevScreenHeight;
                     ratio_width = Math.round(height/windowRatio);
                     ratio_height = height;
                     }*/

                    console.log('ratio : ' + ratio);

                    /*$(window).css({
                     'width': ratio_width,
                     'height': ratio_height
                     });*/

                    console.log('ratio width : ' + ratioWidth);
                    console.log('ratio height : ' + ratioHeight);

                    prevScreenWidth = width;
                    prevScreenHeight = height;

                    setResize = true;

                    //window.resizeTo(ratio_width, ratio_height);

                    $('.main').css({
                        'width': ratioWidth,
                        'height': ratioHeight
                    });
                });
            });
        }
    ]);