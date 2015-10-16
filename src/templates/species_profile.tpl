<div class="gallery" id="species_gallery">
    <div class="images">
        <img class="img" src="<%- profile_pic %>" data-id="0" alt="&copy; <%- profile_pic_author %>">
        <% if (gallery) { %>
            <div class="img">
                <img class="illustration" src="<%- gallery %>" data-id="1">
            </div>
        <% } %>
    </div>
    <div class="progress">
        <div class="circle circle-full" data-id="0"></div>
        <% if (gallery) { %>
            <div class="circle" data-id="1"></div>
        <% }; %>
    </div>
</div>
<center>
   <% if (!general) { %>
    <div data-role="navbar" data-iconpos="left">
        <ul>
            <li style="border-right: 1px solid #dddddd;">
                <button id="gallery-button"
                        class="ui-btn ui-alt-icon ui-nodisc-icon ui-icon-eye ui-btn-icon-right">Gallery</button>
            </li>
            <li>
                <button id="species-map-button"
                        class="ui-btn ui-alt-icon ui-nodisc-icon ui-icon-location ui-btn-icon-right">Distribution</button>
            </li>
        </ul>
    </div>
    <% } %>

    <ul data-role="listview">
        <li style="border-top: none;">
            <div class="common-name"><%- common_name %> <%- common_name_significant %></div>
            <div class="taxon"><%- taxon %></div>
        </li>
        <li id="species-map" style="display: none">
            <div id="maps-holder" style="display:none"></div>
            <svg viewBox="0 0 400 500"  preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
                <use id="species-map-data" xlink:href="#data"/>
                <use id="species-map-boundary" xlink:href="#boundary"/>
                <g id="legend">
                    <text dy="15" x="30" y="0" style="font-size: normal">Main area</text>
                    <rect width="20" height="20" fill="rgb(22.745098%,53.333333%,16.078431%)" y="0" x="0"></rect>
                    <text dy="15" x="30" y="30" style="font-size: normal">Individual records</text>
                    <rect width="20" height="20" fill="rgb(80.392157%,58.431373%,4.705882%)" y="30" x="0"></rect>
                </g>
            </svg>
        </li>
        <li>
            <p><%- description %></p>
        </li>
        <li>
            <p><strong>Flowering period:</strong> <span><%- flowering_period %></span></p>
            <p><strong>Germination period:</strong> <span><%- germination_period %></span></p>
            <p><strong>Seed longevity:</strong> <span><%- seed_longevity %></span></p>
            <p><strong>Conservation status:</strong> <span><%- conservation_status %></span></p>
        </li>
        <li>
            <p><strong>Occurrence in conservation habitats:</strong></p>
            <p><%= management %></p>
        </li>
        <li>
            <a href="#mgmtconservation" class="ui-btn ui-mini ui-icon-info ui-nodisc-icon
            ui-alt-icon ui-btn-icon-right">More About Conservation</a>
        </li>
        <li>
            <a href="#record/<%- id %>" class="ui-btn ui-mini ui-icon-plus ui-nodisc-icon
            ui-alt-icon ui-btn-icon-right">Record Species</a>
        </li>
    </ul>
</center>




