console.log('base.js loaded');

$(window).load(function() {
	console.log('base.js window loaded');
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
	
	//Look for what page it actually is: docs or the blog
	if(docsTest == true) { 
		contentPos = $('#docs').offset().top + 42;
		buildHome(contentPos, D);
	} else { 
		$('#content .inner').offset().top + 3;
		buildBlog(contentPos);
	}
	
	function in_init(contexts, callback){
	  var dfds = [];
		console.log('context parameter:', contexts);
		console.log('callback param', callback);
		
	  _.each(contexts, function(ctx){
	    var dfd = $.Deferred();
		
	    dfds.push(dfd);
	
	    if(intent.is(ctx)) {
	    	console.log('good to go, this is', ctx, 'time to resolve');
	      dfd.resolve();
	    } else {
	    	console.log('wait to resolve. this is ', ctx);
	      intent.on(ctx, dfd.resolve);
	    }
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
	
});