/******************************************************************************
 * Asks the user to start an appcache download process.
 *****************************************************************************/
define(['jquery'], function ($) {
    var Download = function (callback, silent) {
        //for some unknown reason on timeout the popup does not disappear
        setTimeout(function () {
            function onSuccess() {
                app.models.user.set('downloaded-app', true);
                app.models.user.save();

                //Send update to Google Analytics
                if (app.CONF.GA.STATUS){
                    require(['ga'], function (ga) {
                        if (app.browser.isMobile()){
                            ga('send', 'event', 'app', 'downloadSuccess');
                        } else {
                            ga('send', 'event', 'app', 'downloadDesktopSuccess');
                        }
                    });
                }

                var message =
                    '<center><h3>Lovely jubbly, you are ready to go!</h3></center>';

                if (!silent) {
                    app.message(message, 3000);
                }

                callback && callback();
            }

            function onError(error) {
                _log(error, log.ERROR);
                app.message(error);
            }

            startManifestDownload('appcache', onSuccess, onError, silent);
        }, 500);
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
    function startManifestDownload (id, callback, onError, silent) {
        /*todo: Add better offline handling:
         If there is a network connection, but it cannot reach any
         Internet, it will carry on loading the page, where it should stop it
         at that point.
         */
        if (navigator.onLine) {
            var src = app.CONF.OFFLINE.APPCACHE_URL;
            var frame = document.getElementById(id);
            if (frame) {
                //update
                frame.contentWindow.applicationCache.update();
            } else {
                var frameHtml = '<iframe id="' + id + '" src="' + src + '" width="215px" height="215px" scrolling="no" frameBorder="0"></iframe>';

                //init
                if (silent) {
                    $('body').append('<div style="display:none">' + frameHtml + '</div>')
                } else {
                    app.message(frameHtml, 0);
                }
                frame = document.getElementById(id);

                //After frame loading set up its controllers/callbacks
                frame.onload = function () {
                    _log('Manifest frame loaded', log.INFO);
                    if (callback != null) {
                        frame.contentWindow.finished = callback;
                    }

                    if (onError != null) {
                        frame.contentWindow.error = onError;
                    }
                }
            }
        } else {
            app.message("<center><h2>Sorry</h2></center><br/><h3>Looks like you are offline!</h3>");
        }
    };

    return Download;
});