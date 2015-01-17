(function ($) {
  app.controller = app.controller || {};
  app.controller.welcome = {

    pagecreate: function () {
      _log('welcome: pagecreate.', app.LOG_DEBUG);
    },

    pagecontainershow: function (e, data) {
      _log('welcome: pagecontainershow', app.LOG_DEBUG);
    }

  };

}(jQuery));