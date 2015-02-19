var app = app || {};
app.models = app.models || {};
app.collections = app.collections || {};

(function () {
  'use strict';

  var Specie = Backbone.Model.extend({
    defaults: {
      id: "",
      warehouse_id: 0,
      taxon: "",
      common_name: "",
      profile_pic: "images/sample.jpg",
      description: "",
      management: "",
      favourite: false
    }
  });

  app.collections.Species = Backbone.Collection.extend({
    model: Specie,

    initialize: function (species) {
      this.listenTo(app.models.user, 'change', this.updateFavourites);

      // Udate the species with favourites for first time
      var favourites = app.models.user.get('favourites');
      _.each(species, function(specie){
        if (favourites.indexOf(specie.id) >= 0) {
          specie.favourite = true;
        } else {
          specie.favourite = false;
        }
      });
    },

    updateFavourites: function () {
      var favourites = app.models.user.get('favourites');
      _.each(this.models, function(model){
        if (favourites.indexOf(model.get('id')) >= 0) {
          model.set('favourite', true);
        } else {
          model.set('favourite', false);
        }
      });
    }
  });

})();