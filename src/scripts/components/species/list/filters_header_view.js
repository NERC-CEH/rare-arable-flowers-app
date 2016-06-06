/** ****************************************************************************
 * Record List header view.
 *****************************************************************************/
import _ from 'lodash';
import Marionette from 'marionette';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  id: 'filters-dialog-header',
  template: JST['species/list/filters-header'],
  modelEvents: {
    'change:filter': 'render',
  },
  serializeData() {
    let filtered;

    const filteredList = this.options.speciesCollection.length;
    const totalList = this.options.speciesCollection.totalSpecies;
    if (filteredList !== totalList) {
      filtered = `${filteredList}/${totalList}`;
    }
    return { filtered };
  },
});