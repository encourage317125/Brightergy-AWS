'use strict';

angular.module('blApp.dataSense.directives')
    .directive('closeDialog', ['$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs, content) {
                    element.click(function (e) {
                        var targetObject = $(e.target);

                        if (!targetObject.closest('#layout-dialog').length
                            && !targetObject.closest('#set-layout').length) {
                            $rootScope.layoutPanelShown = false;
                            $rootScope.$apply();
                        }

                        if (!targetObject.closest('#choose-segment-dlg').length
                            && !targetObject.closest('.add-segment').length
                            && !targetObject.closest('.segment').length) {
                            $('#choose-segment-dlg').removeClass('opened').css({
                                'top': 0,
                                'left': 0,
                                'display': 'none'
                            });
                        }

                        if (!targetObject.closest('.bl-daterange-panel').length
                            && !targetObject.closest('.bl-daterange-picker').length
                            && !targetObject.closest('.datepicker').length
                            && !(targetObject.is('td.day')
                                || targetObject.is('td.month')
                                || targetObject.is('td.year'))) {
                            var dateRangePanel = $('.bl-daterange-panel');
                            if (dateRangePanel.is(':visible')) {
                                dateRangePanel.css('opacity', 0);
                                setTimeout(function () {
                                    dateRangePanel.css('display', 'none');
                                }, 300);
                            }
                        }

                        if (!targetObject.closest('.sharePanel')
                            && !targetObject.closest('#sharePanel_btn').length) {
                            var scopeSharePanel = angular.element('.sharePanel').scope();
                            scopeSharePanel.togglePanel = false;
                            scopeSharePanel.$apply();
                        }

                        //If users click outside of opened dashboard selector panel then hides it
                        if (!targetObject.closest('.dashboard-selector .dashboard-label').length
                            && !targetObject.closest('.dashboard-selector .dropdown-panel').length) {
                            var scopeDsPanel = angular.element('.dashboard-selector').scope();
                            if (scopeDsPanel.isPanelShown) {
                                scopeDsPanel.isPanelShown = false;
                                scopeDsPanel.$apply();
                            }
                        }

                    });
                }
            };
        }
    ]);