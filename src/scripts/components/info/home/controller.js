import App from '../../../app';
import MainView from './main_view';

const API = {
  show() {
    const mainView = new MainView();
    App.regions.main.show(mainView);

    // HEADER
    App.regions.header.hide().empty();

    // FOOTER
    App.regions.footer.hide().empty();
  },
};

export { API as default };
