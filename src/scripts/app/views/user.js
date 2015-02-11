var app = app || {};
app.views = app.views || {};

(function () {
  'use strict';

  app.views.UserPage = app.views.Page.extend({
    id: 'user',

    template: app.templates.user,

    initialize: function () {
      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
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

    sendSavedRecord: function (recordKey) {
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
          _log("user: ERROR record ajax (" + xhr.status + " " + thrownError + ").");
          _log(xhr.responseText);

          $.mobile.loading('show', {
            text: xhr.responseText.replace(/<br\/>/g, ' '),
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

    deleteSavedRecord: function (recordKey) {
      morel.record.db.remove(recordKey, function () {
        app.views.userPage.printList();
      });
    },

    printUserControls: function () {
      var placeholder = $('#user-placeholder');

      var user = {
        'loggedout': !app.views.loginPage.getLoginState()
      };
      placeholder.html(app.templates.user_profile({'user': user}));
      placeholder.trigger('create');
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
                var species = app.data.species;
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
    }

  });
})();
