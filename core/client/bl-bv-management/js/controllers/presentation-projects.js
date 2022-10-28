'use strict';
angular.module('blApp.management.controllers').controller('PresentationProjectsController', [
    '$scope',
    '$rootScope',
    '$q',
    '$compile',
    '$http',
    '$timeout',
    'projectService',
    'presentationService',
    'widgetService',
    'toggleService',
    'UserService',
    'notifyService',
    function ($scope, $rootScope, $q, $compile, $http, $timeout, projectService, presentationService,
              widgetService, toggleService, UserService, notifyService) {
            $rootScope.allPresentations = renderPresentations;
            $scope.presentationTemplates = renderPresentTemplates;
            console.log(renderPresentTemplates);
            $scope.showCreatePanel = false;
            $scope.presentationType = 0;
            $scope.presentationObject = {};
            
            $scope.getPresentations = function () {
                presentationService.getPresentationTemplates($scope);
                presentationService.getAllPresentations().then(function (presentations) {
                    $rootScope.allPresentations = presentations;
                });
            };

            $scope.initPresentations = function () {
                var isPresentationExist = false;
                angular.forEach($rootScope.allPresentations, function(p) {
                    if($rootScope.urlSelectedPresentationId === p._id ) {
                        isPresentationExist = true;
                        $rootScope.presentationId = p._id;
                    }
                });
                if (!isPresentationExist) {
                    angular.forEach($rootScope.allPresentations, function(p) {
                        if($rootScope.managementId === p._id ) {
                            isPresentationExist = true;
                            $rootScope.presentationId = p._id;
                        }
                    });
                    /*if ( isPresentationExist ) {
                        $rootScope.presentationId = $rootScope.presentationId;
                    } else */if ($rootScope.allPresentations.length) {
                        $rootScope.presentationId = $rootScope.allPresentations[0]._id;
                    }
                    $rootScope.routeToPresentation($rootScope.presentationId, true);
                    $scope.editPresentation($rootScope.presentationId, true);
                } else {
                    $scope.editPresentation($rootScope.presentationId, true);
                }
            };

            $rootScope.$on('changePresentation', function() {
                presentationService.getPresentationTemplates($scope);
            });

            $scope.createPresentation = function () {
                if (!$scope.templateId && $scope.presentationType === 1) {
                    notifyService.errorNotify('Please click a presentation template');
                    return false;
                }

                var inputJson;
                if ($scope.presentationType === 1) {
                    inputJson = {
                        'name' : $scope.presentationObject.name,
                        'templateId' : $scope.templateId,
                        'bpLock' : $scope.presentationObject.bpLock
                    };
                } else {
                    inputJson = {
                        'name' : $scope.presentationObject.name,
                        'bpLock' : $scope.presentationObject.bpLock
                    };
                }
                toggleService.showPleaseWait();
                presentationService
                    .createPresentation(inputJson)
                    .then(function(newPrst) {
                        $scope.getPresentations();
                        $rootScope.presentationId = newPrst;
                        //$scope.editPresentation(result.data.message, false);
                        $rootScope.routeToPresentation($rootScope.presentationId, true);
                        $scope.showCreatePanel = false;
                    });
            };

            $scope.editPresentation = function (presentationId, toggle) {
                $rootScope.presentationId = presentationId;
                if (toggle) {
                    toggleService.showPleaseWait();
                } 
                $q.all([
                    presentationService.getPresentationInfo(presentationId, $rootScope),
                    widgetService.getWidgetsInfo(presentationId, false, $rootScope),
                    widgetService.getTimelineInfo(presentationId, 'delete', $compile,  $rootScope, true, null)
                ]).then(function(values) {
                    $rootScope.$broadcast('PresentationDetailsLoaded');
                    toggleService.hidePleaseWait();
                }, function() {
                    toggleService.hidePleaseWait();
                });
            };

            $scope.deletePresentation = function (presentationId) {
                console.log(presentationId);
                toggleService.showPleaseWait();
                presentationService.deletePresentation(presentationId).then(function () {
                    if (presentationId === $rootScope.presentationId) {
                        presentationService.getLastPresentation().then(function (data) {
                            $scope.getPresentations();
                            $rootScope.presentationId = data;
                            //$scope.editPresentation(result.data.message, false);
                            $rootScope.routeToPresentation($rootScope.presentationId, true);
                        });
                    } else {
                        $('.presentation-'+presentationId).slideUp('slow');
                        $timeout(function() {
                            toggleService.hidePleaseWait();
                        }, 500);
                        // Remove the presentation from $rootScope.allPresentations so that
                        // it doesn't hold removed presentation
                        angular.forEach($rootScope.allPresentations, function (ptElement, pIdx) {
                            if (ptElement._id === presentationId) {
                                $rootScope.allPresentations.splice(pIdx, 1);
                            }
                        });
                    }
                });
            };

            $scope.openTemplateDlg = function () {
                $('#template_dlg').modal();
            };

            $scope.toggleDeletePresentation = function (presentation, showType) {
                if (presentation.bpLock) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                var animationAction;
                if(showType === 'show') {
                    animationAction = 'flipInX';
                    presentation.toggleDelete = true; 
                }  else {
                    animationAction = 'fadeOutLeftBig';
                    animationAction = 'flipInX';
                    presentation.toggleDelete = false; 
                }

                $('.presentation-'+presentation._id+' .delete-box')
                    .removeClass(animationAction+' animated')
                    .addClass(animationAction+' animated')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $(this).removeClass(animationAction+' animated');
                    });
            };

            $scope.backList = function () {
                $scope.showCreatePanel = false;
            };

            $scope.goCreatePresentation = function () {
                $scope.showCreatePanel = true;
                $scope.templateId = '';
            };

            $scope.checkBlankCanvas = function () {
                $scope.presentationType = 0;
            };

            $scope.checkPresentationTemplate = function () {
                $scope.presentationType = 1;
            };

            $scope.setTemplateId = function (template) {
                $scope.templateId = template._id;
                $scope.presentationObject.name = template.name;
                angular.forEach($scope.presentationTemplates, function(templateObj, index){
                    templateObj.active = templateObj._id === template._id;
                });
                console.log($scope.presentationTemplates);
            };

            $scope.$on('renderPresentation', function(message, options) {
                //Save the last edited presentation into User info.
                if( options.presentationId !== $rootScope.currentUser.lastEditedPresentation ) {
                    $rootScope.currentUser.previousEditedPresentation = $rootScope.currentUser.lastEditedPresentation;
                    $rootScope.currentUser.lastEditedPresentation = options.presentationId;
                    UserService.updateUser({user: $rootScope.currentUser});
                }
                $scope.editPresentation(options.presentationId, true);
            });

            $scope.initPresentations();
        }
    ]);