var buildHome = function(contentPos, D) {
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
	in_init(['standard'], function(){
	  imageSetup();
	  equalizeAll('#docs', 'article.equalize', 'section');
	});
	in_init(['hdtv'], function(){
	  imageSetup();
	  equalizeAll('#docs', 'article.equalize', 'section');
	});
	in_init(['tablet'], function(){
		equalizeAll('#smallCode', 'pre');
		writeOutput(intent.axes.width.current);
	});
	in_init(['smalltablet'], function(){
		equalizeAll('#smallCode', 'pre');
		writeOutput(intent.axes.width.current);
	});
	in_init(['mobile'], function() {
		writeOutput(intent.axes.width.current);
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
    makeSticky = function() {
    	if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
    	else { var scroll = pageYOffset; }
    	//Fixing the nav
    	if(scroll >= contentPos) { $('#content nav').addClass('fixed').parent().css('padding-top', '30px'); }
    	else { $('#content nav').removeClass('fixed').parent().css('padding-top', ''); }
    },
	container_width = intent.responsive({
		ID: 'container',
		contexts: [
			{name:"pseudohdtv",min:1800},
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
			intent.axes.container.respond('pseudostandard');
			$('#all').css({
				'width':'',
				'height':''
			}); //remove inline styles created by toggleOrientation
		} else {
			intent.axes.container.respond(device);
			$('#all')
				.css({'width':'', 'height': ''})
				.removeClass()
				.addClass(device);
		}
	});
	
	//For docs nav
	var articles = $('#content article').not('.highlight').not('article:has(article)'); //Do not select highlight articles, or container articules
	$.each(articles, function() { //Create back to top links ---- This must go before the title positions are found.
		var markup = $('<div class="jump"><a>&uarr; Back to top</a></div>');
		$(this).append(markup).addClass('clearFix');
		markup.click(function() {
			$('html, body').animate({ scrollTop: $('#topNav').offset().top}, 1000);
		});
	});
	
	//For docs nav
	var titleCtx = [],
		subCtx = [],
		curentPos,
		articleCt = $('#content article').not('.highlight').length,
		i = 1;
	$.each($('.docsLite h2'), function() { //then create the nav 
		$(this).parent().attr('id', 't'+i); //#targeti
		var text = $(this).attr('alt'),
			markup = '<li id="a'+i+'" intent in-width in-t'+i+'-class="active"><div class="label"><a href="#t'+i+'">'+text+'</a></div><div class="circle"></div></li>', //#anchori
			pos = $(this).parent().offset().top - 20, //minus 20 for padding
			ctx = {name:'t'+i, val:pos},
			sub = $(this).siblings('article'),
			s = 1;
		titleCtx.push(ctx);
		$('#leftNav ol, #topNav ol').append(markup);
		intent.add($('#leftNav #a'+i));
		
		if(sub.length>0) {
			$('#leftNav li#a'+i).append('<ul/>');
			$.each(sub, function() { 
				var text = $(this).children('h3').attr('alt'),
					pos = $(this).offset().top - 20, //minus 20 for padding
					subTarget = 't'+i+'s'+s,
					subAnchor = 'a'+i+'s'+s,
					markup = '<li id="'+subAnchor+'" intent in-base-class="inactive" in-'+subTarget+'-class="active"><a href="#'+subTarget+'">'+text+'</a></li>',
					ctx = {name:subTarget, val:pos};
				subCtx.push(ctx);
				$(this).attr('id', subTarget);
				$('#leftNav li#a'+i+' ul').append(markup);
				intent.add($('#'+subAnchor));
				s++;
			});
		}
		
		i++;
	});
	titleCtx.reverse();
	subCtx.reverse(); //Maximum -> minimum
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
	}),
	subDepth = intent.responsive({
		ID: 'subdepth',
		contexts: subCtx,
		matcher: function(test, context){
			return test >= context.val;
		},
		measure: function(arg){
			if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
			else { var scroll = pageYOffset; }
			return scroll;
		}
	});
	titleDepth.respond();
	subDepth.respond();
	$(window).on('scroll', function(){
		throttle(titleDepth.respond(), 50);
		subDepth.respond();
		throttle(makeSticky(), 100);
	});
	
	$('#prevnext .inner div').click(function() {
		var dir = $(this).attr('class');
		if( ($(this).attr('class') == 'next') && (curPos < articleCt) ){ curPos++; }
		else if(($(this).attr('class') == 'prev') && (curPos > 1)){ curPos--; }
		else { return false }
		
		var target = $('#t'+curPos).offset().top;
		$('html, body').animate({ scrollTop: target}, 1000);
	});
	
	
	//Consolidated context switch functions 
	intent
		.on('width', function() {
			var device = intent.axes.width.current;
			writeOutput(device);
			if(device === 'mobile') {
				unequalize('.docsLite .equalize', 'section');
				unequalize('#smallCode', 'pre');
			} else if(device === 'smalltablet' || device === 'tablet') {
				unequalize('.docsLite .equalize', 'section');
				equalizeAll('#smallCode', 'pre');
			} else {
				equalizeAll('#docs', '.equalize', 'section');
			}
			//When the context switches, reset the targets
			contentPos = $('#content').position().top + 3;
		})
		.on('container', function() {
			var device = intent.axes.container.current,
				device = device.slice(6, device.length);
			writeOutput(device);
			if(device === 'mobile') {
				unequalize('.docsLite .equalize', 'section');
				unequalize('#smallCode', 'pre');
			} else if(device === 'smalltablet' || device === 'tablet') {
				unequalize('.docsLite .equalize', 'section');
				equalizeAll('#smallCode', 'pre');
			} else {
				equalizeAll('.docsLite', '.equalize', 'section');
			}
			//When the context switches, reset the targets
			contentPos = $('#content').position().top + 3;
		});
};