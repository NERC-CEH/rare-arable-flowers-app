/******************************************************************************
 * User page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates',
  'latlon'
], function (Page) {
  'use strict';

  var UserPage = Page.extend({
    id: 'user',

    template: app.templates.user,

    events: {
      'click #sendall-button': 'sendAllSavedRecords',
      'click #send-button': 'sendSavedRecord',
      'click #delete-button': 'deleteSavedRecord',
      'click #logout-button': 'signOut'
    },

    initialize: function () {
      _log('views.UserPage: initialize', log.DEBUG);

      this.listenTo(app.models.user, 'change:email', this.update);

      this.render();
      this.appendBackButtonListeners();
    },

    render: function () {
      _log('views.UserPage: render', log.DEBUG);

      this.$el.html(this.template());

      $('body').append($(this.el));

      return this;
    },

    update: function () {
      this.printUserControls();
      this.printList();
    },

    /**
     * Recursively sends all the saved user records.
     */
    sendAllSavedRecords: function () {
      $.mobile.loading('show');

      function onSuccess() {
        app.views.userPage.printList();
      }

      function onSuccessAll() {
        $.mobile.loading('hide');
        app.views.listPage.updateUserPageButton();
      }
      morel.io.sendAllSavedRecords(onSuccess, onSuccessAll);
    },

    /**
     * Sends the saves user record.
     *
     * @param e Event of an element that contains the ID of the saved record as
     * data attribute.
     */
    sendSavedRecord: function (e) {
      var recordKey = $(e.currentTarget).data('id');

      var onSuccess = null, onError = null;
      if (navigator.onLine) {
        $.mobile.loading('show');

        onSuccess = function () {
          //for some reason need a timeout
          setTimeout(function () {
            app.views.listPage.updateUserPageButton();
          }, 100);

          app.message("<center><h2>Done</h2></center>");

          morel.record.db.remove(recordKey, function () {
            app.views.userPage.printList();
          });
        };

        onError = function (error) {
          _log(error, log.ERROR);

          var message =
            "<center><h2>Error</h2></center> <br/>" +
            error.message || '<h3>Some problem occurred </h3>';

          app.message(message);
        };

        morel.io.sendSavedRecord(recordKey, onSuccess, onError);
      } else {
        app.message("<center><h2>Sorry</h2></center>" +
        "<br/><h3>Looks like you are offline!</h3>");
      }
    },

    /**
     * Deletes the saves user record.
     *
     * @param e Event of an element that contains the ID of the saved record as
     * data attribute.
     */
    deleteSavedRecord: function (e) {
      var recordKey = $(e.currentTarget).data('id');
      morel.record.db.remove(recordKey, function () {
        app.views.listPage.updateUserPageButton();

        app.views.userPage.printList();
      });
    },

    /**
     * Renders the user login information.
     */
    printUserControls: function () {
      var $logoutButton = $('#logout-button');
      var $loginWarning = $('#login-warning');

      var user = app.models.user.attributes;
      if (user.email){
        //logged in
        $('#user_heading').html(user.name);

        $logoutButton.show();
        $loginWarning.hide();
      } else {
        //logged out
        $('#user_heading').html('My Account');

        $logoutButton.hide();
        $loginWarning.show();
      }
    },

    /**
     * Renders the list of the saved records.
     */
    printList: function () {
      function onSuccess(savedRecords) {
        var records = [];
        var savedRecordIDs = Object.keys(savedRecords);
        for (var i = 0, length = savedRecordIDs.length; i < length; i++) {
          var record = {};
          record.id = savedRecordIDs[i];

          var inputKeys = Object.keys(savedRecords[record.id]);
          for (var j = 0, inputsLength = inputKeys.length; j < inputsLength; j++) {
            var name = inputKeys[j];
            var value = savedRecords[record.id][inputKeys[j]];
            switch (name) {
              case morel.record.inputs.KEYS.DATE:
                record.date = value;
                break;
              case morel.record.inputs.KEYS.TAXON:
                var specie = app.collections.species.find(function(model) {
                  return model.get('warehouse_id') == value;
                });
                record.common_name = specie ? specie.attributes.common_name : '';
                break;
              default:
            }
          }
          records.push(record);
        }

        var placeholder = $('#saved-list-placeholder');

        placeholder.html(app.templates.saved_records({'records': records}));
        placeholder.trigger('create');
      }

      morel.record.db.getAll(onSuccess);
    },

    /**
     * Signs the user out.
     */
    signOut: function () {
      _log('user: logging out', log.DEBUG);
      app.models.user.signOut();
      this.update();
    }

  });

  return UserPage;
});
