/*!
 * Settings
 * http://github.com/BrighterLink/Core/components/settings
 * Version: 0.1.0 - 2015-04-03
 * License: MIT
 */

'use strict';

angular.module('blComponents.Settings', ['ngImgCrop', 'ngClipboard', 'ngFileUpload', 'ui.router'])
  .run(function () {
    console.log('Setting panel run!');
  })

  .controller('settingsWrapperController', ['$scope', 'UserService',
    function ($scope) {
    }
  ])

  .directive('settingsWrapper', function () {
    return {
      restrict: 'E',
      controller: 'settingsWrapperController',
      scope: {
        onClose: '&'
      },
      template: ['<div id="settings-wrapper">',
        '<button type="button" class="close"><span aria-hidden="true">&times;</span></button>',
        '<div class="global-settings-container" ui-view></div>',
        '</div>'].join(''),
      link: function (scope, element) {
        // Link close button
        $(element).on('click', 'button.close', scope.onClose);
        $(document).mouseup(function (e) {
          var container = $('.form-field-input-wrapper:visible').parents('form-inline-editor');
          /*$('.ppanel-form-field-input-wrapper')*/
          if (!container.is(e.target) && container.has(e.target).length === 0) {
            $('.form-field-input-wrapper:visible').hide().trigger('hidden.inline-editor');
            //container.trigger('hidden.ppanel-field').hide();
          }
        });
      }
    };
  }
);