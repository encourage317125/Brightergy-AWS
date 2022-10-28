'use strict';
angular.module('blApp.dataSense.controllers')
    .controller('DashboardUpdateController', 
        ['$scope', '$uibModalInstance', '$timeout', 'allCollections', 'selectedDashboard', 'notifyService',
        function ($scope, $uibModalInstance, $timeout, allCollections, selectedDashboard, notifyService) {

            $scope.dashboardWrapper = {
                'chooseCollection' : 1
            };
            $scope.isEditMode = selectedDashboard ? true : false;
            $scope.starterDashboard = true;
            $scope.alerts = [];
            $scope.allCollections = allCollections;
            $scope.collectionName = '';
            $scope.dashboardWrapper.existingCollection = allCollections.length>0 ? allCollections[0]: '';
                
            $scope.apply = function () {
                var inputJson = {};

                if ( selectedDashboard && selectedDashboard.bpLock && $scope.dashboardWrapper.bpLock) {
                    notifyService.errorNotify('Dashboard is locked. You don\'t have permission to update.');
                    return false;
                }

                if ($scope.isEditMode) {
                    inputJson.isEditMode = true;
                    inputJson.dashboardObj = angular.copy(selectedDashboard);
                    inputJson.dashboardObj.title = $scope.dashboardWrapper.title;
                    inputJson.dashboardObj.collections = $scope.dashboardWrapper.chooseCollection ? 
                        [$scope.dashboardWrapper.existingCollection]: [$scope.dashboardWrapper.collectionName];
                    inputJson.dashboardObj.isPrivate = $scope.dashboardWrapper.isPrivate;
                    inputJson.dashboardObj.default = $scope.dashboardWrapper.default;
                    inputJson.dashboardObj.bpLock = $scope.dashboardWrapper.bpLock;
                    inputJson.oldCollectionName = selectedDashboard.collections[0];
                } else {
                    inputJson.isEditMode = false;
                    inputJson.dashboardObj = {
                        'title': $scope.dashboardWrapper.title,
                        'collections': $scope.dashboardWrapper.chooseCollection ? 
                            [$scope.dashboardWrapper.existingCollection]: [$scope.dashboardWrapper.collectionName],
                        'isPrivate': $scope.dashboardWrapper.isPrivate,
                        'default': $scope.dashboardWrapper.default,
                        'bpLock': $scope.dashboardWrapper.bpLock
                    };
                }
                if (!$scope.checkValidation(inputJson)) { return; }

                $uibModalInstance.close(inputJson);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
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
                if (isEmpty(data.dashboardObj.title)) {
                    $scope.addAlert('Please enter Dashboard Title');
                }
                if (isEmpty(data.dashboardObj.collections[0]) || data.dashboardObj.collections.length < 1) {
                    $scope.addAlert('Please enter Dashboard Collection');
                }
                $timeout(function() {
                    $scope.clearAlert();
                }, 4000);
                if ($scope.alerts.length > 0) {
                    return false;
                }
                return true;
            };

            if (selectedDashboard) {
                $timeout( function () {
                    $scope.dashboardWrapper.title = selectedDashboard.title;
                    $scope.dashboardWrapper.existingCollection =
                        (selectedDashboard.collections.length > 0) ? selectedDashboard.collections[0] : '';
                    $scope.dashboardWrapper.isPrivate = selectedDashboard.isPrivate;
                    $scope.dashboardWrapper.default = selectedDashboard.default;
                    $scope.dashboardWrapper.bpLock = selectedDashboard.bpLock;
                }, 1000);
            }

        }
    ]);
