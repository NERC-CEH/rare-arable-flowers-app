/******************************************************************************
 * Species router.
 *****************************************************************************/
import Marionette from 'marionette';
import App from '../../app';
import Log from '../../helpers/log';
import Device from '../../helpers/device';

import ListController from './list/controller';
import AccountController from './account/controller';

App.species = {};

let scroll = 0; // last scroll position

const Router = Marionette.AppRouter.extend({
  routes: {
    'species(/)': {
      route: ListController.show,
      after() {
        if (Device.isIOS()) {
          // iOS scroll glitch fixs
          setTimeout(() => {
            scrollTo(0, scroll);
          }, 1);
        } else {
          scrollTo(0, scroll);
        }
      },
      leave() {
        scroll = scrollY;
      },
    },
    'species/:id': AccountController.show,
    'species/*path'() {App.trigger('404:show');},
  },

});

App.on('species:list', () => {
  App.navigate('species');
  ListController.show();
});

App.on('species:account', (speciesID, options) => {
  App.navigate(`species/${speciesID}`, options);
  AccountController.show(speciesID);
});

App.on('before:start', () => {
  Log('Species:router: initializing');
  App.species.router = new Router();
});
