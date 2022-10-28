'use strict';

angular.module('blApp.dataSense.controllers')
    .controller('AddNewWidgetController',
    ['$scope', '$rootScope', '$http', '$uibModalInstance', '$timeout', '$uibModal',
        'widgetUtilService', 'selectedWidget', 'notifyService', 'url',
        function ($scope, $rootScope, $http, $uibModalInstance, $timeout, $uibModal,
                  widgetUtilService, selectedWidget, notifyService, url) {
            var inputJson = {};
            $scope.widgetInfo = {};
            $scope.widgetInfo.widgetTitle = '';
            $scope.widgetInfo.widgetTitleShow = true;
            $scope.widgetInfo.selectedWidgetType = 'Timeline';
            $scope.attributes = {};
            $scope.alerts = [];
            $scope.isEditMode = selectedWidget ? true : false;
            $scope.submitted = false;
            $scope.imageUploadStatus = false;
            $scope.imageShowMessage = false;

            $scope.isAggregateFormOpen = false;
            $scope.hasAggregateOptions = false;

            $scope.initAttributes = function() {
                $scope.attributes.groupDimension = widgetUtilService.getGroupDimension();
                $scope.attributes.timelineGroupDimension = widgetUtilService.getTimelineGroupDimension();
                $scope.attributes.pivotDimension = widgetUtilService.getPivotDimension();
                $scope.attributes.showUpTo = widgetUtilService.getShowUpTo();
                $scope.attributes.orientation = widgetUtilService.getOrientation();
                $scope.attributes.equivType = widgetUtilService.getEquivalenciesType();
                $scope.attributes.boilerType = widgetUtilService.getBoilerplatesType();
                $scope.attributes.rowsPerTable = widgetUtilService.getRowsPerTable();
                $scope.attributes.aggregateOptions = widgetUtilService.getAggregateOptions();
                $scope.attributes.kpiSummaryMethod = widgetUtilService.getKpiSummaryMethod();
            };

            $scope.getSelectedWidgetType = function () {
                var widgetTypes = ['timeline', 'pie', 'bar', 'table', 'image', 'equivalencies', 'kpi', 'boilerplate'];
                var selectedWidgetType = '';
                angular.forEach(widgetTypes, function (type) {
                    if ($scope.widgetInfo[type].isSelected) {
                        selectedWidgetType = type;
                    }
                });
                //Capitalize first letter
                return [selectedWidgetType.charAt(0).toUpperCase(), selectedWidgetType.slice(1)].join('');
            };

            $scope.initTimelineForm = function(initData) {
                initData = initData || {};

                var groupDimension = initData.groupDimension ? {
                    id: '',
                    name: initData.groupDimension,
                    value: initData.groupDimension
                } : null;

                $scope.widgetInfo.timeline = {
                    metric: initData.metric,
                    compareMetric: initData.compareMetric,
                    groupDimension: groupDimension,
                    compareAsBar: initData.compareAsBar,
                    drillDown: initData.drillDown,
                    singlePointAggregation: initData.singlePointAggregation
                };

                if (initData) {
                    $scope.widgetInfo.timeline.isSelected = initData.type === 'Timeline';
                }
            };

            $scope.initPieForm = function(initData) {
                initData = initData || {};

                var groupDimension = initData.groupDimension ? {
                    id: '',
                    name: initData.groupDimension,
                    value: initData.groupDimension
                } : null;

                $scope.widgetInfo.pie = {
                    metric: initData.metric,
                    groupDimension: groupDimension,
                    customGroupDimension: initData.customGroupDimension || {},
                    showUpTo: initData.showUpTo,
                    drillDown: initData.drillDown
                };

                if (typeof $scope.widgetInfo.pie.showUpTo !== 'undefined' && $scope.widgetInfo.pie.showUpTo !== null) {
                    $scope.widgetInfo.pie.showUpTo = $scope.widgetInfo.pie.showUpTo.toString();
                }

                if (initData) {
                    $scope.widgetInfo.pie.isSelected = initData.type === 'Pie';
                }
            };

            $scope.initBarForm = function(initData) {
                initData = initData || {};

                var groupDimension = initData.groupDimension ? {
                    id: '',
                    name: initData.groupDimension,
                    value: initData.groupDimension
                } : null;

                $scope.widgetInfo.bar = {
                    metric: initData.metric,
                    groupDimension: groupDimension,
                    customGroupDimension: initData.customGroupDimension || {},
                    pivotDimension: initData.pivotDimension,
                    drillDown: initData.drillDown,
                    singlePointAggregation: initData.singlePointAggregation
                };

                if (initData) {
                    $scope.widgetInfo.bar.isSelected = initData.type === 'Bar';
                }
            };

            $scope.initTableForm = function(initData) {
                initData = initData || {};

                var groupDimension = initData.groupDimension ? {
                    id: '',
                    name: initData.groupDimension,
                    value: initData.groupDimension
                } : null;

                $scope.widgetInfo.table = {
                    displayedColumns: initData.displayedColumns || [{value: ''}],
                    groupDimension: groupDimension,
                    customGroupDimension: initData.customGroupDimension || {},
                    rowsPerTable: initData.rowsPerTable ? initData.rowsPerTable.toString() : null,
                    drillDown: initData.drillDown
                };

                if (initData) {
                    $scope.widgetInfo.table.isSelected = initData.type === 'Table';
                }
            };

            $scope.initImageForm = function(initData) {
                initData = initData || {};

                $scope.widgetInfo.image = {
                    imageUrl: initData.imageUrl,
                    fileReceived: initData.fileReceived || false,
                    drillDown: initData.drillDown
                };

                if (initData) {
                    $scope.widgetInfo.image.isSelected = initData.type === 'Image';
                }
            };

            $scope.initBoilerplateForm = function(initData) {
                initData = initData || {};

                // Setting up boilerplate initial data
                $scope.widgetInfo.boilerplate = {
                    boilerplateType: initData.boilerplateType,
                    boilerplateSystemPower: initData.boilerplateSystemPower,
                    boilerplateCommissioning: initData.boilerplateCommissioning,
                    boilerplateLocation: initData.boilerplateLocation,
                    lastConnected: initData.lastConnected
                };

                if (initData) {
                    $scope.widgetInfo.boilerplate.isSelected = initData.type === 'Boilerplate';
                }
            };

            $scope.clearFileReceivedFlg = function(initData) {
                $scope.widgetInfo.image.fileReceived = false;
            };

            $scope.onFlowFileSuccess = function(data) {
                var result = JSON.parse(data);
                if (result.success === 1) {
                    $scope.widgetInfo.image.imageUrl = result.message.sourceCDNURL;
                    $scope.widgetInfo.image.fileReceived = true;
                }
                $scope.imageUploadStatus = false;
            };

            $scope.onFlowFileError = function(data) {
                var result = JSON.parse(data);
                console.log('---- Failed upload image ----');
                console.log(result.message);
                $scope.imageUploadStatus = false;
                $scope.imageErrorMessage = 'Failed upload image';
                $scope.imageShowMessage = true;
            };

            $scope.onFlowFilesubmitted = function() {
                var imageObject = $('.flow-container').scope().$flow;
                var imageSize = imageObject.files[0].size;
                if (imageSize > 1024000) {
                    $scope.imageErrorMessage = 'Maximum size is 1M Bytes';
                    $scope.imageShowMessage = true;
                } else {
                    $scope.imageUploadStatus = true;
                    imageObject.upload();
                }

            };

            $timeout(function() {
                $('.flow-container').scope().$flow.opts.target = url.hostName() + '/general/assets/dashboard/' +
                $rootScope.selectedDashboard._id;
            }, 500);

            $scope.initEquivalenciesForm = function(initData) {
                initData = initData || {};

                $scope.widgetInfo.equivalencies = {
                    metric: initData.metric,
                    orientation: initData.orientation,
                    equivType: initData.equivType,
                    showAllTime: initData.showAllTime,
                    co2Kilograms: initData.co2Kilograms,
                    greenhouseKilograms: initData.greenhouseKilograms,
                    drillDown: initData.drillDown
                };

                if (initData) {
                    $scope.widgetInfo.equivalencies.isSelected = initData.type === 'Equivalencies';
                }
            };

            $scope.initKpiForm = function(initData) {
                initData = initData || {};

                $scope.widgetInfo.kpi = {
                    summaryMethod: initData.summaryMethod,
                    metric: initData.metric,
                    label: initData.label,
                    compareMetric: initData.compareMetric,
                    compareLabel: initData.compareLabel
                };

                if (initData) {
                    $scope.widgetInfo.kpi.isSelected = initData.type === 'Kpi';
                }

            };

            $scope.clearFileReceivedFlg = function(initData) {
                $scope.widgetInfo.image.fileReceived = false;
            };

            $scope.onFlowFileSuccess = function(data) {
                var result = JSON.parse(data);
                if (result.success === 1) {
                    $scope.widgetInfo.image.imageUrl = result.message.sourceCDNURL;
                    $scope.widgetInfo.image.fileReceived = true;
                }
            };

            $timeout(function() {
                $('.flow-container').scope().$flow.opts.target = url.hostName() + '/general/assets/dashboard/'
                + $rootScope.selectedDashboard._id;
            }, 500);

            $scope.addTableColumnsField = function ($event) {
                $scope.widgetInfo.table.displayedColumns.push({
                    value: ''
                });
                $event.preventDefault();
            };

            $scope.addNewWidget = function(form) {

                $scope.submitted = true;
                if (!$rootScope.Dsmodifyable) {
                    notifyService.errorNotify('Dashboard is locked. Therefore you don\'t have permission to update.');
                    return;
                }
                if (!$scope.checkValidation(form)) { return; }

                inputJson = {
                    'type': $scope.getSelectedWidgetType(),
                    'title': $scope.widgetInfo.widgetTitle,
                    'titleShow': $scope.widgetInfo.widgetTitleShow
                };

                if (inputJson.type === 'Timeline') {
                    angular.extend(inputJson, $scope.widgetInfo.timeline);
                } else if (inputJson.type === 'Image') {
                    angular.extend(inputJson, $scope.widgetInfo.image);
                } else if (inputJson.type === 'Table') {
                    angular.extend(inputJson, $scope.widgetInfo.table);
                    inputJson.metric = null;
                    inputJson.compareMetric = null;
                    if ($scope.widgetInfo.table.displayedColumns.length > 0) {
                        inputJson.metric = $scope.widgetInfo.table.displayedColumns[0].value;
                    }
                    if ($scope.widgetInfo.table.displayedColumns.length > 1) {
                        inputJson.compareMetric = $scope.widgetInfo.table.displayedColumns[1].value;
                    }
                } else if (inputJson.type === 'Bar') {
                    angular.extend(inputJson, $scope.widgetInfo.bar);
                } else if (inputJson.type === 'Pie') {
                    angular.extend(inputJson, $scope.widgetInfo.pie);
                } else if (inputJson.type === 'Equivalencies') {
                    angular.extend(inputJson, $scope.widgetInfo.equivalencies);
                } else if (inputJson.type === 'Kpi') {
                    angular.extend(inputJson, $scope.widgetInfo.kpi);
                } else if (inputJson.type === 'Boilerplate') {
                    angular.extend(inputJson, $scope.widgetInfo.boilerplate);
                    inputJson.boilerplateType = widgetUtilService.getBoilerplateTypeAsName(
                        $scope.widgetInfo.boilerplate.boilerplateType
                    );
                }

                if (inputJson.groupDimension) {
                    inputJson.groupDimension = inputJson.groupDimension.value;
                }

                // inputJson.isSelected won't go to backend
                delete inputJson.isSelected;

                $uibModalInstance.close(inputJson);
            };

            $scope.cancel = function() {
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

            $scope.checkValidation = function(form) {
                var frmValid = form.widgetTitle.$valid,
                    selectedWidgetType = $scope.getSelectedWidgetType().toLowerCase();

                if (selectedWidgetType === 'image' && !$scope.widgetInfo.image.fileReceived) {
                    return false;
                }
                if (selectedWidgetType === 'table') {
                    angular.forEach($scope.widgetInfo.table.displayedColumns, function(column, idx) {
                        frmValid = frmValid && (column.value !== '');
                    });
                }
                if (!$rootScope.Dsmodifyable) {
                    return false;
                }
                angular.forEach(form, function(instance, attrName) {
                    if (attrName.substr(0, selectedWidgetType.length) === selectedWidgetType) {
                        frmValid = frmValid && instance.$valid;
                    }
                });

                return frmValid;
            };

            $scope.chooseWidgetType = function (widgetType) {
                setTimeout(function () {
                    $scope.widgetInfo.selectedWidgetType = widgetType;
                    $scope.hasAggregateOptions = (widgetType === 'Timeline' || widgetType === 'Bar');
                }, 0);
            };

            $scope.initFormValidation = function (widgetType) {
                // According to the selected widget type, set hasAggregateOptions
                // so that the advanced options link to be enabled/disabled
                $scope.widgetInfo.selectedWidgetType = widgetType;
                $scope.hasAggregateOptions = (widgetType === 'Timeline' || widgetType === 'Bar');

                $scope.submitted = false;
                return;
            };

            // Show/Hide advanced form which is used for single-point aggregate options
            $scope.toggleAdvancedForm = function (status) {
                // Show/Hide advanced form
                if (!$rootScope.Dsmodifyable) {
                    notifyService.errorNotify('Dashboard is locked. Therefore you don\'t have permission to update.');
                    return false;
                }
                $scope.isAggregateFormOpen = !$scope.isAggregateFormOpen;

                var widgetInfo;
                if ($scope.widgetInfo.selectedWidgetType === 'Timeline') {
                    widgetInfo = $scope.widgetInfo.timeline;
                } else if ($scope.widgetInfo.selectedWidgetType === 'Bar') {
                    widgetInfo = $scope.widgetInfo.bar;
                }

                if (status === 'opening') {
                    // Load aggregate options which is currently saved in widget info
                    // Seed the option values into the form
                    angular.forEach($scope.attributes.aggregateOptions, function (target, index) {
                        target.isSelected = false;
                        target.title = '';
                        angular.forEach(widgetInfo.singlePointAggregation, function(source, idx) {
                            if (target.function === source.function) {
                                target.isSelected = true;
                                target.title = source.title;
                            }
                        });
                    });
                } else if (status === 'saving') {
                    // Save the options which are selected by user into the widget info
                    widgetInfo.singlePointAggregation = [];
                    angular.forEach($scope.attributes.aggregateOptions, function (option, index) {
                        if (option.isSelected) {
                            if (option.title === '') {
                                option.title = option.function;
                            }
                            widgetInfo.singlePointAggregation.push(option);
                        }
                    });
                }
            };

            $scope.changeGroupDimension = function() {
                var widgetInfo;
                if ($scope.widgetInfo.selectedWidgetType === 'Timeline') {
                    widgetInfo = $scope.widgetInfo.timeline;
                } else if ($scope.widgetInfo.selectedWidgetType === 'Bar') {
                    widgetInfo = $scope.widgetInfo.bar;
                } else if ($scope.widgetInfo.selectedWidgetType === 'Pie') {
                    widgetInfo = $scope.widgetInfo.pie;
                } else if ($scope.widgetInfo.selectedWidgetType === 'Table') {
                    widgetInfo = $scope.widgetInfo.table;
                }

                if (widgetInfo.groupDimension.value === '--Custom--') {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'modalCustomDimension.html',
                        controller: 'CustomDimensionController',
                        windowClass: 'bl-modal-custom-dimension-wrapper',
                        resolve: {
                            'selectedWidget': function () {
                                return widgetInfo;
                            },
                            'widgetType': function () {
                                return $scope.widgetInfo.selectedWidgetType;
                            }
                        }
                    });

                    modalInstance.result.then(function(inputJson) {
                        widgetInfo.customGroupDimension = inputJson;
                    }, function() {
                        console.log('[DATA SENSE] Custom Dimension Modal Dismissed.');
                    });
                }

            };

            $scope.initAttributes();
            $scope.initTimelineForm(selectedWidget);
            $scope.initPieForm(selectedWidget);
            $scope.initBarForm(selectedWidget);
            $scope.initTableForm(selectedWidget);
            $scope.initImageForm(selectedWidget);
            $scope.initEquivalenciesForm(selectedWidget);
            $scope.initKpiForm(selectedWidget);
            $scope.initBoilerplateForm(selectedWidget);

            if (selectedWidget) {
                var widgetType = selectedWidget.type.toLowerCase();

                $scope.widgetInfo.widgetTitle = selectedWidget.title;
                $scope.widgetInfo.widgetTitleShow = selectedWidget.titleShow;
                $scope.widgetInfo[widgetType].isSelected = true;

                $scope.hasAggregateOptions = (widgetType === 'timeline' || widgetType === 'bar');
            }
        }
    ]);
