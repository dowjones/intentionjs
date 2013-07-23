var buildHome = function(contentPos, D) {
	//Basic var setup
	var currentPos = 0,
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
			{name:'dawn',min:7},
			{name:'dusk',min:0}
		],
		matcher: function(test, context) {
			if($.type(test) == 'string') {
				return test == context.name;
			}
			return test >= context.min;
		},
		measure: function(arg) {
			if($.type(arg) == 'string'){
				console.log("string", arg);
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
		var device = $(this).attr('id'),
			current = intent.axes.container.current;
		if(device == current) {
			$('#all').css({
				'width':$('#all').height() + 'px',
				'height':$('#all').width() + 'px'
			});
		} else if(device === undefined) {
			intent.axes.container.respond('pseudostandard');
		} else {
			intent.axes.container.respond(device);
			$('#all')
				.css({'width':'', 'height': ''})
				.removeClass()
				.addClass(device);
		}
	});
	
	//For docs nav
	var titlePos = [],
		curentPos,
		i = 1;
	$.each($('#content article').not('.highlight'), function() { //Create back to top links
		var markup = '<div class="clear"><a intent in-width in-container>&uarr; Back to top</a></div>';
		$(this).append(markup);
	});
	$(window).on('scroll', function() { //first setup listeners
		//Gotta reset these for IE8
		if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
		else { var scroll = pageYOffset; }
		
		//Fixing the docsNav position
		if(scroll >= contentPos) { $('#content nav').addClass('fixed'); }
		else { $('#content nav').removeClass('fixed'); }
	});
	$.each($('.docsLite h2'), function() { //then create the nav 
		$(this).attr('id', 't'+i); //#targeti
		var text = $(this).attr('alt'),
			markup = '<li id="a'+i+'"><div class="label"><a href="#t'+i+'">'+text+'</a></div><div class="circle"></div></li>', //#anchori
			pos = $(this).offset().top;
		titlePos.push(pos); //add these positions to an array to show the current location in the nav
		$('#docsNav ol').append(markup);
		i++;
	});
	$(window).on('scroll', function() { //Content nav scrolling acctions
		if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
		else { var scroll = pageYOffset; }
		$.each(titlePos, function(index, value) { //This could be more efficient if the array went from largest to smallest
			if(scroll >= value) { //If scrolled past the target
				$('#a'+(index+1)).children('.circle').addClass('active');
				currentPos = index+1;
			} else if(scroll+$(window).height() >= $(document).height()) { //if reached the bottom of the page
				$('#docsNav li').children('.circle').addClass('active');
			} else {
				$('#a'+(index+1)).children('.circle').removeClass('active'); //if none have been reached
			}
		});
	});
	$('#prevnext div').click(function() {
		var lastArt = $('#content article').not('.highlight').length,
			dir = $(this).attr('class');
		if( ($(this).attr('class') == 'next') && (currentPos < lastArt) ){ currentPos++ }
		else if(($(this).attr('class') == 'prev') && (currentPos > 1)){ currentPos-- }
		$('html, body').animate({ scrollTop: $('#t'+currentPos).offset().top - 27}, 1000); //minus 27 so you don't obscure the heading
	});
	$('article>.clear a').click(function() { //decide what "top" means depending on the device
		var widthCtx = intent.axes.width.current,
			conCtx = intent.axes.container.current;
		if((widthCtx == 'standard') && (conCtx == 'pseudostandard' || conCtx == undefined)) { var target = '#content' }
		else { var target = '#all>nav' }
		$('html, body').animate({ scrollTop: $(target).offset().top}, 1000);
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
				equalizeAll('.docsLite .equalize', 'section');
			}
			//When the context switches, reset the targets
			contentPos = $('#content').position().top + 3,
			titlePos = [];
			$.each($('.docsLite h2'), function() {
				var pos = $(this).offset().top;
				titlePos.push(pos);
			});
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
				equalizeAll('.docsLite .equalize', 'section');
			}
			//When the context switches, reset the targets
			contentPos = $('#content').position().top + 3,
			titlePos = [];
			$.each($('.docsLite h2'), function() {
				var pos = $(this).offset().top;
				console.log($(this), pos);
				titlePos.push(pos);
			});
		});
};