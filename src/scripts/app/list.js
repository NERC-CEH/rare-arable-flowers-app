(function ($) {
  app.controller = app.controller || {};
  app.controller.list = {
    //controller configuration should be set up in an app config file
    CONF: {
      PROB_DATA_SRC: "",
      SPECIES_DATA_SRC: "",
      NATIONAL_BOUNDARY_SRC: ""
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
        'id': 'zygoptera',
        'group': 'suborder',
        'label': 'Damselflies'
      },
      {
        'id': 'anisoptera',
        'group': 'suborder',
        'label': 'Dragonflies'
      },
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
    pagecreate: function () {
      _log('list: pagecreate.');

      //load species data
      if (!app.storage.is('species')) {
        $.ajax({
          url: this.CONF.SPECIES_DATA_SRC,
          dataType: 'json',
          async: false,
          success: function (json) {
            app.data.species = json;

            //saves for quicker loading
            app.storage.set('species', json);

            //todo: what if data comes first before pagecontainershow
            app.controller.list.renderList();

          }
        });
      } else {
        app.data.species = app.storage.get('species');
        app.controller.list.renderList();
      }

      this.prob.loadData();

      $('#list-controls-save-button').on('click', this.toggleListControls);
      $('#list-controls-button').on('click', this.toggleListControls);

      // this.printSpeciesData();
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
      for (var i = 0; i < app.data.species.length; i++) {
        //pics
        _log(app.data.species[i].profile_pic.url.replace(url, ''));
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
    pagecontainershow: function () {
      _log('list: pagecontainershow.');
      this.makeListControls();
    },

    /**
     *
     */
    renderList: function (callback) {
      var filters = this.getCurrentFilters();
      var sort = this.getSortType();
      var species = app.data.species;
      if (species != null) {
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
      if (filters.length > 0) {
        var filter = filters.pop();

        function onFilterSuccess(species) {
          app.controller.list.renderListCore(species, sort, filters);
        }

        list = this.filterList(list, filter, onFilterSuccess);
        return;
      }

      function onSortSuccess() {
        if (list != null) {
          //list.length = 2;
          app.controller.list.printList(list);
          $.mobile.loading("hide");

          if (callback != null) {
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
            if (keys[i] == s[j].id) {
            s[j].favourite = "favourite";
          }
        }
      }

      var template = $('#list-template').html();
      var placeholder = $('#list-placeholder');

      var compiled_template = Handlebars.compile(template);

      var record = '#record';
      placeholder.html(compiled_template({'species': s}));
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
        if (this.sorts[i].id == sort) {
          this.sorts[i]['checked'] = "checked";
        }
      }

      var template = $('#list-controls-sort-template').html();
      var placeholder = $('#list-controls-sort-placeholder');

      var compiled_template = Handlebars.compile(template);

      placeholder.html(compiled_template(this.sorts));
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
        if (this.filters[i].label != null) {
          for (var j = 0; j < currentFilters.length; j++) {
            if (currentFilters[j].id == this.filters[i].id) {
              this.filters[i]['checked'] = "checked";
            } else {
              this.filters[i]['checked'] = "";
            }
          }
          filtersToRender.push(this.filters[i]);
        }
      }

      var template = $('#list-controls-filter-template').html();
      var placeholder = $('#list-controls-filter-placeholder');

      var compiled_template = Handlebars.compile(template);

      placeholder.html(compiled_template(filtersToRender));
      placeholder.trigger('create');
    },

    /**
     * Has to be done once on list creation.
     */
    setListControlsListeners: function () {
      //initial list control button setup
      var filters = app.controller.list.getCurrentFilters();
      if (filters.length == 1 && filters[0].id == 'favourites') {
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
        if (filters.length == 1 && filters[0].id == 'favourites') {
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
      return app.settings('listSpecies') || {};
    },

    setSpecies: function (species) {
      return app.settings('listSpecies', species);
    },

    /**
     * Uses session storage;
     * @returns {*|{}}
     */
    CURRENT_SPECIES_KEY: 'currentSpecies',
    getCurrentSpecies: function () {
      return app.storage.tmpGet(this.CURRENT_SPECIES_KEY);
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    setCurrentSpecies: function (id) {
      var species = {};

      for (var i = 0; i < app.data.species.length; i++) {
        if (app.data.species[i].id == id) {
          species = app.data.species[i];
          break;
        }
      }
      return app.storage.tmpSet(this.CURRENT_SPECIES_KEY, species);
    },

    /**
     *
     * @returns {*|Object|Array}
     */
    getCurrentFilters: function () {
      return app.settings(this.FILTERS_KEY) || [];
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
        if (current_filter[i].group == filter.group) {
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
      return app.settings(this.SORT_KEY) || this.DEFAULT_SORT;
    },

    /**
     *
     * @param type
     * @returns {*|Object}
     */
    setSortType: function (type) {
      return app.settings(this.SORT_KEY, type);
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    getFilterById: function (id) {
      for (var i = 0; i < this.filters.length; i++) {
        if (this.filters[i].id == id) {
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
        if (filters[i].id == filter.id) {
          this.removeFilter(filter);
          return;
        }
      }
      filters.push(filter);
      app.settings(this.FILTERS_KEY, filters);
    },

    /**
     *
     * @param filter
     */
    removeFilter: function (filter) {
      var filters = this.getCurrentFilters();
      var index = -1;
      for (var i = 0; i < filters.length; i++) {
        if (filters[i].id == filter.id) {
          index = i;
        }
      }

      if (index != -1) {
        filters.splice(index, 1);
        app.settings(this.FILTERS_KEY, filters);
      }
    },

    /**
     *
     * @param id
     * @param favourite
     */
    changeFavourite: function (id, favourite) {
      var species = this.getSpecies();
      if (species[id] == null) {
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
        if (specie.favourite != null && specie.favourite == true) {
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
              if (list[j].id == keys[i]) {
                filtered_list.push(list[j]);
              }
            }
          }
          break;
        case 'suborder':
          for (var j = 0; j < list.length; j++) {
            for (var k = 0; k < grouped.length; k++) {
              if (grouped[k].id == list[j].type) {
                filtered_list.push(list[j]);
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
          break;
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
            a = a['taxon'].toLowerCase();
            b = b['taxon'].toLowerCase();
            if (a == b) {
              return 0;
            }
            return a > b ? 1 : -1;
          });
          break;
        case 'taxonomic_r':
          list.sort(function (a, b) {
            a = a['taxon'].toLowerCase();
            b = b['taxon'].toLowerCase();
            if (a == b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          break;
        case this.DEFAULT_SORT + '_r':
          list.sort(function (a, b) {
            a = a['common_name'].toLowerCase();
            b = b['common_name'].toLowerCase();
            if (a == b) {
              return 0;
            }
            return a < b ? 1 : -1;
          });
          break;
        case this.DEFAULT_SORT:
        default:
          list.sort(function (a, b) {
            a = a['common_name'].toLowerCase();
            b = b['common_name'].toLowerCase();
            if (a == b) {
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
      var offline = app.settings(OFFLINE);

      if (offline == null || (!offline['downloaded'] && !offline['dontAsk'])) {
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
          _log('list: starting appcache downloading process.', app.LOG_DEBUG);

          $.mobile.loading('hide');

          //for some unknown reason on timeout the popup does not disappear
          setTimeout(function () {
            function onSuccess() {
              offline = {
                'downloaded': true,
                'dontAsk': false
              };
              app.settings(OFFLINE, offline);
              location.reload();
            }

            function onError() {
              _log('list: ERROR appcache.');
            }

            startManifestDownload('appcache', app.CONF.APPCACHE_FILES,
              app.CONF.APPCACHE_LOADER_URL, onSuccess, onError);
          }, 500);
        });

        $('#' + donwloadCancelBtnId).on('click', function () {
          _log('list: appcache dowload canceled.', app.LOG_DEBUG);
          $.mobile.loading('hide');

          var dontAsk = $('#' + downloadCheckbox).prop('checked');
          offline = {
            'downloaded': false,
            'dontAsk': dontAsk
          };

          app.settings(OFFLINE, offline);
        });
      }
    }
  };

  app.navigation.filterFavourites = function () {
    var filter = app.controller.list.getFilterById('favourites');
    app.controller.list.setFilter(filter);
    $("#fav-button").toggleClass("on");

    app.controller.list.renderList();
  };

}(jQuery));

