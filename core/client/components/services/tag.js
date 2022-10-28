angular.module('blApp.components.services')
.service('TagService', ['$rootScope', '$http',
    function($rootScope, $http) {

        /**
         * Call api to retrieve all accessible tags by specific user
         * api - /userapi/tags/{userId}
         * method - GET
         * @param {string} userId Current User ID
         * @return {object}
         */

        this.listAccessibleTagsByUser = function(userId, limit, offset, filter) {
            if(limit === undefined || limit === null) {
                limit = 50;
            }

            if(offset === undefined || offset === null) {
                offset = 0;
            }

            var apiUrl = '/users/' + userId + '/tags?limit=' + limit + '&offset=' + offset;

            if (typeof filter !== 'undefined') {
                if (filter.trim() !== '') {
                    apiUrl += '&filter=' + filter.trim();
                }
            }

            return $http.get(apiUrl);
        };

        /**
         * Call api to get accessible users to the specified tag
         * api - /api/tag/users/{tagId}
         * method - GET
         * @param {object} tagId
         * @return {object} tagObject
         */
        this.getAccessibleUsersByTag = function(tagId) {
            var apiUrl = '/tags/source/users/' + tagId;

            return $http.get(apiUrl);
        };

        /**
         * Call api to retrieve all manufacturers
         * api - /api/tag
         * method - GET
         * @param {object}
         * @return {object}
         */
        this.listAllManufacturers = function() {
            var apiUrl = '/collection/scopes';
            return  $http.get(apiUrl);
        };

        /**
         * Call api to retrieve all devices
         * api - /api/tag
         * method - GET
         * @param {object}
         * @return {object}
         */
        this.listAllDevices = function() {
            var apiUrl = '/collection/nodes';
            return $http.get(apiUrl);
        };

        /**
         * Call api to create a new tag
         * api - /api/tag
         * method - POST
         * @param {object} tag The data will be posted for creating tag
         * @return {object}
         */
        this.createTag = function(tag) {
            var apiUrl = '/tags';
            return $http.post(apiUrl, tag).then(function(tag) {
                $rootScope.$broadcast('DataSourceUpdated', {});
                return tag;
            });
        };

        /**
         * Add tag to user so that user can be accessible to that tag
         * Note: It doesn't create new tag to tag collection (bind between tag and user)
         * api - userapi/tags/{userId}
         * method - POST
         * @param {string} userId
         * @param {object} accessibleTag
         */
        this.addUserAccessibleTag = function(userId, accessibleTag) {
            var apiUrl = '/users/' + userId + '/tags',
                data = {
                    'accessibleTag': accessibleTag
                };

            return $http.post(apiUrl, data);
        };

        /**
         * Remove tag from user so that user can not be accessible to that tag
         * Note: It doesn't remove new tag to tag collection (unbind between tag and user)
         * method - DELETE
         * @param {string} userId
         * @param {object} accessibleTag
         */
        this.deleteUserAccessibleTag = function(userId, accessibleTag) {
            var apiUrl = '/users/' + userId + '/tags/' + accessibleTag.id;
            return $http.delete(apiUrl);
        };

        /**
         * Call api to create a tagged data source
         * api - /api/tag
         * method - POST
         * @param {object} data The data will be posted for creating data source
         * @return {object}
         */
        this.createDataSourceWithTag = function(data, scope) { // has to deprecate
            var apiUrl = '/tags';
            return  $http.post(apiUrl, data).then(function(resp) {
                $rootScope.$broadcast('DataSourceUpdated', {});
                return resp;
            });
        };

        /**
         * Call api to create a tagged data source
         * api - /api/tag
         * method - POST
         * @param {object} data The data will be posted for creating data source
         * @return {object}
         */
        this.addMultiDataSourcesWithTag = function(data) {
            var apiUrl = '/tags';
            return  $http.post(apiUrl, data).then(function(data) {
                $rootScope.$broadcast('DataSourceUpdated', {});
                return data;
            });
        };

        /**
         * Call api to delete multiple data sources
         * api - /api/datasource
         * method - DELETE
         * @param {object} data The data will be deleted from datasources
         * @return {object}
         */
        this.deleteMultiDataSourcesWithTag = function(data) {
            var apiUrl = '/tags';

            return  $http.delete(apiUrl,{
                data : data,
                headers : {'content-type' : 'application/json'}
            }).then(function(resp) {
                $rootScope.$broadcast('DataSourceUpdated', {});
                return resp;
            });
        };

        /**
         * Call api to update a data source
         * api - /api/tag/{datasourceId}
         * method - PUT
         * @param {object} data The data will be putted for updating datasource
         * @return {object}
         */
        this.updateTag = function(tagId, tagObj) {
            var apiUrl = '/tags/' + tagId;
            delete tagObj.creator;

            return $http.put(apiUrl, tagObj).then(function(data) {
                $rootScope.$broadcast('DataSourceUpdated', {});
                return data;
            });
        };

        /**
         * Call api to delete a data source
         * api - /api/tag/{datasourceId}
         * method - DELETE
         * @param {object} tagId
         * @return {object}
         */
        this.deleteTag = function(tagId) {
            var apiUrl = '/tags/' + tagId;

            return $http.delete(apiUrl).then(function(data) {
                $rootScope.$broadcast('DataSourceUpdated', {});
                return data;
            });
        };

        /**
         * Call api to delete multiple data sources
         * api - /api/datasource
         * method - DELETE
         * @param {object} data The data will be deleted from datasources
         * @return {object}
         */
        this.deleteMultiDataSources = function(data) {
            var apiUrl = '/api/datasource';

            return  $http.delete(apiUrl,{
                data : data,
                headers : {'content-type' : 'application/json'}
            }).then(function(data) {
                $rootScope.$broadcast('DataSourceUpdated', {});
                return data;
            });
        };

        /**
         * Call api to check if data source is deletable
         * api - /api/datasource/deletable/{datasourceId}
         * method - DELETE
         * @param {string} tagId The datasource ID which to check
         * @return {object}
         */
        this.checkTagDeletable = function(tagId) {
            var apiUrl = '/tags/' + tagId + '/deletable';
            return $http.get(apiUrl);
        };

        /**
         * Call api to update a tagged data source
         * api - /userapi/tags/{userId}
         * method - PUT
         * @param {object} data The data will be posted for creating data source
         * @return {object}
         */
        this.updateUserAccessableTag = function(data) {
            var apiUrl = '/users/' + data.userId + '/tags';
            return $http.put(apiUrl, data);
        };
        /**
         * Call api to create a tagged data source
         * api - /bv/presentationapi/tags/{presentationId}
         * method - POST
         * @param {object} data The data will be posted for creating data source
         * @return {object}
         */
        this.createPresentationDataSourceWithTag = function(data) {
            var apiUrl = '/present/presentations/' + data.presentationId + '/tags';
            return $http.post(apiUrl, data);
        };
        /**
         * Call api to delete a data source
         * api - /bv/presentationapi/tags/{tagBindingId}/{presentationId}
         * method - DELETE
         * @param {object} data The data will be deleted from datasources
         * @return {object}
         */
        this.deletePresentationDataSourceWithTag = function(data) {
            var apiUrl = '/present/presentations/' + data.presentationId + '/tags/' + data.tagBinding.id;
            return  $http.delete(apiUrl);
        };
        /**
         * Call api to update a tagged data source
         * api - /bv/presentationapi/tags/{presentationId}
         * method - PUT
         * @param {object} data The data will be posted for creating data source
         * @return {object}
         */
        this.updatePresentationDataSourceWithTag = function(data) {
            var apiUrl = '/present/presentations/' + data.presentationId + '/tags';
            return  $http.put(apiUrl, data);
        };

        /**
         * Call api to add tag data by uploading
         * api - /tags/data/{metricId}
         * method - POST
         * @param {object} data The data will be posted for adding tag data
         * @return {object}
         */
        this.addTagData = function(data) {
            var apiUrl = '/tags/data/' + data.metricId;

            delete data.metricId;

            return $http.post(apiUrl, data);
        };

        /**
         * Call api to upload facility image
         * api - /tags/image
         * method - POST
         * @param {object} imageFile The file will be uploaded
         * @return {object}
         */
        this.uploadImage = function(file) {
            var apiUrl = '/tags/image';

            var data = new FormData();
            data.append('imageFile', file);

            return $http.post(apiUrl, data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
        };

        /**
         * Call api to upload device software
         * api - /tags/firmware
         * method - POST
         * @param {object} softwareFile The file will be uploaded
         * @return {object}
         */
        this.uploadDeviceSoftware = function(file) {
            var apiUrl = '/tags/firmware';

            var data = new FormData();
            data.append('softwareFile', file);

            return $http.post(apiUrl, data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
        };

        /**
         * Call api to get gateway software configs of specific tag
         * api - /api/tag/{tagId}/gatewaysoftware
         * method - GET
         * @param {string} tagId
         * @return [{object}] array of configs
         */
        this.getGatewaySoftwareConfigs = function(tagId) {
            var apiUrl = '/tags/' + tagId + '/gatewaysoftware';

            return $http.get(apiUrl);
        };

        /**
         * Call api to update device software
         * api - /tags/{tagId}/gatewaysoftware
         * method - POST
         * @param {string} tagId
         * @return {string} software version to update
         */
        this.updateDeviceSoftware = function(tagId, softwareVersion) {
            var apiUrl = '/tags/' + tagId + '/gatewaysoftware';

            var data = {
                'softwareUrl': 's3://' + 'device-softwares' + '/' + softwareVersion
            };

            return $http.post(apiUrl, data);
        };

        /**
         * Call api to get possible nodes and metrics by Scope
         * api - /collection/scopes/{scopeId}/nodes?company={some_company}
         * method - GET
         * @param {string} scopeId
         * @param {string} company
         * @return {object}
         */
        this.getPossibleNodesMetricsByScope = function(scopeId, company) {
            var apiUrl = '/collection/scopes/' + scopeId + '/nodes?company=' + company;

            return $http.get(apiUrl);
        };

        /**
         * Call api to get tag info by id
         * api - /tags/{tagId}
         * method - GET
         * @param {string} tagId
         * @return {object}
         */
        this.getTagInfoById = function(id) {
            var apiUrl = '/tags/' + id;

            return $http.get(apiUrl);
        };
    }
]);
