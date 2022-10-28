angular.module('bl.analyze.solar.surface')
    .constant('elementWeatherHistoryConfig', {
        weatherCountPerRequest: 10,
        weatherStatus: ['cloudy', 'rain', 'snow', 'snow-clear', 'storm', 'sun-cloud', 'sun-rain', 'sunny']
    })

    .controller('elementWeatherHistoryController',
    ['$scope', 'moment', 'weatherService', 'elementWeatherHistoryConfig',
        function ($scope, moment, weatherService, config) {

      $scope.weatherHistory = [];
      $scope.requestDateRange = {
        start: moment().subtract(config.weatherCountPerRequest + 5, 'days').valueOf(),
        end: moment().subtract(1, 'days').valueOf()
      };

            $scope.loadMoreHistories = function () {
                if ($scope.isLoadingAdditionalHistory) {
                    return false;
                }

                $scope.isLoadingAdditionalHistory = true;
                var lastHistory = $scope.weatherHistory[$scope.weatherHistory.length - 1],
                    additionalHistoryEnd = moment(lastHistory.date).subtract(1, 'days').valueOf(),
                    additionalHistoryStart = moment(additionalHistoryEnd)
                        .subtract(config.weatherCountPerRequest, 'days').valueOf();

                $scope.emitRequestForWeatherHistory(additionalHistoryStart, additionalHistoryEnd);
            };

            $scope.$watchGroup(['requestDateRange.start', 'requestDateRange.end'], function(newValues, oldValues) {
                if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
                    $scope.weatherHistory = [];
                    $scope.emitRequestForWeatherHistory(newValues[0], newValues[1]);
                }
            });

            $scope.emitRequestForWeatherHistory = function (startDate, endDate) {
                weatherService.emitToWeatherHistory(startDate, endDate);
            };

            $scope.startWatchWeatherHistoryResponse = function () {
                weatherService.watchWeatherHistory(function (history) {
                    $scope.isDataLoaded = true;
                    if ($scope.isLoadingAdditionalHistory) {
                        $scope.weatherHistory = $scope.weatherHistory.concat(history.reverse());
                        $scope.isLoadingAdditionalHistory = false;
                    } else {
                        $scope.weatherHistory = history.reverse();
                    }
                });
            };
        }
    ])

    .directive('elementWeatherHistory', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'app/elements/weather-history/template.html',
            transclude: true,
            controller: 'elementWeatherHistoryController',
            replace: true,
            link : function (scope, element, attrs) {
                scope.emitRequestForWeatherHistory(scope.requestDateRange.start, scope.requestDateRange.end);
                scope.startWatchWeatherHistoryResponse();
                $timeout(function () {
                    var $scrollContainer = $(element).find('.weather-history-control'),
                        elementTop = $('.sp-content').height() + $('.sp-top').height() + 150;

                    var elementContainerHeight = $(window).height() - elementTop;
                    // 10 -> give some padding bottom;

                    $scrollContainer.mCustomScrollbar({
                        axis: 'y',
                        theme: 'light',
                        setHeight: elementContainerHeight,
                        callbacks: {
                            onTotalScroll:function() {
                                console.log('Ivan wants to get more weather history');
                                scope.loadMoreHistories();
                            },
                            onTotalScrollOffset:50,
                            alwaysTriggerOffsets:false
                        }
                    });
                });
            }
        };
    }]);
