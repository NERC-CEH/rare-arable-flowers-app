/******************************************************************************
 * Comment page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'morel',
  'conf'
], function (Page) {
  'use strict';

  var CommentPage = Page.extend({
    id: 'comment',

    warehouse_id: morel.record.inputs.KEYS.COMMENT,

    template: app.templates.comment,

    events: {
      'click #comment-save': 'save'
    },

    initialize: function () {
      _log('views.CommentPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.CommentPage: render', log.DEBUG);

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
        this.clearInput();
      }
    },

    appendEventListeners: function () {
      this.listenTo(this.model, 'change:' + this.warehouse_id, this.update);

      this.appendBackButtonListeners();
    },

    /**
     * Saves the comment to record.
     */
    save: function () {
      var value = this.readInput();
      if (value !== "") {
        this.model.set(this.warehouse_id, value);
      }
      window.history.back();
    },

    /**
     * Reads the user input.
     */
    readInput: function () {
      var input = this.getInput();

      return  $(input).val();
    },

    /**
     * Clears user input.
     */
    clearInput: function () {
      var input = this.getInput();
      $(input).val('');
    },

    /**
     * Gets the input element.
     * @returns {HTMLElement}
     */
    getInput: function () {
      var input = document.getElementById(this.warehouse_id);

      return input;
    }

  });

  return CommentPage;
});
