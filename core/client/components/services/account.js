angular.module('blApp.components.services')
    .service('accountService', ['$http', '$compile', 'utilService',
        function($http, $compile, utilService) {

            /**
            * Call api to Update Account
            * API: /accountapi
            * Method: PUT
            * Params: Account Info
            *   
            */ 
            this.updateAccount = function(account) {
                var apiUrl = '/accounts/' + account._id;
                var inputJson = {account: account};
                return $http.put(apiUrl, inputJson);
            };
            /**
             * Call api to retrieve all Accounts
             * API: /accountapi/all_data
             * Method: GET
             * Params: None
             */
            this.getAllAccounts = function () {
                var apiUrl = '/accounts?searchKey=all_data';
                return $http.get(apiUrl);
            };

            /**
             * Call api to create Account with SFDC account
             * API: /accountapi/createwithsf
             * Method: POST
             * Params:
             *     account: {New Account detail}
             *     user:    {SFDC account info}
             */
            this.createAccountWithSF = function (account, user, scope) {
                var apiUrl = '/accounts/createwithsf';
                var inputJson = {account: account, user: user};
                return $http.post(apiUrl, inputJson);
            };

            /**
             * Call api to Delete Account
             * API: /accountapi/edit
             * Method: DELETE
             * Params: Account Id
             *
             */
            this.deleteAccount = function (accountId) {
                var apiUrl = '/accounts/' + accountId;
                return $http.delete(apiUrl);
            };

            /**
             * Call api to verify cname
             * API: accountapi/verifycname/accountCname
             * Method: GET
             * Params:
             *
             */
            this.verifyCname = function (accountCname) {
                var apiUrl = '/accounts/verifycname/' + accountCname;
                return $http.get(apiUrl);
            };

            /**
             * Call api to get live address
             * API: /liveaddress/street=addressToParse
             * Method: GET
             * Params:
             *
             */
            this.liveAddress = function (addressToParse) {
                var apiUrl = '/location/address/street=' + addressToParse;
                return $http.get(apiUrl);
            };

            /**
             * Call api to create Account
             * API: /accountapi
             * Method: POST
             * Params:
             *     account: {New Account detail}
             */
            this.createAccount = function (account, user) {
                var apiUrl = '/accounts';
                var inputJson = {account: account, user: user};
                return $http.post(apiUrl, inputJson);
            };

            /**
             * Call api to get SFDC Accounts
             * API: /salesforce/accounts/accName
             * Method: GET
             * Params:
             *     
             */
            this.getSFDCAccounts = function (accountName) {
                var apiUrl = '/salesforce/accounts/' + accountName;
                return $http.get(apiUrl);
            };
        }
    ]);
