/******************************************************************************
 * User model. Persistent.
 *****************************************************************************/
define([
  'backbone',
  'backbone.localStorage',
  'conf',
  'latlon'
], function (Backbone) {
  'use strict';

  var User = Backbone.Model.extend({
    id: 'user',

    defaults: {
      name: '',
      surname: '',
      email: '',
      secret: '',
      location: null,
      location_acc: -1,
      sort: 'common_name',
      filters: {},
      favourites: []
    },

    /**
     * Initializes the user.
     */
    initialize: function () {
      this.fetch();
    },

    localStorage: new Store(app.NAME),

    /**
     * Resets the user login information.
     */
    signOut: function () {
      this.set('email', '');
      this.set('secret', '');
      this.set('name', '');
      this.set('surname', '');
      this.save();
    },

    /**
     * Sets the app login state of the user account.
     * Saves the user account details into storage for permanent availability.
     *
     * @param user User object or empty object
     */
    signIn: function (user) {
      this.set('secret', user.secret || '');
      this.setContactDetails(user);
      this.save()
    },

    /**
     * Sets user contact information.
     */
    setContactDetails: function (user) {
      this.set('email', user.email || '');
      this.set('name', user.name || '');
      this.set('surname', user.surname || '');
      this.save();
    },

    /**
     * Returns user contact information.
     */
    hasSignIn: function () {
      return this.get('secret');
    },

    /**
     * Saves user location.
     *
     * @param location
     */
    saveLocation: function (location) {
      this.set('location', location.latitude + ', ' + location.longitude);
      this.set('location_acc', location.accuracy);
      this.save();
    },

    /**
     * Returns user location as Grid Reference.
     *
     * @param geoloc
     * @returns {*}
     */
    getLocationSref: function (geoloc) {
      var LOCATION_GRANULARITY = 2; //Precision of returned grid reference (6 digits = metres).

      geoloc = geoloc || this.get('location');
      if (!geoloc) {
        return null;
      }
      //get translated geoloc
      var p = new LatLon(geoloc.split(',')[0], geoloc.split(',')[1], LatLon.datum.WGS84);
      var grid = OsGridRef.latLonToOsGrid(p);
      var gref = grid.toString(LOCATION_GRANULARITY);
      _log('models.User: converted geoloc to sref -  ' + gref + ".", log.DEBUG);

      //remove the spaces
      return gref.replace(/ /g, '');
    },

    /**
     * Adds/removes favourite species ID from user information.
     *
     * @param speciesID
     */
    toggleFavouriteSpecies: function (speciesID) {
      var favourites = _.clone(this.get('favourites'));  //CLONING problem as discussed:
      //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change

      if (_.indexOf(favourites, speciesID) >= 0) {
        favourites = _.without(favourites, speciesID);
      } else {
        favourites.push(speciesID);
      }

      this.save('favourites', favourites);
    },

    /**
     * Checks if the speciesID belongs to user favourites.
     *
     * @param speciesID
     * @returns {boolean}
     */
    isFavourite: function (speciesID) {
      var favourites = this.get('favourites');
      return _.indexOf(favourites, speciesID) >= 0;
    },

    /**
     * Adds/removes species list filter from user information.
     *
     * @param filterID
     * @param groupID group the filter belongs to
     * @returns {boolean}
     */
    toggleListFilter: function (filterID, groupID) {
      // var userFilters = _.clone(this.get('filters'));  //CLONING problem as discussed:
      //https://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change
      var userFilters = this.get('filters');

      var exists = false;
      if (userFilters[groupID]) {
        exists = userFilters[groupID].indexOf(filterID) >= 0;
        if (exists) {
          userFilters[groupID] = _.without(userFilters[groupID], filterID);
        } else {
          userFilters[groupID].push(filterID);
        }
      } else {
        userFilters[groupID] = [filterID];
      }

      this.set('filters', userFilters);
      this.save();
      this.trigger('change:filters');

      return !exists; //return the state of the filter added/removed
    },

    /**
     * Checks if the filterID belongs to user selected ones.
     *
     * @param filterID
     * @param filters
     * @returns {boolean}
     */
    groupHasListFilter: function (filterID, groupID, filters) {
      filters = filters || this.get('filters');
      return _.indexOf(filters[groupID], filterID) >= 0;
    },

    /**
     * @returns {boolean} Scientific or different type of sorting is selected
     */
    isSortScientific: function () {
      var sort = this.get('sort');
      return sort === 'scientific' || sort === 'scientific_r';
    }
  });

  return User;
});