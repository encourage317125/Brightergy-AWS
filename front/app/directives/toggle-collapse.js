angular.module('bl.analyze.solar.surface')
  .directive('asToggleCollapse', function () {
    /*function setDrillDownModalPosition (expanded) {
      var leftMargin = expanded ? 500 : 60;
      $('.modal.drilldown.in').css({left: leftMargin + 'px'});
    }
*/
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (!attrs.asToggleCollapse) {
          return false;
        }

        $(element).click(function () {
          $(attrs.asToggleCollapse).toggleClass('collapsed');

          $('.drilldown.modal').toggleClass('opened-sp');
          $('.drilldown.modal .ng-scope').toggleClass('opened-sp');

          $('body').toggleClass('collapsed');

          $(window).trigger('resize');

          //setDrillDownModalPosition(!$('body').hasClass('collapsed'));
        });
      }
    };
  });