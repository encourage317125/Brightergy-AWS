angular.module('bl.analyze.solar.surface')
.factory('SourceNotification',['$timeout',
  function ($timeout) {

    /**
     *
     * @param targetSelector {string}
     * @constructor
     */
    function SourceNotify (targetSelector) {
      var message = 'You must have at least one source selected';
      this.targetSelector = targetSelector;
      this.$handle = $('<div class="source-notify">'
        + '<div class="source-notify-arrow"></div><div class="source-notify-icon"></div>'
        + '<div class="source-notify-message">' + message + '</div></div>');
    }

    SourceNotify.prototype.showNotification = function () {
      if ($('.source-notify').length) {
        return false;
      }

      var offset = $(this.targetSelector).parents('li').offset(),
        left = offset.left - 12,
        top = offset.top - $(window).scrollTop() - 60,
        handle = this.$handle;

      $(document.body).append(handle);

      $(handle).css({left: left, top: top});
      handle.fadeIn(200);
      $timeout(function() {
        handle.fadeOut(400, function() {
          handle.remove();
        });
      }, 3200, false);
    };

    return SourceNotify;
  }]);