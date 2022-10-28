'use strict';

angular.module('blComponents.platformPanel')
  .controller('ppanelFormFieldLiveController', ['$scope',
  function ($scope) {
    $scope.isSaving = false;
    $scope.saveElement = function () {
      $scope.isSaving = true;

      return $scope
        .onSave({})
        .finally(function () {
          $scope.isSaving = false;
        });
    };
  }])
  .directive('ppanelFormFieldLive',
    function() {
      var oldContent;
      function hideTextEditor (element) {
        element.find('.ppanel-form-field-input-wrapper').hide();
        element.find('span.echo').show();
      }

      function saveElement (scope, element) {
        if (scope.innerForm.$invalid) {
          scope.$apply(function () {
            scope.submitted = true;
          });
          return false;
        }

        return scope
          .saveElement()
          .then(
            function (resp) {
              scope.updateErrorMessage = null;
              hideTextEditor(element);
              return resp;
            }, function (errorMessage) {
              scope.updateErrorMessage = errorMessage;
              element.find('input.form-control').focus();
              return errorMessage;
            }
          );
      }

      function getErrorMessage(type, validate) {
        var validateErrorMessages = [];

        if (type === 'email') {
          validateErrorMessages.push('<span ng-if="innerForm.foo.$error.email">Invalid email address</span>');
        } else if (type === 'url') {
          validateErrorMessages.push('<span ng-if="innerForm.foo.$error.url">Not valid url</span>');
        }
        if (validate) {
          validate.split(' ').map(function (v) {
            if (v === 'required') {
              validateErrorMessages
                .push('<span ng-if="innerForm.foo.$error.required">Required</span>');
            } else if (v === 'ng-phone-number') {
              validateErrorMessages
                .push('<span ng-if="innerForm.foo.$error.phonenumber">' +
                      'Please input valid a phone number <br/>( ex: 1-800-275-2273)</span>');
            } else if (v === 'ng-full-name') {
              validateErrorMessages
                .push('<span ng-if="innerForm.foo.$error.fullname">First name and Last name are required</span>');
            }
          });
        }

        var errorMessages = '';

        if (validateErrorMessages.length) {
          errorMessages = [
            '<p class="input-danger" ng-show="(innerForm.foo.$dirty || submitted) && innerForm.foo.$invalid">',
            validateErrorMessages.join(''),
            '</p>'
          ].join('');
        }
        return errorMessages;
      }

      return {
        restrict: 'E',
        scope: {
          fieldModel: '=',
          fieldForm: '=',
          onSave: '&fieldOnSave'
        },
        controller: 'ppanelFormFieldLiveController',
        transclude: true,
        template: function (element, attrs) {
          var type = attrs.type,
              availableTypes = ['text', 'password', 'date', 'datetime', 'email', 'month', 'number', 'range', 'search',
                'tel', 'time', 'url', 'week'],
              validate = attrs.validation;

          if (!type || availableTypes.indexOf(type) < 0) {
            type = 'text';
          }

          var errorMessages = getErrorMessage(type, validate);

          return [
            '<i class="icon icon-edit fade" ng-if="!isSaving"></i>',
            '<i class="icon-blue-loading" ng-if="isSaving"></i>',
            '<span class="echo" ng-transclude></span>',
            '<ng-form name="innerForm">',
            '<div class="input-group ppanel-form-field-input-wrapper" style="display: none">',
            '<input name="foo" type="'+type+'" class="form-control" ng-model="fieldModel" ng-readonly="isSaving"',
            validate ? ' ' + validate : '',
            '>',
            '<span class="input-group-btn">',
              '<button class="btn btn-primary" type="button" ng-disabled="innerForm.$invalid && innerForm.$dirty">',
              '{{ isSaving ? "Saving..." : "Save"}}</button>',
            '</span>',
            '</div>',
            errorMessages ? errorMessages : '',
            '<p class="input-danger" ng-bind="updateErrorMessage" ng-if="updateErrorMessage"></p>',
            '</ng-form>',
            ].join('');
        },
        link: function(scope, element) {
          var $element = $(element);
          scope.submitted = false;
          // Show/hide icon-edit when hover field text
          $element
            .on('mouseenter', 'span.echo', function (e) {
              $element.find('.icon').addClass('in');
            })
            .on('mouseleave', 'span.echo', function () {
              $element.find('.icon').removeClass('in');
            })
          // Show text editor when click field text
            .on('click', 'span.echo', function () {
              // Backup the origin content
              oldContent = angular.copy(scope.fieldModel) || '';

              $element.find('span.echo').hide();
              $element.find('.input-group').show().find('input.form-control').focus();
            })
            .on('hidden.ppanel-field', '.ppanel-form-field-input-wrapper', function () {
              scope.$apply(function () {
                scope.fieldModel = angular.copy(oldContent);
                scope.updateErrorMessage = null;
                scope.innerForm.$setPristine();
              });
              element.find('span.echo').show();
            })
          // Save the content by talking with backend
            .on('click', '.btn', function () {
              saveElement(scope, $element);
            })
            .on('keypress', 'input.form-control', function (e) {
              if (e.which === 13) {
                saveElement(scope, $element);
              }
            });
        }
      };
    }
  );