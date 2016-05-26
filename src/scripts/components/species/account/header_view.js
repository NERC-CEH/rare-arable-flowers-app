/** ****************************************************************************
 * Record List header view.
 *****************************************************************************/
import Marionette from 'marionette';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  id: 'species-account-header',
  tagName: 'nav',
  template: JST['species/account/header'],

  events: {
    'click a[data-rel="back"]': 'navigateBack',
    'click #favourite-btn': 'toggleFavourite',
  },

  toggleFavourite(e) {
    this.trigger('favourite', e);
  },

  navigateBack() {
    window.history.back();
  },
});

