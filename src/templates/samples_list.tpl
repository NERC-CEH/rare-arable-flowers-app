<% if (this.collection.length) { %>
    <div class="info-message">
        <p>
            Saved recordings. <br/>
            <em style="font-weight: 100; display: inline;"> Full app statistics <a href="<%- app.CONF.STATISTICS.URL %>" target="_blank" style="color: white;">here.</a></em>
        </p>
    </div>

    <ul data-role="listview" id="samples-list"
        class="ui-nodisc-icon ui-alt-icon listview-full space-top">
        <li>
            <a href="#user" id="syncAll-button" class="ui-icon-recycle">
                <center>Synchronize All</center>
            </a>
        </li>
    </ul>
<% } else { %>
    <div class="info-message">
        <p>
            No saved recordings. <br/>
            <em style="font-weight: 100; display: inline;"> Full app statistics <a href="<%- app.CONF.STATISTICS.URL %>" target="_blank" style="color: white;">here.</a></em>
        </p>
<% } %>
