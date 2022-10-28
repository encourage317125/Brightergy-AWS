'use strict';

angular.module('blApp.dataSense.controllers')
    .controller('ExportWidgetController',
    ['$scope', '$uibModalInstance',
        function ($scope, $uibModalInstance) {
            $scope.wrapper = {
                exportFormat: 'pdf',
                exportDataType: {
                    data: true,
                    chart: true
                }
            };

            $scope.setExportFormat = function(format) {
                $scope.wrapper.exportFormat = format;
                if (format === 'csv') {
                    $scope.wrapper.exportDataType.chart = false;
                }
            };

            $scope.exportWidget = function(operation) {
                var inputJson = {
                    'exportFormat': $scope.wrapper.exportFormat,
                    'exportDataType': $scope.wrapper.exportDataType,
                    'operation': operation
                };

                $uibModalInstance.close(inputJson);
            };
        }
    ]);
