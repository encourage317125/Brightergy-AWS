angular.module('bl.analyze.solar.surface')
  .constant('asElementShowLoadingConfig', {
    animationDelay: 150
  })
  .directive('asElementShowLoading', ['$timeout', 'asElementShowLoadingConfig',
    function($timeout, config) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var loadingOverlay = $('<div class="loading-animation fade"></div>').prependTo(element).hide();

        if (attrs.asElementShowLoading === 'true') {
          loadingOverlay.show().addClass('in'); // show
        }

        attrs.$observe('asElementShowLoading', function (value) {
          if (value === 'true') {
            loadingOverlay.show().addClass('in'); // show
          } else {
            loadingOverlay.removeClass('in'); // hide
            $timeout(function () {
              loadingOverlay.hide();
            }, config.animationDelay, false);
          }
        });

        scope.$on('SHOW_SOURCE_LOADING', function(event, broadCastArg) {
          if ( broadCastArg.showLoading === true ) {
            loadingOverlay.show().addClass('in');
          } else {
            loadingOverlay.hide();
          }
        });
      }
    };
  }]);