import Backbone from 'backbone';
import App from '../../../app';
import appModel from '../../common/models/app_model';
import MainView from './main_view';
import HeaderView from './header_view';
import speciesData from 'species.data';

const API = {
  show() {
    const speciesCollection = new Backbone.Collection(speciesData);

    const mainView = new MainView({
      collection: speciesCollection,
      appModel,
    });
    App.regions.main.show(mainView);

    // HEADER
    const headerView = new HeaderView();

    headerView.on('filter', (e) => {
    });

    App.regions.header.show(headerView);

    // FOOTER
    App.regions.footer.hide().empty();
  },
};

export { API as default };
