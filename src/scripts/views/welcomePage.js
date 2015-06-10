/******************************************************************************
 * Welcome page view.
 *****************************************************************************/
define([
  'views/_page',
  'helpers/download',
  'helpers/browser',
  'templates'
], function (Page, download, browser) {
  'use strict';

  var Welcome = Page.extend({
    id: 'welcome',

    template: app.templates.welcome,

    initialize: function () {
      _log('views.WelcomePage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();

      this.trip();
    },

    appendEventListeners: function () {
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.WelcomePage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },

    trip: function () {
      if(browser.isMobile() && !browser.isHomeMode()) {
        var finishedTrips = app.models.user.get('trips') || [];
        if (finishedTrips.indexOf('welcome') < 0) {
          setTimeout(function(){
            var finishedBtnCloseId = 'finished-ok-button';

            var addingToHomeScreen = '<p>1. Open <strong>Browser Options</strong></p>' +
              '<p>2. Tap <strong>Add to Home Screen</strong></p>';

            if(browser.isIOS()){
              addingToHomeScreen =
              '<img id="safari-add-homescreen" src="images/add_homescreen.png">';
            }

            var message =
              '<center><h2>Add to Homescreen</h2></center>' +
              addingToHomeScreen +
              '<button id="' + finishedBtnCloseId + '">OK</button>';

              app.message(message, 0);

            $('#' + finishedBtnCloseId ).on('click', function () {
              if (app.CONF.OFFLINE.STATUS) {
                finishedTrips.push('welcome');
                app.models.user.set('trips', finishedTrips);
                app.models.user.save();

                download();
              }
            });
          }, 500);
          return;
        }
      }

      //in case the home screen mode was not detected correctly
      if (app.CONF.OFFLINE.STATUS){
        setTimeout(download, 500);
      }
    }
  });
  return Welcome;
});