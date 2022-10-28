angular.module('bl.analyze.solar.surface')
  .filter('asDate', ['$filter', function ($filter) {
    return function (date, format) {
      // Add custom format
      // Convert Mon, April 1 to MON, April 1
      // Make English Weekday to uppercase

      var decorated = $filter('date')(date, format);

      var regEx = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/,
          pos = decorated.search(regEx);

      if (pos > -1) {
        return decorated.replace(regEx, decorated.substr(pos, 3).toUpperCase());
      } else {
        return decorated;
      }
    };
  }]);