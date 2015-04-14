<center>
    <img id='profile_pic' src="<%- profile_pic %>">

    <div class="gallery" id="species_gallery" style="display:none">
        <a href="<%- profile_pic %>">
            <img src="<%- profile_pic %>" alt="&copy; <%- profile_pic_author %>">
        </a>
    </div>

    <div data-role="navbar" data-iconpos="left">
        <ul>
            <li>
                <button id="species-map-button">Distribution Map</button>
            </li>
        </ul>
    </div>

    <ul id="species-map" data-role="listview" data-inset="true" style="max-width: 800px; display: none">
        <li >
            <div id="maps-holder" style="display:none"></div>
            <svg viewBox="0 0 400 500"  preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
                <use id="species-map-data" xlink:href="#data"/>
                <use id="species-map-boundary" xlink:href="#coastline"/>
            </svg>
        </li>
    </ul>

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
