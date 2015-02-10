    <div data-role="header" id="list-header" data-position="fixed"
         data-tap-toggle="false">
        <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
            <a href='#' data-rel='back' data-role="button" data-icon="arrow-l"
               data-iconpos="notext">Back</a>
        </div>

        <h1 id='list_heading'></h1>

        <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
            <a href="#list" id="fav-button" data-role="button"
               data-icon="star" data-iconpos="notext">Favourite</a>
            <a href="#list" id="list-controls-button" data-role="button"
               data-icon="bullets" data-iconpos="notext">List Controls</a>
        </div>
        <div id="list-controls-placeholder">
            <div data-role="tabs" id="list-controls-tabs">
                <div data-role="navbar">
                    <ul>
                        <li><a href="#filter" data-ajax="false"
                               class="ui-btn-active">Filter</a></li>
                        <li><a href="#sort" data-ajax="false">Sort</a></li>
                    </ul>
                </div>
                <div id="sort" class="ui-body-d ui-content">
                    <div class="info-message">
                        <p>Please select the list sorting.</p>
                    </div>
                    <div id="list-controls-sort-placeholder"></div>
                </div>
                <div id="filter" class="ui-body-d ui-content">
                    <div class="info-message">
                        <p>Please check filters to apply. </p>
                    </div>
                    <div id="list-controls-filter-placeholder"></div>
                </div>
                <center>
                    <button id="list-controls-save-button">Save</button>
                </center>
            </div>
        </div>
    </div>
    <div data-role="content" id="list-placeholder"></div>