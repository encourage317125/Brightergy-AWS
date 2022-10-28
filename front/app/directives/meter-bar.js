angular.module('bl.analyze.solar.surface')
  .directive('asMeterBar', function () {
    function getPercent(min, max, value) {
      if (isNaN(min) || isNaN(max) || isNaN(value)) {
        return 0;
      }
      return Math.ceil((value - min) / (max - min) * 100);
    }

    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        'min': '=',
        'max': '=',
        'ngModel': '='
      },
      template: ['<div class="meterbar-content"><div class="wrapper-minmax">',
                 '<span class="max" ng-bind="(max | number)">0</span>',
                 '<span class="min" ng-bind="(min | number)">0</span></div>',
                 '<progress max="100" value="{{percentageValue}}"/></div>'].join(''),
      link: function (scope, element, attrs) {
        scope.percentageValue = 0;
        scope.$watchGroup(['min', 'max', 'ngModel'], function(newValues, oldValues) {
          var min = parseFloat(newValues[0]),
              max = parseFloat(newValues[1]),
              value = parseFloat(newValues[2]);

          scope.percentageValue = getPercent(min, max, value);
        });
      }
    };
  });