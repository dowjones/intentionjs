'use strict';
var intentionWrapper = function($, _){

  var Intention = function(params){
    var tn = $.extend(this, params, 
        {_listeners:{}, contexts:[], elms:$()});

    $(function(){tn._setElms(tn.container)});

    return tn;
  };

  Intention.prototype = {
    // public props
    container: document,
    // privates
    _funcs: [
      // the only multi-val attr
      'class', 
      // placement attrs
      'append', 'prepend', 'before', 'after',
      // single val attrs
      'src',
      'href',
      'height',
      'width',
      'title',
      'tabindex',
      'id',
      'style',
      'align',
      'dir',
      'contenteditable',
      'lang',
      'xml:lang',
      'accesskey',
      'background',
      'bgcolor',
      'contextmenu',
      'draggable',
      'hidden',
      'item',
      'itemprop',
      'spellcheck',
      'subject',
      'valign'],

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

    // public methods
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

    _setElms: function(scope){

      var elmSpec = this._elmSpec;

      // find all responsive elms in a specific dom scope
      if(!scope) scope = this.container;

      $('[data-intention],[intention],[data-tn],[tn]', 
          scope).each(_.bind(function(i, elm){
            this.add($(elm));
      }, this));

      return this;
    },

    _fillSpec: function(spec){

      var funcs = {},
        tmpl = {};

      _.each(spec, function(value, context){
        _.each(value, function(val, func){
          funcs[func]='';
        });
        if(tmpl[context] === undefined) {
          tmpl[context]=funcs;
        }
      }, this);
      return $.extend(true, {}, tmpl, spec);
    },

    _attrsToSpec: function(attrs){

      var spec={},
        pattern = new RegExp('(^(data-)?(tn|intention)-)?([a-zA-Z_0-9]+)-([a-z:]+)'),
        addProp=function(obj, name, value){
          obj[name] = value;
          return obj;
        };
      _.each(attrs, function(attr){
        var specMatch = attr.name.match(pattern);
        if(specMatch !== null){
          specMatch = specMatch.slice(-2);
          $.extend(true, spec, addProp({}, specMatch[0],
            addProp({}, specMatch[1], attr.value)));
        }
      });
      return spec;
    },

    add: function(elms){
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
          $(elm).data('tn.spec', 
            this._fillSpec(this._attrsToSpec(elm.attributes)));
          // make any appropriate changes based on the current contexts
          this._makeChanges($(elm), this._changes(
            $(elm).data('tn.spec'), this.contexts))

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

    _resolveSpecs: function(specList, specs){
      var changes={},
        changeBuffer={},
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
      // go through currentCtxs (ordered by priority) TODO:
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
          if( (elm.data('tn.placement') !== change.placement)
            || (elm.data('tn.move') !== change.value)){

            $(change.value)[change.placement](elm);
            // save the last placement of the element so 
            // we're not moving it around for no good reason
            elm.data('tn.placement', change.placement);
            elm.data('tn.move', change.value);
          }

        } else if(func === 'class') {

          var classes = elm.attr('class') || '';
          
          classes = _.union(change, 
            _.difference(classes.split(' '), changes.outSpecs['class']));
          
          elm.attr('class', classes.join(' '));

        } else {
          elm.attr(func, change);
        }
        return elm;
      }, this);
    },

    _respond: function(contexts, elms){
      // go through all of the responsive elms
      elms.each(_.bind(function(i, elm){
        this._makeChanges($(elm), this._changes(
          $(elm).data('tn.spec'), contexts));
      }, this));
    },

    _contextualize: function(inContext, ofContexts, currentContexts){

      var removeCtx = _.bind(function(outCtx, contexts){
        $.each(contexts, function(i, ctx){
          if(outCtx.name === ctx.name) {
            contexts.splice(i, 1);
            return false;
          }
        });
        return contexts;
      }, this);
      // remove other contexts in the --group-- from the list
      _.each(ofContexts, function(ctx){
        if( inContext.name !== ctx.name ){
          currentContexts = removeCtx(ctx, currentContexts);
          return;
        } else if( $.inArray(ctx, currentContexts) === -1 ) {
          currentContexts.unshift(ctx);
        }
      });
      return currentContexts;
    },

    responsive:function(contexts, matcher, measure){
      var currentContexts = this.contexts,
        currentContext,
        emitter = _.bind(this._emitter, this),
        contextualize = _.bind(this._contextualize, this);

      // if no matcher function is specified expect to compare a 
      // string to the ctx.name property
      if(_.isFunction(matcher) === false) {
        matcher = function(measure, ctx){
          if(measure===ctx.name) return true;
          return false;
        };
      }
      //  check for measure and if not there 
      // function takes one arg and returns it
      if(_.isFunction(measure) === false) {
        measure = function(arg){
          return arg;
        };
      }
      // bind an the respond function to each context name
      _.each(contexts, function(ctx){
        // set the regex to match attrs to
        ctx.pattern=new RegExp('(^(data-)?(tn|intention)-)?' + ctx.name);
        this.on(ctx.name, _.bind(
            function(){this._respond(currentContexts, this.elms);}, this));
      }, this);
      
      function responder(){
        var measurement = measure.apply(this, arguments);
        _.every(contexts, function(ctx){
          if( matcher(measurement, ctx)) {
            // first time, or different than last context
            if( (currentContext===undefined) || 
              (ctx.name !== currentContext.name)){
              currentContext = ctx;
              currentContexts = contextualize(ctx, contexts, 
                  currentContexts);
              emitter($.extend({}, {type:currentContext.name}, 
                  currentContext));
              // done, break the loop
              return false;
            }
            // same context, break the loop
            return false;
          }
          return true;
        });
        // return the current context
        return currentContext;
      };
      // this makes the contexts accessible from the outside world
      responder.contexts = contexts;

      return responder;
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