<a href="#species/<%- id %>" class="<%- favourite ? 'favourite': '' %>">
    <img src="<%- profile_pic %>"/>
    <% if (app.models.user.isSortScientific()) { %>
      <p class="species-list-main-name"><i><%- taxon %></i></p>
      <p class="species-list-secondary-name"><%- common_name %></p>
    <% } else { %>
      <p class="species-list-main-name"><%- common_name %></p>
      <p class="species-list-secondary-name"><i><%- taxon %></i></p>
    <% } %>
</a>
<a href="#record/<%- id %>" class="ios-enhanced"
   data-icon="plus">Record</a>
