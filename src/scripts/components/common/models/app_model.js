/** ****************************************************************************
 * App model. Persistent.
 *****************************************************************************/
import Backbone from 'backbone';
import Store from '../../../../vendor/backbone.localStorage/js/backbone.localStorage';
import pastLocationsExtension from './app_model_past_loc_ext';
import CONFIG from 'config'; // Replaced with alias

let AppModel = Backbone.Model.extend({
  id: 'app',

  defaults: {
    locations: [],
    attrLocks: {},
    autosync: true,
    useGridRef: true,
  },

  localStorage: new Store(CONFIG.name),

  /**
   * Initializes the object.
   */
  initialize() {
    this.fetch();
  },
});

// add previous/pased saved locations management
AppModel = AppModel.extend(pastLocationsExtension);

const appModel = new AppModel();
export { appModel as default, AppModel };
