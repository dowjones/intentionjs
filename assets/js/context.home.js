var container_width = intent.responsive({
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
}),
manageTitlePos = function() {
   for(var i = 0; i <= intent.axes.titleDepth.contexts.length-2; i++){
   	var depth = $('#'+intent.axes.titleDepth.contexts[i]['name']).offset().top - 50;
      intent.axes.titleDepth.contexts[i]['val'] = depth;
   }
}

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


intent
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
      //When the context switches, reset the targets
      window.setTimeout(function(){ //This time out is not good!!!!!!!!!!!!!!!
         contentPos = $('#content').offset().top;
         intent.axes.stickdepth.contexts[0]['min'] = contentPos;
         stickdepth.respond();
         manageTitlePos();
      }, 500);
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