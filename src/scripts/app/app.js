/*!
 * App wide logic.
 */

/*
!!!!QUICK FIX - REMOVE AFTER DONE!!!!
*/
function _log(message, level) {

  //do nothing if logging turned off
  if (morel.CONF.LOG == morel.LOG_NONE) {
    return;
  }

  if (morel.CONF.LOG >= level || !level) {
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

        //todo: what if data comes first before show
        app.controller.list.renderList();
      }
    });
  } else {
    app.data = app.data || {};
    app.data.species = morel.storage.get('species');
  }
}

$(document).ready(function(){
  _log('document ready!');

  prepareData();

  app.router = new AppRouter();
  Backbone.history.start();

  checkForUpdates();

  fixIOSbuttons();
  FastClick.attach(document.body);
  extendDisableTabFunctionality();
});
