/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
  'views/_page',
  'views/speciesList',
  'templates'
], function (Page, SpeciesList) {
  'use strict';

  var ListPage = Page.extend({
    id: 'list',

    template: app.templates.list,

    events: {
      'click #list-controls-save-button': 'toggleListControls',
      'click #list-controls-button': 'toggleListControls',
      'change input[type=radio]': 'toggleListControls',
      'click #fav-button': 'toggleListFavourites'
    },

    initialize: function () {
      _log('views.ListPage: initialize', log.DEBUG);
      this.listView = new SpeciesList({collection: app.collections.species});

      var sorts = this.listView.sorts;
      var filters = this.listView.filters;

      this.listControlsView = new ListControlsView(sorts, filters);

      this.render();
      this.appendBackButtonListeners();

      this.$userPageButton = $('#user-page-button');
      this.$listControlsButton = $('#list-controls-button');

      this.listenTo(app.models.user, 'change:filters', this.updateListControlsButton);
      this.updateListControlsButton();
      this.updateUserPageButton();
    },

    render: function () {
      _log('views.ListPage: render', log.DEBUG);

      this.$el.html(this.template());
      this.$list = this.$el.find('#list-placeholder');
      this.$list.html(this.listView.render().el);

      $('body').append($(this.el));

      //add list controls
      var $listControls = $('#list-controls-placeholder');
      $listControls.html(this.listControlsView.el);

      //turn on/off filter button
      var on = app.models.user.hasListFilter('favourites');
      $("#fav-button").toggleClass("on", on);

      return this;
    },

    /**
     * Turns on/off favourite filtering.
     */
    toggleListFavourites: function () {
      var userConfig = app.models.user;
      var on  = userConfig.toggleListFilter('favourites');
      $("#fav-button").toggleClass("on", on);
    },

    /**
     * Shows/hides the list controls.
     */
    toggleListControls: function () {
      this.listControlsView.toggleListControls();
    },

    /**
     * Updates the list controls button with the current state of the filtering.
     * If one or more (non favourite) filters is turned on then the button is
     * coloured accordingly.
     */
    updateListControlsButton: function () {
      var filters = _.without(app.models.user.get('filters'), 'favourites');
      this.$listControlsButton.toggleClass('running', filters.length > 0);
    },

    /**
     * Updates the user page navigation button with the state of saved records.
     * Todo: hook into some record counter event
     */
    updateUserPageButton: function () {
      var $userPageButton = this.$userPageButton;
      function onSuccess(savedRecords) {
        var savedRecordIDs = Object.keys(savedRecords);
        $userPageButton.toggleClass('running', savedRecordIDs.length > 0);

      }
      morel.record.db.getAll(onSuccess);
    }
  });

  var ListControlsView = Backbone.View.extend({
    tagName: 'div',
    id: 'list-controls-tabs',

    template: app.templates.list_controls,
    template_sort: app.templates.list_controls_sort,
    template_filter: app.templates.list_controls_filter,

    initialize: function (sorts, filters) {
      this.sorts = sorts;
      this.filters = filters;
      this.render();
    },

    render: function () {
      this.$el.html(this.template());

      this.renderListSortControls();
      this.renderListFilterControls();
      this.setListControlsListeners();
    },

    attributes: function () {
      return {
        "data-role": 'tabs'
      };
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
     * Renders and appends the list sort controls.
     */
    renderListSortControls: function () {
      var keys = Object.keys(this.sorts);
      for (var i = 0, length = keys.length; i < length; i++) {
        var sort = app.models.user.get('sort');

        if (keys[i] === sort) {
          this.sorts[keys[i]].checked = "checked";
        }
      }

      var placeholder = this.$el.find('#list-controls-sort-placeholder');

      placeholder.html(this.template_sort(this.sorts));
      placeholder.trigger('create');
    },

    /**
     * Renders and appends the list filter controls.
     */
    renderListFilterControls: function () {
      var filtersToRender = [];
      var currentFilters = this.getCurrentFilters(this.filters);

      _.each(this.filters, function (filterGroup, filterGroupID) {
        _.each(filterGroup, function (filter, filterID) {
          //only render those that have label
          if (filter.label) {
            var currentFiltersIDs = Object.keys(currentFilters);
            for (var j = 0; j < currentFiltersIDs.length; j++) {
              if (currentFiltersIDs[j] === filterID) {
                filter.checked = "checked";
              } else {
                filter.checked = "";
              }
            }
            filter.id = filterID;
            filtersToRender.push(filter);
          }
        });
      });

      var placeholder = this.$el.find('#list-controls-filter-placeholder');

      placeholder.html(this.template_filter(filtersToRender));
      placeholder.trigger('create');
    },

    //TODO: DUPLICATE FROM ListView
    getCurrentFilters: function (filters) {
      var filtersIDs =  app.models.user.get('filters');
      var filters = filters;
      var currentFilters = {};
      for (var j = 0; j < filtersIDs.length; j++) {
        var filterGroupIDS = Object.keys(filters);
        for (var i = 0, length = filterGroupIDS.length; i < length; i++) {
          if (filters[filterGroupIDS[i]][filtersIDs[j]]) {
            currentFilters[filtersIDs[j]] = filters[filterGroupIDS[i]][filtersIDs[j]];
          }
        }
      }
      return currentFilters;
    },

    /**
     * Has to be done once on list creation.
     */
    setListControlsListeners: function () {
      //initial list control button setup
      var filters = this.getCurrentFilters(this.filters);
      if (filters.length === 1 && filters[0].id === 'favourites') {
        filters = [];
      }
      this.$el.find('#list-controls-button').toggleClass('on', filters.length > 0);

      this.$el.find('.sort').on('change', function () {
        app.models.user.save('sort', this.id);
      });

      var that = this;
      this.$el.find('.filter').on('change', function (e) {
          app.models.user.toggleListFilter(this.id);

          var filters = that.getCurrentFilters(that.filters);
          if (filters.length === 1 && filters[0].id === 'favourites') {
            filters = [];
          }
          that.$el.find('#list-controls-button').toggleClass('on', filters.length > 0);
      });
    }

  });

  return ListPage;
});
