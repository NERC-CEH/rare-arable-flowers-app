/** ****************************************************************************
 * App model. Persistent.
 *****************************************************************************/
import _ from 'lodash';
import Backbone from 'backbone';
import Store from '../../../../vendor/backbone.localStorage/js/backbone.localStorage';
import pastLocationsExtension from './app_model_past_loc_ext';
import CONFIG from 'config'; // Replaced with alias

let AppModel = Backbone.Model.extend({
  id: 'app',

  defaults: {
    exceptions: [],

    locations: [],
    favouriteSpecies: [],
    sort: 'common',
    filters: {},
    autosync: true,
    useGridRef: true,
    useGridMap: true,
  },

  localStorage: new Store(CONFIG.name),

  /**
   * Initializes the object.
   */
  initialize() {
    this.fetch();
  },

  toggleFavouriteSpecies(species) {
    const favSpecies = this.get('favouriteSpecies');
    if (this.isFavouriteSpecies(species.id)) {
      const foundIndex = _.indexOf(favSpecies, species.id);
      favSpecies.splice(foundIndex, 1);
    } else {
      favSpecies.push(species.id);
    }
    this.set('favouriteSpecies', favSpecies);
    this.save();
    this.trigger('change:favourite');
  },

  isFavouriteSpecies(speciesID) {
    const favSpecies = this.get('favouriteSpecies');
    const foundIndex = _.indexOf(favSpecies, speciesID);
    return foundIndex >= 0;
  },

  toggleFilter(filterGroup, filter) {
    const filters = this.get('filters');
    const foundIndex = _.indexOf(filters[filterGroup], filter);
    if (foundIndex >= 0) {
      // remove filter
      filters[filterGroup].splice(foundIndex, 1);
    } else {
      // init group
      filters[filterGroup] = filters[filterGroup] || [];
      // add filter
      filters[filterGroup].push(filter);
    }
    this.set('filters', filters);
    this.save();
    this.trigger('change:filter');
  },
});

// add previous/pased saved locations management
AppModel = AppModel.extend(pastLocationsExtension);

const appModel = new AppModel();
export { appModel as default, AppModel };
