angular.module('bl.analyze.solar.surface')
  .filter('asShortNumber', ['$filter', function ($filter) {
    return function(number) {
      if (parseFloat(number) < 0) {
        return $filter('number')(number, 2);
      }

      number = parseInt(number);
      if (number >= 1000000000) {
        number = $filter('number')(number / 1000000, 0) + 'm';
      } else if (number >= 1000000) {
        number = $filter('number')(number / 1000000, 1) + 'm';
      } else if (number >= 100000) {
        number = $filter('number')(number / 1000, 0) + 'k';
      } else if (number >= 1000) {
        number = $filter('number')(number / 1000, 1) + 'k';
      }

      return number;
    };
  }]);