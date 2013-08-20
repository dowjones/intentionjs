(function () {

    'use strict';

    var contextWrapper = function(Context, $){

      var jqContext = $.extend({}, Context.prototype, {

        _bindEvents: function(){

          this.elm.bind('resize', 
            this._throttle(this._hitch(this, this.contextualize), 100));

          return false;
        },

        contextualize: function(trigger){

          this.width = this.elm.outerWidth();
          this.height = this.elm.outerHeight();
        
          if(this._hasChanged()){

            // update the info about the new context
            var e = this._getInfo();

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
        }
      });
      
      Context.prototype = jqContext;

      return Context;

    };

    if ( typeof define === "function" && define.amd ) {
      define('JQueryContext', ['Context','jquery','jqueryUI'], contextWrapper)
    } else {

      if(!window.jQuery) {
        throw('jQuery is not defined!!');
      }
      window.JQueryContext = contextWrapper(Context, jQuery);
    }

})();