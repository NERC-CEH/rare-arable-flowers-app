/** ****************************************************************************
 * Help Menu main view.
 *****************************************************************************/
import Marionette from 'marionette';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  template: JST['info/menu_help/main'],

  events: {
    'click #logout-button': 'logout',
  },

  modelEvents: {
    change: 'render',
  },

  serializeDate() {
    return {
      surname: this.model.get('surname'),
    };
  },

  logout() {
    this.trigger('user:logout');
  },
});