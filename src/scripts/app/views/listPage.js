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
      this.listView = new app.views.SpeciesList({collection: app.collections.species});

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());
      this.$list = this.$el.find('#list-placeholder');
      this.$list.html(this.listView.render().el);

      $('body').append($(this.el));

      return this;
    },

    toggleListFavourites: function () {
      var userConfig = app.models.user.get('config');
      userConfig.toggleListFilter('favourites');
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
    }
  });
})();
