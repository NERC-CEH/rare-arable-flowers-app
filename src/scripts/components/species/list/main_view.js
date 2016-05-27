/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import JST from '../../../JST';


const SpeciesView = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'table-view-cell',

  template: JST['species/list/species'],

  triggers: {
    'click #record': 'record',
  },

  serializeData() {
    const species = this.model;

    return {
      id: species.get('id'),
      img: species.get('profile_pic'),
      taxon: species.get('taxon'),
      common_name: species.get('common_name'),
      common_name_significant: species.get('common_name_significant'),
      favourite: false,
    };
  },
});



export default Marionette.CollectionView.extend({
  id: 'species-list',
  tagName: 'ul',
  className: 'table-view no-top',
  childView: SpeciesView,

  childViewOptions() {
    return {
      appModel: this.options.appModel,
    };
  },
});