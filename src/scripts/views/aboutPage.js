/******************************************************************************
 * Management Locations page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates'
], function (Page) {
  'use strict';

  var About = Page.extend({
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
  return About;
});