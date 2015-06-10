/******************************************************************************
 * Location page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'latlon',
  'conf'
], function (Page) {

  'use strict';

  var LocationPage = Page.extend({
    id: 'location',

    template: app.templates.location,

    events: {
      'click #grid-ref-set': 'gridRefConvert',
      'click #location-save': 'save',
      'tabsactivate #location-opts': 'refreshMap'
    },

    initialize: function () {
      _log('views.LocationPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();

      if (typeof google === 'undefined') {
        /*
         If the browser is offline then we should not proceed and so the
         dummyText controls the caching of the file - always get fresh
         */
        var dummyText = '&' + (new Date()).getTime();
        this.loadScript('http://maps.googleapis.com/maps/api/js?sensor=false&' +
          'callback=app.views.locationPage.initializeMap' +
          dummyText
        );
      } else {
        this.initializeMap();
      }
    },

    appendEventListeners: function () {
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.LocationPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      $('#location-opts').tabs().tabs( "option", "disabled", [1] ); //disable map
      return this;
    },

    update: function (prevPageId, speciesID) {
      app.views.locationPage.renderGPStab('init');

    },

    /**
     * Saves the location to the record and returns to the previous page.
     */
    save: function () {
      var location = this.get();

      if (location.latitude && location.longitude) {
        morel.geoloc.set(location.latitude, location.longitude, location.accuracy);

        var sref = location.latitude + ', ' + location.longitude;
        app.models.record.set(morel.record.inputs.KEYS.SREF, sref);
        app.models.record.set(morel.record.inputs.KEYS.SREF_ACCURACY, location.accuracy);
        app.models.record.set(morel.record.inputs.KEYS.SREF_NAME, location.name);

        app.models.user.saveLocation(location);
      } else {
        _log('views.LocationPage: invalid location to set', log.WARNING);
      }

      window.history.back();
    },

    map: {},
    latitude: null,
    longitude: null,
    accuracy: -1,
    name: '',

    /**
     * Sets the location.
     *
     * @param latitude
     * @param longitude
     * @param accuracy
     * @param name
     */
    set: function (latitude, longitude, accuracy, name) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.accuracy = accuracy;
      this.name = name || ''
    },

    /**
     * Gets saved location.
     *
     * @returns {{latitude: *, longitude: *, accuracy: *, name: *}}
     */
    get: function () {
      return {
        'latitude': this.latitude,
        'longitude': this.longitude,
        'accuracy': this.accuracy,
        'name': this.name
      };
    },

    /**
     * Updates the text on the page with current location information as Grid Reference.
     *
     * @param latitude
     * @param longitude
     * @param accuracy
     */
    updateCoordinateDisplay: function (latitude, longitude, accuracy) {
      var info = 'Your coordinates: ' + latitude + ', ' + longitude + ' (Accuracy: ' + accuracy + ')';
      $('#coordinates').text(info);
    },

    /**
     * Renders the GPS tab with the gps state.
     *
     * @param state
     * @param location
     */
    renderGPStab: function (state, location) {
      var template = null;
      var placeholder = $('#location-gps-placeholder');

      switch (state) {
        case 'init':
          var currentLocation = app.views.locationPage.get();
          if (currentLocation.accuracy === -1) {
            currentLocation = null;
          } else {
            location = currentLocation;
          }

          template = app.templates.location_gps;
          break;
        case 'running':
          template = app.templates.location_gps_running;
          break;
        case 'finished':
          template = app.templates.location_gps_finished;
          break;
        default:
          _log('views.LocationPage: unknown render gps tab.', log.WARNING);
      }

      placeholder.html(template({location: location}));
      placeholder.trigger('create');

      //attach event listeners
      $('#gps-start-button').on('click', app.views.locationPage.startGeoloc);
      $('#gps-stop-button').on('click', app.views.locationPage.stopGeoloc);
      $('#gps-improve-button').on('click', app.views.locationPage.startGeoloc);

    },

    /**
     * Variable for storing location details while running geolocation.
     */
    geoloc: {
      latitude: null,
      longitude: null,
      accuracy: -1
    },

    /**
     * Sets location if geolocation has an improved update of current location.
     *
     * @param location
     */
    setGeoloc: function (location){
      if (location){
        var geoloc = this.getGeoloc();
        if (geoloc.accuracy === -1 || (geoloc.accuracy >= location.accuracy)) {
          this.geoloc = location;
          this.set(location.latitude, location.longitude, location.accuracy);
          app.views.locationPage.updateLocationMessage();
        } else if (geoloc.accuracy !== -1) {
          //geoloc->map->geoloc case where we should set old geoloc
          location = this.getGeoloc();
          this.set(location.latitude, location.longitude, location.accuracy);
          app.views.locationPage.updateLocationMessage();
        }
      }
    },

    /**
     * Returns the geolocation variable.
     *
     * @returns {*}
     */
    getGeoloc: function() {
      return this.geoloc;
    },

    /**
     * Starts a geolocation service and modifies the DOM with new UI.
     */
    startGeoloc: function () {
      $.mobile.loading('show');

      function onUpdate(location) {
        app.views.locationPage.setGeoloc({
          latitude: location.lat,
          longitude: location.lon,
          accuracy: location.acc
        });
        location = app.views.locationPage.getGeoloc();

        //modify the UI
        app.views.locationPage.renderGPStab('running', location);
      }

      function onSuccess(location) {
        $.mobile.loading('hide');

        app.views.locationPage.setGeoloc({
          latitude: location.lat,
          longitude: location.lon,
          accuracy: location.acc
        });
        location = app.views.locationPage.getGeoloc();

        app.views.locationPage.renderGPStab('finished', location);
      }

      function onError(err) {
        $.mobile.loading('show', {
          text: "Sorry! " + err.message + '.',
          theme: "b",
          textVisible: true,
          textonly: true
        });
        setTimeout(function () {
          $.mobile.loading('hide');
        }, 5000);

        //modify the UI

        app.views.locationPage.renderGPStab('init');
      }

      //modify the UI
      app.views.locationPage.renderGPStab('running');

      //start geoloc
      morel.geoloc.run(onUpdate, onSuccess, onError);
    },

    /**
     * Stops any geolocation service and modifies the DOM with new UI.
     */
    stopGeoloc: function () {
      $.mobile.loading('hide');

      //stop geoloc
      morel.geoloc.stop();

      //modify the UI
      app.views.locationPage.renderGPStab('init');
    },

    /**
     * Mapping
     */
    initializeMap: function () {
      _log("location: initialising map.", log.DEBUG);
      //todo: add checking

      $('#location-opts').tabs( "option", "disabled", [] ); //enable map tab

      var mapCanvas = $('#map-canvas')[0];
      var mapOptions = app.CONF.MAP;

      this.map = new google.maps.Map(mapCanvas, mapOptions);
      this.map.setCenter(new google.maps.LatLng(57.686988, -14.763319));
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(-25.363, 131.044),
        map: this.map,
        icon: 'http://maps.google.com/mapfiles/marker_green.png',
        draggable: true
      });
      marker.setVisible(false);

      var update_timeout = null; //to clear changing of marker on double click
      google.maps.event.addListener(this.map, 'click', function (event) {
        //have to wait for double click
        update_timeout = setTimeout(function () {
          var latLng = event.latLng;
          marker.setPosition(latLng);
          marker.setVisible(true);
          updateMapCoords(latLng);
        }, 200);
      });

      //removes single click action
      google.maps.event.addListener(this.map, 'dblclick', function (event) {
        clearTimeout(update_timeout);
      });

      google.maps.event.addListener(marker, 'dragend', function () {
        var latLng = marker.getPosition();
        updateMapCoords(latLng);
      });

      //Set map centre
      if (this.latitude && this.longitude) {
        var latLong = new google.maps.LatLng(this.latitude, this.longitude);
        app.views.locationPage.map.setCenter(latLong);
        app.views.locationPage.map.setZoom(15);
      } else if (navigator.geolocation) {
        //Geolocation
        var options = {
          enableHighAccuracy: true,
          maximumAge: 60000,
          timeout: 5000
        };

        navigator.geolocation.getCurrentPosition(function (position) {
          var latLng = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
          app.views.locationPage.map.setCenter(latLng);
          app.views.locationPage.map.setZoom(15);
        }, null, options);
      }

      function updateMapCoords(mapLatLng) {
        var location = {
          'latitude': mapLatLng.lat(),
          'longitude': mapLatLng.lng()
        };
        app.views.locationPage.set(location.latitude, location.longitude, 1);
        app.views.locationPage.updateLocationMessage();
        $('#map-message').hide();
      }
    },

    /**
     * Fix one tile rendering in jQuery tabs.
     *
     * @param tabs
     * @param mapTab
     */
    refreshMap: function (event, ui) {
      //check if this is a map tab
      if (ui.newPanel.selector === '#map') {
        google.maps.event.trigger(app.views.locationPage.map, 'resize');
        if (app.views.locationPage.latitude !== null && app.views.locationPage.longitude !== null) {
          var latLong = new google.maps.LatLng(app.views.locationPage.latitude,
            app.views.locationPage.longitude);

          app.views.locationPage.map.setCenter(latLong);
          app.views.locationPage.map.setZoom(15);
        }
      }
    },

    /**
     * Converts the grid reference to Lat and Long.
     */
    gridRefConvert: function () {
      var val = $('#grid-ref').val();
      var name = $('#location-name').val();

      var gridref = OsGridRef.parse(val);
      gridref = normalizeGridRef(gridref);

      if (!isNaN(gridref.easting) && !isNaN(gridref.northing)) {
        var latLon = OsGridRef.osGridToLatLon(gridref, LatLon.datum.WGS84);
        this.set(latLon.lat, latLon.lon, 1, name);

        $('#gref-message').hide();
        this.updateLocationMessage();
      }

      function normalizeGridRef(gridref) {
        // normalise to 1m grid, rounding up to centre of grid square:
        var e = gridref.easting;
        var n = gridref.northing;

        switch (gridref.easting.toString().length) {
          case 1: e += '50000'; n += '50000'; break;
          case 2: e += '5000'; n += '5000'; break;
          case 3: e += '500'; n += '500'; break;
          case 4: e += '50'; n += '50'; break;
          case 5: e += '5'; n += '5'; break;
          case 6: break; // 10-digit refs are already 1m
          default: return new OsGridRef(NaN, NaN);
        }
        return new OsGridRef(e, n);
      }
    },

    /**
     * Loads the google maps script.
     *
     * @param src
     */
    loadScript: function (src) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      document.body.appendChild(script);
    },

    /**
     * Updates the main location page message.
     */
    updateLocationMessage: function () {
      //convert coords to Grid Ref
      var location = this.get();
      var p = new LatLon(location.latitude, location.longitude, LatLon.datum.WGS84);
      var grid = OsGridRef.latLonToOsGrid(p);
      var gref = grid.toString();

      var message = $('#location-message');
      message.show();
      message.removeClass();
      message.addClass('success-message');
      message.empty().append('<p>Grid Ref:<br/>' + gref + '</p>');
    }

  });

  return LocationPage;
});
