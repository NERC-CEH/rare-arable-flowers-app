/*!
 * CONFIGURATION.
 */

//app wide settings
app.CONF.VERSION = '0'; //grunt replaced. Application (controllers and data) version
app.CONF.NAME = 'app'; //grunt replaced.

app.CONF.HOME = "raf/dist/";
app.CONF.LOG = app.LOG_DEBUG;


//controllers
var c = app.controller;
c.list.prob.CONF.PROB_DATA_SRC = "data/abundance.json";
c.list.CONF.SPECIES_DATA_SRC = "data/species.json";

//JQM configuration
$.mobile.ns = "";
$.mobile.autoInitializePage = true;
$.mobile.subPageUrlKey = "ui-page";
$.mobile.activePageClass = "ui-page-active";
$.mobile.activeBtnClass = "ui-btn-active";
$.mobile.ajaxEnabled = true;
$.mobile.hashListeningEnabled = true;
$.mobile.defaultPageTransition = "";
$.defaultDialogTransition = "";
$.mobile.minScrollBack = "150";
$.mobile.loadingMessage = "Loading";
$.mobile.pageLoadErrorMessage = "Error Loading Page";
$.mobile.linkBindingEnabled = true;
$.mobile.pushStateEnabled = true;
$.mobile.touchOverflowEnabled = 0;
