<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' data-role="button" data-icon="arrow-l" data-iconpos="notext">Back</a>
    </div>
    <h1 id='register_heading'>Register</h1>
</div>

<div data-role="content">
    <div class="info-message" style="text-align: left">
        <p>Registering with iRecord is quick and easy and makes submitting
            biological records much easier. It provides you with a means of viewing
            all the records you have submitted and accessing feedback on them,
            as well as allowing you to view others’ records. You can also
            download all of your records here.</p>
    </div>

    <form id="register-form">
        <input type="email" placeholder="Email" name="email" value="" required>
        <input type="text" placeholder="Firstname" name="firstname" value="" required>
        <input type="text" placeholder="Surname" name="secondname" value="" required>
        <input type="password" placeholder="Password" name="password" value="" required>
        <input type="password" placeholder="Confirm password" name="password-confirm" value="" required>
        <br/>

        <a href="#terms" data-role="button" role="button">iRecord Terms and Conditions</a>
        <label>
            <input name="terms-agreement" id="terms-agreement" type="checkbox"> I agree to the iRecord Terms and Conditions
        </label>
    </form>
    <button id="register-button" disabled>Create Account</button>

</div>