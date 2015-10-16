<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-delete ui-nodisc-icon
        ui-alt-icon ui-btn-icon-left">Cancel</a>
    </div>
    <h1>Number</h1>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <button id="number-save" class="ui-btn ui-icon-plus ui-alt-icon
        ui-nodisc-icon ui-btn-icon-right">Save</button>
    </div>
</div>
<div data-role="content">
    <div class="info-message">
        <p>How many individual plants of this type?</p>
    </div>
    <button id="clear-button" style="width: 94%" data-icon="delete" data-iconpos="right">Clear</button>
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

    <div id="area-inputs">
        <div class="ui-field-contain">
            <label for="area-length">Surveyed area <b>length</b> (meters):</label>
            <input name="area-length" id="area-length" type="range" value="0" min="0" max="1000"/>
        </div>
        <div class="ui-field-contain">
            <label for="area-width">Surveyed area <b>width</b> (meters):</label>
            <input name="area-width" id="area-width" type="range" value="0" min="0" max="1000"/>
        </div>
    </div>
</div>
