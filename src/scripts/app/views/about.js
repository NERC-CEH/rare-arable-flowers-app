var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.AboutPage = app.views.Page.extend({
    id: 'about',

    template: app.templates.about,

    initialize: function () {
      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      //update the app version number

      $('body').append($(this.el));
      return this;
    }

  });
})();