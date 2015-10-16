<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h3 id='record_heading'>Record</h3>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <button id="entry-form-save" class="ui-btn ui-btn-b ui-icon-plus ui-nodisc-icon
        ui-btn-icon-right">Save</button>
    </div>
</div>
<div data-role="content">
    <div class="core-inputs">
        <h3 id='record_species'></h3>
        <div class="img-picker">
            <input class="img-picker-file" type="file" accept="image/*" data-role="none"/>
            <div class="img-picker-display"></div>
        </div>
        <ul data-role="listview" class="core-inputs ui-nodisc-icon ui-alt-icon space-top">
            <li>
                <a href="#location" id="location-button"
                   class="record-button ui-icon-location">
                <h3 class="heading">Location</h3>
                    <p class="descript"></p>
                </a>
            </li>
            <li>
                <a href="#date" id="date-button"
                   class="record-button ui-icon-calendar">
                <h3 class="heading">Date</h3>
                    <p class="descript"></p>
                </a>
            </li>
        </ul>
    </div>
    <ul data-role="listview" class="ui-nodisc-icon ui-alt-icon space-top">
        <li>
            <a href="#number" id="number-button"
               class="record-button">
            <h3 class="heading">Number</h3>
                <p class="descript"></p>
            </a>
        </li>
        <li>
            <a href="#stage" id="stage-button"
               class="record-button">
            <h3 class="heading">Life Stage</h3>
                <p class="descript"></p>
            </a>
        </li>
        <li>
            <a href="#locationdetails" id="locationdetails-button"
               class="record-button">
                <h3 class="heading">Habitat Details</h3>
                <p class="descript"></p>
            </a>
        </li>
        <li>
            <a href="#comment" id="comment-button"
               class="record-button ui-icon-comment">
                <h3 class="heading">Comment</h3>
                <p class="descript"></p>
            </a>
        </li>
    </ul>
</div>
