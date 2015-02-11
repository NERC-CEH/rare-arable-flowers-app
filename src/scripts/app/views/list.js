var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.ListPage = app.views.Page.extend({
    id: 'list',

    template: app.templates.list,

    events: {
      'click #list-controls-save-button': 'toggleListControls',
      'click #list-controls-button': 'toggleListControls',
      'click #fav-button': 'toggleListFavourites'
    },

    initialize: function () {
      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());
      this.$list = this.$el.find('#list-placeholder');

      var list = new app.views.List({collection: app.collections.species});

      this.$list.html(list.render().el);

      $('body').append($(this.el));

      return this;
    },

    toggleListFavourites: function () {
      var userConfig = app.models.user.get('config');
      userConfig.toggleSpeciesFilter('favourites');
    },

    filter: function () {

    },

    sort: function () {

    },
    /**
     * Shows/closes list controlls.
     */
    toggleListControls: function (e) {
      var $controls = $('#list-controls-placeholder');
      if ($controls.is(":hidden")) {
        $controls.slideDown("slow");
      } else {
        $controls.slideUp("slow");
      }
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
    renderList: function (callback) {
      var filters = this.getCurrentFilters();
      var sort = this.getSortType();
      var species = app.data.species;
      if (species) {
        this.renderListCore(species, sort, filters, callback);
      }
    },

    /**
     *
     * @param list
     * @param sort
     * @param filters
     */
    renderListCore: function (list, sort, filters, callback) {
      //todo: might need to move UI functionality to higher grounds
      $.mobile.loading("show");

      //filter list
      var onFilterSuccess = null;
      if (filters.length > 0) {
        var filter = filters.pop();

        onFilterSuccess = function (species) {
          app.views.listPage.renderListCore(species, sort, filters);
        };

        list = this.filterList(list, filter, onFilterSuccess);
        return;
      }

      function onSortSuccess() {
        if (list) {
          app.views.listPage.printList(list);
          $.mobile.loading("hide");

          if (callback) {
            callback();
          }
        }
      }

      list = this.sortList(list, sort, onSortSuccess);
    },


    /**
     * Prints the species list.
     * @param species
     */
    printList: function (species) {
      //assign favourites
      var s = objClone(species);

      var favourites = this.getFavourites();
      var keys = Object.keys(favourites);
      for (var j = 0; j < s.length; j++) {
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === s[j].id) {
            s[j].favourite = "favourite";
          }
        }
      }

      var placeholder = $('#list-placeholder');

      placeholder.html(app.templates.species_list({'species': s}));
      placeholder.trigger('create');

      /*
       iOS app mode a link fix, making the HOME-MODE app not to redirect
       browser window to Safari's new tab.
       Will fix all a tagged elements with the class 'ios-enhanced'
       */
      $("a.ios-enhanced").click(function (event) {
        event.preventDefault();
        window.location = jQuery(this).attr("href");
      });
    },

    /**
     *
     */
    makeListControls: function () {
      this.makeListSortControls();
      this.makeListFilterControls();
      this.setListControlsListeners();
    },

    /**
     *
     */
    makeListSortControls: function () {
      for (var i = 0; i < this.sorts.length; i++) {
        var sort = this.getSortType();
        if (this.sorts[i].id === sort) {
          this.sorts[i].checked = "checked";
        }
      }

      var placeholder = $('#list-controls-sort-placeholder');

      placeholder.html(app.templates.list_controls_sort(this.sorts));
      placeholder.trigger('create');
    },

    /**
     *
     */
    makeListFilterControls: function () {
      var filtersToRender = [];
      var currentFilters = this.getCurrentFilters();

      for (var i = 0; i < this.filters.length; i++) {
        //only render those that have label
        if (this.filters[i].label) {
          for (var j = 0; j < currentFilters.length; j++) {
            if (currentFilters[j].id === this.filters[i].id) {
              this.filters[i].checked = "checked";
            } else {
              this.filters[i].checked = "";
            }
          }
          filtersToRender.push(this.filters[i]);
        }
      }

      var placeholder = $('#list-controls-filter-placeholder');

      placeholder.html(app.templates.list_controls_filter(filtersToRender));
      placeholder.trigger('create');
    },

    /**
     * Has to be done once on list creation.
     */
    setListControlsListeners: function () {
      //initial list control button setup
      var filters = app.views.listPage.getCurrentFilters();
      if (filters.length === 1 && filters[0].id === 'favourites') {
        filters = [];
      }
      $('#list-controls-button').toggleClass('on', filters.length > 0);

      $('.sort').on('change', function () {
        app.views.listPage.setSortType(this.id);
        app.views.listPage.renderList();
      });

      $('.filter').on('change', function () {
        var filter = app.views.listPage.getFilterById(this.id);
        app.views.listPage.setFilter(filter);

        var filters = app.views.listPage.getCurrentFilters();
        if (filters.length === 1 && filters[0].id === 'favourites') {
          filters = [];
        }
        $('#list-controls-button').toggleClass('on', filters.length > 0);

        app.views.listPage.renderList();
      });
    },




    /**
     *
     * @returns {*|Object|{}}
     */
    getSpecies: function () {
      return morel.settings('listSpecies') || {};
    },

    setSpecies: function (species) {
      return morel.settings('listSpecies', species);
    },

    /**
     *
     * @returns {*|Object|Array}
     */
    getCurrentFilters: function () {
      return morel.settings(this.FILTERS_KEY) || [];
    },

    /**
     *
     * @param filter
     * @returns {Array}
     */
    getFilterCurrentGroup: function (filter) {
      var current_filter = this.getCurrentFilters();
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
      return morel.settings(this.SORT_KEY) || this.DEFAULT_SORT;
    },

    /**
     *
     * @param type
     * @returns {*|Object}
     */
    setSortType: function (type) {
      return morel.settings(this.SORT_KEY, type);
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


    /**
     *
     * @param id
     * @param favourite
     */
    changeFavourite: function (id, favourite) {
      var species = this.getSpecies();
      if (!species[id]) {
        species[id] = {'favourite': favourite};
      } else {
        species[id].favourite = favourite;
      }
      this.setSpecies(species);
    },

    /**
     *
     * @returns {{}}
     */
    getFavourites: function () {
      var species = this.getSpecies();
      var favourites = {};

      var keys = Object.keys(species);
      for (var i = 0; i < keys.length; i++) {
        var specie = species[keys[i]];
        if (specie.favourite && specie.favourite) {
          favourites[keys[i]] = species[keys[i]];
        }
      }
      return favourites;
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
          $("#fav-button").addClass("on");
          var keys = Object.keys(this.getFavourites());
          for (var i = 0; i < keys.length; i++) {
            for (var j = 0; j < list.length; j++) {
              if (list[j].id === keys[i]) {
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
            a = a.taxon.toLowerCase();
            b = b.taxon.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
          break;
        case 'taxonomic_r':
          list.sort(function (a, b) {
            a = a.taxon.toLowerCase();
            b = b.taxon.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          break;
        case this.DEFAULT_SORT + '_r':
          list.sort(function (a, b) {
            a = a.common_name.toLowerCase();
            b = b.common_name.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          break;
        case this.DEFAULT_SORT:
        default:
          list.sort(function (a, b) {
            a = a.common_name.toLowerCase();
            b = b.common_name.toLowerCase();
            if (a === b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
      }
      onSuccess(list);
    },

    /**
     * Asks the user to start an appcache download
     * process.
     */
    download: function () {
      var OFFLINE = 'offline';
      var offline = morel.settings(OFFLINE);

      if (!offline || (!offline.downloaded && !offline.dontAsk)) {
        var donwloadBtnId = "download-button";
        var donwloadCancelBtnId = "download-cancel-button";
        var downloadCheckbox = "download-checkbox";

        var message =
          '<h3>Start downloading the app for offline use?</h3></br>' +

          '<label><input id="' + downloadCheckbox + '" type="checkbox" name="checkbox-0 ">Don\'t ask again' +
          '</label> </br>' +

          '<button id="' + donwloadBtnId + '" class="ui-btn">Download</button>' +
          '<button id="' + donwloadCancelBtnId + '" class="ui-btn">Cancel</button>';

        app.navigation.message(message, 0);

        $('#' + donwloadBtnId).on('click', function () {
          _log('list: starting appcache downloading process.', morel.LOG_DEBUG);

          $.mobile.loading('hide');

          //for some unknown reason on timeout the popup does not disappear
          setTimeout(function () {
            function onSuccess() {
              offline = {
                'downloaded': true,
                'dontAsk': false
              };
              morel.settings(OFFLINE, offline);
              location.reload();
            }

            function onError() {
              _log('list: ERROR appcache.');
            }

            startManifestDownload('appcache', morel.CONF.APPCACHE_FILES,
              morel.CONF.APPCACHE_LOADER_URL, onSuccess, onError);
          }, 500);
        });

        $('#' + donwloadCancelBtnId).on('click', function () {
          _log('list: appcache dowload canceled.', morel.LOG_DEBUG);
          $.mobile.loading('hide');

          var dontAsk = $('#' + downloadCheckbox).prop('checked');
          offline = {
            'downloaded': false,
            'dontAsk': dontAsk
          };

          morel.settings(OFFLINE, offline);
        });
      }
    },

    filterFavourites : function () {
      var filter = app.views.listPage.getFilterById('favourites');
      app.views.listPage.setFilter(filter);
      $("#fav-button").toggleClass("on");

      app.views.listPage.renderList();
    }
  });

  app.views.List = Backbone.View.extend({
    tagName: 'ul',

    attributes: {
      'data-role': 'listview'
    },

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      var container = document.createDocumentFragment(); //optimising the performance
      this.collection.each(function (specie) {
        var listSpeciesView = new ListSpecies({model: specie.attributes});
        container.appendChild(listSpeciesView.render().el);
      });
      this.$el.append(container); //appends to DOM only once
      return this;
    }
  });

  var ListSpecies = Backbone.View.extend({
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
      this.$el.html(this.template(this.model));
      return this;
    }
  });
})();
