$(function() {
	var docsPos,
	charTest = $('#charTest').length > 0,
	docsTest = $('#docsLite').length > 1,
	scaleFont = function(){ //requires a <span id="charTest"/> wrapped around one character
		if(charTest == true) {
			var width = $('pre').width(), 
				tWidth = $('span#charTest').width(),
				tHeight = $('span#charTest').height(),
				ratio = tWidth / tHeight,
				charWidth = width/60, 
				charHeight = charWidth / ratio,
				currentSize = $('span#charTest').css('font-size'), 
				currentSize = currentSize.slice(0, currentSize.length-2),
				newSize = Math.floor((currentSize * charHeight / tHeight))+'px',
				selection = $('pre').not('#rawCodeImage').not('#standardCodeImage').not('#mobileCodeImage');
			$.each(selection, function() { $(this).css('font-size', newSize); });
		}
	};
	$(window)
		.on('ready', function() { scaleFont(); if(docsTest == true){ docsPos = $('#docsLite').position().top + 3; } })
//		.on('resize', function() {	scaleFont(); }); //this is causing some shakes, conflicting with the resize for the minixample
	
	var container_width = intent.responsive({
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
	});
	var time = intent.responsive({
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
	intent.on('time', function() { $('#timeExample').text(intent.axes.time.current); });
	$('#timeChange').change(function() {
		if($(this).children('option:selected').val() == '') { time.respond(); }
		else { time.respond($(this).children('option:selected').val()); }
		if(intent.axes.width.current == 'mobile' || intent.axes.width.current=='smalltablet') {
			$(document).scrollTop($('#timeExample').offset().top);
		}
	});
	time.respond();
	
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
	
	var i = 1,
		titlePos = [];
	
	intent
		.on('width', function() {
			var device = intent.axes.width.current;
			writeOutput(device);
			if(device === 'mobile') {
				unequalize('#docsLite .equalize', 'section');
				unequalize('#typesOfManip', 'section');
				unequalize('#smallCode', 'pre');
			} else if(device === 'smalltablet') {
				equalizeAll('#smallCode', 'pre');
				unequalize('#docsLite .equalize', 'section');
				unequalize('#typesOfManip', 'section');
			} else {
				equalizeAll('#smallCode', 'pre');
				equalizeAll('#docsLite .equalize', 'section');
			}
			//When the context switches, reset the targets
			docsPos = $('#docsLite').position().top + 3,
			titlePos = [];
			$.each($('#docsLite h2'), function() {
				var pos = $(this).offset().top;
				console.log($(this), pos);
				titlePos.push(pos);
			});
		})
		.on('container', function() {
			var device = intent.axes.container.current,
				device = device.slice(6, device.length);
			writeOutput(device);
			if(device === 'mobile') {
				unequalize('#docsLite .equalize', 'section');
				unequalize('#typesOfManip', 'section');
				unequalize('#smallCode', 'pre');
			} else if(device === 'smalltablet') {
				equalizeAll('#smallCode', 'pre');
				unequalize('#docsLite .equalize', 'section');
				unequalize('#typesOfManip', 'section');
			} else {
				equalizeAll('#smallCode', 'pre');
				equalizeAll('#docsLite .equalize', 'section');
			}
			//When the context switches, reset the targets
			docsPos = $('#docsLite').position().top + 3,
			titlePos = [];
			console.log('emualtion', docsPos);
			$.each($('#docsLite h2'), function() {
				var pos = $(this).offset().top;
				console.log($(this), pos);
				titlePos.push(pos);
			});
		});

	$(window).on('scroll', function() {
		if(typeof pageYOffset == 'undefined') { //scrolldepth for IE
			var B= document.body,
				D= document.documentElement,
				D= (D.clientHeight)? D: B;
			var scroll = D.scrollTop;
		} else {
			var scroll = pageYOffset;
		}
		if(scroll >= docsPos) {
			$('#docsNav').addClass('fixed');
			window.setTimeout(function() {
				$('#docsNav').children('h6').fadeOut(500);
			}, 1000);
		} else {
			$('#docsNav').removeClass('fixed');
		}
		$.each(titlePos, function(index, value) { //test the scroll position against all recorded target positions
			if(scroll >= value) { //If scrolled past the target
				$('#a'+(index+1)).children('.circle').addClass('active');
			} else if(scroll+$(window).height() >= $(document).height()) { //if reached the bottom of the page
				$('#docsNav li').children('.circle').addClass('active');
			} else {
				$('#a'+(index+1)).children('.circle').removeClass('active'); //if none have been reached
			}
		});
	});
	$('#docsNav').one('mouseenter', function() {
		$(this).children('h6').fadeOut(500);
	});
	
	//Create targets, anchors, and labels for inter-documentation navigation
	if(docsTest == true){
		$.each($('#docsLite h2'), function() { 
			$(this).attr('id', 't'+i); //#targeti
			var text = $(this).attr('alt'),
				markup = '<li id="a'+i+'"><div class="label"><a href="#t'+i+'">'+text+'</a></div><div class="circle"></div></li>', //#anchori
				pos = $(this).offset().top;
			titlePos.push(pos); //add these positions to an array to show the current location in the nav
			$('#docsNav').append(markup);
			i++;
		});
	} else {
		console.log("blog");
		buildBlogNav();
	}
	
	//Show the current location in the documentation on scroll
	//Functions for opening the documentation nav (.active is open)
	$('#docsNav')
		.on('mouseenter', function() { $(this).addClass('active'); })
		.on('swiperight', function() { $(this).addClass('active'); })
		.on('mouseleave', function() {
			window.setTimeout(function() {
				$('#docsNav').removeClass('active');
			}, 500);
		})
		.on('swipeleft', function() { $('#docsNav').removeClass('active'); });
			
	//Keep this out here, and organize it later
	//For debugging IE8..
	var coordinates = {
			'orangeDark':['one'],
			'orangeLight':[],
			'greenDark':[],
			'greenLight':[],
			'greenDark':[],
			'blueDark':[],
			'blueLight':[]
		},
		span = $('#codeImage span').not('span.white').not('span.ignore').not('span.selectable'),
		length = span.length,
		i = 1;
	$.each(span, function() {
		var classname = $(this).attr('class'),
			width	= $(this).width(),
			height	= $(this).height(),
			position= $(this).position(),
			x		= position.left + 15,
			y		= position.top + (0.5 * height) + 1,
			color	= $(this).css('color'),
			parent	= $(this).parent().attr('id');
		if(parent == 'rawCodeImage') {
			x = x + width;
		}
		var xy	= {'x':x, 'y':y, 'color':color};
		coordinates[classname].push(xy);
		if(i == length){
			drawCodeImage(coordinates);
		} else {
			i++;
		}
	});
});