import Backbone from 'backbone';
import App from '../../../app';
import MainView from './main_view';
import HeaderView from './header_view';
import speciesData from 'species.data';

const API = {
  show(id) {
    const speciesCollection = new Backbone.Collection(speciesData);
    const speciesModel = speciesCollection.get(id);

    const mainView = new MainView({
      model: speciesModel,
    });
    App.regions.main.show(mainView);

    // HEADER
    const headerView = new HeaderView();

    headerView.on('favourite', (e) => {
    });

    App.regions.header.show(headerView);

    // FOOTER
    App.regions.footer.hide().empty();
  },
};

export { API as default };
