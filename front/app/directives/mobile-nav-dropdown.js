angular.module('bl.analyze.solar.surface')

.directive('asMobileNavDropDown', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attritubes) {
      $(element).mmenu({
        offCanvas: {
          position: attritubes['asMobileNavDropDown']
        },
        isMenu: false
      });
    }
  };
});
