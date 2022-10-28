angular.module('bl.analyze.solar.surface')
  .directive('asAnimatedNumber', function() {
    return {
      restrict: 'AE',
      scope: true,
      link: function(scope, element, attrs) {
        var animationLength, numDecimals, option;
        numDecimals = 0;
        animationLength = 2;
        if (attrs.compress) {
          option = {
            useCompress: true
          };
          if (attrs.nosuffix) {
            option.compressSuffix = ['', ''];
          }
          if ((attrs.numDecimals !== null) && attrs.numDecimals >= 0) {
            numDecimals = attrs.numDecimals;
          } else {
            numDecimals = 0;
          }
        } else {
          if ((attrs.numDecimals !== null) && attrs.numDecimals >= 0) {
            numDecimals = attrs.numDecimals;
          }

          if ((attrs.animationLength !== null) && attrs.animationLength > 0) {
            animationLength = attrs.animationLength;
          }
        }
        return scope.$watch(attrs.ngBind, function(newVal, oldVal) {
          if (!oldVal || isNaN(oldVal)) {
            oldVal = 0;
          }
          if (!newVal || isNaN(newVal)) {
            newVal = 0;
          }
          if (newVal !== oldVal) {
            if (oldVal <= 0) {
              if (newVal >= 1000) {
                var firstVal = Number(String(newVal).charAt(0));
                oldVal = newVal / firstVal;
              }
            }
            return new countUp(element[0], oldVal, newVal, numDecimals, animationLength, option).start();
          }
        });
      }
    };
  });
