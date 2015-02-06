var app = app || {};
app.controller = app.controller || {};

(function ($) {
  app.controller.list = {
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
    init: function () {
      _log('list: init.');
      app.controller.list.renderList();

      this.prob.loadData();

      $('#list-controls-save-button').on('click', this.toggleListControls);
      $('#list-controls-button').on('click', this.toggleListControls);

      $('#fav-button').on('click', this.filterFavourites);

      // this.printSpeciesData();
    },

    /**
     *
     */
    show: function () {
      _log('list: show.');
      //this.makeListControls();
    },

    printSpeciesData: function () {
      /**
       * Prints species data for probability table mapping
       */
      console.log('list: Printing Species data.');

      var text = '';
      for (var i = 0; i < app.data.species.length; i++) {
        text += "\n" + app.data.species[i].taxon + ', ' + app.data.species[i].id + ', ' + app.data.species[i].common_name + ', ' + app.data.species[i].warehouse_id;
      }
      console.log(app.data.species.length);
      console.log(app.data.species);

      console.log(text);
    },

    printAppcacheData: function () {
      var url = 'http://192.171.199.230';
      //print pictures & maps
      for (var i = 0, length = app.data.species; i < length; i++) {
        //pics
        _log(app.data.species[i].profile_pic.replace(url, ''));
        for (var j = 0; j < app.data.species[i].gallery.length; j++) {
          _log(app.data.species[i].gallery[j].url.replace(url, ''));

        }
        //maps
        _log(app.data.species[i].map.replace(url, ''));

      }
    },

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
          app.controller.list.renderListCore(species, sort, filters);
        };

        list = this.filterList(list, filter, onFilterSuccess);
        return;
      }

      function onSortSuccess() {
        if (list) {
          app.controller.list.printList(list);
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
      var filters = app.controller.list.getCurrentFilters();
      if (filters.length === 1 && filters[0].id === 'favourites') {
        filters = [];
      }
      $('#list-controls-button').toggleClass('on', filters.length > 0);

      $('.sort').on('change', function () {
        app.controller.list.setSortType(this.id);
        app.controller.list.renderList();
      });

      $('.filter').on('change', function () {
        var filter = app.controller.list.getFilterById(this.id);
        app.controller.list.setFilter(filter);

        var filters = app.controller.list.getCurrentFilters();
        if (filters.length === 1 && filters[0].id === 'favourites') {
          filters = [];
        }
        $('#list-controls-button').toggleClass('on', filters.length > 0);

        app.controller.list.renderList();
      });
    },

    /**
     * Shows/closes list controlls.
     */
    toggleListControls: function () {
      var controls = $('#list-controls-placeholder');
      if (controls.is(":hidden")) {
        controls.slideDown("slow");
      } else {
        controls.slideUp("slow");
      }
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
     * @param filter
     */
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

    /**
     *
     * @param filter
     */
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
          app.controller.list.prob.runFilter(list, function () {
            filtered_list = app.controller.list.prob.filterList(list);
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
          app.controller.list.prob.runFilter(list, function () {
            list.sort(app.controller.list.prob.sort);
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
      var filter = app.controller.list.getFilterById('favourites');
      app.controller.list.setFilter(filter);
      $("#fav-button").toggleClass("on");

      app.controller.list.renderList();
    }
  };

}(jQuery));

