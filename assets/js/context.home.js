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

var contentPos,
curPos = 0,
stickdepth = intent.responsive({
   ID: 'stickdepth',
   contexts: [
      {name:'sticknav', min:contentPos},
    	{name:'movebrand', min:$('header').height()},
    	{name:'start', min:0}
   ],
   matcher: function(test, context){
   	return test >= context.min;
   },
   measure: function(arg){
    	if(typeof window.pageYOffset == 'undefined') { var scroll = D.scrollTop; }
    	else { var scroll = window.pageYOffset; }
    	return scroll;
   }
}),
container_width = intent.responsive({
   ID: 'container',
   contexts: [
   	{name:"pseudohdtv",min:1220},
   	{name:"pseudostandard",min:840},
   	{name:"pseudotablet",min:768},
   	{name:"pseudosmalltablet",min:510},
   	{name:"pseudomobile",min:0}
   ],
   matcher: function(test, context) {
   	if(typeof test === 'string'){ return test === context.name;	}
   	return test >= context.min;
   },
   measure:function(arg) {
   	if(typeof arg === 'string'){ return arg; }
   	return $("#all").width();
   }
}),
time = intent.responsive({
   ID: 'time',
   contexts: [
   	{name:'night',min:20},
   	{name:'evening',min:17},
   	{name:'sunset',min:16},
   	{name:'day',min:9},
   	{name:'morning',min:0},
   ],
   matcher: function(test, context) {
   	if($.type(test) == 'string') { return test == context.name; }
   	return test >= context.min;
   },
   measure: function(arg) {
   	if($.type(arg) == 'string'){ return arg; }
   	var time = new Date();
   	return time.getHours();
   }
}),
mini_example = intent.responsive({ //set up a new context based on the container div#all
   ID: 'mini_example',
	contexts: [
      {name:"large",min:300},
      {name:"small",min:75},
      {name:"tiny",min:0}
	],
	matcher: function(test, context) {
      return test >= context.min;
	},
	measure:function(arg) {
      return $("#resizable").width();
	}
});

$('#resizable').resizable()
   .on('resize', mini_example.respond);
mini_example.respond();

intent.on('time:', function() {
   $('#timeExample').text(intent.axes.time.current);
});
$('#timeChange').change(function() {
   if($(this).children('option:selected').val() == '') { time.respond(); }
   else { time.respond($(this).children('option:selected').val()); }
   //If the users on a small device, scroll to the change
   if(intent.axes.width.current == 'mobile' || intent.axes.width.current=='smalltablet') {
      $(document).scrollTop($('#timeExample').offset().top);
   }
});
time.respond();

 //Try it functions
$('#devices').children().click(function(){
   var device = $(this).attr('id');
   if(device == intent.axes.container.current) {
      $('#all').css({
         'width':$('#all').height() + 'px',
         'height':$('#all').width() + 'px'
      });
   } else if(device === undefined) {
      //save percent scrolled
      var percent = $('#all').scrollTop() / $('#heightWrapper').height();
      //lowest common denominator for contexts that have access to device emulation
      intent.axes.container.respond('pseudostandard');
      //remove inline styles created by toggleOrientation
      $('#all').css({'width':'', 'height':'' });
      var docHeight = $('#heightWrapper').height();
      $(window).scrollTop((percent*docHeight) - 100);
   } else {
      intent.axes.container.respond(device);
      $('#all')
         .css({'width':'', 'height': ''});
   }
});
//For docs nav
var titleCtx = [{'name':'t0', 'val':0}],
curPos,
articles = $('#docs').children('article').not('.special'),
articlect = articles.length,
i = 1,
manageScrollDepth = function() {
   for(var i = 0; i <= intent.axes.titleDepth.contexts.length-2; i++){
   	var depth = $('#'+intent.axes.titleDepth.contexts[i]['name']).offset().top - 50;
      intent.axes.titleDepth.contexts[i]['val'] = depth;
   }
   contentPos = $('#content').offset().top;
   intent.axes.stickdepth.contexts[0]['min'] = contentPos;
   stickdepth.respond();
};
$.each(articles, function() { //then create the nav
   $(this).attr('id', 't'+i); //#targeti
   if($(this).children('h2').attr('alt')) { var text = $(this).children('h2').attr('alt'); }
   else{ var text = $(this).children('h2').text(); }

   var markup = '<li id="a'+i+'"><a ref="#t'+i+'" >'+text+'</a></li>', //#anchori
   pos = $(this).offset().top - 50, //minus 20 for padding
   ctx = {name:'t'+i, val:pos},
   sub = $(this).children('article'),
   jumpMarkup = $('<div class="jump"><a>&uarr; Back to top</a></div>');

   titleCtx.push(ctx);

   $('ul#sections').append(markup);

   if(sub.length<1){ $(this).append(jumpMarkup).addClass('clearFix'); }
   else { sub.append(jumpMarkup).addClass('clearFix'); }

   i++;
});

