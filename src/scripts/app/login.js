(function ($) {
  app.controller = app.controller || {};
  app.controller.login = {
    //controller configuration should be set up in an app config file
    CONF: {
      URL: "",
      TIMEOUT: 20000
    },

    pagecontainershow: function () {

    },

    /**
     * Starts an app sign in to the Drupal site process.
     * The sign in endpoint is specified by LOGIN_URL -
     * should be a Drupal sight using iForm Mobile Auth Module.
     *
     * It is important that the app authorises itself providing
     * appname and appsecret for the mentioned module.
     */
    login: function () {
      //todo: add validation

      _log('login: start.');
      var form = jQuery('#login-form');
      var person = {
        //user logins
        'email': form.find('input[name=email]').val(),
        'password': form.find('input[name=password]').val(),

        //app logins
        'appname': app.auth.CONF.APPNAME,
        'appsecret': app.auth.CONF.APPSECRET
      };

      $.ajax({
        url: this.CONF.URL,
        type: 'POST',
        data: person,
        callback_data: person,
        dataType: 'text',
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
      _log('login: success.');

      var lines = (data && data.split(/\r\n|\r|\n/g));
      if (lines && lines.length >= 3 && lines[0].length > 0) {
        var user = {
          'secret': lines[0],
          'name': lines[1] + " " + lines[2],
          'email': this.callback_data.email
        }
      }

      $.mobile.loading('hide');
      app.controller.login.setLogin(user);

      $.mobile.changePage('#user');
      //history does not work in iOS 7.*
      //history.back();
    },

    onLoginError: function (xhr, ajaxOptions, thrownError) {
      _log("login: ERROR " + xhr.status + " " + thrownError + ".");
      _log(xhr.responseText);
      $.mobile.loading('show', {
        text: "Wrong email or password." +
        " Please double-check and try again.",
        theme: "b",
        textVisible: true,
        textonly: true
      });
      setTimeout(function () {
        $.mobile.loading('hide');
      }, 3000);
    },

    /**
     * Logs the user out of the system.
     */
    logout: function () {
      app.auth.removeUser();
    },

    /**
     * Sets the app login state of the user account.
     *
     * Saves the user account details into storage for permanent availability.
     * @param user User object or empty object
     */
    setLogin: function (user) {
      if (!$.isEmptyObject(user)) {
        _log('login: logged in.');
        app.auth.setUser(user);
      } else {
        _log('login: logged out.');
        app.auth.removeUser();
      }
    },

    /**
     * Brings the state of the user being logged in.
     * @returns boolean true if the user is logged in, or false if not
     */
    getLoginState: function () {
      return app.auth.isUser();
    }
  };

}(jQuery));