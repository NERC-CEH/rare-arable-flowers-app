/******************************************************************************
 * Record model.
 *****************************************************************************/
define([
  'backbone'
], function (Backbone) {
  'use strict';

  var Record = Backbone.Model.extend({
    reset: function (warehouseID) {
      _log('models.Record: reset.', log.DEBUG);

      this.clear();
      this.set(morel.record.inputs.KEYS.DATE, this.getCurrentDate());
      this.set(morel.record.inputs.KEYS.SREF_ACCURACY, '-1');
      this.set(morel.record.inputs.KEYS.SREF_SYSTEM, '4326');
      this.set(morel.record.inputs.KEYS.NUMBER, morel.record.inputs.KEYS.NUMBER_VAL.present);
      warehouseID ? this.set(morel.record.inputs.KEYS.TAXON, warehouseID) : null;
    },

    /**
     * Sends the record.
     */
    send: function (callback, onError) {
      var onSaveSuccess = function (savedRecordId) {
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
      morel.record.db.save(this.attributes, onSaveSuccess, onError);
    },

    /**
     * Saves the record.
     */
    save: function (callback, onError) {
      var onSaveSuccess = function (savedRecordId) {
        morel.record.clear();

        if (callback) {
          callback();
        }
      };
      morel.record.db.save(this.attributes, onSaveSuccess, onError);
    },

    /**
     * Validates the record inputs.
     */
    validate: function (attrs, options) {
      var invalids = [];

      if (!this.has(morel.record.inputs.KEYS.DATE)) {
        invalids.push('Date');
      } else {
        //check if valid date
        var input = this.get(morel.record.inputs.KEYS.DATE);
        var inputDate = new Date(input);
        var currentDate =  new Date();
        if (inputDate > currentDate) {
          invalids.push('Non future Date');
        }
      }

      if (!this.has(morel.record.inputs.KEYS.SREF)) {
        invalids.push('Location');
      }
      if (!this.has(morel.record.inputs.KEYS.TAXON)) {
        invalids.push('Taxon');
      }
      return invalids.length > 0 ? invalids : null;
    },

    /**
     * Saves the current date and populates the date input.
     */
    getCurrentDate: function () {
      var now = new Date();
      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);

      var date = now.getFullYear() + "-" + (month) + "-" + (day);
      return date
    }
  });

  return Record;
});