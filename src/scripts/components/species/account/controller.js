import Backbone from 'backbone';
import App from '../../../app';
import MainView from './main_view';
import appModel from '../../common/models/app_model';
import HeaderView from '../../common/views/header_view';
import FavouriteButtonView from './favourite_button_view';
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
    const favouriteButtonView = new FavouriteButtonView({
      model: appModel,
    });
    favouriteButtonView.on('click', () => {
      appModel.toggleFavourite(speciesModel);
    });

    const headerView = new HeaderView({
      id: 'species-account-header',
      rightPanel: favouriteButtonView,
      model: new Backbone.Model({ title: speciesModel.get('taxon') }),
    });

    App.regions.header.show(headerView);

    // FOOTER
    App.regions.footer.hide().empty();
  },
};

export { API as default };
