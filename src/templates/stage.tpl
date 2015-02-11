    <div data-role="header" data-position="fixed" data-tap-toggle="false">
        <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
            <a href='#' data-rel="back" data-role="button" data-iconpos="notext"
               data-icon="delete">Cancel</a>
        </div>
        <h1>Stage</h1>

        <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
            <a href='#' id="stage-save" data-rel="back" data-role="button"
               data-iconpos="notext" data-icon="check">Save</a>
        </div>
    </div>
    <div data-role="content">
        <div class="info-message">
            <p>Please select the stage the plants are generally in.</p>
        </div>
        <fieldset data-role="controlgroup" data-iconpos="right">
            <input type="radio" name="stage" id="radio-choice-vegative">
            <label for="radio-choice-vegative">Vegatative</label>
            <input type="radio" name="stage" id="radio-choice-flowering">
            <label for="radio-choice-flowering">Flowering</label>
            <input type="radio" name="stage" id="radio-choice-seed">
            <label for="radio-choice-seed">In Seed</label>
        </fieldset>
    </div>
    <div data-role="footer" data-position="fixed" data-tap-toggle="false"></div>
