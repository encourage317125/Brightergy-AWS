angular.module('blApp.components.services')
    .service('presentationService', ['$http', 'utilService', 'toggleService', '$rootScope',
        function($http, utilService, toggleService, $rootScope) {
            this.getPresentationInfo = function (presentationId, scope) {
                var apiUrl = '/present/presentations/' + presentationId;
                return $http
                    .get(apiUrl)
                    .then(function (presentation) {
                        scope.tempPresentationDetails = angular.copy(presentation);
                        scope.presentationDetails = angular.copy(presentation);
                        scope.appName = scope.presentationDetails.name;
                        scope.retrieveAllImagesInFolder(scope.presentationId, 'presentation');
                        if (scope.presentationDetails.bpLock){
                            $rootScope.Bvmodifyable = false;
                        } else {
                            $rootScope.Bvmodifyable = true;
                        }
                        return presentation;
                    });
            };

            this.savePresentation = function(presentationDetails, scope) {
                console.log('Save Presentation');
                var details = JSON.parse(presentationDetails);
                var apiUrl = '/present/presentations/' + details._id;
                var inputJson = presentationDetails;
                $http
                    .put(apiUrl, inputJson)
                    .then(function(savedPresentation) {
                        console.log(savedPresentation);
                        scope.presentationDetails = angular.copy(savedPresentation);
                        scope.appName = savedPresentation.name;

                        // Replace the element details in $rootScope.allPresentations
                        // so that it updates the presentations panel
                        angular.forEach(scope.allPresentations, function (ptElement, pIdx) {
                            if (ptElement._id === savedPresentation._id) {
                                var paramsToChange = Object.keys(savedPresentation);
                                paramsToChange.forEach(function (param) {
                                    ptElement[param] = savedPresentation[param];
                                });
                            }
                        });

                        if (scope.presentationDetails.bpLock) {
                            $rootScope.Bvmodifyable = false;
                        } else {
                            $rootScope.Bvmodifyable = true;
                        }

                        scope.$broadcast('changePresentation', {});
                    });
            };

            this.updatePresentation = function(presentation, scope) {
                console.log('Save Presentation');
                var apiUrl = '/present/presentations/' + presentation._id;
                return $http
                    .put(apiUrl, presentation)
                    .then(function(updated) {
                        scope.presentationDetails = angular.copy(updated);
                        scope.appName = updated.name;

                        // Replace the element details in $rootScope.allPresentations
                        // so that it updates the presentations panel
                        angular.forEach(scope.allPresentations, function (prst) {
                            if (prst._id === updated._id) {
                                angular.extend(prst, updated);
                            }
                        });

                        if (scope.presentationDetails.bpLock) {
                            $rootScope.Bvmodifyable = false;
                        } else {
                            $rootScope.Bvmodifyable = true;
                        }

                        scope.$broadcast('changePresentation', {});
                        return updated;
                    });
            };

            this.getPresentationTemplates = function (scope) {
                var apiUrl = '/present/presentations/templates';
                $http
                    .get(apiUrl)
                    .then(function (tpls) {
                        scope.presentationTemplates = tpls;
                        console.log('Presentation Templates');
                        console.log(scope.presentationTemplates);
                        //scope.$apply(); Need recheck
                        return tpls;
                    });
            };

            /**
             * Call api to get all presentations
             * API: /userapi/presentations
             * Method: POST
             * Params: name, templateId
             *
             */
            this.getAllPresentations = function () {
                var apiUrl = '/present/presentations';
                return $http.get(apiUrl);
            };

            /**
            * Call api to create presentation
            * API: /bv/presentationapi
            * Method: POST
            * Params:
            *
            */
            this.createPresentation = function(presentation) {
                var apiUrl = '/present/presentations';
                return $http.post(apiUrl, presentation);
            };

            /**
            * Call api to remove presentation
            * API: /bv/presentationapi/presentationId
            * Method: DELETE
            * Params:
            *
            */
            this.deletePresentation = function(presentationId) {
                var apiUrl = '/present/presentations/' + presentationId;
                return $http.delete(apiUrl);
            };

            /**
            * Call api to get last presentation
            * API: /bv/presentationapi/lasteditedpresentationid
            * Method: GET
            * Params: 
            *   
            */ 
            this.getLastPresentation = function() {
                var apiUrl = '/present/presentations/last';
                return $http.get(apiUrl);
            };

            this.clonePresentation = function (srcPresentationId) {
                var apiUrl = '/present/presentations/clone/' + srcPresentationId;

                return $http.post(apiUrl);
            };
        }
    ]);
