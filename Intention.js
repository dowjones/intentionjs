'use strict';
var intentionWrapper = function($, _){

  var Intention = function(params){
    var intent = $.extend(this, params, 
        {_listeners:{}, contexts:[], elms:$()});

    return intent;
  };

  Intention.prototype = {

    // public methods
    // TODO: break this function down a bit
    responsive:function(contexts, matcher, measure){
      var currentContext;

      // if no matcher function is specified expect to compare a 
      // string to the ctx.name property
      if(_.isFunction(matcher) === false) {
        matcher = function(measure, ctx){
          return measure === ctx.name;
        };
      }
      //  check for measure and if not there 
      // function takes one arg and returns it
      if(_.isFunction(measure) === false) {
        measure = _.identity;
      }
      // bind an the respond function to each context name
      _.each(contexts, function(ctx){
        this.on(ctx.name, _.bind(
            function(){this._respond(this.contexts, this.elms);}, this));
      }, this);
      
      var responder = _.bind(function(){
        
        var measurement = measure.apply(this, arguments);

        _.every(contexts, function(ctx){
          if( matcher(measurement, ctx)) {
            // first time, or different than last context
            if( (currentContext===undefined) || 
              (ctx.name !== currentContext.name)){
              currentContext = ctx;
              this.contexts = this._contextualize(ctx, contexts, 
                  this.contexts);
              // emit the context event
              this._emitter($.extend({}, {type:currentContext.name}, 
                currentContext), this);
              
              // done, break the loop
              return false;
            }
            // same context, break the loop
            return false;
          }
          return true;
        }, this);
        // return the intention object for chaining
        return this;

      }, this);
      // this makes the contexts accessible from the outside world
      responder.axis = contexts;

      return responder;
    },

    elements: function(scope){

      // find all responsive elms in a specific dom scope
      if(!scope) scope = document;

      $('[data-intent],[intent],[data-in],[in]', 
          scope).each(_.bind(function(i, elm){
            this.add($(elm));
          }, this));

      return this;
    },

    add: function(elms, spec){
      // is expecting a jquery object
      elms.each(_.bind(function(i, elm){
        var exists = false;
        this.elms.each(function(i, respElm){
          if(elm === respElm) {
            exists=true;
            return false;
          }
        });

        if(exists === false){
          // create the elements responsive data
          $(elm).data('intent.spec',
            this._fillSpec(
              $.extend(true, spec, this._attrsToSpec(elm.attributes))));
          // make any appropriate changes based on the current contexts
          this._makeChanges($(elm), this._changes(
            $(elm).data('intent.spec'), this.contexts));

          this.elms.push(elm);
        }

      }, this));

      return this;
    },

    remove: function(elms){
      // is expecting a jquery object
      var respElms = this.elms;
      // elms to remove
      elms.each(function(i, elm){
        // elms to check against
        respElms.each(function(i, candidate){
          if(elm === candidate){
            respElms.splice(i, 1);
            // found the match, break the loop
            return false;
          }
        });
      });
      return this;
    },

    is: function(ctxName){
      return _.some(this.contexts, function(ctx){
        return ctxName === ctx.name;
      });
    },

    // code and concept taken from simple implementation of 
    // observer pattern outlined here:
    // http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
    on: function(type, listener){
      if(this._listeners[type] === undefined) {
        this._listeners[type]=[];
      }
      this._listeners[type].push(listener);
    },

    off: function(type, listener){
      if(_.isArray(this._listeners[type])){
        var listeners = this._listeners[type],
          i;
        for(i=0;listeners.length; i++){
          if(listeners[i] === listener){
            listeners.splice(i,1);
            break;
          }
        }
      }
    },

    _emitter: function(event){
      if(typeof event === 'string') {
        event={type:event};
      }
      if(!event.target){
        event.target=this;
      }
      if(!event.type){
        throw new Error(event.type + ' is not a supported event.');
      }
      if(_.isArray(this._listeners[event.type])){
        var listeners = this._listeners[event.type],
          i;
        for(i=0; i<listeners.length; i++){
          listeners[i].call(this, event);
        }
      }
    },

    _fillSpec: function(spec){

      var applyToContext = function(func){
        return function(funcName){
          _.each(spec, function(ctx){
            func(ctx, funcName);
          });
        };
      };

      applyToContext(function(ctx){
        _.each(ctx, function(val, funcName){
          applyToContext(function(ctx, funcName){
            if(ctx[funcName] === undefined) ctx[funcName] = '';
          })(funcName)
        });
      })();

      return spec;
    },

    _attrsToSpec: function(attrs){

      var spec={},
        pattern = new RegExp(
          '(^(data-)?(in|intent)-)?([_a-zA-Z0-9]+)-([A-Za-z:-]+)'),
        addProp=function(obj, name, value){
          obj[name] = value;
          return obj;
        };
      _.each(attrs, function(attr){
        var specMatch = attr.name.match(pattern);
        if(specMatch !== null) {
          specMatch = specMatch.slice(-2);
        
          $.extend(true, spec, addProp({}, specMatch[0],
            addProp({}, specMatch[1], attr.value)));
        }
      });

      return spec;
    },

    _resolveSpecs: function(specList, specs){
      var changes={},
        moveFuncs=['append', 'prepend', 'before', 'after'];

      _.each(specList, function(specName){
        _.each(specs[specName], function(val, func){
          if(func==='class'){
            if(!changes[func]) changes[func] = [];

            changes[func] = _.union(changes[func], val.split(' '));

          } else if(((changes.move === undefined) || 
              (changes.move.value === '')) && 
              ($.inArray(func, moveFuncs) !== -1)){

            changes.move = {value:val, placement:func};

          } else {
            if((changes[func] === undefined) || (changes[func] === '')){
              changes[func]=val;
            }
          }
        }, this);
      }, this);
      return changes;
    },

    _changes: function(specs, contexts){

      var changes = {},
        inSpecs=[], outSpecs=[];

      _.each(contexts, function(ctx){
        if(specs[ctx.name] !== undefined) {
          inSpecs.push(ctx.name);
          return;
        }
      });
      _.each(specs, function(spec, specName){
        var match;
        _.each(inSpecs, function(spec){
          if(specName===spec){
            match=true;
          }
        });
        if(!match) outSpecs.push(specName);
      }, this);
      return {
        inSpecs:this._resolveSpecs(inSpecs, specs),
        outSpecs:this._resolveSpecs(outSpecs, specs)
      };
    },

    _makeChanges: function(elm, changes){
      
      _.each(changes.inSpecs, function(change, func){
        if(func==='move'){
          if( (elm.data('intent.placement') !== change.placement)
            || (elm.data('intent.move') !== change.value)){

            $(change.value)[change.placement](elm);
            // save the last placement of the element so 
            // we're not moving it around for no good reason
            elm.data('intent.placement', change.placement);
            elm.data('intent.move', change.value);
          }
        } else if(func === 'class') {

          var classes = elm.attr('class') || '';
          
          classes = _.union(change, 
            _.difference(classes.split(' '), changes.outSpecs['class']));
          
          elm.attr('class', classes.join(' '));

        } else {
          elm.attr(func, change);
        }
      }, this);

      return elm;
    },

    _respond: function(contexts, elms){
      // go through all of the responsive elms
      elms.each(_.bind(function(i, elm){
        var $elm = $(elm);
        this._makeChanges($elm, this._changes(
          $elm.data('intent.spec'), contexts));

        $elm.trigger('intent', this);
      }, this));
    },

    _contextualize: function(context, axis, currentContexts){

      var index = -1;
      // go through the axis first because the current context list 
      // can be empty
      _.every(axis, function(current){

        if(index !== -1) return false;

        _.every(currentContexts, function(ctx, i){
          if(ctx===current){
            index = i;
            return false;
          }
          return true;
        });
        return true;
      });

      if(index !== -1) {
        currentContexts.splice(index, 1, context);
      } else {
        currentContexts.unshift(context);
      }
      return currentContexts;
    }
  };
  return Intention;
};

(function(root, factory) {
  if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'));
  } else if (typeof define === 'function' && define.amd) {
    define(['jquery', 'underscore'], factory);
  } else {
    root.Intention = factory(root.jQuery, root._);
  }
}(this, intentionWrapper));