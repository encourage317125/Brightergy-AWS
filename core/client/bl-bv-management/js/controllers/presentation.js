'use strict';

angular.module('blApp.management.controllers').controller(
    'PresentationPanelController',
    ['$scope', '$rootScope', '$compile', '$http', '$timeout', '$sce', 'widgetService',
        'presentationService', 'projectService', 'notifyService',
        function ($scope, $rootScope, $compile, $http, $timeout, $sce, widgetService,
                  presentationService, projectService, notifyService) {

            $rootScope.viewPresentationPanel = false;
            $rootScope.viewedGeneralPresentationPanel = true;

            $scope.goAdvancedPanel = function(){
                $scope.viewedGeneralPresentationPanel = false;
            };

            $scope.goGeneralPanel = function(){
                $scope.viewedGeneralPresentationPanel = true;
            };

            $scope.closePresentationPanel = function(){
                $rootScope.viewPresentationPanel = false;
            };

            $rootScope.goPresentation = function () {
                if ($('.handle-button2').hasClass('handle-selected2')) {
                    $('.handle-button2').click();
                }

                $('#presentationPanel .fontSelect').each(function () {
                    $(this).attr('fontpicker', 'fontpicker');
                    var htmlFont = $(this).parent().html();
                    $(this).parent().html($compile(htmlFont)($scope));
                });

                $('.presentationPanel .color_pickers').each(function () {
                    $(this).attr('colorpicker', 'colorpicker');
                    var htmlColor = $(this).parent().html();
                    $(this).parent().html($compile(htmlColor)($scope));
                });

                $('.presentationPanel .previewPanelLogo').each(function () {
                    var logoURL = $rootScope.tempPresentationDetails.Logo;
                    $(this).attr('src', logoURL? logoURL: '/assets/img/no-logo-prepanel.png');
                    $('.tempLogoName').html('My logo ' + (logoURL? logoURL.substring(logoURL.lastIndexOf('/')+1): ''));
                });

                $('.presentationPanel .previewPanelBG').each(function () {
                    var bgURL = $rootScope.tempPresentationDetails.parameters.backgroundImage;
                    $(this).attr('src', bgURL? bgURL: '/assets/img/no-logo-prepanel.png');
                });

                $rootScope.viewPresentationPanel = true;
                $rootScope.viewedGeneralPresentationPanel = true;

            };

            $rootScope.savePresentDetail = function () {
                if ($rootScope.currentUser.role !== 'BP' && $rootScope.tempPresentationDetails.bpLock) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                presentationService.savePresentation(JSON.stringify($rootScope.tempPresentationDetails), $rootScope);

                $rootScope.viewPresentationPanel = false;
            };
        }
    ]);