var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.RecordPage = app.views.Page.extend({
    id: 'record',

    template: app.templates.record,

    events: {
      'click #entry-form-save': 'save',
      'click #entry-form-send': 'send'
    },

    initialize: function () {
      _log('views.RecordPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.RecordPage: render', app.LOG_DEBUG);

      this.$el.html(this.template());

      //set button event handlers
      var ele = document.getElementById('occAttr:223');
      $(ele).change(function () {
        var checked = $(this).prop('checked');
        morel.record.inputs.set('occAttr:223', checked);
      });

      $('body').append($(this.el));
      return this;
    },

    update: function (prevPageId, speciesID) {
      _log('record: show.');
      switch (prevPageId) {
        case 'list':
          this.initRecording(speciesID);
          break;
        case 'location':
          //update GPS button color
          if (morel.record.inputs.is('sample:entered_sref')) {
            this.gpsButtonState('done');
          } else {
            this.gpsButtonState('none');
          }
          break;
        default:
          _log('record: coming from unknown page.', app.LOG_WARNING);
          this.initRecording(speciesID);
      }
    },

    /**
     * Initialises the recording form: sets empty image, clears geolocation etc.
     */
    initRecording: function (speciesID) {
      this.clear(speciesID);
      //start geolocation
      function onGeolocSuccess(location) {
        app.views.recordPage.saveLocation(location);
        app.models.user.set('location', {
            'lat': location.lat,
            'lon': location.lon,
            'acc': location.acc
        });
        app.views.recordPage.gpsButtonState('done');
      }

      function onError(err) {
        //modify the UI
        app.views.recordPage.gpsButtonState('none');
      }

      morel.geoloc.run(null, onGeolocSuccess, onError);
      this.gpsButtonState('running');
    },

    /**
     * Clears the recording page from existing inputs.
     */
    clear: function (speciesID) {
      _log('record: clearing recording page.');
      this.setImage('input[type="file"]');

      morel.record.clear(speciesID);

      this.saveSpecies(speciesID);
      this.saveDate();
    },

    /*
     * Validates and sends the record. Saves it if no network.
     */
    send: function () {
      _log('views.RecordPage: sending record.', app.LOG_INFO);

      var onOnlineSuccess = null, onSaveSuccess = null;
      $.mobile.loading('show');

      if (!this.valid()) {
        return;
      }

      function onError(err) {
        $.mobile.loading('hide');
        var message = "<center><h3>Sorry!</h3></center>" +
          "<p>" + err.message + "</p>";
        app.message(message);
      }

      if (navigator.onLine) {
        //online
        onOnlineSuccess = function () {
          $.mobile.loading('hide');
          app.message("<center><h2>Submitted successfully. </br>Thank You!</h2></center>");
          setTimeout(function () {
            Backbone.history.navigate('list', {trigger:true});
          }, 3000);
        };

        this.processOnline(onOnlineSuccess, onError);
      } else {
        //offline
        onSaveSuccess = function () {
          $.mobile.loading('hide');
          app.message("<center><h2>No Internet. Record saved.</h2></center>");
          setTimeout(function () {
            Backbone.history.navigate('list', {trigger:true});
          }, 3000);
        };

        this.processOffline(onSaveSuccess, onError);
      }
    },

    /*
     * Validates and saves the record.
     */
    save: function () {
      _log('views.RecordPage: saving record.', app.LOG_INFO);
      $.mobile.loading('show');

      if (!this.valid()) {
        return;
      }

      function onSuccess() {
        $.mobile.loading('hide');
        app.message("<center><h2>Record saved.</h2></center>");
        setTimeout(function () {
          Backbone.history.navigate('list', {trigger:true});
        }, 3000);
      }

      function onError(err) {
        $.mobile.loading('hide');
        var message = "<center><h3>Sorry!</h3></center>" +
          "<p>" + err.message + "</p>";
        app.message(message);
      }

      this.processOffline(onSuccess, onError);
    },

    /**
     * Saves and submits the record.
     */
    processOnline: function (callback, onError) {
      _log("record: process online.");
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

    /**
     * Saves the record.
     */
    processOffline: function (callback, onError) {
      _log("record: process offline");
      var onSaveSuccess = function (savedRecordId) {
        morel.record.clear();

        if (callback) {
          callback();
        }
      };
      morel.record.db.save(onSaveSuccess, onError);
    },

    /**
     * Validates the record and GPS lock. If not valid then
     * takes some action - popup/gps page redirect.
     * @returns {*}
     */
    valid: function () {
      //validate record
      var invalids = this.validateInputs();
      if (invalids.length > 0) {
        var message =
          "<br/> <p>The following is still missing:</p><ul>";

        for (var i = 0; i < invalids.length; i++) {
          message += "<li>" + invalids[i].name + "</li>";
        }

        message += "</ul>";
        app.message(message);
        return morel.FALSE;
      }

      //validate gps
      var gps = morel.geoloc.valid();
      if (gps === morel.ERROR || gps === morel.FALSE) {
        //redirect to gps page
        Backbone.history.navigate('location', {trigger:true});
        return morel.FALSE;
      }
      return morel.TRUE;
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

    saveLocation: function (location) {
      if (!location) {
        return morel.ERROR;
      }
      var sref = location.lat + ', ' + location.lon;
      var sref_system = "4326";
      var sref_accuracy = location.acc;
      morel.record.inputs.set(morel.record.inputs.KEYS.SREF, sref);
      morel.record.inputs.set(morel.record.inputs.KEYS.SREF_SYSTEM, sref_system);
      morel.record.inputs.set(morel.record.inputs.KEYS.SREF_ACCURACY, sref_accuracy);
    },

    /**
     * Saves the user comment into current record.
     */
    saveInput: function (name) {
      if (!name && name === "") {
        _log('record: ERROR, no input name provided.');
        return morel.ERROR;
      }
      var ele = document.getElementById(name);
      var value = $(ele).val();
      if (value !== "") {
        morel.record.inputs.set(name, value);
      }
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

    /**
     * Saves the current date and populates the date input.
     */
    saveDate: function () {
      var now = new Date();
      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);

      var value = now.getFullYear() + "-" + (month) + "-" + (day);
      var name = 'sample:date';

      var ele = document.getElementById(name);
      $(ele).val(value);

      morel.record.inputs.set(name, value);
    },

    setImage: function (input) {
      var img_holder = 'sample-image-placeholder';
      var upload = $(input);

      if (!window.FileReader) {
        return false;
      }

      $('#' + img_holder).remove();
      $('#photo').append('<div id="' + img_holder + '"></div>');

      $('#sample-image-placeholder').on('click', function () {
        $('input[type="file"]').click();
      });

      upload.change(function (e) {
        e.preventDefault();
        var file = this.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
          var img = new Image();
          img.src = event.target.result;
          // note: no onload required since we've got the dataurl...I think! :)
          if (img.width > 560) { // holder width
            img.width = 560;
          }
          $('#sample-image-placeholder').empty().append(img);
          var pic = $('#' + img_holder);
          pic.css('border', '0px');
          pic.css('background-image', 'none');
        };
        reader.readAsDataURL(file);

        return false;
      });
    },

    gpsButtonState: function (state) {
      var button = $('#location-top-button');
      switch (state) {
        case 'running':
          button.addClass('running');
          button.removeClass('done');
          button.removeClass('none');
          break;
        case 'done':
          button.addClass('done');
          button.removeClass('running');
          button.removeClass('none');
          break;
        case 'none':
          button.addClass('none');
          button.removeClass('done');
          button.removeClass('running');
          break;
        default:
          _log('record: ERROR no such GPS button state.');
      }
    }
  });

})();

