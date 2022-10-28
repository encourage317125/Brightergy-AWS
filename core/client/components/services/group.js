angular.module('blApp.components.services')
    .service('GroupService', ['$rootScope', '$http', '$compile', '$q', 'toggleService', 'utilService',
        function($rootScope, $http, $compile, $q, toggleService, utilService) {
            this.listGroups = function() {
                var apiUrl = '/groups';
                return $http.get(apiUrl);
            };
            this.availableGroups = function() {
                var apiUrl = '/groups/available';
                return $http.get(apiUrl);
            };
            this.AddGroupSource = function(inputJson) {
                var apiUrl = '/groups/source';
                return $http.post(apiUrl, inputJson);
            };
            this.RemoveGroupSource = function(inputJson) {
                var apiUrl = '/groups/source';
                return $http.delete(apiUrl, {
                        data: inputJson, 
                        headers: {'content-type': 'application/json'}});
            };
            this.AddGroup = function(inputJson) {
                var apiUrl = '/groups';
                return $http.post(apiUrl, inputJson);
            };
            this.EditGroup = function(inputJson) {
                var groupId = inputJson.id;
                var apiUrl = '/groups/' + groupId;
                return $http.put(apiUrl, inputJson);
            };
            this.GetGroup = function(groupId) {
                var apiUrl = '/groups/' + groupId;
                return $http.get(apiUrl);
            };
            this.deleteGroup = function(groupId) {
                var apiUrl = '/groups/' + groupId;
                return $http.delete(apiUrl);
            };
        }
    ]);
