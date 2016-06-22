/** ****************************************************************************
 * Location main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import L from '../../../../../vendor/leaflet/js/leaflet';
import OSLeaflet from '../../../../../vendor/os-leaflet/js/OSOpenSpace';
import JST from '../../../../JST';
import LocHelp from '../../../../helpers/location';
import Device from '../../../../helpers/device';
import CONFIG from 'config'; // Replaced with alias

export default Marionette.ItemView.extend({
  template: JST['common/location/map'],

  events: {
    'change #location-name': 'changeName',
  },

  changeName(e) {
    this.triggerMethod('location:name:change', $(e.target).val());
  },

  onShow() {
    const that = this;

    const currentLocation = this.model.get('recordModel').get('location') || {};
    let mapZoomCoords = [53.7326306, -2.6546124];
    //
    ///**
    // * 1 gridref digits. (10000m)  -> < 3 map zoom lvl
    // * 2 gridref digits. (1000m)   -> 5
    // * 3 gridref digits. (100m)    -> 7
    // * 4 gridref digits. (10m)     -> 9
    // * 5 gridref digits. (1m)      ->
    // */
    let mapZoomLevel = 1;

    let markerCoords = [];

    // check if record has location
    if (currentLocation.latitude && currentLocation.longitude) {
      mapZoomCoords = [currentLocation.latitude, currentLocation.longitude];

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
          // todo area
          mapZoomLevel = currentLocation.accuracy + 1;
          //
          // // define rectangle geographical bounds
          // var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
          //
          // // create an orange rectangle
          // L.rectangle(bounds, {color: "#ff7800", weight: 1})
          break;
        default:
          mapZoomLevel = L.OSOpenSpace.RESOLUTIONS.length - 3;
      }

      if (mapZoomLevel > 10) {
        mapZoomLevel = 10;
      }
      markerCoords = mapZoomCoords;
    }


    const mapHeight = $(document).height() - 47 - (44 + 38.5);
    const container = this.$el.find('#map')[0];
    $(container).height(mapHeight);

    const OS_CRS = L.OSOpenSpace.getCRS(); // OS maps use diff projection
    const map = L.map(container, {
      crs: OS_CRS,
    }).setView(mapZoomCoords, mapZoomLevel);

    // Layers
    const satelliteLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'cehapps.0femh3mh',
      accessToken: 'pk.eyJ1IjoiY2VoYXBwcyIsImEiOiJjaXBxdTZyOWYwMDZoaWVuYjI3Y3Z0a2x5In0.YXrZA_DgWCdjyE0vnTCrmw'
    });

    const osmLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'cehapps.0fenl1fe',
      accessToken: 'pk.eyJ1IjoiY2VoYXBwcyIsImEiOiJjaXBxdTZyOWYwMDZoaWVuYjI3Y3Z0a2x5In0.YXrZA_DgWCdjyE0vnTCrmw'
    });

    const openspaceLayer = L.tileLayer.OSOpenSpace(CONFIG.map.API_KEY);
    openspaceLayer.on('tileerror', (tile) => {

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

    // default layer
    openspaceLayer.addTo(map);

    // update coordinate system on layer change
    let currentLayer = 'OS';
    function updateCoordSystem(e) {
      console.log('updating crs');
      var center = map.getCenter();
      let zoom = map.getZoom();
      map.options.crs = e.name === 'OS' ? OS_CRS : L.CRS.EPSG3857;
      if (e.name === 'OS') {
        zoom -= 6;
        if (zoom > L.OSOpenSpace.RESOLUTIONS.length - 1) {
          zoom = L.OSOpenSpace.RESOLUTIONS.length - 1;
        }
      } else  if (currentLayer === 'OS') {
        zoom += 6;
      }
      map.setView(center, zoom, { reset: true });
      currentLayer = e.name;
    }
    map.on('baselayerchange', updateCoordSystem);

    map.on('zoomstart', (e) => {
      const zoom = map.getZoom();
      if (zoom > 4 && currentLayer === 'OS') {
        map.removeLayer(openspaceLayer);
        map.addLayer(satelliteLayer);
      }
    });

    // Controls
    let controls = new L.Control.Layers( {
      OS: openspaceLayer,
      OSM: osmLayer,
      Satellite: satelliteLayer
    }, {});

    map.addControl(controls);

    // Marker
    /* add some event callbacks */
    const myIcon = L.divIcon({ className: 'icon icon-plus map-marker' });
    const marker = L.marker(markerCoords, { icon: myIcon });

    let markerAdded = false;
    if (markerCoords.length) {
      marker.addTo(map);
      // area.addTo(map);
      markerAdded = true;
    }

    function onMapClick(e) {
      marker.setLatLng(e.latlng);
      if (!markerAdded) {
        marker.addTo(map);
        markerAdded = true;
      }

      let zoom = map.getZoom();
      if (currentLayer !== 'OS') {
        zoom -= 6;

        if (zoom > L.OSOpenSpace.RESOLUTIONS.length - 1) {
          zoom = L.OSOpenSpace.RESOLUTIONS.length - 1;
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
      that.triggerMethod('location:select:map', location);
    }

    map.on('click', onMapClick);
  },

  serializeData() {
    const location = this.model.get('recordModel').get('location') || {};

    return {
      name: location.name,
    };
  },
});
