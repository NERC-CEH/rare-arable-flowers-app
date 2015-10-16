/******************************************************************************
 * Multi-record picked occurrences list view used.
 *****************************************************************************/
define([
    'backbone',
    'templates'
], function (Backbone) {
    'use strict';

    var View = Backbone.View.extend({
        tagName: 'ul',

        attributes: {
            'data-role': 'listview',
            'class': 'listview-full'
        },

        /**
         * Initializes the species list view.
         */
        initialize: function () {
            _log('views.RecordMultiOccurrencesList: initialize', log.DEBUG);

            this.collection.on('change', this.update, this);
            this.collection.on('update', this.update, this);
        },

        /**
         * Renders the species list.
         * @returns {SpeciesListView}
         */
        render: function () {
            _log('views.RecordMultiOccurrencesList: render ', log.DEBUG);

            var container = document.createDocumentFragment(); //optimising the performance

            if (this.collection.length) {
                _.each(this.collection.data, function (occurrence) {
                    var item = new RecordMultiOccurrencesListItemView({
                        model: occurrence
                    });
                    container.insertBefore(item.el, container.firstChild);
                });

                this.$el.html(container); //appends to DOM only once
                this.$el.listview().listview('refresh');

                //attach listeners
                $('.record-multi-occurrences-remove').on('click', function () {
                    _log('views.RecordMultiOccurrencesList: removing saved occurrence.', log.DEBUG);

                    var id = $(this).data('id');
                    app.models.sampleMulti.occurrences.remove(id);
                });
                $('#empty-list-message').hide();
            } else {
                this.$el.empty();
                $('#empty-list-message').show();
            }

            return this;
        },

        update: function () {
            _log('views.RecordMultiOccurrencesList: updating', log.DEBUG);

            this.render();
        }
    });


    var RecordMultiOccurrencesListItemView = Backbone.View.extend({
        tagName: "li",

        template: app.templates.record_multi_occurrences_list_item,

        initialize: function () {
            _log('views.RecordMultiOccurrencesListItem: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        /**
         * Renders the individual list item representing the species.
         *
         * @returns {SpeciesListItemView}
         */
        render: function () {
            var speciesID = this.model.get('taxon');
            var specie = app.collections.species.find({id: speciesID});

            var template_data = $.extend({}, specie.attributes); //clone the object
            template_data.id = this.model.id;

            template_data.number = this.model.get('number');
            template_data.stage = this.model.get('stage');
            template_data.locationdetails = this.model.get('locationdetails');

            var comment = this.model.get('comment');
            var ellipsis = comment && comment.length > 20 ? '...' : '';
            template_data.comment = comment ? comment.substring(0, 20) + ellipsis : ''; //cut it down a bit

            template_data.img = this.model.images.getFirst();

            this.$el.html(this.template(template_data));

            this.$imgPickerFile = this.$el.find('.img-picker-file');
            this.$imgPickerDisplay = this.$el.find('.img-picker-display');

            return this;
        },

        appendEventListeners: function () {
            //attach event listeners
            var that = this;

            this.$imgPickerFile.change(function () {
                $.mobile.loading('show');

                var callback = function (err, data, fileType) {
                    morel.Image.resize(data, fileType, 800, 800, function (err, image, data) {
                        that.model.images.set(new morel.Image({
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
        }
    });

    return View;
});
