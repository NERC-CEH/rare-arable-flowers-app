    <div class="ui-field-contain list-controls">
        <fieldset data-role="controlgroup">
            <% _.each(obj, function( input ){ %>
            <input type="checkbox" id="<%- input.id %>" class="filter" <%- input.checked %>
            data-iconpos="right">
            <label for="<%- input.id %>" class="filter"><%- input.label %></label>
            <% }); %>
        </fieldset>
    </div>
