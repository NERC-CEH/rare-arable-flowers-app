/** ****************************************************************************
 * Record List header view.
 *****************************************************************************/
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

  toggleFilters(e) {
    this.trigger('filter', e);
  },

  toggleSorts(e) {
    this.trigger('sort', e);
  },

  navigateBack() {
    window.history.back();
  },
});

