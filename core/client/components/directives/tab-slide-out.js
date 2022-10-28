angular.module('blApp.components.directives')
    .directive('tabSlideOut', function() {
        return {
            restrict: 'A',
            link : function (scope, element, attrs, controller) {
                var settings = scope.$eval(attrs.tabSlideOut);
                $(element).tabSlideOut(settings);
                if (typeof settings.renderAfter === 'function') {
                    settings.renderAfter();
                }
            }
        };
    });
