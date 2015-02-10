var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.Page = Backbone.View.extend({
    tagName: 'div',
    role: "page",

    initialize: function (id) {
      this.el.id = id;
      this.id = id;
      this.template = app.templates[id];
    },

    render: function () {
      $(this.el).html(this.template());
      return this;
    },

    attributes: function () {
      return {
        "data-role": this.role
      };
    }
  });

  app.views.ListPage = app.views.Page.extend({
    id: 'list',

    template: app.templates.list,

    events: {
      'click #list-controls-save-button': 'toggleListControls',
      'click #list-controls-button': 'toggleListControls',
      'click #fav-button': 'toggleListFavourites'
    },

    initialize: function () {
      //this.prob.loadData();
    },

    render: function () {
      this.$el.html(this.template());
      this.$list = this.$el.find('#list-placeholder');

      var list = new app.views.List({collection: app.collections.species});

      this.$list.html(list.render().el);
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
      this.collection.each(function (specie) {
        var listSpeciesView = new ListSpecies({model: specie.attributes});
        this.$el.append(listSpeciesView.render().el);
      }, this);

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

  app.views.SpeciesPage = app.views.Page.extend({
    id: 'species',

    template: app.templates.species,

    events: {
      'click #species-profile-fav-button': 'toggleSpeciesFavourite'
    },

    initialize: function (speciesID) {
      this.speciesID = speciesID;
    },

    render: function () {
      var species = app.collections.species.find({id: this.speciesID});

      var heading = $('#species_heading');
      heading.text(species.attributes.common_name);

      this.$el.html(this.template());

      //append the profile
      var $profile = this.$el.find('#species-profile-placeholder');
      var profileView = new SpeciesProfile({model: species});
      $profile.html(profileView.render().el);

      return this;
    },

    /**
     * Toggles the current species as favourite by saving it into the
     * storage and changing the buttons appearance.
     */
    toggleSpeciesFavourite: function (e) {
      var $favButton = $(e.target);
      $favButton.toggleClass("on");

      var species = app.collections.species.find({id:speciesID});
      var favourite = species.get('favourite');
      species.set('favourite', !favourite);
    }
  });

  var SpeciesProfile = Backbone.View.extend({
    template: app.templates.species_profile,

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
})();