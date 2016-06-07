/** ****************************************************************************
 * Main app configuration file.
 *****************************************************************************/
import LocHelp from './helpers/location';
import DateHelp from './helpers/date';

export default {
  version: '1.0.0', // replaced on build
  build: '0', // replaced on build
  name: 'rare-arable-flowers', // replaced on build

  gps_accuracy_limit: 100,

  // logging
  log: {
    states: ['e', 'w', 'i', 'd'], // see log helper
    ga_error: true
  },

  // google analytics
  ga: {
    status: true,
    ID: 'UA-58378803-5'
  },

  login: {
    url: 'https://www.brc.ac.uk/irecord/user/mobile/register',
    timeout: 30000
  },

  report: {
    url: 'http://www.brc.ac.uk/irecord/mobile/report',
    timeout: 80000
  },

  // mapping
  map: {
    API_KEY: '28994B5673A86451E0530C6CA40A91A5'
  },

  // morel configuration
  morel:{
    manager: {
      url: 'https://www.brc.ac.uk/irecord/mobile/submit',
      appname: 'raf',
      appsecret: 'rafPass1234',
      website_id: 23,
      survey_id: 396,
      input_form: 'enter-app-record'
    },
    sample: {
      location: {
        values: function (location, options) {
          // convert accuracy for map and gridref sources
          let accuracy = location.accuracy;
          if (location.source !== 'gps') {
            if (location.source === 'map') {
              accuracy = LocHelp.mapZoom2meters(location.accuracy);
            } else {
              accuracy = null;
            }
          }

          let attributes = {
            location_name: location.name,
            location_source: location.source,
            location_gridref: location.gridref,
            location_altitude: location.altitude,
            location_altitude_accuracy: location.altitudeAccuracy,
            location_accuracy: accuracy
          };

          // add other location related attributes
          options.flattener(attributes, options);

          return location.latitude + ', ' + location.longitude;
        }
      },
      location_accuracy: { id: 282 },
      location_altitude: { id: 283 },
      location_altitude_accuracy: { id: 284 },
      location_source: { id: 760 },
      location_gridref: { id: 335 },

      device: {
        id: 273,
        values: {
          iOS: 2398,
          Android: 2399
        }
      },

      device_version: { id: 759 },

      date: {
        values: function (date) {
          return DateHelp.print(date);
        }
      },
    },
    occurrence: {
      taxon: {
        values: function (taxon) {
          return taxon.warehouse_id;
        }
      },
      number: {
        id: 551,
        values: {
          'default': true,
          '1': 6180,
          '2-10': 6181,
          '11-100': 6182,
          '101-1000': 6183,
          '1000+': 6184,
        }
      },
      number_length: {
        id: 563,
      },
      number_width: {
        id: 562,
      },
      stage: {
        id: 549,
        values: {
          'default': true,
          'Vegetative': 6177,
          'Flowering': 6178,
          'In Seed': 6179,
        }
      },
      locationdetails: {
        id: 877,
        values: {
          'default': true,
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
      },
    }
  },
  statistics: {
    url: 'http://www.brc.ac.uk/irecord/raf-app-summary',
  },
};
