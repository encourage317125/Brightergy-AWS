angular.module('bl.analyze.solar.surface')
  .constant('asGlobalLoadingConfig', {
    animationDelay: 600,
    animationDuration: 400
  })
  .directive('asGlobalLoading', ['$timeout', '$document', 'asGlobalLoadingConfig', 'firstLoadEventList',
  function($timeout, $document, config, firstLoadEventList) {
    var originDocumentTitle = $document.prop('title');

    var fadeOutGlobalLoading = function (element) {
      $timeout(function () {
        element.css({opacity: 0});
        $timeout(function () {
          $(element).hide();
          $document.prop('title', originDocumentTitle);
        }, config.animationDuration, false);
      }, config.animationDelay, false);
    };

    var changeTitle = function (percentage) {
      /*$timeout(function () {*/
        $document.prop('title', percentage + '% Loaded');
      /*}, 60);*/
    };

    return {
      restrict: 'E',
      scope: {
        percentage: '='
      },
      link: function(scope, element, attrs) {
        $document.prop('title', '0% Loaded');

        $timeout(function () {
          scope.percentage = Math.ceil(100 / (firstLoadEventList.length+1));
        });

        var unregister = scope.$watch('percentage', function (newVal, oldVal) {
          /*if (!newVal) {
            newVal = Math.ceil(100 / (firstLoadEventList.length+1));
          }*/
          if (newVal !== oldVal) {
            $(element)
              .find('.progress-bar')
              .css({'width': newVal+'%'})
              .find('.sr-only')
              .html(newVal + '% Completed');
            changeTitle(newVal);
            if (newVal > 99) {
              fadeOutGlobalLoading(element);
              unregister();
            }
          }
        });
      }
    };
  }]);
