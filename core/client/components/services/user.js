angular.module('blApp.components.services')
    .service('UserService', ['$http', '$q',
        function($http, $q) {

            /**
             * Enphase if authenticated or not
             * @param {string}
             * @return {object}
             */
            this.enphaseAuth = function () {
                var apiUrl = '/collection/auth?company=enphase';
                return $http.get(apiUrl);
            };

            /**
             * List all accounts
             * @param {object}
             *    example :
             *        { roles: ['Admin', 'TM'], apps: ['BrighterView', 'DataSense', 
             *          'BrighterSavings', 'Verified Savings', 'Load Response', 
             *          'Utility Manager', 'Programs & Projects', 
             *          'ENERGY STAR Portfolio Manager'] }
             * @return {deferred object}
             *       array of users
             */
            this.getAllUsersEx = function (data) {
                var apiUrl = '/users?searchKey=all_data';
                return $http.get(apiUrl, {'data': data});
            };

            /**
             * List all accounts
             * @param {string}
             * @return {object}
             */
            this.listAllAccounts = function () {
                var apiUrl = '/users/accounts?searchKey=all_data';
                return $http.get(apiUrl);
            };

            /**
             * List all admins
             * @param {string}
             * @return {object}
             */
            this.listAllAdmins = function () {
                var apiUrl = '/users/admin';

                return $http.get(apiUrl);
            };
            /**
             * Search accounts by name
             * @param {string} searchKey
             * @return {object}
             * @auth Kornel Dembek / Oct 17 2014
             */
            this.searchAccounts = function (searchKey, limit) {
                var apiUrl = '/accounts?searchKey=' + encodeURIComponent(searchKey);
                var canceller = $q.defer();

                var cancel = function (reason) {
                    canceller.resolve(reason);
                };
                if (typeof limit !== 'undefined') {
                    apiUrl += '/' + encodeURIComponent(limit);
                }

                var promise = $http.get(apiUrl, {timeout: canceller.promise});
                return {
                    promise: promise,
                    cancel: cancel
                };
            };

            /**
             * Search user by name
             * @param {string} searchKey
             * @return {object}
             */
            this.searchUser = function (searchKey) {
                var apiUrl = '/users?searchKey=' + searchKey;
                var canceller = $q.defer();

                var cancel = function (reason) {
                    canceller.resolve(reason);
                };

                var promise = $http.get(apiUrl, {timeout: canceller.promise});
                return {
                    promise: promise,
                    cancel: cancel
                };
            };

            /**
             * Create an user
             * @param {string}
             * @return {object}
             */
            this.createUser = function(data) {
                var apiUrl = '/users';

                return $http.post(apiUrl, data);
            };

            /**
             * Update an user
             * @param {string}
             * @return {object}
             */
            this.updateUser = function(data) {
                var apiUrl = '/users/' + data.user.id;
                if (typeof data.user.id === 'undefined'){
                    apiUrl = '/users/' + data.user._id;
                }

                return $http.put(apiUrl, data);
            };

            /**
             * Delete an user
             * @param {string}
             * @return {object}
             */
            this.deleteUser = function(userId) {
                var apiUrl =  '/users/' + userId;

                return $http.delete(apiUrl);
            };

            /**
             * List social accounts of user
             * @param {string}
             * @return {object}
             */
            this.listSocialAccounts = function (userId) {
                var apiUrl = '/sociallogin/accounts/' + userId;

                return $http.get(apiUrl);
            };

            /**
             * Send reset password link to the email specified
             * @param {string} email address
             * @return {object} status
             */
            this.sendResetPwdLink = function(email) {
                var apiUrl = '/users/password/' + email;

                return $http.post(apiUrl);
            };

            /**
             * Connect BP user to SFDC User
             * @param {string} userId
             * @return {object} user object
             */
            this.connectBPUserToSFDC = function(userId) {
                var apiUrl = '/users/connectbptosfdc/' + userId;

                return $http.post(apiUrl);
            };

            this.getAccountsApps = function () {
                var apiUrl = '/users/applications';

                return $http.get(apiUrl);
            };

            this.energyCapAuth = function () {
                var apiUrl = '/users/energycaplogin';

                return $http.get(apiUrl);
            };
        }
    ]);
