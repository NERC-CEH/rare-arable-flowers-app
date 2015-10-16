/******************************************************************************
 * Multi-record species list page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/record_multi_list',
    'views/list_controls',
    'templates'
], function (DefaultPage, ListView, ListControlsView) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'record-multi-list',

        template: app.templates.p_record_multi_list,

        events: {
            'click #list-controls-save-button': 'toggleListControls',
            'click #record-multi-list-controls-button': 'toggleListControls',
            'change input[type=radio]': 'toggleListControls'
        },

        initialize: function () {
            _log('views.RecordMultiListPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();

            this.$userPageButton = $('#user-page-button');
        },

        render: function () {
            _log('views.RecordMultiListPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            //add list controls
            this.$listControlsButton = this.$el.find('#record-multi-list-controls-button');
            this.listControlsView = new ListControlsView({
                id: 'list-controls-tabs-multi',
                multi: true,
                button: this.$listControlsButton,
                filtersKey: 'filtersMulti',
                sortKey: 'sortMulti'
            });

            this.$list = this.$el.find('#record-multi-list-placeholder');

            var $listControls = this.$el.find('#record-multi-list-controls-placeholder');
            $listControls.html(this.listControlsView.el);
            return this;
        },

        renderList: function () {
            var speciesCollection = this.getPreparedSpeciesList();

            this.listView = new ListView({
                collection: speciesCollection
            });
            this.$list.html(this.listView.render().el);
            this.$list.trigger('create');
            return this.listView;
        },

        update: function () {
            this.updateListControlsButton();

            //assign the model if new
            if (!this.model) {
                if (!app.models.sampleMulti) {
                    app.models.sampleMulti = new morel.Sample();
                }
                this.model = app.models.sampleMulti;
                this.collection = this.model.occurrences;

                this.collection.on('update', this.renderList, this);
                this.renderList();

            //if working on new sample then update the model
            } else if (this.model.id !== app.models.sampleMulti.id) {
                this.model = app.models.sampleMulti;
                this.collection = this.model.occurrences;

                this.collection.on('update', this.renderList, this);
                this.renderList();
            }
        },

        getPreparedSpeciesList: function () {
            var species = new Backbone.Collection(),
                specie = null,
                occurrence = null;

            //view is unhappy if collection is just copied
            app.collections.species.each(function (model) {
                species.add(model);
            });

            //remove saved ones
            for (var i = 0; i < this.collection.length; i++) {
                occurrence = this.collection.data[i];
                specie = species.find(function(model) {
                    return model.get('id') === occurrence.get('taxon');
                });
                if (specie) {
                    species.remove(specie);
                }
            }

            return species;
        },

        appendEventListeners: function () {
            this.listenTo(app.models.user, 'change:filtersMulti', this.updateListControlsButton);

            $('.record-multi-list-img').on('click', function (e) {
                //stop propagation of jqm link
                e.stopPropagation();
                e.preventDefault();

                var id = $(this).data('id');
                Backbone.history.navigate('species/' + id, {trigger: true});
            });

            this.appendBackButtonListeners();
        },

        /**
         * Shows/closes list controls.
         */
        toggleListControls: function (e) {
            if (this.listControlsView.$el.is(":hidden")) {
                this.listControlsView.$el.slideDown("slow");
            } else {
                this.listControlsView.$el.slideUp("slow");
            }
        },

        /**
         * Updates the list controls button with the current state of the filtering.
         * If one or more filters is turned on then the button is
         * coloured accordingly.
         */
        updateListControlsButton: function () {
            var filters = app.models.user.get('filtersMulti');
            var activate = false;
            _.each(filters, function (filterGroup, filterGroupID){
                if (filterGroup.length > 0) {
                    activate = true;
                }
            });

            $(this.$listControlsButton.selector).toggleClass('running', activate);
        }
    });

    return Page;
});
