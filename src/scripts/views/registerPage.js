/******************************************************************************
 * Register page view.
 *****************************************************************************/
define([
  'views/_page',
  'templates'
], function (Page) {
  'use strict';

  var RegisterPage = Page.extend({
    id: 'register',

    template: app.templates.register,

    events: {
      'click #register-button': 'register',
      'change input[type="checkbox"]': 'toggleRegisterButton'
    },

    initialize: function () {
      _log('views.RegisterPage: initialize', log.DEBUG);

      this.render();
      this.appendEventListeners();
    },

    render: function () {
      _log('views.RegisterPage: render', log.DEBUG);

      this.$el.html(this.template());
      $('body').append($(this.el));

      return this;
    },

    appendEventListeners: function () {
      this.appendBackButtonListeners();
    },

    /**
     * Shows/hides the registration submit button.
     *
     * @param e
     */
    toggleRegisterButton: function (e) {
      //enable 'Create account' button on Terms agreement
      var value = $(e.currentTarget).prop('checked');
      this.$registerButton = $('#register-button');
      if (value) {
        this.$registerButton.prop('disabled', false);
      } else {
        this.$registerButton.prop('disabled', true);
      }
    },

    /**
     * Starts an app user registration.
     *
     * The registration endpoint is specified by LOGIN_URL -
     * should be a Drupal sight using iForm Mobile Auth Module.
     *
     * It is important that the app authorises itself providing
     * appname and appsecret for the mentioned module.
     */
    register: function () {
      _log('register: start.');
      if (navigator.onLine) {

        //user logins
        var form = document.getElementById('register-form');
        var data = new FormData(form);

        this.email = this.$el.find('input[name=email]').val(); //save it for future

        //app logins
        data.append('appname', morel.auth.CONF.APPNAME);
        data.append('appsecret', morel.auth.CONF.APPSECRET);

        $.ajax({
          url: app.CONF.LOGIN.URL,
          type: 'POST',
          data: data,
          dataType: 'text',
          contentType: false,
          processData: false,
          timeout: app.CONF.LOGIN.TIMEOUT,
          success: this.onSuccess,
          error: this.onError,
          beforeSend: this.onSend
        });
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

    onSend: function () {
      $.mobile.loading('show');
    },

    onSuccess: function (data) {
      _log('register: success.');
      $.mobile.loading('hide');

      var user = app.views.loginPage.extractUserDetails(data);
      user.email = app.views.registerPage.email;
      app.models.user.signIn(user);

      app.message('<center><h2>Success</h2></center> <br/><h3>A confirmation email sent.</h3>');
      setTimeout(function () {
        window.history.go(-2);
      }, 3000);
    },

    onError: function (xhr, ajaxOptions, thrownError) {
      _log("register: ERROR " +
            xhr.status + " " +
            thrownError + " " +
            xhr.responseText,
        log.ERROR);

      $.mobile.loading('hide');
      app.message('<center><h2>Error</h2></center>' +
      '<br/>' + xhr.responseText);
    }

  });

  return RegisterPage;
});
