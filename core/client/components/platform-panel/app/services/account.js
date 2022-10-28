angular.module('blComponents.platformPanel')
  .service('AccountService', ['$http', '$compile', '$rootScope', 'UtilService',
    function ($http, $compile, $rootScope, utilService) {

      /**
       * Call api to Update Account
       * API: /accountapi
       * Method: PUT
       * Params: Account Info
       *
       */
      this.updateAccount = function (account) {
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
       * Call api to get a account by id
       * API: /salesforce/accounts/accountId
       * Method: GET
       * Params:
       *
       */
      this.getAccount = function (accountId) {
        var apiUrl = '/accounts/' + accountId;
        return $http.get(apiUrl);
      };
    }
  ]);
