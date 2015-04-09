/*!
 * CONFIGURATION.
 */

app = app || {};
app.CONF = {};

//app wide settings
app.CONF.SPECIES_DATA_SRC = "data/species.json";
app.CONF.PROB_DATA_SRC = "data/abundance.json";
app.CONF.APPCACHE_SRC = "appcache.html";

//morel configuration
app.CONF.VERSION = '0'; //grunt replaced. Application (controllers and data) version
app.CONF.NAME = 'app'; //grunt replaced.

app.CONF.HOME = "raf/dist/";
app.CONF.LOG = morel.LOG_DEBUG;

app.CONF.MAP = {
  zoom: 5,
  zoomControl: true,
  zoomControlOptions: {
    style: 1
  },
  panControl: false,
  linksControl: false,
  streetViewControl: false,
  overviewMapControl: false,
  scaleControl: false,
  rotateControl: false,
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: 1
  },
  styles: [
    {
      "featureType": "landscape",
      "stylers": [
        {"hue": "#FFA800"},
        {"saturation": 0},
        {"lightness": 0},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "road.highway",
      "stylers": [
        {"hue": "#53FF00"},
        {"saturation": -73},
        {"lightness": 40},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "road.arterial",
      "stylers": [
        {"hue": "#FBFF00"},
        {"saturation": 0},
        {"lightness": 0},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {"hue": "#00FFFD"},
        {"saturation": 0},
        {"lightness": 30},
        {"gamma": 1}
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {"saturation": 43},
        {"lightness": -11},
        {"hue": "#0088ff"}
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {"hue": "#679714"},
        {"saturation": 33.4},
        {"lightness": -25.4},
        {"gamma": 1}
      ]
    }
  ]
};

morel.CONF.NAME = app.CONF.NAME;
morel.io.CONF.RECORD_URL = 'http://192.171.199.230/iRecord/mobile/submit';
morel.auth.CONF = {
  APPNAME: "testApp",
  APPSECRET: "testAppSecret",
  WEBSITE_ID: 23,
  SURVEY_ID: 42
};
morel.geoloc.CONF.GPS_ACCURACY_LIMIT = 100; //meters
morel.record.inputs.KEYS.NUMBER = 'sample:number';
morel.record.inputs.KEYS.STAGE = 'sample:stage';
morel.record.inputs.KEYS.LOCATIONDETAILS = 'sample:locationdetails';

//JQM configuration
$.mobile.ns = "";
$.mobile.autoInitializePage = true;
$.mobile.subPageUrlKey = "ui-page";
$.mobile.activePageClass = "ui-page-active";
$.mobile.activeBtnClass = "ui-btn-active";
$.mobile.defaultPageTransition = "";
$.defaultDialogTransition = "";
$.mobile.minScrollBack = "150";
$.mobile.loadingMessage = "Loading";
$.mobile.pageLoadErrorMessage = "Error Loading Page";
$.mobile.touchOverflowEnabled = 0;

//Disable jQM routing and component creation events
//disable hash-routing
$.mobile.hashListeningEnabled = false;
//disable anchor-control
$.mobile.linkBindingEnabled = false;
//can cause calling object creation twice and back button issues are solved
$.mobile.ajaxEnabled = false;
//Otherwise after mobileinit, it tries to load a landing page
$.mobile.autoInitializePage = false;
//we want to handle caching and cleaning the DOM ourselves
$.mobile.page.prototype.options.domCache = false;

//consider due to compatibility issues
//not supported by all browsers
$.mobile.pushStateEnabled = false;
//Solves phonegap issues with the back-button
$.mobile.phonegapNavigationEnabled = true;
//no native datepicker will conflict with the jQM component
$.mobile.page.prototype.options.degradeInputs.date = true;