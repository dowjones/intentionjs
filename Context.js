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
                  
        return this;
      };

      Context.prototype = {
        
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