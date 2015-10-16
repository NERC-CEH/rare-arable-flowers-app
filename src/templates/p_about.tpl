<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h1 id='about_heading'>About App</h1>
</div>

<div data-role="content">
    <ul data-role="listview">
        <li>
            <p>Rare arable flower records are vital in order to accurately determine their distribution
                and numbers, and to help advise conservation for the species that need it. </p>

            <p>Any records you submit using the <i>Rare Arable Flowers</i> app will be reviewed and
                verified by an expert before being added to our database.</p>

            <p>Thank you for taking part!</p>
        </li>
        <li>
            <strong>Further information</strong>
            <p>For further information about the <i>Rare Arable Flowers</i> app and
                the survey, please visit
                <a href="http://randd.defra.gov.uk/Default.aspx?Menu=Menu&Module=More&Location=None&Completed=0&ProjectID=17322">project page</a>.
            </p>
        </li>
    </ul>
    <ul data-role="listview" class="space-top">
        <li>
            <strong>App Development</strong>
            <p>This app was developed by the BRC mobile development team. For suggestions and feedback
                please do not hesitate to <a href='mailto:apps%40ceh.ac.uk?subject=iRecord%20Dragonflies%20Support%26Feedback&body=%0A%0A%0AVersion%3A%20<%- app.VERSION %>%0ABrowser%3A <%- window.navigator.appVersion %>%0A'>contact us</a>.</p>
        </li>
        <li>
            <p class="app-version">v<%- app.VERSION %></p>
        </li>
    </ul>
</div>