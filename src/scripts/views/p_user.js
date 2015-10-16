/******************************************************************************
 * User page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/dialog_user_details',
    'templates',
    'latlon'
], function (DefaultPage, contactDetailsDialog) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'user',

        template: app.templates.p_user,

        events: {
            'click #syncAll-button': 'syncAll',
            'click .sync': 'sync',
            'click .delete-button': 'deleteSavedRecord'
        },

        initialize: function () {
            _log('views.UserPage: initialize', log.DEBUG);

            this.model = app.models.user;

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.UserPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            this.$loginWarning = this.$el.find('#login-warning');
            this.$list = this.$el.find('#samples-list-placeholder');
            this.$heading = this.$el.find('#user_heading');

            this.renderUserControls();
            this.renderList();

            return this;
        },

        renderList: function () {
            var that = this;
            app.recordManager.getAll(function (err, samples) {
                if (err) {
                    app.message(err);
                    return;
                }
                that.listView = new SamplesList({
                    collection: samples
                });
                that.$list.html(that.listView.el);
            });
        },

        /**
         * Renders the user login information.
         */
        renderUserControls: function () {
            if (app.models.user.hasSignIn()) {
                //logged in
                var name = app.models.user.get('name');
                var surname = app.models.user.get('surname');
                this.$heading.html(name + ' ' + surname);
                this.$loginWarning.hide();
            } else {
                //logged out
                this.$heading.html('My Account');
                this.$loginWarning.show();
            }
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
            this.listenTo(this.model, 'login logout', this.renderUserControls);
        },

        /**
         * Recursively sends all the saved user records.
         */
        syncAll: function (e) {
            function onSample(sample) {
                app.models.user.appendSampleUser(sample);
            }

            function callback(err) {
                if (err) {
                    app.message(err);
                    return;
                }
                app.message('<h2>All synchronised</h2>');
            }

            if (navigator.onLine) {
                var $button = $(e.currentTarget);

                app.recordManager.on('sync:request', function () {
                    $button.addClass('sync-icon-reload');
                });

                app.recordManager.on('sync:err', function () {
                    $button.removeClass('sync-icon-reload');
                });

                app.recordManager.on('sync:done', function () {
                    $button.removeClass('sync-icon-reload');
                });


                if (app.models.user.hasSignIn()) {
                    app.recordManager.syncAll(onSample, callback);
                } else {
                    contactDetailsDialog(function () {
                        app.recordManager.syncAll(onSample, callback);
                    });
                }
            } else {
                //offline
                app.message("<h2>You are offline</h2>");
            }
        },

        /**
         * Sends the saves user record.
         *
         * @param e Event of an element that contains the ID of the saved record as
         * data attribute.
         */
        sync: function (e) {
            var $button = $(e.currentTarget),
                sampleID = $button.data('id');

            var callback = null;
            if (navigator.onLine) {
                //online
                app.recordManager.get(sampleID, function (err, sample) {
                    callback = function (err) {
                        if (err) {
                            app.message(err);
                            return;
                        }
                    };

                    //one way sync (submit) if user is not signed in
                    if (sample.getSyncStatus() != morel.LOCAL) {
                        return;
                    }

                    if (app.models.user.hasSignIn()) {
                        //append user details
                        app.models.user.appendSampleUser(sample);
                        app.recordManager.sync(sample, callback);
                    } else {
                        contactDetailsDialog(function () {
                            //append user details
                            app.models.user.appendSampleUser(sample);
                            app.recordManager.sync(sample, callback);
                        });
                    }
                });
            } else {
                //offline
                app.message("<h2>You are offline</h2>");
            }
        },

        /**
         * Deletes the saves user record.
         *
         * @param e Event of an element that contains the ID of the saved record as
         * data attribute.
         */
        deleteSavedRecord: function (e) {
            //stop propagation of jqm link
            e.stopPropagation();
            e.preventDefault();

            var recordKey = $(e.currentTarget).data('id');
            app.recordManager.remove(recordKey);
        }
    });

    var SamplesList = Backbone.View.extend({
        template: app.templates.samples_list,

        initialize: function () {
            this.render();
            //update view on collection change
            this.collection.on('reset', this.render, this);
            this.collection.on('update', this.render, this);
        },

        render: function () {
            _log('views.SamplesList: render', log.DEBUG);

            this.$el.html(this.template());
            this.$list = this.$el.find('#samples-list');
            this.renderList();
            this.$list.listview().listview('refresh');
        },

        renderList: function () {
            var that = this;
            this.collection.sort(function (a, b) {
                a = a.get('date').split('/');
                a = new Date(a[2], a[1], a[0]);

                b = b.get('date').split('/');
                b = new Date(b[2], b[1], b[0]);

                return (a<b)-(a>b) ;
            });
            this.collection.each(function (sample) {
                var sampleView = new SamplesListItem({
                    model: sample
                });
                that.$list.append(sampleView.el);
            });
        }
    });

    var SamplesListItem = Backbone.View.extend({
        tagName: "li",

        template: app.templates.samples_list_item,

        initialize: function () {
            this.render();
            this.$syncButton = this.$el.find('.sync');

            this.showSyncStatus();
           // this.model.on('change', this.render, this);
            this.model.on('sync:done', this.showSyncStatus, this);
            this.model.on('sync:error', this.showSyncStatus, this);
            this.model.on('sync:request', this.showSync, this);

        },

        render: function () {
            _log('views.SamplesListItem: render', log.DEBUG);

            var templateData = {};
            templateData.id = this.model.id;
            templateData.date = this.model.get('date');

            if (!this.model.get('recorded_all')) {
                var occurrence = this.model.occurrences.getFirst(),
                    speciesID = occurrence.get('taxon');
                var specie = app.collections.species.find({id: speciesID});
                templateData.common_name = specie ? specie.attributes.common_name : '';
                templateData.common_name_significant = specie ? specie.attributes.common_name_significant : '';

                templateData.img = occurrence.images.getFirst();

                //multi record
            } else {
                templateData.multiRecord = this.model.occurrences.length;
            }

            this.$el.html(this.template(templateData));
            //trigger create
        },

        showSyncStatus: function () {
            if (this.model.getSyncStatus() === morel.SYNCED) {
                //on cloud
                this.$syncButton.removeClass('sync-icon-reload');
                this.$syncButton.removeClass('sync-icon-local');
                this.$syncButton.addClass('sync-icon-cloud');
            } else {
                //local
                this.$syncButton.removeClass('sync-icon-reload');
                this.$syncButton.removeClass('sync-icon-cloud');
                this.$syncButton.addClass('sync-icon-local');
            }
        },

        showSync: function () {
            this.$syncButton.removeClass('sync-icon-local');
            this.$syncButton.removeClass('sync-icon-cloud');
            this.$syncButton.addClass('sync-icon-reload');
        }
    });

    return Page;
});
