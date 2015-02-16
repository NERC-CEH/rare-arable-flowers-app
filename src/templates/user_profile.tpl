    <% if (user.email) { %>
    <div class="warning-message">Looks like you have not Signed in yet. Please
        do so, as otherwise all the records will be submitted anonymously.
        <a href='#login' data-role="button" data-icon="arrow-r" data-iconpos="user">Sign
            in</a>
    </div>
    <% } else { %>
    <a href='#user' id="logout-button" data-role="button" data-icon="user"
       data-theme="b">Sign out</a>
    <% } %>
