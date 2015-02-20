var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.Page = Backbone.View.extend({
    tagName: 'div',
    role: "page",

    initialize: function (id) {
      _log('views.Page(' + id + '): initialize', app.LOG_DEBUG);

      this.el.id = id;
      this.id = id;
      this.template = app.templates[id];

      this.render();

      $('body').append($(this.el));

      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.Page(' + this.id + '): render', app.LOG_DEBUG);

      $(this.el).html(this.template());
      return this;
    },

    attributes: function () {
      return {
        "data-role": this.role
      };
    },

    appendBackButtonListeners: function () {
      _log('views.Page(' + this.id + '): appending Back button listeners', app.LOG_DEBUG);

      $('a[data-rel="back"]').on('click', function (e) {
        window.history.back();
        return false;
      });
    }
  });
})();