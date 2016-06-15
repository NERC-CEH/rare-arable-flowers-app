/** ****************************************************************************
 * Home main view.
 *****************************************************************************/
import Marionette from 'marionette';
import JST from '../../../JST';
import Clusterize from '../../../../vendor/clusterize/js/clusterize';


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


const List = Marionette.CollectionView.extend({
  id: 'species-list-t',
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


export default Marionette.ItemView.extend({
  template: _.template(`<div id="scrollArea" class="clusterize-scroll">
    <ul id="species-list" class="table-view no-top clusterize-content"></ul>
</div>`),
  onShow() {
    var data = [];

    //for (var i= 0; i< 1000; i++) {
    //  data.push('<div>' + i +'</div>');
    //}
    const that = this;
    this.collection.each((model) => {
      const view = new SpeciesView({ model, appModel: that.options.appModel });
      view.render();
      data.push(`<li class="table-view-cell">${view.el.innerHTML}</li>`);
    })

    var clusterize = new Clusterize({
      rows: data,
      scrollId: 'scrollArea',
      contentId: 'species-list',
      item_height: 80,
      blocks_in_cluster: 4,
      rows_in_block: 10,
    });
  },
});
