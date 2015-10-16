<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-delete ui-nodisc-icon
        ui-alt-icon ui-btn-icon-left">Cancel</a>
    </div>
    <h1>Location</h1>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <button id="location-save" class="ui-btn ui-icon-plus ui-nodisc-icon
        ui-alt-icon ui-btn-icon-right">Save</button>
    </div>
</div>
<div data-role="content">
    <div class="info-message" id="location-message" style="display:none"></div>
    <div data-role="tabs" id="location-opts">
        <div data-role="navbar">
            <ul>
                <li><a href="#gps" data-ajax="false" class="gps">GPS</a></li>
                <li><a href="#map" data-ajax="false">Map</a></li>
                <li><a href="#gref" data-ajax="false">Grid Ref</a></li>
                <li><a href="#previous" data-ajax="false">Past</a></li>
            </ul>
        </div>
        <div id="gps" class="ui-body-d ui-content">
            <div id="location-gps-placeholder"></div>
            <button id="gps-button"
                    class="ui-btn ui-btn-inset ui-btn-narrow">Locate</button>
        </div>
        <div id="map" class="ui-body-d ui-content">
            <div class="info-message" id="map-message">
                <p>Please tap on the map to select your location. </p>
            </div>
            <div id="map-canvas"></div>
        </div>
        <div id="gref" class="ui-body-d ui-content">
            <div class="info-message" id="gref-message">
                <p>Please provide a GB Grid Reference.
                    <br/> e.g. <i>"TQ 28170 77103"</i></p>
            </div>
            <input type="text" id="grid-ref" data-role="none" placeholder="Grid Reference"/>
            <input type="text" id="location-name" data-role="none" placeholder="Location Name (optional)"/>
            <button id="grid-ref-set"
                    class="ui-btn ui-btn-inset ui-btn-narrow">Set</button>
        </div>
        <div id="previous" class="ui-body-d ui-content">
            <div class="info-message" id="previous-location-message">
                <p>Please tap on your previous location. </p>
            </div>
            <div id="user-locations"></div>
        </div>
</div>
