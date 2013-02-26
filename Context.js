(function () {

  'use strict';

  var context = function($, tn){

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

    var tn = new tn,
      // horizontal resize contexts
      resizeContexts = [{name:'standard', min:769}, 
        {name:'tablet', min:321},
        {name:'mobile', min:0}],
      // horizontal responsive function
      hResponder = tn.responsive(resizeContexts,
        // compare the return value of the callback to each context
        // return true for a match
        function(test, context){
          if(test>=context.min){
            return true;
          }
        },
        // callback, return value is passed to matcher()
        // to compare against current context
        function(e){
          return $(window).width();
      });
    // create a base context that is always on
    tn.responsive([{name:'base'}])('base');

    // create a touch context that is always on in the case of a touch device
    tn.responsive([{name:'touch'}], function() {
      return "ontouchstart" in window;
    })();
    hResponder();

    $(window).on('resize', throttle(hResponder, 100));
    return tn;
  };

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery', 'Intention'], factory);
    } else {
      // Browser globals
      root.tn = factory(root.jQuery, root.Itn);
    }
  }(this, function ($, tn) {
    return context($, tn);
  }));

})();