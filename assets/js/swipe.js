var buildSwipe = function(id) {
	console.log("Is swipe being called?");
	var corresElement,
		currentHeight,
		width;
	var currentPosition	= 0,
		slides			= $(id).children('section'),
		numberOfSlides 	= slides.length;
	var currentHeight	= slides.height;
		
	function manageControls(currentPosition){
		corresElement = currentPosition+1,
		currentHeight = $(id+' section:nth-child('+corresElement+')').height();
		console.log("slide #", corresElement, "has a height of ", currentHeight);
		$('#slidesContainer').css('height', currentHeight);
		$(id+' .circle').removeClass('active');
		$(id+' .circle:nth-child('+corresElement+')').addClass('active');
	};
	

	var setStyles = function(){
		width = slides.parent().parent().parent().width(); //Get the <article>'s full width and subtract 20 for the left/right padding. This method is used to get a dynamic width that will readjust when the user changes device orientation.
		console.log("parent1", slides.parent(), slides.parent().width());
		console.log("parent2", slides.parent().parent(), slides.parent().parent().width());
		console.log("parent3", slides.parent().parent().parent(), slides.parent().parent().parent().width());
		console.log("parent4", slides.parent().parent().parent().parent(), slides.parent().parent().parent().parent().width());
		console.log("this new width is", width);
		slides.css({
			'float'	: 'left',
			'width'	: width,
			'overflow': 'hidden',
			'margin-left':0,
		})
		.children()
			.css('box-sizing','border-box');
		$('#slidesContainer')
			.children('.slideInner')
				.css('width', numberOfSlides*width+'px')
				.animate({
					'marginLeft' : -currentPosition * width
				}, 500)
			.parent()
				.css({
					'width'	:width+'px',
					'height':currentHeight+'px'
				});
		console.log("moved the .slideInner ", (-currentPosition*(width-10)));
		
		console.log("ok", slides, pres);
		
		//get currentposition, reset the margin-Left to be -currentposition*(width-20)
		
	};
	
	var startStyles = function(){
		slides.wrapAll('<div id="slidesContainer"><div class="slideInner"></div></div>');
		setStyles();
	};
	
	startStyles();		

	
				
	
	var pres = slides.children('pre');

	$('#slidesContainer').css('overflow','hidden').after('<div class="indicators"></div>');
	//Add current slide indicators
	for(var i = 1; i <= numberOfSlides; i++) {
		var indicatorMarkup = '<div class="circle '+i+'" ></div>';
		$(id+' .indicators').append(indicatorMarkup);
	}
	
	//Create listeners for .control clicks
	$('.slideInner').swipe({
		swipeLeft:function(){
			if(currentPosition!=numberOfSlides-1){ //if there was a left swipe, and it's not the final slide
				currentPosition += 1;
				manageControls(currentPosition);
				$('.slideInner').animate({'marginLeft'	: (width)*(-currentPosition)}, 500);
			}
		},
		swipeRight:function(){
			if(currentPosition!=0){
				currentPosition -= 1;
				manageControls(currentPosition);
				$('.slideInner').animate({'marginLeft'	: (width)*(-currentPosition)}, 500);
			}
		}
	
	});
	
	manageControls(currentPosition);
	
	intent.on('landscape', function(){
		setStyles();
		manageControls(currentPosition);
	});
	intent.on('portrait', function() {
		setStyles();
		manageControls(currentPosition);
	});
	
};
