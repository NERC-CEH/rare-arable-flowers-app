<div class="ui-field-contain list-controls">
    <fieldset data-role="controlgroup">
        <% _.each(obj, function( input ){ %>
        <label class="filter">
            <input class="filter" id="<%- input.id %>"
                   type="checkbox" data-iconpos="right" <%- input.checked %>><%- input.label %>
        </label>
        <% }); %>
    </fieldset>
</div>
