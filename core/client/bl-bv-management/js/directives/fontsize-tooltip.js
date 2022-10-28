'use strict';

angular.module('blApp.management.directives')
    .directive('fontsizeTooltip', function () {
        return {
            restrict: 'A',
            scope: {
                fontsizeTooltip: '='
            },
            link : function (scope, element) {
                var baseFontSize;
                try {
                    baseFontSize = parseInt(getComputedStyle(document.getElementsByTagName('body')[0])
                                            .getPropertyValue('font-size'));
                } catch (e) {
                    baseFontSize = 14;
                }

                // if element doesn't have input box which indicates el font-size, don't proceed
                if (!element.find('input').length) {
                    return false;
                }

                // toggle tooltip for input focus in/out
                element.find('input').bind('focusin', function () {
                    element.addClass('show-tooltip');
                }).bind('focusout', function () {
                    element.removeClass('show-tooltip');
                });

                scope.$watch('fontsizeTooltip', function (emValue) {
                    if (isNaN(emValue)) { return; }
                    var tooltip = [emValue, 'em = ', parseInt(baseFontSize * emValue), 'px'].join('');
                    element.attr('data-tooltip', tooltip);
                });
            }
        };
    });
