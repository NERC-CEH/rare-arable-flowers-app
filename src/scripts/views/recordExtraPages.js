var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.DatePage = app.views.Page.extend({
    id: 'date',

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
      var ele = document.getElementById('sample:date');
      var value = $(ele).val();
      if (value !== "") {
        app.models.record.saveDate(value);
      }
      window.history.back();
    }
  });

  app.views.NumberPage = app.views.Page.extend({
    id: 'number',

    template: app.templates.number,

    events: {
      'click #number-save': 'save'
    },

    initialize: function () {
      _log('views.NumberPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      var inputID = 'sample:number';
      var ele = document.getElementById(inputID);
      var value = $(ele).val();
      if (value !== "") {
        app.models.record.saveInput(inputID, value);
      }
      window.history.back();
    }
  });

  app.views.StagePage = app.views.Page.extend({
    id: 'stage',

    template: app.templates.stage,

    events: {
      'click #stage-save': 'save'
    },

    initialize: function () {
      _log('views.StagePage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      var inputID = 'sample:stage';
      var ele = document.getElementById(inputID);
      var value = $(ele).val();
      if (value !== "") {
        app.models.record.saveInput(inputID, value);
      }
      window.history.back();
    }
  });

  app.views.LocationdetailsPage = app.views.Page.extend({
    id: 'locationdetails',

    template: app.templates.locationdetails,

    events: {
      'click #locationdetails-save': 'save'
    },

    initialize: function () {
      _log('views.LocationdetailsPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      var inputID = 'sample:locationdetails';
      var ele = document.getElementById(inputID);
      var value = $(ele).val();
      if (value !== "") {
        app.models.record.saveInput(inputID, value);
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
      var inputID = 'sample:comment';
      var ele = document.getElementById(inputID);
      var value = $(ele).val();
      if (value !== "") {
        app.models.record.saveInput(inputID, value);
      }
      window.history.back();
    }
  });
})();
