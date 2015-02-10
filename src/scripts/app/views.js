var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.Page = Backbone.View.extend({
    tagName: 'div',
    role: "page",

    initialize: function (id) {
      this.el.id = id;
      this.id = id;
      this.template = app.templates[id];
    },

    render: function () {
      $(this.el).html(this.template());
      return this;
    },

    attributes: function () {
      return {
        "data-role": this.role
      };
    }
  });

  app.views.ListPage = app.views.Page.extend({
    id: 'list',

    template: app.templates.list,

    events: {
      'click #list-controls-save-button': 'toggleListControls',
      'click #list-controls-button': 'toggleListControls',
      'click #fav-button': 'filterFavourites'
    },

    initialize: function () {
      //this.prob.loadData();
    },

    render: function () {
      this.$el.html(this.template());
      this.$list = this.$el.find('#list-placeholder');

      var list = new app.views.List({collection: app.collections.species});

      this.$list.html(list.render().el);
      return this;
    },

    filterFavourites: function () {

    },

    filter: function () {

    },

    sort: function () {

    },
    /**
     * Shows/closes list controlls.
     */
    toggleListControls: function () {
      var controls = $('#list-controls-placeholder');
      if (controls.is(":hidden")) {
        controls.slideDown("slow");
      } else {
        controls.slideUp("slow");
      }
    }

  });

  app.views.List = Backbone.View.extend({
    tagName: 'ul',

    attributes: {
      'data-role': 'listview'
    },

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      this.collection.each(function (specie) {
        var listSpeciesView = new app.views.ListSpecies({model: specie.attributes});
        this.$el.append(listSpeciesView.render().el);
      }, this);

      return this;
    }
  });

  app.views.ListSpecies = Backbone.View.extend({
    tagName: "li",

    attributes: {
      "data-corners": false,
      "data-shadow": false,
      "data-iconshadow": true,
      "data-wrapperels": "div",
      "data-icon": "arrow-r",
      "data-iconpos": "right",
      "data-theme": "c"
    },

    template: app.templates.species_list_item,

    render: function () {
      this.$el.html(this.template(this.model));
      return this;
    }

  });
})();