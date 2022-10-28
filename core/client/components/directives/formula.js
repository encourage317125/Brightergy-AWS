angular.module('blApp.components.directives')
    .directive('formula', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, content) {
                scope.tagsInput = element.tagsInput({
                    defaultText:'Add Metric ?'
                });
            }
        };
    });