<a href="#record/multi" data-id="<%- id %>" class="record-multi-list-item <%- favourite ? 'favourite': '' %>">
    <img class="record-multi-list-img" src="<%- profile_pic %>" data-id="<%- id %>"/>
    <% if (app.models.user.isSortScientific(true)) { %>
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
<a href="#species/<%- id %>" class="ui-icon-info ui-nodisc-icon ui-alt-icon">Species</a>
