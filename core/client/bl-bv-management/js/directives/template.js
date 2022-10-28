'use strict';

angular.module('blApp.management.directives')
    .directive('template', ['$http', '$templateCache', '$compile', '$timeout', 'PRESENT_CONFIG',
        '$rootScope', 'notifyService',
        function ($http, $templateCache, $compile, $timeout, PCONFIG, $rootScope, notifyService) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs, content) {
                    var $div = $('#ga_design_stage');

                    element.draggable({
                        start: function (ev, dd) {
                            if ($rootScope.presentationDetails.bpLock) {
                                var message = 'Presentation is locked. Therefore you don\'t have permission to update.';
                                notifyService.errorNotify(message);
                                return false;
                            }
                            console.log('template drag start');
                            dd.limit = $div.offset();
                            dd.limit.bottom = /*dd.limit.top + */$div.outerHeight() - $(this).outerHeight();
                            dd.limit.right = /*dd.limit.left + */$div.outerWidth() - $(this).outerWidth();
                        },
                        drag: function (ev, dd) {
                            console.log('template drag');
                            dd.limit = $div.offset();
                            dd.limit.bottom = /*dd.limit.top + */$div.outerHeight() - $(this).outerHeight();
                            dd.limit.right = /*dd.limit.left + */$div.outerWidth() - $(this).outerWidth();
                            var offsetY = dd.offsetY - dd.limit.top;
                            var offsetX = dd.offsetX - dd.limit.left;
                            var step = 1;

                            $(this).css({
                                'top': Math.min(dd.limit.bottom,
                                    Math.max(/*dd.limit.top*/0, Math.round(offsetY / step) * step)),
                                'left': Math.min(dd.limit.right,
                                    Math.max(/*dd.limit.left*/0, Math.round(offsetX / step) * step))
                            });
                        },
                        stop: function (ev, dd) {
                            console.log('template drag end');
                            dd.limit = $div.offset();
                            dd.limit.bottom = /*dd.limit.top + */$div.outerHeight() - $(this).outerHeight();
                            dd.limit.right = /*dd.limit.left + */$div.outerWidth() - $(this).outerWidth();
                            //var gid = $(this).find('.component-gid').val();
                            var gid = $(this).attr('id').split('_')[1];

                            // check overlay between compoenents

                            /* save with last position when end drag */
                            var currentLeft = $(this).position().left;
                            var currentTop = $(this).position().top;
                            currentLeft -= parseInt(currentLeft / PCONFIG.GridWidth);
                            currentTop -= parseInt(currentTop / PCONFIG.GridHeight);

                            //WAJ May30-2014
                            //Changed paraseInt() to Math.round() in order to snap to nearest vertex.
                            var row = Math.round(currentTop / PCONFIG.GridHeight);
                            //parseInt(currentTop/PCONFIG.GridHeight);
                            var col = Math.round(currentLeft / PCONFIG.GridWidth);
                            //parseInt(currentLeft/PCONFIG.GridWidth);

                            var width = $(this).width();
                            width -= parseInt(width / PCONFIG.GridWidth);
                            var height = $(this).height();
                            height -= parseInt(height / PCONFIG.GridHeight);

                            var rowCoount = Math.round(height / PCONFIG.GridHeight);
                            //parseInt(height/PCONFIG.GridHeight);
                            var colCount = Math.round(width / PCONFIG.GridWidth);
                            //parseInt(width/PCONFIG.GridWidth);

                            //WAJ May29-2014
                            //Fix for (BUG-48)
                            //Check if Widget origin is outside canvas
                            /*
                             if (row < 0 || row > 6 || col < 0 || col > 15)
                             {
                             row = scope.widgets[gid].parameters.rowPosition;
                             col = scope.widgets[gid].parameters.colPosition;
                             }
                             */

                            //Check if Widget extends outside canvas
                            while (row < 0) {
                                row++;
                            }
                            while (col < 0) {
                                col++;
                            }
                            while (row + rowCoount > 7) {
                                row -= 1;
                            }
                            while (col + colCount > 16) {
                                col -= 1;
                            }
                            ///////////////////////


                            currentTop = row * PCONFIG.GridHeight + row + 2;
                            currentLeft = col * PCONFIG.GridWidth + col - 1;

                            scope['currentComponentTop'] = currentTop;
                            scope['currentComponentLeft'] = currentLeft;


                            scope['currentPositionRow'] = row;
                            scope['currentPositionCol'] = col;


                            //WJ: May29-2014
                            //attempted fix for PV BUG-47
                            $(this).css({
                                top: currentTop,
                                left: currentLeft
                            });
                            ////////////////////////////

                            scope.widgets[gid].parameters.top = currentTop;
                            scope.widgets[gid].parameters.left = currentLeft;
                            scope.widgets[gid].parameters.rowPosition = row;
                            scope.widgets[gid].parameters.colPosition = col;
                            scope.widgets[gid].parameters.rowCount = rowCoount;
                            scope.widgets[gid].parameters.colCount = colCount;

                            $timeout(function () {
                                angular.extend(scope.widgets[gid].parameters, {
                                    height: PCONFIG.GridHeight * parseInt(rowCoount) + parseInt(rowCoount) - 1,
                                    width: PCONFIG.GridWidth * parseInt(colCount) + parseInt(colCount) - 1
                                });
                                scope.$apply();
                            }, 10);

                            var apiUrl = '/present/presentations/widgets/' + scope.widgets[gid]._id;
                            var inputJson = scope.widgets[gid];
                            $http
                                .put(apiUrl, inputJson);
                        }
                    });

                    element.resizable({
                        start: function (ev, dd) {
                            console.log('resize start');
                        },
                        stop: function (ev, dd) {
                            console.log('when resize');
                            dd.limit = $div.offset();
                            dd.limit.bottom = /*dd.limit.top + */$div.outerHeight() - $(this).outerHeight();
                            dd.limit.right = /*dd.limit.left + */$div.outerWidth() - $(this).outerWidth();
                            var gid = $(this).attr('id').split('_')[1];

                            // check overlay between compoenents

                            /* save with last position when end drag */
                            console.log($(this));
                            var currentLeft = $(this).position().left;
                            var currentTop = $(this).position().top;
                            console.log('Old');
                            console.log(currentTop);
                            console.log(currentLeft);


                            //WAJ May30-2014
                            //Changed paraseInt() to Math.round() in order to snap to nearest vertex.
                            var row = Math.round(currentTop / PCONFIG.GridHeight);
                            var col = Math.round(currentLeft / PCONFIG.GridWidth);

                            currentTop = row * PCONFIG.GridHeight + row + 2;
                            currentLeft = col * PCONFIG.GridWidth + col - 1;

                            scope['currentComponentTop'] = currentTop;
                            scope['currentComponentLeft'] = currentLeft;

                            scope['currentPositionRow'] = row;
                            scope['currentPositionCol'] = col;

                            var width = $(this).width();
                            width -= parseInt(width / PCONFIG.GridWidth);
                            var height = $(this).height();
                            height -= parseInt(height / PCONFIG.GridHeight);

                            //WAJ May30-2014
                            //Changed paraseInt() to Math.round() in order to snap to nearest vertex.
                            var rowCoount = Math.round(height / PCONFIG.GridHeight);
                            var colCount = Math.round(width / PCONFIG.GridWidth);

                            //Check if Widget extends outside canvas
                            while (row + rowCoount > 7) {
                                rowCoount -= 1;
                            }
                            while (col + colCount > 16) {
                                colCount -= 1;
                            }
                            ///////////////////////

                            //WJ: May29-2014
                            //attempted fix for PV BUG-47
                            var newWidth = colCount * PCONFIG.GridWidth + (colCount - 1);
                            var newHeight = rowCoount * PCONFIG.GridHeight + (rowCoount - 1);
                            $(this).width(newWidth);
                            $(this).height(newHeight);
                            ////////////////////////////

                            scope.widgets[gid].parameters.top = currentTop;
                            scope.widgets[gid].parameters.left = currentLeft;
                            scope.widgets[gid].parameters.rowPosition = row;
                            scope.widgets[gid].parameters.colPosition = col;
                            scope.widgets[gid].parameters.rowCount = rowCoount;
                            scope.widgets[gid].parameters.colCount = colCount;

                            $timeout(function () {
                                angular.extend(scope.widgets[gid].parameters, {
                                    height: PCONFIG.GridHeight * parseInt(rowCoount) + parseInt(rowCoount) - 1,
                                    width: PCONFIG.GridWidth * parseInt(colCount) + parseInt(colCount) - 1
                                });
                                scope.$apply();
                            }, 10);
                            console.log('New');
                            console.log(currentTop);
                            console.log(currentLeft);
                            var apiUrl = '/present/presentations/widgets/' + scope.widgets[gid]._id;
                            var inputJson = scope.widgets[gid];
                            $http.post(apiUrl, inputJson);
                            scope.widgets[gid] = scope.compileWidget(scope.widgets[gid], true);
                        }
                    });

                    $('html').click(function (e) {

                        if ($(e.target).closest('.marker').length === 0) {
                            var widgets = scope.widgets;

                            for (var key in widgets) {
                                if (widgets.hasOwnProperty(key) && key !== '_responseHeader_') {
                                    var widget = widgets[key];
                                    if (typeof widget === 'object') {
                                        var classSelector = 'component_' + widget._id;
                                        var element = $('.' + classSelector);
                                        var visibilityBtnArea = element.find('.visibility-btns-area');
                                        var btnArea = element.find('.btns-area');
                                        visibilityBtnArea.hide();
                                        btnArea.hide();

                                        element.css('border', '2px solid #' + widget.parameters.widgetRandomColor);
                                        $('#marker-' + widget._id).css('border', 0);
                                    }
                                }
                            }

                            if ($(e.target).closest('#timeline-widgetInfo').length === 0) {
                                $('#timeline-widgetInfo').html('');
                            }

                            var closestWidget = $(e.target).closest('.widget');
                            scope.selectedWidget = closestWidget.attr('id');

                            if (closestWidget.length) {

                                var gid = closestWidget.attr('id').split('_')[1];

                                closestWidget.find('.visibility-btns-area').show();
                                closestWidget.find('.btns-area').show();

                                closestWidget
                                    .css('border', '2px solid #' + scope.widgets[gid].parameters.widgetBorderColor);

                                $('#marker-' + scope.widgets[gid]._id)
                                    .css('border', '1px solid #' + scope.widgets[gid].parameters.widgetBorderColor);

                                var infoLine = $('#timeline-widgetInfo');

                                var startDateArray = scope.widgets[gid].parameters.startDate.split(':');

                                var widgetType = scope.widgets[gid].name.toLowerCase().replace(/\s+/g, '');
                                var img = $('<icon class=\'icon-mini\'>');
                                img.addClass('widget-' + widgetType);

                                img.appendTo(infoLine);
                                var startPoint = $('<span class=\'timelineinfo-label\'> Start: ' +
                                '<span class=\'timelineinfo-number\'>' +
                                (parseInt(startDateArray[0]) * 60 + parseInt(startDateArray[1])) +
                                's</span></span>');
                                startPoint.appendTo(infoLine);

                                var duration = $('<span class=\'timelineinfo-label\'>, ' +
                                'Duration: <span class=\'timelineinfo-number\'>' +
                                scope.widgets[gid].parameters.duration + 's</span></span>');
                                duration.appendTo(infoLine);

                                var btnsArea = $('<div style=\'position:relative; top:2px; left:10px; ' +
                                'display: inline; float: none;\'>');
                                infoLine.append(btnsArea);

                                var editLink = $('<a class="editBtn"  ng-click="openEditfieldModal(\'' +
                                scope.widgets[gid].availableWidgetId + '\', \'' +
                                scope.widgets[gid]._id + '\', \'' +
                                scope.widgets[gid].parameters.rowPosition + '\', \'' +
                                scope.widgets[gid].parameters.colPosition + '\', false);"></a>');
                                editLink.append('<i class=\'icon-bv-edit\' style=\'width:16px\'></i>');
                                btnsArea.append(editLink);

                                var delLink = $('<a ng-click="deleteWidget(\'' +
                                scope.widgets[gid]._id + '\');"></a>');
                                delLink.append('<i style=\'position:relative; left:5px;\' ' +
                                'class=\'icon-bv-trash\'></i>');
                                btnsArea.append(delLink);

                                var htmlFont = $('#timeline-widgetInfo').html();
                                $('#timeline-widgetInfo').html($compile(htmlFont)(scope));
                            }
                        }
                    });

                    element.hover(
                        function () {
                            var gid = $(this).attr('id').split('_')[1];
                            var visibilityBtnArea = element.find('.visibility-btns-area');
                            var btnArea = element.find('.btns-area');
                            visibilityBtnArea.show();
                            btnArea.show();
                            element.css('border', '2px solid #' + scope.widgets[gid].parameters.widgetBorderColor);
                            element.css('z-index', (502 - scope.widgets[gid].parameters.timelineRowPosition));
                            $('#marker-' + scope.widgets[gid]._id).css('border',
                                '1px solid #' + scope.widgets[gid].parameters.widgetBorderColor);
                        },
                        function () {
                            if (typeof scope.selectedWidget === 'undefined') {
                                scope.selectedWidget = 0;
                            }

                            //only revert border if this widget was not clicked
                            if (scope.selectedWidget !== element.attr('id')) {
                                var gid = $(this).attr('id').split('_')[1];
                                var visibilityBtnArea = element.find('.visibility-btns-area');
                                var btnArea = element.find('.btns-area');

                                visibilityBtnArea.hide();
                                btnArea.hide();

                                element.css('border', '2px solid #' + scope.widgets[gid].parameters.widgetRandomColor);
                                element.css('z-index', (500 - scope.widgets[gid].parameters.timelineRowPosition));
                                $('#marker-' + scope.widgets[gid]._id).css('border', 0);
                            }
                        }
                    );
                }
            };
        }
    ]);