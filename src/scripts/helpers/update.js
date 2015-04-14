/******************************************************************************
 * Updates the app's data if the source code version mismatches the stored
 * data's version.
 *****************************************************************************/
define([], function () {
  var CheckForUpdates = function () {
    var appVer = app.models.app.get('appVer');
    if (appVer !== app.VERSION) {
      _log('helpers: app version differs. Updating.', log.INFO);

      //set new version
      app.models.app.save('appVer', app.VERSION);

      if (app.CONF.GA.STATUS) {
        require(['ga'], function(ga) {
          ga('send', 'event', 'app', 'updateSuccess');
        });
      }
    }
  };

  return CheckForUpdates;
});
