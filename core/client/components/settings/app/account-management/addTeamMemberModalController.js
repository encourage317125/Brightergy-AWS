'use strict';

angular.module('blComponents.Settings')

  .controller('addTeamMemberModalController', ['$scope', '$uibModalInstance', 'currentUser', 'accountService',
    'UserService',
    function ($scope, $uibModalInstance, currentUser, accountService, UserService) {
      $scope.currentUser = currentUser;

      console.log('current user info:', $scope.currentUser);
      $scope.memberName = '';
      $scope.existSpaceInName = true;
      $scope.memberEmail = '';
      $scope.memberDuplicateEmail = false;
      $scope.memberPhone = '';
      $scope.memberAccount = '';
      $scope.memberRole = '';

      $scope.accountList = [];
      $scope.userList = [];
      $scope.roleList = ['Admin', 'BP', 'TM'];

      $scope.isReceivedResponse = true;

      $scope.addMember = function() {
        if ($scope.memberName === '' || $scope.memberEmail === '' || $scope.memberAccount === '' ||
          $scope.memberRole === '' || $scope.memberEmail === undefined) {
          return;
        }

        var userObj = {
          'name': $scope.memberName,
          'email': $scope.memberEmail,
          'phone': $scope.memberPhone,
          'accounts': [$scope.memberAccount],
          'role': $scope.memberRole,
          'tokens': []
        };

        var sfdcAccountId = '';
        angular.forEach($scope.accountList, function(account) {
          if (account._id === $scope.memberAccount) {
            sfdcAccountId = account.sfdcAccountId;
          }
        });

        var data = {
//          'sfdcAccountId': sfdcAccountId,
          'user': userObj
        };

        console.log('request data: ', data);

        $scope.isReceivedResponse = false;
        UserService.createUser(data).then(function(response){
          console.log('add user response:', response);
          $scope.isReceivedResponse = true;
          $scope.closeModal();
        }, function(err) {
          alert('Sorry! Failure while creating user.');
          $scope.isReceivedResponse = true;
        });
      };

      $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
      };

      accountService.getAllAccounts().then(function(accountList){
        $scope.accountList = accountList;
        console.log('platform-panel all accounts', $scope.accountList);
      });

      UserService.getAllUsersEx().then(function(userList) {
        $scope.userList = userList;
        console.log('registered user list: ', $scope.userList);
      });

      $scope.$watch('memberName', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          if ($scope.memberName.indexOf(' ') === -1) {
            $scope.existSpaceInName = false;
          } else {
            $scope.existSpaceInName = true;
          }
        }
      });

      $scope.$watch('memberEmail', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          var result = $.grep($scope.userList, function(e) {
            return e.email === $scope.memberEmail;
          });

          if (result.length === 0) {
            $scope.memberDuplicateEmail = false;
          } else {
            $scope.memberDuplicateEmail = true;
          }
        }
      });
    }
  ]);
