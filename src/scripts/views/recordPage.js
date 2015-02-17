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
      $('body').append($(this.el));
      return this;
    },

    update: function (prevPageId, speciesID) {
      _log('views.RecordPage: show.');
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
        case '':
          _log('views.RecordPage: coming from unknown page.', app.LOG_WARNING);
          this.initRecording(speciesID);
        default:
      }
    },

    /**
     * Initialises the recording form: sets empty image, clears geolocation etc.
     */
    initRecording: function (speciesID) {
      app.models.record = new app.models.Record(speciesID);

      //start geolocation
      function onGeolocSuccess(location) {
        app.models.record.saveLocation(location);
        app.views.recordPage.gpsButtonState('done');
      }
      function onError(err) {
        //modify the UI
        app.views.recordPage.gpsButtonState('none');
      }
      morel.geoloc.run(null, onGeolocSuccess, onError);

      this.gpsButtonState('running');
      this.setImage('input[type="file"]');
    },

    send: function () {
      _log('views.RecordPage: sending record.', app.LOG_INFO);

      $.mobile.loading('show');

      if (!this.valid()) {
        return;
      }

      if (navigator.onLine) {
        //online
        var onSendSuccess = function () {
          app.message("<center><h2>Submitted successfully. </br>Thank You!</h2></center>");
          setTimeout(function () {
            Backbone.history.navigate('list', {trigger:true});
          }, 3000);
        };
        app.models.record.send(onSendSuccess, onError);

      } else {
        //offline
        var onSaveSuccess = function () {
          app.message("<center><h2>No Internet. Record saved.</h2></center>");
          setTimeout(function () {
            Backbone.history.navigate('list', {trigger:true});
          }, 3000);
        };
        app.models.record.save(onSaveSuccess, onError);
      }

      function onError(err) {
        var message = "<center><h3>Sorry!</h3></center>" +
          "<p>" + err.message + "</p>" +
          "<p> Record Saved </p>";
        app.message(message);
        setTimeout(function () {
          Backbone.history.navigate('list', {trigger:true});
        }, 3000);
      }
    },

    save: function () {
      _log('views.RecordPage: saving record.', app.LOG_INFO);
      $.mobile.loading('show');

      if (!this.valid()) {
        return;
      }

      function onSuccess() {
        app.message("<center><h2>Record saved.</h2></center>");
        setTimeout(function () {
          Backbone.history.navigate('list', {trigger:true});
        }, 3000);
      }

      function onError(err) {
        var message = "<center><h3>Sorry!</h3></center>" +
          "<p>" + err.message + "</p>";
        app.message(message);
      }

      app.models.record.save(onSuccess, onError);
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
      var invalids = app.models.record.validateInputs();
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

      return morel.TRUE;
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
          _log('views.RecordPage: ERROR no such GPS button state.');
      }
    }
  });

})();

