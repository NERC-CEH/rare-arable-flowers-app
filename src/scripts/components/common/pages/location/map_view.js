/** ****************************************************************************
 * Location main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import L from 'leaflet';
import OSLeaflet from '../../../../../vendor/os-leaflet/js/OSOpenSpace';
import JST from '../../../../JST';
import LocHelp from '../../../../helpers/location';
import CONFIG from 'config'; // Replaced with alias

const DEFAULT_LAYER = 'OS';
const DEFAULT_ZOOM = [53.7326306, -2.6546124];
const MAX_OS_ZOOM = L.OSOpenSpace.RESOLUTIONS.length - 1;
const OS_CRS = L.OSOpenSpace.getCRS(); // OS maps use different projection

export default Marionette.ItemView.extend({
  template: JST['common/location/map'],

  events: {
    'change #location-name': 'changeName',
  },

  changeName(e) {
    this.triggerMethod('location:name:change', $(e.target).val());
  },

  initialize() {
    this.map = null;
    this.layers = this._getLayers();

    this.currentLayerControlSelected = false;
    this.currentLayer = DEFAULT_LAYER;
    this.markerAdded = false;
  },

  onShow() {
    // set full remaining height
    const mapHeight = $(document).height() - 47 - (44 + 38.5);
    const container = this.$el.find('#map')[0];
    $(container).height(mapHeight);

    this.initMap(container);
    // todo: append name input
  },

  initMap(container) {
    // Map
    this.map = L.map(container).setView(DEFAULT_ZOOM, this._getZoomLevel());

    // default layer
    if (this.currentLayer === 'OS') this.map.options.crs = OS_CRS;
    this.layers[this.currentLayer].addTo(this.map);

    this.map.on('baselayerchange', this._updateCoordSystem, this);
    this.map.on('zoomend', this.onMapZoom, this);

    // Controls
    this.addControls();

    // Marker
    this.addMapMarker();
  },

  _getLayers() {
    const layers = {};
    layers.Satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: CONFIG.map.mapbox_satellite_id,
      accessToken: CONFIG.map.mapbox_api_key,
      tileSize: 256, // specify as, OS layer overwites this with 200 otherwise
    });

    layers.OSM = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: CONFIG.map.mapbox_osm_id,
      accessToken: CONFIG.map.mapbox_api_key,
      tileSize: 256, // specify as, OS layer overwites this with 200 otherwise
    });

    layers.OS = L.tileLayer.OSOpenSpace(CONFIG.map.os_api_key);
    layers.OS.on('tileerror', tile => {
      let index = 0;
      const result = tile.tile.src.match(/missingTileString=(\d+)/i);
      if (result) {
        index = parseInt(result[1]);
        index++;

        // don't do it more than few times
        if (index < 4) {
          tile.tile.src = tile.tile.src.replace(/missingTileString=(\d+)/i, '&missingTileString=' + index);
        }
      } else {
        if (index === 0) {
          tile.tile.src = tile.tile.src + '&missingTileString=' + index;
        }
      }
    });
    return layers;
  },

  addControls() {
    const controls = L.control.layers({
      OS: this.layers.OS,
      OSM: this.layers.OSM,
      Satellite: this.layers.Satellite,
    }, {});
    this.map.addControl(controls);
  },

  /**
   * 1 gridref digits. (10000m)  -> < 3 map zoom lvl
   * 2 gridref digits. (1000m)   -> 5
   * 3 gridref digits. (100m)    -> 7
   * 4 gridref digits. (10m)     -> 9
   * 5 gridref digits. (1m)      ->
   */
  _getZoomLevel() {
    const currentLocation = this.model.get('recordModel').get('location') || {};
    let mapZoomLevel = 1;
    // check if record has location
    if (currentLocation.latitude && currentLocation.longitude) {
      // transform location accuracy to map zoom level
      switch (currentLocation.source) {
        case 'map':
          mapZoomLevel = currentLocation.accuracy + 1 || 1;
          // no need to show area as it would be smaller than the marker
          break;
        case 'gps':
          if (currentLocation.accuracy) {
            const digits = Math.log(currentLocation.accuracy) / Math.LN10;
            mapZoomLevel = digits ? 11 - digits * 2 : 10; // max zoom 10 (digits == 0)
            mapZoomLevel = Number((mapZoomLevel).toFixed(0)); // round the float
          } else {
            mapZoomLevel = 1;
          }
          break;
        case 'gridref':
          mapZoomLevel = currentLocation.accuracy + 1;
          break;
        default:
          mapZoomLevel = MAX_OS_ZOOM - 2;
      }

      if (mapZoomLevel > 7) {
        mapZoomLevel = 7;
      }
    }
    return mapZoomLevel;
  },

  _updateCoordSystem(e) {
    const center = this.map.getCenter();
    let zoom = this.map.getZoom();
    this.map.options.crs = e.name === 'OS' ? OS_CRS : L.CRS.EPSG3857;
    if (e.name === 'OS') {
      zoom -= 6;
      if (zoom > MAX_OS_ZOOM - 1) {
        zoom = MAX_OS_ZOOM - 1;
      }
    } else if (this.currentLayer === 'OS') {
      zoom += 6;
    }
    this.currentLayer = e.name;
    this.map.setView(center, zoom, { reset: true });
  },

  _getMarkerCoords() {
    const currentLocation = this.model.get('recordModel').get('location') || {};

    if (currentLocation.latitude && currentLocation.longitude) {
      return [currentLocation.latitude, currentLocation.longitude];
    }
    return null;
  },

  onMapZoom() {
    const zoom = this.map.getZoom();

    // -2 and not -1 because we ignore the last OS zoom level
    if (zoom > MAX_OS_ZOOM - 1 && this.currentLayer === 'OS') {
      this.map.removeLayer(this.layers.OS);
      this.map.addLayer(this.layers.Satellite);
    } else if ((zoom - 6) <= MAX_OS_ZOOM - 1 && this.currentLayer === 'Satellite') {
      // only change base layer if user is on OS and did not specificly
      // select OSM/Satellite
      if (!this.currentLayerControlSelected) {
        this.map.removeLayer(this.layers.Satellite);
        this.map.addLayer(this.layers.OS);
        this.currentLayerControlSelected = false;
      }
    }
  },

  addMapMarker() {
    const markerCoords = this._getMarkerCoords();

    /* add some event callbacks */
    const myIcon = L.divIcon({ className: 'icon icon-plus map-marker' });
    this.marker = L.marker(markerCoords, { icon: myIcon });

    if (markerCoords.length) {
      this.marker.addTo(this.map);
      // area.addTo(map);
      this.markerAdded = true;
    }

    this.map.on('click', this.onMapClick, this);

    // todo area
    //
    // // define rectangle geographical bounds
    // var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
    //
    // // create an orange rectangle
    // L.rectangle(bounds, {color: "#ff7800", weight: 1})
  },

  onMapClick(e) {
    this.marker.setLatLng(e.latlng);
    if (!this.markerAdded) {
      this.marker.addTo(this.map);
      this.markerAdded = true;
    }

    let zoom = this.map.getZoom();
    if (this.currentLayer !== 'OS') {
      zoom -= 6;

      if (zoom > MAX_OS_ZOOM) {
        zoom = MAX_OS_ZOOM;
      }
    }
    const location = {
      latitude: parseFloat(e.latlng.lat.toFixed(7)),
      longitude: parseFloat(e.latlng.lng.toFixed(7)),
      source: 'map',
      accuracy: zoom,
    };

    location.gridref = LocHelp.coord2grid(location, location.accuracy);

    // trigger won't work to bubble up
    this.triggerMethod('location:select:map', location);
  },

  serializeData() {
    const location = this.model.get('recordModel').get('location') || {};

    return {
      name: location.name,
    };
  },
});
