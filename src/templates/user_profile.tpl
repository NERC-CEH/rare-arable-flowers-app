    <% if (user.loggedout) { %>
    <div class="warning-message">Looks like you have not Signed in yet. Please
        do so, as otherwise all the records will be submitted anonymously.
        <a href='login' data-role="button" data-icon="arrow-r" data-iconpos="user">Log
            in</a>
    </div>
    <% } else { %>
    <a href='#' id="logout-button" data-role="button" data-icon="user"
       data-theme="b" onclick="app.controller.login.logout()">Log out</a>
    <% } %>
