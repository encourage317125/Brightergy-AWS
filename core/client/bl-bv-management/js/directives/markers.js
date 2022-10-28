'use strict';

angular.module('blApp.management.directives').directive(
    'markers',
    ['$http', '$timeout', '$rootScope', '$compile', 'PRESENT_CONFIG', 'toggleService', 'widgetService',
        'notifyService',
        function ($http, $timeout, $rootScope, $compile, PCONFIG, toggleService, widgetService,
                  notifyService) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs) {
                    var $div = $('.vco-navigation');
                    element.draggable({
                        axis: 'x, y',
                        start: function (ev, dd) {
                            if ($rootScope.presentationDetails.bpLock) {
                                var message = 'Presentation is locked. Therefore you don\'t have permission to update.';
                                notifyService.errorNotify(message);
                                ev.preventDefault();
                                return false;
                            }
                            dd.limit = $div.offset();
                            dd.limit.bottom = $div.outerHeight() - $(this).outerHeight();
                            dd.limit.right = $div.outerWidth() - $(this).outerWidth();
                            scope['markerAction'] = true;
                            //dd.helper.bind('click.prevent',
                            //  function(event) { event.preventDefault(); });
                            ev.stopPropagation();
                            element.parents('.timenav').attr('is_act', 'acting');

                            //if isCanvasPlaying is true, play canvas -- Yuri
                            $rootScope['isCanvasPlaying'] = false;
                            $('.timenav').stop();
                        },
                        drag: function (ev, dd) {
                            element.parents('.timenav').attr('is_act', 'acting');

                            /*$(this).css({
                             left: ev.pageX-dd.startX
                             });*/

                            var duration = parseInt(element.attr('duration'), 10);

                            var markerStartPointMin = parseInt(element.attr('startpoint_min'), 10);
                            var markerStartPointSec = parseInt(element.attr('startpoint_sec'), 10);
                            var markerSecs = 60 * markerStartPointMin + markerStartPointSec;

                            var markerWidth = element.outerWidth();
                            var secPercent = markerWidth / duration;

                            var movedWidth = dd.position.left - dd.originalPosition.left;

                            var movedSec = movedWidth / secPercent;
                            var destSec = markerSecs + movedSec;
                            var destMin = 0;

                            if (destSec >= 60) {
                                destMin = Math.floor(destSec / 60);
                                destSec = Math.round(destSec - destMin * 60);
                            } else {
                                destSec = Math.floor(destSec);
                            }

                            if (destSec < 0) {
                                destSec = 0;
                                destMin = 0;
                            }

                            if (destSec > 0 && destSec % 60 === 0) {
                                destMin = destMin + 1;
                                destSec = 0;
                            }

                            if (destSec < 10) {
                                destSec = '0' + destSec;
                            }

                            if (destMin < 10) {
                                destMin = '0' + destMin;
                            }

                            var movedTime = destMin + ':' + destSec;
                            element.find('.marker-timepoint').text(movedTime);
                        },
                        stop: function (ev, dd) {
                            if (($rootScope.presentationDetails.creator !== $rootScope.currentUser._id) &&
                                $rootScope.presentationDetails.bpLock) {
                                var message = 'Presentation is locked. Therefore you don\'t have permission to update.';
                                notifyService.errorNotify(message);
                                return ;
                            }
                            element.parents('.timenav').attr('is_act', 'noact');
                            var widgetId = element.attr('widgetid');
                            var widgetParam = $.grep(scope.$root.widgets, function (e) {
                                return e._id.toString() === widgetId.toString();
                            })[0];
                            var duration = parseInt(element.attr('duration'), 10);

                            var markerStartpointMin = parseInt(element.attr('startpoint_min'), 10);
                            var markerStartpointSec = parseInt(element.attr('startpoint_sec'), 10);
                            var markerSecs = 60 * markerStartpointMin + markerStartpointSec;

                            var markerWidth = element.outerWidth();
                            var secPercent = markerWidth / duration;

                            var movedWidth = dd.position.left - dd.originalPosition.left;

                            var movedSec = movedWidth / secPercent;
                            var destSec = markerSecs + movedSec;
                            var destMin = 0;

                            if (destSec >= 60) {
                                destMin = Math.floor(destSec / 60);
                                destSec = Math.round(destSec - destMin * 60);
                            } else {
                                destSec = Math.floor(destSec);
                            }

                            if (destSec < 0) {
                                destSec = 0;
                                destMin = 0;
                            }

                            if (destSec > 0 && destSec % 60 === 0) {
                                destMin = destMin + 1;
                                destSec = 0;
                            }

                            var movedTime = destMin + ':' + destSec;

                            widgetParam.parameters.startDate = movedTime;

                            //Yakov
                            var movedHeight = dd.position.top - dd.originalPosition.top;
                            var absMovedHeight = Math.abs(movedHeight);
                            var movedRowCount = Math.floor(absMovedHeight / 30) +
                                Math.floor((absMovedHeight % 30) / 15);
                            var movedRowPos;
                            if (movedHeight > 0) {
                                movedRowPos = widgetParam.parameters.timelineRowPosition + movedRowCount;
                            } else {
                                movedRowPos = widgetParam.parameters.timelineRowPosition - movedRowCount;
                                if (movedRowPos < 0) {
                                    movedRowPos = 0;
                                }
                            }
                            angular.extend(widgetParam.parameters, {
                                previousTimelineRowPosition: widgetParam.parameters.timelineRowPosition,
                                timelineRowPosition: movedRowPos,
                                resizedOnTimeline: false
                            });

                            toggleService.togglePleaseWait();
                            scope['widgetParam'] = widgetParam;
                            widgetService.saveWidget($rootScope.presentationId, widgetParam,
                                true, scope, $compile, 'save', false);
                        }
                    });
                    // end drag/drop function
                    element.on('click mouseenter mouseleave', function(e) {
                        var widgetId = element.attr('widgetid');
                        var widgetIndex, widgetParam;
                        $.each(scope.$root.widgets, function (idx, obj) {
                            if (obj._id.toString() === widgetId.toString()) {
                                widgetIndex = idx;
                                widgetParam = obj;
                                return;
                            }
                        });
                        $('#field_' + widgetIndex).trigger(e.type);
                    });

                    /*
                     element.hover(
                     function () {
                     var widget_id = element.attr('widgetid');
                     var widget_index, widgetParam;
                     $.each(scope.$root.widgets, function(idx, obj) {
                     if (obj._id == widget_id) {
                     widget_index = idx;
                     widgetParam = obj;
                     return;
                     }
                     });
                     $('#field_' + widget_index).css('border',
                     '2px solid #' + widgetParam.parameters.widgetBorderColor);
                     $(this).css('border', '1px solid #' + widgetParam.parameters.widgetBorderColor);
                     },
                     function () {
                     var widget_id = element.attr('widgetid');
                     var widget_index, widgetParam;
                     $.each(scope.$root.widgets, function(idx, obj) {
                     if (obj._id == widget_id) {
                     widget_index = idx;
                     widgetParam = obj;
                     return;
                     }
                     });
                     console.log('Widget Selected: ' +  scope.$root.selectedWidget);
                     if (scope.$root.selectedWidget != widget_index)
                     {
                     $('#field_' + widget_index).css('border',
                     '2px solid #' + widgetParam.parameters.widgetRandomColor);
                     $(this).css('border', 0);
                     }
                     }
                     );*/
                    //end hover function

                    element.resizable({
                        handles: 'e',
                        create: function (ev, dd) {
                            if (!$rootScope.Bvmodifyable) {
                                element.resizable('disable');
                            }
                        },
                        start: function (ev, dd) {
                            scope['markerAction'] = true;
                            element.parents('.timenav').attr('is_act', 'acting');
                        },
                        resize: function (ev, dd) {
                            var orgWidth = dd.originalSize.width;
                            var orgDuration = parseInt(element.attr('duration'));
                            var secPerWidth = orgDuration / orgWidth;

                            var currentWidth = dd.size.width;
                            var currentDuration = secPerWidth * currentWidth;
                            element.find('.marker-duration').text(Math.floor(currentDuration) + 's');
                        },
                        stop: function (ev, dd) {
                            element.parents('.timenav').attr('is_act', 'noact');

                            var widgetId = element.attr('widgetid');
                            var widgetParam = $.grep(scope.$root.widgets, function (e) {
                                return e._id.toString() === widgetId.toString();
                            })[0];

                            var orgWidth = dd.originalSize.width;
                            var orgDuration = widgetParam.parameters.duration;
                            var secPerWidth = orgDuration / orgWidth;

                            var currentWidth = dd.size.width;
                            var currentDuration = secPerWidth * currentWidth;

                            if (widgetParam.name === 'How Does Solar Work') {
                                var totalDuration;
                                totalDuration = parseInt(widgetParam.parameters.widgetHowDoesSolarWorkStepOneDuration) +
                                parseInt(widgetParam.parameters.widgetHowDoesSolarWorkStepTwoDuration) +
                                parseInt(widgetParam.parameters.widgetHowDoesSolarWorkStepThreeDuration) +
                                parseInt(widgetParam.parameters.widgetHowDoesSolarWorkStepFourDuration) +
                                3;
                                if (currentDuration < totalDuration) {
                                    notifyService.errorNotify(
                                        ['How Does Solar Work must be visible at least as long as the',
                                            '<b>SUM</b> of the Steps.'].join(''));

                                    element.width(dd.originalSize.width);
                                    return false;
                                }
                            }

                            //Yakov
                            widgetParam.parameters.previousTimelineRowPosition = -1;
                            widgetParam.parameters.resizedOnTimeline = true;
                            widgetParam.parameters.duration = Math.floor(currentDuration);
                            element.find('.marker-duration').text(Math.floor(currentDuration) + 's');

                            toggleService.togglePleaseWait();
                            scope['widgetParam'] = widgetParam;
                            widgetService.saveWidget($rootScope.presentationId, widgetParam,
                                true, scope, $compile, 'save', false);
                            /*
                             $timeout(function(){
                             toggleService.togglePleaseWait();
                             } ,1500);
                             */
                        }
                    });
                }
            };
        }
    ]);