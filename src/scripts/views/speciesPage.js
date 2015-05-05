/******************************************************************************
 * Species page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'photoswipe'
], function (Page) {
  'use strict';

  var SpeciesPage = Page.extend({
    id: 'species',

    template: app.templates.species,

    events: {
      'click #species-profile-fav-button': 'toggleSpeciesFavourite',
      'click #species-map': 'toggleMap',
      'click #species-map-button': 'toggleMap',
      'click #profile_pic': 'showGallery'
    },

    initialize: function () {
      _log('views.SpeciesPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.SpeciesPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));
    },

    update: function (speciesID) {
      this.model = app.collections.species.find({id: speciesID});

      var $heading = $('#species_heading');
      $heading.text(this.model.attributes.taxon);

      //append the profile
      var $profile = this.$el.find('#species-profile-placeholder');
      var profileView = new SpeciesProfile({model: this.model});
      $profile.html(profileView.render().el);
      $profile.trigger('create');

      //turn on/off fav button
      var $favButton = $("#species-profile-fav-button");
      if (app.models.user.isFavourite(speciesID)) {
        $favButton.addClass("on");
      } else {
        $favButton.removeClass("on");
      }

      //add Gallery
      this.initGallery();

      //add Map
      var $mapsHolder = $('#maps-holder');
      $.get("images/country_coastline.svg", function(data) {
        $mapsHolder.html(new XMLSerializer().serializeToString(data.documentElement));
      });
      $.get(this.model.attributes.map, function(data) {
        $mapsHolder.append(new XMLSerializer().serializeToString(data.documentElement));
      });
    },

    appendEventListeners: function () {
      this.appendBackButtonListeners();
    },

    /**
     * Toggles the current species as favourite by saving it into the
     * storage and changing the buttons appearance.
     */
    toggleSpeciesFavourite: function (e) {
      var $favButton = $(e.target);
      $favButton.toggleClass("on");
      var speciesID = this.model.get('id');
      app.models.user.toggleFavouriteSpecies(speciesID);
    },


    /**
     * Shows/hides the distribution map.
     */
    toggleMap: function () {
      $('#species-map').toggle('slow');
    },

    /**
     * Launches the species gallery viewing.
     */
    showGallery: function () {
      if ($('.gallery')) {
        this.gallery.show(0);
      } else {
        app.message('I have no pictures to show :(');
      }
    },

    /**
     * Initializes the species gallery.
     */
    initGallery: function () {
      var images = $('#species_gallery a');

      if (images.length > 0) {
        this.gallery = images.photoSwipe({
          jQueryMobile: true,
          loop: false,
          enableMouseWheel: false,
          enableKeyboard: false
        });
      }
    }
  });

  var SpeciesProfile = Backbone.View.extend({
    template: app.templates.species_profile,

    /**
     * Renders the species profile.
     *
     * @returns {SpeciesProfile}
     */
    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return SpeciesPage;
});

