    <ul data-role="listview" data-split-icon="gear" data-split-theme="d">
        <% _.each(species, function( specie ){ %>
        <li data-corners="false" data-shadow="false" data-iconshadow="true"
            data-wrapperels="div" data-icon="arrow-r" data-iconpos="right"
            data-theme="c">
            <a href="#species"
               onclick="app.controller.list.setCurrentSpecies('<%- specie.id %>')"
               class="<%- specie.favourite %>">
                <img src="<%- specie.profile_pic %>"/>

                <p class="species-list-common-name"><%- specie.common_name %></p>

                <p><%- specie.taxon %></p>
            </a>
            <a href="#record" class="ios-enhanced"
               onclick="app.controller.list.setCurrentSpecies('<%- specie.id %>')"
               data-icon="plus">Record</a>
        </li>
        <% }); %>
    </ul>
