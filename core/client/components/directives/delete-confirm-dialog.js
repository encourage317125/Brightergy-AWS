angular.module('blApp.components.directives')
    .directive('deleteDialog', function($compile) {
        return {
            restrict: 'E',
            link : function (scope, element, attrs, controller) {
                if (angular.isDefined(attrs.yes) || angular.isDefined(attrs.no)){
                    element.find('.glyphicon-ok-sign').parent().attr('ng-click', attrs.yes);
                    element.find('.glyphicon-remove-sign').parent().attr('ng-click', attrs.no);
                    if (attrs.message){
                        element.find('p').html(attrs.message);
                    }
                    $compile(element.find('.delete-box'))(scope);
                }
            },
            template: ['<div class="delete-box animation-show clearfix">',
                      '<p>Really Delete?</p>',
                      '<a ng-click="" class="green-color"><i class="glyphicon glyphicon-remove-sign"></i>No</a>',
                      '<a ng-click="" class="green-color"><i class="glyphicon glyphicon-ok-sign"></i>Yes</a>',
                      '</div>'].join('')
        };
    });