var app = app || {};
app.controller = app.controller || {};

(function ($) {
  app.controller.about = {

    show: function () {
      var template_src = $('#app-version-template').html();
      var placeholder = $('#app-version-placeholder');

      var template = _.template(template_src);

      placeholder.html(template({'version': morel.CONF.VERSION}));
      placeholder.trigger('create');
    }

  };

}(jQuery));