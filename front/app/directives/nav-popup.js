angular.module('bl.analyze.solar.surface')
.directive('asNavPopup', ['$document', '$timeout',
  function ($document, $timeout) {
    var transitionMS = 150;
    $document = $($document);

    function hidePopUp ($element, $popupContainer) {
      $popupContainer.removeClass('in');
      $timeout(function () {
        $popupContainer.addClass('hide');
      }, transitionMS, false);

      $document
        .off('click.nav-popup-close' + $element.elementId)
        .off('keydown.nav-popup-close' + $element.elementId);
    }

    function bindAutoCloseEvents ($element, $popupContainer) {
      $document
        //.on('click.nav-popup-close', hidePopUp.bind
        .on('click.nav-popup-close' + $element.elementId, function (e) {
          if (e.target !== $element.find('.icon-popup-grip')[0]) {
            hidePopUp($element, $popupContainer);
          }
        })
        .on('keydown.nav-popup-close' + $element.elementId, function (e) {
          if (e.keyCode === 27) { // ESCAPE key pressed
            hidePopUp($element, $popupContainer);
          }
        });
    }

    function showPopUp ($element, $popupContainer) {
      $popupContainer.removeClass('hide').addClass('in');
      bindAutoCloseEvents($element, $popupContainer);
    }

    function bindClickEvent ($element, $popupContainer) {
      $element.on('click.nav-popup', '.icon-popup-grip', function () {
        //$animate.addClass('popup-show', $popupContainer);
        showPopUp($element, $popupContainer);
      });
    }

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    return {
      restrict: 'EA',
      scope: false,
      template: [
        '<a class="icon-popup-grip" aria-haspopup="true" aria-expanded="false"></a>',
        '<div class="nav-popup-container fade hide"><div class="nav-popup-content" ng-transclude></div></div>'
      ].join(''),
      transclude: true,
      link: function (scope, element) {
        var $element = $(element),
          elementId = guid(),
          $popupContainer = $(element).find('.nav-popup-container');
        // Event bindings
        $element['elementId'] = elementId;
        bindClickEvent($element, $popupContainer);
      }
    };
  }
]);
