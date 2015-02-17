var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.UserPage = app.views.Page.extend({
    id: 'user',

    template: app.templates.user,

    events: {
      'click #sendall-button': 'sendAllSavedRecords',
      'click #send-button': 'sendSavedRecord',
      'click #delete-button': 'deleteSavedRecord',
      'click #logout-button': 'signOut'
    },

    initialize: function () {
      _log('views.UserPage: initialize', app.LOG_DEBUG);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.UserPage: render', app.LOG_DEBUG);

      this.$el.html(this.template());

      $('body').append($(this.el));

      return this;
    },

    update: function () {
      this.printUserControls();
      this.printList();
    },

    sendAllSavedRecords: function () {
      function onSuccess() {
        app.views.userPage.printList();
      }

      morel.io.sendAllSavedRecords(onSuccess);
    },

    sendSavedRecord: function (e) {
      var recordKey = $(e.currentTarget).data('id');

      var onSuccess = null, onError = null;
      if (navigator.onLine) {
        $.mobile.loading('show');

        onSuccess = function () {
          $.mobile.loading('show', {
            text: "Done!",
            theme: "b",
            textVisible: true,
            textonly: true
          });

          setTimeout(function () {
            $.mobile.loading('hide');
          }, 3000);

          morel.record.db.remove(recordKey, function () {
            app.views.userPage.printList();
          });
        };

        onError = function (xhr, ajaxOptions, thrownError) {
          if (!xhr.responseText) {
            xhr.responseText = "Sorry. Some Error Occurred."
          }
          _log("user: ERROR record ajax (" + xhr.status + " " + thrownError + ").", app.LOG_ERROR);
          _log(xhr.responseText, app.LOG_ERROR);

          $.mobile.loading('show', {
            text: xhr.responseText,
            theme: "b",
            textVisible: true,
            textonly: true
          });

          setTimeout(function () {
            $.mobile.loading('hide');
          }, 10000);
        };

        morel.io.sendSavedRecord(recordKey, onSuccess, onError);
      } else {
        $.mobile.loading('show', {
          text: "Looks like you are offline!",
          theme: "b",
          textVisible: true,
          textonly: true
        });

        setTimeout(function () {
          $.mobile.loading('hide');
        }, 3000);
      }
    },

    deleteSavedRecord: function (e) {
      var recordKey = $(e.currentTarget).data('id');
      morel.record.db.remove(recordKey, function () {
        app.views.userPage.printList();
      });
    },

    printUserControls: function () {
      var $logoutButton = $('#logout-button');
      var $loginWarning = $('#login-warning');

      var user = app.models.user.attributes;
      if (user.email){
        //logged in
        $logoutButton.show();
        $loginWarning.hide();
      } else {
        //logged out
        $logoutButton.hide();
        $loginWarning.show();
      }
    },

    printList: function () {
      function onSuccess(savedRecords) {
        var records = [];
        for (var i = 0; i < savedRecords.length; i++) {
          var record = {};
          for (var j = 0; j < savedRecords[i].length; j++) {
            var name = savedRecords[i][j].name;
            var value = savedRecords[i][j].value;
            switch (name) {
              case morel.record.inputs.KEYS.DATE:
                record.date = value;
                break;
              case morel.record.inputs.KEYS.TAXON:
                var species = app.collections.species.models;
                for (var k = 0; k < species.length; k++) {
                  if (species[k].warehouse_id === value) {
                    record.common_name = species[k].common_name;
                    break;
                  }
                }
                break;
              default:
            }
          }
          record.id = savedRecords[i].id;
          records.push(record);
        }

        var placeholder = $('#saved-list-placeholder');

        placeholder.html(app.templates.saved_records({'records': records}));
        placeholder.trigger('create');
      }

      morel.record.db.getAll(onSuccess);
    },

    signOut: function () {
      _log('user: logging out', app.LOG_INFO);
      app.models.user.signOut();
      this.update();
    }

  });
})();
