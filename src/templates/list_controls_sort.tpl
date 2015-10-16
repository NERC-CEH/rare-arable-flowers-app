<div class="ui-field-contain list-controls">
    <fieldset data-role="controlgroup" data-mini="true">
        <% _.each(obj, function (control, controlID){ %>
        <input name="sort" type="radio" id="<%- controlID %><%- control.multi %>"
               data-id="<%- controlID %>" class="sort" <%- control.checked %> data-iconpos="right">
        <label for="<%- controlID %><%- control.multi %>" class="sort"><%- control.label %></label>
        <% }); %>
    </fieldset>
</div>