'use strict';

angular.module('blComponents.platformPanel')
.controller('ppanelFormFieldSelectLiveController', ['$scope',
  function ($scope) {
    $scope.isSaving = false;
    $scope.saveElement = function () {
      $scope.isSaving = true;

      return $scope.onSave({}).finally(function () {
        $scope.isSaving = false;
      });
    };
  }])
.directive('ppanelFormFieldSelectLive',
  function() {
    var oldContent;
    function saveElement (scope) {
      return scope
        .saveElement()
        .catch(function (data){
          scope.fieldModel = angular.copy(oldContent);
          return data;
        });
    }

    function hideInputBox (element) {
      element.find('.ppanel-form-field-input-wrapper').hide();
      element.find('span.echo').show();
    }

    return {
      restrict: 'E',
      scope: {
        fieldModel: '=',
        fieldList: '=',
        onSave: '&fieldOnSave'
      },
      controller: 'ppanelFormFieldLiveController',
      transclude: true,
      template: function (element, attrs) {
        return ['<i class="icon icon-edit fade" ng-if="!isSaving"></i>',
          '<i class="icon-blue-loading" ng-if="isSaving"></i>',
          '<span class="echo" ng-transclude></span>',
          '<div class="input-group ppanel-form-field-input-wrapper" style="display: none">',
            '<select type="text" class="form-control" ng-model="fieldModel" ',
              'ng-options="item.id as item.name for item in fieldList"',
              (attrs.required ? ' required' : '') + ' ng-change="updateMe(fieldModel)">',
              (attrs.default ? '<option value="">'+attrs.default+'</option>' : ''),
            '</select>',
          '</div>'].join('');
      },
      link: function(scope, element, attrs) {

        // Show/hide icon-edit when hover field text
        element
          .on('mouseenter', 'span.echo', function (e) {
            element.find('.icon').addClass('in');
          })
          .on('mouseleave', 'span.echo', function () {
            element.find('.icon').removeClass('in');
          })
          // Show text editor when click field text
          .on('click', 'span.echo', function () {
            // Backup the origin content
            oldContent = angular.copy(scope.fieldModel) || '';

            element.find('span.echo').hide();
            element.find('.input-group').show();
          })
          .on('hidden.ppanel-field', '.ppanel-form-field-input-wrapper', function () {
            scope.$apply(function () {
              scope.fieldModel = angular.copy(oldContent);
            });
            element.find('span.echo').show();
          });

        scope.updateMe = function () {
          saveElement(scope).finally(function () {
            hideInputBox(element);
          });
        };
      }
    };
  }
);