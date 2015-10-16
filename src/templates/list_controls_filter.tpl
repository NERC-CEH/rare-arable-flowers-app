<center>
    <div data-role="collapsibleset" id="list-filters" data-inset="false"
         data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right">

        <% _.each(obj, function (filterGroup, filterGroupID){ %>
            <div data-role="collapsible">
                <h3><%- filterGroup.label %></h3>
                <fieldset data-role="controlgroup">

                    <% _.each(filterGroup.filters, function (filter, filterID) { %>
                    <label class="filter">
                        <input class="filter" id="<%- filterID %>"
                               data-group="<%- filterGroupID %>" type="<%- filterGroup.type %>"
                                <%- filter.checked %>><%- filter.label %>
                    </label>
                    <% }); %>

                </fieldset>
            </div>
        <% }); %>
    </div>
</center>
