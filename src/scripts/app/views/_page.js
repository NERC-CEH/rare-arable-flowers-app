var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.Page = Backbone.View.extend({
    tagName: 'div',
    role: "page",

    initialize: function (id) {
      this.el.id = id;
      this.id = id;
      this.template = app.templates[id];

      this.render();

      $('body').append($(this.el));

      $('a[data-role="button"]').on('click', function (event) {
        var $this = $(this);
        if ($this.attr('data-rel') === 'back') {
          window.history.back();
          return false;
        }
      });
    },

    render: function () {
      $(this.el).html(this.template());
      return this;
    },

    attributes: function () {
      return {
        "data-role": this.role
      };
    }
  });
})();