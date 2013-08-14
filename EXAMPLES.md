## Example Quick Links
* [Animation](/examples/animation)
* [Grid Demo](/examples/grid)
* [Performance](/examples/performance)
* [Scroll Depth](/examples/scrolldepth)
* [WSJ Example](/examples/wsj)
* [CSS Asset Loader](/examples/css_loader)
* [Media Query Optimizer](/examples/mediaquery_link)
* [Twitter Bootstrap Grid](/examples/bootstrap_grid)
* [960gs Fluid](/examples/960gs)
* [Touch Screen](/examples/touch)
* [Tests](/test/)

------

## Descriptions

### [Animation](/examples/animation)
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
------

### [Grid Demo](/examples/grid)
Core grid manipulation functionality. Illustrates context-variable class modifications and move functionality.

#### Context-specific re-classing
```html
<section class="col10wide column"
	in data-in-base-class="column"
		 data-in-mobile-class="col3wide"
		 data-in-tablet-class="col6wide"
		 data-in-standard-class="col10wide">
	...
</section>
```

#### Context-specific DOM manipulation
```html
<div id="ad">
	<div in data-in-base-append="#ad"
				  data-in-standard-append="#ad"
				  data-in-mobile-append="#mobile_ad"
				  data-in-tablet-append="#tablet_ad">
		...
	</div>
</div>
<div id="mobile_ad"></div>
<div id="tablet_ad"></div>
```

------

### [Performance](/examples/performance)
Image-loading as speed test, illustrating how early in the page-load the browser can respond to intentional deformations.

```html
<!-- Only become valid src attributes after intent is determined -->
<img intent in-base-src="img/tn-src.jpg" />
<img intent in-base-src="img/tn-src2.jpg" />
<img intent in-base-src="img/tn-src3.jpg" />
```

------


### [Scroll Depth](/examples/scrolldepth)
Building upon the animation demo, showing how to cycle through numerous possibilities as a result of scroll depth.
```javascript
var depthTracker = tn.responsive([
  	{name: 'shallow', depth:25},
  	{name:'beyond', depth:Infinity}],
  	// matcher
  	function(measure, ctx){
  		if(measure < ctx.depth) return true;
  		return false;
  	},
  	// measure
  	function(){
  		return window.pageYOffset;
  });

$(window).on('scroll', depthTracker);
```

------
