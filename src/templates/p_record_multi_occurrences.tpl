<div data-role="header" data-position="fixed" data-tap-toggle="false">
    <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
        <a href='#' data-rel='back' class="ui-btn ui-icon-carat-l ui-nodisc-icon
        ui-alt-icon ui-btn-icon-notext">Back</a>
    </div>
    <h3 id='record__multi_occurrences_heading'>Species</h3>
    <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
        <button id="record-multi-occurrences-save" class="ui-btn ui-btn-b ui-icon-plus ui-nodisc-icon
        ui-btn-icon-right">Save</button>
    </div>
</div>
<div data-role="content">
    <div id="empty-list-message" class="info-message">
        <p>No species has been selected to the list. Please add some
            using the plus button below.</p>
    </div>
    <a href="#list/multi" id="record-multi-occurrences-add"
            class="ui-btn ui-icon-plus ui-nodisc-icon ui-alt-icon
            ui-btn-corner-all ui-btn-icon-notext">Add species</a>
    <br/>
    <div id="record-multi-occurrences-list"></div>
</div>

