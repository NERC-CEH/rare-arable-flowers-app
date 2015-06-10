/******************************************************************************
 * Stage page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function (Page) {
  'use strict';

  var StagePage = Page.extend({
    id: 'stage',

    warehouse_id: morel.record.inputs.KEYS.STAGE,

    template: app.templates.stage,

    events: {
      'change input[type=radio]': 'save'
    },

    initialize: function () {
      _log('views.StagePage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.StagePage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },

    /**
     * Reset the page.
     */
    update: function () {
      var value = this.model.get(this.warehouse_id);
      if (!value) {
        //unset all radio buttons
        this.$el.find("input:radio").attr("checked", false).checkboxradio("refresh");
      }
    },

    appendEventListeners: function () {
      this.listenTo(this.model, 'change:' + this.warehouse_id, this.update);

      this.appendBackButtonListeners();
    },

    /**
     * Saves the stage to the record.
     *
     * @param e
     */
    save: function (e) {
      var name = this.warehouse_id;
      var value = e.currentTarget.value;
      value = morel.record.inputs.KEYS.STAGE_VAL[value];
      if (value) {
        this.model.set(name, value);
      }
      window.history.back();
    }
  });

  return StagePage;
});
