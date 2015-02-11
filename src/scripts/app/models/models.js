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
    filter: false,
    sort: 'name'
  });

  var UserConfig = Backbone.Model.extend({
    defaults: {
      sort: 'common_name',
      filters: []
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