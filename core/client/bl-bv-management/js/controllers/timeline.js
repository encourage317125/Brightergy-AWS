'use strict';

angular.module('blApp.management.controllers')
    .controller('TimelineController', ['$scope', '$rootScope', '$compile',
        function ($scope, $rootScope, $compile) {
            //widgetService.getTimelineInfo($rootScope.presentationId, 'init', $compile,  $rootScope, true, null);
            
            var timelineConfig = {
                'width': 1124,
                'height': 220,
                'debug': true,
                'start_zoom_adjust':  '5',
                'start_at_slide': '1',
                'source': {
                    'timeline': {
                        headline: 'default',
                        startDate: '2014,9,12,21,0,0',
                        text: 'default',
                        type: 'default',
                        date: []
                    }
                }
            };
            createStoryJS(timelineConfig, $compile, $rootScope);

            $rootScope.getISO8601Str = function (date) {
                var newDate = $scope.dateFormatConvert2(date);
                var d=new Date(newDate);
                var userOffset = d.getTimezoneOffset()*60*1000;
                return new Date(d.getTime() - userOffset).toISOString();
            };

            $rootScope.dateFormatConvert2 = function(date) {
                var day, month, year, hour, minutes, seconds, dateString;
                if (date) {
                    day = date.substring(8, 10);
                    month = date.substring(5, 7);
                    year = date.substring(0, 4);
                    hour = date.substring(11, 13);
                    minutes = date.substring(14, 16);
                    dateString = month + '/' + day + '/' + year + ' ' + hour + ':' + minutes + ':' + '00';

                    return dateString;
                } else {
                    var newDate = new Date();
                    day = newDate.getDate();
                    month = newDate.getMonth() + 1;
                    year = newDate.getFullYear();
                    hour = newDate.getHours();
                    minutes = newDate.getMinutes();
                    seconds = newDate.getSeconds();
                    if (month < 10) {
                        month = '0' + month;
                    }
                    if (day < 10) {
                        day = '0' + day;
                    }
                    dateString = month + '/' + day + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds;

                    return dateString;
                }
            };
        }
    ]);