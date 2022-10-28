'use strict';

angular.module('blComponents.platformPanel')
  .controller('teamMemberViewController', ['$scope', 'UserService', 'globalConfig',
    function ($scope, UserService) {
      $scope.updateSelectedUser = function () {
        var requestData = {
          user: angular.copy($scope.selectedUser)
        };

        delete requestData.user.socialAccounts;
        delete requestData.user.accountName;
        requestData.user.accounts = requestData.user.accountId ? [requestData.user.accountId] : [];
        delete requestData.user.accountId;

        return UserService.updateUser(requestData);
      };

      $scope.socialAccountLoading = false;

      $scope.$watch('selectedUser', function (n, o) {
        if (n !== o) {

          // Load Social Accounts
          $scope.selectedUser.socialAccounts = [];
          $scope.socialAccountLoading = true;
          UserService
            .listSocialAccounts(n.id)
            .then(function (accounts) {
              $scope.selectedUser.socialAccounts = accounts.map(function (account) {
                if (account.provider === 'windowslive') {
                  account.provider = 'live';
                }
                return {
                  provider: account.provider,
                  displayName: account.displayName,
                  profileUrl: account.profileUrl
                };
              });
            })
            .finally(function () {
              $scope.socialAccountLoading = false;
            });

          // Set User Account Name
          if (!$scope.userModifiable) {
            $scope.selectedUser.accountName = $scope.currentAccount.name;
          } else {
            var accountId = $scope.selectedUser.accountId,
              account;

            if (accountId) {
              account = $scope.accountListForSelectBox.find(function (account) {
                return account.id === accountId;
              });
            }

            $scope.selectedUser.accountName = account ? account.name : null;
          }
        }
      });
    }
  ])

  .directive('teamMemberView', function () {
    return {
      restrict: 'E',
      controller: 'teamMemberViewController',
      templateUrl: '/components/platform-panel/app/templates/team-member-view.html',
      link: function (scope, element, attrs) {
      }
    };
  });
