/******************************************************************************
 * Displays a self disappearing lightweight message.
 *****************************************************************************/
define(['jquery', 'jquery.mobile'], function ($, jqm) {
  /**
   *
   * @param text
   * @param time 0 if no hiding, null gives default 3000ms delay
   * @constructor
   */
  var Message = function (text, time) {
    if (!text) {
      _log('NAVIGATION: no text provided to message.', log.ERROR);
      return;
    }

    var messageId = 'morelLoaderMessage';

    text = '<div id="' + messageId + '">' + text + '</div>';

    $.mobile.loading('show', {
      theme: "b",
      textVisible: true,
      textonly: true,
      html: text
    });

    //trigger JQM beauty
    $('#' + messageId).trigger('create');

    if (time !== 0) {
      setTimeout(function () {
        $.mobile.loading('hide');
      }, time || 3000);
    }
  };

  app.message = Message;
});
