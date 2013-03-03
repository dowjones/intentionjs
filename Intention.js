'use strict';
var intentionWrapper = function($){

  var Intention = function(params){
    return $.extend(this, params, 
        {_listeners:{}, contexts:[], elms:$()}).setElms(this.container);
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

    _hitch: function(scope,fn){
      return function(){
        return fn.apply(scope, arguments); 
      };
    },
    _keys: function(obj){
      var k,
        keys=[];
      for(k in obj){
        if(obj.hasOwnProperty(k)) keys.push(k);
      }
      return keys;
    },

    // each, identity, isFunction, any, map, uniq, union, difference taken from underscore.js and modified slightly
    _each: function(obj, iterator, context) {
      if (obj == null) return;
      if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) return;
          }
        }
      }
    },

    _identity: function(value) {
      return value;
    },

    _isFunction: function(obj) {
      return typeof obj === 'function';
    },

    _any : function(obj, iterator, context) {
      iterator || (iterator = this._identity);
      var result = false;
      if (obj == null) return result;
      if (Array.prototype.some && obj.some === Array.prototype.some) return obj.some(iterator, context);
      this._each(obj, function(value, index, list) {
        if (result || (result = iterator.call(context, value, index, list))) return breaker;
      });
      return !!result;
    },

    _contains: function(obj, target) {
      if (obj == null) return false;
      if (Array.prototype.indexOf && obj.indexOf === Array.prototype.indexOf) return obj.indexOf(target) != -1;
      return this._any(obj, function(value) {
        return value === target;
      });
    },

    _filter: function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (Array.prototype.filter && obj.filter === Array.prototype.filter) return obj.filter(iterator, context);
      this._each(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) results[results.length] = value;
      });
      return results;
    },

    _map: function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (Array.prototype.map && obj.map === Array.prototype.map) return obj.map(iterator, context);
      this._each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    },

    _uniq: function(array, isSorted, iterator, context) {
      if (this._isFunction(isSorted)) {
        context = iterator;
        iterator = isSorted;
        isSorted = false;
      }
      var initial = iterator ? _.map(array, iterator, context) : array,
        results = [],
        seen = [],
        _contains = this._contains;
      this._each(initial, function(value, index) {
        if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_contains(seen, value)) {
          seen.push(value);
          results.push(array[index]);
        }
      });
      return results;
    },

    _union: function() {
      return this._uniq(Array.prototype.concat.apply(Array.prototype, arguments));
    },

    _difference: function(array) {
      var contains=this._contains,
        rest = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
      return this._filter(array, function(value){ return !contains(rest, value); });
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
      if($.isArray(this._listeners[event.type])){
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
      if($.isArray(this._listeners[type])){
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

    setElms: function(scope){

      var elmSpec = this._elmSpec;

      // find all responsive elms in a specific dom scope
      if(!scope) scope = this.container;

      this.elms = $('[data-intention],[intention],[data-tn],[tn]', 
          scope).each(this._hitch(this, function(i, elm){
        $(elm).data('tn.spec', 
          this._fillSpec(this._attrsToSpec(elm.attributes)));
      }));

      return this;
    },

    _fillSpec: function(spec){

      var funcs = {},
        tmpl = {};

      $.each(spec, function(context, value){
        $.each(value, function(func){
          funcs[func]='';
        });
        if(tmpl[context] === undefined) {
          tmpl[context]=funcs;
        }
      });
      return $.extend(true, {}, tmpl, spec);
    },

    _attrsToSpec: function(attrs){

      var spec={},
        pattern = new RegExp('(^(data-)?(tn|intention)-)?([a-zA-Z_0-9]+)-([a-z:]+)'),
        addProp=function(obj, name, value){
          obj[name] = value;
          return obj;
        };
      $.each(attrs, function(i, attr){
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
      var respElms=this.elms;
      elms.each(function(i, elm){
        var exists = false;
        respElms.each(function(i, respElm){
          if(elm === respElm) {
            exists=true;
            return false;
          }
        });
        if(exists === false) respElms.push(elm);
      });
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
        union=this._hitch(this, this._union),
        moveFuncs=['append', 'prepend', 'before', 'after'];

      $.each(specList, function(i, specName){
        $.each(specs[specName], function(func, val){
          if(func==='class'){
            if(!changes[func]) changes[func] = [];

            changes[func] = union(changes[func], val.split(' '));

          } else if(((changes.move === undefined) || 
              (changes.move.value === '')) && 
              ($.inArray(func, moveFuncs) !== -1)){

            changes.move = {value:val, placement:func};

          } else {
            if((changes[func] === undefined) || (changes[func] === '')){
              changes[func]=val;
            }
          }
        })
      });

      return changes;
    },

    _changes: function(specs, contexts){

      var changes = {},
        // resolve=this._hitch(this, this._resolveAttr),
        inSpecs=[], outSpecs=[];
      // go through currentCtxs (ordered by priority) TODO:
      $.each(contexts, function(i, ctx){
        if(specs[ctx.name] !== undefined) {
          inSpecs.push(ctx.name);
          return;
        }
      });
      $.each(specs, function(specName, spec){
        var match;
        $.each(inSpecs, function(i,spec){
          if(specName===spec){
            match=true;
          }
        });
        if(!match) outSpecs.push(specName);
      });

      return {
        inSpecs:this._resolveSpecs(inSpecs, specs),
        outSpecs:this._resolveSpecs(outSpecs, specs)
      };
    },

    _makeChanges: function(elm, changes){
      var difference = this._hitch(this, this._difference),
        union=this._hitch(this, this._union);
      
      $.each(changes.inSpecs, this._hitch(this, function(func, change){
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
          
          classes = union(change, 
            difference(classes.split(' '), changes.outSpecs['class']));
          
          elm.attr('class', classes.join(' '));

        } else {
          elm.attr(func, change);
        }
        return elm;
      }));
    },

    _respond: function(contexts, elms){
      // go through all of the responsive elms
      elms.each(this._hitch(this, function(i, elm){
        this._makeChanges($(elm), this._changes(
          $(elm).data('tn.spec'), contexts));
      }));
    },

    _contextualize: function(inContext, ofContexts, currentContexts){

      var removeCtx = function(outCtx, contexts){
        $.each(contexts, function(i, ctx){
          if(outCtx.name === ctx.name) {
            contexts.splice(i, 1);
            return false;
          }
        });
        return contexts;
      };
      // remove other contexts in the --group-- from the list
      $.each(ofContexts, function(i, ctx){
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
        emitter = this._hitch(this, this._emitter),
        contextualize = this._contextualize;

      // if no matcher function is specified expect to compare a 
      // string to the ctx.name property
      if($.isFunction(matcher) === false) {
        matcher = function(measure, ctx){
          if(measure===ctx.name) return true;
          return false;
        };
      }
      //  check for measure and if not there 
      // function takes one arg and returns it
      if($.isFunction(measure) === false) {
        measure = function(arg){
          return arg;
        };
      }

      // bind an the respond function to each context name
      $.each(contexts, this._hitch(this, function(i, ctx){
        // set the regex to match attrs to
        ctx.pattern=new RegExp('(^(data-)?(tn|intention)-)?' + ctx.name);
        this.on(ctx.name, this._hitch(this,
            function(){this._respond(currentContexts, this.elms);}));
      }));
      
      var responder = function(){
        
        var measurement = measure.apply(this, arguments);
        
        $.each(contexts, function(i, ctx){

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
    define(['jquery'], factory);
  } else {
    root.Intention = factory(root.jQuery);
  }
}(this, intentionWrapper));