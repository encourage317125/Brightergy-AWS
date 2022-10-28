'use strict';

angular.module('blApp.components.directives')
    .directive('predictiveAutoComplete', function($compile) {
        return {
            restrict: 'E',
            scope: false,
            controller: function($scope,$element,$attrs,$transclude){
                var getFuncName = $attrs.func;
                var loadingVar = $attrs.loading;
                var getChangedFunc = $attrs.selected;
                function Search() {
                    this.options = {
                        html: true,
                        minLength: 1,
                        outHeight: 100,
                        maxWidth: 300,
                        delay: 0,
                        autoFocus: true,
                        source: function(request, response) {
                            $scope[loadingVar] = true;
                            $scope[getFuncName](request, response);
                        },
                        open: function () {
                            $scope[loadingVar] = false;
                        },
                        change: function (event, ui) {
                            if(typeof getChangedFunc !== 'undefined') {
                                $scope[getChangedFunc](event, ui);
                            }
                        }
                    };
                    if ($attrs.events) {
                        this.events = {
                            change: function (event, ui) {
                                console.log(ui);
                                if(ui.item !== null) {
                                    $scope.editAccount.sfdcAccountId = ui.item.id;
                                } else {
                                    $scope.editAccount.sfdcAccountId = '';
                                }
                            }
                        };
                    }
                }

                $scope.autoComplete = function () {
                    return new Search();
                };
            },
            link: function(scope, element, attrs, ctrl) {
                element.find('input').attr('ng-model', attrs.model);
                element.find('input').attr('ui-autocomplete', 'autoComplete()');
                element.find('input').attr('ng-class', '{\'is-loading\':' + attrs.loading + '}');
                element.find('input').attr('ng-blur', attrs.loading + '=false');
                if (attrs.required) {
                    element.find('input').attr('required', '');
                }
                element.find('input').attr('name', attrs.name);
                if (attrs.placeholder){
                    element.find('input').attr('placeholder', attrs.placeholder);
                }
                $compile(element.find('input'))(scope);
            },
            template: '<input type="text" class="form-control" placeholder=""/>'
        };
    });
