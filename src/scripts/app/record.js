var app = app || {};
app.controller = app.controller || {};

(function ($) {
    app.controller.record = {
    /**
     * Setting up a recording page.
     */
    pagecreate: function () {
      _log('record: pagecreate.');

      //set button event handlers
      var ele = document.getElementById('occAttr:223');
      $(ele).change(function () {
        var checked = $(this).prop('checked');
        morel.record.inputs.set('occAttr:223', checked);
      });
    },

    pagecontainershow: function (e, data) {
      _log('record: pagecontainershow.');

      var prevPageId = data.prevPage[0].id;
      switch (prevPageId) {
        case 'list':
          this.clear();
          //start geolocation
        function onGeolocSuccess(location) {
          app.controller.record.saveSref(location);
          app.controller.sref.set(location.lat, location.lon, location.acc);
          app.controller.record.gpsButtonState('done');
        }

        function onError(err) {
          $.mobile.loading('show', {
            text: "Sorry! " + err.message + '.',
            theme: "b",
            textVisible: true,
            textonly: true
          });
          setTimeout(function () {
            $.mobile.loading('hide');
          }, 5000);

          //modify the UI
          app.controller.record.gpsButtonState('none');
        }

          morel.geoloc.run(null, onGeolocSuccess);
          this.gpsButtonState('running');

          break;
        default:
          //update GPS button color
          if (morel.record.inputs.is('sample:entered_sref')) {
            this.gpsButtonState('done');
          } else {
            this.gpsButtonState('none');
          }
      }
    },

    /**
     * Clears the recording page from existing inputs.
     */
    clear: function () {
      _log('record: clearing recording page.');
      this.setImage('input[type="file"]');

      morel.record.clear();

      this.saveSpecies();
      this.saveDate();
    },

    /*
     * Validates and sends the record. Saves it if no network.
     */
    send: function () {
      var onOnlineSuccess = null, onSaveSuccess = null;
      $.mobile.loading('show');

      if (!this.valid()) {
        $.mobile.loading('hide');
        return;
      }

      function onError(err) {
        $.mobile.loading('hide');
        var message = "<center><h3>Sorry!</h3></center>" +
          "<p>" + err.message + "</p>";
        app.navigation.makePopup(message, true);
        $('#app-popup').popup().popup('open');
      }

      if (navigator.onLine) {
        //online
        onOnlineSuccess = function () {
          $.mobile.loading('hide');
          app.navigation.popup("<center><h2>Submitted successfully. </br>Thank You!</h2></center>", false);
          setTimeout(function () {
            $("body").pagecontainer("change", "#list");
          }, 3000);
        };

        this.processOnline(onOnlineSuccess, onError);
      } else {
        //offline
        onSaveSuccess = function () {
          $.mobile.loading('hide');
          app.navigation.popup("<center><h2>No Internet. Record saved.</h2></center>", false);
          setTimeout(function () {
            $("body").pagecontainer("change", "#list");
          }, 3000);
        };

        this.processOffline(onSaveSuccess, onError);
      }
    },

    /*
     * Validates and saves the record.
     */
    save: function () {
      $.mobile.loading('show');

      if (!this.valid()) {
        $.mobile.loading('hide');
        return;
      }

      function onSuccess() {
        $.mobile.loading('hide');
        app.navigation.popup("<center><h2>Record saved.</h2></center>", false);
        setTimeout(function () {
          $("body").pagecontainer("change", "#list");
        }, 3000);
      }

      function onError(err) {
        $.mobile.loading('hide');
        var message = "<center><h3>Sorry!</h3></center>" +
          "<p>" + err.message + "</p>";
        //xhr.status+ " " + thrownError + "</p><p>" + xhr.responseText +
        app.navigation.makePopup(message, true);
        $('#app-popup').popup().popup('open');
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
        app.navigation.popup(message, true);
        return morel.FALSE;
      }

      //validate gps
      var gps = morel.geoloc.valid();
      if (gps === morel.ERROR || gps === morel.FALSE) {
        //redirect to gps page
        $('body').pagecontainer("change", "#sref");
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

    saveSref: function (location) {
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
    saveSpecies: function () {
      var specie = app.controller.list.getCurrentSpecies();
      if (specie && specie.warehouse_id && specie.warehouse_id) {
        var name = 'occurrence:taxa_taxon_list_id';
        var value = specie.warehouse_id;
        morel.record.inputs.set(name, value);

        //add header to the page
        $('#record_heading').text(specie.common_name);
      } else {
        _log('record: ERROR no species was found. Nothing attached to the recording.');
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
      var button = $('#sref-top-button');
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
  };

}(jQuery));