'use strict';

angular.module('blApp.management.directives')
    .directive('widgets', ['$http', '$timeout', '$rootScope', 'PRESENT_CONFIG', 'notifyService',
        function ($http, $timeout, $rootScope, PCONFIG, notifyService) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, content) {
                    var totalCols = 16;
                    var totalRows = 7;
                    var linkId;
                    var allowDrop;

                    var currentLeft;
                    var currentTop;

                    var row;
                    var col;

                    var offsetY;
                    var offsetX;

                    var $div;
                    var $placeholder;
                    var $dim;

                    var stepX = PCONFIG.GridWidth;
                    var stepY = PCONFIG.GridHeight;

                    var widgetParam;

                    $div = $('#ga_design_stage');
                    if ($('.placeholder').length < 1) {
                        $div.append('<div class=\'placeholder\'></div>');
                    }
                    $placeholder = $('.placeholder');

                    if (!$('.dim').length) {
                        $('body').append('<div class=\'dim\'></div>');
                    }

                    $dim = $('.dim');
                    $dim.addClass('dim-hidden');

                    element
                        .drag('start', function (ev, dd) {
                            if ($rootScope.presentationDetails.bpLock) {
                                var message = 'Presentation is locked. Therefore you don\'t have permission to update.';
                                notifyService.errorNotify(message);
                                ev.preventDefault();
                                return false;
                            }
                            $('.manager_panel').css('z-index', '0');
                            if ($('.handleCompanyPanel').hasClass('handleCompanyPanel-selected')) {
                                $('.closeSlide').trigger('click');
                            }
                            if ($('.manager_panel').hasClass('shadow')) {
                                $('#toggle-user-panel').trigger('click');
                            }
                            $dim.removeClass('dim-hidden');
                            $('.timeline-wrapper').addClass('timeline-wrapper-fix');
                            $dim.addClass('dim-show');

                            $('.widgetsSelector ul li').not($(this).parent()).css('opacity', '0.5');

                            $('#storyjs-timeline').css('z-index', 0);
                            $('.slide-company-panel').css('z-index', 0);

                            dd.limit = $div.offset();
                            dd.limit.bottom = $div.outerHeight() - $(this).outerHeight();
                            dd.limit.right = $div.outerWidth() - $(this).outerWidth();

                            $('.presentation-gap').addClass('active');
                            $('.presentation').addClass('active');
                            $('.bv-overlay').addClass('active');
                            $(this).addClass('i-active');
                            $(this).parent().addClass('p-active');
                        })
                        .drag(function (ev, dd) {
                            $(this).css('position', 'absolute');
                            $(this).css({
                                top: ev.pageY - 100,
                                left: ev.pageX - 250
                            });

                            // console.log('ev.pageX:' + ev.pageX + ', ev.pageY:' + ev.pageY);
                            // console.log('this.left:' + $(this).css('left') + ', this.top:' + $(this).css('top'));
                            // console.log('dd.offsetX:'+ dd.offsetX + ', dd.offsetY:'+ dd.offsetY);

                            linkId = $(this).find('.component-linkid').val();

                            widgetParam = $.grep($rootScope.dynamicWidgets, function (e) {
                                return e._id.toString() === linkId.toString();
                            })[0]; // get the widget params

                            $placeholder.css('background-color', '#' + widgetParam.parameters.widgetRandomColor);

                            var widthCorrection = widgetParam.parameters.colCount / 5 - 1;

                            if (widthCorrection > 1.4) {
                                widthCorrection = 1.4;
                            }

                            var heightCorrection = widgetParam.parameters.rowCount / 2 - 1;

                            if (heightCorrection > 1.4) {
                                heightCorrection = 1.4;
                            }

                            currentLeft = parseInt($(this).css('left')) - $div.offset().left + 92 -
                            (widthCorrection * widgetParam.parameters.colCount * PCONFIG.GridWidth / 4);
                            currentTop = parseInt($(this).css('top')) - $div.offset().top + 60 -
                            (heightCorrection * widgetParam.parameters.rowCount * PCONFIG.GridHeight / 4.2);

                            //currentLeft = parseInt($(this).css('left')) - $div.offset().left + 55;
                            // /* because padding is 5px */
                            //console.log(parseInt($(this).css('left')), $div.offset().left, currentLeft); // left

                            //currentTop = parseInt($(this).css('top')) - $div.offset().top;
                            //console.log(parseInt($(this).css('top')), $div.offset().top, currentTop); // top


                            row = parseInt((currentTop) / PCONFIG.GridHeight);
                            col = parseInt((currentLeft) / PCONFIG.GridWidth);
                            /*
                             console.log(
                             'top: ' + currentTop,
                             'left: ' + currentLeft,
                             'heightCorrection: ' + heightCorrection,
                             'widgetHeight: ' + (widgetParam.parameters.rowCount),
                             'widthCorrection: ' + widthCorrection,
                             'widgetWidth: ' + (widgetParam.parameters.colCount),
                             'row: ' + row,
                             'col: ' + col
                             );
                             */
                            currentTop = row * PCONFIG.GridHeight + row + 2;
                            currentLeft = col * PCONFIG.GridWidth + col - 1;

                            scope.currentComponentTop = currentTop;
                            scope.currentComponentLeft = currentLeft;

                            scope.currentPositionRow = row;
                            scope.currentPositionCol = col;

                            offsetY = dd.offsetY - dd.limit.top;
                            offsetX = dd.offsetX - dd.limit.left;

                            //console.log('row: ' + row, 'col: ' + col);

                            $placeholder
                                .height(stepY * widgetParam.parameters.rowCount)
                                .width(stepX * widgetParam.parameters.colCount);

                            /* hide placeholder if mouse get out from canvas */
                            if (row < ( 0 - widgetParam.parameters.rowCount / 2 ) ||
                                col < ( 0 - widgetParam.parameters.colCount / 2 ) ||
                                row > (totalRows - 0.5 * widgetParam.parameters.rowCount) ||
                                col > (totalCols - 0.5 * widgetParam.parameters.colCount)) {

                                $placeholder.hide();
                                allowDrop = false;
                            } else {
                                $placeholder.show();
                                allowDrop = true;
                            }
                            /* end */

                            /* stop moving placeholder if border of placeholder get out from canvas */
                            if (row < 0) {
                                row = 0;
                            } else if (row > (totalRows - widgetParam.parameters.rowCount)) {
                                row = totalRows - widgetParam.parameters.rowCount;
                            } else {
                                $placeholder.css('top', currentTop);
                            }

                            if (col < 0) {
                                col = 0;
                            } else if (col > (totalCols - widgetParam.parameters.colCount)) {
                                col = totalCols - widgetParam.parameters.colCount;
                            } else {
                                $placeholder.css('left', currentLeft);
                            }

                            /* end */

                            /* old logic
                             if( row >= 0 && row <= (totalRows - widgetParam.parameters.rowCount) ) {
                             $placeholder.css('top', currentTop);
                             }
                             if( col >= 0 && col <= (totalCols - widgetParam.parameters.colCount) ) {
                             $placeholder.css('left', currentLeft);
                             }
                             */
                        })
                        .drag('end', function (ev, dd) {
                            $placeholder.hide();
                            //console.log('drag-end');

                            // console.log('dd.limit.top'+ dd.limit.top);
                            // console.log('dd.limit.bottom'+ dd.limit.bottom);
                            // console.log('dd.limit.left'+ dd.limit.left);
                            // console.log('dd.limit.right'+ dd.limit.right);

                            // console.log('ev.pageX:' + ev.pageX + ', ev.pageY:' + ev.pageY);
                            // console.log('this.left:' + $(this).css('left') + ', this.top:' + $(this).css('top'));
                            // console.log('dd.offsetX:'+ dd.offsetX + ', dd.offsetY:'+ dd.offsetY);

                            // console.log('offsetX'+ offsetX);
                            // console.log('offsetY'+offsetY);

                            // console.log('canvas.top' + $div.offset().top);
                            // console.log('canvas.left' + $div.offset().left);

                            if (!allowDrop ||
                                row < 0 ||
                                col < 0 ||
                                row > (totalRows - widgetParam.parameters.rowCount) ||
                                col > (totalCols - widgetParam.parameters.colCount)) {
                                /*
                                 if the position is out of area when drag & drop components' links,
                                 don't insert the component in form ad then keep original status
                                 */
                                $(this).css('position', 'relative');

                                $(this).css({
                                    top: 0,
                                    left: 0
                                });

                                //removed for (BUG-55)
                                /*$(this).animate({
                                 top: 0,
                                 left: 0
                                 }, 50);
                                 */
                                $('.presentation-gap').removeClass('active');
                                $('.presentation').removeClass('active');
                                $('.bv-overlay').removeClass('active');
                                $(this).removeClass('i-active');
                                $(this).parent().removeClass('p-active');

                                $dim.removeClass('dim-show');
                                $('.timeline-wrapper').removeClass('timeline-wrapper-fix');
                                setTimeout(function () {
                                    $('.slide-company-panel').css('z-index', '1000');
                                    $('.widgetsSelector ul li').css('opacity', '1');
                                    $dim.addClass('dim-hidden');
                                    $('.manager_panel').css('z-index', '1');
                                }, 250);
                                $('#storyjs-timeline').css('z-index', 'auto');

                                $('.presentationBody').css('z-index', 'auto');
                                $('.ng-widget-highlight a').css('z-index', 'auto');
                                $('.widgetsSelector ul li').css('opacity', '1');

                                return;
                            }

                            $dim.removeClass('dim-show');
                            $('.timeline-wrapper').removeClass('timeline-wrapper-fix');
                            setTimeout(function () {
                                $('.slide-company-panel').css('z-index', '1000');
                                $('.widgetsSelector ul li').css('opacity', '1');
                                $dim.addClass('dim-hidden');
                                $('.manager_panel').css('z-index', '1');
                            }, 250);

                            $(this).css('position', 'relative');
                            $(this).css({
                                top: 0,
                                left: 0
                            });

                            $('.presentation-gap').removeClass('active');
                            $('.presentation').removeClass('active');
                            $('.bv-overlay').removeClass('active');
                            $(this).removeClass('i-active');
                            $(this).parent().removeClass('p-active');


                            scope.saveAvailableWidget(linkId, row, col);
                        });
                    // end drag/drop function
                }
            };
        }
    ]);