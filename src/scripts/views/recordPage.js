/******************************************************************************
 * Record page view.
 *****************************************************************************/
define([
  'views/_page',
  'views/contactDetailsDialog',
  'templates',
  'morel',
  'conf'
], function(Page, contactDetailsDialog) {
  'use strict';

  var RecordPage = Page.extend({
    id: 'record',

    template: app.templates.record,

    events: {
      'click #entry-form-save': 'save',
      'click #entry-form-send': 'send',
      'change input[type="checkbox"]': 'saveCertain',
      'click #photo': function(event) {
          $('input[type="file"]').trigger('click');
      }
    },

    initialize: function () {
      _log('views.RecordPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
      this.trip();
    },

    render: function () {
      _log('views.RecordPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      this.$heading = $('#record_heading');
      this.$photo = $('#photo');
      this.$locationButton = $('#location-top-button');
      this.$dateButton = $('#date-top-button');
      return this;
    },

    update: function (prevPageId, speciesID) {
      _log('views.RecordPage: update.', log.DEBUG);
      switch (prevPageId) {
        case 'list':
        case 'species':
          this.initRecording(speciesID);
          break;
        case '':
          _log('views.RecordPage: coming from unknown page.', log.WARNING);
          this.initRecording(speciesID);
        default:
      }
    },

    appendEventListeners: function () {
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.NUMBER, this.updateNumberButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.STAGE, this.updateStageButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.LOCATIONDETAILS, this.updateLocationdetailsButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.COMMENT, this.updateCommentButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.SREF_ACCURACY, this.updateGPSButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.SREF, this.updateGPSButton);
      this.listenTo(this.model,
        'change:' + morel.record.inputs.KEYS.DATE, this.updateDateButton);

      this.appendBackButtonListeners();
    },

    /**
     * Initialises the recording form: sets empty image, clears geolocation etc.
     */
    initRecording: function (speciesID) {
      var specie = app.collections.species.find({id:speciesID});
      this.model.reset(specie.attributes.warehouse_id);

      //add header to the page
      var significant = specie.attributes.common_name_significant;
      var common = specie.attributes.common_name;
      var name = ( (significant ? significant + ', ' : '') + common );
      this.$heading.text(name);
      this.resetButtons();

      //start geolocation
      this.runGeoloc();

      this.setImage('input[type="file"]');
    },

    /**
     * Runs geolocation service in the background and updates the record on success.
     */
    runGeoloc: function () {
      function onGeolocSuccess(location) {
        _log('views.RecordPage: saving location.', log.DEBUG);
        morel.geoloc.set(location.lat, location.lon, location.acc);

        var sref = location.lat + ', ' + location.lon;
        app.views.recordPage.model.set(morel.record.inputs.KEYS.SREF, sref);
        app.views.recordPage.model.set(morel.record.inputs.KEYS.SREF_ACCURACY, location.acc);
      }
      function onError(err) {
        //modify the UI
        app.views.recordPage.model.set(morel.record.inputs.KEYS.SREF_ACCURACY, -1); //stopped
      }
      morel.geoloc.run(null, onGeolocSuccess, onError);
      this.model.set(morel.record.inputs.KEYS.SREF_ACCURACY, 0); //running
    },

    /**
     * Submits the record.
     */
    send: function () {
      _log('views.RecordPage: sending record.', log.DEBUG);

      $.mobile.loading('show');

      if (!this.valid()) {
        return;
      }

      if (navigator.onLine) {
        //online
        var onSendSuccess = function () {
          app.message("<center><h2>Submitted successfully.</h2></center>" +
          " </br><h3>Thank You!</h3>");

          setTimeout(function () {
            Backbone.history.navigate('list', {trigger:true});
          }, 2000);
        };

        switch (app.CONF.SEND_RECORD.STATUS) {
          case true:
            if (app.models.user.hasSignIn()) {
              app.models.record.send(onSendSuccess, onError);
            } else {
              contactDetailsDialog(function() {
                $.mobile.loading('show');
                app.models.record.send(onSendSuccess, onError);
              });
            }
            break;
          case 'simulate':
            this.sendSimulate(onSendSuccess, onError);
            break;
          case false:
          default:
            _log('views.RecordPage: unknown feature state', log.WARNING);
        }

      } else {
        //offline
        var onSaveSuccess = function () {
          app.views.listPage.updateUserPageButton();

          app.message("<center><h2>No Internet.</h2></center>" +
          "<br/><h3> Record saved.</h3>");
          setTimeout(function () {
            Backbone.history.navigate('list', {trigger:true});
          }, 2000);
        };
        app.models.record.save(onSaveSuccess, onError);
      }

      function onError(err) {
        app.views.listPage.updateUserPageButton();

        var message = "<center><h2>Error</h2></center>" +
          "<p>" + err.message + "</p>" +
          "<h3> Record Saved </h3>";
        app.message(message);
        setTimeout(function () {
          Backbone.history.navigate('list', {trigger:true});
        }, 2000);
      }
    },

    /**
     * Simulates the login
     * @param form
     * @param person
     */
    sendSimulate: function (onSendSuccess, onError) {
      var selection =
        "<h1>Simulate:</h1>" +
        "<button id='simulate-success-button'>Success</button>" +
        "<button id='simulate-failure-button'>Failure</button>" +
        "<button id='simulate-cancel-button'>Cancel</button>";
      app.message(selection, 0);

      var that = this;
      $('#simulate-success-button').on('click', function () {
        onSendSuccess();
      });
      $('#simulate-failure-button').on('click', function () {
        app.models.record.save(function () {
          onError({message: 'Some Error Message.'});
        }, null);
      });
      $('#simulate-cancel-button').on('click', function () {
        $.mobile.loading('hide');
      });
    },

    /**
     * Saves the record.
     */
    save: function () {
      _log('views.RecordPage: saving record.', log.DEBUG);
      $.mobile.loading('show');

      if (!this.valid()) {
        return;
      }

      function onSuccess() {
        app.views.listPage.updateUserPageButton();

        app.message("<center><h2>Record saved.</h2></center>");
        setTimeout(function () {
          Backbone.history.navigate('list', {trigger:true});
        }, 2000);
      }

      function onError(err) {
        var message = "<center><h2>Error</h2></center>" +
          "<p>" + err.message + "</p>";
        app.message(message);
      }

      app.models.record.save(onSuccess, onError);
    },

    /**
     * Sets the user selected species image as a background of the image picker.
     *
     * @param input
     * @returns {boolean}
     */
    setImage: function (input) {
      var img_holder = 'sample-image-placeholder';
      var upload = $(input);

      if (!window.FileReader) {
        return false;
      }

      $('#' + img_holder).remove();
      this.$photo.append('<div id="' + img_holder + '"></div>');

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

    /**
     * Validates the record and GPS lock.
     *
     * @returns {*}
     */
    valid: function () {
      //validate gps
      var gps = morel.geoloc.valid();
      if (gps === morel.ERROR || gps === morel.FALSE) {
        //redirect to gps page
        Backbone.history.navigate('location', {trigger:true});
        return morel.FALSE;
      }

      //validate the rest
      var invalids = app.models.record.validate();
      if (invalids) {
        var message =
          "<h2>Still missing:</h2><ul>";

        for (var i = 0; i < invalids.length; i++) {
          message += "<li>" + invalids[i] + "</li>";
        }

        message += "</ul>";
        app.message(message);
        return morel.FALSE;
      }

      return morel.TRUE;
    },

    /**
     * Udates the GPS button with the traffic light indication showing GPS status.
     */
    updateGPSButton: function () {
      var $button = jQuery('#location-top-button .descript');
      var text = '';

      var button = this.$locationButton;
      var accuracy = this.model.get(morel.record.inputs.KEYS.SREF_ACCURACY);
      switch (true) {
        case (accuracy == -1 || accuracy === 'undefined'):
          //none
          button.addClass('none');
          button.removeClass('done');
          button.removeClass('running');

          text = 'Required';
          break;
        case (accuracy > 0):
          //done
          button.addClass('done');
          button.removeClass('running');
          button.removeClass('none');

          var value = this.model.get(morel.record.inputs.KEYS.SREF);
          var location = {
            latitude: value.split(',')[0],
            longitude: value.split(',')[1]
          };
          var p = new LatLon(location.latitude, location.longitude, LatLon.datum.WGS84);
          var grid = OsGridRef.latLonToOsGrid(p);
          text =  grid.toString();
          break;
        case (accuracy == 0):
          //running
          button.addClass('running');
          button.removeClass('done');
          button.removeClass('none');

          text = 'Locating..';
          break;
        default:
          _log('views.RecordPage: ERROR no such GPS button state: ' + accuracy, log.WARNING);
      }

      $button.html(text);
    },

    updateDateButton: function () {
      var $dateButton = jQuery('#date-top-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.DATE);
      var text = value || '';
      $dateButton.html(text);
    },

    /**
     * Resets the record page buttons to initial state.
     */
    resetButtons: function () {
      this.updateNumberButton();
      this.updateStageButton();
      this.updateLocationdetailsButton();
      this.updateCommentButton();
    },

    /**
     * Updates the button info text.
     */
    updateNumberButton: function () {
      var $numberButton = jQuery('#number-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.NUMBER);
      var text = '';
      var keys = Object.keys(morel.record.inputs.KEYS.NUMBER_VAL);
      for (var i = 0; i < keys.length; i++){
        if (morel.record.inputs.KEYS.NUMBER_VAL[keys[i]] === value) {
          text = keys[i];
          break;
        }
      }
      $numberButton.html(text);
    },

    /**
     * Updates the button info text.
     */
    updateStageButton: function () {
      var $stageButton = jQuery('#stage-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.STAGE);
      var text = '';
      var keys = Object.keys(morel.record.inputs.KEYS.STAGE_VAL);
      for (var i = 0; i < keys.length; i++){
        if (morel.record.inputs.KEYS.STAGE_VAL[keys[i]] === value) {
          text = keys[i];
          break;
        }
      }
      $stageButton.html(text);
    },

    /**
     * Updates the button info text.
     */
    updateLocationdetailsButton: function () {
      var $locationdetailsButton = jQuery('#locationdetails-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.LOCATIONDETAILS);
      var text = '';
      var keys = Object.keys(morel.record.inputs.KEYS.LOCATIONDETAILS_VAL);
      for (var i = 0; i < keys.length; i++){
        if (morel.record.inputs.KEYS.LOCATIONDETAILS_VAL[keys[i]] === value) {
          text = keys[i];
          break;
        }
      }
      $locationdetailsButton.html(text);
    },

    /**
     * Updates the button info text.
     */
    updateCommentButton: function () {
      var $commentButton = jQuery('#comment-button .descript');
      var value = this.model.get(morel.record.inputs.KEYS.COMMENT);
      var ellipsis = value && value.length > 20 ? '...' : '';
      value = value ? value.substring(0, 20) + ellipsis : ''; //cut it down a bit
      $commentButton.html(value);
    },

    /**
     * Shows the user around the page.
     */
    trip: function () {
      var finishedTrips = app.models.user.get('trips') || [];
      if (finishedTrips.indexOf('record') < 0) {
        finishedTrips.push('record');
        app.models.user.set('trips', finishedTrips);
        app.models.user.save();

        setTimeout(function(){
          trip.start();
        }, 500);
      }

      var options = {
        delay : 1500
      };

      var trip = new Trip([
        {
          sel : $('#photo-picker'),
          position : "s",
          content : 'Snap a picture',
          animation: 'fadeIn'
        },
        {
          sel : $('#number-button'),
          position : "s",
          content : 'Fill in the details',
          animation: 'fadeIn'
        },
        {
          sel : $('#entry-form-send'),
          position : "n",
          content : 'Send a record',
          animation: 'fadeIn'
        },
        {
          sel : $('#entry-form-save'),
          position : "n",
          content : 'Or save it',
          animation: 'fadeIn'
        }
      ], options);
    }
  });

  return RecordPage;
});

