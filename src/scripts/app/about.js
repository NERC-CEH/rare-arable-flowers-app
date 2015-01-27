var app = app || {};
app.controller = app.controller || {};

(function ($) {
  app.controller.about = {

    pagecontainershow: function () {
      var template = $('#app-version-template').html();
      var placeholder = $('#app-version-placeholder');

      var compiled_template = Handlebars.compile(template);

      placeholder.html(compiled_template({'version': morel.CONF.VERSION}));
      placeholder.trigger('create');
    }

  };

}(jQuery));