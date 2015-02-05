    <div class="info-message">
        <p>We are trying to get your location. This might take a
            few minutes...</p>
    </div>
    <% if (location) { %>
    <div class="success-message">
        <p> Grid Ref: <%- location.gref %> <br/><br/>
            Lat: <%- location.lat %> <br/>
            Lon: <%- location.lon %> <br/><br/>
            Accuracy: <%- location.acc %> meters
        </p>
    </div>
    <% } %>

    <input type="button" id="gps-stop-button" value="Stop">
