/**
 * @author Kornel
 * @date Oct 22 2014
 * @description
 *     Created to remove inline javascript
 */

angular.module('blApp.components.directives')
    .directive('closeComponentDialog', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, content) {
                element.click(function (e) {
                    var targetObject = $(e.target);
                    if (targetObject.closest('.notyfy_container').length === 0) {
                        $.notyfy.closeAll();
                    }
                    // Close Company Panel when click the outside of the Company Panel
                    if ((targetObject.parents('.company-panel-main').length === 0) && 
                        !targetObject.hasClass('apply-interval') && 
                        targetObject.parents('.dropdown-menu').length === 0 && 
                        !targetObject.parents('.ui-autocomplete').length) {
                        if ($('.company-panel-main').hasClass('open')) {
                            $('.btn-cpanel-handler').trigger('click');
                        }
                    }
                    if ((targetObject.closest('#open-create-editor').length === 0) && 
                        (targetObject.closest('.editor-list i.custom-puls-icon').length === 0)) {
                        $('#open-create-editor').hide();
                    }
                    if (targetObject.parents('#manager-panel').length === 0) {
                        var userPanel = $('#user-panel-controls'),
                            managerPanel = $('.manager_panel');
                        var scopeMangerPanel = angular.element('#manager-panel').scope();
                        if (userPanel.is(':visible')) {
                            scopeMangerPanel.close();
                            userPanel.slideUp(300, function () {
                                managerPanel.removeClass('shadow');
                                scopeMangerPanel.activePanel = false;
                                scopeMangerPanel.$apply();
                            });
                        }
                    }
                    if ((targetObject.closest('.apps-panel').length === 0) && 
                        (targetObject.closest('.icon-nav-apps').length === 0)) {
                        var scopeAppsPanel = angular.element('.btn-apps-panel-handler').scope();
                        if (scopeAppsPanel) {
                            scopeAppsPanel.activePanel = false;
                            scopeAppsPanel.$apply();
                        }
                    }
                });
                element.on('keydown', function(e) {
                    var targetObject = $(e.target);
                    if (targetObject.closest('.notyfy_container').length === 0) {
                        $.notyfy.closeAll();
                    }
                });
            }
        };
    });