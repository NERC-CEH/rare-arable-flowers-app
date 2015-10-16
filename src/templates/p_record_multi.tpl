<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h3 id='multi_record_info_heading'>Multi-Recording</h3>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <a href='#record/multi/occurrences' class="ui-btn ui-icon-carat-r ui-nodisc-icon
        ui-alt-icon ui-btn-icon-right">Next</a>
    </div>
</div>
<div data-role="content">
    <div class="info-message">
        <p>Please select the approximate size of your survey area:</p>
    </div>

    <fieldset data-role="controlgroup" data-iconpos="right">
        <input type="radio" name="survey-area" id="survey-area-point" value="point" checked="checked">
        <label for="survey-area-point">Point location</label>

        <input type="radio" name="survey-area" id="survey-area-100m" value="100m">
        <label for="survey-area-100m">100m x 100m</label>

        <input type="radio" name="survey-area" id="survey-area-1km" value="1km">
        <label for="survey-area-1km">1km x 1km</label>
    </fieldset>

    <ul data-role="listview" class="core-inputs ui-nodisc-icon ui-alt-icon space-top">
        <li>
            <a href="#location/multi" id="record-multi-location"
               class="record-button ui-icon-location">
                <h3 class="heading">Location</h3>
                <p class="descript"></p>
            </a>
        </li>
        <li>
            <a href="#date/multi" id="record-multi-date"
               class="record-button ui-icon-calendar">
                <h3 class="heading">Date</h3>
                <p class="descript"></p>
            </a>
        </li>
        <li>
            <a href="#comment/multi" id="record-multi-comment"
               class="record-button ui-icon-comment">
                <h3 class="heading">Site Comment</h3>
                <p class="descript"></p>
            </a>
        </li>
    </ul>
</div>
