var app = app || {};
app.controller = app.controller || {};

(function ($) {
  app.controller.welcome = {

    init: function () {
      _log('welcome: init.', morel.LOG_DEBUG);
    },

    show: function (e, data) {
      _log('welcome: show', morel.LOG_DEBUG);
    }

  };

}(jQuery));