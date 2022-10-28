'use strict';

angular.module('blComponents.platformPanel')
  .directive('teamMemberList', function() {
    function setCustomScroll(element) {
      var height = $(window).height();
      height = height - 220;
      $(element).mCustomScrollbar({
        setHeight: height
      });
    }

    return {
      restrict: 'E',
      templateUrl: '/components/platform-panel/app/templates/team-member-list.html',
      link: function(scope, element, attrs) {
        setCustomScroll(element.find('.list-team-member'));
        $(window).resize(function () {
          var windowWidth = $(window).width();
          if (windowWidth < 1200) {
            $(element).find('.list-team-member').mCustomScrollbar('destroy');
          } else {
            setCustomScroll(element.find('.list-team-member'));
          }
        });
      }
    };
  });