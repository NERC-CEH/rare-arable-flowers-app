/******************************************************************************
 * Location page view.
 *****************************************************************************/
define([
    'views/_page',
    'helpers/location',
    'templates',
    'latlon',
    'conf'
], function (DefaultPage, locHelp) {

    'use strict';

    var Page = DefaultPage.extend({
        id: 'location',

        map: {},
        latitude: null,
        longitude: null,
        accuracy: -1,
        name: '',

        template: app.templates.p_location,

        events: {
            'click #grid-ref-set': 'gridRefConvert',
            'click #location-save': 'save',
            'tabsactivate #location-opts': 'refreshMap',
            'click #gps-button': 'geolocate'
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
            var that = this;

            this.$el.html(this.template());
            $('body').append($(this.el));

            $('#location-opts').tabs().tabs( "option", "disabled", [1] ); //disable map

            this.$locationMessage = this.$el.find('#location-message');
            this.$previousLocationMessage = this.$el.find('#previous-location-message');
            this.$coordinates = this.$el.find('#coordinates');
            this.$locationGPSPlaceholder = this.$el.find('#location-gps-placeholder');
            this.$gpsButton = this.$el.find('#gps-button');

            var userLocationsView = new UserLocationsView({
                model: app.models.user,
                onLocationClick: function (location) {
                    that.$previousLocationMessage.remove();
                    that.set(location.latitude, location.longitude, location.accuracy, location.name);
                    that.updateLocationMessage();
                }
            });
            $('#user-locations').html(userLocationsView.render().$el);
            return this;
        },

        /**
         * Renders the GPS tab with the gps state.
         *
         * @param state
         * @param location
         */
        renderGPStab: function (location) {
            var template = app.templates.location_gps,
                accuracy = location && (location.accuracy || location.acc);

            this.$locationGPSPlaceholder.html(template({
                state: this.geoloc.state,
                accuracy: accuracy
            }));
            this.$locationGPSPlaceholder.trigger('create');
        },

        update: function (model) {
            this.model = model;
            var location = this.model.get('location');
            if (location) {
                var locSplit = location.split(',');
                this.latitude = locSplit[0];
                this.longitude = locSplit[1];
                this.accuracy = this.model.get('location_accuracy');
                this.updateLocationMessage();
            }

            app.views.locationPage.renderGPStab();
        },

        /**
         * Updates the main location page message.
         */
        updateLocationMessage: function () {
            //convert coords to Grid Ref
            var location = this.get(),
                gref = locHelp.coord2grid(location);

            var type = 'Grid Ref';
            //if not in UK
            if (!gref && location) {
                type = 'Coordinates';
                gref = location.latitude.toFixed(4) + ', ' + location.longitude.toFixed(4);
            }

            this.$locationMessage.show();
            this.$locationMessage.removeClass();
            this.$locationMessage.addClass('success-message');
            this.$locationMessage.empty().append('<p>' + type + ':<br/>' + gref + '</p>');
        },


        /**
         * Saves the location to the record and returns to the previous page.
         */
        save: function () {
            var location = this.get();

            if (location.latitude && location.longitude) {
                morel.Geoloc.set(location.latitude, location.longitude, location.accuracy);

                var sref = location.latitude + ', ' + location.longitude;
                this.model.set('location', sref);
                this.model.set('location_accuracy', parseInt(location.accuracy.toFixed(0)));
                this.model.set('location_name', location.name);

                app.models.user.setLocation(location);
            } else {
                _log('views.LocationPage: invalid location to set', log.WARNING);
            }
            window.history.back();
        },

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
            this.accuracy = accuracy || -1;
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
         * User geolocation controls.
         */
        geolocate: function () {
            switch (this.geoloc.state) {
                case 'finished':
                    this.geoloc.start();
                    this.$gpsButton.html('Stop');
                    break;
                case 'running':
                    this.geoloc.stop();
                    this.$gpsButton.html('Start');
                    break;
                case 'init':
                default:
                    this.geoloc.start();
                    this.$gpsButton.html('Stop');
            }
        },

        /**
         * Variable for storing location details while running geolocation.
         */
        geoloc: {
            state: 'init',
            latitude: null,
            longitude: null,
            accuracy: -1,

            /**
             * Sets location if geolocation has an improved update of current location.
             *
             * @param location
             */
            set: function (location){
                if (this.accuracy === -1 || (this.accuracy >= location.accuracy)) {
                    this.latitude = location.latitude;
                    this.longitude = location.longitude;
                    this.accuracy = location.accuracy;

                    app.views.locationPage.set(this.latitude, this.longitude, this.accuracy);
                    app.views.locationPage.updateLocationMessage();

                } else if (this.accuracy !== -1) {
                    //geoloc->map->geoloc case where we should set old geoloc
                    app.views.locationPage.set(this.latitude, this.longitude, this.accuracy);
                    app.views.locationPage.updateLocationMessage();
                }

                return {
                    latitude: this.latitude,
                    longitude: this.longitude,
                    accuracy: this.accuracy
                };
            },

            /**
             * Starts a geolocation service and modifies the DOM with new UI.
             */
            start: function () {
                var that = this;
                this.state = 'running';
                that.updateButtonStatus();

                var $gpsTab = $('#location-opts a.gps');
                $gpsTab.addClass('running');

                function onUpdate(location) {
                   //modify the UI
                    app.views.locationPage.renderGPStab(location);
                }

                function callback(err, location) {
                    $gpsTab.removeClass('running');
                    if (err) {
                        that.state = 'init';
                        that.updateButtonStatus();

                        if (err.number != morel.Geoloc.TIMEOUT_ERR){
                            app.message(err.message);
                        }
                        app.views.locationPage.renderGPStab();
                        return;
                    }

                    that.state = 'finished';
                    that.updateButtonStatus();

                    app.views.locationPage.geoloc.set({
                        latitude: location.lat,
                        longitude: location.lon,
                        accuracy: location.acc
                    });

                    onUpdate(location);
                }

                //modify the UI
                app.views.locationPage.renderGPStab();

                //start geoloc
                var accuracyLimit = this.accuracy > 0 ? this.accuracy: null; //if improve geoloc
                morel.Geoloc.run(onUpdate, callback, accuracyLimit);
            },

            updateButtonStatus: function () {
                var $button = app.views.locationPage.$gpsButton;
                switch (this.state) {
                    case 'running':
                        $button.html('Stop');
                        break;
                    case 'finished':
                        $button.html('Improve');
                        break;
                    default:
                        $button.html('Locate');
                }
            },

            /**
             * Stops any geolocation service and modifies the DOM with new UI.
             */
            stop: function () {
                var $gpsTab = $('#location-opts a.gps');
                $gpsTab.removeClass('running');

                this.state = 'init';
                this.updateButtonStatus();

                //stop geoloc
                morel.Geoloc.stop();
                //modify the UI
                app.views.locationPage.renderGPStab();
            }
        },

        /**
         * Mapping
         */
        initializeMap: function () {
            _log("location: initialising map.", log.DEBUG);

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

            var latLon = locHelp.grid2coord(val);
            if (latLon) {
                this.set(latLon.lat, latLon.lon, 1, name);

                $('#gref-message').hide();
                this.updateLocationMessage();
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
        }
    });

    var UserLocationsView = Backbone.View.extend({
        tagName: 'ul',
        attributes: {
            'data-role': 'listview'
        },

        initialize: function (options) {
            this.model = options.model;
            this.onLocationClick = options.onLocationClick;
            this.model.on('change:locations', this.update, this);
        },

        render: function () {
            var that = this;

            //update previous locations
            var previousLocations = this.model.get('locations');
            previousLocations.forEach(function (location, index) {
                //convert coords to Grid Ref
                var gref = locHelp.coord2grid(location);

                //if not in UK
                if (!gref) {
                    gref = location.latitude.toFixed(4) + ', ' + location.longitude.toFixed(4);
                }

                that.$el.append('<li data-id="' + index + '">' +
                    (location.name ? '<strong>' + location.name + '</strong>' : '') +
                    '<p>' + gref + '</p></li>')
            });

            this.$el.find('li').on('click', function (e) {
                var locations = app.models.user.get('locations'),
                    id = $(this).data('id');

                that.onLocationClick(locations[id]);
            });

            return this;
        },

        update: function () {
            this.$el.empty();
            this.render();
            this.$el.listview('refresh');
        }
    });

    return Page;
});
