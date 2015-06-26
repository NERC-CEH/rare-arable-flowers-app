    <div data-role="header" data-position="fixed" data-tap-toggle="false">
        <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
            <a href='#' data-rel="back" data-role="button"
               data-icon="delete">Cancel</a>
        </div>
        <h1>Number</h1>
        <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
            <button id="number-save" data-icon="star" data-iconpos="right">Save</button>
        </div>
    </div>
    <div data-role="content">
        <div class="info-message">
            <p>How many individual plants of this type?</p>
        </div>
        <fieldset data-role="controlgroup" data-iconpos="right">
            <input type="radio" name="number" id="radio-choice-1" value="1">
            <label for="radio-choice-1">1</label>
            <input type="radio" name="number" id="radio-choice-2" value="2-10">
            <label for="radio-choice-2">2-10</label>
            <input type="radio" name="number" id="radio-choice-3" value="11-100">
            <label for="radio-choice-3">11-100</label>
            <input type="radio" name="number" id="radio-choice-4" value="101-1000">
            <label for="radio-choice-4">101-1000</label>
            <input type="radio" name="number" id="radio-choice-5" value="1000+">
            <label for="radio-choice-5">1000+</label>
            <input type="radio" name="number" id="radio-choice-6" value="Present" checked>
            <label for="radio-choice-6">Present</label>
        </fieldset>

        <div class="ui-field-contain">
            <label for="area-length">Surveyed area <b>length</b> (meters):</label>
            <input name="area-length" id="area-length" type="range" value="0" min="0" max="1000"/>
        </div>
        <div class="ui-field-contain">
            <label for="area-width">Surveyed area <b>width</b> (meters):</label>
            <input name="area-width" id="area-width" type="range" value="0" min="0" max="1000"/>
        </div>
    </div>
