<a href="#species/<%- id %>" class="species <%- favourite ? 'favourite': '' %>">
    <img src="<%- profile_pic %>"/>
    <% if (app.models.user.isSortScientific()) { %>
      <p class="species-list-main-name"><i><%- taxon %></i></p>
      <p class="species-list-secondary-name">
          <% if (common_name_significant) { %>
            <%- common_name_significant %>,
          <% } %>
          <%- common_name %>
      </p>
    <% } else { %>
      <p class="species-list-main-name">
          <% if (common_name_significant) { %>
            <%- common_name_significant %>,
          <% } %>
          <%- common_name %>
      </p>
      <p class="species-list-secondary-name"><i><%- taxon %></i></p>
    <% } %>
</a>
<a href="#record/<%- id %>" class="ui-icon-plus ui-nodisc-icon ui-alt-icon">Record</a>
