    <div data-role="header" data-position="fixed" data-tap-toggle="false">
        <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
            <a href='#' data-rel="back" data-role="button" data-iconpos="notext"
               data-icon="delete">Cancel</a>
        </div>
        <h1>Location Details</h1>

        <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
            <a href='#' data-rel="back" data-role="button" data-iconpos="notext"
               data-icon="check"
               onclick="app.controller.record.saveInput('sample:location_details')">Save</a>
        </div>
    </div>
    <div data-role="content">
        <div class="info-message">
            <p>Please select the location details.</p>
        </div>
        <fieldset data-role="controlgroup" data-iconpos="right">
            <input type="radio" name="location-details" id="radio-choice-cult">
            <label for="radio-choice-cult">Cultivated Strip / Block</label>
            <input type="radio" name="location-details" id="radio-choice-headland">
            <label for="radio-choice-headland">Conservation headland</label>
            <input type="radio" name="location-details" id="radio-choice-game">
            <label for="radio-choice-game">Wild bird seed / Game cover</label>
            <input type="radio" name="location-details" id="radio-choice-wildflower">
            <label for="radio-choice-wildflower">Wildflower / Clover rich margin</label>
            <input type="radio" name="location-details" id="radio-choice-corner">
            <label for="radio-choice-corner">Grass margin / corner</label>
            <input type="radio" name="location-details" id="radio-choice-stubble">
            <label for="radio-choice-stubble">Stubble</label>
            <input type="radio" name="location-details" id="radio-choice-track">
            <label for="radio-choice-track">Track / gateway</label>
            <input type="radio" name="location-details" id="radio-choice-otherlocation">
            <label for="radio-choice-otherlocation">Other</label>
        </fieldset>
    </div>
    <div data-role="footer" data-position="fixed" data-tap-toggle="false"></div>
