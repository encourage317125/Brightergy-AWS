angular.module('blApp.components.directives')
    .directive('mCustomScrollbar', function() {
        return {
            restrict: 'A',
            link : function (scope, element, attrs, controller) {
            	if(attrs.mCustomScrollbar === 'yx') {
                    $(element).mCustomScrollbar({
						scrollbarPosition: 'outside',
            			axis: 'yx'
                    });	
            	}
                else {
                	$(element).mCustomScrollbar();	
                }
            }
        };
    });
