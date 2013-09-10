---
layout: post
title: Responding to User's Visit Frequency
sub: Or... Number of Visits as an Axis
tag: example
---

{%highlight js%}
if(!window.localStorage.getItem('visits')){
   window.localStorage.setItem('visits', 1);
}

var visits = parseInt(window.localStorage.getItem('visits'), 10) + 1;
window.localStorage.setItem('visits', visits);
{%endhighlight%}