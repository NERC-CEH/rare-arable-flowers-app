<div class="app-logo-dark"></div>

<ul class="table-view buttons">
  <li class="table-view-cell">
    <a href="#info/about" class="navigate-right">
      <span class="media-object pull-left icon icon-info"></span>
      About
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#info/help" class="navigate-right">
      <span class="media-object pull-left icon icon-help"></span>
      Help
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#info/privacy" class="navigate-right">
      <span class="media-object pull-left icon icon-lock-closed"></span>
      Privacy Policy
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#info/brc-approved" class="navigate-right">
      <span class="media-object pull-left icon icon-thumbs-up"></span>
      BRC Approved
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#info/credits" class="navigate-right">
      <span class="media-object pull-left icon icon-heart"></span>
      Credits
    </a>
  </li>

  <li class="table-view-divider">Settings</li>
  <li class="table-view-cell">
    <a href="#settings" class="navigate-right">
      <span class="media-object pull-left icon icon-settings"></span>
      App
    </a>
  </li>

  <li class="table-view-divider">Account</li>

  <% if (obj.surname) { %>
  <li class="table-view-cell">
    <a id="logout-button" class="navigate-right">
      <span class="media-object pull-left icon icon-logout"></span>
      Logout: <%- obj.name %> <%- obj.surname %>
    </a>
  </li>
  <% } else { %>
  <li class="table-view-cell">
    <a href="#user/login" class="navigate-right">
      <span class="media-object pull-left icon icon-user"></span>
      Login
    </a>
  </li>
  <li class="table-view-cell">
    <a href="#user/register" class="navigate-right">
      <span class="media-object pull-left icon icon-user-plus"></span>
      Register
    </a>
  </li>
  <% } %>
</ul>