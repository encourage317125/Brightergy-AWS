angular.module('blApp.components.directives')
  .directive('passwordStrength', function () {
    return {
      restrict: 'A',
      scope: {
        ngModel: '@'
      },
      link: function(scope, element, attrs, content) {

      }
    };
  });