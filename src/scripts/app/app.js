/*!
 * App wide logic.
 */

/*
!!!!QUICK FIX - REMOVE AFTER DONE!!!!
*/
function _log(message, level) {

  //do nothing if logging turned off
  if (app.CONF.LOG == morel.LOG_NONE) {
    return;
  }

  if (app.CONF.LOG >= level || !level) {
    switch (level) {
      case morel.LOG_ERROR:
  	    console.error(message.message, message.url, message.line);
        break;
      case morel.LOG_WARNING:
        console.warn(message);
        break;
      case morel.LOG_INFO:
        console.log(message);
        break;
      case morel.LOG_DEBUG:
      default:
        //IE does not support console.debug
        if (!console.debug) {
          console.log(message);
          break;
        }
        console.debug(message);
    }
  }
}

 function prepareData() {
  //load species data
  if (!morel.storage.is('species')) {
    $.ajax({
      url: app.CONF.SPECIES_DATA_SRC,
      dataType: 'json',
      async: false,
      success: function (json) {
        app.data = app.data || {};
        app.data.species = json;

        //saves for quicker loading
        morel.storage.set('species', json);
        app.collections.species = new app.collections.Species(morel.storage.get('species'));

        //todo: what if data comes first before show
        app.controller.list.renderList();
      }
    });
  } else {
   // app.data = app.data || {};
  //  app.data.species = morel.storage.get('species');

    //create global species collection
    app.collections.species = new app.collections.Species(morel.storage.get('species'));
  }
}

//overwrite morel user append function to match backbone
morel.auth.getUser = function () {
  return app.models.user.attributes;
};

$(document).ready(function(){
  _log('document ready!');

  //prepareData();

  app.router = new app.Router();
  Backbone.history.start();

  app.checkForUpdates();
  app.extendDisableTabFunctionality();
  app.fixIOSbuttons();

  FastClick.attach(document.body);
});
