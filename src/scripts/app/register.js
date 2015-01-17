(function ($) {
  app.controller = app.controller || {};
  app.controller.register = {
    //controller configuration should be set up in an app config file
    CONF: {
      URL: "",
      TIMEOUT: 20000
    },

    pagecontainershow: function () {
      //enable 'Create account' button on Terms agreement
      $('#terms-agreement').click(function () {
        var button = $('#register-button');
        if ($(this).prop('checked')) {
          button.prop('disabled', false);
        } else {
          button.prop('disabled', true);
        }
      });
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

      //user logins
      var form = document.getElementById('register-form');
      var data = new FormData(form);

      //app logins
      data.append('appname', app.auth.CONF.APPNAME);
      data.append('appsecret', app.auth.CONF.APPSECRET);

      $.ajax({
        url: this.CONF.URL,
        type: 'POST',
        data: data,
        dataType: 'text',
        contentType: false,
        processData: false,
        timeout: this.CONF.TIMEOUT,
        success: this.onLoginSuccess,
        error: this.onLoginError,
        beforeSend: this.onLogin
      });
    },

    onLogin: function () {
      $.mobile.loading('show');
    },

    onLoginSuccess: function (data) {
      _log('register: success.');
      $.mobile.loading('hide');
    },

    onLoginError: function (xhr, ajaxOptions, thrownError) {
      _log("register: ERROR " + xhr.status + " " + thrownError);
      _log(xhr.responseText);
      $.mobile.loading('hide');
    }

  };

}(jQuery));