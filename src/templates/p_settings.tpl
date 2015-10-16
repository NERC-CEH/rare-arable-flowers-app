<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h1> Settings </h1>
    <div class="ui-btn-right" data-role="controlgroup" data-type="horizontal">
        <button id="login-button"
                class="ui-btn ui-icon-user ui-alt-icon ui-nodisc-icon ui-btn-icon-right">
            Sign in
        </button>
    </div>
</div>

<div data-role="content">
    <div class="info-message">
        <p>You can set your default location that is used in species list filtering.</p>
    </div>

    <ul data-role="listview" class="ui-nodisc-icon ui-alt-icon">
        <li>
            <a href="#location/settings" id="settings-location-button"
               class="ui-icon-location">
                <h3 class="heading">Location</h3>
                <p class="descript"></p>
            </a>
        </li>
    </ul>

    <div class="info-message">
        <p>The records are auto synchronized with iRecord database. If you would
            like to turn it off and synchronize upon request then uncheck this box.</p>
    </div>
    <label>
        <input id="autosync-button" type="checkbox"
               data-iconpos="right" checked> Autosync
    </label>

    <button id="reset-app-button" style="width: 94%;"
            class="ui-btn ui-alt-icon ui-nodisc-icon ui-icon-back ui-btn-icon-right ui-btn-text-left">Reset instruction screens</button>
</div>
