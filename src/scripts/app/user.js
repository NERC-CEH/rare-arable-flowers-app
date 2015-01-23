(function ($) {
  morel.controller = morel.controller || {};
  morel.controller.user = {
    pagecontainershow: function () {
      this.printUserControls();
      this.printList();
    },

    sendAllSavedRecords: function () {
      function onSuccess() {
        morel.controller.user.printList();
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
            morel.controller.user.printList();
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
        morel.controller.user.printList();
      });
    },

    printUserControls: function () {
      var template = $('#user-template').html();
      var placeholder = $('#user-placeholder');

      var compiled_template = Handlebars.compile(template);

      var user = {
        'loggedout': !morel.controller.login.getLoginState()
      };
      placeholder.html(compiled_template({'user': user}));
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
                var species = morel.data.species;
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

        var template = $('#saved-list-template').html();
        var placeholder = $('#saved-list-placeholder');

        var compiled_template = Handlebars.compile(template);

        placeholder.html(compiled_template({'records': records}));
        placeholder.trigger('create');
      }

      morel.record.db.getAll(onSuccess);
    }
  };

}(jQuery));