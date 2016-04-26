/******************************************************************************
 * main page view.
 *****************************************************************************/
define([
    'views/_page',
    'helpers/browser',
    'templates'
], function (DefaultPage, browser) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'main',

        template: app.templates.p_main,

        initialize: function () {
            _log('views.MainPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.MainPage: render', log.DEBUG);

            this.$el.html(this.template());

            $('body').append($(this.el));

          return this;
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        }
    });

    return Page;
});
