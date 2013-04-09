(function () {

  'use strict';
  var context = function($, Intention){

    // create a brand spankin new intention object
    var intent=new Intention,
      // placeholder for the horizontal axis
      horizontal_axis;

    // throttle funtion used for keeping calls to the resize responive 
    // callback to a minimum
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


    // catchall
    // =======================================================================
    intent.responsive([{name:'base'}]).respond('base')

    // width context?
    // =======================================================================
    horizontal_axis = intent.responsive({
      ID:'width',
      contexts: [
        {name:'standard', min:840}, 
        {name:'tablet', min:510},
        {name:'mobile', min:0}],
      // compare the return value of the callback to each context
      // return true for a match
      matcher: function(test, context){
        if(typeof test === 'string'){
          
          return test === context.name;
        }
        return test>=context.min
      },
      // callback, return value is passed to matcher()
      // to compare against current context
      measure: function(arg){

        if(typeof arg === 'string'){
          return arg;
        }

        return $(window).width();
    }});

    // touch device?
    // =======================================================================
    intent.responsive({
      ID:'touch',
      contexts:[{name:'touch'}], 
      matcher: function() {
        return "ontouchstart" in window;
      }}).respond();

    // retina display?
    // =======================================================================
    intent.responsive({
      ID: 'highres',
      // contexts
      contexts:[{name:'highres'}],
      // matching:
      matcher: function(measure, context){
        return window.devicePixelRatio > 1;
      }}).respond();

    $(window).on('resize', horizontal_axis.respond);
      .on('orientationchange', horizontal_axis.respond);

    // register the current width without waiting for a window resize
    horizontal_axis.respond();
    
    $(function(){
      // at doc ready grab all of the elements in the doc
      intent.elements(document);
    });
    
    // return the intention object so that it can be extended by other plugins
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
  }(this, function ($, Intention) {
    return context($, Intention);
  }));
}).call(this);