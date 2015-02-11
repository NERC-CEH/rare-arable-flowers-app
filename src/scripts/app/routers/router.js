(function () {
  'use strict';

  app.Router = Backbone.Router.extend({
    initialize: function () {
      this.firstPage = true;
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

      "record/:id": function (id) {
        if (!app.views.recordPage){
          app.views.recordPage = new app.views.RecordPage();
        }
        this.changePage(app.views.recordPage);

        var prevPageID = $.mobile.activePage ? $.mobile.activePage.attr('id') : '';
        app.views.recordPage.update(prevPageID, id);
      },

      "location": function () {
        if (!app.views.locationPage){
          app.views.locationPage = new app.views.LocationPage();
        }
        this.changePage(app.views.locationPage);

        var prevPageID = $.mobile.activePage ? $.mobile.activePage.attr('id') : '';
        app.views.locationPage.update(prevPageID);
      },

      "comment": function () {
        if (!app.views.commentPage){
          app.views.commentPage = new app.views.CommentPage();
        }
        this.changePage(app.views.commentPage);
      },

      "number": function () {
        if (!app.views.numberPage){
          app.views.numberPage = new app.views.NumberPage();
        }
        this.changePage(app.views.numberPage);
      },

      "locationdetails": function () {
        if (!app.views.locationDetailsPage){
          app.views.locationDetailsPage = new app.views.LocationdetailsPage();
        }
        this.changePage(app.views.locationDetailsPage);
      },

      "stage": function () {
        if (!app.views.stagePage){
          app.views.stagePage = new app.views.StagePage();
        }
        this.changePage(app.views.stagePage);
      },

      "date": function () {
        if (!app.views.datePage){
          app.views.datePage = new app.views.DatePage();
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

      "mgmtschemes": function () {
        this.navigateToStandardPage('mgmtschemes');
      }
    },

    navigateToStandardPage: function (pageID) {
      if (!app.views[pageID + 'Page']){
        app.views[pageID + 'Page'] = new app.views.Page(pageID);
      }
      this.changePage(app.views[pageID + 'Page']);
    },

    changePage: function (page) {
      if (this.firstPage) {
        // We turned off $.mobile.autoInitializePage, but now that we've
        // added our first page to the DOM, we can now call initializePage.
        $.mobile.initializePage();
        this.firstPage = false;
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