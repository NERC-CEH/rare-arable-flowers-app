import Backbone from 'backbone';
import App from '../../../app';
import HeaderView from '../../common/views/header_view';
import MainView from './main_view';

const API = {
  show() {
    const mainView = new MainView();
    App.regions.main.show(mainView);

    // HEADER
    const headerView = new HeaderView({
      model: new Backbone.Model({
        title: 'Location',
      }),
    });
    App.regions.header.show(headerView);

    // FOOTER
    App.regions.footer.hide().empty();
  },
};

export { API as default };
