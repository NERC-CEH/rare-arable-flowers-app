/******************************************************************************
 * Takes care of application execution logging.
 *
 * Depends on morel.
 *
 * Uses 5 levels of logging:
 *  0: none
 *  1: errors
 *  2: warnings
 *  3: information
 *  4: debug
 *
 * Levels values defined in core app module.
 *****************************************************************************/
define([], function () {
  window.log = {
    NONE: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4,

    CONF: {
      STATUS: 4,
      GA_ERROR: false //google analytics error logging
    },

    core: function (message, level) {
      "use strict";
      //do nothing if logging turned off
      if (log.CONF.STATE === log.NONE) {
        return;
      }

      if (log.CONF.STATE >= level || !level) {
        switch (level) {
          case log.ERROR:
            log.error(message);
            break;
          case log.WARNING:
            console.warn(message);
            break;
          case log.INFO:
            console.log(message);
            break;
          case log.DEBUG:
          /* falls through */
          default:
            //IE does not support console.debug
            if (!console.debug) {
              console.log(message);
              break;
            }
            console.debug(message);
        }
      }
    },


    /**
     * Prints and posts an error to the mobile authentication log.
     *
     * @param error Object holding a 'message', and optionally 'url' and 'line' fields.
     *              String holding a 'message
     * @private
     */
    error: function (error) {
      "use strict";
      if (typeof error === 'string' || error instanceof String) {
        error = {
          message: error
        }
      }
      console.error(error.message, error.url, error.line);

      if (app.CONF.GA.STATUS && log.CONF.GA_ERROR){
        require(['ga'], function (ga) {
          //check if the error did not occur before the analytics is loaded
          if (ga) {
            ga('send', 'exception', {
              'exDescription': error.message + ' ' +  error.url + ' ' +  error.line
            });
          }
        });
      }
    },

    /**
     * Hook into window.error function.
     *
     * @param message
     * @param url
     * @param line
     * @returns {boolean}
     * @private
     */
    onError: function (message, url, line) {
      "use strict";
      window.onerror = null;

      var error = {
        'message': message,
        'url': url || '',
        'line': line || -1
      };

      _log(error, log.ERROR);

      window.onerror = this; // turn on error handling again
      return true; // suppress normal error reporting
    }

  };

  window._log = log.core;
  window.onerror = log.onError;
});
