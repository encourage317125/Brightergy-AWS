angular.module('bl.analyze.solar.surface')
  .directive('asDaterangePicker',
  ['moment', function(moment) {
    return {
      restrict: 'EA',
      replace: true,
      transclude: false,
      scope: {
        startDate: '=',
        endDate: '='
      },
      template: ['<div class="date-range-picker">',
        '<div class="date-el-wrapper">',
        '<span class="dateLabel">From:</span>',
        '<span class="dateValue" ng-bind="startDate | amDateFormat:\'M/DD/YYYY\'"></span>',
        '</div>',
        '<div class="date-el-wrapper">',
        '<span class="dateLabel">To:</span>',
        '<span class="dateValue" ng-bind="endDate | amDateFormat:\'M/DD/YYYY\'"></span>',
        '</div>',
        '</div>'].join(''),
      link: function(scope, element, attrs) {
        var id = attrs.id;
        var dateFormat = 'M/DD/YYYY',
          today = moment().format('M/DD/YYYY');

        $(element).find('.dateValue').dateRangePicker({
          format: dateFormat,
          separator : '-',
          container: '#' + id,
          showShortcuts: false,
          autoClose: true,
          startOfWeek: 'monday',
          endDate: today,
          getValue: function() {
            if (scope.startDate && scope.endDate ) {
              return [moment(scope.startDate).format(dateFormat),
                moment(scope.endDate).format(dateFormat)].join('-');
            } else {
              return '';
            }
          },
          setValue: function(s, s1, s2) {
            var startDate = moment(s1, dateFormat).valueOf(),
              endDate = moment(s2, dateFormat).valueOf();

            if (startDate !== scope.startDate && endDate !== scope.endDate) {
              scope.startDate = moment(s1, dateFormat).valueOf();
              scope.endDate = moment(s2, dateFormat).valueOf();
              scope.$apply();
            }
          }
        });
      }
    };
  }]);