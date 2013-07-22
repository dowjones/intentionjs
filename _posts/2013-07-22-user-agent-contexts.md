---
layout: post
title: Using User Agents as Contexts
tags: example
---

A while ago, when [we presented Intention.js at SXSW](http://www.slideshare.net/everyplace/intentionally-dealing-with-responsive-design), someone asked if user agents could be used as contexts. After all, sometimes you need to be more specific than estimating device resolutions. Luckily, [Guido Kritz](http://guidokritz.com/) whipped up a quick example of how easy it is. With some slight adjustments, here it is:

{% highlight javascript %}
var ua = intent.responsive({
   ID: 'useragent',
   contexts: [
      {name: 'android',	exp: 'android'},
      {name: 'ios', exp: 'iphone|ipod|ipad'},
      {name: 'mac', exp: 'macintosh'}
   ],
   matcher: function(measure, ctx){
      var regex = '/' + ctx.exp + '/i';
      return regex.test(measure);
   },
   measure: function(){
      return navigator.userAgent;
   }
}).respond();
{% endhighlight %}


First we set up the fragments of some regular expressions that we'll test against the userAgent string. If we're looking for Android devices, we'll specify android as the <code>exp</code> value. When we're looking for iOs devices, we'll set a few options to look for the strings "iPhone", "iPod", and "iPad". 

The measure function grabs the userAgent string, something like <code>Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36</code>.

Then the matcher function goes through the threshold group (the array of contexts) one at a time, looking to match the specified <code>exp</code> value regardless of case (<code>... /i</code>). If that test passes true, the function will exit the array and set the true context as the current context for the <code>userAgent</code> axis. 

Then we immediately make the site respond to the threshold groups.

For visualization purposes:

{% highlight html %}
<style>
	#ua { width: 200px; height:200px; background:blanchedalmond; }
	#ua:after { content:"something else"; }
	#ua.android:after { content:"Android"; background:yellowGreen; }
	#ua.ios:after { content:"Some type of iOs device"; background:skyblue; }
	#ua.mac:after { content:"Macintosh"; background:silver; }
</style>
<div id="ua" intent in-userAgent>You are using </div>
{% endhighlight %}