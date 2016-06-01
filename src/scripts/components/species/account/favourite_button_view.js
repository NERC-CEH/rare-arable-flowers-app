/** ****************************************************************************
 * Record List header view.
 *****************************************************************************/
import Marionette from 'marionette';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  id: 'species-account-header',
  tagName: 'nav',
  template: JST['species/account/favourite_button'],

  events: {
    'click #favourite-btn': 'toggleFavourite',
  },

  toggleFavourite(e) {
    this.trigger('click', e);
  },
});

