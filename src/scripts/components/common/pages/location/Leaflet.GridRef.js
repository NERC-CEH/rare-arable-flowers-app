import L from 'leaflet';
import LatLon from '../../../../../vendor/latlon/js/latlon-ellipsoidal';
import OsGridRef from '../../../../../vendor/latlon/js/osgridref';

const GRID_STEP = 100000; // meters

L.Grid = L.LayerGroup.extend({
  options: {
    // Path style for the grid lines
    lineStyle: {
      color: '#08b7e8',
      weight: 0.5,
      opacity: 1,
    },
  },

  initialize: function (options) {
    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);
  },

  onAdd: function (map) {
    this.map = map;
    const zoom = this.map.getZoom();
    const bounds = this.map.getBounds();
    const polylinePoints = this._calcGraticule(zoom, bounds);
    this.graticule = new L.Polyline(polylinePoints, this.options.lineStyle);

    this.map.on('move zoom', () => this.redraw());

    this.map.addLayer(this.graticule);
  },

  onRemove: function (map) {
    // remove layer listeners and elements
    map.off('viewreset move', this.map);
    this.eachLayer(this.removeLayer, this);
  },

  redraw: function () {
    const zoom = this.map.getZoom();
    const bounds = this.map.getBounds();
    const polylinePoints = this._calcGraticule(zoom, bounds);
    this.graticule.setLatLngs(polylinePoints);
  },

  _calcGraticule(zoom, bounds) {
    let granularity = 1;
    if (zoom < 9) {
      granularity = 1;
    } else if (zoom < 12) {
      granularity = 10;
    } else if (zoom < 15) {
      granularity = 100;
    } else {
      granularity = 1000;
    }

    const step = GRID_STEP / granularity;

    // calculate grid start
    const { south, north, east, west } = this._getGraticuleBounds(bounds, step);

    // calculate grid steps
    const sideSteps = (east - west) / step;
    const lengthSteps = (north - south) / step;

    const polylinePoints = [];

    let direction = 1; // up
    let side = 0;

    while (side <= sideSteps) {
      let length = 0;
      if (direction < 0) length = lengthSteps;

      let move = true;
      while (move) {
        // add point
        const eastNorth = OsGridRef(west + side * step, south + length * step);
        // console.log('x ' + (west + side * step)  + ' y: ' + (south + length * step))

        const point = OsGridRef.osGridToLatLon(eastNorth);
        polylinePoints.push(new L.LatLng(point.lat, point.lon));

        // update direction
        if (direction < 0) {
          move = length > 0;
        } else {
          move = length < lengthSteps;
        }
        length += direction;
      }
      direction = -1 * direction;
      side++;
    }

    let length = direction < 0 ? lengthSteps : 0;

    let lengthwaysDirection = direction;
    // sideways direction - returning
    direction = -1;

    while(length <= lengthSteps && length >= 0) {
      let side = sideSteps;
      if (direction > 0) side = 0;

      let move = true;
      while (move) {
        // add point
        const eastNorth = OsGridRef(west + side * step, south + length * step);
        // console.log('x ' + (west + side * step)  + ' y: ' + (south + length * step))
        const point = OsGridRef.osGridToLatLon(eastNorth);
        polylinePoints.push(new L.LatLng(point.lat, point.lon));

        // update direction
        if (direction < 0) {
          move = side > 0;
        } else {
          move = side < sideSteps;
        }
        side += direction;
      }
      direction = -1 * direction;
      length += lengthwaysDirection;
    }

    return polylinePoints;
  },

  _getGraticuleBounds(bounds, step) {
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
    east += step; // add boundry
    let north = grid.northing;
    north -= north % step; // drop modulus
    north += step; // add boundry

    // drop excess
    west = west < 0 ? 0 : west; // do not exceed
    south = south < 0 ? 0 : south; // do not exceed
    north = north > 1300000 ? 1300000 : north; // do not exceed
    east = east > 700000 ? 700000 : east; // do not exceed

    return { west, south, north, east };
  },
});

export default L.Grid;
