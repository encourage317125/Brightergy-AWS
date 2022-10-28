'use strict';

angular.module('blComponents.platformPanel')
  .controller('teamPanelController', ['$scope', 'UserService',
    function ($scope, UserService) {
      $scope.availableUsers = [];
      $scope.selectedUser = null;
      $scope.search = {
        name: ''
      };

      $scope.selectedTeamPanel = 'list';

      $scope.userCreatable = $scope.currentUser.role === 'BP';
      $scope.userModifiable = $scope.currentUser.role === 'BP' || $scope.currentUser.role === 'Admin';

      $scope.initLoad = function () {
        function filterUsers (users) {
          // Remove the currentUser from users list
          for (var idx = 0, len = users.length; idx< len; idx++) {
            if (users[idx].id === $scope.currentUser.id) {
              users.splice(idx, 1);
              return users;
            }
          }
          return users;
        }

        if ($scope.currentUser.role === 'BP') {
          UserService
            .getAllUsersEx({roles: ['BP', 'Admin', 'TM']})
            .then(filterUsers)
            .then(function (users) {
              $scope.availableUsers = users;
            });
        } else {
          UserService
            .getUsersByAccount($scope.currentAccountId)
            .then(filterUsers)
            .then(function (users) {
              $scope.availableUsers = users;
            });
        }
      };

      $scope.showNewMemberPanel = function() {
        $scope.selectedTeamPanel = 'new';
        $scope.savedUser = {};
        $scope.isCreate = true;
      };

      $scope.showViewMemberPanel = function (user) {
        $scope.selectedTeamPanel = 'view';
        $scope.selectedUser = user;
      };

      $scope.backToTeamList = function () {
        $scope.selectedTeamPanel = 'list';
      };
    }
  ])
  .directive('teamPanel',
    function () {
      return {
        restrict: 'E',
        controller: 'teamPanelController',
        templateUrl: '/components/platform-panel/app/templates/team-panel.html',
        link: function(scope, element, attrs) {
          scope.initLoad();
        }
      };
    }
  );