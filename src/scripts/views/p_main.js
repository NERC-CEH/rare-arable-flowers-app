/******************************************************************************
 * main page view.
 *****************************************************************************/
define([
    'views/_page',
    'views/dialog_download',
    'views/dialog_add_homescreen',
    'helpers/browser',
    'templates'
], function (DefaultPage, download, addHomescreenDialog,
             browser) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'main',

        template: app.templates.p_main,

        events: {
            'click #download-button': 'tripDownload'
        },

        initialize: function () {
            _log('views.MainPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();

            this.trip();
        },

        render: function () {
            _log('views.MainPage: render', log.DEBUG);

            this.$el.html(this.template());

            $('body').append($(this.el));

            //disable/enable downloading
            this.$footer = this.$el.find('#main-footer');

            var downloaded = app.models.user.get('downloaded-app');
            if (downloaded) {
                this.$footer.hide();

            //silent desktop download
            } else if (!browser.isMobile()) {
                this.$footer.hide();
                if(app.CONF.OFFLINE.STATUS){
                    download(null, true);
                }
            }

            return this;
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        /**
         * Shows the user around the page.
         */
        trip: function () {
            var callback = function () {
                app.views.mainPage.$footer.hide();
            };
            var downloaded = app.models.user.get('downloaded-app');
            if (!downloaded && browser.isIOS() && browser.isHomeMode()) {
                download(callback);
            }
        },

        tripDownload: function () {
            var callback = function () {
                app.views.mainPage.$footer.hide();
            };
            addHomescreenDialog(function () {
                if (app.CONF.OFFLINE.STATUS) {
                    download(callback);
                }
            });
        }
    });

    return Page;
});
