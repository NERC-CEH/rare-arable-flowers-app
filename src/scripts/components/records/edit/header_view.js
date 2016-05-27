/** ****************************************************************************
 * Record Edit header view.
 *****************************************************************************/
import Marionette from 'marionette';
import Morel from 'morel';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  tagName: 'nav',
  template: JST['records/edit/header'],

  events: {
  },

  triggers: {
    'click #record-save-btn': 'save',
    'click a[data-rel="back"]': 'navigateBack',
  },

  modelEvents: {
    'request sync error': 'render',
  },

  serializeData() {
    return {
      isSynchronising: this.model.getSyncStatus() === Morel.SYNCHRONISING,
    };
  },
});

