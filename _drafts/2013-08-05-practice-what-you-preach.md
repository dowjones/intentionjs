---
layout: post
title: Forcing Contexts and Explaining This Site's Responsiveness
tags: example
---

It's only fair that a site promoting a responsive web design tool should itself be… you know, responsive. So that's what we did. Hopefully you noticed on the [documentation overview](../../../index.html) that you can preview what the site looks like in different horizontal axis contexts. You can also manually resize your window to see how things shift around. The most interesting changes happen on that documentation page, so let's break them down.

First of all, let's discuss how basic layout styling goes down.

{% highlight HMTL %}
<div id="all" intent in-width in-container>
	<header intent in-width in-container>
		…
	</header>
	<section id="splash" intent in-width in-container>
		…
	</section>
	<section id="codeImage" intent in-width in-container>
		… 
	</section>
	<section id="smallCode" intent in-width in-container>
		… 
	</section>
	<section id="heading">
		… 
	</section>
	<nav id="topNav" intent in-width in-container in-orientation>
		… 	
	</nav>
	<section id="content" intent in-width in-container>
		<nav id="prevnext" intent in-width in-container>…</nav>
		<nav id="leftNav" intent in-width in-container>…</nav>
	</section>
</div>
{% endhighlight %}

Right off the bat, you can see there are a lot of instances of <code>intent in-width in-container</code>. Of course, you could use `#all` as the main intentional element, and style all of its children according; but that's a matter of preference. Here, we are marking the flagging the major elements as intentional so that in our CSS we can be compact and succinct. (Rather than styling things `#all.standard header { … }` we will  use `header.standard`).

Let's start with the top and go down.
{% highlight HTML %}
<div id="all" intent in-width in-container>
	…
</div>
{% endhighlight %}

We are using a wrapper that basically is emulating the `body` tag. As an element we can control its size—and subsequently manipulate its children—without affecting the browser window's size. With this pseudo-body element, we can create a custom axis   `container_width` that serves the same function as the default window width `horizontal_axis` included in Context.js (hence the <code>in-container</code>).

{% highlight javascript %}
var container_width = intent.responsive({
		ID: 'container',
		contexts: [
			{name:"pseudohdtv",min:1220},
			{name:"pseudostandard",min:840},
			{name:"pseudotablet",min:768},
			{name:"pseudosmalltablet",min:510},
			{name:"pseudomobile",min:0}
		],
		matcher: function(test, context) {
			if(typeof test === 'string'){ return test === context.name;	}
			return test >= context.min;
		},
		measure:function(arg) {
			if(typeof arg === 'string'){ return arg; }
			return $("#all").width();
		}
	});
$('#devices').children().click(function(){
	var device = $(this).attr('id');
	intent.axes.container.respond(device);
});
{% endhighlight %}

In this axis, which measures the wrapper `#all`'s width, we don't respond on window resize. Instead, when an element is clicked, we take that element's ID and force the `container_width` axis to respond. Specific parts of the measure and matcher functions let us do this.

{% highlight javascript %}
…
matcher: function(test, context) {
	if(typeof test === 'string'){
		return test === context.name;
	}
	return test >= context.min;
},
measure:function(arg) {
	if(typeof arg === 'string'){
		return arg;
	}
	return $("#all").width();
}
… 
{% endhighlight %}

Before the measure function begins to measure the wrapper's width, it first checks to see if it has been passed a string. In instances like this, that's likely true. <code>intent.axes.container_width.respond('pseudomobile')</code>. 

The measure function then returns that value to the matcher function, which compares it against the values set up in the contexts array. It too, though, first checks to see if the value passed to it is a string instead of a number (which it would a width measurement would likely be). If that is the case, the matcher function will return the context that has a `name` value that matches the string passed in.

Back to the HTML, we see that the wrapper `#all` is flagged as responsive `in-container`. Therefore, when a `container_width` context is passes, its name will be assigned to `#all` as a class. In general, those classes are a set of width and height values that "shrink" the viewport and have the layout adjust accordingly. In our CSS, we write the mobile stylings to also include "pseudo" contexts.

{% highlight css %}
heading.mobile, heading.pseudomobile{
	/* smaller device styles */
}
{% endhighlight %}
