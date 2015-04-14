/******************************************************************************
 * RequireJS configuration and app object construction.
 *****************************************************************************/
(function () {
  require.config({
    baseUrl: "scripts/",
    paths: {
      'jquery': 'libs/jquery',
      'jquery.mobile': 'libs/jquery.mobile-1.4.5',
      'IndexedDBShim': 'libs/IndexedDBShim',
      'latlon': 'libs/osgridref',
      'latlon-ellipsoidal': 'libs/latlon-ellipsoidal',
      'vector3d': 'libs/vector3d',
      'dms': 'libs/dms',
      'klass': 'libs/klass.min',
      'photoswipe': 'libs/code.photoswipe.jquery-3.0.5.min',
      'fastclick': 'libs/fastclick',
      'd3': 'libs/d3',
      'topojson': 'libs/topojson',
      'morel': 'libs/morel',
      'underscore': 'libs/lodash',
      'backbone': 'libs/backbone',
      'backbone.localStorage': 'libs/backbone.localStorage',
      'ga': '//www.google-analytics.com/analytics'
    },
    shim: {
      'latlon': {deps: ['latlon-ellipsoidal', 'vector3d', 'dms']},
      'jquery.mobile': {deps: ['jquery.mobile-config']},
      'backbone': {deps: ['jquery', 'underscore'], "exports": "Backbone"},
      'morel': {deps: ['IndexedDBShim']},
      'photoswipe': {deps: ['jquery', 'klass'], exports : 'Code.PhotoSwipe'},
      'topojson': {deps: ['d3']},
      'ga': {exports: "__ga__"}
    },
    waitSeconds: 20
  });

  //Load the mighty app :)
  require(['jquery.mobile-config', 'app'], function (jqm, App) {
    //jquery mobile - backbone configuration should be set up by this point.
    App.init();
  });

})();