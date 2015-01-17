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
c.list.prob.CONF.PROB_DATA_SRC = "http://192.171.199.230/dragonfly/serv/abundance";
c.list.CONF.SPECIES_DATA_SRC = "http://192.171.199.230/dragonfly/serv/species";

c.species.CONF.FLIGHT_DATA_SRC = "http://192.171.199.230/dragonfly/serv/flight";