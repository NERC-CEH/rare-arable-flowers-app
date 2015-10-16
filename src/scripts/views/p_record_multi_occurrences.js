/******************************************************************************
 * Multi-record occurrences page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/record_multi_occurrences_list',
    'templates',
    'morel',
    'conf'
], function(DefaultPage, RecordMultiOccurrencesListView) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record-multi-occurrences',

        template: app.templates.p_record_multi_occurrences,

        events: {
            'click #record-multi-occurrences-save': 'save'
        },

        initialize: function () {
            _log('views.RecordMultiOccurrences: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.RecordMultiOccurrences: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            return this;
        },

        update: function () {
            //assign the model if new
            if (!this.model) {
                if (!app.models.sampleMulti) {
                    app.models.sampleMulti = new morel.Sample();
                }
                this.model = app.models.sampleMulti;
                this.renderList();

            //if working on new sample then update the model
            } else if (this.model.id !== app.models.sampleMulti.id) {
                this.model = app.models.sampleMulti;
                this.renderList();
            }
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        renderList: function () {
            this.listView = new RecordMultiOccurrencesListView({
                collection: this.model.occurrences
            });
            this.$list = this.$el.find('#record-multi-occurrences-list');
            this.$list.html(this.listView.render().el);

            return this.listView;
        },

        save: function () {
            _log('views.RecordMultiOccurrences: saving record.', log.DEBUG);

            var that = this;

            if (!this.valid()) {
                return;
            }

            function callback(err) {
                if (err) {
                    app.message(err);
                    return;
                }

                morel.Geoloc.clear();

                if (window.navigator.onLine && app.models.user.hasSignIn() && app.models.user.get('autosync')) {
                    app.recordManager.syncAll(function (sample) {
                        app.models.user.appendSampleUser(sample);
                    });
                }

                app.message("<center><h2>Record saved.</h2></center>");
                setTimeout(function () {
                    Backbone.history.navigate('list', {trigger: true});
                }, 2000);
            }

            var yesButtonID = 'yes-button',
                noButtonID = 'no-button';

            var message =
                '<h3><center>Did you record all species present?</center></h3>' +
                '<fieldset data-role="controlgroup" data-type="horizontal" class="wide">' +
                    '<button id="' + yesButtonID + '"' +
                    'class="ui-btn ui-btn-inline ui-icon-check ui-btn-icon-left ' +
                    'ui-mini">Yes</button>' +

                    '<button id="' + noButtonID + '"' +
                    'class="ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-left ' +
                    'ui-mini">No</button>' +
                '</fielset>';

            app.message(message, 0);

            $('#' + yesButtonID).on('click', function () {
                that.model.offAll();
                that.model.set('recorded_all', true);
                app.recordManager.set(that.model, callback);
            });

            $('#' + noButtonID).on('click', function () {
                that.model.offAll();
                that.model.set('recorded_all', false);
                app.recordManager.set(that.model, callback);
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
                Backbone.history.navigate('location/multi', {trigger: true});
                return morel.FALSE;
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
        _validate: function () {
            var invalids = [],
                model = this.model;

            if (!model.has('date')) {
                invalids.push('Date');
            } else {
                //check if valid date
                var input = model.get('date').split('/');
                var inputDate = new Date(parseInt(input[2]), parseInt(input[1]) - 1, parseInt(input[0]));
                var currentDate =  new Date();
                if (inputDate > currentDate) {
                    invalids.push('Non future Date');
                }
            }

            if (!model.has('location')) {
                invalids.push('Location');
            }
            if (!model.occurrences.length) {
                invalids.push('Selected species');
            }
            return invalids.length > 0 ? invalids : null;
        }
    });

    return Page;
});

