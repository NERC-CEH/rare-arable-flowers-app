import Backbone from 'backbone';
import App from '../../../app';
import appModel from '../../common/models/app_model';
import Sample from '../../common/models/sample';
import Occurrence from '../../common/models/occurrence';
import MainView from './main_view';
import HeaderView from './header_view';
import speciesData from 'species.data';
import JST from '../../../JST';

const API = {
  show() {
    const speciesCollection = new Backbone.Collection(speciesData);

    const mainView = new MainView({
      collection: speciesCollection,
      appModel,
    });
    mainView.on('childview:record', (childView) => {
      const speciesModel = childView.model;
      API.record(speciesModel);
    });
    App.regions.main.show(mainView);


    // HEADER
    const headerView = new HeaderView();

    headerView.on('filter', (e) => {
      App.regions.dialog.show({
        title: 'Filter',
        body: JST['species/list/filters']({}),
      });
    });

    headerView.on('sort', (e) => {
      App.regions.dialog.show({
        title: 'Sort',
        body: JST['species/list/sorts']({}),
      });
    });

    App.regions.header.show(headerView);

    // FOOTER
    App.regions.footer.hide().empty();
  },

  // record species
  record(speciesModel) {
    // create new record
    const sample = new Sample();
    const occurrence = new Occurrence();
    occurrence.set('taxon', speciesModel.attributes);
    sample.addOccurrence(occurrence);
    sample.save().then(() => {
      sample.startGPS();
      appModel.set('draftRecordID', sample.cid);

      // navigate to record edit
      App.trigger('records:edit', sample.cid);
    });
  },
};

export { API as default };
