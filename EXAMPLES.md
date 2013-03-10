## intention.js examples

### Example Quick Links
* [Animation](/examples/animation) 
* [Grid Demo](/examples/grid) 
* [Performance](/examples/performance) 
* [Scroll Depth](/examples/scrolldepth) 
* [WSJ Example](/examples/WSJ) 
* [CSS Asset Loader](/examples/css_loader) 
* [Media Query Optimizer](/examples/mediaquery_link) 
* [Tests](/test/) 

### Descriptions

#### [Animation](/examples/animation)
Animation illustrates non-traditional uses of contexts. An animated character walks back and forth with the scroll position, cycling through 4 possibilities.
```javascript
		var intent = new Intention;
		var walking = intent.responsive([
	    	{name: 'step1', div:0},
	    	{name:'step2', div:1},
	    	{name:'step3', div:2},
	    	{name:'step4', div:3}],
	    	// matcher
	    	function(measure, ctx){
	    		return (Math.floor(measure/100) % 4) === ctx.div ? true : false;
	    	},
	    	// measure
	    	function(){
	    		return window.pageXOffset ? window.pageXOffset : window.document.documentElement.scrollLeft;
	    	});

		var lastXOffset = 0,
			flip = intent.responsive([{name:'back', val:0}, 
					{name:'forth', val:1/0}], 
					function(measure, ctx){
						if((measure - lastXOffset) < ctx.val) {
							lastXOffset = measure;
							return true;
						}
						lastXOffset = measure;
						return false;
					}, function(){
						return window.pageXOffset ? window.pageXOffset : window.document.documentElement.scrollLeft;
					});

		walking();
		flip();
		
		intent.elements(document);

		$(window).on('scroll', walking);
		$(window).on('scroll', flip);
```
#### [Grid Demo](/examples/grid) 

Core grid manipulation functionality. Illustrates context-variable class modifications and move functionality.
```html
					<section class="col10wide column"
						in data-in-base-class="column" 
							 data-in-mobile-class="col3wide" 
							 data-in-tablet-class="col6wide" 
							 data-in-standard-class="col10wide">
						...
					</section>

					<div in data-in-base-append="#ad"
								  data-in-standard-append="#ad"
								  data-in-mobile-append="#mobile_ad"
								  data-in-tablet-append="#tablet_ad">
					</div>
```