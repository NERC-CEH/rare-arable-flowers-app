<a href="#species/<%- obj.id %>" class="species <%- obj.favourite ? 'favourite': '' %>">
  <div class="media-object pull-left"><img src="<%= obj.img %>" alt=""></div>
  <div class="media-body">
    <% if (obj.sortScientific) { %>
    <p class="species-list-main-name"><i><%- obj.taxon %></i></p>
    <p class="species-list-secondary-name">
      <% if (obj.common_name_significant) { %>
      <%- obj.common_name_significant %>,
      <% } %>
      <%- obj.common_name %>
    </p>
    <% } else { %>
    <p class="species-list-main-name">
      <% if (obj.common_name_significant) { %>
      <%- obj.common_name_significant %>,
      <% } %>
      <%- obj.common_name %>
    </p>
    <p class="species-list-secondary-name"><i><%- obj.taxon %></i></p>
    <% } %>
  </div>
</a>
<button id="record" class="btn icon icon-plus "></button>