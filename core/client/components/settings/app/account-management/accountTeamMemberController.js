'use strict';

angular.module('blComponents.Settings')

  .controller('accountTeamMemberController', ['$scope', '$uibModal', '$state', 'currentUser',
    function ($scope, $uibModal, $state, currentUser) {
      $scope.currentUser = currentUser;
      $scope.showAddMemberModal = function(){
        $uibModal.open({
          templateUrl: 'app/account-management/partials/add.teammember.modal.html',
          controller: 'addTeamMemberModalController',
          keyboard: true,
          backdrop: true,
          windowClass: 'add-member-modal-style',
          resolve: {
            currentUser: function () {
              return $scope.currentUser;
            }
          }
        });
      };
      $scope.editMemberModal = function(){
        $uibModal.open({
          templateUrl: 'app/account-management/partials/edit.teammember.modal.html',
          controller: 'addTeamMemberModalController',
          keyboard: true,
          backdrop: true,
          windowClass: 'modal-style',
          resolve: {
            currentUser: function () {
              return $scope.currentUser;
            }
          }
        });
      };
      $scope.deleteMemberModal = function(){
        $uibModal.open({
          templateUrl: 'app/account-management/partials/delete.teammember.modal.html',
          controller: 'addTeamMemberModalController',
          keyboard: true,
          windowClass: 'modal-style',
          backdrop: true,
          resolve: {
            currentUser: function () {
              return $scope.currentUser;
            }
          }
        });
      };
    }

  ]);
