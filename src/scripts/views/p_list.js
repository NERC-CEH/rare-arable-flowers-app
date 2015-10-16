/******************************************************************************
 * List page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/list',
    'views/list_controls',
    'templates'
], function (DefaultPage, ListView, ListControlsView,
             browser) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'list',

        template: app.templates.p_list,

        events: {
            'click #list-controls-save-button': 'toggleListControls',
            'click #list-controls-button': 'toggleListControls',
            'change input[type=radio]': 'toggleListControls'
        },

        initialize: function () {
            _log('views.ListPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();

            this.$userPageButton = $('#user-page-button');
            this.updateUserPageButton();
        },

        render: function () {
            _log('views.ListPage: render', log.DEBUG);

            this.$el.html(this.template());

            //add list controls
            this.$listControlsButton = this.$el.find('#list-controls-button');
            this.listControlsView = new ListControlsView();
            var $listControlsView = this.listControlsView;

            var $listControls = this.$el.find('#list-controls-placeholder');
            $listControls.html(this.listControlsView.el);

            //add list
            this.$list = this.$el.find('#list-placeholder');
            this.renderList(function ($list) {
                $listControlsView.updateCounter.apply($listControlsView, [$list]);
            });

            $('body').append($(this.el));

            return this;
        },

        renderList: function (onRender) {
            this.listView = new ListView({
                collection: app.collections.species,
                onRender: onRender
            });
            this.$list.html(this.listView.render(onRender).el);
            return this.listView;
        },

        update: function () {
            this.updateListControlsButton();
        },

        appendEventListeners: function () {
            this.listenTo(app.models.user, 'change:filters', this.updateListControlsButton);
            app.recordManager.on('update', this.updateUserPageButton, this);
            app.recordManager.on('sync:done', this.updateUserPageButton, this);
            this.appendBackButtonListeners();
        },

        /**
         * Shows/closes list controls.
         */
        toggleListControls: function (e) {
            if (this.listControlsView.$el.is(":hidden")) {
                this.listControlsView.$el.slideDown("slow");
                this.$list.addClass("ui-state-disabled");
            } else {
                this.$list.removeClass("ui-state-disabled");
                this.listControlsView.$el.slideUp("slow");
            }
        },

        /**
         * Updates the list controls button with the current state of the filtering.
         * If one or more filters is turned on then the button is
         * coloured accordingly.
         */
        updateListControlsButton: function () {
            var filters = app.models.user.get('filters');
            var activate = false;
            _.each(filters, function (filterGroup, filterGroupID){
                if (filterGroup.length > 0) {
                    activate = true;
                }
            });

            $(this.$listControlsButton.selector).toggleClass('running', activate);
        },

        /**
         * Updates the user page navigation button with the state of saved records.
         */
        updateUserPageButton: function () {
            _log('views.ListPage: updating user button.', log.DEBUG);
            var that = this;

            function onSuccess(err, samples) {
                var unsent = 0;
                samples.each(function (sample) {
                    if (sample.getSyncStatus() === morel.LOCAL) unsent++;
                });
                that.$userPageButton.toggleClass('running', unsent > 0);
            }
            app.recordManager.getAll(onSuccess);
        }
    });

    return Page;
});
