<a href="#user" class="sync saved-list-item" data-id="<%- obj.id %>">
    <% if (obj.img) { %>
        <div class="img-picker-display <%- obj.multiRecord ? 'multi':'' %>"
             style="background-image: none; border: 0px; height: 55px; width: 55px;">
            <img src="<%- obj.img.data %>">
        </div>
    <% } else { %>
        <div class="img-picker-display <%- obj.multiRecord ? 'multi':'' %>"></div>
    <% } %>

    <p><strong><%- obj.date %></strong></p>
    <% if (obj.multiRecord) { %>
        <p><i><%- obj.multiRecord %> species</i></p>
    <% } else { %>
        <p>
            <i>
                <% if (obj.common_name_significant) { %>
                    <%- obj.common_name_significant %>,
                <% } %>
                <%- obj.common_name %>
            </i>
        </p>
    <% } %>
</a>
<a href="#record-info/<%- obj.id %>" class="ui-alt-icon ui-nodisc-icon ui-icon-info">Info</a>
