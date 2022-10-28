angular.module('blApp.components.services')
    .service('projectService', ['$http', '$timeout', 'presentationService', '$rootScope',
        function($http, $timeout, presentationService, $rootScope) {
            this.getProjectsInfo = function(scope) {
                var apiUrl = '/salesforce/projects';
                $http.get(apiUrl).then(function(resp) {
                    scope.allProjects = resp;
                    console.log('Projects');
                    console.log(scope.allProjects);
                    if (scope.tempPresentationDetails) {
                        if (scope.tempPresentationDetails.IsNewPresentation) {
                            var project = $.grep(scope.allProjects, function (e) {
                                return e.projectId === scope.tempPresentationDetails.projectId;
                            })[0];
                            notyfy({
                                text: '<strong>Because there are no current presentations,' +
                                ' one has been created for the ' + project.name +
                                ' project.</strong><br><div class="click-close">{Click this bar to Close}',
                                type: 'success',
                                dismissQueue: true
                            });
                            angular.copy(scope.presentationDetails, scope.tempPresentationDetails);
                            presentationService.updatePresentation(scope.tempPresentationDetails, scope);
                        }
                    }
                });
            };
        }
    ]);
