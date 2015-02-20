var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.DatePage = app.views.Page.extend({
    id: 'date',

    warehouse_id: morel.record.inputs.KEYS.DATE,

    template: app.templates.date,

    events: {
      'click #date-save': 'save'
    },

    initialize: function () {
      _log('views.DatePage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

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

  app.views.NumberPage = app.views.Page.extend({
    id: 'number',

    warehouse_id: morel.record.inputs.KEYS.NUMBER,

    template: app.templates.number,

    events: {
      'change input[type=radio]': 'save'
    },

    initialize: function () {
      _log('views.NumberPage: initialize', app.LOG_DEBUG);

      this.listenTo(this.model,
        'change:'+ this.warehouse_id, this.update);

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

    save: function (e) {
      var name = this.warehouse_id;
      var value = e.currentTarget.value;
      if (value !== "") {
        this.model.set(name, value);
      }
      window.history.back();
      return false;
    }
  });

  app.views.StagePage = app.views.Page.extend({
    id: 'stage',

    warehouse_id: morel.record.inputs.KEYS.STAGE,

    template: app.templates.stage,

    events: {
      'change input[type=radio]': 'save'
    },

    initialize: function () {
      _log('views.StagePage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      this.listenTo(this.model,
        'change:'+ this.warehouse_id, this.update);

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

    save: function (e) {
      var name = this.warehouse_id;
      var value = e.currentTarget.value;
      if (value !== "") {
        this.model.set(name, value);
      }
      window.history.back();
    }
  });

  app.views.LocationdetailsPage = app.views.Page.extend({
    id: 'locationdetails',
    warehouse_id: morel.record.inputs.KEYS.LOCATIONDETAILS,

    template: app.templates.locationdetails,

    events: {
      'change input[type=radio]': 'save'
    },

    initialize: function () {
      _log('views.LocationdetailsPage: initialize', app.LOG_DEBUG);

      this.listenTo(this.model,
        'change:'+ this.warehouse_id, this.update);

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

    save: function (e) {
      var name = this.warehouse_id;
      var value = e.currentTarget.value;
      if (value !== "") {
        this.model.set(name, value);
      }
      window.history.back();
    }
  });

  app.views.CommentPage = app.views.Page.extend({
    id: 'comment',

    template: app.templates.comment,

    events: {
      'click #comment-save': 'save'
    },

    initialize: function () {
      _log('views.CommentPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.CommentPage: render', app.LOG_DEBUG);

      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      var name = morel.record.inputs.KEYS.COMMENT;
      var ele = document.getElementById(name);
      var value = $(ele).val();
      if (value !== "") {
        this.model.set(name, value);
      }
      window.history.back();
    }
  });
})();
