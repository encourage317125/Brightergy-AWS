'use strict';
angular.module('blApp.dataSense.controllers')
    .controller('DashboardSelectorController',
        ['$scope', '$rootScope', '$timeout', 'dashboardService', 'presentationService', 'toggleService',
        function ($scope, $rootScope, $timeout, dashboardService, presentationService, toggleService) {

            var getDashboardsByCollection = function (collectionName) {
                $scope.dashboards = $rootScope.allDashboards[collectionName];
            };

            $scope.dashboard = {
                name: '',
                collections: [],
                isPrivate: false
            };

            $scope.dashboards = [];
            $scope.alerts = [];

            $scope.isPanelShown = false;
            $scope.formShown = false;

            $scope.toggleDropdownPanel = function () {
                $scope.isPanelShown = !$scope.isPanelShown;
            };

            $scope.toggleForm = function () {
                console.log('toggleForm clicked');
                $scope.formShown = !$scope.formShown;
            };

            $scope.applyAddedDashboard = function(data) {
                var collectionMatched = false;
                var newDashboard = data.dashboard;
                newDashboard.modifyable = true;

                angular.forEach($rootScope.allDashboards, function (collection, key) {
                    if (key === newDashboard.collections[0]) {
                        collection.push(newDashboard);
                        $rootScope.dashboards[$rootScope.dashboards.length] = collection[collection.length - 1];
                        collectionMatched = true;
                    }
                });
                if (!collectionMatched) {
                    $rootScope.collectionNames.push(newDashboard.collections[0]);
                    $rootScope.allDashboards[newDashboard.collections[0]] = [newDashboard];
                    $rootScope.dashboards[$rootScope.dashboards.length] =
                        $rootScope.allDashboards[newDashboard.collections[0]][0];
                }

                // add dashboard to ordered list
                angular.forEach($rootScope.orderedDashboards, function (collection, key) {
                    if (collection.text === newDashboard.collections[0]) {
                        collection.dashboards.push({
                            'text': newDashboard.title, 
                            'collection': false, 
                            'dashboard': newDashboard    
                        });
                        collectionMatched = true;
                    }
                });
                if (!collectionMatched) {
                    var newCollection = {
                        'text': newDashboard.collections[0], 
                        'collection': true, 
                        'dashboards': []
                    };
                    newCollection.dashboards.push({
                        'text': newDashboard.title, 
                        'collection': false, 
                        'dashboard': newDashboard
                    });
                    $rootScope.orderedDashboards.push(newCollection);
                }

                $scope.$emit('updateUserCollections', {});

                $scope.goToDashboard($rootScope.dashboards[$rootScope.dashboards.length - 1], true);
            };

            $scope.addDashboard = function() {
                if (!$scope.checkValidation($scope.dashboard)) { return; }
                toggleService.togglePleaseWait();
                dashboardService.createDashboard($scope.dashboard).then(function (newDashboard) {
                    //format new dialog
                    $scope.dashboard.name = '';                   
                    $rootScope.selectedDashboard = newDashboard;
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                    toggleService.togglePleaseWait();
                    
                    $scope.toggleForm();
                    $scope.toggleDropdownPanel();

                    $scope.applyAddedDashboard({dashboard: newDashboard});
                });
            };

            $scope.addAlert = function(message) {
                $scope.alerts.push({ type: 'danger', msg: message });
            };

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            $scope.clearAlert = function () {
                $scope.alerts.splice(0, $scope.alerts.length);
            };

            $scope.checkValidation = function(data) {
                var isEmpty = function (v) {
                    if (typeof v === 'undefined' || v === null || v === '') {
                        return true;
                    }
                    return false;
                };
                $scope.clearAlert();
                if (typeof data === 'undefined' || data === null) {
                    return false;
                }
                if (isEmpty(data.title)) {
                    $scope.addAlert('Please enter Dashboard Title');
                }
                $timeout(function() {
                    $scope.clearAlert();
                }, 4000);
                if ($scope.alerts.length > 0) {
                    return false;
                }
                return true;
            };

            $rootScope.$on('selectedDashboardChanged', function() {
                getDashboardsByCollection($rootScope.selectedDashboard.collections.join(''));
                $scope.dashboard.collections = $rootScope.selectedDashboard.collections;
            });
            
        }
    ]);
