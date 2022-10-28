angular.module('blComponents.platformPanel')
  .service('UserService', ['$http', 'UtilService', 'Upload',
    function ($http, UtilService, Upload) {
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
       *  @return {deferred object}
       *       array of users
       */
      this.getAllUsersEx = function (data) {
        var apiUrl = '/users?searchKey=all_data';

        return $http
          .get(apiUrl, {'data': data})
          .then(function (users) {
            users.map(function (user) {
              if (user.accounts.constructor === Array && user.accounts.length) {
                user.accountId = user.accounts[0];
              }
            });
            return users;
          });
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
       * List all Users by Account Id
       * @param accountId
       */

      this.getUsersByAccount = function (accountId) {
        var apiUrl = '/accounts/' + accountId + '/users';

        return $http.get(apiUrl);
      };

      /**
       * Create an user
       * @param {string}
       * @return {object}
       */
      this.createUser = function (data) {
        var apiUrl = '/users';

        if (data.user.name) {
          var parsed = UtilService.parseName(data.user.name);
          data.user.firstName = parsed[0];
          data.user.middleName = parsed[1];
          data.user.lastName = parsed[2];
        }

        if (data.user.email.indexOf('@') > -1) {
          var emailParsed = UtilService.parseEmail(data.user.email);
          data.user.emailUser = emailParsed[0];
          data.user.emailDomain = emailParsed[1];
        }

        return $http.post(apiUrl, data);
      };

      /**
       * Update an user
       * @param {string}
       * @return {object}
       */
      this.updateUser = function (data) {
        var apiUrl = '/users/' + (data.user.id || data.user._id);

        if (data.user.name) {
          var parsed = UtilService.parseName(data.user.name);
          data.user.firstName = parsed[0];
          data.user.middleName = parsed[1];
          data.user.lastName = parsed[2];
        }

        if (data.user.email.indexOf('@') > -1) {
          var emailParsed = UtilService.parseEmail(data.user.email);
          data.user.emailUser = emailParsed[0];
          data.user.emailDomain = emailParsed[1];
        }

        return $http.put(apiUrl, data);
      };

      /**
       * Delete an user
       * @param {string}
       * @return {object}
       */
      this.deleteUser = function (userId) {
        var apiUrl = '/users/' + userId;
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
      this.sendResetPwdLink = function (email) {
        var apiUrl = '/users/password/' + email;
        return $http.post(apiUrl);
      };

      /**
       * Connect BP user to SFDC User
       * @param {string} userId
       * @return {object} user object
       */
      this.connectBPUserToSFDC = function (userId) {
        var apiUrl = '/users/connectbptosfdc/' + userId;

        return $http.post(apiUrl);
      };

      this.getAccountsApps = function () {
        var apiUrl = '/users/applications';
        return $http.get(apiUrl);
      };

      this.logout = function () {
        var apiUrl = '/users/logout';
        return $http.post(apiUrl);
      };

      this.uploadLoggedInUserPhoto = function (file, thumbnail) {
        var apiUrl = '/users/assets/userprofile';

        return Upload.upload({
          url: apiUrl,
          method: 'POST',
          fields: {
            'hasCropped': 'true',
            'imageBinary': thumbnail
          },
          file: file,
          sendFieldsAs: 'form'
        });
      };

      this.getMyInfo = function() {
        return $http
          .get('/users/me')
          .then(function(rawUser) {
            var user = angular.extend({}, rawUser, {
              nameInitial: rawUser.firstName.substr(0, 1) + rawUser.lastName.substr(0, 1),
              online: true,
            });

            if (user.profilePictureUrl) {
              user.avatarStyle = {
                'background-image': 'url(' + user.profilePictureUrl + ')',
                'background-size': '100% 100%',
                'font-size': '0',
              };
            }

            return user;
          });
      };

      this.energyCapAuth = function() {
        return $http.get('/users/energycaplogin');
      };

      this.getAccessibleApps = function() {
        return $http.get('/users/applications');
      };
    }
  ]);
