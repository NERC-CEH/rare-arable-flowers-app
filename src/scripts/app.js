/******************************************************************************
 * App object.
 *****************************************************************************/
define([
    'jquery',
    'jquery.mobile',
    'backbone',
    'fastclick',
    'klass',
    'routers/router',
    'models/app',
    'models/user',
    'models/species',
    'models/record',
    'helpers/update',
    'helpers/brcart',
    'helpers/message',
    'helpers/log',
    'data'
  ],
  function ($, jqm, Backbone, FastClick, klass, Router, AppModel, UserModel,
            SpeciesCollection, RecordModel, update, brcArt) {
    var App = {
      init: function () {
        //init Google Analytics
        //http://veithen.github.io/2015/02/14/requirejs-google-analytics.html
        if (app.CONF.GA.STATUS){
          window.GoogleAnalyticsObject = "__ga__";
          window.__ga__ = {
            q: [["create", app.CONF.GA.ID, "auto"]],
            l: Date.now()
          };
          require(['ga'], function(ga) {
            ga('set', 'appName', app.NAME);
            ga('set', 'appVersion', app.VERSION);
          });
        }

        _log(brcArt, log.INFO);

        //overwrite morel user append function to match backbone
        window.morel.auth.getUser = function () {
          return app.models.user.attributes;
        };

        //init data
        app.models = {};
        app.models.user = new UserModel();
        app.models.app = new AppModel();
        app.models.record = new RecordModel();
        app.collections = {};
        app.collections.species = new SpeciesCollection(app.data.species);

        //update app
        update();

        app.router = new Router();
        Backbone.history.start();

        //app.fixIOSbuttons();

        FastClick.attach(document.body);

        //turn off the loading splash screen
        $('.loading').css('display', 'none');
      }
    };
    return App;
  });