/*
* Scalable Text v1.2.1 - A responsive text jQuery plugin
* Copyright 2014, Tom Doan http://www.tohodo.com/
*
* Scalable Text by Tom Doan (http://www.tohodo.com/)
* is licensed under the MIT License. Read a copy of the
* license in the LICENSE.txt file or at
* http://choosealicense.com/licenses/mit
*
* Inspired by FlowType.JS (http://simplefocus.com/)
*/

(function($) {
  $.fn.scaleText = function(oOptions) {
    var oSettings = $.extend({
        reference: null,  /* Font size will be set relative to this element */
        styles: []  /* Array of styles to scale (useful for buttons) */
      }, oOptions),
      $ref = $(oSettings.reference),
      /* Pad ratio for mobile to ensure width is smaller than reference element */
      nPxRatio = (window.devicePixelRatio && window.devicePixelRatio > 1) ? window.devicePixelRatio * 1.05 : 1,
      /* Orientation ratio to take into account landscape mode on mobile */
      nORatio = (!window.orientation || window.orientation === 0) ? 1 : 1.8,
      setFontSize = function(o, e) {
        var $o = $(o),
          /* Text font size */
          nFontSize = parseFloat($o.css('font-size')),
          /* Reference width (set to parent width by default) */
          nRefWidth = ($ref.length > 0) ? $ref.width() : $o.parent().width(),
          /* Font ratio */
          nRatio = (e) ? parseFloat(o.getAttribute('data-fontratio')) : (nFontSize / screen.width) * ($(window).width() / nRefWidth);
        // Set data-fontratio attribute only on first load
        if (!e) o.setAttribute('data-fontratio', nRatio);
		console.log("nRefWidth : ");
		console.log(nRefWidth);
		console.log("nPxRatio : ");
		console.log(nPxRatio);
        if (nRatio) $o.css('font-size', (((nRefWidth / nPxRatio) * (nRatio / nPxRatio)) * nORatio) + 'px');
        if (oSettings.styles.length > 0) {
          var nScale = parseFloat($o.css('font-size')) / nFontSize,
            oStyles = {};
          for (var i=0, imax=oSettings.styles.length; i<imax; i++) {
            oStyles[oSettings.styles[i]] = (parseFloat($o.css(oSettings.styles[i])) * nScale) + 'px';
          }
          $o.css(oStyles);
        }
      };
    return this.each(function() {
      // This scope required for resize handler
      var o = this;
      // Update font size upon resize
      $(window).resize(function(e) {
        setFontSize(o, e);
      });
      // Set font size on load
      setFontSize(o);
    });
  };
}(jQuery));
