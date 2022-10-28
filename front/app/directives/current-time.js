angular.module('bl.analyze.solar.surface')
  .directive('asCurrentTime', ['$filter', '$timeout', function($filter, $timeout){
    return function(scope, element, attrs){
      var format = attrs.format,
          isCapitalWeekDay = attrs.capitalweek || false;

      function updateTime(){
        var dt = $filter(isCapitalWeekDay ? 'asDate' : 'date')(new Date(), format);
        element.text(dt);
      }

      function updateLater() {
        $timeout(function() {
          updateTime(); // update DOM
          updateLater(); // schedule another update
        }, 1000, false);
      }
      updateTime();
      updateLater();
    };
  }]);