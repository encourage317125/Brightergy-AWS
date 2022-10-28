angular.module('bl.analyze.solar.surface')
  .filter('asDecimalUnitPrefix', function () {
    return function(number, afterfix, base) {

      var prefix = base === 'k' ? 1 : 0;
      var prefixes = ['', 'k', 'M', 'G', 'T'];  //kilo, mega, giga, tera;


      if (number >= 1000000000000) {
        prefix += 4;
      } else if (number >= 1000000000) {
        prefix += 3;
      } else if (number >= 1000000) {
        prefix += 2;
      } else if (number >= 1000) {
        prefix += 1;
      }

      return prefixes[prefix] + (afterfix || '');
    };
  });