---
layout: post
title: Weird Walking Man Animation
tags: example
---

### [Animation](/examples/animation)

Animation illustrates non-traditional uses of contexts. An animated character walks back and forth with the scroll position, cycling through 4 possibilities.



{% highlight js %}
var intent = new Intention,
    walking = intent.responsive([
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

{% endhighlight %}
