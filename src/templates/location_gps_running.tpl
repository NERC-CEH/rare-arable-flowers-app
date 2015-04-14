<div class="info-message">
    <p>We are trying to get your location. This might take a
        few minutes...</p>
    <% if (obj.location) { %>
        <% if (obj.location.accuracy > morel.geoloc.CONF.GPS_ACCURACY_LIMIT) { %>
          <p>Accuracy: <%- obj.location.accuracy %> meters
              (need less than <%- morel.geoloc.CONF.GPS_ACCURACY_LIMIT %>m)</p>
        <% } else { %>
         <p>Accuracy: <%- obj.location.accuracy %> meters </p>
        <% } %>
    <% } %>
</div>

<input type="button" id="gps-stop-button" value="Stop">
