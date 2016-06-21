/** ****************************************************************************
 * Record List header view.
 *****************************************************************************/
import _ from 'lodash';
import Morel from 'morel';
import Marionette from 'marionette';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  id: 'species-list-header',
  tagName: 'nav',
  template: JST['species/list/header'],

  events: {
    'click a[data-rel="back"]': 'navigateBack',
    'click #filter-btn': 'toggleFilters',
    'click #sort-btn': 'toggleSorts',
  },

  modelEvents: {
    'change:filter': 'render',
  },

  toggleFilters(e) {
    this.trigger('filter', e);
  },

  toggleSorts(e) {
    this.trigger('sort', e);
  },

  navigateBack() {
    window.history.back();
  },

  serializeData() {
    const that = this;
    const recordsCollection = this.options.recordsCollection;
    let filterOn = false;
    let userOn = false;

    const filters = this.model.get('filters');
    _.forOwn(filters, (filterGroup) => {
      if (filterGroup.length) {
        filterOn = true;
      }
    });

    recordsCollection.each((record) => {
      if (record.getSyncStatus() !== Morel.SERVER && record.metadata.saved) {
        userOn = true;
      }
    });

    return { filterOn, userOn };
  },
});

