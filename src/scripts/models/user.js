var app = app || {};
app.models = app.models || {};

(function () {
  'use strict';

  var User = Backbone.Model.extend({
    id: 'user',

    defaults: {
      name: '',
      email: '',
      password: '',
      location: null,
      location_acc: -1,
      sort: 'common_name',
      filters: [],
      favourites: []
    },

    initialize: function () {
      this.fetch();
    },

    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Store(app.CONF.NAME),

    signOut: function () {
      this.set('email', '');
      this.set('password', '');
      this.save();
    },

    toggleFavouriteSpecies: function (speciesID) {
      var favourites = _.clone(this.get('favourites'));  //CLONING problem as discussed:
      //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change

      if (_.indexOf(favourites, speciesID) >= 0) {
        favourites = _.without(favourites, speciesID);
      } else {
        favourites.push(speciesID);
      }

      this.save('favourites', favourites);
    },

    isFavourite: function (speciesID) {
      var favourites = this.get('favourites');
      return _.indexOf(favourites, speciesID) >= 0;
    },

    toggleListFilter: function (filterID) {
      var filters = _.clone(this.get('filters'));  //CLONING problem as discussed:
      //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change

      var exists = this.hasListFilter(filterID, filters);
      if (exists) {
        filters = _.without(filters, filterID);
      } else {
        filters.push(filterID);
      }

      this.set('filters', filters);
      this.save();

      return !exists; //return the state of the filter added/removed
    },

    hasListFilter: function (filterID, filters) {
      filters = filters || this.get('filters');
      return _.indexOf(filters, filterID) >= 0;
    }
  });

  //create global
  app.models.user = new User();

})();