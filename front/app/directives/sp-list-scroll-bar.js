angular.module('bl.analyze.solar.surface')
  .constant('mobileWidth', 767)
  .directive('asSpListScrollBar',
    ['$rootScope', '$window', 'mobileWidth',
    function ($rootScope, $window, mobileWidth) {
      var setCustomScrollBar = function (element, height) {
        $(element).mCustomScrollbar({
          axis: 'y',
          theme: 'light',
          setHeight: height,
          callbacks: {
            whileScrolling: function() {
              var tooltipWrappers = $(element).find('.drop-enabled[as-tooltip]');
              for (var idx = 0; idx < tooltipWrappers.length; idx++) {
                $(tooltipWrappers[idx]).data('dropBox').close();
              }
            }
          }
        });
      };

      // It should return the height of visible part of element.
      var getHeightOfViewport = function (element) {
        var totalHeight = $window.innerHeight;

        var elementOffset = /*$position.offset(element);*/$(element).position();
        return totalHeight - elementOffset.top; //;
      };

      var getHeightOfTable = function () {
        var totalHeight = $(window).height() + $(window).scrollTop();
        
        var elementOffsetTop = 500; // offset top of table
        return totalHeight - elementOffsetTop - 10;
      };

      var updateWhenBrowserResize = function (element) {
        $(window).resize(function () {
          var windowWidth = $(window).width();
          var newHeight;
          if (windowWidth <= mobileWidth) { // if size is mobile size
            newHeight = 400;
          } else {
            newHeight = getHeightOfViewport(element);
          }

          $(element).css({
            'height': newHeight + 'px'
          });
        });
      };

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var visibleHeight;
          if (attrs.scrollWrapperHeight) {
            visibleHeight = attrs.scrollWrapperHeight;
            setCustomScrollBar(element, visibleHeight);
          } else if (attrs.widgetTable === 'generation-per-month') {
            visibleHeight = getHeightOfTable(element);
            setCustomScrollBar(element, visibleHeight);
          } else {
            visibleHeight = getHeightOfViewport(element);
            setCustomScrollBar(element, visibleHeight);
            updateWhenBrowserResize(element);
          }
        }
      };
    }
  ]);