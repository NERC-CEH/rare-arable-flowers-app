(function ($) {
  morel.controller = morel.controller || {};
  morel.controller.welcome = {

    pagecreate: function () {
      _log('welcome: pagecreate.', morel.LOG_DEBUG);
    },

    pagecontainershow: function (e, data) {
      _log('welcome: pagecontainershow', morel.LOG_DEBUG);
    }

  };

}(jQuery));