'use strict';

angular.module('blApp.dataSense.directives')
    .directive('dateRangePicker',
        ['$rootScope', '$timeout', 'dashboardService', 'toggleService', 'notifyService',
        function($rootScope, $timeout, dashboardService, toggleService, notifyService) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: false,
            scope: {
                currentDashboard: '='
            },
            controller: function($scope,$element,$attrs,$transclude){
                $scope.rangeShortcuts = [
                    {value: '0', display: 'Custom'},
                    {value: '1', display: 'Current Day'},
                    {value: '2', display: 'Previous Day'},
                    {value: '3', display: 'Last Seven days'},
                    {value: '4', display: 'Current Week'},
                    {value: '5', display: 'Last Week'},
                    {value: '6', display: 'Last 30 Days'},
                    {value: '7', display: 'Current Month'},
                    {value: '8', display: 'Last Month'},
                    {value: '9', display: 'Current Year'},
                    {value: '10', display: 'Last 12 Months'},
                    {value: '11', display: 'Last Year'}
                ];

                $scope.rangeCompareShortcuts = $scope.rangeShortcuts.slice();
                $scope.rangeCompareShortcuts.push(
                    {value: '12', display: 'Previous Period'},
                    {value: '13', display:'Previous Year'});

                $scope.subDayOptions = [
                    {value: '12h', display: '12 hours'},
                    {value: '6h', display: '6 hours'},
                    {value: '3h', display: '3 hours'},
                    {value: '1h', display: '1 hour'},
                    {value: '10m', display: '10 minutes'}
                ];

                // Initializes the date range picker on every dashboard selection.
                $scope.loadDateRange = function() {
                    $scope.dateRangeType    = '0';
                    $scope.compareRangeType = '0';
                    $scope.isCompareTo      = false;
                    $scope.isRealTime       = false;

                    $scope.isViewerTime     = false;
                    $scope.tzOffsetString   = moment().format('Z');

                    $scope.subDay           = $scope.subDayOptions[0].value;
                    $scope.isSubDaySelected = false;

                    var tzOffset = moment().utcOffset();
                    var currentTime = moment();
                    var currentDate = moment().format('MM/DD/YY');

                    $scope.daterangeStartDate = currentTime;
                    $scope.daterangeEndDate = currentTime;
                    $scope.daterangeCompareStartDate = currentTime;
                    $scope.daterangeCompareEndDate = currentTime;
                    $scope.tmpStartDate = currentDate;
                    $scope.tmpEndDate = currentDate;
                    $scope.tmpCompareStartDate = currentDate;
                    $scope.tmpCompareEndDate = currentDate;

                    if ($scope.currentDashboard) {
                        var period = 0, diff = 0;
                        if ($scope.currentDashboard.startDate && $scope.currentDashboard.endDate) {
                            $scope.daterangeStartDate = moment.utc($scope.currentDashboard.startDate);
                            $scope.daterangeEndDate = moment.utc($scope.currentDashboard.endDate);
                            $scope.tmpStartDate = $scope.daterangeStartDate.format('MM/DD/YY');
                            $scope.tmpEndDate = $scope.daterangeEndDate.format('MM/DD/YY');
                            period = $scope.daterangeEndDate.diff($scope.daterangeStartDate, 'minutes');
                        }

                        if ($scope.currentDashboard.compareStartDate && $scope.currentDashboard.compareEndDate) {
                            $scope.daterangeCompareStartDate = moment.utc($scope.currentDashboard.compareStartDate);
                            $scope.daterangeCompareEndDate =
                                moment.utc($scope.currentDashboard.compareStartDate).add(period, 'minutes');
                            $scope.tmpCompareStartDate = $scope.daterangeCompareStartDate.format('MM/DD/YY');
                            $scope.tmpCompareEndDate = $scope.daterangeCompareEndDate.format('MM/DD/YY');

                            $scope.isCompareTo = true;
                            $scope.isCompareToSaved = true;
                            angular.element('#bl-daterange-chk-compare-to').parent().addClass('selected');
                        } else {
                            $scope.isCompareTo = false;
                            $scope.isCompareToSaved = false;
                            angular.element('#bl-daterange-chk-compare-to').parent().removeClass('selected');
                        }

                        if ($scope.currentDashboard.isViewerTime) {
                            $scope.isViewerTime = true;
                            angular.element('#bl-daterange-chk-viewer-tz').parent().addClass('selected');
                        } else {
                            angular.element('#bl-daterange-chk-viewer-tz').parent().removeClass('selected');
                        }

                        $scope.isRealTime = $scope.currentDashboard.isRealTimeDateRange;
                        if ($scope.isRealTime === true) {
                            // If "Real-Time" option is checked, reflect the latest date range upto today
                            //  to the date range section.
                            // Shift the primary date range - show current UTC date
                            //  because the returned data includes dates in UTC format.
                            diff = moment.utc().diff($scope.daterangeEndDate, 'minutes');
                            $scope.daterangeEndDate = moment.utc();
                            $scope.daterangeStartDate = moment.utc().subtract(period, 'minutes');

                            // Shift the compare date range
                            if ($scope.isCompareTo === true) {
                                $scope.daterangeCompareStartDate =
                                    $scope.daterangeCompareStartDate.add(diff, 'minutes');
                                $scope.daterangeCompareEndDate =
                                    moment.utc($scope.daterangeCompareStartDate).add(period,'minutes');
                            }

                            angular.element('#bl-daterange-chk-real-time').parent().addClass('selected');
                        } else {
                            angular.element('#bl-daterange-chk-real-time').parent().removeClass('selected');
                        }

                        if ($scope.currentDashboard.subDay) {
                            $scope.isSubDaySelected = true;
                            $scope.subDay = $scope.currentDashboard.subDay;
                            angular.element('#bl-daterange-chk-subday').parent().addClass('selected');
                        } else {
                            angular.element('#bl-daterange-chk-subday').parent().removeClass('selected');
                        }
                    }

                    var dateRange = [], compareDateRange = [];

                    dateRange[0] = new Date(moment.utc($scope.daterangeStartDate).add(-tzOffset, 'm'));
                    dateRange[1] = new Date(moment.utc($scope.daterangeEndDate).add(-tzOffset, 'm'));
                    compareDateRange[0] = new Date(moment.utc($scope.daterangeCompareStartDate).add(-tzOffset, 'm'));
                    compareDateRange[1] = new Date(moment.utc($scope.daterangeCompareEndDate).add(-tzOffset, 'm'));


                    $timeout(function() {
                        var datePickerId = '#'+$element.find('#bl-daterange-widget').data('datepickerId');
                        $element.find(datePickerId).data('datepicker').current = dateRange[1];
                        $element.find('#bl-daterange-widget').DatePickerSetDate(jQuery.extend([], dateRange));

                        if($scope.isCompareToSaved) {
                            $element.find('#bl-daterange-widget')
                                .DatePickerSetCompareDate(jQuery.extend([], compareDateRange));
                            /*$element.find('#bl-daterange-compare-start-date')
                                .datepicker('setDate', $scope.daterangeCompareStartDate);
                            $element.find('#bl-daterange-compare-end-date')
                                .datepicker('setDate', $scope.daterangeCompareEndDate);*/
                        }
                    }, 50);
                };

                // Apply the changed date ranges and save to the db.
                $scope.changeDateRange = function() {
                    var obj = $scope.currentDashboard;
                    var message = 'Start Date should be less than or equal to End Date.';
                    var saveStartDate = moment.utc($scope.tmpStartDate, 'MM-DD-YY');
                    var saveEndDate = moment.utc($scope.tmpEndDate, 'MM-DD-YY');

                    if (!$rootScope.Dsmodifyable) {
                        message = 'Dashboard is locked. Therefore you don\' have permission to update';
                        notifyService.errorNotify(message);
                        return false;
                    }

                    if (saveStartDate > saveEndDate) {
                        notifyService.errorNotify(message);
                        return false;
                    }

                    obj.isRealTimeDateRange = $scope.isRealTime;
                    obj.isViewerTime = $scope.isViewerTime;
                    obj.startDate = saveStartDate;
                    obj.endDate = saveEndDate;
                    obj.compareStartDate = null;
                    obj.compareEndDate = null;

                    if ($scope.isSubDaySelected) {
                        obj.subDay = $scope.subDay;
                        obj.isRealTimeDateRange = true;
                        obj.startDate = moment.utc();
                        obj.endDate = moment.utc();
                    } else {
                        obj.subDay = null;
                    }

                    if($scope.isCompareToSaved) {
                        var compareStartDate = moment.utc($scope.tmpCompareStartDate, 'MM-DD-YY');
                        var compareEndDate = moment.utc($scope.tmpCompareEndDate, 'MM-DD-YY');
                        if(compareStartDate > compareEndDate) {
                            message = 'Compare Start Date should be less than or equal to Compare End Date.';
                            notifyService.errorNotify(message);
                            return false;
                        }
                        obj.compareStartDate = compareStartDate;
                        obj.compareEndDate = compareEndDate;

                        if ($scope.isSubDaySelected) {
                            obj.compareStartDate = compareEndDate;
                        }
                    }

                    $scope.closeDateRangePane();
                    toggleService.showPleaseWait();
                    dashboardService.saveDateRanges(obj).then(function (resp) {
                        console.log('successfully saved');
                        $rootScope.selectedDashboard.__v = resp.__v;
                        $scope.currentDashboard.__v = resp.__v;

                        $rootScope.selectedDashboard.startDate = resp.startDate;
                        $rootScope.selectedDashboard.endDate = resp.endDate;
                        $rootScope.selectedDashboard.compareStartDate = resp.compareStartDate;
                        $rootScope.selectedDashboard.compareEndDate = resp.compareEndDate;
                        $scope.currentDashboard.startDate = resp.startDate;
                        $scope.currentDashboard.endDate = resp.endDate;
                        $scope.currentDashboard.compareStartDate = resp.compareStartDate;
                        $scope.currentDashboard.compareEndDate = resp.compareEndDate;

                        //Update the date range panel with the returned values
                        $scope.loadDateRange();
                        $rootScope.$broadcast('changedSegmentOrDateRange',{});
                    }, function () {
                        toggleService.hidePleaseWait();
                    });
                };

                $scope.setDatesToDaterangeInput = function (dates)  {
                    $scope.tmpStartDate = dates[0].format('mm/dd/yy');
                    $scope.tmpEndDate = dates[1].format('mm/dd/yy');
                };

                $scope.setDatesToCompareDaterangeInput = function (dates)  {
                    $scope.tmpCompareStartDate = dates[0].format('mm/dd/yy');
                    $scope.tmpCompareEndDate = dates[1].format('mm/dd/yy');
                };

                $scope.closeDateRangePane = function() {
                    $element.find('.bl-daterange-panel').css('opacity', 0);
                    $timeout(function() {
                        $element.find('.bl-daterange-panel').css('display', 'none');
                    }, 300);
                };

                // Calculate the date range by user-selected shortcuts
                //  in both case of primary and comparison date ranges
                // Apply the ranges to the 3-calendar panel.
                $scope.setDateRangeByShortcut = function (isDateRange, shortcutType) {
                    var today = new Date();
                    var dates = [];

                    switch(shortcutType) {
                        // Current Day
                        case '1':
                            dates[1] = moment();
                            dates[0] = moment();
                            break;
                        // Previous Day
                        case '2':
                            dates[1] = moment().subtract(1, 'days');
                            dates[0] = moment().subtract(1, 'days');
                            break;
                        // Last Seven Days - automatically selects seven days beginning with the current day
                        // (e.g. if today is October 7, 2014, the following dates of October 2014 are selected:
                        //  7, 6, 5, 4, 3, 2, 1).
                        case '3':
                            dates[1] = moment();
                            dates[0] = moment().subtract(7 - 1, 'days');
                            break;
                        // Current Week - automatically selects the current week from Sunday to Saturday
                        // (e.g. if it were Monday, then two days would be selected).
                        case '4':
                            dates[1] = moment();
                            dates[0] = moment().day(0);
                            break;
                        // Last Week - automatically select the most recent full week from Sunday to Saturday.
                        case '5':
                            dates[1] = moment().day(-1);
                            dates[0] = moment().day(-7);
                            break;
                        // Last 30 Days
                        case '6':
                            dates[1] = moment();
                            dates[0] = moment().subtract(30 - 1, 'days');
                            break;
                        // Current Month
                        case '7':
                            dates[1] = moment();
                            dates[0] = moment().date(1);
                            break;
                        // Last Month
                        case '8':
                            dates[1] = new Date(today.getFullYear(), today.getMonth(), 0);
                            dates[0] = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                            break;
                        // Current Year
                        case '9':
                            dates[1] = today;
                            dates[0] = new Date(today.getFullYear(), 0, 1);
                            break;
                        // Last 12 Months
                        case '10':
                            dates[1] = new Date(today.getFullYear(), today.getMonth(), 0);
                            dates[0] = new Date(today.getFullYear(), today.getMonth() - 12, 1);
                            break;
                        // Last Year
                        case '11':
                            dates[1] = new Date(today.getFullYear() - 1, 11, 31);
                            dates[0] = new Date(today.getFullYear() - 1, 0, 1);
                            break;
                        // Previous Period
                        case '12':
                            var days = moment($scope.tmpEndDate, 'MM-DD-YY')
                                .diff(moment($scope.tmpStartDate, 'MM-DD-YY'), 'days');
                            dates[1] = moment($scope.tmpStartDate, 'MM-DD-YY')
                                .subtract(1, 'days');
                            dates[0] = moment(dates[1]).subtract(days, 'days');
                            break;
                        // Previous Year
                        case '13':
                            dates[0] = new Date(moment($scope.tmpStartDate, 'MM-DD-YY'));
                            dates[0].setFullYear(dates[0].getFullYear()-1);
                            dates[1] = new Date(moment($scope.tmpEndDate, 'MM-DD-YY'));
                            dates[1].setFullYear(dates[1].getFullYear()-1);
                            break;
                        default:
                            break;
                    }

                    dates[0] = new Date(dates[0]);
                    dates[1] = new Date(dates[1]);

                    if(isDateRange === true) {
                        $element.find('#bl-daterange-widget').DatePickerSetDate(jQuery.extend([], dates));
                        $scope.setDatesToDaterangeInput(dates);
                    } else {
                        $element.find('#bl-daterange-widget').DatePickerSetCompareDate(jQuery.extend([], dates));
                        $scope.setDatesToCompareDaterangeInput(dates);
                    }
                };

                $scope.changeDateRangeShortcut = function () {
                    if($scope.dateRangeType !== '0') {
                        $scope.setDateRangeByShortcut(true, $scope.dateRangeType);
                    }
                };

                // Calculates the date range automatically if user selects shortcut for date range.
                // Remove the orange-colored compare dates if user uncheck the "Compare To".
                $scope.changeCompareRange = function () {
                    if($scope.isCompareToSaved) {
                        if($scope.compareRangeType !== '0') {
                            $scope.setDateRangeByShortcut(false, $scope.compareRangeType);
                        }
                    } else {
                        $('#bl-daterange-widget').find('td>table tbody td[data-day]').each(function(index){
                            $(this).removeClass('datepickerCompared');
                        });
                    }
                };
            },
            link: function(scope, element, attrs, ctrl) {
                var dateRange = [new Date(), new Date()];
                var compareDateRange = [new Date(), new Date()];

                element.find('#bl-daterange-widget').DatePicker({
                    flat: true,
                    date: jQuery.extend([], dateRange),
                    current: new Date(),
                    calendars: 3,
                    mode: 'range',
                    starts: 0,
                    view: 'days',
                    locale: {
                        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        daysMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
                        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                            'October', 'November', 'December'],
                        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                            'Oct', 'Nov', 'Dec'],
                        weekMin: 'wk'
                    },
                    onChange: function(strDates, dates, target) {
                        if (!dates && !dates.length && dates.length < 2) {
                            return;
                        }
                        scope.setDatesToDaterangeInput(dates);
                        scope.changeCompareRange();
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    }
                });

                scope.loadDateRange();

                scope.$watch('currentDashboard', function(){
                    scope.loadDateRange();
                });

                element.find('.btn-bl-daterange-widget-prev').on('click', function() {
                    var datePickerId = '#' + element.find('#bl-daterange-widget').data('datepickerId');
                    element.find(datePickerId).data('datepicker').current.addMonths(-1);
                    element.find('#bl-daterange-widget').DatePickerRerender();
                });
                element.find('.btn-bl-daterange-widget-next').on('click', function() {
                    var datePickerId = '#' + element.find('#bl-daterange-widget').data('datepickerId');
                    element.find(datePickerId).data('datepicker').current.addMonths(1);
                    element.find('#bl-daterange-widget').DatePickerRerender();
                });

                /**
                 *  Initializes the datepicker for daterange inputs with the date format of "MM/DD/YY"
                 * Separate initialization of #bl-daterange-start-date and #bl-daterange-end-date needed
                 *  even though it's possible to do as #bl-daterange-datepicker.
                 **/
                element.find('#bl-daterange-start-date').datepicker({
                    format: 'mm/dd/yy',
                    autoclose: true,
                    todayHighlight: true
                }).on('changeDate', function (evt) {
                    if(typeof evt.date !== 'undefined' || evt.date !== null) {
                        dateRange[0] = evt.date;
                        element.find('#bl-daterange-widget').DatePickerSetDate(jQuery.extend([], dateRange));
                    }
                });

                element.find('#bl-daterange-end-date').datepicker({
                    format: 'mm/dd/yy',
                    autoclose: true,
                    todayHighlight: true
                }).on('changeDate', function (evt) {
                    if(typeof evt.date !== 'undefined' || evt.date !== null) {
                        dateRange[1] = evt.date;
                        element.find('#bl-daterange-widget').DatePickerSetDate(jQuery.extend([], dateRange));
                    }
                });

                // If user started to input dates, then change the shortcut to "Custom" and empty the input
                // so that the date format (MM/DD/YY) to be displayed.
                element.find('#bl-daterange-datepicker').on('focusin', function() {
                    scope.dateRangeType = '0';
                    if(event.target.id === 'bl-daterange-start-date') {
                        scope.tmpStartDate = '';
                    } else if (event.target.id === 'bl-daterange-end-date') {
                        scope.tmpEndDate = '';
                    }
                });

                // If user leaves the panel, then fill the input fields with the values on the picker main box
                // so that the empty fields (MM/DD/YY) to be rewritten.
                element.find('#bl-daterange-datepicker').on('focusout', function() {
                    if(scope.tmpStartDate === '') {
                        scope.tmpStartDate = new Date(scope.daterangeStartDate).format('mm/dd/yy');
                    }
                    if(scope.tmpEndDate === '') {
                        scope.tmpEndDate = new Date(scope.daterangeEndDate).format('mm/dd/yy');
                    }
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });

                // Implementation of comparison date range section like the above primary date range selection
                element.find('#bl-daterange-compare-start-date').datepicker({
                    format: 'mm/dd/yy',
                    autoclose: true,
                    todayHighlight: true
                }).on('changeDate', function (evt) {
                    if(typeof evt.date !== 'undefined' || evt.date !== null) {
                        compareDateRange[0] = evt.date;
                        element.find('#bl-daterange-widget')
                            .DatePickerSetCompareDate(jQuery.extend([], compareDateRange));
                    }
                });


                element.find('#bl-daterange-compare-end-date').datepicker({
                    format: 'mm/dd/yy',
                    autoclose: true,
                    todayHighlight: true
                }).on('changeDate', function (evt) {
                    if(typeof evt.date !== 'undefined' || evt.date !== null) {
                        compareDateRange[1] = evt.date;
                        element.find('#bl-daterange-widget')
                            .DatePickerSetCompareDate(jQuery.extend([], compareDateRange));
                    }
                });


                element.find('#bl-daterange-datepicker-compare').on('focusin', function() {
                    scope.compareRangeType = '0';
                    if(event.target.id === 'bl-daterange-compare-start-date') {
                        scope.tmpCompareStartDate = '';
                    } else if (event.target.id === 'bl-daterange-compare-end-date') {
                        scope.tmpCompareEndDate = '';
                    }
                });

                element.find('#bl-daterange-datepicker-compare').on('focusout', function() {
                    if(scope.tmpCompareStartDate === '') {
                        scope.tmpCompareStartDate = new Date(scope.daterangeCompareStartDate).format('mm/dd/yy');
                    }
                    if(scope.tmpCompareEndDate === '') {
                        scope.tmpCompareEndDate = new Date(scope.daterangeCompareEndDate).format('mm/dd/yy');
                    }
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });

                //element.find("#bl-daterange-chk-compare-to").customCheckbox();
                element.find('.custom-checkbox input').on('click', function() {
                    $(this).parent().toggleClass('selected');
                });

                // Toggles the daterange picker panel
                element.find('.bl-daterange-picker').on('click', function() {
                    var dateRangePanel = element.find('.bl-daterange-panel');
                    dateRangePanel.css('left',
                        $(this).position().left - $('.bl-daterange-panel').outerWidth() + $(this).outerWidth() );
                    dateRangePanel.css('top', $(this).position().top + $(this).outerHeight(true));
                    if (dateRangePanel.is(':visible')) {
                        dateRangePanel.css('opacity', 0);
                        setTimeout(function() {
                            dateRangePanel.css('display', 'none');
                        }, 300);
                    } else {
                        dateRangePanel.css('display', 'block');
                        setTimeout(function() {
                            dateRangePanel.css('opacity', 1);
                        }, 10);
                    }
                });
            },
            templateUrl: '/bl-data-sense/views/date-range.html'
        };
    }]);
