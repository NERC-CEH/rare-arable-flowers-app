/******************************************************************************
 * Record router.
 *****************************************************************************/
import Marionette from 'marionette';
import Log from '../../helpers/log';
import Device from '../../helpers/device';
import App from '../../app';
import recordManager from '../common/record_manager';
import userModel from '../common/models/user_model';
import appModel from '../common/models/app_model';

import ListController from './list/controller';
import ShowController from './show/controller';
import EditController from './edit/controller';
import EditAttrController from './attr/controller';
import LocationController from '../common/pages/location/controller';

App.records = {};

const Router = Marionette.AppRouter.extend({
  routes: {
    'records(/)': ListController.show,
    'records/new/:speciesId': (speciesID) => {
      EditController.show(speciesID, true);
    },
    'records/:id': ShowController.show,
    'records/:id/edit(/)': EditController.show,
    'records/:id/edit/location(/)': LocationController.show,
    'records/new/location(/)': LocationController.show,
    'records/:id/edit/:attr(/)': EditAttrController.show,
    'records/new/:attr(/)': EditAttrController.show,
    'records/*path'() {App.trigger('404:show');},
  },
});

App.on('records:list', (options) => {
  App.navigate('records', options);
  ListController.show();
});

App.on('records:new', (speciesID, options) => {
  App.navigate(`records/new/${speciesID}`, options);
  EditController.show(speciesID, true);
});

App.on('records:show', (recordID, options) => {
  App.navigate(`records/${recordID}`, options);
  ShowController.show(recordID);
});

App.on('records:edit', (recordID, options) => {
  App.navigate(`records/${recordID}/edit`, options);
  EditController.show(recordID);
});

App.on('records:edit:attr', (recordID, attrID, options) => {
  App.navigate(`records/${recordID}/edit/${attrID}`, options);
  switch (attrID) {
    case 'location':
      LocationController.show(recordID);
      break;
    default:
      EditAttrController.show(recordID, attrID);
  }
});


App.on('records:new:attr', (attrID, options) => {
  App.navigate(`records/new/${attrID}`, options);
  switch (attrID) {
    case 'location':
      LocationController.show(null, attrID);
      break;
    default:
      EditAttrController.show(null, attrID);
  }
});

App.on('record:saved', () => {
  window.history.back();
});

function syncRecords() {
  if (Device.isOnline() && appModel.get('autosync')) {
    Log('Records:router: syncing all records');
    recordManager.syncAll();
  }
}

userModel.on('login', syncRecords);

App.on('before:start', () => {
  Log('Records:router: initializing');
  App.records.router = new Router();

  if (userModel.hasLogIn()) {
    syncRecords();
  }
});
