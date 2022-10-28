angular.module('blApp.components.services')
    .service('AssetService', ['$http', '$compile', 'toggleService', 'utilService',
        function($http, $compile, toggleService, utilService) {
            /**
             * Call api to retrieve all assets
             * api - /assets/type/relatedId?/fileNameMask/limit
             * method - GET
             * @param {string} type The type of asset
             * @param {string} id The id of account or presentation
             * @param {string} search An search key
             * @param {number} limit Count of limitation
             * @return {object}
             */
            this.listAnyAssets = function (type, id, search, limit) {
                var apiUrl = '/assets/' + type + '/' + (type === 'general' ? search : id + '/' + search);

                if (typeof limit !== 'undefined') {
                    apiUrl += '/' + limit;
                }
                return $http.get(apiUrl);
            };

            /**
             * Call api to retrieve general assets
             * api - /assets/find/general/fileNameMask/limit
             * method - GET
             * @param {string} search An search key
             * @param {number} limit Count of limitation
             * @return {object}
             */
            this.listGeneralAssets = function (search, limit) {
                var apiUrl = '/general/assets?searchKey=' + search;

                if (typeof limit !== 'undefined') {
                     apiUrl += '&limit=' + limit;
                }
                return $http.get(apiUrl, {withCredentials:true});
            };

            /**
             * Call api to retrieve account assets
             * api - /assets/find/account/accountId/fileNameMask/limit
             * method - GET
             * @param {string} accountId The id of account
             * @param {string} search An search key
             * @param {number} limit Count of limitation
             * @return {object}
             */
            this.listAccountAssets = function (accountId, search, limit) {
                var apiUrl = '/accounts/' + accountId + '/assets?searchKey=' + search;

                if (typeof limit !== 'undefined') {
                    apiUrl += '&limit=' + limit;
                }
                return $http.get(apiUrl);
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/find/presentation/presentationId/fileNameMask/limit
             * method - GET
             * @param {string} presentationId The id of presentation
             * @param {string} search An search key
             * @param {number} limit Count of limitation
             * @return {object}
             */
            this.listPresentationAssets = function (presentationId, search, limit) {
                var apiUrl = '/general/assets/presentation/find/' + 
                    presentationId + '/' + search;

                if (typeof limit !== 'undefined') {
                    apiUrl += '/' + limit;
                }
                return $http.get(apiUrl);
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/find/presentation/presentationId/fileNameMask/limit
             * method - GET
             * @param {string} id The id of presentation
             * @param {string} search An search key
             * @param {number} limit Count of limitation
             * @return {object}
             */
            this.listAccounts = function (limit) {
                var apiUrl = '/accounts?searchKey=all_data';

                if (typeof limit !== 'undefined') {
                    apiUrl += '/' + limit;
                }

                return $http.get(apiUrl);
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/type/relatedId
             * method - POST
             * @param {object} scope The scope
             * @param {object} data An search key
             * @param {string} type Asset type
             * @param {string} id The related id
             * @return {object}
             */
            this.uploadAnyAssests = function (scope, data, type, id) {
                var apiUrl = '/assets/' + type;

                if (typeof id !== 'undefined') {
                    apiUrl += '/' + id;
                }

                return $http.post(apiUrl, data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/general
             * method - POST
             * @param {object} scope The scope
             * @param {object} data An search key
             * @return {object}
             */
            this.uploadGeneralAssests = function (data) {
                var apiUrl = '/general/assets';

                return $http.post(apiUrl, data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/account/accountId
             * method - POST
             * @param {object} data An search key
             * @param {string} accountId The account id
             * @return {object}
             */
            this.uploadAccountAssests = function (data, accountId) {
                var apiUrl = '/accounts/' + accountId + '/assets';

                return $http.post(apiUrl, data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/presentation/presentationId
             * method - POST
             * @param {object} data The posted data
             * @param {string} presentationId The presentation id
             * @return {object}
             */
            this.uploadPresentationAssests = function (data, presentationId) {
                var apiUrl = '/general/assets/presentation/' + presentationId;

                return $http.post(apiUrl, data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/assetType/relatedId/assetId
             * method - DELETE
             * @param {string} type The asset type
             * @param {string} relatedId The ID of account or presentation
             * @param {string} assetId The deleted ID
             * @return {object}
             */
            this.deleteAnyAsset = function (type, assetId, relatedId) {
                var apiUrl = '/assets/' + type;

                if (typeof relatedId !== 'undefined') {
                    apiUrl += '/' + relatedId;
                }
                apiUrl += '/' + assetId;
                return $http.delete(apiUrl);
            };

            /**
             * Call api to retrieve presentation assets
             * api -  /assets/general/assetId
             * method - DELETE
             * @param {string} assetId The deleted ID
             * @return {object}
             */
            this.deleteGeneralAsset = function (assetId) {
                var apiUrl = '/general/assets/' + assetId;
                return $http.delete(apiUrl);
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/account/accountId/assetId
             * method - DELETE
             * @param {string} accountId The ID of account
             * @param {string} assetId The deleted ID
             * @return {object}
             */
            this.deleteAccountAsset = function (accountId, assetId) {
                var apiUrl = '/accounts/' + accountId + '/assets/' + assetId;
                return $http.delete(apiUrl);
            };

            /**
             * Call api to retrieve presentation assets
             * api - /assets/presentation/presentationId/assetId
             * method - DELETE
             * @param {string} presentationId The ID of presentation
             * @param {string} assetId The deleted ID
             * @return {object}
             */
            this.deletePresentationAsset = function (presentationId, assetId) {
                var apiUrl = '/general/assets/presentation/' + presentationId + '/' + assetId;
                return $http.delete(apiUrl);
            };
        }
    ]);