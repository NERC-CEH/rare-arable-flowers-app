    <div data-role="header" data-position="fixed" data-tap-toggle="false">
        <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
            <a href='#' data-rel="back" data-role="button"
               data-icon="delete">Cancel</a>
        </div>
        <h1>Location</h1>

        <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
            <button id="location-save" data-icon="star">Save</button>
        </div>
    </div>
    <div data-role="content">
        <div data-role="tabs" id="location-opts">
            <div data-role="navbar">
                <ul>
                    <li><a href="#gps" data-ajax="false" class="ui-btn-active">GPS</a></li>
                    <li><a href="#map" data-ajax="false">Map</a></li>
                    <li><a href="#gref" data-ajax="false">Grid Ref</a></li>
                </ul>
            </div>
            <div id="gps" class="ui-body-d ui-content">
                <div id="location-gps-placeholder"></div>
            </div>
            <div id="map" class="ui-body-d ui-content">
                <div class="info-message" id="map-message">
                    <p>Please tap on the map to select your location. </p>
                </div>
                <div id="map-canvas" style="width:100%; height: 60vh;"></div>
            </div>
            <div id="gref" class="ui-body-d ui-content">
                <div class="info-message" id="gref-message">
                    <p>Please provide a GB Grid Reference.
                        <br/> e.g. <i>"TQ 28170 77103"</i></p>
                </div>
                <input type="text" id="grid-ref" placeholder="Grid Reference"/>
                <input type="button" id="grid-ref-set" value="Set"/>
            </div>
        </div>
    </div>
