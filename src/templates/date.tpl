    <div data-role="header" data-position="fixed" data-tap-toggle="false">
        <div class='ui-btn-left' data-role='controlgroup' data-type='horizontal'>
            <a href='#' data-rel="back" data-role="button" data-iconpos="notext"
               data-icon="delete">Cancel</a>
        </div>
        <h1>Date</h1>

        <div class='ui-btn-right' data-role='controlgroup' data-type='horizontal'>
            <a href='#' data-rel="back" data-role="button" data-iconpos="notext"
               onclick="app.controller.record.saveInput('sample:date')"
               data-icon="check">Save</a>
        </div>
    </div>
    <div data-role="content">
        <div class="info-message"><p>Please enter the date of the recording.</p>
        </div>
        <input id="sample:date" name="sample:date" type="date" required>
    </div>
