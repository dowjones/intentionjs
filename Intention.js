(function () {
    'use strict';
    var intentionWrapper = function($){
      var Intention = function(params){
        if(params){
          var param;
          for(param in params){
            if(params.hasOwnProperty(param)){
              this[param] = params[param];  
            }
          }
        }
        this._listeners = {};
        this._contexts= [];

        this.elms=$(); // bundle these 
        // by default the container is the document
        
        return this.setElms(this.container);
      };
      Intention.prototype = {

        // public props
        container: document,
        // privates
        _funcs: [
          // the only(?) multi-val attr
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

        // this supports the base attr functionality
        _union: function(x,y) {

          var obj = {},
            i,
            res = [],
            k;

          for (i=x.length-1; i >= 0; --i) {
            obj[x[i]] = x[i];
          }
          for (i=y.length-1; i >= 0; --i){
            obj[y[i]] = y[i];
          }
          
          for (k in obj) {
            if (obj.hasOwnProperty(k)){
              res.push(obj[k]); // <-- optional
            }  
          }
          return res;
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
          // find all responsive elms in a specific dom scope
          if(!scope) scope = document;
          this.elms = $('[data-intention],[intention],[data-tn],[tn]', 
              scope);
          return this;
        },

        add: function(elms){
          // is expecting a jquery object
          var respElms=this.elms;

          elms.each(function(){
            respElms.push(this);
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

        _resolveAttr : function(attr, changes){
          var moveFuncs = ['append', 'prepend', 'before', 'after'];
          // go through the possible functions
          $.each(this._funcs, this._hitch(this, function(i, func){
            // if the func is not in the attr.name move on
            if(attr.name.indexOf(func) === -1){
              return;
            }
            // check to see if there's a resolution on the attr's func
            if(func === 'class'){
              // class gets resolved uniquely because it is a multi-
              // value attr
              if(changes.classes === undefined) {
                changes.classes=[];
              }
              changes.classes = this._union(changes.classes, 
                attr.value.split(' '));

            } else if(changes[func]){
              // TODO: this is a little weird
              // if the function is already resolved continue
              // to the next func
              return;
            } else if($.inArray(func, moveFuncs) !== -1 ) {
              // resolve all move funcs
              $.each(moveFuncs, function(i, moveFunc){
                if(func === moveFunc) {
                  changes[func] = attr.value;
                  return;
                }
                changes[moveFunc]=false;
              });
            } else {
              // resolve the function to prevent further checks
              changes[func]=attr.value;
            }
          }));

          return changes;
        },

        _changes: function(attrs, contexts){

          var changes = {},
            resolve=this._hitch(this, this._resolveAttr);

          // go through currentCtxs (ordered by priority) TODO:
          $.each(contexts, function(i, ctx){
            // go through the elements attrs
            $.each(attrs,  function(i, attr){
              // if the attr does not match the current context
              // move on
              if(new RegExp('(^(data-)?(tn|intention)-)?' 
                  + ctx.name).test(attr.name)) {
                changes = resolve(attr, changes);
              }
            });
          });
          return changes;
        },

        _makeChanges: function(elm, changes){
          $.each(changes, this._hitch(this, function(func, change){
            // this keeps out the cancelled move
            // TODO: could make the check search the changes for other move
              // func instead of marking false (this coupling sux)
            if(change===false){
              return;
            }
            if($.inArray(func, 
              ['append', 'prepend', 'before', 'after']) !== -1){
              $(change)[func](elm);
            } else if(func === 'classes') {
              elm.attr('class', change.join(' '));
            } else {
              elm.attr(func, change);
            }
            return elm;
          }));
        },

        _respond: function(contexts, elms){
          // go through all of the responsive elms
          elms.each(this._hitch(this, function(i, elm){
            this._makeChanges($(elm), this._changes(elm.attributes, contexts));
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
          var currentContexts = this._contexts,
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
          // bind an the respond function to each context name
          $.each(contexts, this._hitch(this, function(i, ctx){
            this.on(ctx.name, this._hitch(this,
                function(){this._respond(currentContexts, this.elms);}));
          }));
          
          var responder = function(measurement){
            
            if($.isFunction(measure)) {
              // the measure will return a val to compare to each
              // context that was passed, if no matcher function
              // is specified it should return the name of the context
              measurement = measure.apply(this, arguments);
            }
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

    if ( typeof define === "function" && define.amd ) {
      define( ['jquery'], intentionWrapper );
    } else {
      if(!window.jQuery) {
        throw('jQuery is not defined!!');
      } 
      window.Intention = intentionWrapper(jQuery);
    }
})();
