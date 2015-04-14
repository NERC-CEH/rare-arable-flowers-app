/******************************************************************************
 * Generic function to detect the browser
 *
 * Chrome has to have and ID of both Chrome and Safari therefore
 * Safari has to have an ID of only Safari and not Chrome
 *****************************************************************************/
define([], function () {
  BrowserDetect = function (browser) {
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

  return BrowserDetect;
});


