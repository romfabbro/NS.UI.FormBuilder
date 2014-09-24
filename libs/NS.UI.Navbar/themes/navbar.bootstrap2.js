NS.UI.NavBar.className = 'navbar';
NS.UI.NavBar.templates = {
    navbar:
        '<div class="navbar-inner">' +
        '    <p class="navbar-logo navbar-text pull-left"></p>' +
        '    <ul class="nav navbar-context"></ul>' +
        '    <ul class="nav navbar-switcher"><li><a href="#" title="Go to..."></a></li></ul>' +
        '    <ul class="nav navbar-actions"></ul>' +
        '    <form class="navbar-search pull-right" action="#"><% if (data.enableSearchBox) { %>' +
        '        <input type="text" class="search-query span2">' +
        '    <% } %></form>' +
        '    <p class="navbar-text navbar-user pull-right"></p>' +
        '</div>' +
        '<div class="navbar-tiles"><div class="tile-wrapper"><ul class="tiles"></ul></div></div>',
    userbox:
        '<span class="username"><%= data.username %></span>',
    breadcrumbs:
        '<li><a href="#"><%= data.appName %></a></li>' +
        '<li><p class="navbar-text"><%= data.context %></p></li>',
    tileItem:
        '<li class="tile <%= data.tileClass %>"><a href="<%= data.url %>"><i class="icon"></i><h2><%= data.title %></h2></a></li>',
    actionItem:
        '<li>' +
        '    <a href="<% if (data.url) { %><%= data.url %><% } else { %>#<% } %>" data-key="<%= data.key %>">' +
        '        <%= data.title %>' +
        '    </a>' +
        '</li>',
    actionHeader:
        '<li class="nav-header"><%= data.title %></li>',
    actionDivider:
        '<li class="divider"></li>',
    actionGroup:
        '<ul class="dropdown-menu"></ul>'
};