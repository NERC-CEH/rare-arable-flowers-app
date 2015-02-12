    <div class="ui-field-contain list-controls">
        <fieldset data-role="controlgroup">
            <% _.each(obj, function (control, controlID){ %>
            <input name="sort" type="radio" id="<%- controlID %>"
                   class="sort" <%- control.checked %> data-iconpos="right">
            <label for="<%- controlID %>" class="sort"><%- control.label %></label>
            <% }); %>
        </fieldset>
    </div>