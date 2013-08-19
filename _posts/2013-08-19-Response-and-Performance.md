---
layout: post
title: Response Times &amp; Performance Test
tags: example
demo: /examples/performance/
---

Here's a very simple test that demonstrates how fast intention.js is. The page has three `div`s. The first is loaded with styles from the start—loaded with the DOM. The other two are given a green background and `::before` content *only after* intention.js has registered them as intentional objects and has responded to its axes. 

{% highlight html %}
<div id="init">Class assigned without intent in source.</div>
<div intent in-base-class="base loaded"></div>
<div intent in-width: ></div>
{% endhighlight %}

{% highlight css %}
/* Will be green from the start */
div#init{
   background: seagreen;  
}

/* Class assigned to all tests when intention responds */
div.loaded{
   background: seagreen;
}

/* When the base context (the catch-all context that's always on) is passed */
div.base::before{
   content: "Base context passed. '.loaded' class assigned";
}

/* Browser width axis*/
div.mobile, div.tablet, div.standard{
   background: seagreen;
}
div.mobile::before, div.tablet::before, div.standard::before{
   content: "Width axis responded. '.loaded' class assigned.";
}
div.mobile::after{ content: "Mobile viewport"; }
div.tablet::after{ content: "Tablet viewport"; }
div.standard::after{ content: "Standard viewport"; }
{% endhighlight %}

At page load, the second and third `div`s are not assigned a class. When Intention responds, they are assigned a class `.loaded` that gives them a green background. They are also assigned `content` properties specific to the context that passed.

All of these assignments, of course, should seamless with the page load, demonstrating how quick your page can dynamically restructure.