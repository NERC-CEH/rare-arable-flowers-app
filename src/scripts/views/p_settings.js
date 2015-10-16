/******************************************************************************
 * Settings page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'latlon'
], function (DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'settings',

        template: app.templates.p_settings,

        events: {
            'click #login-button': 'logInOut',
            'click #reset-app-button': 'resetApp',
            'change input[type="checkbox"]': 'saveAutosync'
        },

        initialize: function () {
            _log('views.SettingsPage: initialize', log.DEBUG);

            this.model = app.models.user;

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.SettingsPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            this.$loginButton = this.$el.find('#login-button');
            this.$locationButton = this.$el.find('#settings-location-button .descript');
            this.$autosyncButton = this.$el.find('#autosync-button');

            return this;
        },

        update: function () {
            this.updateLocationButton();
            this.updateLogInOutButton();

            this.$autosyncButton.prop('checked', this.model.get('autosync'));
            this.$autosyncButton.checkboxradio('refresh');
        },

        appendEventListeners: function () {
            this.listenTo(this.model, 'change:location', this.updateLocationButton);
            this.listenTo(this.model, 'change:secret', this.updateLogInOutButton);

            this.appendBackButtonListeners();
        },

        updateLocationButton: function () {
            var value = this.model.get('location');
            if (!value) {
                return;
            }
            var location = {
                latitude: value.split(',')[0],
                longitude: value.split(',')[1]
            };
            var p = new LatLon(location.latitude, location.longitude, LatLon.datum.WGS84);
            var grid = OsGridRef.latLonToOsGrid(p);

            this.$locationButton.html(grid.toString());
        },

        updateLogInOutButton: function () {
            if (this.model.hasSignIn()) {
                this.$loginButton.html('Sign out');
            } else {
                this.$loginButton.html('Sign in');
            }
        },

        saveAutosync: function (e) {
            var checked = $(e.target).prop('checked');
            this.model.set('autosync', checked);
            this.model.save();
        },

        /**
         * Signs the user in or out.
         */
        logInOut: function () {
            _log('views.SettingsPage: logging in/out', log.DEBUG);

            if (this.model.hasSignIn()) {
                this.model.signOut();
            } else {
                Backbone.history.navigate('login', {trigger: true});
            }
        },

        /**
         * Resets the app information messages.
         */
        resetApp: function () {
            app.models.user.set('trips', []);
            app.message('<h2>Done</h2>')
        }
    });

    return Page;
});
