/*!
 * App wide logic.
 */

(function($){
    checkForUpdates();
    app.initialise();

    //Fixing back buttons for Mac 7.* History bug.
    $(document).on('pagecreate', function(event, ui) {
        if (browserDetect('Safari')){
            if (jQuery.mobile.activePage != null) {
                var nextPageid = event.target.id;
                var currentPageURL = null;

                var external = jQuery.mobile.activePage.attr('data-external-page');
                if (external == null) {
                    currentPageURL = '#' + jQuery.mobile.activePage.attr('id');
                }

                fixPageBackButtons(currentPageURL, nextPageid);
            }
        }
    });


}(app.$ || jQuery));

/**
 * Updates the app's data if the source code version mismatches the
 * stored data's version.
 */
function checkForUpdates(){
    var CONTROLLER_VERSION_KEY = 'controllerVersion';
    var controllerVersion = app.settings(CONTROLLER_VERSION_KEY);
    //set for the first time
    if (controllerVersion == null){
        app.settings(CONTROLLER_VERSION_KEY, app.CONF.VERSION);
        return;
    }

    if (controllerVersion != app.CONF.VERSION){
        _log('app: controller version differs. Updating the app.', app.LOG_INFO);

        //TODO: add try catch for any problems
        app.storage.remove('species');
        app.storage.tmpClear();

        //set new version
        app.settings(CONTROLLER_VERSION_KEY, app.CONF.VERSION);
    }
}

/*
!!!!QUICK FIX - REMOVE AFTER DONE!!!!
*/
function _log(message, level) {

  //do nothing if logging turned off
  if (app.CONF.LOG == app.LOG_NONE) {
    return;
  }

  if (app.CONF.LOG >= level || level == null) {
    switch (level) {
      case app.LOG_ERROR:
  	console.error(message['message'], message['url'], message['line']);

        break;
      case app.LOG_WARNING:
        console.warn(message);
        break;
      case app.LOG_INFO:
        console.log(message);
        break;
      case app.LOG_DEBUG:
      default:
        //IE does not support console.debug
        if (console.debug == null) {
          console.log(message);
          break;
        }
        console.debug(message);
    }
  }
}

//start fastclick
$(function() {
  FastClick.attach(document.body);
});