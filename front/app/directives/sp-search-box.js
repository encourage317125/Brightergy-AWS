angular.module('bl.analyze.solar.surface')
  .directive('asSpSearchBox', function () {
    return {
      restrict: 'E',
      require: '^ngModel',
      scope: {
        ngModel: '='
      },
      template: ['<div class="sp-search" role="search"><form class="sp-search-form" action="">',
                '<div class="sp-search-input-wrapper"><input id="sp-search-input" class="sp-search-input"',
                'type="text", placeholder="Search Sources...", autocomplete="off" ng-model="ngModel"/></div>',
                '<button type="submit" id="sp-search-submit" class="sp-source-submit">',
                '<i class="icon icon-search"></i></button></form></div>'].join(''),
      link: function (scope, element, attrs) {
        $(element).on('click', '#sp-search-submit', function (e) {
          var inputWrapper = $(element)
            .find('.sp-search-input-wrapper')
            .toggleClass('extend');
          if (inputWrapper.hasClass('extend') && !inputWrapper.find('input').val()) {
            inputWrapper.find('input').focus();
          }
          e.preventDefault();
        });

        $(element).on('blur', 'input', function (e) {
          if ($(e.relatedTarget).hasClass('sp-source-submit') || e.currentTarget.value) {
            return ;
          }

          $(element)
            .find('.sp-search-input-wrapper').removeClass('extend');
        });
      }
    };
  });