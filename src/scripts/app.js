/*!
 * App wide logic.
 */

(function($){
    checkForUpdates();
    morel.initialise();

    //Fixing back buttons for Mac 7.* History bug.
    $(document).on('pagecreate', function(event, ui) {
        if (browserDetect('Safari')){
            if (jQuery.mobile.activePage) {
                var nextPageid = event.target.id;
                var currentPageURL = null;

                var external = jQuery.mobile.activePage.attr('data-external-page');
                if (!external) {
                    currentPageURL = '#' + jQuery.mobile.activePage.attr('id');
                }
                fixPageBackButtons(currentPageURL, nextPageid);
            }
        }
    });
}(morel.$ || jQuery));

/**
 * Updates the app's data if the source code version mismatches the
 * stored data's version.
 */
function checkForUpdates(){
    var CONTROLLER_VERSION_KEY = 'controllerVersion';
    var controllerVersion = morel.settings(CONTROLLER_VERSION_KEY);
    //set for the first time
    if (!controllerVersion){
        morel.settings(CONTROLLER_VERSION_KEY, morel.CONF.VERSION);
        return;
    }

    if (controllerVersion !== morel.CONF.VERSION){
        _log('app: controller version differs. Updating the morel.', morel.LOG_INFO);

        //TODO: add try catch for any problems
        morel.storage.remove('species');
        morel.storage.tmpClear();

        //set new version
        morel.settings(CONTROLLER_VERSION_KEY, morel.CONF.VERSION);
    }
}

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

//start fastclick
$(function() {
  FastClick.attach(document.body);
});