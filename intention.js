/*!
 * intention.js Library v1.0.0
 * http://intentionjs.com/
 *
 * Copyright 2011, 2013 Dowjones and other contributors
 * Released under the MIT license
 *
 */

(function (root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
    ], factory);
  } else {
    // Browser globals
    root.Intention = factory();
  }

}(this, function () {

  // utils
  var slice = Array.prototype.slice;

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  var Ctor = function(){};

  function bind(func, context) {

    var args, bound;
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (isObject(result)) return result;
      return self;
    };
    return bound;
  }

  function each(obj, iteratee) {
    if (obj == null) return obj;
    var i, length = obj.length;
    for (i = 0; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
    return obj;
  }

  function some(obj, predicate) {
    if (obj == null) return false;
    var length = obj.length,
        index;
    for (index = 0; index < length; index++) {
      if (predicate(obj[index], index, obj)) return true;
    }
    return false;
  }

  function every(obj, predicate) {
    if (obj == null) return true;
    var length = obj.length,
        index;
    for (index = 0; index < length; index++) {
      if (!predicate(obj[index], index, obj)) return false;
    }
    return true;
  }

  function extend(obj) {
    if (!isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }


  'use strict';
  var Intention = function (params) {
    var intent = extend(this, params, {
      _listeners: {},
      contexts: [],
      axes: {},
      priority: []
    });
    return intent;
  };
  Intention.prototype = {
    /**************************************************************
     *
     * @public methods
     *
     **************************************************************/
    responsive: function responsive(contexts, options) {
      // for generating random ids for axis when not specified
      var idChars = 'abcdefghijklmnopqrstuvwxyz0123456789',
          len = idChars.length, id = '', i;
      // create a random id for the axis
      for (i = 0; i < 5; i++) {
        id += idChars[Math.floor(Math.random() * len)];
      }
      var defaults = {
        matcher: function (measure, ctx) {
          return measure === ctx.name;
        },
        measure: function(x){return x;},
        ID: id
      };
      if (isObject(options) === false) {
        options = {};
      }
      if (isArray(contexts) && isArray(contexts[0].contexts)) {
        each(contexts, bind(function (axis) {
          responsive.apply(this, axis);
        }, this));
        return;
      }
      if (isArray(contexts) === false && isObject(contexts)) {
        options = contexts;
      } else {
        options.contexts = contexts;
      }
      // fill in the options
      options = extend({}, defaults, options);
      // bind the respond function to the axis ID and prefix it
      // with an underscore so that it does not get whomped accidentally
      this.on('_' + options.ID + ':', bind(function (e) {
        this.axes = this._contextualize(options.ID, e.context, this.axes);
        this.postContext();
      }, this));
      var axis = {
        ID: options.ID,
        current: null,
        contexts: options.contexts,
        respond: bind(this._responder(options.ID, options.contexts, options.matcher, options.measure), this)
      };
      this.axes[options.ID] = axis;
      this.axes.__keys__ = this.priority;
      this.priority.unshift(options.ID);
      return axis;
    },

    is: function (ctxName) {
      var axes = this.axes;
      return some(axes.__keys__, function (key) {
        return ctxName === axes[key].current;
      });
    },
    current: function (axisName) {
      if (this.axes.hasOwnProperty(axisName)) {
        return this.axes[axisName].current;
      } else {
        return false;
      }
    },
    on: function (type, listener) {
      var events = type.split(' '), i = 0;
      for (i; i < events.length; i++) {
        if (this._listeners[events[i]] === undefined) {
          this._listeners[events[i]] = [];
        }
        this._listeners[events[i]].push(listener);
      }
      return this;
    },
    off: function (type, listener) {
      if (isArray(this._listeners[type])) {
        var listeners = this._listeners[type], i = 0;
        for (i; i < listeners.length; i++) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
      return this;
    },
    /**************************************************************
     *
     *@private methods
     *
     **************************************************************/

    postContext: function(){},

    _responder: function (axisID, contexts, matcher, measure) {
      var currentContext;
      // called to perform a check
      return function () {
        var measurement = measure.apply(this, arguments);
        every(contexts, bind(function (ctx) {
          if (matcher(measurement, ctx)) {
            // first time, or different than last context
            if (currentContext === undefined || ctx.name !== currentContext.name) {
              currentContext = ctx;
              // event emitting!
              // emit the private axis event
              this._emitter({
                _type: '_' + axisID + ':',
                context: currentContext.name
              }, currentContext, this)._emitter({
                _type: axisID + ':',
                context: currentContext.name
              }, currentContext, this)
                ._emitter(
                  extend({},
                           { _type: axisID + ':' + currentContext.name },
                           currentContext),
                  currentContext, this)
                ._emitter(extend({},
                                   { _type: currentContext.name },
                                   currentContext), currentContext, this);
              // done, break the loop
              return false;
            }
            // same context, break the loop
            return false;
          }
          return true;
        }, this));
        // return the intention object for chaining
        return this;
      };
    },
    _emitter: function (event) {
      if (typeof event === 'string') {
        event = { _type: event };
      }
      if (!event.target) {
        event.target = this;
      }
      if (!event._type) {
        throw new Error(event._type + ' is not a supported event.');
      }
      if (isArray(this._listeners[event._type])) {
        var listeners = this._listeners[event._type], i;
        for (i = 0; i < listeners.length; i++) {
          listeners[i].apply(this, arguments);
        }
      }
      return this;
    },

    _assocAxis: function (ctx, axes) {
      var match = false;
      every(axes.__keys__, function (axis) {
        if (match === false) {
          every(axes[axis].contexts, function (ctxCandidate) {
            if (ctxCandidate.name === ctx) {
              match = axis;
              return false;
            }
            return true;
          });
          return true;
        } else {
          return false;
        }
      });
      return match;
    },

    _currentContexts: function (axes) {
      var contexts = [];
      each(axes.__keys__, function (ID) {
        if (axes[ID].current !== null) {
          contexts.push({
            ctx: axes[ID].current,
            axis: ID
          });
          return;
        }
      });
      return contexts;
    },

    _contextConfig: function (specs, axes) {
      return this._resolveSpecs(this._currentContexts(axes), specs, axes);
    },

    _contextualize: function (axisID, context, axes) {
      axes[axisID].current = context;
      return axes;
    },
    _axis_test_pattern: new RegExp('^_[a-zA-Z0-9]'),
    _axis_match_pattern: new RegExp('^_([a-zA-Z0-9][_a-zA-Z0-9]*)'),
    _trim_pattern: new RegExp('^s+|s+$', 'g')
  };
  return Intention;
}));
