/******************************************************************************
 * Functions to work with browser information.
 *
 * Checks if the page is in the home screen (app) mode.
 * Generic function to detect the browser vendor.
 *
 * Chrome has to have and ID of both Chrome and Safari therefore
 * Safari has to have an ID of only Safari and not Chrome
 *****************************************************************************/
define([], function () {
  var detect = function (browser) {
    "use strict";
    if (browser === 'Chrome' || browser === 'Safari') {
      var isChrome = navigator.userAgent.indexOf('Chrome') > -1,
        isSafari = navigator.userAgent.indexOf("Safari") > -1;

      if (isSafari) {
        if (browser === 'Chrome') {
          //Chrome
          return isChrome;
        }
        //Safari
        return !isChrome;
      }
      if (isMobile()) {
        //Safari homescreen Agent has only 'Mobile'
        return true;
      }
      return false;
    }
    return (navigator.userAgent.indexOf(browser) > -1);
  };

  var isMobile = function () {
    var mobile = navigator.userAgent.indexOf("Mobile") > -1;
    var android = navigator.userAgent.indexOf("Android") > -1;
    return mobile || android;
  };

  var isHomeMode = function () {
    if (detect('Chrome')) {
      //http://java.dzone.com/articles/home-screen-web-apps-android
      navigator.standalone = navigator.standalone ||
      (screen.height-document.documentElement.clientHeight < 40);
    }

    return window.navigator.standalone ||
      (window.external.msIsSiteMode && window.external.msIsSiteMode());
  };

  return {
    detect: detect,
    isMobile: isMobile,
    isHomeMode: isHomeMode
  };
});


