/******************************************************************************
 * Number page view.
 *****************************************************************************/
define([
    'views/_page',
    'templates',
    'morel',
    'conf'
], function (DefaultPage) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'number',

        template: app.templates.p_number,

        events: {
            'change input[type=radio]': 'save',
            'click #number-save': 'save',
            'click #clear-button': 'clear'
        },

        initialize: function () {
            _log('views.NumberPage: initialize', log.DEBUG);
            this.name = this.id;

            this.render();
            this.appendEventListeners();
        },

        render: function () {
            _log('views.NumberPage: render', log.DEBUG);

            this.$el.html(this.template());
            $('body').append($(this.el));

            this.$clearButton = this.$el.find('#clear-button');
            this.$saveButton = this.$el.find('#number-save');
            this.$areaInputs = this.$el.find('#area-inputs');
            this.$areaLength = this.$el.find('#area-length');
            this.$areaWidth = this.$el.find('#area-width');
            return this;
        },

        update: function (model, multi) {
            this.model = model;
            this.multi = multi;

            if (multi) {
                this.$saveButton.hide();
                this.$clearButton.show();
                this.$areaInputs.hide();
            } else {
                this.$saveButton.show();
                this.$clearButton.hide();
                this.$areaInputs.show();
            }

            var value = this.model.get(this.name);
            //unset all radio buttons
            this.$el.find("input:radio").attr("checked", false).checkboxradio("refresh");
            if (value) {
                var $input = this.$el.find('input:radio[value="' + value + '"]');
                $input.prop('checked', true).checkboxradio('refresh');
            }

            //area
            var length = this.model.get('area-length');
            if (!length) {
                this.$areaLength.val('');
                this.$areaLength.slider();
                this.$areaLength.slider('refresh');
            }
            var width = this.model.get('area-width');
            if (!width) {
                this.$areaWidth.val('');
                this.$areaWidth.slider();
                this.$areaWidth.slider('refresh');
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
            var value = null;

            if (this.multi) {
                value = e.currentTarget.value;
            } else if (e.currentTarget.tagName === 'BUTTON') {

                //save number
                var checkedNumberInput = this.$el.find('input[type="radio"]:checked');
                value = checkedNumberInput.val();

                //save area
                var length = this.$areaLength.val();
                var width = this.$areaWidth.val();

                if (length) {
                    this.model.set('area-length', parseInt(length));
                }
                if (width) {
                    this.model.set('area-width', parseInt(width));
                }
            } else {
                return;
            }

            if (value) {
                this.model.set(this.name, value);
            }

            window.history.back();
            return false;
        }
    });

    return Page;
});
