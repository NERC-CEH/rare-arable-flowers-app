var app = app || {};
app.models = app.models || {};

(function () {
  'use strict';

  var App = Backbone.Model.extend({

    id: 'app',

    localStorage: new Store(app.CONF.NAME),

    initialize: function () {
      this.fetch();
      if (!this.get('appVer')) {
        this.save ('appVer', app.CONF.VERSION);
      }
    }

  });

  app.models.app = new App();
})();