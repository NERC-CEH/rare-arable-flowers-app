/** ****************************************************************************
 * App Model past locations functions.
 *****************************************************************************/
import _ from 'lodash';
import UUID from '../../../helpers/UUID';
import LocHelp from '../../../helpers/location';

export default {
  /**
   * Saves device location.
   *
   * @param location
   */
  setLocation(origLocation = {}) {
    const location = _.cloneDeep(origLocation);
    const locations = this.get('locations');

    // check if exists
    if (this.locationExists(location)) {
      // don't duplicate same location
      return null;
    } else if (!location.latitude || !location.longitude) {
      // don't add if no lat/long
      return null;
    }

    // add
    location.id = UUID();
    locations.splice(0, 0, location);

    this.set('locations', locations);
    this.trigger('change:locations');
    this.save();
    return location.id;
  },

  removeLocation(location = {}) {
    const that = this;
    const locations = this.get('locations');

    locations.forEach((loc, i) => {
      if (loc.id === location.id) {
        locations.splice(i, 1);

        that.set('locations', locations);
        that.trigger('change:locations');
        that.save();
      }
    });
  },

  locationExists(location = {}) {
    const locations = this.get('locations');
    let exists = false;
    locations.forEach((loc) => {
      if (
        loc.name === location.name &&
        loc.latitude === location.latitude &&
        loc.longitude === location.longitude &&
        loc.source === location.source
      ) {
        exists = true;
      }
    });
    return exists;
  },

  printLocation(location) {
    const useGridRef = this.get('useGridRef');

    if (location.latitude && location.longitude) {
      if (useGridRef || location.source === 'gridref') {
        // check if location is within UK
        let prettyLocation = LocHelp.coord2grid(location);
        if (!prettyLocation) {
          prettyLocation = `${parseFloat(location.latitude).toFixed(4)}, ${
            parseFloat(location.longitude).toFixed(4)}`;
        }
        return prettyLocation;
      }
      return `${parseFloat(location.latitude).toFixed(4)}, ${
        parseFloat(location.longitude).toFixed(4)}`;
    }
    return '';
  },
};
