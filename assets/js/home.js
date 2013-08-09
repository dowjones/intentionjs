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
		contentPos = $('#content').offset().top + 12;
	});
	if(intent.is('standard') || intent.is('hdtv')) { stdInit.resolve(); }
	else { 
		intent.on('standard', function() { stdInit.resolve(); });
		intent.on('hdtv', function() { stdInit.resolve(); });
	}
	in_init(['tablet'], function(){
		equalizeAll('#smallCode', 'pre');
		writeOutput(intent.axes.width.current);
		contentPos = $('#content').offset().top + 12;
	});
	in_init(['smalltablet'], function(){
		writeOutput(intent.axes.width.current);
		contentPos = $('#content').offset().top + 12;
	});
	in_init(['mobile'], function() {
		writeOutput(intent.axes.width.current);
		contentPos = $('#content').offset().top + 12;
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
		   var percent = $('#all').scrollTop() / $('#heightWrapper').height();
			intent.axes.container.respond('pseudostandard');
			$('#all').css({
            'width':'',
				'height':''
			}); //remove inline styles created by toggleOrientation
			var docHeight = $('#heightWrapper').height();
			$(window).scrollTop((percent*docHeight) - 100);
		} else {
			intent.axes.container.respond(device);
			$('#all')
				.css({'width':'', 'height': ''});
		}
	});
	
	//For docs nav
	var articles = $('#content article').not('.special').not('article:has(article)'); //Do not select special articles, or container articules
	$.each(articles, function() { //Create back to top links ---- This must go before the title positions are found.
		var markup = $('<div class="jump"><a>&uarr; Back to top</a></div>');
		$(this).append(markup).addClass('clearFix');
	 	  markup.click(function() {
			$('html, body').animate({ scrollTop: contentPos+3}, 1000);
		});
	});
	
	//For docs nav
	var titleCtx = [],
		curPos,
		articleCt = $('#docs').children('article').not('.special').length,
		i = 1;
	$.each($('#docs').children('article').not('.special'), function() { //then create the nav 
		$(this).attr('id', 't'+i); //#targeti
		if($(this).children('h2').attr('alt')) { var text = $(this).children('h2').attr('alt'); }
		else{ var text = $(this).children('h2').text(); }
		var markup = '<li id="a'+i+'"><a href="#t'+i+'" >'+text+'</a></li>', //#anchori
			pos = $(this).offset().top - 50, //minus 20 for padding
			ctx = {name:'t'+i, val:pos},
			sub = $(this).children('article'),
			s = 1;
		titleCtx.push(ctx);
		$('ul#sections').append(markup);
		i++;
	});
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
			return scroll;
		}
	});
	titleDepth.respond();
	$(window).on('scroll', function(){
		throttle(titleDepth.respond(), 50);
		throttle(stickdepth.respond(), 50);
	});
	
	$('#prevnext li').click(function() {
		console.log('clicked. old curPos', curPos);
		console.log('totalArticles', articleCt);
		if( ($(this).attr('id') == 'next') && (curPos < articleCt) ){ curPos++; }
		else if(($(this).attr('id') == 'prev') && (curPos > 1)){ curPos--; }
		else { return false }
		
		console.log('new curPos', curPos);
		var target = $('#t'+curPos).offset().top - 49;
		$('html, body').animate({ scrollTop: target}, 1000);
	});
	$('ul#sections').add('ul#subsections').menuDeck();
	
	intent
		.on('titleDepth', function() {
			curPos = intent.axes.titleDepth.current.slice(1);
			console.log('curpos', curPos);
			$('ul#sections')
				.children('.cover').removeClass('cover')
				.end() //in case no .cover is found
				.children('a:nth-of-type('+curPos+')').addClass('cover');
		})
		.on('sticknav', function(){
			$('#docs').css('padding-top', $('#topNav').outerHeight());
		})
		.on('start', function() {
			$('#docs').css('padding-top', '');
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
				console.log('rewritten contentPos', contentPos);
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