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
      let imageOverlay;
      let imageBounds = [[62.85, -12.6657929], [48.1726559, 3.94189]];

      const coastlineURL = 'images/country_coastline.svg';
      const postcodesURL = 'images/country_postcodes.svg';
      imageBounds = imageBounds;
      imageOverlay = L.imageOverlay(coastlineURL, imageBounds).addTo(map);
      L.imageOverlay(postcodesURL, imageBounds).addTo(map);

      //
      //map.on('click', (e) => {
      //  if (e.latlng.lat > 53) {
      //    imageBounds[0][0] += 0.05;
      //    if (!window.scale) imageBounds[1][0] += 0.05;
      //  } else {
      //    imageBounds[0][0] -= 0.05;
      //    if (!window.scale) imageBounds[1][0] -= 0.05;
      //  }
      //
      //  if (e.latlng.lng > 0) {
      //    imageBounds[0][1] += 0.05;
      //    if (!window.scale) imageBounds[1][1] += 0.05;
      //  } else {
      //    imageBounds[0][1] -= 0.05;
      //    if (!window.scale) imageBounds[1][1] -= 0.05;
      //  }
      //  console.log(e.latlng);
      //  console.log(JSON.stringify(imageBounds));
      //  window.a(imageBounds);
      //})
    }

    const svg = d3.select(map.getPanes().overlayPane).append('svg');
    const g = svg.append('g').attr('class', 'leaflet-zoom-hide');

    function projectPoint(x, y) {
      let point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    const transform = d3.geo.transform({ point: projectPoint });
    const path = d3.geo.path().projection(transform);

    function getOpacity(heat, full) {
      const opacity = (heat / (full ? 50 : options.MAX)).toFixed(3);
      return opacity;
    }

    const feature = g.selectAll('path')
      .data(heatmapData.features)
      .enter().append('path')
      .style('fill', 'red')
      .style('fill-opacity', (feature) => {
        const heat = feature.properties.h;
        return getOpacity(heat);
      });


    // Reposition the SVG to cover the features.
    function reset() {
      const bounds = path.bounds(heatmapData);
      const topLeft = bounds[0];
      const bottomRight = bounds[1];

      svg.attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', `${topLeft[0]}px`)
        .style('top', `${topLeft[1]}px`);

      g.attr('transform', `translate(${-topLeft[0]},${-topLeft[1]})`);

      feature.attr('d', path);
    }

    map.on('viewreset', reset);
    reset();


    // Add legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [1, 10, 20, 30, 40, 50],
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += `<i style="background: rgba(255, 0, 0, ${getOpacity(grades[i] + 1, true)})"></i>` +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };

    legend.addTo(map);
  },
});
