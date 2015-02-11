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

    initialize: function () {
      this.listenTo(app.models.user.get('config'), 'change', this.updateFavourites);
      this.updateFavourites();
    },

    updateFavourites: function () {
      var favourites = app.models.user.get('config').get('favourites');
      _.each(this.models, function(model){
        if (favourites.indexOf(model.get('id')) >= 0) {
          model.set('favourite', true);
        } else {
          model.set('favourite', false);
        }
      });
    }
  });


  var UserConfig = Backbone.Model.extend({
    defaults: {
      sort: 'common_name',
      filters: [],
      favourites: []
    },

    toggleFavouriteSpecies: function (speciesID) {
      var favourites = _.clone(this.get('favourites'));  //CLONING problem as discussed:
      //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change

      if (_.indexOf(favourites, speciesID) >= 0) {
        favourites = _.without(favourites, speciesID);
      } else {
        favourites.push(speciesID);
      }

      this.set('favourites', favourites);
    },

    isFavourite: function (speciesID) {
      var favourites = this.get('favourites');
      return _.indexOf(favourites, speciesID);
    },

    toggleListFilter: function (filterID) {
      var filters = _.clone(this.get('filters'));  //CLONING problem as discussed:
      //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change

      if (_.indexOf(filters, filterID) >= 0) {
        filters = _.without(filters, filterID);
      } else {
        filters.push(filterID);
      }

      this.set('filters', filters);
    }
  });

  var User = Backbone.Model.extend({
    defaults: {
      name: '',
      email: '',
      location: null,
      config: new UserConfig()
    }
  });

  //create global user
  app.models.user = new User();

})();