    <% if (records.length) { %>
    <div class="info-message">Saved recordings.</div>

    <ul data-role="listview" id="saved-list" data-split-icon="gear"
        data-inset="true" data-split-theme="d">
        <li data-corners="false" data-shadow="false" data-iconshadow="true"
            data-wrapperels="div" data-icon="arrow-r" data-iconpos="right"
            data-theme="b">
            <a href="#user" id="sendall-button" data-role="button">
                <center>Send All</center>
            </a>
        </li>
        <% _.each (records, function (record) { %>
        <li data-corners="false" data-shadow="false" data-iconshadow="true"
            data-wrapperels="div" data-icon="arrow-r" data-iconpos="right">
            <a href="#user" id="send-button" data-id="<%- record.id %>">
                <!--<img src="" />-->
                <p><%- record.date %></p>
                <p><%- record.common_name %></p>
            </a>
            <a href="#user" id="delete-button" data-icon="delete" data-ajax="false"
               data-id="<%- record.id %>">Delete</a>
        </li>
        <% }); %>
    </ul>
    <% } else { %>
    <div class="info-message">No saved recordings.</div>
    <% } %>
