/******************************************************************************
 * Login page view.
 *****************************************************************************/
define([
    'views/_page',
    'helpers/validate',
    'templates'
], function (DefaultPage, validate) {
    'use strict';

    var Page = DefaultPage.extend({
        id: 'login',

        template: app.templates.p_login,

        events: {
            'click #login-button': 'login'
        },

        initialize: function () {
            _log('views.LoginPage: initialize', log.DEBUG);

            this.render();
            this.appendEventListeners();
        },

        appendEventListeners: function () {
            this.appendBackButtonListeners();
        },

        render: function () {
            _log('views.LoginPage: render', log.DEBUG);

            this.$el.html(this.template());

            $('body').append($(this.el));
            return this;
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
            _log('views.LoginPage: start.', log.DEBUG);

            if (navigator.onLine) {

                //validate
                var $inputEmail = $('[name="email"] ');
                $inputEmail.focusout(function () {
                    var valid = validate.email($(this).val());
                    var $inputBox = $('[name="email"]');
                    if (!valid) {
                        $inputBox.addClass('input-error');
                    } else {
                        $inputBox.removeClass('input-error');
                    }
                });

                var person = {
                    //user logins
                    'email': this.$el.find('input[name=email]').val(),
                    'password': this.$el.find('input[name=password]').val(),

                    //app logins
                    'appname': app.CONF.morel.appname,
                    'appsecret': app.CONF.morel.appsecret
                };
                this.email = person.email; //save email for successful login

                if (validate.email(person.email)) {
                    switch (app.CONF.LOGIN.STATUS) {
                        case true:
                            this.loginSend(person);
                            break;
                        case false:
                        default:
                            _log('views.LoginPage: unknown feature state', log.WARNING);
                    }
                }
            } else {
                app.message("<h2>You are offline!</h2>");
            }
        },

        /**
         * Sends the login AJAX request.
         * @param form
         * @param person
         */
        loginSend: function (person) {
            $.mobile.loading('show');
            $.ajax({
                url: app.CONF.LOGIN.URL,
                type: 'POST',
                data: person,
                callback_data: person,
                dataType: 'text',
                timeout: app.CONF.LOGIN.TIMEOUT,
                success: this.onLoginSuccess,
                error: this.onLoginError
            });
        },

        /**
         * Simulates the login
         * @param form
         * @param person
         */
        loginSimulate: function () {
            var selection =
                "<h1>Simulate:</h1>" +
                "<button id='simulate-success-button'>Success</button>" +
                "<button id='simulate-failure-button'>Failure</button>" +
                "<button id='simulate-cancel-button'>Cancel</button>";
            app.message(selection, 0);

            var that = this;
            $('#simulate-success-button').on('click', function () {
                var data = "userSecret\nuserName\nuserSurname";
                that.onLoginSuccess(data);
            });
            $('#simulate-failure-button').on('click', function () {
                that.onLoginError({});
            });
            $('#simulate-cancel-button').on('click', function () {
                $.mobile.loading('hide');
            });
        },

        /**
         * Successful login.
         * @param data
         */
        onLoginSuccess: function (data) {
            _log('views.LoginPage: success.', log.DEBUG);
            $.mobile.loading('hide');

            var user = app.views.loginPage.extractUserDetails(data);
            user.email = app.views.loginPage.email;
            app.models.user.signIn(user);

            window.history.back();
        },

        /**
         * Since the server response is not JSON, it gets user details from the response.
         * @param data
         * @returns {*}
         */
        extractUserDetails: function (data) {
            var lines = (data && data.split(/\r\n|\r|\n/g));
            if (lines && lines.length >= 3 && lines[0].length > 0) {
                return {
                    'secret': lines[0],
                    'name': lines[1],
                    'surname': lines[2]
                };
            } else {
                _log('views.LoginPage: problems with received secret.', log.WARNING);
                return null;
            }
        },

        /**
         * On Error.
         * @param xhr
         * @param ajaxOptions
         * @param thrownError
         */
        onLoginError: function (xhr, ajaxOptions, thrownError) {
            switch (xhr.status) {
                case 401:
                    //unauthorised
                    break;
                default:
                    _log("views.LoginPage: " + xhr.status + " " + thrownError + ".", log.ERROR);
            }

            var response = '';
            if (xhr.responseText == "Missing name parameter" || xhr.responseText.indexOf('Bad') >= 0) {
              response = 'Bad Username or Password';
            } else {
                response = xhr.responseText;
            }

            app.message({message: response});
        },

        /**
         * Logs the user out of the system.
         */
        logout: function () {
            morel.auth.removeUser();
        },

        /**
         * Brings the state of the user being logged in.
         * @returns boolean true if the user is logged in, or false if not
         */
        getLoginState: function () {
            return morel.auth.isUser();
        }
    });

    return Page;
});
