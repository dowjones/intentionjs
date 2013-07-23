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
	
	$(document)
		.ready(function() { //Things that need the page to be done before running
			contentPos = $('#content').offset().top + 3;
			if(docsTest == true) { buildHome(contentPos, D); }
			else { buildBlog(contentPos); }	
		})
		.on('scroll', function(){
			if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
			else { var scroll = pageYOffset; }
			if(scroll >= contentPos){ //Get rid of nav instructions
				window.setTimeout(function() {
					$('#content nav').children('h6').fadeOut(500);
				}, 1000);
			}
		});
	
	//Functions for opening the documentation nav (.active is open)
	$('#content nav')
		.one('mouseenter', function() { $(this).children('h6').fadeOut(500); })
		.on('mouseenter', function() { $(this).addClass('active'); })
		.on('mouseleave', function() {
			window.setTimeout(function() {
				$('#content nav').removeClass('active');
			}, 500);
		});

});