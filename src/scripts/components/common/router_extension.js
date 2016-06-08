// https://gist.github.com/richardassar/5126900
import Backbone from 'backbone';
import _ from 'lodash';

var leave, leaveArgs;

_.extend(Backbone.Router.prototype, Backbone.Events, {
  route : function(route, name, callback) {
    if(!callback)
      callback = name;

    var before
      , fn = callback
      , after;

    Backbone.history || (Backbone.history = new Backbone.History);

    if(!_.isRegExp(route))
      route = this._routeToRegExp(route);

    if(!fn)
      fn = name;

    if(typeof callback == 'object'){
      before = callback.before;
      fn = callback.route;
      after = callback.after;
    }

    Backbone.history.route(route, _.bind(function(fragment) {
      var args = this._extractParameters(route, fragment);

      if(leave) {
        if(leave.apply(this, leaveArgs) === false)
          return;
        else
          leave = false;
      }

      if(before && before.apply(this, args) === false) return;

      fn.apply(this, args);

      /******************
       * My Modification - every page scroll to start
       ******************/
      scroll(0, 0);
      /******************
       * End
       ******************/

      if(after && after.apply(this, args) === false) return;

      if(typeof callback == 'object') {
        leave = callback.leave;
        leaveArgs = args;
      }

      this.trigger.apply(this, ['route:' + name].concat(args));
      this.trigger('route', name, args);
      Backbone.history.trigger('route', this, name, args);
    }, this));

    return this;
  }
});
