'use strict';

angular.module('blApp.dataSense.services')
    .service('SegmentService', ['$http', '$compile', 'utilService', '$rootScope',
        function($http, $compile, utilService, $rootScope) {

            /**
             * Call api to get segments to dashboard
             * API: /dashboardapi/segments/dashboardId
             * Method: GET
             * Params: {string} dashboardId dashboard ID
             *
             */
            this.getSegmentsByDashboard = function (dashboardId) {
                var apiUrl = '/analyze/dashboards/' + dashboardId + '/tags/segments';
                if ($rootScope.isViewer) {
                    apiUrl += '?isViewer=true';
                }
                return $http.get(apiUrl);
            };

            /**
             * Call api to add segment to dashboard
             * API: ds/dashboardapi/segments/create/dashboardId
             * Method: POST
             * @Params: segment data
             * @return {object}
             */
            this.createSegmentToDashboard = function (dashboardId, data) {
                var apiUrl = '/analyze/dashboards/' + dashboardId + '/tags/segments';
                return $http.post(apiUrl, data);
            };

            /**
             * Call api to update segment to dashboard
             * API: ds/dashboardapi/segments/edit/dashboardId
             * Method: PUT
             * @Params: segment data
             * @return {object}
             */
            this.updateSegmentToDashboard = function (dashboardId, data) {
                var apiUrl = '/analyze/dashboards/' + dashboardId + '/tags/segments';
                return $http.put(apiUrl, data);
            };

            /**
             * Call api to remove segment from dashboard
             * API: ds/dashboardapi/segments/remove/dashboardId
             * Method: PUT
             * @Params: segmentIds
             * @return {object}
             */
            this.deleteSegmentFromDashboard = function (dashboardId, segmentIds) {
                var apiUrl = '/analyze/dashboards/' + dashboardId + '/tags/segments';
                return $http.delete(apiUrl, {
                    data: segmentIds,
                    headers: {'content-type': 'application/json'}
                });
            };
        }
    ]);