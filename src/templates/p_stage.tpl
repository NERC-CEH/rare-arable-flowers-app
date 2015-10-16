<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h1>Stage</h1>
</div>
<div data-role="content">
    <div class="info-message">
        <p>Please select the stage the plants are generally in.</p>
    </div>
    <button id="clear-button" style="width: 94%" data-icon="delete" data-iconpos="right">Clear</button>
    <fieldset data-role="controlgroup" data-iconpos="right">
        <input type="radio" name="stage" id="radio-choice-vegetative" value="Vegetative">
        <label for="radio-choice-vegetative">Vegetative</label>
        <input type="radio" name="stage" id="radio-choice-flowering" value="Flowering">
        <label for="radio-choice-flowering">Flowering</label>
        <input type="radio" name="stage" id="radio-choice-seed" value="In Seed">
        <label for="radio-choice-seed">In Seed</label>
    </fieldset>
</div>