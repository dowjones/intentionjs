(function (root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('underscore'), require('Intention'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'jQuery', 'underscore', 'Intention'
    ], factory);
  } else {
    // Browser globals
    root.Intention = factory(window.jQuery, window._, window.Intention);
  }

}(this, function ($, _, Intention) {

  var jqOpts = _.extend(Intention.prototype, {
    _fillSpec: function (spec) {

      var applySpec = function (fn) {
        _.each(spec, function (axisOptions, axis) {
          _.each(axisOptions, function (ctxOptions, ctx) {
            fn(ctxOptions, ctx, axis);
          });
        });
      }, filler = {};
      applySpec(function (options) {
        // check to see if the ctx val is an object, could be a string
        if (_.isObject(options)) {
          _.each(options, function (val, func) {
            filler[func] = '';
          });
        }
      });
      applySpec(function (options, ctx, axis) {
        if (_.isObject(options)) {
          spec[axis][ctx] = _.extend({}, filler, options);
        }
      });
      return spec;
    },
    _makeSpec: function (axis, ctx, sAttr, value, spec) {
      var axisObj;
      if (spec[axis] !== undefined) {
        axisObj = spec[axis];
        if (axisObj[ctx] === undefined) {
          axisObj[ctx] = {};
        }
      } else {
        axisObj = {};
        axisObj[ctx] = {};
        spec[axis] = axisObj;
      }
      axisObj[ctx][sAttr] = value;
      return spec;
    },
    _attrsToSpec: function (attrs, axes) {
      var spec = {},
          fullPattern = new RegExp('^(data-)?(in|intent)-(([a-zA-Z0-9][a-zA-Z0-9]*:)?([a-zA-Z0-9]*))-([A-Za-z:-]+)'),
          axisPattern = new RegExp('^(data-)?(in|intent)-([a-zA-Z0-9][_a-zA-Z0-9]*)$');

      _.each(attrs, function (attr) {
        var specMatch = attr.name.match(fullPattern),
            axisName;

        if (specMatch !== null) {
          specMatch = specMatch.slice(-3);
          axisName = specMatch[0];
          if (specMatch[0] === undefined || specMatch[0] === '') {
            // if there is no axis find one:
            specMatch[0] = this._assocAxis(specMatch[1], axes);
            if (specMatch[0] === false) {
              // there is no context, so get outa here
              return;  // skipt the attr
            }
          } else {
            specMatch[0] = specMatch[0].replace(/:$/, '');
          }

          specMatch.push(attr.value);
          specMatch.push(spec);
          spec = this._makeSpec.apply(this, specMatch);

        } else if (axisPattern.test(attr.name) && attr.value === '*') {

          axisName = attr.name.match(axisPattern)[3];
          _.each(axes[axisName].contexts, function (context) {
            this._makeSpec(axisName, context.name, 'class', context.name, spec);
          }, this);
        }
      }, this);
      return spec;
    },
    _contextSpec: function (ctxObj, specs) {
      if (specs.hasOwnProperty(ctxObj.axis) && specs[ctxObj.axis].hasOwnProperty(ctxObj.ctx)) {
        return specs[ctxObj.axis][ctxObj.ctx];
      }
      return {};
    },
    _resolveSpecs: function (currentContexts, specs) {
      var changes = {}, moveFuncs = [
        'append',
        'prepend',
        'before',
        'after'
      ];
      _.each(currentContexts, function (ctxObj) {
        // if the axis or the context to not exist in the specs object
        // skip to the next one
        _.each(this._contextSpec(ctxObj, specs), function (val, func) {
          if (func === 'class') {
            if (!changes[func]) {
              changes[func] = [];
            }
            changes[func] = _.union(changes[func], val.split(' '));
          } else if ((changes.move === undefined || changes.move.value === '') && $.inArray(func, moveFuncs) !== -1) {
            changes.move = {
              value: val,
              placement: func
            };
          } else {
            if (changes[func] === undefined || changes[func] === '') {
              changes[func] = val;
            }
          }
        }, this);
      }, this);
      return changes;
    },


    _makeChanges: function (elm, specs, axes) {
      if (_.isEmpty(axes) === false) {
        var ctxConfig = this._contextConfig(specs, axes);
        _.each(ctxConfig, function (change, func) {
          if (func === 'move') {
            if (specs.__placement__ !== change.placement || specs.__move__ !== change.value) {
              $(change.value)[change.placement](elm);
              // save the last placement of the element so
              // we're not moving it around for no good reason
              specs.__placement__ = change.placement;
              specs.__move__ = change.value;
            }
          } else if (func === 'class') {
            var classes = elm.attr('class') || '';
            // the class add/remove formula
            classes = _.union(change, _.difference(classes.split(' '), this._removeClasses(specs, axes)));
            elm.attr('class', classes.join(' '));
          } else {
            elm.attr(func, change);
          }
        }, this);
      }
      return elm;
    },






    _removeClasses: function (specs, axes) {
      var toRemove = [];
      _.each(axes.__keys__, function (key) {
        var axis = axes[key];
        _.each(axis.contexts, function (ctx) {
          // ignore the current context, those classes SHOULD be applied
          if (ctx.name === axis.current) {
            return;
          }
          var contextSpec = this._contextSpec({
            axis: axis.ID,
            ctx: ctx.name
          }, specs), classes;
          if (contextSpec !== undefined) {
            if (contextSpec['class'] !== undefined) {
              classes = contextSpec['class'].split(' ');
              if (classes !== undefined) {
                toRemove = _.union(toRemove, classes);
              }
            }
          }
        }, this);
      }, this);
      return toRemove;
    },

    _respond: function (axes, elms) {
      // go through all of the responsive elms
      elms.each(_.bind(function (i, elm) {
        var $elm = $(elm.elm);
        this._makeChanges($elm, elm.spec, axes);
        $elm.trigger('intent', this);
      }, this));
    },

    elements: function (scope) {
      // find all responsive elms in a specific dom scope
      if (!scope) {
        scope = document;
      }
      $('[data-intent],[intent],[data-in],[in]', scope).each(_.bind(function (i, elm) {
        this.add($(elm));
      }, this));
      return this;
    },
    add: function (elms, options) {
      var spec;
      if (!options) {
        options = {};
      }
      // is expecting a jquery object
      elms.each(_.bind(function (i, elm) {
        var exists = false;
        this.elms.each(function (i, respElm) {
          if (elm === respElm.elm) {
            exists = true;
            return false;
          }
          return true;
        });
        if (exists === false) {
          // create the elements responsive data
          spec = this._fillSpec(_.extend(options, this._attrsToSpec(elm.attributes, this.axes)));
          // make any appropriate changes based on the current contexts
          this._makeChanges($(elm), spec, this.axes);
          this.elms.push({
            elm: elm,
            spec: spec
          });
        }
      }, this));
      return this;
    },
    remove: function (elms) {
      // is expecting a jquery object
      var respElms = this.elms;
      // elms to remove
      elms.each(function (i, elm) {
        // elms to check against
        respElms.each(function (i, candidate) {
          if (elm === candidate.elm) {
            respElms.splice(i, 1);
            // found the match, break the loop
            return false;
          }
          return true;
        });
      });
      return this;
    },
    postContext: function(){
      this._respond(this.axes, this.elms);
    }
  });

  return function(){
    var intent = new Intention();
    intent.elms = $();
    return intent;
  };

}));
