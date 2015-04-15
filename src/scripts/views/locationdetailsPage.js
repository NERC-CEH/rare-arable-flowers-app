/******************************************************************************
 * Locationdetails page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function (Page) {
  'use strict';

  var LocationdetailsPage = Page.extend({
    id: 'locationdetails',

    warehouse_id: morel.record.inputs.KEYS.LOCATIONDETAILS,

    template: app.templates.locationdetails,

    events: {
      'change input[type=radio]': 'save'
    },

    initialize: function () {
      _log('views.LocationdetailsPage: initialize', app.LOG_DEBUG);

      this.listenTo(this.model,
        'change:' + this.warehouse_id, this.update);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    update: function () {
      var value = this.model.get(this.warehouse_id);
      if (!value) {
        //unset all radio buttons
        this.$el.find("input:radio").attr("checked", false).checkboxradio("refresh");
      }
    },

    /**
     * Saves the location details to the record.
     *
     * @param e
     * @returns {boolean}
     */
    save: function (e) {
      var name = this.warehouse_id;
      var value = e.currentTarget.value;
      value = morel.record.inputs.KEYS.LOCATIONDETAILS_VAL[value];
      if (value !== "") {
        this.model.set(name, value);
      }
      window.history.back();
      return false;
    }
  });

  return LocationdetailsPage;
});
