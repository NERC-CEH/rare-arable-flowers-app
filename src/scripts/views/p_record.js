/******************************************************************************
 * Record page view.
 *****************************************************************************/
define([
    'views/_page',
    'morel',
    'templates',
    'conf'
], function (DefaultPage, morel, contactDetailsDialog) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record',

        template: app.templates.p_record,

        events: {
            'click #entry-form-save': 'save',
            'change input[type="checkbox"]': 'saveCertain'
        },

        initialize: function () {
            _log('views.RecordPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.RecordPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            this.$heading = this.$el.find('#record_species');
            this.$certainInputLabel = this.$el.find('#certain-button-label');
            this.$certainInput = this.$el.find('#certain-button');
            this.$photo = this.$el.find('#photo');
            this.$locationButton = this.$el.find('#location-button');
            this.$numberButton = this.$el.find('#number-button .descript');
            this.$stageButton = this.$el.find('#stage-button .descript');
            this.$locationdetailsButton = this.$el.find('#locationdetails-button .descript');
            this.$commentButton = this.$el.find('#comment-button .descript');
            this.$dateButton = this.$el.find('#date-button .descript');
            this.$imgPickerDisplay = this.$el.find('.img-picker-display');
            this.$imgPickerFile = this.$el.find('.img-picker-file');

            return this;
        },

        update: function (prevPageId, speciesID) {
            _log('views.RecordPage: update.', log.DEBUG);
            switch (prevPageId) {
                case 'list':
                case 'species':
                    this.initRecording(speciesID);
                    break;
                case '':
                    _log('views.RecordPage: coming from unknown page.', log.WARNING);
                    this.initRecording(speciesID);
                default:
            }

            this.trip();
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
            this.setPhotoPickerListener();
        },

        appendSampleListeners: function () {
            this.model.on('change:comment', this.updateCommentButton, this);
            this.model.on('change:location_accuracy', this.updateGPSButton, this);
            this.model.on('change:location', this.updateGPSButton, this);
            this.model.on('change:date', this.updateDateButton, this);
        },

        appendOccurrenceListeners: function () {
            this.occurrence.on('change:number', this.updateNumberButton, this);
            this.occurrence.on('change:stage', this.updateStageButton, this);
            this.occurrence.on('change:locationdetails', this.updateLocationDetailsButton, this);
        },

        /**
         * Initialises the recording form: sets empty image, clears geolocation etc.
         */
        initRecording: function (speciesID) {
            var specie = app.collections.species.find({id: speciesID});
            this.occurrence = new morel.Occurrence({
                attributes: {
                    taxon: speciesID,
                    number: 'Present',
                    certain: true
                }
            });

            this.model = new morel.Sample({
                occurrences: [this.occurrence]
            });

            app.models.sample = this.model; //needs to be globally accessible

            this.appendSampleListeners();
            this.appendOccurrenceListeners();

            //add header to the page
            this.$heading.text(specie.attributes.common_name + ' ' + specie.attributes.common_name_significant);

            this.resetButtons();

            //reset photo picker
            this.$imgPickerDisplay.empty();
            this.$imgPickerDisplay.removeClass('selected');
            //http://stackoverflow.com/questions/20549241/how-to-reset-input-type-file
            var tmpPicker = this.$imgPickerFile.val('').clone(true);
            this.$imgPickerFile.replaceWith(tmpPicker);
            this.$imgPickerFile = tmpPicker;

            //turn off certainty option on general ones
            if (specie.attributes.general) {
                this.$certainInputLabel.hide();
                this.$certainInput.hide();
            } else {
                this.$certainInputLabel.show();
                this.$certainInput.show();
            }

            //start geolocation
            this.runGeoloc();

            this.updateDateButton(); //morel sets date automatically, before listeners are attached
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

        /**
         * Saves the record.
         */
        save: function () {
            _log('views.RecordPage: saving record.', log.DEBUG);

            $.mobile.loading('show');

            if (!this.valid()) {
                return;
            }

            function callback(err) {
                if (err) {
                    app.message(err);
                    return;
                }

                morel.Geoloc.clear();

                app.message("<h2>Record saved</h2>");

                if (window.navigator.onLine && app.models.user.hasSignIn() && app.models.user.get('autosync')) {
                    app.recordManager.syncAll(function (sample) {
                        app.models.user.appendSampleUser(sample);
                    });
                }

                setTimeout(function () {
                    Backbone.history.navigate('list', {trigger: true});
                }, 2000);
            }

            this.model.offAll();
            app.recordManager.set(this.model, callback);
        },

        saveCertain: function (e) {
            var checked = $(e.target).prop('checked');
            this.occurrence.set('certain', checked);
        },

        /**
         * Sets the user selected species image as a background of the image picker.
         *
         * @param input
         * @returns {boolean}
         */
        setPhotoPickerListener: function () {
            var that = this;

            this.$imgPickerFile.change(function (e) {
                e.preventDefault();
                $.mobile.loading('show');

                var callback = function (err, data, fileType) {
                    morel.Image.resize(data, fileType, 800, 800, function (err, image, data) {
                        that.occurrence.images.set(new morel.Image({
                            data: data,
                            type: fileType
                        }));

                        that.$imgPickerDisplay.empty().append(image);
                        that.$imgPickerDisplay.addClass('selected');

                        $.mobile.loading('hide');
                    });
                };

                morel.Image.toString(this.files[0], callback);

                return false;
            });
        },

        /**
         * Validates the record and GPS lock.
         *
         * @returns {*}
         */
        valid: function () {
            //validate location
            var accuracy = morel.Geoloc.accuracy;
            if (accuracy === -1 || accuracy > app.CONF.GPS_ACCURACY_LIMIT) {
                //redirect to location page
                Backbone.history.navigate('location', {trigger: true});
                return false;
            }

            //validate the rest
            var invalids = this._validate();
            if (invalids) {
                var message =
                    "<h2>Still missing:</h2><ul>";

                for (var i = 0; i < invalids.length; i++) {
                    message += "<li>" + invalids[i] + "</li>";
                }

                message += "</ul>";
                app.message(message);
                return false;
            }

            return true;
        },

        /**
         * Validates the record inputs.
         */
        _validate: function (attrs, options) {
            var invalids = [];

            if (!this.model.has('date')) {
                invalids.push('Date');
            } else {
                //check if valid date
                var input = this.model.get('date').split('/');
                var inputDate = new Date(parseInt(input[2]), parseInt(input[1]) - 1, parseInt(input[0]));
                var currentDate =  new Date();
                if (inputDate > currentDate) {
                    invalids.push('Non future Date');
                }
            }

            if (!this.model.has('location')) {
                invalids.push('Location');
            }
            if (!this.occurrence.has('taxon')) {
                invalids.push('Taxon');
            }
            return invalids.length > 0 ? invalids : null;
        },

        /**
         * Udates the GPS button with the traffic light indication showing GPS status.
         */
        updateGPSButton: function () {
            var text = '';

            var accuracy = this.model.get('location_accuracy');
            switch (true) {
                case (accuracy == -1 || accuracy === 'undefined'):
                    //none
                    this.$locationButton.addClass('none');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('running');

                    text = 'Required';
                    break;
                case (accuracy > 0):
                    //done
                    this.$locationButton.addClass('done');
                    this.$locationButton.removeClass('running');
                    this.$locationButton.removeClass('none');

                    var value = this.model.get('location');
                    var location = {
                        latitude: parseFloat(value.split(',')[0]),
                        longitude: parseFloat(value.split(',')[1])
                    };
                    var p = new LatLon(location.latitude, location.longitude, LatLon.datum.WGS84);
                    var grid = OsGridRef.latLonToOsGrid(p);
                    text = grid.toString();
                    //if not in UK
                    if (!text) {
                        text = location.latitude.toFixed(4) + ', ' + location.longitude.toFixed(4);
                    }
                    break;
                case (accuracy == 0):
                    //running
                    this.$locationButton.addClass('running');
                    this.$locationButton.removeClass('done');
                    this.$locationButton.removeClass('none');

                    text = 'Locating..';
                    break;
                default:
                    _log('views.RecordPage: no such GPS button state: ' + accuracy, log.WARNING);
            }

            this.$locationButton.find('.descript').html(text);
        },

        updateDateButton: function () {
            var value = this.model.get('date');
            this.$dateButton.html(value || '');
        },

        /**
         * Resets the record page buttons to initial state.
         */
        resetButtons: function () {
            this.updateNumberButton();
            this.updateStageButton();
            this.updateCommentButton();

            this.$certainInput.prop('checked', true).checkboxradio('refresh');
        },

        /**
         * Updates the button info text.
         */
        updateNumberButton: function () {
            var value = this.occurrence.get('number');
            this.$numberButton.html(value || '');
        },

        /**
         * Updates the button info text.
         */
        updateStageButton: function () {
            var value = this.occurrence.get('stage');
            this.$stageButton.html(value || '');
        },

        updateLocationDetailsButton: function () {
            var value = this.occurrence.get('locationdetails');
            this.$locationdetailsButton.html(value || '');
        },

        /**
         * Updates the button info text.
         */
        updateCommentButton: function () {
            var value = this.model.get('comment');
            var ellipsis = value && value.length > 20 ? '...' : '';
            value = value ? value.substring(0, 20) + ellipsis : ''; //cut it down a bit
            this.$commentButton.html(value || '');
        },

        /**
         * Shows the user around the page.
         */
        trip: function () {
            var finishedTrips = app.models.user.get('trips') || [];
            if (finishedTrips.indexOf('record') < 0) {
                finishedTrips.push('record');
                app.models.user.set('trips', finishedTrips);
                app.models.user.save();

                var okBtnID = 'OK-dialog-button';
                var  message =
                    '<div class="add-homescreen">' +
                        '<center><h2>Recording species</h2></center>' +
                        '<p>Use this to submit <b>individual</b> sightings. </p>' +
                        '<p>For recording multiple species from an area, go back to the ' +
                        '<b style="white-space: nowrap">home page</b> and click the ' +
                        '<b style="white-space: nowrap">double-plus button</b> (top-right).</p>' +
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

