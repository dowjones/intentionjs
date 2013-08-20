---
layout: post
title: Super Simple Intentional Stylesheet Loader
sub: And Other Initialization Tips
tags: example
demo: /examples/mediaquery_link/index.html
---

Intention.js obviously gives you an easy way to apply specific classes to elements based on the current context, but suppose you have entirely separate stylesheets for different contexts. Intention.js can help here, too! All that's needed is an attribute manipulation on a stylesheet link. 

{% highlight html %}
<link rel="stylesheet" intent
   in-mobile-href="css/mobile.css"
   in-tablet-href="css/tablet.css"
   in-standard-href="css/standard.css" />
{% endhighlight %}

This will only load the stylesheet when the attribute becomes valid HTML (i.e. when the corresponding context is passed), so you don't have to worry about `tablet.css` loading when it doesn't have to. This way, the stylesheets don't have to overwrite each other: the link just changes with the axis' contexts.

#### Doing more with initialization

There are times when you need to do something a little more complicated, especially when the page first loads. It can be hard to make context specific event handlers that also affect Intention's first response. Often times the first response has already happened by the time your event handler is even created. For this case, we can use jQuery's [Deferred Objects](http://api.jquery.com/category/deferred-object/).

{% highlight javascript %}
var init = function(contexts, callback){
   var dfds = [],
   
   _.each(contexts, function(ctx){
      var dfd = $.Deferred();
      
      dfds.push(dfd);
      
      if(intent.is(ctx)) {
         dfd.resolve();
      } else {
         intent.on(ctx, dfd.resolve);
      }
   });
   
   $.when.apply(this, dfds).done(callback);
};

init(['mobile'], function() {
   console.log('mobile ctx is first passed');
});
init(['standard', 'tablet'], function() {
   console.log('both standard and tablet have been passed');
});
{% endhighlight %}

*Note: the `init` function uses some syntax from [Underscore.js](http://Underscore.js), which is a dependency for intention.js*

The above function takes two parameters: an array of context names and a callback function. With each context, it creates a deferred object and adds it to a master array. If the user is *already* in that context when the `init` function is called, the callback function parameter will fire. If the user is not already in that specific context,  `init` will create an event handler to wait for the context to pass true. 

You can create advanced initialization functions by using an array of multiple context names as a parameter. This is where the master array of deferred objects is useful. Using `.apply()` to create a master deferred object that is only [resolved](http://api.jquery.com/deferred.done/) when all of its "child" deferred objects are resolved, we can create an event handler that waits for multiple contexts to be satisfied before firing.   In other words, `.apply()` allows us to say "when the user has been through both contextX and contextY, run this function."

#### Applying it back to CSS loaders


{% highlight javascript %}
var cssLoader = function(stylesheets, contexts){
   var dfds = [],
   sheetWriter = function(){
      _.each(stylesheets, function(sheet) {
         $('head').append(
            $('<link rel="stylesheet">')
               .attr('href', sheet));
      });
   };
   
   _.each(contexts, function(ctx){
      var dfd = $.Deferred();
      
      dfds.push(dfd);
      
      if(intent.is(ctx)) {
         dfd.resolve();
      } else {
         intent.on(ctx, dfd.resolve);
      }
   });
   
   if((!contexts) || (contexts.length === 0)){
      sheetWriter();
   }
   
   $.when.apply(this, dfds).done(sheetWriter);
};

cssLoader(['css/mobile.css', 'css/another.css'], ['base', 'mobile']);
cssLoader(['css/tablet.css'], ['base', 'tablet']);
cssLoader(['css/standard.css'], ['base', 'standard']);
{% endhighlight %}

The above function will also load stylesheets on top of one another, and also allow you to load multiple sheets per context. It takes two parameters: an array of stylesheets to load and an array of contexts that require those stylesheets.

##### [Check out a demo of the deferred object loader here.](/examples/mediaquery_link/dfds.html)