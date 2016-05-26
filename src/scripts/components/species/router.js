/******************************************************************************
 * Species router.
 *****************************************************************************/
import Marionette from 'marionette';
import App from '../../app';
import Log from '../../helpers/log';

import ListController from './list/controller';
import AccountController from './account/controller';

App.species = {};

const Router = Marionette.AppRouter.extend({
  routes: {
    'species(/)': ListController.show,
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
