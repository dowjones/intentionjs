(function($){

var context = function($, Intention){
  var intent = new Intention(),
      baseResponder = intent.responsive([{name:'base'}]).respond('base'),

// Percent scrolled axis
      percentCtx = [];
  for(var i = 1; i<=100; i++) {
     percentCtx.push( {name:'p'+i, val:i} )
  }
  percentCtx.reverse();
  var percent = intent.responsive({
     ID:'percent',
     contexts: percentCtx,
     matcher: function(measure, ctx) {
        return measure >= ctx.val;
     },
     measure: function(){
        var pos = Math.floor((window.pageYOffset / ($(document).outerHeight() - $(window).height()) )*100);
        return pos;
     }
  }).respond,
  
// Scroll flipper axis
  flipper = intent.responsive({
    ID:'depth',
    contexts:[
      {name: 'f1', div:0},
      {name:'f2', div:1},
      {name:'f3', div:2},
      {name:'f4', div:3}],
    matcher: function(measure, ctx){
      if((Math.floor(measure/100) % 4) === ctx.div) return true;
      return false;
    },
    measure: function(){
      return window.pageYOffset;
    }

  }).respond,
  
//Sticky nav axis
   depth = $('header').offset().top + $('header').outerHeight() - $('nav').outerHeight(),
  scrolldepth = intent.responsive({
     ID: 'scrolldepth',
     contexts: [
        {name:'fix', val:depth},
        {name:'top', val:0}
     ],
     matcher: function(measure, ctx) {
        return measure >= ctx.val;
     },
     measure: function(){
        return window.pageYOffset;
     }
  }).respond,
  
  // update the scrolldepth values in case elements change height on window resize
  manageDepths = function() {
     var newDepth = $('header').offset().top + $('header').outerHeight() - $('nav').outerHeight();
     intent.axes.scrolldepth.contexts[0]['val'] = newDepth;
  };
  
  intent.on('percent:', function() {
     var pos = this.axes.percent.current.slice(1) + '%';
     $('#posPer').text(pos);
  });
  
  scrolldepth();
  percent();
  flipper();
  $(window)
     .on('scroll', scrolldepth)
     .on('scroll', percent)
     .on('scroll', flipper)
     .on('resize', manageDepths);
  

  intent.elements(document);
  
  return intent;
};

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define('context', ['jquery', 'intention'], factory);
    } else {
      // Browser globals
      root.intent = factory(root.jQuery, root.Intention);
    }
  }(this, function ($, Intention) {
    return context($, Intention);
  }));
}).call(this);