    <% if (records.length) { %>
    <div class="info-message">Saved recordings.</div>

    <ul data-role="listview" id="saved-list" data-split-icon="gear"
        data-inset="true" data-split-theme="d">
        <li data-corners="false" data-shadow="false" data-iconshadow="true"
            data-wrapperels="div" data-icon="arrow-r" data-iconpos="right"
            data-theme="b">
            <a href="#" id="sendall-button" data-role="button"
               onclick="app.controller.user.sendAllSavedRecords()">
                <center>Send All</center>
            </a>
        </li>
        <% _.each (records, function (record) { %>
        <li data-corners="false" data-shadow="false" data-iconshadow="true"
            data-wrapperels="div" data-icon="arrow-r" data-iconpos="right">
            <a href="#" onclick="app.controller.user.sendSavedRecord(<%- record.id %>)">
                <!--<img src="" />-->
                <h3><%- record.common_name %></h3>

                <p><%- record.date %></p>
            </a>
            <a href="#" data-icon="delete" data-ajax="false"
               onclick="app.controller.user.deleteSavedRecord(<%- record.id %>)">Send</a>
        </li>
        <% }); %>
    </ul>
    <% } else { %>
    <div class="info-message">No saved recordings.</div>
    <% } %>
