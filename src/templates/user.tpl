<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' data-role="button" data-icon="arrow-l"
           data-iconpos="notext">Back</a>
    </div>
    <h1 id='user_heading'> My Account </h1>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <a href='#user' id="logout-button" data-role="button"
           data-icon="user">Sign out</a>
    </div>
</div>

<div data-role="content">
    <div id="login-warning" class="warning-message">Looks like you have not Signed
        in to your iRecord account yet. Please do so, if you wish to have a full access
        to your submitted records on iRecord.
        <a href='#login' data-role="button" data-icon="arrow-r" data-iconpos="user">Sign
            in</a>
    </div>
    <div id="saved-list-placeholder"></div>
</div>
