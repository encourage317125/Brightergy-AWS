angular.module('bl.analyze.solar.surface')
.constant('asDateRangeSelectorConfig', {
  labels: {
    'today':  'Today',
    'week':   '7 Days',
    'month':  '30 Days',
    'year':   '12 Months',
    'YTD':    'YTD',
    'total':  'Total'
  }
})

.controller('asDateRangeSelectorController',
  ['$scope', '$attrs', 'asDateRangeSelectorConfig',
   function ($scope, $attrs, config) {
     var attrRanges = $attrs.ranges || 'week, month, year',
         attrForceDropdown = $attrs.forceDropdown || false;

     $scope.showDropdown = !!attrForceDropdown;

     $scope.ranges = attrRanges.split(',').map(function (range) {
       return {
         'label': config.labels[range],
         'value': range
       };
     });

     $scope.selectRange = function (range) {
       $scope.ngModel = range;
     };
   }
  ]
)

.directive('asDateRangeSelector', function() {
  return {
    restrict: 'AE',
    scope: {
      ngModel: '='
    },
    controller: 'asDateRangeSelectorController',
    replace: false,
    template: [
      '<div class="controls element-date-range-selector-wrapper">',
        '<ul class="date-range-selector hidden-xs" ng-class="{hide: showDropdown}">',
          '<li ng-repeat="item in ranges" ng-class="{active: item.value == ngModel}">',
            '<a ng-click="selectRange(item.value)" ng-bind="item.label"></a>',
          '</li>',
        '</ul>',
        '<select class="date-range-selector" ng-model="ngModel" ',
        'ng-class="{\'show\': showDropdown, \'visible-xs\': !showDropdown}"',
        'ng-options="item.value as item.label for item in ranges"></select>',
      '</div>'].join(''),
    link: function(scope, element, attrs) {

    }
  };
});
