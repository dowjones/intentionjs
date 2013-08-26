(function () {

  'use strict';
  var context = function($, Intention){

    function throttle(callback, interval){
      var lastExec = new Date(),
        timer = null;

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
    }

    if(window.intent === undefined) {
      window.intent = new Intention;
    }

    // horizontal resize contexts
    var resizeContexts = [
        // {name:'luxury', min:900},
        {name:'standard', min:769}, 
        {name:'tablet', min:321},
        {name:'mobile', min:0}],
      // horizontal responsive function
      hResponder = intent.responsive(resizeContexts,
        // compare the return value of the callback to each context
        // return true for a match
        function(test, context){
          return test>=context.min
        },
        // callback, return value is passed to matcher()
        // to compare against current context
        function(e){
          return $(window).width();
      });
    // create a base context that is always on
    $(window).on('resize', throttle(hResponder, 100))
      .on('orientationchange', hResponder);

    // catchall, false as the second arg suppresses the event being fired
    intent.responsive([{name:'base'}])('base')
      // touch device?
      .responsive([{name:'touch'}], function() {
        return "ontouchstart" in window;
      })()
      // retina display?
      .responsive(
        // contexts
        [{name:'highres'}],
        // matching:
        function(measure, context){
          return window.devicePixelRatio > 1;
        })();

    // width context
    hResponder()
      .elements(document);

    return intent;
  };

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery', 'Intention'], factory);
    } else {
      // Browser globals
      root.intent = factory(root.jQuery, root.Intention);
    }
  }(this, function ($, intent) {
    return context($, intent);
  }));
}).call(this);