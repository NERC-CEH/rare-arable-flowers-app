var app = app || {};
app.controller = app.controller || {};

(function ($) {
  app.controller.welcome = {

    pagecreate: function () {
      _log('welcome: pagecreate.', morel.LOG_DEBUG);
    },

    pagecontainershow: function (e, data) {
      _log('welcome: pagecontainershow', morel.LOG_DEBUG);
    }

  };

}(jQuery));