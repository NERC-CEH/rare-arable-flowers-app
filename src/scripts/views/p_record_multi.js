/******************************************************************************
 * Multi-record sample page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
], function(DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record-multi',

        template: app.templates.p_record_multi,

        events: {
            'change input[type=radio]': 'setSurveyArea'
        },

        initialize: function () {
            _log('views.RecordMultiPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();

            this.$locationButton = this.$el.find('#record-multi-location');
            this.$commentButton = this.$el.find('#record-multi-comment .descript');
            this.$dateButton = this.$el.find('#record-multi-date .descript');
        },

        render: function () {
            _log('views.RecordMultiPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            return this;
        },

        update: function (prevPageId) {
            _log('views.RecordMultiPage: update.', log.DEBUG);
            switch (prevPageId) {
                case 'list':
                    this.initRecording();
                    break;
                case '':
                    _log('views.RecordMultiPage: coming from unknown page.', log.WARNING);
                    this.initRecording();
                default:
            }

            this.trip();
        },

        initRecording: function () {
            this.model = new morel.Sample();
            this.model.set('survey_area', 'point');
            app.models.sampleMulti = this.model;

            this.model.on('change:comment', this.updateCommentButton, this);
            this.model.on('change:location_accuracy', this.updateGPSButton, this);
            this.model.on('change:location', this.updateGPSButton, this);
            this.model.on('change:date', this.updateDateButton, this);

            this.refreshButtons();

            this.runGeoloc();
        },

        /**
         * Runs geolocation service in the background and updates the record on success.
         */
        runGeoloc: function () {
            var that = this;
            this.model.set('location_accuracy', 0); //running

            function callback(err, location) {
                if (err) {
                    that.model.set('location_accuracy', -1); //stopped
                    return;
                }

                _log('views.RecordPage: saving location.', log.DEBUG);

                var sref = location.lat + ', ' + location.lon;
                that.model.set('location', sref);
                that.model.set('location_accuracy', location.acc);
            }

            morel.Geoloc.run(null, callback);
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        refreshButtons: function () {
            this.updateGPSButton();
            this.updateDateButton();
            this.updateCommentButton();
        },

        /**
         * Udates the GPS button with the traffic light indication showing GPS status.
         */
        updateGPSButton: function () {
            var text = '';

            var accuracy = this.model.get('location_accuracy');
            switch (true) {
                case (accuracy > 0):
                    //done
                    this.$locationButton.addClass('done');
                    this.$locationButton.removeClass('running');
                    this.$locationButton.removeClass('none');

                    var value = this.model.get('location');
                    var location = {
                        latitude: value.split(',')[0],
                        longitude: value.split(',')[1]
                    };
                    var p = new LatLon(location.latitude, location.longitude, LatLon.datum.WGS84);
                    var grid = OsGridRef.latLonToOsGrid(p);
                    text = grid.toString();
                    break;
                case (accuracy == 0):
                    //running
                    this.$locationButton.addClass('running');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('none');

                    text = 'Locating..';
                    break;
                case (accuracy == -1):
                    //none
                    this.$locationButton.addClass('none');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('running');

                    text = 'Required';
                    break;
                default:
                    _log('views.RecordPage: ERROR no such GPS button state: ' + accuracy, log.WARNING);
                    //none
                    this.$locationButton.addClass('none');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('running');

                    text = 'Required';
            }

            this.$locationButton.find('.descript').html(text);
        },

        updateDateButton: function () {
            var value = this.model.get('date');
            var text = value || '';
            this.$dateButton.html(text);
        },

        /**
         * Updates the button info text.
         */
        updateCommentButton: function () {
            var value = this.model.get('comment');
            var ellipsis = value && value.length > 20 ? '...' : '';
            value = value ? value.substring(0, 20) + ellipsis : ''; //cut it down a bit
            this.$commentButton.html(value);
        },

        /**
         * Updates sample level survey area attribute.
         */
        setSurveyArea: function (e) {
            this.model.set('survey_area', $(e.currentTarget).val());
        },

        /**
         * Shows the user around the page.
         */
        trip: function () {
            var finishedTrips = app.models.user.get('trips') || [];
            if (finishedTrips.indexOf('record-multi') < 0) {
                finishedTrips.push('record-multi');
                app.models.user.set('trips', finishedTrips);
                app.models.user.save();

                var okBtnID = 'OK-dialog-button';
                var  message =
                    '<div class="add-homescreen">' +
                    '<center><h2>Multi Recording</h2></center>' +
                    '<p>Use this to record all of the species you see during a walk/survey ' +
                    'of a site.</p>' +
                    '<button id="' + okBtnID + '">OK</button>' +
                    '</div>';

                app.message(message, 0);

                $('#' + okBtnID).on('click', function () {
                    $.mobile.loading('hide');
                });
            }

        }
    });

    return Page;
});

