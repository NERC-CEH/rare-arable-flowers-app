/******************************************************************************
 * Dialog to get the user contact details.
 *****************************************************************************/
define([
    'jquery',
    'jquery.mobile',
    'helpers/validate',
    'models/user'
], function ($, jqm, validate) {
    var ContactDetailsDialog = function (callback) {
        var personalDetailsButtonID = "personal-details-dialog-button";
        var message =
            '<h3>Your details:</h3>' +

            '<input type="text" class="dark-border" name="user-email" placeholder="Email" data-role="none">' +
            '<input type="text" class="dark-border" name="user-name" placeholder="Name" data-role="none">' +
            '<input type="text" class="dark-border" name="user-surname" placeholder="Surname" data-role="none">' +
            '<button id="' + personalDetailsButtonID + '">Sync</button>';

        app.message(message, 0, true);

        var previousEmail = app.models.user.get('email');
        var previousName = app.models.user.get('name');
        var previousSurname = app.models.user.get('surname');
        if (previousEmail && previousName && previousSurname) {
            $('[name="user-email"]').val(previousEmail);
            $('[name="user-name"]').val(previousName);
            $('[name="user-surname"]').val(previousSurname);
        }

        //button listeners
        //send
        $('#' + personalDetailsButtonID).on('click', function () {
            var email = $('[name="user-email"]').val();
            var name = $('[name="user-name"]').val();
            var surname = $('[name="user-surname"]').val();

            if (validateUserDetails(email, name, surname)) {

                app.models.user.setContactDetails({
                    'email': email,
                    'name': name,
                    'surname': surname
                });

                $.mobile.loading('hide');
                callback(email, name, surname);
            }

            function validateUserDetails (email, name, surname) {
                if (!name || !surname) {
                    return false;
                }
                return validate.email(email);
            }
        });

        //email check
        var $inputEmail = $('[name="user-email"] ');
        $inputEmail.focusout(function () {
            var valid = validate.email($(this).val());
            var $inputBox = $('[name="user-email"]');
            if (!valid) {
                $inputBox.addClass('input-error');
            } else {
                $inputBox.removeClass('input-error');
            }
        });
    };

    return ContactDetailsDialog;
});