/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import Marionette from 'marionette';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  id: 'home',
  template: JST['info/home/main'],
});
