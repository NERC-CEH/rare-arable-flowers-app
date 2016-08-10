/** ****************************************************************************
 * Location GPS view.
 *****************************************************************************/
import $ from 'jquery';
import Marionette from 'marionette';
import JST from '../../../../JST';
import Typeahead from 'typeahead';
import Bloodhound from 'bloodhound';

export default Marionette.ItemView.extend({
  initialize() {
    this.locationUpdate = null; // to store GPS updates

    const recordModel = this.model.get('recordModel');

    this.template = function template() {
      if (recordModel.isGPSRunning()) {
        return JST['common/location/gps_running'](arguments[0]);
      }

      const location = recordModel.get('location') || {};
      // only gps and todays records
      if (location.source === 'gps' &&
        (new Date(location.updateTime).toDateString() === new Date().toDateString())) {
        return JST['common/location/gps_success'](arguments[0]);
      }
      return JST['common/location/gps'](arguments[0]);
    };

    this.listenTo(recordModel, 'geolocation:start geolocation:stop geolocation:error', this.render);
    this.listenTo(recordModel, 'geolocation:update', this.geolocationUpdate);
    this.listenTo(recordModel, 'geolocation:success', this.geolocationSuccess);
  },

  onShow() {
    var substringMatcher = function(strs) {
      return function findMatches(q, cb) {
        var matches, substrRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            matches.push(str);
          }
        });

        cb(matches);
      };
    };

    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
      'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    $('.typeahead').typeahead({
        hint: false,
        highlight: false,
        minLength: 1,
        limit: 2
      },
      {
        name: 'states',
        source: substringMatcher(states)
      });
  },

  triggers: {
    'click #gps-button': 'gps:click',
  },

  events: {
    'change #location-name': 'changeName',
  },

  changeName(e) {
    this.triggerMethod('location:name:change', $(e.target).val());
  },

  /**
   * Update the temporary location fix
   * @param location
   */
  geolocationUpdate(location) {
    this.locationUpdate = location;
    this.render();
  },

  geolocationSuccess(location) {
    this.locationUpdate = location;
    this.render();
  },

  serializeData() {
    const recordModel = this.model.get('recordModel');
    let location = this.locationUpdate;
    const prevLocation = recordModel.get('location') || {};

    // if not fixed the location but has previous one that is updating
    if (!location && prevLocation.source === 'gps') {
      location = prevLocation;
    }

    if (location) {
      return {
        name: prevLocation.name,
        accuracy: location.accuracy,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracyLimit: 100, // TODO: get from GPS
      };
    }
    return {
      name: prevLocation.name,
    };
  },
});
