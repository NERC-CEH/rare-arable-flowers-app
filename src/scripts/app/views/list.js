var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.SpeciesList = Backbone.View.extend({
    tagName: 'ul',

    attributes: {
      'data-role': 'listview'
    },

    DEFAULT_SORT: 'taxonomic',
    FILTERS_KEY: 'listFilters',
    SORT_KEY: 'listSort',

    /**
     * An array of filters used to manage lists.
     * id - filter identifier
     * group - some filters override/work-together. eg. colours, suborder
     * label - label to represent the filter in the UI
     */
    filters: [
      {
        'id': 'probability',
        'group': 'probability',
        'label': 'Probability'
      },
      {
        'id': 'favourites',
        'group': 'favourites'
      }
    ],

    /**
     * An array of sorting options used to manage lists.
     * id - sort type identifier
     * label - label to represent the filter in the UI
     */
    sorts: [
      {
        'id': 'common_name',
        'label': 'Common Name'
      },
      {
        'id': 'common_name_r',
        'label': 'Common Name Reverse'
      },
      {
        'id': 'taxonomic',
        'label': 'Taxonomic'
      },
      {
        'id': 'taxonomic_r',
        'label': 'Taxonomic Reverse'
      },
      {
        'id': 'probability_sort',
        'label': 'Probability'
      }
    ],

    /**
     *
     */
    initialize: function () {
      this.listenTo(this.collection, 'change', this.update);
      this.listenTo(app.models.user.get('config'), 'change:filters',  this.update);
      this.listenTo(app.models.user.get('config'), 'change:sort',  this.update);
    },

    /**
     * Renders the species list.
     * @returns {SpeciesListView}
     */
    render: function () {
      var that = this;
      this.prepareList(function (list){
        var container = document.createDocumentFragment(); //optimising the performance
        _.each(list, function (specie) {
          var listSpeciesView = new SpeciesListItemView({model: specie});
          container.appendChild(listSpeciesView.render().el);
        });
        that.$el.html(container); //appends to DOM only once
      });
      return this;
    },

    update: function () {
      _log('list: updating', app.LOG_INFO);
      this.render();
      this.$el.listview('refresh');
    },

    /**
     *
     */
    prepareList: function (callback) {
      var filters = this.getCurrentFilters();
      var sort = this.getSortType();
      var list = this.collection.models.slice(); //shallow copy of array
      this.prepareListCore(list, sort, filters, callback);
    },

    /**
     *
     * @param list
     * @param sort
     * @param filters
     */
    prepareListCore: function (list, sort, filters, callback) {
      //todo: might need to move UI functionality to higher grounds
      $.mobile.loading("show");

      //filter list
      var onFilterSuccess = null;
      if (filters.length > 0) {
        var filter = filters.pop();

        onFilterSuccess = function (species) {
          app.views.listPage.listView.prepareListCore(species, sort, filters, callback);
        };

        list = this.filterList(list, filter, onFilterSuccess);
        return;
      }

      function onSortSuccess() {
        //todo: might need to move UI functionality to higher grounds
        $.mobile.loading("hide");
        if (callback) {
          callback(list);
        }
      }

      list = this.sortList(list, sort, onSortSuccess);
    },

    /**
     *
     * @param list
     * @param filter
     * @param onSuccess
     */
    filterList: function (list, filter, onSuccess) {
      var filtered_list = [];
      var grouped = this.getFilterCurrentGroup(filter);

      switch (filter.group) {
        case 'favourites':
          var keys = app.models.user.get('config').get('favourites');
          for (var i = 0; i < keys.length; i++) {
            for (var j = 0; j < list.length; j++) {
              if (list[j].attributes.id === keys[i]) {
                filtered_list.push(list[j]);
              }
            }
          }
          break;
        case 'suborder':
          for (var count = 0, list_total = list.length; count < list_total; count++) {
            for (var k = 0; k < grouped.length; k++) {
              if (grouped[k].id === list[count].type) {
                filtered_list.push(list[jcount]);
              }
            }
          }
          break;
        case 'probability':
          app.views.listPage.prob.runFilter(list, function () {
            filtered_list = app.views.listPage.prob.filterList(list);
            onSuccess(filtered_list);
          });
          return;
        default:
          _log('list: ERROR unknown list filter.');
      }
      onSuccess(filtered_list);
    },

    /**
     *
     * @param list
     * @param sort
     * @param onSuccess
     */
    sortList: function (list, sort, onSuccess) {
      switch (sort) {
        case 'probability_sort':
          app.views.listPage.prob.runFilter(list, function () {
            list.sort(app.views.listPage.prob.sort);
            onSuccess(list);
            return;
          });
          break;
        case 'taxonomic':
          list.sort(function (a, b) {
            a = a.attributes.taxon.toLowerCase();
            b = b.attributes.taxon.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
          break;
        case 'taxonomic_r':
          list.sort(function (a, b) {
            a = a.attributes.taxon.toLowerCase();
            b = b.attributes.taxon.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          break;
        case this.DEFAULT_SORT + '_r':
          list.sort(function (a, b) {
            a = a.attributes.common_name.toLowerCase();
            b = b.attributes.common_name.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          break;
        case this.DEFAULT_SORT:
        default:
          list.sort(function (a, b) {
            a = a.attributes.common_name.toLowerCase();
            b = b.attributes.common_name.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
      }
      onSuccess(list);
    },

    /**
     *
     * @returns {*|Object|Array}
     */
    getCurrentFilters: function () {
      var filtersIDs =  app.models.user.get('config').get('filters');
      var filters = this.filters;
      var currentFilters = [];
      for (var j = 0; j < filtersIDs.length; j++) {
        for (var i = 0; i < filters.length; i++) {
          if (filters[i].id === filtersIDs[j]) {
            currentFilters.push(filters[i]);
          }
        }
      }
      return currentFilters;
    },

    /**
     *
     * @param filter
     * @returns {Array}
     */
    getFilterCurrentGroup: function (filter) {
      var current_filter = this.filters;
      var grouped = [];
      for (var i = 0; i < current_filter.length; i++) {
        if (current_filter[i].group === filter.group) {
          grouped.push(current_filter[i]);
        }
      }
      return grouped;
    },

    /**
     *
     * @returns {*|Object|string}
     */
    getSortType: function () {
      return app.models.user.get('config').get('sort');
    },

    /**
     *
     * @param type
     * @returns {*|Object}
     */
    setSortType: function (type) {
      return app.models.user.get('config').set('sort', type);
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    getFilterById: function (id) {
      for (var i = 0; i < this.filters.length; i++) {
        if (this.filters[i].id === id) {
          return this.filters[i];
        }
      }
      return null;
    },

    filterFavourites : function () {
      var filter = app.views.listPage.getFilterById('favourites');
      app.views.listPage.setFilter(filter);
      $("#fav-button").toggleClass("on");

      app.views.listPage.renderList();
    }
  });

  var SpeciesListItemView = Backbone.View.extend({
    tagName: "li",

    attributes: {
      "data-corners": false,
      "data-shadow": false,
      "data-iconshadow": true,
      "data-wrapperels": "div",
      "data-icon": "arrow-r",
      "data-iconpos": "right",
      "data-theme": "c"
    },

    template: app.templates.species_list_item,

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
})();
