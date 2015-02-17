var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.SpeciesList = Backbone.View.extend({
    tagName: 'ul',

    attributes: {
      'data-role': 'listview'
    },

    /**
     * A collection of filters used to manage lists.
     * id - filter identifier
     * group - some filters override/work-together. eg. colours, suborder
     * label - label to represent the filter in the UI
     */
    filters: {
      //probability: {
      //  probability:{
      //    label: 'Probability',
      //    filter: function (list, onSuccess) {
      //      app.views.listPage.prob.runFilter(list, function () {
      //        var filtered_list = app.views.listPage.prob.filterList(list);
      //        onSuccess(filtered_list);
      //      });
      //    }
      //}},
      favourites: {
        favourites: {
          id: 'favourites',
          group: 'favourites',
          filter: function (list, onSuccess) {
            var filtered_list = [];
            var keys = app.models.user.get('favourites');
            for (var i = 0; i < keys.length; i++) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.id === keys[i]) {
                  filtered_list.push(list[j]);
                }
              }
            }
            onSuccess(filtered_list);
          }
        }}
    },

    DEFAULT_SORT: 'scientific',

    /**
     * A collection of sorting options used to manage lists.
     * id - sort type identifier
     * label - label to represent the filter in the UI
     */
    sorts: {
      common_name: {
        label: 'Common Name',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = a.attributes.common_name.toLowerCase();
            b = b.attributes.common_name.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
          onSuccess(list);
        }
      },
      common_name_r: {
        label: 'Common Name Reverse',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = a.attributes.common_name.toLowerCase();
            b = b.attributes.common_name.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          onSuccess(list);
        }
      },
      scientific: {
        label: 'Scientific Name',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = a.attributes.taxon.toLowerCase();
            b = b.attributes.taxon.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
          onSuccess(list);
        }
      },
      scientific_r: {
        label: 'Scientific Name Reverse',
        sort: function (list, onSuccess) {
          list.sort(function (a, b) {
            a = a.attributes.taxon.toLowerCase();
            b = b.attributes.taxon.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          onSuccess(list);
        }
      }
    },

    /**
     *
     */
    initialize: function () {
      _log('views.SpeciesList: initialize', app.LOG_DEBUG);

      this.listenTo(this.collection, 'change', this.update);
      this.listenTo(app.models.user, 'change:filters',  this.update);
      this.listenTo(app.models.user, 'change:sort',  this.update);
    },

    /**
     * Renders the species list.
     * @returns {SpeciesListView}
     */
    render: function (onSuccess) {
      _log('views.SpeciesList: render', app.LOG_DEBUG);

      var that = this;
      this.prepareList(function (list){
        var container = document.createDocumentFragment(); //optimising the performance
        _.each(list, function (specie) {
          var listSpeciesView = new SpeciesListItemView({model: specie});
          container.appendChild(listSpeciesView.render().el);
        });
        that.$el.html(container); //appends to DOM only once
        if (onSuccess){
          onSuccess(that.$el);
        }
      });
      return this;
    },

    update: function () {
      _log('list: updating', app.LOG_INFO);
      this.render(function($el){
        $el.listview('refresh');
      });
    },

    /**
     *
     */
    prepareList: function (callback) {
      var filters = _.clone(app.models.user.get('filters'));
      var sort = app.models.user.get('sort');
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

      var that = this;
      //filter list
      var onFilterSuccess = null;
      if (filters.length > 0) {
        var filter = filters.pop();

        onFilterSuccess = function (species) {
          that.prepareListCore(species, sort, filters, callback);
        };

        var group = this.getFilterCurrentGroup(filter);

        this.filters[group][filter].filter(list, onFilterSuccess);
        return;
      }

      function onSortSuccess() {
        //todo: might need to move UI functionality to higher grounds
        $.mobile.loading("hide");
        if (callback) {
          callback(list);
        }
      }

      this.sorts[sort].sort(list, onSortSuccess);
    },

    /**
     * Returns the roup of the filterID.
     *
     * @param filter
     * @returns {Array}
     */
    getFilterCurrentGroup: function (filterID) {
      var group = null;
      //iterate all filter groups
      _.each(this.filters, function (groupFilters, groupID) {
        //and filters
        _.each(groupFilters, function (_filter, _filterID) {
          if(_filterID === filterID) {
            group = groupID;
          }
        });
      });

      return group;
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
