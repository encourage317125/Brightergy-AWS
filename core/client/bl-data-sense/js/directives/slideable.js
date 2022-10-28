/*
 * Slideable directive
 * @param [ui-sortable] {object} Options to pass to $.fn.sortable() merged onto ui.config
 */
angular.module('blApp.dataSense.directives')
    .directive('slideable', function () {
        return {
            restrict:'C',
            scope: {
                collapsed: '='
            },
            compile: function (element, attr) {
                // wrap tag
                var contents = element.html();
                var height = 0;
                element.html(
                    '<div class="slideable_content clearfix" style="margin:0 !important; padding:0 !important" >'
                    + contents + '</div>');

                return function postLink(scope, element, attrs) {
                    // default properties
                    attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                    attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                    if(scope.collapsed) {
                        height = 0;
                    } else {
                        height = element.find('.slideable_content').eq(0).height();
                    }
                    element.attr('style', 'overflow:hidden; transition: all 0.3s ease-in-out; height: '
                        + height + 'px;');

                    scope.$watch(function() { return element.find('.slideable_content').height(); },
                        function(newHeight) {
                            if(!scope.collapsed) {
                                element.get(0).style.height = newHeight + 'px';
                            }
                        }
                    );
                };
            }
        };
    })
    .directive('slideToggle', function() {
        return {
            restrict: 'A',
            scope: {
                collapsed: '='
            },
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    console.log(attrs);
                    var target = $(attrs.slideToggle);
                    console.log(target);
                    var content = target.find('.slideable_content').get(0);
                    if(scope.collapsed) {
                        content.style.border = '1px solid rgba(0,0,0,0)';
                        var y = content.clientHeight;
                        content.style.border = 0;
                        target.get(0).style.height = y + 'px';
                    } else {
                        target.get(0).style.height = '0px';
                    }
                });
            }
        };
    });
