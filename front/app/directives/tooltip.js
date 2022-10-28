angular.module('bl.analyze.solar.surface')
  .directive('asTooltip', function () {
    var addToolTip = function (scope, element, attrs) {
      var position = attrs['tooltipPosition'] || 'bottom left',
        classes = attrs['tooltipClasses'] || '',
        contentDom = attrs['tooltipContentDom'] || '';

      classes += ' drop-theme-arrows';
      if (!contentDom && !scope.contentString) {
        console.log('Error in asTooltip directive: as-tooltip value is missing');
        return;
      }
      var content = contentDom
        ? document.querySelector(contentDom)
        : function () { return scope.contentString; };

      return new Drop({
        target: element[0],
        classes: classes,
        content: content,
        position: position,
        openOn: 'hover',
        constrainToWindow: true,
        remove: true,
        tetherOptions: {
          constraints: [{
            to: 'window',
            pin: true,
            attachment: 'together'
          }]
        }
      });
    };

    return {
      restrict: 'A',
      scope: {
        contentString: '=tooltipText'
      },
      compile: function (element) {
        element.addClass('has-tooltip');

        return addToolTip;
      }
    };
  });
