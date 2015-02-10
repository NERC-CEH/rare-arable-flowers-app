(function () {
  'use strict';

  app.Router = Backbone.Router.extend({
    initialize: function () {
      this.firstPage = true;
      $(document).on("show", _.bind(this.handleshow, this));
    },

    routes: {
      "": function () {
        this.changePage(new app.views.Page('welcome'));
      },

      "welcome": function () {
        this.changePage(new app.views.Page('welcome'));
      },

      "list": function () {
        var pageAddedFirstTime = this.changePage(new app.views.ListPage());

        if (pageAddedFirstTime) {

        }
        // app.controller.list.show();
      },

      "species/:id": function (id) {
        var pageAddedFirstTime = this.changePage(new app.views.SpeciesPage(id));

        if (pageAddedFirstTime) {
        //  app.controller.species.init();
        }
      //  app.controller.species.show(id);
      },

      "record/:id": function (id) {
        var prevPageID = $.mobile.activePage ? $.mobile.activePage.attr('id') : '';
        var pageAddedFirstTime = this.changePage(new app.views.Page('record'));

        if (pageAddedFirstTime) {
          app.controller.record.init();
        }
        app.controller.record.show(prevPageID, id);
      },

      "location": function () {
        var prevPageID = $.mobile.activePage.attr('id');
        var pageAddedFirstTime = this.changePage(new app.views.Page('location'));

        if (pageAddedFirstTime) {
          app.controller.location.init();
        }
        app.controller.location.show(prevPageID);
      },

      "comment": function () {
        this.changePage(new app.views.Page('comment'));
      },

      "number": function () {
        this.changePage(new app.views.Page('number'));
      },

      "locationdetails": function () {
        this.changePage(new app.views.Page('locationdetails'));
      },

      "stage": function () {
        this.changePage(new app.views.Page('stage'));
      },

      "date": function () {
        this.changePage(new app.views.Page('date'));
      },

      "mgmt": function () {
        this.changePage(new app.views.Page('mgmt'));
      },

      "mgmthotspot": function () {
        this.changePage(new app.views.Page('mgmthotspot'));
      },

      "mgmtrequirements": function () {
        this.changePage(new app.views.Page('mgmtrequirements'));
      },

      "mgmtwhere": function () {
        this.changePage(new app.views.Page('mgmtwhere'));
      },

      "mgmtschemes": function () {
        this.changePage(new app.views.Page('mgmtschemes'));
      }
    },

    changePage: function (page) {
      // Render and add page to DOM once
      var pageAddedFirstTime = $('#' + page.id).length === 0;
      if (pageAddedFirstTime) {
        page.render();
        $('body').append($(page.el));

        $('a[data-role="button"]').on('click', function (event) {
          var $this = $(this);
          if ($this.attr('data-rel') === 'back') {
            window.history.back();
            return false;
          }
        });
      }
      if (this.firstPage) {
        // We turned off $.mobile.autoInitializePage, but now that we've
        // added our first page to the DOM, we can now call initializePage.
        $.mobile.initializePage();
        this.firstPage = false;
      }
      $(":mobile-pagecontainer").pagecontainer("change", '#' + page.id,
        {changeHash: false});

      return pageAddedFirstTime;
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