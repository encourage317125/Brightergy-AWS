angular.module('blApp.components.services')
    .service('EditorService', ['$http',
        function($http) {
            /**
             * List all accounts
             * @param {object}
             *    example :
             *        { roles: ['Admin', 'TM'], apps: ['BrighterView', 'DataSense', 'BrighterSavings', 
             *          'Verified Savings', 'Load Response', 'Utility Manager', 'Programs & Projects', 
             *          'ENERGY STAR Portfolio Manager'] }
             * @return {deferred object}
             *       array of users
             */
            this.getAllUsersEx = function (param) {
                var apiUrl = '/users/all_users';

                return $http.post(apiUrl, param);
            };

            /**
             * Call api to get presentation info
             * API: /bv/presentationapi/presentationId
             * Method: GET
             * Params:
             *   limit(optional)
             */
            this.getPresentationInfo = function (presentationId) {
                var apiUrl = '/present/presentations/' + presentationId;
                return $http.get(apiUrl);
            };

            /**
             * Call api to get all editor
             * API: /bv/presentationapi/editors/presentationId
             * Method: GET
             * Params:
             *   limit(optional)
             */
            this.listEditors = function (presentationId) {
                var apiUrl = '/present/presentations/' + presentationId + '/editors';
                return $http.get(apiUrl);
            };

            /**
             * Call api to add a editor to the presentation.
             * API: /bv/presentationapi/editor/add
             * Method: GET
             * Params: userId, presentationId
             */
            this.addPresentationEditor = function (userId, presentationId) {
                var apiUrl = '/present/presentations/' + presentationId + '/editors';

                return $http.post(apiUrl, {
                    'userId': userId,
                    'presentationId': presentationId
                });
            };

            /**
             * Call api to remove a editor from the presentation
             * API: /bv/presentationapi/editor/remove
             * Method: DELETE
             * Params: userId, presentationId
             */

            this.deletePresentationEditor = function (userId, presentationId) {
                var apiUrl = '/present/presentations/' + presentationId + '/editors';
                return $http.delete(apiUrl, {
                    data: {
                        'userId': userId,
                        'presentationId': presentationId
                    },
                    headers: {'content-type': 'application/json'}
                });
            };

            /**
             * Call api to list editors for the presentation
             * API: /bv/presentationapi/presentationId
             * Method: GET
             * Params: facility Ids
             *
             */

            this.getPresentationEditors = function (presentationId) {
                var apiUrl = '/present/presentations/:presentationId/editors';

                apiUrl = apiUrl.replace(':presentationId', presentationId);
                return $http.get(apiUrl);
            };
        }
    ]);