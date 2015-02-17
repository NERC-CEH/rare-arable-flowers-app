var app = app || {};
app.models = app.models || {};
app.collections = app.collections || {};

(function () {
  'use strict';

  app.models.Record = Backbone.Model.extend({
    initialize: function (speciesID) {
      morel.record.clear(speciesID);
      this.saveSpecies(speciesID);
      this.saveDate();
    },

    /*
     * Sends the record.
     */
    send: function (callback, onError) {
      var onSaveSuccess = function (savedRecordId) {
        morel.record.clear();

        function onSendSuccess() {
          morel.record.db.remove(savedRecordId);
          if (callback) {
            callback();
          }
        }
        //#2 Post the record
        morel.io.sendSavedRecord(savedRecordId, onSendSuccess, onError);
      };
      //#1 Save the record first
      morel.record.db.save(onSaveSuccess, onError);
    },

    /*
     * Saves the record.
     */
    save: function (callback, onError) {
      var onSaveSuccess = function (savedRecordId) {
        morel.record.clear();

        if (callback) {
          callback();
        }
      };
      morel.record.db.save(onSaveSuccess, onError);
    },

    /**
     * Validates the record inputs.
     */
    validateInputs: function () {
      var invalids = [];

      if (!morel.record.inputs.is('sample:date')) {
        invalids.push({
          'id': 'sample:date',
          'name': 'Date'
        });
      }
      if (!morel.record.inputs.is('sample:entered_sref')) {
        invalids.push({
          'id': 'sample:entered_sref',
          'name': 'Location'
        });
      }
      if (!morel.record.inputs.is('occurrence:taxa_taxon_list_id')) {
        invalids.push({
          'id': 'occurrence:taxa_taxon_list_id',
          'name': 'Species'
        });
      }
      return invalids;
    },

    /**
     * Saves the selected species into current record.
     */
    saveSpecies: function (speciesID) {
      var specie = app.collections.species.find({id:speciesID});
      if (specie.attributes.warehouse_id && specie.attributes.warehouse_id) {
        var name = 'occurrence:taxa_taxon_list_id';
        var value = specie.attributes.warehouse_id;
        morel.record.inputs.set(name, value);

        //add header to the page
        $('#record_heading').text(specie.attributes.common_name);
      }
    },

    saveLocation: function () {
      _log('views.LocationPage: saving location.', app.LOG_DEBUG);
      var sref = location.lat + ', ' + location.lon;
      var sref_system = "4326";
      var sref_accuracy = location.acc;

      morel.geoloc.set(location.lat, location.lon, location.acc);

      morel.record.inputs.set(morel.record.inputs.KEYS.SREF, sref);
      morel.record.inputs.set(morel.record.inputs.KEYS.SREF_SYSTEM, sref_system);
      morel.record.inputs.set(morel.record.inputs.KEYS.SREF_ACCURACY, sref_accuracy);

      return location;
    },

    /**
     * Saves the current date and populates the date input.
     */
    saveDate: function () {
      var now = new Date();
      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);

      var value = now.getFullYear() + "-" + (month) + "-" + (day);
      var name = 'sample:date';

      morel.record.inputs.set(name, value);
    }
  });
})();