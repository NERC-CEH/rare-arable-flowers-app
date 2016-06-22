<div class="info-message">
  <p>This record has been submitted and cannot be edited within this App.
    Go to the <a href="http://irecord.org.uk" target="_blank">iRecord website</a> to edit.</p>

</div>
<ul class="table-view core inputs info no-top">
  <li class="table-view-cell species">
    <span class="media-object pull-right descript"><%- obj.commonName %></span>
    <span class="media-object pull-right descript"><i><%- obj.scientificName %></i></span>
  </li>
  <li class="table-view-cell">
    <span class="media-object pull-left icon icon-location"></span>
    <span class="media-object pull-right descript"><%- obj.location_name %></span>
    <span class="media-object pull-right descript"><%- obj.location %></span>
    Location
  </li>
  <li class="table-view-cell">
    <span class="media-object pull-left icon icon-calendar"></span>
    <span class="media-object pull-right descript"><%- obj.date %></span>
    Date
  </li>
  <% if (obj.number) { %>
    <li class="table-view-cell">
      <span class="media-object pull-left icon icon-number"></span>
      <% if (obj.number) { %>
      <span class="media-object pull-right descript"><%- obj.number %></span>
      <% } %>
      <% if (obj.number_width) { %>
      <span class="media-object pull-right descript">(<%- obj.number_length %>m x <%- obj.number_width %>m)</span>
      <% } %>
      Number
    </li>
  <% } %>
  <% if (obj.stage) { %>
    <li class="table-view-cell">
      <span class="media-object pull-left icon icon-stage"></span>
      <span class="media-object pull-right descript"><%- obj.stage %></span>
      Stage
    </li>
  <% } %>
  <% if (obj.comment) { %>
    <li class="table-view-cell">
      <span class="media-object pull-left icon icon-comment"></span>
      Comment
      <span class="comment descript"><%- obj.comment %></span>
    </li>
  <% } %>
  <% if (obj.group_title) { %>
  <li class="table-view-cell">
    <span class="media-object pull-left icon icon-users"></span>
    <span class="media-object pull-right descript"><%- obj.group_title %></span>
    Activity
  </li>
  <% } %>
  <% if (obj.images.length) { %>
    <li id="img-array">
      <% obj.images.each(function (image){ %>
        <img src="<%- image.getURL() %>" alt="">
      <% }) %>
    </li>
  <% } %>
</ul>

<div id="occurrence-id"><%- obj.id %></div>