titleCtx.reverse();

var titleDepth = intent.responsive({
   ID: 'titleDepth',
   contexts: titleCtx,
   matcher: function(test, context){
      if($.type(test) == 'string'){ return test == context.name; }
      if(test >= context.val) {
         curPos = context.name.slice(1);
         return true;
      }
      return false;
   },
   measure: function(arg){
      if($.type(arg) == 'string'){ return arg; }
      if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
      else { var scroll = pageYOffset; }
      if((scroll+$(window).height()) == $(document).height()) {
         return intent.axes.titleDepth.contexts[0]['name'];
      }
      return scroll;
   }
});
titleDepth.respond();

$(window)
   .on('scroll', function(){
      throttle(titleDepth.respond(), 50);
      throttle(stickdepth.respond(), 50);
   })
   .on('resize', throttle(manageScrollDepth, 100));
 
$('.jump').add('#stickBrand').click(function() {
   $('html, body').animate({ scrollTop: $('#t1').offset().top - 49}, 1000);
});

$('#prevnext li').click(function() {
   console.log('clicked, old curPos', curPos);
   if( ($(this).attr('id') == 'next') && (curPos < articlect) ){ console.log('moving up'); curPos++; }
   else if(($(this).attr('id') == 'prev') && (curPos > 1)){ console.log('decrementing'); curPos--; }
   else { return false }
   console.log('new curPos:', curPos);
   var target = $('#t'+curPos).offset().top - 49; //minus 49 to make sure the nav won't cover it
   $('html, body').animate({ scrollTop: target}, 1000);
   return false;
});

$('ul#sections')
   .menuDeck()
   .children('li').children('a')
   .click(function() {
      var target = $($(this).attr('ref')).offset().top - 49;
      $('html, body').animate({ scrollTop: target}, 1000);
});

intent
   .on('titleDepth:', function() {
      curPos = intent.axes.titleDepth.current.slice(1);
      $('ul#sections')
         .children('.cover').removeClass('cover')
         .end() //in case no .cover is found
         .children('li:nth-of-type('+curPos+')').addClass('cover');
   })
   .on('sticknav', function(){
      //add padding so stickiness is applied without a jump
      //this is done here (as opposed to applying an intentional class to #docs
      //in case we decide the nav bar should be different sizes in different contexts
      $('#docs').css('padding-top', $('#topNav').outerHeight());
   })
   .on('movebrand', function() { //one context above the stickynav
      $('#docs').css('padding-top', ''); //remove that smoothening padding
   })
   .on('width:', function() {
      var device = intent.axes.width.current;
      writeOutput(device);
      if(device === 'mobile' || device === 'smalltablet') {
         unequalize('.docsLite .equalize', 'section');
         unequalize('#smallCode', 'pre');
      } else if(device === 'tablet') {
         unequalize('.docsLite .equalize', 'section');
         equalizeAll('#smallCode', 'pre');
      } else {
         equalizeAll('#docs', '.equalize', 'section');
      }
   })
   .on('container:', function() {
      var device = intent.axes.container.current,
      device = device.slice(6, device.length);
      writeOutput(device);
      if(device === 'mobile' || device === 'smalltablet' ) {
         unequalize('.docsLite .equalize', 'section');
         unequalize('#smallCode', 'pre');
      } else if(device === 'tablet') {
         unequalize('.docsLite .equalize', 'section');
         equalizeAll('#smallCode', 'pre');
      } else {
         equalizeAll('.docsLite', '.equalize', 'section');
      }
   });