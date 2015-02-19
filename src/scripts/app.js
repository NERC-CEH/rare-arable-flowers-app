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

//overwrite morel user append function to match backbone
morel.auth.getUser = function () {
  return app.models.user.attributes;
};

$(document).ready(function(){
  app.checkForUpdates();

  app.router = new app.Router();
  Backbone.history.start();

  app.fixIOSbuttons();

  FastClick.attach(document.body);
});
