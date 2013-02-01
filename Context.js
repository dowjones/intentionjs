(function () {

    'use strict';

    var contextWrapper = function($){

      var Context = function(params){
          if(params){
            for(var param in params){
              if(params.hasOwnProperty(param)){
                this[param] = params[param];  
              }
            }
          }

          this._listeners = {};

          this._thresholds = this._makeThresholds(this.thresholds);

          this.contextualize();
          this._bindEvents();
          this._context = this._getContext();
          this._setInfo();
          
          return this;

        };

        Context.prototype = {

          // props
          interactionModes:['touch', 'mouse'],

          thresholds: {
            mobile:320,
            tablet:768,
            standard:1000
          },

          // code and concept taken from simple implementation of observer pattern outlined here:
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

          _fire: function(event){
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

          _thresholdIndex: function(thresholdVal){

            for(var i=0; i<this._thresholds.length; i++){
              if(thresholdVal > thresholds[i].value){
                return i;
              }

              if(i+1 === this._thresholds.length){
                return i+1;
              }

            }
          },

          _makeThresholds: function(thresholds){
            
            var threshList=[];

            for(var threshold in thresholds){
              if(thresholds.hasOwnProperty(threshold)){
                threshList.push({name:threshold, value:thresholds[threshold]});
              }
            }

            return threshList.sort(function(a,b){return a.value-b.value;});

          }, 

          _bindEvents: function(){

            if(document.addEventListener){
              
              if("onorientationchange" in window){
                window.addEventListener("orientationchange", 
                  this.contextualize, false);
              }

              window.addEventListener('resize', 
                this._throttle(this._hitch(this, this.contextualize), 100), false);

              
            // IE
            } else if ( document.attachEvent ) {

              if("onorientationchange" in window){
                window.attachEvent("onorientationchange", 
                  this.contextualize);
              }

              window.attachEvent('onresize', 
                this._throttle(this._hitch(this, this.contextualize), 100));

            }

          },

          _hasChanged: function(){

            var context = this._getContext();

            if(context !== this._context){
              this._context=context;
              this._setInfo();
              return true;
            }

            return false;
          },

          _setInfo: function(){

            var pixelRatio = 1,
              interaction='mouse',
              name;

            if(window.devicePixelRatio !== undefined){
              pixelRatio = window.devicePixelRatio;
            }

            if("ontouchstart" in window) {
              interaction='touch'
            }

            // return
            this._info = {
              pixelRatio:pixelRatio,
              interaction: interaction,
              name: this._thresholds[this._context].name,
              threshold:this._thresholds[this._context].value
            };

          },

          _getContext: function(){

            for(var i=0; i<this._thresholds.length; i++){
              if(this.width <= this._thresholds[i].value){
                return i;
                break;
              }
            }
            return this._thresholds.length - 1;
          },

          _throttle : function(callback, interval){
              var lastExec = new Date();
              var timer = null;
              return function(e){
                var d = new Date();
                if (d-lastExec < interval) {
                  if (timer) {
                     window.clearTimeout(timer);
                  }
                  
                  var callbackWrapper = function(event){
                    return function(){
                      callback(event);
                    };
                  };
                  
                  timer = window.setTimeout(callbackWrapper(e), interval);
                  return false;
                }
                callback(e);
                lastExec = d;
              };
          },

          _isTouchDevice: function() {
            return "ontouchstart" in window;
          },

          _hitch: function(scope,fn){
            return function(){
              return fn.apply(scope, arguments); 
            };
          },

          contextualize: function(trigger){
            
            if(typeof window.innerHeight === 'number') {
              this.width = window.innerWidth;
              this.height = window.innerHeight;
            } else if(document.documentElement && document.documentElement.clientWidth){
              this.width = document.documentElement.clientWidth;
              this.height = document.documentElement.clientHeight;
            }
            
            if(this._hasChanged()){

              // update the info about the new context
              var e = this._info;

              for(var param in e){
                if(e.hasOwnProperty(param)){
                  this[param]=e[param];
                }
              }
              
              // after the info is updated, changeContext, fire the change event
              e.type = 'change';

              // trigger is the event object from whatever engaged the change in context
              // that could be a window resize or a orientation change at this point
              e.trigger = trigger;

              this._fire(e);
            }
          },


          add: function(threshold){

            // threshold == {name:'mobile', value:400}
            var index = this._thresholdIndex(threshold.value);

            this._thresholds.splice(index ,0, threshold);

            return this._thresholds;
            
          },

          value: function(name){
            return this[name];
          },

          info:function(){
            return this._info;
          }

        };


      return Context;
    };
    
    if ( typeof define === "function" && define.amd ) {
      define( ['jquery'], contextWrapper );
    } else {
      if(!window.jQuery) {
        throw('jQuery is not defined!!');
      }
      window.Context = contextWrapper(jQuery);
    }

})();