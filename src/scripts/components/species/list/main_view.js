/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
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

    const sort = this.options.appModel.get('sort');
    const sortScientific = sort === 'scientific' || sort === 'scientific-reverse';

    return {
      id: species.get('id'),
      img: species.get('thumbnail'),
      taxon: species.get('taxon'),
      common_name: species.get('common_name'),
      common_name_significant: species.get('common_name_significant'),
      favourite: this.options.appModel.isFavouriteSpecies(species.get('id')),
      sortScientific,
    };
  },
});


export default Marionette.CollectionView.extend({
  id: 'species-list',
  tagName: 'ul',
  className: 'table-view no-top',
  childView: SpeciesView,

  initialize() {
    this.listenTo(this.options.appModel, 'change:filter', this.render);
  },

  childViewOptions() {
    return {
      appModel: this.options.appModel,
    };
  },
});
