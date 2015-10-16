/******************************************************************************
 * Stage page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
], function (DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'stage',

        template: app.templates.p_stage,

        events: {
            'change input[type=radio]': 'save',
            'click #clear-button': 'clear'
        },

        initialize: function () {
            _log('views.StagePage: initialize', log.DEBUG);
            this.name = this.id;

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.StagePage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            this.$clearButton = this.$el.find('#clear-button');
            return this;
        },

        update: function (model, multi) {
            this.model = model;

            if (multi) {
                this.$clearButton.show();
            } else {
                this.$clearButton.hide();
            }

            var value = this.model.get(this.name);
            //unset all radio buttons
            this.$el.find("input:radio").attr("checked", false).checkboxradio("refresh");
            if (value) {
                var $input = this.$el.find('input:radio[value="' + value + '"]');
                $input.prop('checked', true).checkboxradio('refresh');
            }
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        /**
         * Clears the number attribute.
         *
         * @param e
         * @returns {boolean}
         */

        clear: function (e) {
            this.model.remove(this.name);
            window.history.back();
            return false;
        },

        /**
         * Saves the number to the record.
         *
         * @param e
         * @returns {boolean}
         */
        save: function (e) {
            var value = e.currentTarget.value;
            if (value !== "") {
                this.model.set(this.name, value);
            }
            window.history.back();
            return false;
        }
    });

    return Page;
});
