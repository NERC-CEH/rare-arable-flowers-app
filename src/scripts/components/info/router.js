/******************************************************************************
 * Info router.
 *****************************************************************************/
import Backbone from 'backbone';
import Marionette from 'marionette';
import App from '../../app';
import Log from '../../helpers/log';
import CONFIG from 'config'; // Replaced with alias

import CommonController from '../common/controller';
import HomeController from './home/controller';

App.info = {};

const Router = Marionette.AppRouter.extend({
  routes: {
    '': HomeController.show,
    'info/management(/)'() {
      CommonController.show({
        title: 'Management', App, route: 'info/management/main',
      });},
    'info(/)'() {
      CommonController.show({
        title: 'Info', App, route: 'info/help/main',
      });},
    'info/about(/)'() {
      CommonController.show({
        title: 'About', App, route: 'info/about/main',
        model: new Backbone.Model({
          version: CONFIG.version,
          build: CONFIG.build,
        }),
      });},
    'info/privacy(/)'() {
      CommonController.show({
        title: 'Privacy Policy', App, route: 'info/privacy/main',
      });},
    'info/brc-approved(/)'() {
      CommonController.show({
        title: 'BRC Approved', App, route: 'info/brc_approved/main',
      });},
    'info/credits(/)'() {
      CommonController.show({
        title: 'Credits', App, route: 'info/credits/main',
      });},
    'info/*path'() {App.trigger('404:show');},
  },
});


// home page
App.on('home', () => {
  App.navigate('home');
  HomeController.show();
});


// info pages
App.on('info', () => {
  App.navigate('info');
  CommonController.show({
    title: 'Info', App, route: 'info/help/main',
  });
});

App.on('info:about', () => {
  App.navigate('info/about');
  CommonController.show({
    title: 'About', App, route: 'info/about/main',
    model: new Backbone.Model({ version: CONFIG.version }),
  });
});

App.on('info:privacy', () => {
  App.navigate('info/privacy');
  CommonController.show({
    title: 'Privacy Policy', App, route: 'info/privacy/main',
  });
});

App.on('info:brc-approved', () => {
  App.navigate('info/brc-approved');
  CommonController.show({
    title: 'BRC Approved', App, route: 'info/brc_approved/main',
  });
});

App.on('info:credits', () => {
  App.navigate('info/credits');
  CommonController.show({
    title: 'Credits', App, route: 'info/credits/main',
  });
});

App.on('before:start', () => {
  Log('Info:router: initializing');
  App.info.router = new Router();
});
