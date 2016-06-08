/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import L from '../../../../vendor/leaflet/js/leaflet';
import OSLeaflet from '../../../../vendor/os-leaflet/js/OSOpenSpace';
import TopoJSON from '../../../../vendor/topojson/js/topojson';
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

    // add heatmap data
    const geoJSON = TopoJSON.feature(heatmapData, heatmapData.objects.geo);
    var dataLayer = L.geoJson(null, {
      style(feature) {
        const heat = feature.properties.Cut_50;
        const opacity = heat / options.MAX;
        return {
          fillColor: options.COLOR,
          fillOpacity: opacity,
          weight: 0.11,
          color: 'grey',
        };
      },
    }).addTo(map);
    dataLayer.addData(geoJSON);

    if (Device.isOnline()) {
      /* New L.TileLayer.OSOpenSpace with API Key */
      const API_KEY = CONFIG.map.API_KEY;
      openspaceLayer = L.tileLayer.OSOpenSpace(API_KEY);

      map.addLayer(openspaceLayer);
    } else {
      var imageUrl = 'images/country_coastline.svg';
      const imageBounds = [[61.0, -11.715793], [49.022656, 2.391891]];
      let imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.keyboard.disable();

      window.a = function (imageBounds) {
        map.removeLayer(imageOverlay);
        imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);
      }
    }
  },
});
