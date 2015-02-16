var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.AboutPage = app.views.Page.extend({
    id: 'about',

    template: app.templates.about,

    initialize: function () {
      _log('views.AboutPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.AboutPage: render', app.LOG_DEBUG);

      this.$el.html(this.template());

      //update the app version number

      $('body').append($(this.el));
      return this;
    }

  });
})();