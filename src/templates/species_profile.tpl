    <center>
        <div class="gallery" id="species_gallery">
            <a href="<%- profile_pic %>">
                <img src="<%- profile_pic %>">
            </a>
        </div>

        <ul data-role="listview" data-inset="true" style="max-width:800px;">
            <li>
                <div class="taxon"><%- taxon %></div>
            </li>
            <li>
                <p><%= description %></p>
            </li>
            <li>
                <p><strong>Flowering period:</strong> <%- flowering_period %></p>
                <p><strong>Germination period:</strong> <%- germination_period %></p>
                <p><strong>Seed longetivity:</strong> <%- seed_longevity %></p>
                <p><strong>Conservation status:</strong> <%- conservation_status %></p>
            </li>
            <li>
                <strong>Management:</strong>
                <p><%= management %></p>
            </li>
        </ul>
    </center>
