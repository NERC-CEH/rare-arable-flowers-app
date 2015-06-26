/******************************************************************************
 * Number page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function (Page) {
  'use strict';

  var NumberPage = Page.extend({
    id: 'number',

    warehouse_id: morel.record.inputs.KEYS.NUMBER,

    template: app.templates.number,

    events: {
      'click #number-save': 'save'
    },

    initialize: function () {
      _log('views.NumberPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.NumberPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },

    update: function () {
      this.$areaLength = this.$el.find('#area-length');
      this.$areaWidth = this.$el.find('#area-width');

      var value = this.model.get(this.warehouse_id);
      if (!value) {
        //unset all radio buttons
        this.$el.find("input:radio").attr("checked", false).checkboxradio("refresh");
      }

      var length = this.model.get(morel.record.inputs.KEYS.NUMBER_AREA_LENGTH);
      if (!length) {
        this.$areaLength.val('');
        this.$areaLength.slider('refresh');
      }
      var width = this.model.get(morel.record.inputs.KEYS.NUMBER_AREA_WIDTH);
      if (!width) {
        this.$areaWidth.val('');
        this.$areaWidth.slider('refresh');
      }
    },

    appendEventListeners: function () {
      this.listenTo(this.model, 'change:' + this.warehouse_id, this.update);

      this.appendBackButtonListeners();
    },

    /**
     * Saves the number to the record.
     *
     * @param e
     * @returns {boolean}
     */
    save: function (e) {
      this.$areaLength = this.$el.find('#area-length');
      this.$areaWidth = this.$el.find('#area-width');

      //save number
      var name = this.warehouse_id;
      var checkedNumberInput = this.$el.find('input[type="radio"]:checked');
      var value = checkedNumberInput.val();

      value = morel.record.inputs.KEYS.NUMBER_VAL[value];
      if (value) {
        this.model.set(name, value);
      }

      //save area
      var length = this.$areaLength.val();
      var width = this.$areaWidth.val();

      if (length) {
        this.model.set(morel.record.inputs.KEYS.NUMBER_AREA_LENGTH, parseInt(length));
      }
      if (width) {
        this.model.set(morel.record.inputs.KEYS.NUMBER_AREA_WIDTH, parseInt(width));
      }

      window.history.back();
      return false;
    }
  });

  return NumberPage;
});
