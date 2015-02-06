/***********************************************************************
 * JQM NAVIGATION MODULE
 **********************************************************************/

var app = app || {};
app.navigation = (function (m, $) {
  "use strict";
  /*global _log*/

  /**
   * Updates the dialog box appended to the page
   * todo: remove hardcoded dialog ID
   */
  m.makeDialog = function (text) {
    $('#app-dialog-content').empty().append(text);
  };

  /**
   * Created a popup.
   * todo: remove hardcoded popup ID
   *
   * @param text
   * @param addClose
   */
  m.popup = function (text, addClose) {
    this.makePopup(text, addClose);
    var popup = $('#app-popup');
    popup.popup();
    popup.popup('open').trigger('create');
  };

  /**
   * Updates the popup div appended to the page
   */
  m.makePopup = function (text, addClose) {
    var PADDING_WIDTH = 10;
    var PADDING_HEIGHT = 20;
    var CLOSE_KEY = "<a href='#' data-rel='back' data-role='button '" +
      "data-theme='b' data-icon='delete' data-iconpos='notext '" +
      "class='ui-btn-right ui-link ui-btn ui-btn-b ui-icon-delete " +
      "ui-btn-icon-notext ui-shadow ui-corner-all '" +
      "role='button'>Close</a>";

    if (addClose) {
      text = CLOSE_KEY + text;
    }

    if (PADDING_WIDTH > 0 || PADDING_HEIGHT > 0) {
      text = "<div style='padding:" + PADDING_WIDTH + "px " + PADDING_HEIGHT + "px;'>" +
      text + "<div>";
    }

    $('#app-popup').empty().append(text);
  };

  /**
   * Closes a popup.
   * todo: remove hardcoded popup ID
   */
  m.closePopup = function () {
    $('#app-popup').popup("close");
  };

  /**
   * Creates a loader
   */
  m.makeLoader = function (text, time) {
    //clear previous loader
    $.mobile.loading('hide');

    //display new one
    $.mobile.loading('show', {
      theme: "b",
      html: "<div style='padding:5px 5px;'>" + text + "</div>",
      textVisible: true,
      textonly: true
    });

    setTimeout(function () {
      $.mobile.loading('hide');
    }, time);
  };

  /**
   * Displays a self disappearing lightweight message.
   *
   * @param text
   * @param time 0 if no hiding, null gives default 3000ms delay
   */
  m.message = function (text, time) {
    if (!text) {
      _log('NAVIGATION: no text provided to message.', morel.LOG_ERROR);
      return;
    }

    var messageId = 'morelLoaderMessage';

    text = '<div id="' + messageId + '">' + text + '</div>';

    $.mobile.loading('show', {
      theme: "b",
      textVisible: true,
      textonly: true,
      html: text
    });

    //trigger JQM beauty
    $('#' + messageId).trigger('create');

    if (time !== 0) {
      setTimeout(function () {
        $.mobile.loading('hide');
      }, time || 3000);
    }
  };

  /**
   * Opens particular morel page-path.
   *
   * @param delay
   * @param path If no path supplied goes to morel.PATH
   */
  m.go = function (delay, basePath, path) {
    setTimeout(function () {
      path = path ? "" : path;
      window.location = basePath + morel.CONF.HOME + path;
    }, delay);
  };

  return m;
}(app.navigation || {}, jQuery));

/*****************
 * Module END
 *****************/

/**
 * Since the back button does not work in current iOS 7.1.1 while in app mode,
 * it is necessary to manually assign the back button urls.
 *
 * Set up the URL replacements so that the id of the page is matched with the
 * new URL of the back buttons it contains. The use of wild cards is possible:

 backButtonUrls = {
  'app-*':'home',
  'app-examples':'home',
  'tab-location':'home'
};
 */

/**
 * Fixes back buttons for specific page
 */
/*jslint unparam: true*/
function fixPageBackButtons(currentPageURL, nextPageId) {
  "use strict";
  console.log('FIXING: back buttons ( ' + nextPageId + ')');

  var $buttons = jQuery("div[id='" + nextPageId + "'] a[data-rel='back']");
  $buttons.each(function (index, button) {
    jQuery(button).removeAttr('data-rel');

    //skip external pages
    if (currentPageURL) {
      //assign new url to the button
      jQuery(button).attr('href', currentPageURL);
    }
  });
}
/*jslint unparam: false*/

