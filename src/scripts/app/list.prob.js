(function ($) {
  app.controller.list.prob = {
    CONF: {
      PROB_DATA_SRC: ""
    },

    filterOn: false,
    geoloc: null,

    gpsRunning: false,
    loadingData: false,

    LOCATION_GRANULARITY: 2, //Precision of returned grid reference (6 digits = metres).

    /**
     * #0.1 Gets the probability data from the server.
     */
    loadData: function () {
      var onSuccess = null, onError = null;

      if (!this.loadingData) {
        this.loadingData = true;

        onSuccess = function (json) {
          app.controller.list.prob.loadingData = false;
          var prob = optimiseData(json);
          app.data = app.data || {};
          app.data.prob = prob;

          //store for quicker loading
          morel.storage.set('probability', prob);

          function optimiseData(json) {
            //optimise data
            var data = {};
            for (var i = 0, length = json.length; i < length; i++) {
              var a = json[i];
              data[a.l] = data[a.l] || {};
              data[a.l][a.s] = a.p;
            }
            return data;
          }

          if (app.controller.list.prob.filterOn) {
            app.controller.list.prob.runFilter();
          }
        };

        onError = function (jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Request Failed: " + err);

          app.controller.list.prob.loadingData = false;
        };

        if (!morel.storage.is('probability')) {
          $.ajax({
            url: this.CONF.PROB_DATA_SRC,
            dataType: 'json',
            async: false,
            success: onSuccess,
            error: onError
          });
        } else {
          app.data.prob = morel.storage.get('probability');
        }
      }
    },


    /**
     * #1 Data loading and GPS locking meeting point.
     */
    runFilter: function (list, onFilterSuccess) {
      this.filterOn = true;
      this.list = list || this.list;
      this.onFilterSuccess = onFilterSuccess || this.onFilterSuccess;

      var location = morel.settings('location');
      if (!location) {
        //todo: maybe the sort type was not even selected, clean this up
        app.controller.list.removeFilter({'id': 'probability'});
        app.controller.list.setSortType(app.controller.list.DEFAULT_SORT);

        $('body').pagecontainer("change", "#sref");
        return;
      }

      app.controller.list.prob.sref = getSquare({'lat': location.lat, 'lon': location.lon});

      function getSquare(geoloc) {
        //get translated geoloc
        var p = new LatLonE(geoloc.lat, geoloc.lon, LatLonE.datum.OSGB36);
        var grid = OsGridRef.latLonToOsGrid(p);
        var gref = grid.toString(app.controller.list.prob.LOCATION_GRANULARITY);
        _log('list.prob: using gref: ' + gref + ".");

        //remove the spaces
        return gref.replace(/ /g, '');
      }

      if (!app.data.prob) {
        this.loadData();
        return;
      }
      this.onFilterSuccess();
    },


    filterList: function (list) {
      var filtered_list = [];

      var location_data = app.data.prob[this.sref];
      if (location_data) {
        var speciesIds = Object.keys(location_data);
        for (var i = 0; i < speciesIds.length; i++) {
          for (var j = 0; j < list.length; j++) {
            if (list[j].id === speciesIds[i]) {
              filtered_list.push(list[j]);
              break;
            }
          }
        }
      }
      return filtered_list;
    },

    sort: function (a, b) {
      function getProb(species) {
        var id = species.id;
        var sref = app.controller.list.prob.sref;
        var data = app.data.prob;
        return (data[sref] && data[sref][id]) || 0;
      }

      var a_prob = getProb(a);
      var b_prob = getProb(b);
      if (a_prob === b_prob) return 0;
      return a_prob < b_prob ? 1 : -1;
    }
  };
}(jQuery));
