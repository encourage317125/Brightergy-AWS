angular.module('bl.analyze.solar.surface')
  .constant('asMorePanelConfig', {
    mobileScreenWidth: '767'
  })
  .directive('asMorePanel', function () {
    var getID = function () {
      return 'morePanel-' + Math.random().toString(36).substr(2, 9);
    };
    var id = getID();
    return {
      restrict: 'E',
      template: [
        '<a class="toggle-more-panel icon icon-ui-info" as-tooltip tooltip-position="{{ position }}"',
        'tooltip-classes="more-tooltip {{classes}}" tooltip-content-dom="#', id,'"></a>',
        '<div id="', id,'" class="more-panel">',
          '<h5 class="title" ng-bind="panelTitle"></h5>',
          '<div class="inner" ng-transclude></div>',
        '</div>'].join(''),
      replace: false,
      transclude: true,
      scope: {
        panelTitle: '@',
        position: '@',
        classes: '@'
      },
      link: function (scope, element, attrs) {
      }
    };
  });
