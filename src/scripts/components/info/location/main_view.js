/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import L from '../../../../vendor/leaflet/js/leaflet';
import OSLeaflet from '../../../../vendor/os-leaflet/js/OSOpenSpace';
import d3 from '../../../../vendor/d3/js/d3';
import JST from '../../../JST';
import Device from '../../../helpers/device';
import CONFIG from 'config';
import heatmapData from 'data/data_heatmap.json';

const options = {
  MAX: 60,
  COLOR: 'red',
};

export default Marionette.ItemView.extend({
  id: 'heat-map-container',
  template: JST['info/location/main'],

  onShow() {
    const that = this;
    const $heatMap = this.$el.find('#heat-map');
    setTimeout(() => {
      that.drawHeatMap($heatMap);
    }, 1); // new non blocking thread
  },

  drawHeatMap($heatMap) {
    const mapZoomCoords = [53.7326306, -3.6546124];
    const mapZoomLevel = 0;

    const h = 400;
    const w = $heatMap.width();

    const container = $heatMap[0];
    $(container).height(h);

    let openspaceLayer;

    /* L.Map with OS options */
    const map = new L.Map(container, {
      crs: L.OSOpenSpace.getCRS(),
      continuousWorld: false,
      worldCopyJump: false,
      minZoom: 0,
      maxZoom: L.OSOpenSpace.RESOLUTIONS.length - 1,
    });

    map.setView(mapZoomCoords, mapZoomLevel);

    /* add some ui elems to the map */
    L.control.scale().addTo(map);

    if (Device.isOnline()) {
      /* New L.TileLayer.OSOpenSpace with API Key */
      const API_KEY = CONFIG.map.API_KEY;
      openspaceLayer = L.tileLayer.OSOpenSpace(API_KEY);

      map.addLayer(openspaceLayer);
    } else {
      let imageUrl = 'images/country_coastline.svg';
      const imageBounds = [[61.0, -11.715793], [49.022656, 2.391891]];
      let imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.keyboard.disable();
    }

    let svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    function projectPoint(x, y) {
      let point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    let transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

    let feature = g.selectAll("path")
      .data(heatmapData.features)
      .enter().append("path")
      .style("fill", 'red')
      .style("fill-opacity", (feature) => {
        const heat = feature.properties.h;
        const opacity = (heat / options.MAX).toFixed(3);
        return opacity;
      });

    map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
      let bounds = path.bounds(heatmapData),
          topLeft = bounds[0],
          bottomRight = bounds[1];

      svg.attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

      feature.attr("d", path);
    }
  },
});
