---
layout: post
title: Testing the Scroll Depth
sub: Sticky elements & changing the page based on scroll
tags: example
demo: /examples/scrolldepth
---

Building upon the animation demo, showing how to cycle through numerous possibilities as a result of scroll depth. There are a number of different scroll depth axes at work here, but we'll break them down one by one.

#### Stick elements once they scroll
A common UI technique is to fix an element's position once it has reached that position in the scroll. Most often, elements stick when they hit the top of the window. Suppose we want our navigation to be visible at any scroll depth.

{% highlight html %}
<header intent in-scrolldepth:>
   <div id="intro">
      <h1>Check out what...</h1>
      <h3>(A lot of things happen!)</h3>
   </div>
   <nav>
      <li>Home</li>
      <li>About</li>
      <li>Projects</li>   
   </nav>
</header>
{% endhighlight %}

{% highlight js %}
var navDepth = $('header').offset().top + $('header').outerHeight() - $('nav').outerHeight(),

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

We will construct a scroll depth axis that measures the `window.pageYOffset` (that is, the amount of the page that has been scrolled out of view) every time the user scrolls. The axis will contain at least two contexts: one for the top of page (where `window.pageYOffset = 0`) and one for the navigation's `position().top` on the page.

When the navigation is at the top of the window, the `window.pageYOffset` will be equal to the combined height of all the content that came before the currently visible content. We can find this value by measuring the container's position relative to the document (which in this case is 0) and adding the height of the that container.

At this point, we have a scroll depth value that is aligned to the bottom edge of the container. Knowing that the navigation is the bottom element in the container, we can subtract the height of the `nav` so that the scroll depth break point happens right at the start of the `nav`.

Back in our HTML, you will notice that it is the `header` that is flagged as intentional, not the `nav`. When the user scrolls into the "fix" context, `.fix` is applied as a class to the `header`. This allows us to add padding so that the `nav`'s transition between `position:relative` and `position:fixed` is not noticeable.

{% highlight css %}
/* layout */
nav{
   padding: 10px 0;
   height: 23px;
}
/* sticky nav */
header.fix{
   padding-top: 43px;
}
header.fix nav{
   width: 100%;
   position: fixed;
   top: 0;
   z-index: 5;
   box-shadow: 0px -7px 20px 10px rgba(0,0,0,.5);     
}
{% endhighlight %}

However scroll depth values are not as permanent as we'd like. If the window ever resizes, content is likely to be at a different scroll depth than before. In other words, when the window is resized to be narrower, individual elements wrap their content and become taller. To accommodate this, we must reset the recorded depth values whenever the window is resized.

{% highlight js %}
var manageDepths = function() {
   var newDepth = $('header').offset().top + $('header').outerHeight() - $('nav').outerHeight();
   intent.axes.scrolldepth.contexts[0]['val'] = newDepth;
};
// ...
$(window).on('resize', manageDepths);
{% endhighlight %}

Of course, this scroll depth axis can be expand to stick many objects. Keep in mind, though, that the depth breakpoints must be ordered from greatest to least in the context array. If you start with the smallest value (maybe 0 for pageStart), the first context will obviously pass true and the array will be escaped.

#### Responding to the percent scrolled
Should you not have specific scroll depth values, you can always use the percentage of the page scrolled as a metric. Here is a basic way to construct the axis:

{% highlight js %}
percentCtx = [];
for(var i = 1; i<=100; i++) {
   percentCtx.push( {name:'p'+i, val:i} )
}

percentCtx.reverse();

var percent = intent.responsive({
   ID:'percent',
   contexts: percentCtx,
   matcher: function(measure, ctx) {
      return measure >= ctx.val;
   },
   measure: function(){
      var pos = Math.floor((window.pageYOffset / ($(document).outerHeight() - $(window).height()) )*100);
      return pos;
   }
}).respond;

// every time the user scrolls to a new percentage
intent.on('percent:', function() {
   //omit the 'p' from the context name
   var per = this.axes.percent.current.slice[1]; 
   $('#posPer').text(per+'%');
});

$(window)
   .on('scroll', percent);
{% endhighlight %}

Rather than hard code our array of contexts inside the axis object, we will code it outside with the help of a loop. A loop with 100 iterations will create 100 objects with two fields: (1) an identifying name for the context and (2) a percentage value. In this example, we want a context for every whole number percentage; but it's easy to create ranges of percentages by changing how `i` increments.

Because the context array is created in order from least to greatest values, and because our matcher function is looking to pass contexts with lower scroll depth values than the percentage actually scrolled, we must reverse the order of our array. 

When the user has scrolled all the way to bottom, the sum of the `window.pageYOffset` and the `$(window).height()` will equal the total `$(document).outerHeight()`. In other words, the range pixels currently visible in the viewport plus the range of pixels that have been scroll out of sight will be equal the range of pixels that exist in the document's total height.

The measure function finds the percentage scrolled by dividing the `window.pageYOffset` by the actual amount of pixels that can be scrolled out of sight (the document height minus the window height). Then it converts the decimal to a pecentage, and `Math.floor` rounds it down to the nearest whole number. And a percentage is found!


#### Cycling through scroll depths

The following example (the yellow flipper) doesn't use specific breakpoints nor percentages, but rather cycles through its contexts every four pixels scrolled. Knowing that when the scroll position is divided by 4 the division remainder is either 0, 1, 2, or 3, this measure function takes advantage of the modulo operator.

{% highlight js %}
flipper = intent.responsive({
   ID:'depth',
   contexts:[
      {name: 'f1', div:0},
      {name:'f2', div:1},
      {name:'f3', div:2},
      {name:'f4', div:3}],
   matcher: function(measure, ctx){
      if((Math.floor(measure/100) % 4) === ctx.div) return true;
      return false;
   },
   measure: function(){
      return window.pageYOffset;
   }   
}).respond;
// ...
$(window).scroll(flipper);
{% endhighlight %}

The HTML just uses these as frames and creates classes as such: `.one .two .three .four`.

{% highlight html %}
<h2 intent
   in-f1-class="one"
   in-f2-class="two"
   in-f3-class="three"
   in-f4-class="four"></h2>
{% endhighlight %}

And assuming this CSS, we can create an animation!

{% highlight css %}
h2.one:after {
   content:'|';
}
h2.two:after {
   content:'/';
}

h2.three:after {
   content:'-';
}
h2.four:after {
   content:'\\';
}
{% endhighlight %}

##### Important notes
Internet Explorer 8 does not recognize `window.pageYOffset`. Instead, you can use the following

{% highlight js %}
// ...
measure: function(){
   if(typeof window.pageYOffset == 'undefined') {
      var scroll = window.document.documentElement.scrollTop;
   }
   else {
      var scroll = window.pageYOffset;
   }
   return scroll;
}
// ...
{% endhighlight %}