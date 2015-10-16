/******************************************************************************
 * Species collection.
 *****************************************************************************/
define([
  'backbone'
], function (Backbone) {
  'use strict';

  var Specie = Backbone.Model.extend({
    defaults: {
      general: false,
      id: "",
      taxon: "",
      common_name_significant: "",
      common_name: "",
      profile_pic: "images/unknown.png",
      description: "",
      map: "",
      gallery: [],
      colour: {},
      favourite: false
    }
  });

  var Species = Backbone.Collection.extend({
    model: Specie,

    /**
     * Initializes the collection.
     *
     * @param species Array
     */
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

    /**
     * Updates the object information about user favourite species.
     */
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

  return Species;
});