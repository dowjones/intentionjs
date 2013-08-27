---
layout: post
title: Testing the Scroll Depth
sub: Sticky elements & changing the page based on scroll
tags: example
demo: /examples/scrolldepth
---

Building upon the animation demo, showing how to cycle through numerous possibilities as a result of scroll depth. There are a number of different scroll depth axes at work here, but we'll break them down one by one.

#### Stick elements once they scroll
A common UI technique is to fix an element's position once it has reached that position in the scroll. Most often, elements stick when they hit the top of the window. 

{% highlight js %}
var navDepth = $('nav').position().top,
scrolldepth = intent.responsive({
   ID: 'scrolldepth',
   contexts: [
      {name:'fix', val:navDepth},
      {name:'top', val:0}
   ],
   matcher: function(measure, ctx) {
      return measure >= ctx.val;
   },
   measure: function(){
      return window.pageYOffset;
   }
}).respond;
// ...
$(window)
   .on('scroll', scrolldepth);
{% endhighlight %}

{% highlight js %}
var depthTracker = intent.responsive(
   [{name: 'shallow', depth:25},
    {name:'beyond', depth:Infinity}],
   // matcher
   function(measure, ctx){
      if(measure < ctx.depth) { return true; }
      return false;
   },
// measure
function(){
return window.pageYOffset;
});

$(window).on('scroll', depthTracker);
{% endhighlight %}
