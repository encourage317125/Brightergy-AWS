'use strict';

angular.module('blComponents.platformPanel')
  .controller('teamMemberNewController', ['$scope', 'UserService',
    function ($scope, UserService) {
      $scope.newUser = {};
      $scope.isCreatingUser = false;
      $scope.createNewTeamMember = function (newUserForm) {

        if (newUserForm.$invalid) {
          $scope.submitted = true;
          return false;
        }
        newUserForm.$setPristine();

        var selectedAccount = $scope.allAccounts.find(function (a) {
          return a._id === $scope.newUser.accountId;
        });

        var requestData = {
          'sfdcAccountId': selectedAccount ? selectedAccount.sfdcAccountId : null,
          'user': angular.copy($scope.newUser)
        };

        requestData.user.accounts = requestData.user.accountId ? [requestData.user.accountId] : [];
        delete requestData.user.accountId;
        $scope.isCreatingUser = true;
        return UserService
          .createUser(requestData)
          .then (function (newUser) {
            if (newUser.accounts.constructor === Array && newUser.accounts.length) {
              newUser.accountId = newUser.accounts[0];
            }
            $scope.availableUsers.push(newUser);
            $scope.selectedTeamPanel = 'list';
            $scope.newUser = {};
          }, function (err) {
            alert('Sorry! Failure while creating user.');
          })
          .finally (function () {
            $scope.isCreatingUser = false;
          });
      };
    }
  ])
  .directive('teamMemberNew', function() {
    return {
      restrict: 'E',
      controller: 'teamMemberNewController',
      templateUrl: '/components/platform-panel/app/templates/team-member-new.html',
      link: function(scope, element, attrs) {
      }
    };
  });