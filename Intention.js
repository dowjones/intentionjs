(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else if (typeof define === 'function' && define.amd) {
    define(['jquery', 'underscore'], factory);
  } else {
    root.Intention = factory(root.jQuery, root._);
  }
}(this, function($, _) {
  'use strict';

  var Intention = function(params){
    var intent = _.extend(this, params, 
        {_listeners:{}, contexts:[], elms:$(), axes:{}, priority:[]});

    return intent;
  };

  Intention.prototype = {

    // public methods
    responsive:function responsive(contexts, options){

      var idChars = 'abcdefghijklmnopqrstuvwxyz0123456789', 
          id='', i;

      // create a random id for the axis
      for(i=0; i<5; i++){
        id += idChars[Math.floor(Math.random() * idChars.length)]
      }

      var defaults = {
          // if no matcher function is specified expect to compare a 
          // string to the ctx.name property
          matcher: function(measure, ctx){
            return measure === ctx.name;
          },
          // function takes one arg and returns it  
          measure: _.identity,
          ID: id
        };

      if(_.isObject(options) === false) options = {};

      if((_.isArray(contexts)) && (_.isArray(contexts[0].contexts))){
        _.each(contexts, function(axis){
          responsive.apply(this, axis);
        }, this);
        return;
      }

      if((_.isArray(contexts) === false) && _.isObject(contexts)){
        options = contexts;
      } else {
        options.contexts = contexts;
      }

      // fill in the options
      options = _.extend({}, defaults, options);

      // bind an the respond function to the axis ID
      this.on(options.ID, _.bind(
          function(e){
            this.axes = this._contextualize(
              options.ID, e.context, this.axes);
            this._respond(this.axes, this.elms);

          }, this));
      
      var axis = {
        ID:[options.ID],
        current:null,
        contexts:options.contexts,
        respond:_.bind(this._responder(options.ID,
          options.contexts, options.matcher, options.measure), this)
      };

      this.axes[options.ID] = axis;

      this.axes.__keys__ = this.priority;

      this.priority.unshift(options.ID);

      return axis;
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

    add: function(elms, options){

      var spec;

      if(!options) options = {};

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
          spec = this._fillSpec(
              _.extend(options, this._attrsToSpec(elm.attributes)));
          // make any appropriate changes based on the current contexts
          this._makeChanges($(elm), spec, this.axes);

          this.elms.push({
            elm: elm,
            spec: spec,
          });
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
          if(elm === candidate.elm){
            respElms.splice(i, 1);
            // found the match, break the loop
            return false;
          }
        });
      });
      return this;
    },

    is: function(ctxName){
      var axes = this.axes;
      return _.some(axes.__keys__, function(key){
        return ctxName === axes[key].current;
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

      return this;
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
      return this;
    },

    // privates
    _responder: function(axisID, contexts, matcher, measure){

      var currentContext;

      // called to perform a check
      return function(){

        var measurement = measure.apply(this, arguments),
          match=null;

        _.every(contexts, function(ctx){
          if( matcher(measurement, ctx)) {
            // first time, or different than last context
            if( (currentContext===undefined) || 
              (ctx.name !== currentContext.name)){

              currentContext = ctx;
              
              // emit the context event
              this._emitter(_.extend({}, {_type:currentContext.name}, 
                  currentContext), this)
                ._emitter({_type:axisID, context:currentContext.name}, this);

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
      };
    },

    _emitter: function(event){
      if(typeof event === 'string') {
        event={_type:event};
      }
      if(!event.target){
        event.target=this;
      }
      if(!event._type){
        throw new Error(event._type + ' is not a supported event.');
      }
      if(_.isArray(this._listeners[event._type])){
        var listeners = this._listeners[event._type],
          i;
        for(i=0; i<listeners.length; i++){
          listeners[i].call(this, event);
        }
      }

      return this;
    },

    _fillSpec: function(spec){

      var applySpec = function(fn){
        _.each(spec, fn);
      }, filler={};
      
      applySpec(function(options, ctx){
        // check to see if the ctx val is an object, could be a string
        if(_.isObject(options)){
          _.each(options, function(val, func){
            filler[func] = '';
          });
        }
      });

      applySpec(function(options, ctx){
        if(_.isObject(options)){
          spec[ctx] = _.extend({}, filler, options);
        }
      });

      return spec;
    },

    _attrsToSpec: function(attrs){

      var spec={},
        fullPattern = new RegExp(
          '^(data-)?(in|intent)-([a-zA-Z0-9][_a-zA-Z0-9]*)-([A-Za-z:-]+)'),
        axisPattern =  new RegExp(
          '^(data-)?(in|intent)-([a-zA-Z0-9][_a-zA-Z0-9]*)$'),
        addProp=function(obj, name, value){
          obj[name] = value;
          return obj;
        };
      _.each(attrs, function(attr){
        var specMatch = attr.name.match(fullPattern);
        if(specMatch !== null) {
          specMatch = specMatch.slice(-2);

          var ctx = specMatch[0],
            ctxSpec = spec[ctx] || {};

          spec = addProp(spec, ctx,
            addProp(ctxSpec, specMatch[1], attr.value));

        } else if(axisPattern.test(attr.name)){
          spec['_' + attr.name.match(axisPattern)[3]] = attr.value;
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

    _contextConfig: function(specs, axes){
      
      var inSpecs=[], outSpecs=[];

      _.each(axes.__keys__, function(ID){
        if(axes[ID].current !== null) {
          inSpecs.push(axes[ID].current);
          return;
        }
      });

      // find the specs not applicable
      _.each(specs, function(spec, specName){
        var match;
        _.each(inSpecs, function(spec){
          if(specName===spec){
            match=true;
          }
        });

        if(!match) outSpecs.push(specName);
      });

      var complements = {
        inSpecs:this._resolveSpecs(inSpecs, specs, axes),
        // TODO: this could really be a separate operation b/c it's only used for classes
        outSpecs:this._resolveSpecs(outSpecs, specs, axes)
      };

      var axisPattern = /^_([a-zA-Z0-9][_a-zA-Z0-9]*)/;
      _.each(specs, function(spec, name){

        var axisMatch = name.match(axisPattern);

        if((axisMatch !== null) && axes[axisMatch[1]] ) {
          if(axes[axisMatch[1]].current !== null ){
            // TODO: sooooo dense
            complements.outSpecs['class'] = _.union(complements.outSpecs['class'], 
              _.compact(_.map(axes[axisMatch[1]].contexts, function(test){
                if(test.name !== axes[axisMatch[1]].current) return test.name;
              })));
            complements.inSpecs['class'] = _.union(complements.inSpecs['class'], 
              (axes[axisMatch[1]].current + ' ' + spec ).split(' '));
          }
        }
      });
      return complements;
    },

    _makeChanges: function(elm, specs, axes){

      var ctxConfig = this._contextConfig(specs, axes);

      _.each(ctxConfig.inSpecs, function(change, func){
        if(func==='move'){
          if( (specs.__placement__ !== change.placement)
            || (specs.__move__ !== change.value)){

            $(change.value)[change.placement](elm);

            // save the last placement of the element so 
            // we're not moving it around for no good reason
            specs.__placement__ = change.placement;
            specs.__move__ = change.value;
          }
        } else if(func === 'class') {

          var classes = elm.attr('class') || '';

          classes = _.union(change, 
            _.difference(classes.split(' '), ctxConfig.outSpecs['class']));
          
          elm.attr('class', classes.join(' '));

        } else {
          elm.attr(func, change);
        }
      }, this);

      return elm;
    },

    _respond: function(axes, elms){
      // go through all of the responsive elms
      elms.each(_.bind(function(i, elm){
        var $elm = $(elm.elm);
        this._makeChanges($elm, elm.spec, axes);
        $elm.trigger('intent', this);
      }, this));
    },

    _contextualize: function(axisID, context, axes){
      axes[axisID].current = context;
      return axes;
    }
  };
  return Intention;
}));