/**
 * Generic function to detect the browser
 *
 * Chrome has to have and ID of both Chrome and Safari therefore
 * Safari has to have an ID of only Safari and not Chrome
 */
function browserDetect(browser) {
  "use strict";
  if (browser === 'Chrome' || browser === 'Safari') {
    var isChrome = navigator.userAgent.indexOf('Chrome') > -1,
      isSafari = navigator.userAgent.indexOf("Safari") > -1,
      isMobile = navigator.userAgent.indexOf("Mobile") > -1;

    if (isSafari) {
      if (browser === 'Chrome') {
        //Chrome
        return isChrome;
      }
      //Safari
      return !isChrome;
    }
    if (isMobile) {
      //Safari homescreen Agent has only 'Mobile'
      return true;
    }
    return false;
  }
  return (navigator.userAgent.indexOf(browser) > -1);
}

/**
 * Starts an Appcache Manifest Downloading.
 *
 * @param id
 * @param filesNum
 * @param src
 * @param callback
 * @param onError
 */
function startManifestDownload(id, filesNum, src, callback, onError) {
  "use strict";
  /*todo: Add better offline handling:
   If there is a network connection, but it cannot reach any
   Internet, it will carry on loading the page, where it should stop it
   at that point.
   */
  if (navigator.onLine) {
    src = morel.CONF.basePath + src + '?base_path=' + morel.CONF.basePath + '&files=' + filesNum;
    var frame = document.getElementById(id);
    if (frame) {
      //update
      frame.contentWindow.applicationCache.update();
    } else {
      //init
      //app.navigation.popup('<iframe id="' + id + '" src="' + src + '" width="215px" height="215px" scrolling="no" frameBorder="0"></iframe>', true);
      app.navigation.message('<iframe id="' + id + '" src="' + src + '" width="215px" height="215px" scrolling="no" frameBorder="0"></iframe>', 0);
      frame = document.getElementById(id);

      //After frame loading set up its controllers/callbacks
      frame.onload = function () {
        _log('Manifest frame loaded', morel.LOG_INFO);
        if (callback) {
          frame.contentWindow.finished = callback;
        }

        if (onError) {
          frame.contentWindow.error = onError;
        }
      };
    }
  } else {
    $.mobile.loading('show', {
      text: "Looks like you are offline!",
      theme: "b",
      textVisible: true,
      textonly: true
    });
  }
}

/**
 * Adds Enable/Disable JQM Tab functionality
 * FROM: http://kylestechnobabble.blogspot.co.uk/2013/08/easy-way-to-enable-disable-hide-jquery.html
 * USAGE:
 * $('MyTabSelector').disableTab(0);        // Disables the first tab
 * $('MyTabSelector').disableTab(1, true);  // Disables & hides the second tab
 */
function extendDisableTabFunctionality() {
  "use strict";

  $.fn.disableTab = function (tabIndex, hide) {

    // Get the array of disabled tabs, if any
    var disabledTabs = this.tabs("option", "disabled");

    if ($.isArray(disabledTabs)) {
      var pos = $.inArray(tabIndex, disabledTabs);

      if (pos < 0) {
        disabledTabs.push(tabIndex);
      }
    }
    else {
      disabledTabs = [tabIndex];
    }

    this.tabs("option", "disabled", disabledTabs);

    if (hide === true) {
      $(this).find('li:eq(' + tabIndex + ')').addClass('ui-state-hidden');
    }

    // Enable chaining
    return this;
  };

  $.fn.enableTab = function (tabIndex) {

    // Remove the ui-state-hidden class if it exists
    $(this).find('li:eq(' + tabIndex + ')').removeClass('ui-state-hidden');

    // Use the built-in enable function
    this.tabs("enable", tabIndex);

    // Enable chaining
    return this;

  };
}


function fixIOSbuttons () {
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
}

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