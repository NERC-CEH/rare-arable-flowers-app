/*!
 * CONFIGURATION.
 */

//app wide settings
morel.CONF.VERSION = '0'; //grunt replaced. Application (controllers and data) version
morel.CONF.NAME = 'app'; //grunt replaced.

morel.CONF.HOME = "raf/dist/";
morel.CONF.LOG = morel.LOG_DEBUG;


//controllers
var c = morel.controller;
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
