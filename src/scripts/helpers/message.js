/******************************************************************************
 * Displays a self disappearing lightweight message.
 *****************************************************************************/
define(['jquery', 'jquery.mobile'], function ($, jqm) {

    $('body').append("<div class='ui-loader-background'> </div>");

    /**
     *
     * @param text
     * @param time 0 if no hiding, null gives default 3000ms delay
     * @constructor
     */
    var Message = function (text, time, callback) {
        var CLOSE_ID = 'loader-close',
            CLOSE_HTML = '<div id="' + CLOSE_ID + '" class="ui-btn ui-loader-close ui-icon-delete ui-btn-icon-notext ui-btn-right"></div>';

        if (!text) {
            _log('NAVIGATION: no text provided to message.', log.ERROR);
            return;
        }

        if (typeof text !== 'string') {
            text =
                "<h2>Sorry :(</h2>" +
                '<p>' +
                    (text.message || 'Some problem occurred') +
                    (text.number ? ' <small><i>(code: ' + text.number + ')</i></small>' : '') +
                '</p>';
        }

        var messageId = 'loaderMessage';
        var html = '<div id="' + messageId + '">' + (callback ? CLOSE_HTML : '') + text + '</div>';

        $.mobile.loading('show', {
            theme: "b",
            textVisible: true,
            textonly: true,
            html: html
        });

        //trigger JQM beauty
        $('#' + messageId).trigger('create');

        $('#' + CLOSE_ID).on('click', function () {
            $.mobile.loading('hide');
            typeof callback === 'function' && callback();
        });

        if (time !== 0) {
            setTimeout(function () {
                $.mobile.loading('hide');
            }, time || 3000);
        }
    };

    return Message;
});
