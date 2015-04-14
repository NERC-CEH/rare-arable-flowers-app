/******************************************************************************
 * Main app configuration file.
 *****************************************************************************/
define(['morel', 'helpers/log'], function () {
  app = window.app || {};

  app.VERSION = '0'; //version grunt replaced
  app.NAME = 'app'; //name grunt replaced

  app.CONF = {
    //app feature settings
    OFFLINE: {
      STATUS: true,
      APPCACHE_URL: "appcache.html"
    },
    GA: {
      //Google Analytics settings
      STATUS: true,
      ID: 'UA-58378803-3'
    },
    LOGIN: {
      STATUS: true,
      URL: "http://192.171.199.230/irecord7/user/mobile/register",
      TIMEOUT: 80000
    },
    SEND_RECORD: {
      STATUS: true,
      URL: "http://192.171.199.230/irecord7/mobile/submit"
    },
    REGISTER: {
      STATUS: true
    },
    LIST: {
      DEFAULT_SORT: 'taxonomic'
    },
    MAP: {
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
    }
};

  //logging
  log.CONF = {
    STATE: log.INFO,
    GA_ERROR: true //log error using google analytics
  };

  //morel configuration
  morel.CONF.NAME = app.NAME;
  morel.io.CONF.RECORD_URL = app.CONF.SEND_RECORD.URL;
  morel.geoloc.CONF.GPS_ACCURACY_LIMIT = 100; //meters
  $.extend(morel.auth.CONF, {
    APPNAME: "test",
    APPSECRET: "mytest",
    WEBSITE_ID: 23,
    SURVEY_ID: 42
  });
  $.extend(morel.record.inputs.KEYS, {
    LOCATIONDETAILS: 'sample:locationdetails',
    LOCATIONDETAILS_VAL: {
      "Cultivated Strip / Block": 2211,
      "Conservation headland": 222,
      "Wild bird seed / Game cover": 4444,
      "Wildflower / Clover rich margin": 3232,
      "Grass margin / corner": 3123,
      "Crop": 23,
      "Stubble": 1232,
      "Track / gateway": 122,
      "Other":12
    },
    NUMBER: 'sample:number',
    NUMBER_VAL: {
      '1': 665,
      '2-10': 666,
      '11-100': 667,
      '101-1000': 668,
      '1000+': 670,
      'Present': 671 //default
    },
    STAGE: 'sample:stage',
    STAGE_VAL: {
      Vegatative: 4756,
      Flowering: 4757,
      'In Seed': 4758
    },
    SREF_NAME: 'smpAttr:566',
    COMMENT: 'sample:comment'
  });
});