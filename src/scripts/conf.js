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
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
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
    SURVEY_ID: 258
  });
  $.extend(morel.record.inputs.KEYS, {
    SREF_ACCURACY: 'smpAttr:282',
    LOCATIONDETAILS: 'smpAttr:567',
    LOCATIONDETAILS_VAL: {
      "Cultivated Strip / Block": 4783,
      "Conservation headland": 4784,
      "Wild bird seed / Game cover": 4785,
      "Wildflower / Clover rich margin": 4786,
      "Grass margin / corner": 4787,
      "Crop": 4788,
      "Stubble": 4789,
      "Track / gateway": 4790,
      "Other": 4791,
      "Grassland": 4792
    },
    NUMBER: 'occAttr:383',
    NUMBER_VAL: {
      '1': 4774,
      '2-10': 4775,
      '11-100': 4776,
      '101-1000': 4777,
      '1000+': 4778,
      'Present': 4779 //default
    },
    NUMBER_AREA_LENGTH: 111,
    NUMBER_AREA_WIDTH: 112,
    STAGE: 'occAttr:384',
    STAGE_VAL: {
      Vegetative: 4780,
      Flowering: 4781,
      'In Seed': 4782
    },
    SREF_NAME: 'sample:location_name',
    COMMENT: 'sample:comment'
  });
});