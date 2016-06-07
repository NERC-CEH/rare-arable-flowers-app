<ul class="table-view core inputs no-top <%- obj.isSynchronising ? 'disabled' : '' %>">
  <li class="table-view-divider species-name">
      <%- obj.common_name + ' ' + obj.common_name_significant %>
  </li>
  <li class="table-view-cell">
    <a href="#records/<%- obj.id %>/edit/location" id="location-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-location"></span>

      <% if (obj.location_name) { %>
      <span class="media-object pull-right descript"><%- obj.location_name %></span>
      <% } else { %>
      <span class="media-object pull-right descript error">Name missing</span>
      <% } %>

      <% if (obj.location) { %>
        <span class="media-object pull-right descript"><%- obj.location %></span>
      <% } else { %>
      <% if (obj.isLocating) { %>
        <span class="media-object pull-right descript warn">Locating...</span>
      <% } else { %>
        <span class="media-object pull-right descript error">Location missing</span>
      <% } %>
      <% } %>
      Location
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#records/<%- obj.id %>/edit/date" id="date-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-calendar"></span>
      <span class="media-object pull-right descript"><%- obj.date %></span>
      Date
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#records/<%- obj.id %>/edit/number" id="number-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-number"></span>
      <% if (obj.number) { %>
        <span class="media-object pull-right descript"><%- obj.number %></span>
      <% } %>
      <% if (obj.number_width) { %>
        <span class="media-object pull-right descript">(<%- obj.number_length %>m x <%- obj.number_width %>m)</span>
      <% } %>
      Number
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#records/<%- obj.id %>/edit/stage" id="stage-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-stage"></span>
      <span class="media-object pull-right descript"><%- obj.stage %></span>
      Life Stage
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#records/<%- obj.id %>/edit/habitat" id="habitat-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-landscape"></span>
      <span class="media-object pull-right descript"><%- obj.habitat %></span>
      Habitat
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#records/<%- obj.new ? 'new' : obj.id %>/edit/comment" id="comment-button"
       class="navigate-right">
      <span class="media-object pull-left icon icon-comment"></span>
      <span class="media-object pull-right descript"><%- obj.comment %></span>
      Comment
    </a>
  </li>
</ul>
