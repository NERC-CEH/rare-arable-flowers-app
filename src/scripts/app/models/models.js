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
      this.updateFavourites();
      this.listenTo(app.models.user.get('config'), 'change', this.updateFavourites)
    },

    updateFavourites: function () {
      var favourites = app.models.user.get('config').get('favourites');
      for (var fav_count = 0, length = favourites.length; fav_count < length; fav_count++) {
        var model =_.find(app.collections.species.models, function(item){
          return item.get('id') == favourites[fav_count];
        });
        model.set('favourite', true);
      }
    }
  });

  var UserConfig = Backbone.Model.extend({
    defaults: {
      sort: 'common_name',
      filters: [],
      favourites: []
    },

    toggleFavourite: function (speciesID) {
      var favourites = this.get('favourites');

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

    toggleSpeciesFilter: function (filter) {
      var filters = this.get('filters');
      if (_.indexOf(filters, filter) >= 0) {
        filters = _.without(filters, filter);
      } else {
        filters.push(filter);
      }

      this.set('filters', filters);
    },

    setFilter: function (filter) {
      var filters = this.getCurrentFilters();

      for (var i = 0; i < filters.length; i++) {
        if (filters[i].id === filter.id) {
          this.removeFilter(filter);
          return;
        }
      }
      filters.push(filter);
      morel.settings(this.FILTERS_KEY, filters);
    },

    removeFilter: function (filter) {
      var filters = this.getCurrentFilters();
      var index = -1;
      for (var i = 0; i < filters.length; i++) {
        if (filters[i].id === filter.id) {
          index = i;
        }
      }

      if (index !== -1) {
        filters.splice(index, 1);
        morel.settings(this.FILTERS_KEY, filters);
      }
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