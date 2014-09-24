NS.UI.NavBar.className = 'navbar navbar-default';
NS.UI.NavBar.templates = {
    navbar:
        '<div class="container-fluid">' +
        '    <div class="navbar-logo navbar-text navbar-left"></div>' +
        '    <ul class="nav navbar-nav navbar-context"></ul>' +
        '    <ul class="nav navbar-nav navbar-switcher"><li><a href="#" title="Go to..."></a></li></ul>' +
        '    <ul class="nav navbar-nav navbar-actions"></ul>' +
        '    <form class="navbar-form navbar-right" action="#"><% if (data.enableSearchBox) { %>' +
        '        <div class="form-group"><input type="text" class="form-control" placeholder="Search..."></div>' +
        '    <% } %></form>' +
        '    <div class="navbar-text navbar-user navbar-right"></div>' +
        '</div>' +
        '<div class="navbar-tiles"><div class="tile-wrapper"><ul class="tiles"></ul></div></div>',
    userbox:
        '<span class="username"><%= data.username %></span>',
    breadcrumbs:
        '<li><a href="#"><%= data.appName %></a></li>' +
        '<li><div class="navbar-text"><%= data.context %></div></li>',
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