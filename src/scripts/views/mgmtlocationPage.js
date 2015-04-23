/******************************************************************************
 * Management Locations page view.
 *****************************************************************************/
define([
  'views/_page',
  'topojson',
  'templates',
], function (Page, topojson) {
  'use strict';

  var MgmtlocationPage = Page.extend({
    id: 'mgtmlocation',

    template: app.templates.mgmtlocation,

    MAX: 60,
    COLOR: 'red',

    initialize: function () {
      _log('views.MgtmlocationPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.MgtmlocationPage: render', app.LOG_DEBUG);

      this.$el.html(this.template());

      $('body').append($(this.el));

      if (typeof google === 'undefined') {
        /*
         If the browser is offline then we should not proceed and so the
         dummyText controls the caching of the file - always get fresh
         */
        var dummyText = '&' + (new Date()).getTime();
        this.loadScript('http://maps.googleapis.com/maps/api/js?sensor=false&' +
          'callback=app.views.mgmtlocationPage.initializeMap' + dummyText
        );
        //todo: on error call drawHeatMap
      } else {
        this.initializeMap();
      }
      return this;
    },

    initializeMap: function () {
      if (navigator.onLine) {
        this.drawGoogleHeatMap();
      } else {
        this.drawHeatMap();
      }
    },

    drawHeatMap: function () {
      var width = 378,
        height = 504;
      $('#heat-map').html(app.templates.mgmtlocation_heatmap());

      var svg = d3.select('#heat-map svg').append('svg')
        .attr('x', 2)
        .attr('y', -15)
        .attr('width', width)
        .attr('height', height);

      d3.json('scripts/data_heatmap.json', function (error, data) {
        if (error) return console.error(error);

        var geoJSON = topojson.feature(data, data.objects.geo);

        var projection = d3.geo.albers()
          .center([0, 55.4])
          .rotate([2.3, 0])
          .parallels([50, 60])
          .scale(2450)
          .translate([width / 2, height / 2]);

        var path = d3.geo.path()
          .projection(projection);

        svg.selectAll("square")
          .data(geoJSON.features)
          .enter().append("path")
          .attr("fill", app.views.mgmtlocationPage.COLOR)
          .style('opacity', function (d) {
            var heat = d.properties.Cut_50;
            var opacity = heat / app.views.mgmtlocationPage.MAX;
            return opacity;
          })
          .attr("d", path);
      });
    },

    drawGoogleHeatMap: function () {
      var map = new google.maps.Map($('#heat-map')[0], app.CONF.MAP);
      map.setCenter(new google.maps.LatLng(55.4, -4));

      $.getJSON("scripts/data_heatmap.json", function (data) {
        var geoJSON = topojson.feature(data, data.objects.geo);
        map.data.addGeoJson(geoJSON);
        map.data.setStyle(function (feature) {
          var heat = feature.getProperty('Cut_50');
          var opacity = heat / app.views.mgmtlocationPage.MAX;
          return {
            fillColor: app.views.mgmtlocationPage.COLOR,
            fillOpacity: opacity,
            strokeWeight: 0.11,
            strokeColor: 'grey'
          };
        });
        map.setCenter(new google.maps.LatLng(55.4, -4));
        //fix one tile problem
        setTimeout(function () {
          google.maps.event.trigger(map, 'resize');
        }, 100);
      });
    },

    /**
     * Loads the google maps script.
     *
     * @param src
     */
    loadScript: function (src) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      document.body.appendChild(script);
    },
  });
  return MgmtlocationPage;
});