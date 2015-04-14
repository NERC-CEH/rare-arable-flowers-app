/******************************************************************************
 * Date page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function (Page) {
  'use strict';

  var DatePage = Page.extend({
    id: 'date',

    warehouse_id: morel.record.inputs.KEYS.DATE,

    template: app.templates.date,

    events: {
      'click #date-save': 'save'
    },

    initialize: function () {
      _log('views.DatePage: initialize', log.DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    /**
     * Saves the date to the record.
     */
    save: function () {
      var name = this.warehouse_id;
      var ele = document.getElementById(name);
      var value = $(ele).val();
      if (value !== "") {
        this.model.set(name, value);
      }
      window.history.back();
    }
  });

  return DatePage;
});
