var app = app || {};
app.models = app.models || {};
app.collections = app.collections || {};

(function () {
  'use strict';

  var Specie = Backbone.Model.extend({
    default: {
      id: "",
      warehouse_id: 0,
      taxon: "",
      common_name: "",
      profile_pic: "images/sample.jpg",
      description: "",
      management: "",
      favourite: false
    }
  });

  app.collections.Species = Backbone.Collection.extend({
    model: Specie,
    filter: false,
    sort: 'name'
  });
})();