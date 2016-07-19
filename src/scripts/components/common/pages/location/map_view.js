/** ****************************************************************************
 * Location main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import L from 'leaflet';
import LatLon from '../../../../../vendor/latlon/js/latlon-ellipsoidal';
import OSLeaflet from '../../../../../vendor/os-leaflet/js/OSOpenSpace';
import OsGridRef from '../../../../../vendor/latlon/js/osgridref';
import JST from '../../../../JST';
import LocHelp from '../../../../helpers/location';
import CONFIG from 'config'; // Replaced with alias

const DEFAULT_LAYER = 'OS';
const DEFAULT_CENTER = [53.7326306, -2.6546124];
const MAX_OS_ZOOM = L.OSOpenSpace.RESOLUTIONS.length - 1;
const OS_ZOOM_DIFF = 6;
const OS_CRS = L.OSOpenSpace.getCRS(); // OS maps use different projection

const GRID_STEP = 100000; // meters

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
    this.currentLayer = null;
    this.markerAdded = false;
  },

  onShow() {
    // set full remaining height
    const mapHeight = $(document).height() - 47 - 38.5;
    const $container = this.$el.find('#map')[0];
    $($container).height(mapHeight);

    this.initMap($container);
  },

  initMap($container) {
    this.map = L.map($container);

    // default layer
    this.currentLayer = this._getCurrentLayer();
    if (this.currentLayer === 'OS') this.map.options.crs = OS_CRS;

    // position view
    this.map.setView(this._getCenter(), this._getZoomLevel());

    // show default layer
    this.layers[this.currentLayer].addTo(this.map);

    this.map.on('baselayerchange', this._updateCoordSystem, this);
    this.map.on('zoomend', this.onMapZoom, this);

    // Controls
    this.addControls();

    // Marker
    this.addMapMarker();

    // Graticule
    //this._initGraticule();
  },

  _getLayers() {
    const layers = {};
    layers.Satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: CONFIG.map.mapbox_satellite_id,
      accessToken: CONFIG.map.mapbox_api_key,
      tileSize: 256, // specify as, OS layer overwites this with 200 otherwise,
      minZoom: 5,
    });

    layers.OSM = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: CONFIG.map.mapbox_osm_id,
      accessToken: CONFIG.map.mapbox_api_key,
      tileSize: 256, // specify as, OS layer overwites this with 200 otherwise
      minZoom: 5,
    });

    let start = OsGridRef.osGridToLatLon(OsGridRef(0, 0));
    let end = OsGridRef.osGridToLatLon(OsGridRef(7 * GRID_STEP, 13 * GRID_STEP));
    let bounds = L.latLngBounds([start.lat, start.lon], [end.lat, end.lon]);

    layers.OS = L.tileLayer.OSOpenSpace(CONFIG.map.os_api_key);

    layers.OS.options.bounds = bounds;

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

  _getCurrentLayer() {
    let layer = DEFAULT_LAYER;
    const zoom = this._getZoomLevel();
    const currentLocation = this._getCurrentLocation();
    const inUK = LocHelp.isInUK(currentLocation);
    if (zoom > MAX_OS_ZOOM - 1) {
      layer = 'Satellite';
    } else if (inUK === false) {
      this.currentLayerControlSelected = true;
      layer = 'Satellite';
    }

    return layer;
  },

  _getCenter() {
    const currentLocation = this._getCurrentLocation();
    let center = DEFAULT_CENTER;
    if (currentLocation.latitude && currentLocation.longitude) {
      center = [currentLocation.latitude, currentLocation.longitude];
    }
    return center;
  },

  addControls() {
    this.controls = L.control.layers({
      OS: this.layers.OS,
      OSM: this.layers.OSM,
      Satellite: this.layers.Satellite,
    }, {});
    this.map.addControl(this.controls);
  },

  _initGraticule() {
    const that = this;
    const polylineOptions = {
      color: '#08b7e8',
      weight: 0.5,
      opacity: 1
    };

    const zoom = this.map.getZoom();
    const bounds = this.map.getBounds();
    const polylinePoints = this._calcGraticule(zoom, bounds);
    this.graticule =  new L.Polyline(polylinePoints, polylineOptions);

    this.map.on('move zoom', () => this._reCalcGraticule());

    this.map.addLayer(this.graticule);
  },

  _reCalcGraticule() {
    console.log('recalc')
    const zoom = this.map.getZoom();
    const bounds = this.map.getBounds();
    const polylinePoints = this._calcGraticule(zoom, bounds);
    this.graticule.setLatLngs(polylinePoints);
  },

  _calcGraticule(zoom, bounds) {
    // calculate granularity
    let granularity = 1;
    if (zoom < 8) {
      granularity = 1;
    } else if (zoom < 11) {
      granularity = 10;
    } else if (zoom < 13) {
      granularity = 100;
    }

    const step = GRID_STEP / granularity;

    // calculate grid start
    let p = new LatLon(bounds.getSouth(), bounds.getWest(), LatLon.datum.WGS84);
    let grid = OsGridRef.latLonToOsGrid(p);
    let west = grid.easting;
    west -= west % step; // drop modulus
    west -= step; // add boundry
    let south = grid.northing;
    south -= south % step; // drop modulus
    south -= step; // add boundry

    p = new LatLon(bounds.getNorth(), bounds.getEast(), LatLon.datum.WGS84);
    grid = OsGridRef.latLonToOsGrid(p);
    let east = grid.easting;
    east -= east % step; // drop modulus
    east -= step; // add boundry
    let north = grid.northing;
    north -= north % step; // drop modulus
    north -= step; // add boundry

    // drop excess

    // calculate grid steps
    let sideSteps = (east - west) / step;
    let lengthSteps = (north - south) / step;

    sideSteps *= granularity;
    lengthSteps *= granularity;

    var polylinePoints = [];


    let lengthDirection = 1;
    for (let side = 0;
         side < (sideSteps + (granularity > 1 && lengthDirection > 0 ? -1 : 1));
         side++) {
      let length = 0
      if (lengthDirection < 0) length = lengthSteps;

      let move = true;
      while (move) {
        const eastNorth = OsGridRef(side * step, length * step);
        let point = OsGridRef.osGridToLatLon(eastNorth);
        polylinePoints.push(new L.LatLng(point.lat, point.lon));

        if (lengthDirection < 0) {
          move = length > 0;
        } else {
          move = length < lengthSteps;
        }
        length += lengthDirection;
      }
      lengthDirection = -1 * lengthDirection;
    }

    //lengthDirection = -1;
    //for (let length = 0; length < (13 * granularity  + 1); length++) {
    //  let side = 7* granularity;
    //  if (lengthDirection > 0) side = 0;
    //
    //  let move = true;
    //  while (move) {
    //    const eastNorth = OsGridRef(side * step, length * step);
    //    let point = OsGridRef.osGridToLatLon(eastNorth);
    //    polylinePoints.push(new L.LatLng(point.lat, point.lon));
    //
    //    if (lengthDirection < 0) {
    //      move = side > 0;
    //    } else {
    //      move = side < 7 * granularity;
    //    }
    //    side += lengthDirection;
    //  }
    //  lengthDirection = -1 * lengthDirection;
    //}

    return polylinePoints;
  },

  /**
   * 1 gridref digits. (10000m)  -> < 3 map zoom lvl
   * 2 gridref digits. (1000m)   -> 5
   * 3 gridref digits. (100m)    -> 7
   * 4 gridref digits. (10m)     -> 9
   * 5 gridref digits. (1m)      ->
   */
  _getZoomLevel() {
    const currentLocation = this._getCurrentLocation();
    let mapZoomLevel = 1;
    // check if record has location
    if (currentLocation.latitude && currentLocation.longitude) {
      // transform location accuracy to map zoom level
      switch (currentLocation.source) {
        case 'map':
          mapZoomLevel = currentLocation.accuracy + 1 || 1;

          // transition to OSM/Satellite levels if needed
          if (mapZoomLevel === MAX_OS_ZOOM) {
            mapZoomLevel += OS_ZOOM_DIFF;
          }

          // max safety
          mapZoomLevel = mapZoomLevel > 18 ? 18 : mapZoomLevel;

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
    }
    return mapZoomLevel;
  },

  _updateCoordSystem(e) {
    this.currentLayerControlSelected = this.controls._handlingClick;

    const center = this.map.getCenter();
    let zoom = this.map.getZoom();
    this.map.options.crs = e.name === 'OS' ? OS_CRS : L.CRS.EPSG3857;
    if (e.name === 'OS') {
      zoom -= OS_ZOOM_DIFF;
      if (zoom > MAX_OS_ZOOM - 1) {
        zoom = MAX_OS_ZOOM - 1;
      }
    } else if (this.currentLayer === 'OS') {
      zoom += OS_ZOOM_DIFF;
    }
    this.currentLayer = e.name;
    this.map.setView(center, zoom, { reset: true });
  },

  onMapZoom() {
    const zoom = this.map.getZoom();
    const inUK = LocHelp.isInUK(this._getCurrentLocation());

    // -2 and not -1 because we ignore the last OS zoom level
    if (zoom > MAX_OS_ZOOM - 1 && this.currentLayer === 'OS') {
      this.map.removeLayer(this.layers.OS);
      this.map.addLayer(this.layers.Satellite);
    } else if ((zoom - OS_ZOOM_DIFF) <= MAX_OS_ZOOM - 1 && this.currentLayer === 'Satellite') {
      // only change base layer if user is on OS and did not specificly
      // select OSM/Satellite
      if (!this.currentLayerControlSelected && inUK !== false) {
        this.map.removeLayer(this.layers.Satellite);
        this.map.addLayer(this.layers.OS);
      }
    }

    this.currentGraticule;

  },

  updateMarker(location) {
    if (!this.markerAdded) {
      this.marker.setLocation(location);

      this.marker.addTo(this.map);
      this.markerAdded = true;
    } else {
      this.marker.setLocation(location);
      //
      //// check if not clicked out of UK
      //const inUK = LocHelp.isInUK(location);
      //if (inUK === false && this.marker instanceof L.Rectangle) {
      //  this.addMapMarker();
      //} else if (this.marker instanceof L.Circle) {
      //  this.addMapMarker();
      //}
    }
  },

  addMapMarker() {
    const that = this;
    const location = this._getCurrentLocation();
    const inUK = LocHelp.isInUK(location);

    let markerCoords = [];
    if (location.latitude && location.longitude) {
      markerCoords = [location.latitude, location.longitude];
    }

    // remove previous marker
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    var latLng = L.latLng(markerCoords);
    //if (inUK === false) {
      // point circle
      this.marker = L.circleMarker(latLng || [], {
        color: "red",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
      });
      this.marker.setLocation = function (location) {
        let markerCoords = [];
        if (location.latitude && location.longitude) {
          markerCoords = [location.latitude, location.longitude];
        }
        var latLng = L.latLng(markerCoords);
        return this.setLatLng(latLng);
      }
    //} else {
    //  // GR square
    //  const bounds = this._getSquareBounds(latLng, location) || [[0,0],[0,0]];
    //
    //  // create an orange rectangle
    //  this.marker = L.rectangle(bounds, {
    //    color: "red",
    //    weight: 1,
    //    opacity: 1,
    //    fillOpacity: 0.7,
    //  });
    //
    //  this.marker.setLocation = function (location) {
    //    // normalize GR square center
    //    const grid = LocHelp.coord2grid(location);
    //    const normalizedLocation = LocHelp.grid2coord(grid);
    //
    //    // get bounds
    //    let markerCoords = [];
    //    if (normalizedLocation.lat && normalizedLocation.lon) {
    //      markerCoords = [normalizedLocation.lat, normalizedLocation.lon];
    //    }
    //    const latLng = L.latLng(markerCoords);
    //    const bounds = that._getSquareBounds(latLng, location);
    //
    //    // update location
    //    that.marker.setBounds(bounds);
    //  };
    //}

    if (markerCoords.length) {
      this.marker.addTo(this.map);
      this.markerAdded = true;
    }

    this.map.on('click', this.onMapClick, this);
  },

  onMapClick(e) {
    let zoom = this.map.getZoom();

    const location = {
      latitude: parseFloat(e.latlng.lat.toFixed(7)),
      longitude: parseFloat(e.latlng.lng.toFixed(7)),
      source: 'map',
      accuracy: zoom,
    };

    // out of UK adjust the zoom because the next displayed map should be not OS
    if (this.currentLayer === 'OS' && !LocHelp.isInUK(location)) {
      location.accuracy += 6;
    }

    location.gridref = LocHelp.coord2grid(location);

    // trigger won't work to bubble up
    this.triggerMethod('location:select:map', location);
    this.updateMarker(location);
  },

  _getSquareBounds(latLng, location) {
    if (!latLng) return null;

    const metresPerPixel = 40075016.686 *
      Math.abs(Math.cos(this.map.getCenter().lat * 180/Math.PI)) /
      Math.pow(2, this.map.getZoom()+8);

    let locationGranularity = LocHelp._getGRgranularity(location) / 2;

    var currentPoint = this.map.latLngToContainerPoint(latLng);
    const widthInMeters = (locationGranularity / 2) * 10;
    //var width = metresPerPixel / widthInMeters;
    var width = window.w || 500 / Math.pow(10, locationGranularity);
    var height = window.w || width;
    var xDifference = width / 2;
    var yDifference = height / 2;
    var southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
    var northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
    var bounds = L.latLngBounds(
      this.map.containerPointToLatLng(southWest),
      this.map.containerPointToLatLng(northEast)
    );
    return bounds;
  },

  _getCurrentLocation() {
    return this.model.get('recordModel').get('location') || {};
  },

  serializeData() {
    const location = this._getCurrentLocation();

    return {
      name: location.name,
    };
  },
});
