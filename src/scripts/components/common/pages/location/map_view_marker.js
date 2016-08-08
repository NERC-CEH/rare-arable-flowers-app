import LocHelp from '../../../../helpers/location';
import OsGridRef from 'OsGridRef';

const OS_ZOOM_DIFF = 6;

const marker = {
  updateMarker(location) {
    if (!this.markerAdded) {
      this.marker.setLocation(location);

      this.marker.addTo(this.map);
      this.markerAdded = true;
    } else {
      this.marker.setLocation(location);

      // check if not clicked out of UK
      const inUK = LocHelp.isInUK(location);
      if (inUK === false && this.marker instanceof L.Rectangle) {
        this.addMapMarker();
      } else if (this.marker instanceof L.Circle) {
        this.addMapMarker();
      }
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

    const latLng = L.latLng(markerCoords);
    if (inUK === false) {
      // point circle
      this.marker = L.circleMarker(latLng || [], {
        color: 'red',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
      });
      this.marker.setLocation = function (location) {
        let markerCoords = [];
        if (location.latitude && location.longitude) {
          markerCoords = [location.latitude, location.longitude];
        }
        const latLng = L.latLng(markerCoords);
        return this.setLatLng(latLng);
      };
    } else {
      // GR square
      const dimensions = this._getSquareDimensions(latLng, location) || [[0,0],[0,0]];

      // create an orange rectangle
      this.marker = L.polygon(dimensions, {
        color: "red",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
      });

      this.marker.setLocation = function (location) {
        // normalize GR square center
        const grid = LocHelp.coord2grid(location);
        const normalizedLocation = LocHelp.grid2coord(grid);

        // get bounds
        let markerCoords = [];
        if (normalizedLocation.lat && normalizedLocation.lon) {
          markerCoords = [normalizedLocation.lat, normalizedLocation.lon];
        }
        const latLng = L.latLng(markerCoords);
        const dimensions = that._getSquareDimensions(latLng, location);

        // update location
        that.marker.setLatLngs(dimensions);
      };
    }

    if (markerCoords.length) {
      this.marker.addTo(this.map);
      this.markerAdded = true;
    }

    this.map.on('click', this.onMapClick, this);
  },

  onMapClick(e) {
    let zoom = this.map.getZoom();

    if (this.currentLayer !== 'OS') zoom -= OS_ZOOM_DIFF;

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

  _getSquareDimensions(latLng, location) {
    if (!latLng) return null;

    // get granularity
    const locationGranularity = LocHelp._getGRgranularity(location) / 2;

    // calc radius
    const radius = 100000 / Math.pow(10, locationGranularity) / 2;

    // get center in eastings and northings
    const grid = LocHelp.parseGrid(location.gridref);

    // calculate corners
    const southWest = new OsGridRef(grid.easting - radius, grid.northing - radius);
    const southEast = new OsGridRef(grid.easting + radius, grid.northing - radius);
    const northEast = new OsGridRef(grid.easting + radius, grid.northing + radius);
    const northWest = new OsGridRef(grid.easting - radius, grid.northing + radius);

    const dimensions = [
      OsGridRef.osGridToLatLon(southWest),
      OsGridRef.osGridToLatLon(southEast),
      OsGridRef.osGridToLatLon(northEast),
      OsGridRef.osGridToLatLon(northWest),
    ];
    return dimensions;
  },

};

export default marker;
