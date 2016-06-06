/** ****************************************************************************
 * Species List sort view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import JST from '../../../JST';

export default Marionette.ItemView.extend({
  id: 'species-list-sorts',
  tagName: 'list',
  template: JST['species/list/sorts'],

  events: {
    'click input[type="radio"]': 'saveSort',
  },

  saveSort() {
    let selection;
    const $inputs = this.$el.find('input[type="radio"]');
    $inputs.each((int, elem) => {
      if ($(elem).prop('checked')) {
        selection = $(elem).val();
      }
    });
    this.trigger('sort', selection);
  },

  serializeData() {
    const sort = {};
    sort[this.model.get('sort')] = true;
    return sort;
  },
});

