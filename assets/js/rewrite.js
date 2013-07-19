$(window).load(function() {
	//initial variables
	var charTest = $('#charTest').length > 0,
		docsTest = $('.docsLite').length > 0,
		i = 1,
		titlePos = [],
		contentPos,
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
		scaleFont();
	if(typeof pageYOffset == 'undefined') { //scrolldepth for IE8
		var B = document.body,
			D = document.documentElement,
			D = (D.clientHeight)? D: B;
	}
	
	$(document).ready(function() { //Things that need the page to be done before running
		contentPos = $('#content').offset().top + 3;
		if(docsTest == true) { buildHome(contentPos, D); }
		else { buildBlog(); }
	})
	.on('scroll', function(){
		if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
		else { var scroll = pageYOffset; }
		if(scroll >= contentPos){ //Get rid of nav instructions
			window.setTimeout(function() {
				$('#content nav').children('h6').fadeOut(500);
			}, 1000);
		}
	});;
	//Functions for opening the documentation nav (.active is open)
	$('#content nav')
		.one('mouseenter', function() { $(this).children('h6').fadeOut(500); })
		.on('mouseenter', function() { $(this).addClass('active'); })
		.on('swiperight', function() { $(this).addClass('active'); })
		.on('mouseleave', function() {
			window.setTimeout(function() {
				$('#content nav').removeClass('active');
			}, 500);
		})
		.on('swipeleft', function() { $('#content nav').removeClass('active'); });
		
	//Layout organizing
	intent
		.on('width', function() {
			var device = intent.axes.width.current;
			if(device === 'mobile') {
				unequalize('.docsLite .equalize', 'section');
				unequalize('#typesOfManip', 'section');
				unequalize('#smallCode', 'pre');
			} else if(device === 'smalltablet') {
				equalizeAll('#smallCode', 'pre');
				unequalize('.docsLite .equalize', 'section');
				unequalize('#typesOfManip', 'section');
			} else {
				equalizeAll('#smallCode', 'pre');
				equalizeAll('.docsLite .equalize', 'section');
			}
			//When the context switches, reset the targets
			//I'm not sure if i need to include these in home.js..... 
			contentPos = $('#content').position().top + 3;
		});
});