'use strict';

angular.module('blApp.dataSense.controllers')
    .controller('SegmentController',
        ['$scope', '$rootScope', '$timeout', '$q', '$uibModal', 'dashboardService', 'SegmentService', 'TagService',
            'toggleService', 'tagFactory',
        function ($scope, $rootScope, $timeout, $q, $uibModal, dashboardService, SegmentService, TagService,
            toggleService, tagFactory) {

            $scope.dashboardSegments = [];
            $scope.isAllSegments = false;
            $scope.requestQueue = {};

            $scope.userDataSource = [];

            // Open segment CRUD modal dialog and process the CRUD operation
            $scope.openSegmentDialog = function (segmentId, evt) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'modalSegmentUpdate.html',
                    controller: 'SegmentUpdateController',
                    windowClass: 'bl-modal-segment-update-wrapper',
                    resolve: {
                        'segmentId': function() {
                            return segmentId;
                        },
                        'dashboardSegments': function() {
                            return $scope.dashboardSegments;
                        }
                    }
                });

                // Remove animation and position the modal below segment button
                modalInstance.opened.then(function() {
                    $timeout(function() {
                        var btnDom = $(evt.target).closest('li'),
                            modalDom = $('.bl-modal-segment-update-wrapper .modal-dialog'),
                            offset = btnDom.offset(),
                            marginTop =  parseFloat(modalDom.css('margin-top'));
                        offset.right = window.outerWidth - (offset.left + btnDom.outerWidth(true));
                        modalDom.css('position', 'fixed');
                        modalDom.css('top', offset.top + btnDom.outerHeight() - marginTop);
                        if(offset.right < modalDom.width()) {
                            modalDom.css('right', offset.right);
                        } else {
                            modalDom.css('left', offset.left);
                        }
                    });
                });

                modalInstance.result.then(function(inputJson) {
                    $scope.resetRequestQueue();
                    var newSegments= [inputJson.segment];
                    $scope.requestQueue.body = newSegments;
                    if (inputJson.isEditMode) {
                        $scope.requestQueue.method = 'PUT';
                    } else {
                        $scope.requestQueue.method = 'POST';
                    }
                    $scope.applySegmentPanel();
                }, function() {
                    console.log('[DATA SENSE] Dashboard Modal Dismissed.');
                });
            };
            /**
             * Update active/deactive status for event taget
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.resetRequestQueue = function() {
                $scope.requestQueue = {};
            };
            /**
             * Update active/deactive status for event taget
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.processRequestQueue = function() {
                var deferred = $q.defer();
                if ($scope.requestQueue.method === 'POST') {
                    SegmentService.createSegmentToDashboard($rootScope.selectedDashboard._id,
                        JSON.stringify($scope.requestQueue.body)).then(function (result) {
                        deferred.resolve(result);
                    }, function(error) {
                        deferred.reject(error);
                    });
                } else if($scope.requestQueue.method === 'PUT') {
                     SegmentService.updateSegmentToDashboard($rootScope.selectedDashboard._id,
                         JSON.stringify($scope.requestQueue.body)).then(function (result) {
                         deferred.resolve(result);
                     }, function(error) {
                        deferred.reject(error);
                     });
                } else {
                    SegmentService.deleteSegmentFromDashboard($rootScope.selectedDashboard._id,
                        JSON.stringify($scope.requestQueue.body)).then(function (result) {
                        deferred.resolve(result);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }

                return deferred.promise;
            };

            /**
             * Remove selected segment when click short remove icon based on TagService
             * @param {string} segmentId
             * @return {object}
             */
            $scope.removeSegment = function(segmentId) {
                console.log($scope.segments);
                if($scope.segments.length === 1 && $scope.userDataSource.length > 0) {
                    $scope.resetRequestQueue();
                    var newSegment = {
                        'id': segmentId,
                        'name': 'All Segments',
                        'tagBindings': []
                    };
                    angular.forEach($scope.userDataSource, function(tag, index){
                        if (tag && tag._id) {
                            newSegment.tagBindings.push({
                                id: tag._id,
                                tagType: tag.tagType
                            });
                        }
                    });
                    $scope.requestQueue.body = [newSegment];
                    $scope.requestQueue.method = 'PUT';
                    $scope.applySegmentPanel();
                } else {
                    $scope.resetRequestQueue();
                    var segmentIds = [segmentId];
                    $scope.requestQueue.body = segmentIds;
                    $scope.requestQueue.method = 'DELETE';
                    $scope.applySegmentPanel();
                }

            };

            /**
             * List dashboard segments based on TagService
             * @param {string}
             * @return {object}
             */
            $scope.listDashboardSegments = function() {
                return SegmentService
                    .getSegmentsByDashboard($rootScope.selectedDashboard._id)
                    .then(function(segments) {
                        $scope.dashboardSegments = segments;
                        $rootScope.selectedDashboard.segments = $scope.dashboardSegments;
                        return segments;
                    });
            };

            /**
             * Update segments in controlbar with changed segments
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.updateControlbarSegments = function(isInit) {
                var segments = $scope.dashboardSegments;
                var isAllSegment = $rootScope.selectedDashboard.isAllSegment;
                $scope.$emit('updateSegments', {'segments': segments, 'isAllSegment': isAllSegment, 'isInit': isInit});
            };

            /**
             * Update every widgets in dashboard by changed segments
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.updateWidgetBySegments = function() {
                $rootScope.$broadcast('changedSegmentOrDateRange',{});
            };

            /**
             * Update everything (including widget graph, controlbar segments, dashbaord datasources)
             * when click 'Apply' button on segment panel
             * @param {string}
             * @return {object}
             */
            $scope.applySegmentPanel = function() {
                toggleService.showPleaseWait();
                $scope.processRequestQueue().then(function(result) {
                    $scope.listDashboardSegments().then(function(result) {
                        $scope.resetRequestQueue();
                        $scope.updateControlbarSegments(true);
                        $scope.updateWidgetBySegments();
                    });
                },function(error) {
                    toggleService.hidePleaseWait();
                    console.log(error);
                });
            };

            /**
             * Get all accessible tags - used for all segments functionality
             * @param {string}
             * @return {object}
             */
            $scope.getAccessibleTagsByUser = function() {

                return TagService
                    .listAccessibleTagsByUser($rootScope.currentUser._id)
                    .then(function (tags) {
                        $scope.userDataSource = tags;
                        return tags;
                    });
            };

            /**
             * Auto add segment when don't have any tags for blank template dashboard
             * @param 
             * @return {object}
             */
            $scope.autoAddSegmentForNoneDefault = function() {
                var newAllSegment = {
                        'name': 'All Segments',
                        'tagBindings': []
                    };

                angular.forEach($scope.userDataSource, function(tag, index){
                    if (tag && tag._id) {
                        newAllSegment.tagBindings.push({
                            id: tag._id,
                            tagType: tag.tagType
                        });
                    }
                });

                $scope.resetRequestQueue();
                $scope.requestQueue.body = [newAllSegment];
                $scope.requestQueue.method = 'POST';
                $scope.applySegmentPanel();
            };

            /**
             * Auto add segement when don't have any tags
             * @param 
             * @return {object}
             */
            $scope.autoAddSegment = function() {
                var newSegments= [];
                angular.forEach($scope.userDataSource, function(tag, index){
                    $scope.tagBindings = [];
                    var newTag = {
                        'tagType': tag.tagType, 
                        'id': tag._id
                    };
                    $scope.tagBindings.push(newTag);
                    var newSegment = {
                        'name': tag.name,
                        'tagBindings': $scope.tagBindings
                    };
                    newSegments.push(newSegment);
                });
                
                $scope.requestQueue.body = newSegments;
                $scope.requestQueue.method = 'POST';
                $scope.applySegmentPanel();
            };

            /**
             * Entry point of this controller, will be bootstraped when dashboard change event triggered
             * @param {string}
             * @return {object}
             */
            $scope.init = function () {
                $scope
                    .listDashboardSegments()
                    .then(function(result) {
                        $scope.updateControlbarSegments(true);

                        if (!$rootScope.isViewer) {
                            $scope.getAccessibleTagsByUser().then(function(result) {
                            if($scope.dashboardSegments.length === 0 && $scope.userDataSource.length > 0) {
                                $scope.autoAddSegmentForNoneDefault();
                            }
                        });
                    }
                });

            };

            /**
             * Event listener for changedDashboard event will be triggered on Dashboard controller
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $rootScope.$on('selectedDashboardChanged', function() {
                console.log('CHANGED DASHBOARD EVENT TRIGGERD');
                $scope.init();
            });

            /**
             * Event listener for DataSource update event.
             * If Datasource is updated refetch datasources and dashboard metrics
             * @param {none}
             * @return {none}
             */
            $rootScope.$on('DataSourceUpdated', function() {
                $scope.init();
                $rootScope.$broadcast('changedSegmentOrDateRange', {});
            });
        }
    ]);
