    <div class="info-message">
        <p>We will try to determine your location
            using the inbuilt phone GPS.</p>

        <p> Please make sure you have turned the phone's
            geolocation on and are well away from large objects.<br/> e.g. <i>trees,
                buildings </i></p>
    </div>
    <% if (obj.location) { %>
    <div class="success-message">
        <p> Grid Ref: <%- location.gref %> <br/><br/>
            Lat: <%- location.lat %> <br/>
            Lon: <%- location.lon %> <br/><br/>
            Accuracy: <%- location.acc %> meters
        </p>
    </div>
    <input type="button" id="gps-improve-button" value="Improve">
    <% } else { %>
    <input type="button" id="gps-start-button" value="Locate">
    <% } %>
