(function () {
  'use strict';

  app.Router = Backbone.Router.extend({
    initialize: function () {
      _log('app.Router: initialize.', app.LOG_DEBUG);

      $(document).on("show", _.bind(this.handleshow, this));
    },

    routes: {
      "": function () {
        this.navigateToStandardPage('welcome');
      },

      "welcome": function () {
        this.navigateToStandardPage('welcome');
      },

      "list": function () {
        if (!app.views.listPage){
          app.views.listPage = new app.views.ListPage();
        }
        this.changePage(app.views.listPage);
      },

      "species/:id": function (id) {
        if (!app.views.speciesPage){
          app.views.speciesPage = new app.views.SpeciesPage();
        }
        this.changePage(app.views.speciesPage);

        app.views.speciesPage.update(id);
      },

      "user": function () {
        if (!app.views.userPage){
          app.views.userPage = new app.views.UserPage();
        }
        this.changePage(app.views.userPage);

        app.views.userPage.update();
      },

      "terms": function () {
        this.navigateToStandardPage('terms');
      },

      "login": function () {
        if (!app.views.loginPage){
          app.views.loginPage = new app.views.LoginPage();
        }
        this.changePage(app.views.loginPage);
      },

      "register": function () {
        if (!app.views.registerPage){
          app.views.registerPage = new app.views.RegisterPage();
        }
        this.changePage(app.views.registerPage);
      },

      "record/:id": function (id) {
        if (!app.views.recordPage){
          app.views.recordPage = new app.views.RecordPage({model: app.models.record});
        }
        var prevPageID = $.mobile.activePage ? $.mobile.activePage.attr('id') : '';

        this.changePage(app.views.recordPage);
        app.views.recordPage.update(prevPageID, id);
      },

      "location": function () {
        if (!app.views.locationPage){
          app.views.locationPage = new app.views.LocationPage({model: app.models.record});
        }
        this.changePage(app.views.locationPage);
        app.views.locationPage.update();
      },

      "comment": function () {
        if (!app.views.commentPage){
          app.views.commentPage = new app.views.CommentPage({model: app.models.record});
        }
        this.changePage(app.views.commentPage);
      },

      "number": function () {
        if (!app.views.numberPage){
          app.views.numberPage = new app.views.NumberPage({model: app.models.record});
        }
        this.changePage(app.views.numberPage);
      },

      "locationdetails": function () {
        if (!app.views.locationDetailsPage){
          app.views.locationDetailsPage = new app.views.LocationdetailsPage({model: app.models.record});
        }
        this.changePage(app.views.locationDetailsPage);
      },

      "stage": function () {
        if (!app.views.stagePage){
          app.views.stagePage = new app.views.StagePage({model: app.models.record});
        }
        this.changePage(app.views.stagePage);
      },

      "date": function () {
        if (!app.views.datePage){
          app.views.datePage = new app.views.DatePage({model: app.models.record});
        }
        this.changePage(app.views.datePage);
      },

      "mgmt": function () {
        this.navigateToStandardPage('mgmt');
      },

      "mgmthotspot": function () {
        this.navigateToStandardPage('mgmthotspot');
      },

      "mgmtrequirements": function () {
        this.navigateToStandardPage('mgmtrequirements');
      },

      "mgmtwhere": function () {
        this.navigateToStandardPage('mgmtwhere');
      },

      "info": function () {
        this.navigateToStandardPage('info');
      },

      "about": function () {
        this.navigateToStandardPage('about');
      },

      "credits": function () {
        this.navigateToStandardPage('credits');
      },

      "privacy": function () {
        this.navigateToStandardPage('privacy');
      },

      "brc-approved": function () {
        this.navigateToStandardPage('brc-approved');
      }
    },

    navigateToStandardPage: function (pageID) {
      if (!app.views[pageID + 'Page']){
        app.views[pageID + 'Page'] = new app.views.Page(pageID);
      }
      this.changePage(app.views[pageID + 'Page']);
    },

    changePage: function (page) {
      // We turned off $.mobile.autoInitializePage, but now that we've
      // added our first page to the DOM, we can now call initializePage.
      if (!this.initializedFirstPage) {
        _log('app.Router: loading first page.', app.LOG_DEBUG);

        $.mobile.initializePage();
        this.initializedFirstPage = true;

        //ask user to appcache
        //setTimeout(app.download, 1000);
      }

      $(":mobile-pagecontainer").pagecontainer("change", '#' + page.id,
        {changeHash: false});
    },

    handleshow: function (event, ui) {
      // Figure out what page we are showing and call 'app.views.Page.show' on it
      // TODO: JQM 1.4.3 has ui.toPage, which would be preferred to getActivePage
      var activePage = $(":mobile-pagecontainer").pagecontainer("getActivePage");
      _.each(this.pages, function (page) {
        if (activePage.get(0) === page.el) {
          page.show(event, ui);
        }
      });
    }
  });

})();