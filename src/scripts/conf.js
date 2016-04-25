/******************************************************************************
 * Main app configuration file.
 *****************************************************************************/
define(['morel', 'helpers/log'], function () {
  app = window.app || {};

  app.VERSION = '{APP_VER}'; //replaced on build
  app.NAME = '{APP_NAME}'; //replaced on build

  app.CONF = {
    GPS_ACCURACY_LIMIT: 100,

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
      URL: "https://www.brc.ac.uk/irecord/user/mobile/register",
      TIMEOUT: 80000
    },
    REGISTER: {
      STATUS: true
    },
    STATISTICS: {
      URL: "http://www.brc.ac.uk/irecord/raf-app-summary"
    },
    LIST: {
      DEFAULT_SORT: 'taxonomic'
    },
    MAP: {
      zoom: 5,
      zoomControl: true,
      zoomControlOptions: {
        style: 2,
        position: 5
      },
      panControl: false,
      linksControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      scaleControl: false,
      rotateControl: false,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: 1,
        position: 7
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
  app.CONF.morel = {
    url: 'https://www.brc.ac.uk/irecord/mobile/submit',
    appname: "raf",
    appsecret: "rafPass1234",
    website_id: 23,
    survey_id: 396,
    Storage: morel.DatabaseStorage
  };

  $.extend(true, morel.Sample.keys, {
    name: {
      id: 6
    },
    surname: {
      id: 7
    },
    email: {
      id: 8
    },
    location_accuracy: {
      id: 282
    },
    location_name: {
      id: 274
    },
    recorded_all: {
      id: 62
    },
    survey_area: {
      id: 323,
      values: {
        'point': 3068,
        '100m': 3069,
        '1km': 3070
      }
    },
    locationdetails: {
      id: 877,
      values: {
        "Cultivated Strip / Block": 6167,
        "Conservation headland": 6168,
        "Wild bird seed / Game cover": 6169,
        "Wildflower / Clover rich margin": 6170,
        "Grass margin / corner": 6171,
        "Crop": 6172,
        "Stubble": 6173,
        "Track / gateway": 6174,
        "Other": 6175,
        "Grassland": 6176
      }
    }
  });

  var numberRanges = {
    '1': 6180,
    '2-10': 6181,
    '11-100': 6182,
    '101-1000': 6183,
    '1000+': 6184,
    'Present': 6185 //default
  };

  $.extend(true, morel.Occurrence.keys, {
    number: {
      id: 551, values: numberRanges
    },
    stage: {
      id: 549,
      values: {
        'Vegetative': 6177,
        'Flowering': 6178,
        'In Seed': 6179
      }
    },
    taxon: {
      values: {
        1:	370993,
        2:	370995,
        3:	370997,
        4:	370999,
        5:	371001,
        6:	371003,
        7:	371005,
        8:	371007,
        9:	371009,
        10:	371011,
        11:	371013,
        12:	371015,
        13:	371017,
        14:	371019,
        15:	371021,
        16:	371023,
        17:	371025,
        18:	371027,
        19:	371029,
        20:	371031,
        21:	371033,
        22:	371035,
        23:	371037,
        24:	371039,
        25:	371041,
        26:	371043,
        27:	371045,
        28:	371047,
        29:	371049,
        30:	371051,
        31:	371053,
        32:	371055,
        33:	371057,
        34:	371059,
        35:	371061,
        36:	371063,
        37:	371065,
        38:	371067,
        39:	371069,
        40:	371071,
        41:	371073,
        42:	371075,
        43:	371077,
        44:	371079,
        45:	371081,
        46:	371083,
        47:	371085,
        48:	371087,
        49:	371089,
        50:	371091,
        51:	371093,
        52:	371095,
        53:	371097,
        54:	371099,
        55:	371101,
        56:	371103,
        57:	371105,
        58:	371107,
        59:	371109,
        60:	371111,
        61:	371113,
        62:	371115,
        63:	371117,
        64:	371119,
        65:	371121,
        66:	371123,
        67:	371125,
        68:	371127,
        69:	371129,
        70:	371131,
        71:	371133,
        72:	371135,
        73:	371137,
        74:	371139,
        75:	371141,
        76:	371143,
        77:	371145,
        78:	371147,
        79:	371149,
        80:	371151,
        81:	371153,
        82:	371155,
        83:	371157,
        84:	371159,
        85:	371161,
        86:	371163,
        87:	371165,
        88:	371167,
        89:	371169,
        90:	371171,
        91:	371173,
        92:	371175,
        93:	371177,
        94:	371179,
        95:	371181,
        96:	371183,
        97:	371185,
        98:	371187,
        99:	371189,
        100:	371191,
        101:	371193,
        102:	371195,
        103:	371197,
        104:	371199,
        105:	371201,
        106:	371203,
        107:	371205,
        108:	371207,
        109:	371209,
        110:	371211,
        111:	371213,
        112:	371215,
        113:	371217,
        114:	371219,
        115:	371221,
        116:	371223,
        117:	371225,
        118:	371227,
        119:	371229,
        120:	371231,
        121:	371233
      }
    }
  });
});