import App from '../../../app';
import Log from '../../../helpers/log';
import appModel from '../../common/models/app_model';
import Sample from '../../common/models/sample';
import Occurrence from '../../common/models/occurrence';
import speciesCollection from './species_collection';
import MainView from './main_view';
import HeaderView from './header_view';
import FiltersHeaderView from './filters_header_view';
import FiltersView from './filters_view';
import SortsView from './sorts_view';

const API = {
  show() {
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
    const headerView = new HeaderView({ model: appModel });

    headerView.on('filter', (e) => {
      const filtersView = new FiltersView({ model: appModel });

      filtersView.on('filter', (filterGroup, filter) => {
        if (!filter || !filterGroup) {
          Log('Species:List:Controller: No filter provided', 'e');
          return;
        }
        Log('Species:List:Controller: Filter set');
        appModel.toggleFilter(filterGroup, filter);
      });


      App.regions.dialog.show({
        title: new FiltersHeaderView({ model: appModel, speciesCollection }),
        body: filtersView,
      });
    });
    headerView.on('sort', (e) => {
      const sortsView = new SortsView({ model: appModel });

      sortsView.on('sort', (sort) => {
        if (!sort) {
          Log('Species:List:Controller: No sort provided', 'e');
          return;
        }
        Log('Species:List:Controller: Sort set');
        App.regions.dialog.hide();

        appModel.set('sort', sort);
        appModel.save();
      });

      App.regions.dialog.show({
        title: 'Sort',
        body: sortsView,
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
