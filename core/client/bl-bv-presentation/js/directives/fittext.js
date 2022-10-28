'use strict';

angular.module('blApp.presentation.directives')
    .directive('fittext', function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, content) {
                if(!scope.isMobile){
                    var orgFontSize = parseFloat($(element[0]).css('font-size'));
                    //var windowSize = $(window).width();
                    var windowSize = screen.width;
                    var fontRatio = orgFontSize / windowSize;
                    element.attr('data-font-ratio', fontRatio);
                    element.attr('data-org-font-size', $(element[0]).css('font-size'));
                    $(window).resize(function(e) {
                        var windowSize = $(window).width();
                        var fontRatio = element.attr('data-font-ratio');
                        var scaledFontSize = windowSize * fontRatio;
                        $(element[0]).css('font-size', scaledFontSize+'px');
                    });
                }
            }
        };
    });