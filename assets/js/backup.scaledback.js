$(function() {
	var emulateScroll = function() {
		if(intent.is('standard')) {
			var docHeight = $(document).height();
			$(window).scroll(function() {
				var winHeight = $(window).height(),  //set here in case someone resizes their window after devide emulation
					offscreen = docHeight - winHeight,
					conHeight = $('#con').height(),
					allHeight = $('#all').height(), //set here in case someone changes device orientation
					docPos = $(document).scrollTop(), //how much is offscreen now
					percentage = docPos / offscreen, //percentage of page scrolled (looking for docPos to match offscreen)
					scroll = (percentage * (conHeight-allHeight) * -1) + 'px';  //find the equivalent scroll for the container by multiplying the percentage of the document scrolled by how much of the container would be offscreen (just like how we measured the offscreen of the document)
				$('#con').css('margin-top', scroll);
			});	
		}
	};
	scaleFont = function(){ //requires a <span id="charTest"/> wrapped around one character
		var width = $('pre').width(), 
			tWidth = $('span#charTest').width(),
			tHeight = $('span#charTest').height(),
			ratio = tWidth / tHeight,
			charWidth = width/60, 
			charHeight = charWidth / ratio,
			currentSize = $('span#charTest').css('font-size'), 
			currentSize = currentSize.slice(0, currentSize.length-2),
			newSize = Math.floor((currentSize * charHeight / tHeight))+'px';
		$.each($('pre'), function() { $(this).css('font-size', newSize); });
	};
	$(window)
		.on('ready', function() { scaleFont(); })
		.on('resize', function() {	scaleFont(); });
	
	var container_width = intent.responsive({
		ID: 'container',
		contexts: [
			{name:"pseudohdtv",min:1800},
			{name:"pseudostandard",min:840},
			{name:"pseudotablet",min:725},
			{name:"pseudosmalltablet",min:510},
			{name:"pseudomobile",min:0}
		],
		matcher: function(test, context) {
			if(typeof test === 'string'){
			  return test === context.name;
			}
			return test >= context.min;
		},
		measure:function(arg) {
			if(typeof arg === 'string'){
			  return arg;
			}
			return $("#all").width();
		}
	});
	
	//Things that could go in the firstStandard resolve function
	$('#devices').children().click(function() {
		var device = $(this).attr('id');
		intent.axes.container.respond(device);
		$('#all')
			.css({'width':'', 'height':''})
			.removeClass()
			.addClass(device);
		if(device === undefined){
			intent.axes.container.respond('pseudostandard');
		}
		$('.toggleOrientation').click(function() { //add toggleOrientation event
			var width = $('#all').width() + 'px',
				height	= $('#all').height() + 'px';
			$('#all').css({
				'width':height,
				'height':width
			});
		});
	});

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
		})
		.on('container', function() {
			var device = intent.axes.container.current,
				device = device.slice(6, device.length);
			writeOutput(device);
			emulateScroll();
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
		});
	
	//Remove later

	intent.on('standard', function() { console.log('standard'); });
	intent.on('tablet', function() { console.log('tablet'); });
	intent.on('smalltablet', function() { console.log('smalltablet'); });
	intent.on('mobile', function() { console.log('mobile'); });
	
});