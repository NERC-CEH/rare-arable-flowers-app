    <div class="ui-field-contain list-controls">
        <fieldset data-role="controlgroup">
            <% _.each(this, function (control){ %>
            <input name="sort" type="radio" id="<%- control.id %>"
                   class="sort" <%- control.checked %> data-iconpos="right">
            <label for="<%- control.id %>" class="sort"><%- control.label %></label>
            <% }); %>
        </fieldset>
    </div>