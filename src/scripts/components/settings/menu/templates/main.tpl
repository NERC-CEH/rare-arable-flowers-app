<li class="table-view-divider">Records</li>
<li class="table-view-cell">
  <a id="submit-all-btn">
    <span class="media-object pull-left icon icon-send"></span>
    Submit All
  </a>
</li>
<li class="table-view-cell">
  <a id="delete-all-btn">
    <span class="media-object pull-left icon icon-delete"></span>
    Delete All Saved
  </a>
</li>

<li class="table-view-divider">Account</li>

<% if (obj.surname) { %>
<li class="table-view-cell">
  <a id="logout-button" class="navigate-right">
    <span class="media-object pull-left icon icon-logout"></span>
    Sign out: <%- obj.name %> <%- obj.surname %>
  </a>
</li>
<% } else { %>
<li class="table-view-cell">
  <a href="#user/login" class="navigate-right">
    <span class="media-object pull-left icon icon-user"></span>
    Sign in
  </a>
</li>
<li class="table-view-cell">
  <a href="#user/register" class="navigate-right">
    <span class="media-object pull-left icon icon-user-plus"></span>
    Register
  </a>
</li>
<% } %>


<li class="table-view-divider">Locations</li>
<li class="table-view-cell">
  Use Grid Ref
  <div id="use-gridref-btn" data-setting="useGridRef"
       class="toggle no-yes <%- obj.useGridRef ? 'active' : '' %>">
    <div class="toggle-handle"></div>
  </div>
</li>

<li id="use-gridmap-btn-parent" class="table-view-cell  <%- obj.useGridRef ? '' : 'disabled' %>">
  Show Map Grid
  <div id="use-gridmap-btn" data-setting="useGridMap"
       class="toggle no-yes <%- obj.useGridMap ? 'active' : '' %>">
    <div class="toggle-handle"></div>
  </div>
</li>


<li class="table-view-divider">Application</li>
<li class="table-view-cell">
  <a id="app-reset-btn">
    <span class="media-object pull-left icon icon-undo"></span>
    Reset
  </a>
</li>
