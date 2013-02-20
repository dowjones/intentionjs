(function () {
    'use strict';
    var intentionWrapper = function($, ctx){
      var Intention = function(params){
        if(params){
          for(var param in params){
            if(params.hasOwnProperty(param)){
              this[param] = params[param];  
            }
          }
        }
        // this.context = new ctx(this.thresholds);
        this._listeners = {};
        this._contexts= [];

        // by default the container is the document
        this.setElms(this.container);  
        this.elms=$(); // bundle these 

        // var intentHandler = this._hitch(this, function(info){
        //   this.info=info;
        //   this.filters = this._makeFilterPatterns(info);

        //   // set the context information to the info (event object that comes from context)
        // });

        // run the intention on initialization to setup any elms that need setting

        return this;
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

        _class:function(elm, instruction){

          $(elm).attr('class', this._combine(instruction.options));

          return;
        },

        _attr: function(elm, instruction) {

          var attrs = this._divideAttrs(instruction.options);
          for(var attr in attrs){
            if(attrs.hasOwnProperty(attr) ){
              var attrVal = this._findBest('attr', attrs[attr]).value;
              $(elm).attr(attr, attrVal);
            }
          }
          return;

        },

        _move: function(elm, instruction) {

          // find the base
          var choice = this._findBest('move', instruction.options),
            moveSelector = choice.value;

          var placementSpec = choice.name.match(new RegExp('move-('+ 
                this._staticPatterns.placements + '$)'));

          if(placementSpec){
            $(moveSelector)[placementSpec[1]]( elm );
          } else {
            $(moveSelector).append( elm );
          }

        },

        _hitch: function(scope,fn){
          return function(){
            return fn.apply(scope, arguments); 
          };
        },

        // this supports the base attr functionality
        _union: function(x,y) {

          var obj = {};

          for (var i=x.length-1; i >= 0; --i) {
            obj[x[i]] = x[i];
          }
          for (var i=y.length-1; i >= 0; --i){
            obj[y[i]] = y[i];
          }
           
          var res = [];

          for (var k in obj) {
            if (obj.hasOwnProperty(k)){
              res.push(obj[k]); // <-- optional
            }  
          }
          return res;
        },

        // _isEmpty: function(obj){
        //   for(var prop in obj) {
        //     if(obj.hasOwnProperty(prop)){ return false; }
        //   }
        //   return true;
        // },

        // // get all the keys in an object
        // _keys: function(obj){
        //   var keys=[];
        //   for(var k in obj){
        //     if(obj.hasOwnProperty(k)) keys.push(k);
        //   }
        //   return keys;
        // },

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
            var listeners = this._listeners[event.type];
            for(var i=0; i<listeners.length; i++){
              listeners[i].call(this, event);
            }
          }
        },

        // public methods
        // code and concept taken from simple implementation of 
        // observer pattern outlined here:
        // http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
        on: function(type, listener){
          if(typeof this._listeners[type] === 'undefined') {
            this._listeners[type]=[];
          }
          this._listeners[type].push(listener)
        },

        off: function(type, listener){
          if($.isArray(this._listeners[type])){
            var listeners = this._listeners[type];
            for(var i=0;listeners.length; i++){
              if(listeners[i] === listener){
                listeners.splice(i,1);
                break;
              }
            }
          }
        },

        setElms: function(scope){
          // find all responsive elms in a specific dom scope
          if(!scope) var scope = document;
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
          $.each(this._funcs, function(i, func){
            // if the func is not in the attr.name move on
            if(attr.name.indexOf(func) === -1){
              return;
            }
            // check to see if there's a resolution on the attr's func
            if(func === 'class'){
              // class gets resolved uniquely because it is a multi-
              // value attr
              if(changes.class === undefined) {
                changes.class=[]
              }
              changes.class = changes.class
                .concat(attr.value.split(' '));

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

          });
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
        },

        _makeChanges: function(elm, changes){
          $.each(changes, function(i, change){
            console.log(change)
          });
        },

        _respond: function(contexts, elms){
          return;
          // go through all of the responsive elms
          elms.each(this._hitch(this, function(i, elm){
            this._makeChanges(elm, this._changes(elm.attributes, contexts));
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
              currentContexts.push(ctx);
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
            var matcher = function(measure, ctx){
              if(measure===ctx.name) return true;
              return false;
            }
          }
          // bind an the respond function to each context name
          $.each(contexts, this._hitch(this, function(i, ctx){
            this.on(ctx.name, this._hitch(this,
                function(){this._respond(currentContexts, this.elms);}));
          }));
          
          return function(measurement){
            
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
          }
        }
      };
      return Intention;
    };

    if ( typeof define === "function" && define.amd ) {
      define( ['jquery', 'Context'], intentionWrapper );
    } else {
      if(!window.jQuery) {
        throw('jQuery is not defined!!');
      } else if (!window.Context){
        throw('Context is not defined!!');
      }
      window.Intention = intentionWrapper(jQuery, Context);
    }
})();
