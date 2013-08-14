var buildHome = function(D) {
	//Initialization functions
	function in_init(contexts, callback){
	  var dfds = [];
	  _.each(contexts, function(ctx){
	    var dfd = $.Deferred();
	    dfds.push(dfd);
	    if(intent.is(ctx)) { dfd.resolve(); }
	  });
	  if((!contexts) || (contexts.length === 0)){ sheetWriter(); }
	  $.when.apply(this, dfds).done(callback);
	};
	
	var stdInit = $.Deferred();
	stdInit.done(function() {
		imageSetup();
		equalizeAll('#docs', 'article.equalize', 'section');
		contentPos = $('#content').offset().top;
	});
	if(intent.is('standard') || intent.is('hdtv')) { stdInit.resolve(); }
	else { 
		intent.on('standard', function() { stdInit.resolve(); })
		   .on('hdtv', function() { stdInit.resolve(); });
	}
	in_init(['tablet'], function(){
		equalizeAll('#smallCode', 'pre');
		writeOutput(intent.axes.width.current);
		contentPos = $('#content').offset().top;
	});
	in_init(['smalltablet'], function(){
		writeOutput(intent.axes.width.current);
		contentPos = $('#content').offset().top;
	});
	in_init(['mobile'], function() {
		writeOutput(intent.axes.width.current);
		contentPos = $('#content').offset().top;
	});
	
	//Basic var setup
	var curPos = 0,
	throttle = function(callback, interval){
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
    },
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
    		if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
    		else { var scroll = pageYOffset; }
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
			if($.type(test) == 'string') {
				return test == context.name;
			}
			return test >= context.min;
		},
		measure: function(arg) {
			if($.type(arg) == 'string'){
				return arg;
			}
			var time = new Date();
			return time.getHours();
		}
	});
	intent.on('time', function() { $('#timeExample').text(intent.axes.time.current); }); //Set an event that will print the current time context
	$('#timeChange').change(function() { //Let's users emulate time of day
		if($(this).children('option:selected').val() == '') { time.respond(); } //Default to actual time when no specification
		else { time.respond($(this).children('option:selected').val()); } //Otherwise pass Intention the selected string
		if(intent.axes.width.current == 'mobile' || intent.axes.width.current=='smalltablet') { //If the users on a small device, scroll to the change
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
		   var percent = $('#all').scrollTop() / $('#heightWrapper').height(); //save percent scrolled
			intent.axes.container.respond('pseudostandard');//lowest common denominator for contexts that have access to device emulation
			$('#all').css({'width':'', 'height':'' }); //remove inline styles created by toggleOrientation
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
		manageTitlePos = function() {
		   for(var i = 0; i <= intent.axes.titleDepth.contexts.length-2; i++){
		      var depth = $('#'+intent.axes.titleDepth.contexts[i]['name']).offset().top - 50;
		      intent.axes.titleDepth.contexts[i]['val'] = depth;
		   }
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
	$('.jump').add('#topNav .inner p a').click(function() { $('html, body').animate({ scrollTop: $('#t1').offset().top - 49}, 1000); });
	titleCtx.reverse();
	
	var titleDepth = intent.responsive({
		ID: 'titleDepth',
		contexts: titleCtx,
		matcher: function(test, context){
			if($.type(test) == 'string'){ return test == context.name; }
			var pass = test >= context.val;
			if(pass == true) { curPos = context.name.slice(1) }
			return pass;
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
	$(window).on('scroll', function(){
		throttle(titleDepth.respond(), 50);
		throttle(stickdepth.respond(), 50);
	});
	
	$('#prevnext li').click(function() {
		if( ($(this).attr('id') == 'next') && (curPos < articlect) ){ curPos++; }
		else if(($(this).attr('id') == 'prev') && (curPos > 1)){ curPos--; }
		else { return false }
		var target = $('#t'+curPos).offset().top - 49;
		$('html, body').animate({ scrollTop: target}, 1000);
	});
	$('ul#sections').add('ul#subsections').menuDeck();
	$('#sections').children('li').children('a').click(function() {
	   var target = $($(this).attr('ref')).offset().top - 49;
	   $('html, body').animate({ scrollTop: target}, 1000);
	});
	
	intent
		.on('titleDepth', function() {
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
		.on('width', function() {
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
			window.setTimeout(function(){
				contentPos = $('#content').offset().top;
				intent.axes.stickdepth.contexts[0]['min'] = contentPos;
				stickdepth.respond();
				manageTitlePos();
			}, 500);
		})
		.on('container', function() {
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
};