(function($){

  if(!window.localStorage.getItem('visits')){
    window.localStorage.setItem('visits', 0);
  }

  var visits = parseInt(window.localStorage.getItem('visits'), 10) + 1;
  window.localStorage.setItem('visits', visits);

  var tn = new Intention,
      resizeContexts = [
        {name:'standard', min:769},
        {name:'tablet', min:521},
        {name:'mobile', min:0}],
      baseResponder = tn.responsive([{name:'base'}]).respond('base'),
      hResponder = tn.responsive({
        contexts: resizeContexts,
        matcher: function(test, context){
          return test>=context.min;
        },
        measure: function(){
          return $(window).width();
        }
      }).respond;

  hResponder();

  $(window).on('resize', hResponder);
  // visitTracker();

  var visitTracker = tn.responsive({
    ID:'visits',
    contexts:[
      {name: 'frequenter', visits:5},
      {name:'returning', visits:2},
      {name:'first', visits:1}],
    matcher: function(measure, ctx){
      return measure >= ctx.visits;
    },
    measure: function(){
      return parseInt(window.localStorage.getItem('visits'));
    }
  }).respond;

  var depthTracker = tn.responsive({
    ID:'depth',
    contexts:[
      {name: 'shallow', depth:25},
      {name:'beyond', depth:Infinity}],
    matcher: function(measure, ctx){
      return measure < ctx.depth;
    },
    measure: function(){
      return window.pageYOffset;
    }
  }).respond;

  depthTracker();

  $(window).on('scroll', depthTracker);



  var flipper = tn.responsive({
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

  }).respond;

  flipper();

  $(window).on('scroll', flipper);

  tn.elements();
})(jQuery)
