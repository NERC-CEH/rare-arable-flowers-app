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
        const el = App.regions.main.el;
        if (typeof el !== 'string') el.scrollTop = scroll;
      },
      leave() {
        scroll = App.regions.main.el.scrollTop;
      },
    },
    'species/:id': {
      route: AccountController.show,
      after() {
        // iOS webkit touch scroll stop fix
        setTimeout(() => {
          const el = App.regions.main.el;
          if (typeof el !== 'string') el.scrollTop = 0;
        }, 1);
      },
    },
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
