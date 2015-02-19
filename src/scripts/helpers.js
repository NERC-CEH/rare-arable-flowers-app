var app = app || {};

/**
 * Displays a self disappearing lightweight message.
 *
 * @param text
 * @param time 0 if no hiding, null gives default 3000ms delay
 */
app.message = function (text, time) {
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
 * Asks the user to start an appcache download
 * process.
 */
app.download =  function () {
  var downloadedApp = app.models.user.get('downloadedApp');
  var dontAskDownloadApp = app.models.user.get('dontAskDownloadApp');

  if (!downloadedApp && !dontAskDownloadApp) {
    var donwloadBtnId = "download-button";
    var donwloadCancelBtnId = "download-cancel-button";
    var downloadCheckbox = "download-checkbox";

    var message =
      '<h3>Start downloading the app for offline use?</h3></br>' +

      '<label><input id="' + downloadCheckbox + '" type="checkbox" name="checkbox-0 ">Don\'t ask again' +
      '</label> </br>' +

      '<button id="' + donwloadBtnId + '" class="ui-btn">Download</button>' +
      '<button id="' + donwloadCancelBtnId + '" class="ui-btn">Cancel</button>';

    app.message(message, 0);

    $('#' + donwloadBtnId).on('click', function () {
      _log('helpers: starting appcache downloading process.', app.LOG_DEBUG);
      $.mobile.loading('hide');

      //for some unknown reason on timeout the popup does not disappear
      setTimeout(function () {
        function onSuccess() {
          app.models.user.save('downloadedApp', true);
          window.location.reload();
        }

        function onError() {
          _log('helpers: ERROR appcache.');
        }

        app.startManifestDownload('appcache', onSuccess, onError);
      }, 500);
    });

    $('#' + donwloadCancelBtnId).on('click', function () {
      _log('helpers: appcache dowload canceled.', app.LOG_DEBUG);
      $.mobile.loading('hide');

      var dontAsk = $('#' + downloadCheckbox).prop('checked');
      app.models.user.save('downloadedApp', false);
      app.models.user.save('dontAskDownloadApp', dontAsk);
    });
  }
};

/**
 * Starts an Appcache Manifest Downloading.
 *
 * @param id
 * @param files_no
 * @param src
 * @param callback
 * @param onError
 */
app.startManifestDownload = function (id, callback, onError) {
  /*todo: Add better offline handling:
   If there is a network connection, but it cannot reach any
   Internet, it will carry on loading the page, where it should stop it
   at that point.
   */
  if (navigator.onLine) {
    var src = app.CONF.APPCACHE_SRC;
    var frame = document.getElementById(id);
    if (frame) {
      //update
      frame.contentWindow.applicationCache.update();
    } else {
      //init
      app.message('<iframe id="' + id + '" src="' + src + '" width="215px" height="215px" scrolling="no" frameBorder="0"></iframe>', 0);
      frame = document.getElementById(id);

      //After frame loading set up its controllers/callbacks
      frame.onload = function () {
        _log('Manifest frame loaded', app.LOG_INFO);
        if (callback != null) {
          frame.contentWindow.finished = callback;
        }

        if (onError != null) {
          frame.contentWindow.error = onError;
        }
      }
    }
  } else {
    app.message("Looks like you are offline!");
  }
};

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
 * Generic function to detect the browser
 *
 * Chrome has to have and ID of both Chrome and Safari therefore
 * Safari has to have an ID of only Safari and not Chrome
 */
app.browserDetect = function (browser) {
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
};

app.fixIOSbuttons = function () {
  //Fixing back buttons for Mac 7.* History bug.
  $(document).on('pagecreate', function (event, ui) {
    if (app.browserDetect('Safari')) {
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

  /**
   * Fixes back buttons for specific page
   */
  /*jslint unparam: true*/
  function fixPageBackButtons  (currentPageURL, nextPageId) {
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
};

/**
 * Updates the app's data if the source code version mismatches the
 * stored data's version.
 */
app.checkForUpdates = function () {
  var appVer = app.models.app.get('appVer');
  if (appVer !== app.CONF.VERSION) {
    _log('helpers: app version differs. Updating.', morel.LOG_INFO);

    //set new version
    app.models.app.save('appVer', app.CONF.VERSION);
  }
};