---
layout: post
title: Testing the Scroll Depth
tags: example
---

### [See demo](/examples/scrolldepth)

Building upon the animation demo, showing how to cycle through numerous possibilities as a result of scroll depth.

{% highlight js %}
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
{% endhighlight %}
