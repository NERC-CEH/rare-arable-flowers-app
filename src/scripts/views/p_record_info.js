/******************************************************************************
 * Saved record info page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'conf'
], function (DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record-info',

        template: app.templates.p_record_info,

        events: {
            'click #record-delete-button': 'delete'
        },

        initialize: function () {
            _log('views.RecordInfoPage: initialize', log.DEBUG);

            this.render();
        },

        render: function () {
            _log('views.RecordInfoPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            this.$recordInfoPlaceholder = this.$el.find('#record-info-placeholder');

            this.appendBackButtonListeners();
            return this;
        },

        update: function (model) {
            _log('views.RecordInfoPage: update', log.DEBUG);

            this.model = model;

            var location = this.model.get('location');
            location = {
                latitude: parseFloat(location.split(',')[0]),
                longitude: parseFloat(location.split(',')[1])
            };
            var p = new LatLon(location.latitude, location.longitude, LatLon.datum.WGS84);
            var grid = OsGridRef.latLonToOsGrid(p);
            grid = grid.toString();
            //if not in UK
            if (!grid) {
                grid = location.latitude.toFixed(4) + ', ' + location.longitude.toFixed(4);
            }

            var templateData = {
                date: this.model.get('date'),
                location: grid,
                comment: this.model.get('comment'),
                recorded_all: this.model.get('recorded_all'),
                occurrences: []
            };

            this.model.occurrences.each(function (occurrence) {
                var specie = app.collections.species.get(occurrence.get('taxon'));
                var data = $.extend({}, occurrence.attributes);
                data.common_name = specie.get('common_name');
                data.common_name_significant = specie.get('common_name_significant');
                data.taxon = specie.get('taxon');
                data.taxon = specie.get('locationdetails');
                data.img = occurrence.images.getFirst();

                templateData.occurrences.push(data);
            });

            var recordInfoView = new RecordInfoView({model: templateData});
            this.$recordInfoPlaceholder.html(recordInfoView.render().el);
            this.$recordInfoPlaceholder.trigger('create');
        },

        delete: function () {
            var that = this;
            var finishedTrips = app.models.user.get('trips');
            if (finishedTrips.indexOf('record-info') < 0 && this.model.warehouse_id) {
                finishedTrips.push('record-info');
                app.models.user.set('trips', finishedTrips);
                app.models.user.save();

                var okBtnID = 'OK-dialog-button';
                var  message =
                    '<div class="add-homescreen">' +
                    '<center><h2>Note</h2></center>' +
                    '<p>Only the record of the sighting held on your mobile device' +
                    ' will be deleted. The sighting you have already sent will remain' +
                    ' in our database.</p>' +
                    '<button id="' + okBtnID + '">OK</button>' +
                    '</div>';

                app.message(message, 0);

                $('#' + okBtnID).on('click', function () {
                    $.mobile.loading('hide');
                    app.recordManager.remove(that.model);
                    window.history.back();
                });
            } else {
                app.recordManager.remove(this.model);
                window.history.back();
            }
        }
    });


    var RecordInfoView = Backbone.View.extend({
        template: app.templates.record_info,

        /**
         * Renders the species profile.
         *
         * @returns {SpeciesProfile}
         */
        render: function () {
            this.$el.html(this.template(this.model));
            return this;
        }
    });

    return Page;
});
