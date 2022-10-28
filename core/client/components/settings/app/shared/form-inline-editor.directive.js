'use strict';

angular.module('blComponents.Settings')
  .controller('formInlineEditorController', ['$scope',
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
  .directive('formInlineEditor',
  function() {
    var oldContent;
    function hideTextEditor (element) {
      element.find('.form-field-input-wrapper').hide();
      element.find('span.echo').show();
    }

    function saveElement (scope, element) {
      if (scope.innerForm.$invalid) {
        scope.$apply(function () {
          scope.submitted = true;
        });
        return false;
      }

      hideTextEditor(element);
      return scope
        .saveElement()
        .then(
          function () {},
          function () {
            scope.fieldModel = angular.copy(oldContent);
          }
        );
    }

    function getErrorMessage(type, validate) {
      var validateErrorMessages = [];

      if (type === 'email') {
        validateErrorMessages.push(
            '<span ng-if="innerForm.foo.$error.email">Email has some mysthical error!</span>'
        );
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
              'Please input a valid phone number!</span>');
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
      controller: 'formInlineEditorController',
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
          '<div class="input-group form-field-input-wrapper" style="display: none">',
          '<input name="foo" type="'+type+'" class="form-control" ng-model="fieldModel" required',
            validate ? ' ' + validate : '',
          '>',
          '<span class="input-group-btn">',
            '<button class="btn btn-primary" type="button" ng-disabled="innerForm.$invalid && innerForm.$dirty">',
              '&#10004;',
            '</button>',
          '</span>',
          '</div>',
          errorMessages ? errorMessages : '',
          '</ng-form>'
        ].join('');
      },
      link: function(scope, element, attrs) {
        var $element = $(element);
        scope.submitted = false;
        // Show/hide icon-edit when hover field text
        $element
          .on('mouseenter', 'span.echo', function () {
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
            $element.find('.form-field-input-wrapper')
              .show()
              .find('input.form-control')
              .focus();
              //alert(oldContent);
          })
          .on('hidden.inline-editor', '.form-field-input-wrapper', function () {
            scope.$apply(function () {
              scope.fieldModel = angular.copy(oldContent);
              scope.innerForm.$setPristine();
            });
            $element.find('span.echo').show();
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


