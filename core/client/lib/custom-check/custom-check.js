(function() {
	$.fn.customCheckbox = function() {
		this.parent().addClass('custom-checkbox-label');
		this.wrap("<span class='custom-checkbox'></span>");
		if (this.is(":checked")) {
			this.parent().addClass("selected");
		}
		this.on('click', function() {
			$(this).parent().toggleClass("selected");
		})
		return this;
	}
})(jQuery);