jQuery.fn.fontSelector = function(options) {

    var settings = $.extend({
        'hide_fallbacks': false,
        'selected': function(style) {},
        'initial': '',
        'callback': function(text, css) {}
    }, options);

    return this.each(function() {

        var root = $(this);
        var ul = $(this).find('ul');
        ul.hide();
        var visible = false;

        if (settings['initial'] != '') {
            if (settings['hide_fallbacks']) root.find('span').html(settings['initial'].substr(0, settings['initial'].indexOf(',')));
            else root.find('span').html(settings['initial']);

            root.css('font-family', settings['initial']);
        }

        ul.find('li').each(function() {
            $(this).css("font-family", $(this).text());

            if (settings['hide_fallbacks']) {
                var content = $(this).text();
                $(this).text(content.substr(0, content.indexOf(',')));
            }
        });

        ul.find('li').click(function() {

            if (!visible) return;

            ul.slideUp('fast', function() {
                visible = false;
            });

            root.find('span').html($(this).text());

            settings['callback']($(this).text(), $(this).css('font-family'));

            root.css('font-family', $(this).css('font-family'));

            settings['selected']($(this).css('font-family'));
        });


        $(this).click(function(event) {

            if (visible) return;

            event.stopPropagation();

            ul.slideDown('fast', function() {
                visible = true;
            });
        });

        $('html').click(function() {
            if (visible) {
                ul.slideUp('fast', function() {
                    visible = false;
                });
            }
        })
    });
}