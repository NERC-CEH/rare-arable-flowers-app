(function ($) {
  morel.controller = morel.controller || {};
  morel.controller.about = {

    pagecontainershow: function () {
      var template = $('#app-version-template').html();
      var placeholder = $('#app-version-placeholder');

      var compiled_template = Handlebars.compile(template);

      placeholder.html(compiled_template({'version': morel.CONF.VERSION}));
      placeholder.trigger('create');
    }

  };

}(jQuery));