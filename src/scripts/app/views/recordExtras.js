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
      this.render();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      app.views.recordPage.saveInput('sample:date')
    }
  });

  app.views.NumberPage = app.views.Page.extend({
    id: 'number',

    template: app.templates.number,

    events: {
      'click #number-save': 'save'
    },

    initialize: function () {
      this.render();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      app.views.recordPage.saveInput('sample:number')
    }
  });

  app.views.StagePage = app.views.Page.extend({
    id: 'stage',

    template: app.templates.stage,

    events: {
      'click #stage-save': 'save'
    },

    initialize: function () {
      this.render();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      app.views.recordPage.saveInput('sample:stage')
    }
  });

  app.views.LocationdetailsPage = app.views.Page.extend({
    id: 'locationdetails',

    template: app.templates.locationdetails,

    events: {
      'click #locationdetails-save': 'save'
    },

    initialize: function () {
      this.render();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      app.views.recordPage.saveInput('sample:locationdetails')
    }
  });

  app.views.CommentPage = app.views.Page.extend({
    id: 'comment',

    template: app.templates.comment,

    events: {
      'click #comment-save': 'save'
    },

    initialize: function () {
      this.render();
    },

    render: function () {
      this.$el.html(this.template());

      $('body').append($(this.el));
      return this;
    },

    save: function () {
      app.views.recordPage.saveInput('sample:comment')
    }
  });
})();
