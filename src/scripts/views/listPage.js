/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
  'views/_page',
  'views/speciesList',
  'tripjs',
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

      this.$listControlsButton = this.$el.find('#list-controls-button');
      this.listControlsView = new ListControlsView(sorts, filters, this.$listControlsButton);

      this.render();
      this.appendEventListeners();

      this.$userPageButton = $('#user-page-button');

      this.trip();
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
      var on = app.models.user.groupHasListFilter('favourites', 'favouritesGroup');
      $("#fav-button").toggleClass("on", on);

      return this;
    },

    update: function () {
      this.listControlsView.updateListControlsButton();
      this.updateUserPageButton();
    },

    appendEventListeners: function () {
      this.listenTo(app.models.user, 'change:filters', this.listControlsView.updateListControlsButton);

      this.appendBackButtonListeners();
    },

    /**
     * Turns on/off favourite filtering.
     */
    toggleListFavourites: function () {
      var on  = app.models.user.toggleListFilter('favourites', 'favouritesGroup');
      $("#fav-button").toggleClass("on", on);
    },

    /**
     * Shows/hides the list controls.
     */
    toggleListControls: function () {
      this.listControlsView.toggleListControls();
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
    },

    /**
     * Shows the user around the page.
     */
    trip: function () {
      var finishedTrips = app.models.user.get('trips') || [];
      if (finishedTrips.indexOf('list') < 0) {
        finishedTrips.push('list');
        app.models.user.set('trips', finishedTrips);
        app.models.user.save();

        setTimeout(function(){
          trip.start();
        }, 500);
      }

      var options = {
        delay : 1500
      };

      var trip = new Trip([
        {
          sel : $('#user-page-button'),
          position : "s",
          content : 'Your Account',
          animation: 'fadeIn'
        },
        {
          sel : $('#fav-button'),
          position : "s",
          content : 'List Controls',
          animation: 'fadeIn'
        },
        {
          sel : $('a[href="#species/10"]'),
          position : "s",
          content : 'Species Account',
          animation: 'fadeIn'
        },
        {
          sel : $('a[href="#record/88"]'),
          position : "w",
          content : 'Recording',
          animation: 'fadeIn'
        }
      ], options);
    }
  });

  var ListControlsView = Backbone.View.extend({
    tagName: 'div',
    id: 'list-controls-tabs',

    template: app.templates.list_controls,
    template_sort: app.templates.list_controls_sort,
    template_filter: app.templates.list_controls_filter,

    initialize: function (sorts, filters, $listControlsButton) {
      this.sorts = sorts;
      this.filters = filters;
      this.$listControlsButton = $listControlsButton;
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
      var currentFilters = app.models.user.get('filters');

      _.each(this.filters, function (filterGroup, filterGroupID) {
        _.each(filterGroup.filters, function (filter, filterID) {
          if (currentFilters[filterGroupID] && currentFilters[filterGroupID].indexOf(filterID) >= 0) {
            filter.checked = "checked";
          } else {
            filter.checked = "";
          }
        });
      });

      var placeholder = this.$el.find('#list-controls-filter-placeholder');

      placeholder.html(this.template_filter(this.filters));
      placeholder.trigger('create');
    },

    /**
     * Has to be done once on list creation.
     */
    setListControlsListeners: function () {
      //initial list control button setup
      this.updateListControlsButton();

      this.$el.find('.sort').on('change', function () {
        app.models.user.save('sort', this.id);
      });

      var that = this;
      this.$el.find('.filter').on('change', function (e) {
          app.models.user.toggleListFilter(this.id, $(this).data('group'));
          that.updateListControlsButton();
      });
    },

    /**
     * Updates the list controls button with the current state of the filtering.
     * If one or more (non favourite) filters is turned on then the button is
     * coloured accordingly.
     */
    updateListControlsButton: function () {
      var filters = app.models.user.get('filters');
      var activate = false;
      _.each(filters, function (filterGroup, filterGroupID){
        if (filterGroupID !== 'favouritesGroup' && filterGroup.length > 0) {
          activate = true;
        }
      });

      $(this.$listControlsButton.selector).toggleClass('running', activate);
    }
  });

  return ListPage;
});
