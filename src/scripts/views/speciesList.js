/******************************************************************************
 * Species list view used in ListPage view.
 *****************************************************************************/
define([
  'backbone',
  'templates'
], function (Backbone) {
  'use strict';

  var SpeciesList = Backbone.View.extend({
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
      typeGroup: {
        type: 'checkbox',
        label: 'Plant type',

        filters: {
          grass: {
            label: 'Grasses',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.type === 'G' || list[j].attributes.general) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          },
          flower: {
            label: 'Flowers',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.type === 'F' || list[j].attributes.general) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          }
        }
      },
      favouritesGroup: {
        filters: {
          favourites: {
            run: function (list, filteredList, onSuccess) {
              var keys = app.models.user.get('favourites');
              for (var i = 0; i < keys.length; i++) {
                for (var j = 0; j < list.length; j++) {
                  if (list[j].attributes.id === keys[i]) {
                    filteredList.push(list[j]);
                  }
                }
              }
              onSuccess(filteredList);
            }
          }
        }
      },
      colorGroup: {
        type: 'checkbox',
        label: 'Color',

        filters: {
          yellow: {
            label: 'Yellow',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.color.indexOf('y') >= 0) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          },
          purple: {
            label: 'Purple',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.color.indexOf('pu') >= 0) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          },
          white: {
            label: 'White',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.color.indexOf('w') >= 0) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          },
          green: {
            label: 'Green',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.color.indexOf('gf') >= 0) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          },
          blue: {
            label: 'Blue',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.color.indexOf('b') >= 0) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          },
          orange: {
            label: 'Orange',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.color.indexOf('o') >= 0) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          },
          red: {
            label: 'Red',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.color.indexOf('r') >= 0) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          },

          ping: {
            label: 'Pink',
            run: function (list, filteredList, onSuccess) {
              for (var j = 0; j < list.length; j++) {
                if (list[j].attributes.color.indexOf('p') >= 0) {
                  filteredList.push(list[j]);
                }
              }
              onSuccess(filteredList);
            }
          }
        }
      }
    },

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
            if (a.attributes.general || b.attributes.general){
              return a.attributes.general ? 1 : -1;
            }
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
            if (a.attributes.general || b.attributes.general){
              return a.attributes.general ? 1 : -1;
            }
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
            if (a.attributes.general || b.attributes.general){
              return a.attributes.general ? 1 : -1;
            }
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
            if (a.attributes.general || b.attributes.general){
              return a.attributes.general ? 1 : -1;
            }
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
     * Initializes the species list view.
     */
    initialize: function () {
      _log('views.SpeciesList: initialize', log.DEBUG);

      this.listenTo(this.collection, 'change', this.update);
      this.listenTo(app.models.user, 'change:filters',  this.update);
      this.listenTo(app.models.user, 'change:sort',  this.update);
    },

    /**
     * Renders the species list.
     * @returns {SpeciesListView}
     */
    render: function (callback) {
      _log('views.SpeciesList: render', log.DEBUG);

      var that = this;
      var onSuccess = function (list){
        var container = document.createDocumentFragment(); //optimising the performance
        _.each(list, function (specie) {
          var listSpeciesView = new SpeciesListItemView({model: specie});
          container.appendChild(listSpeciesView.render().el);
        });
        that.$el.html(container); //appends to DOM only once
        if (callback){
          callback(that.$el);
        }
      };

      this.prepareList(onSuccess);
      return this;
    },

    update: function () {
      _log('list: updating', log.DEBUG);
      this.render(function($el){
        $el.listview('refresh');
      });
    },

    /**
     * Prepares the species list - filters, sorts.
     */
    prepareList: function (callback) {
      var filtersToApply = _.cloneDeep(app.models.user.get('filters'));
      var sort = app.models.user.get('sort');
      var list = this.collection.models.slice(); //shallow copy of array
      this.prepareListCore(list, sort, filtersToApply, callback);
    },

    /**
     * Prepares the species list. Core functionality.
     *
     * @param list
     * @param sort
     * @param filters
     */
    prepareListCore: function (list, sort, filtersToApply, callback) {
      //todo: might need to move UI functionality to higher grounds
      $.mobile.loading("show");

      var that = this;
      //filter list
      var filterGroups = Object.keys(filtersToApply);
      if (filterGroups.length > 0) {
        var filterGroupID = filterGroups[0];
        var filterGroup = filtersToApply[filterGroupID];
        if (filterGroup.length > 0) {
          var onFilterGroupSuccess = function (species) {
            delete filtersToApply[filterGroup];
            that.prepareListCore(species, sort, filtersToApply, callback);
            return;
          };

          this.filterGroupCore(list, [], filterGroup, filterGroupID, onFilterGroupSuccess);
          return;
        } else {
          delete filtersToApply[filterGroupID];
          that.prepareListCore(list, sort, filtersToApply, callback);
          return;
        }
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
     * Iterates through the grouped filters applying them to the list.
     *
     * @param list
     * @param filteredList
     * @param filterGroup filters to apply
     * @param filterGroupID
     * @param callback
     */
    filterGroupCore: function (list, filteredList, filterGroup, filterGroupID, callback) {
      if (filterGroup.length > 0) {
        var filterID = filterGroup.pop();
        var filter = this.filters[filterGroupID].filters[filterID];
        var that = this;

        var onSuccess = function (filteredList) {
          var uniqueFilteredList = _.uniq(filteredList);
          that.filterGroupCore(list, uniqueFilteredList, filterGroup, filterGroupID, callback);
        };
        filter.run(list, filteredList, onSuccess);

      } else {
        callback(filteredList);
      }
    },

    /**
     * Returns the roup of the filterID.
     *
     * @param filter
     * @returns {Array}
     */
    getFilterCurrentGroup: function (filterID) {
      //iterate all filter groups
      var group = null;
      _.each(this.filters, function (groupFilters, groupID) {
        //and filters
        _.each(groupFilters.filters, function (_filter, _filterID) {
          if(_filterID === filterID) {
            group = groupID;
          }
        });
      });

      return group;
    },

    /**
     * Filters the species list to favourites only.
     */
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

    /**
     * Renders the individual list item representing the species.
     *
     * @returns {SpeciesListItemView}
     */
    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return SpeciesList;
});
