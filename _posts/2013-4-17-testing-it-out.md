---
layout: post
title: "Flexible Responsive Axes Changing HTML Based on Orientation, Width, Touch and Resolution"
---

## Flexible Responsive Axes Changing HTML Based on Orientation, Width, Touch and Resolution

This release makes the html attributes a lot more flexible. In addition to a few API updates and performance improvements, I've, worked with the contributors and created an all around better system for interacting with *contexts* and *axes*.

What I noticed was that users were making a lot of specifications in html that look like this:

```html
<nav intent in-portrait-class="portrait"></nav>
```

This is unfortunate, but until now there was no way around it. The better way is to specify that an element should respond on a particular axis.

for example:

```html
<nav intent in-orientation></nav>
```

The above specification applies a class of the name of the current context to the element.

That means in portrait mode the element looks like:

```html
<nav class="portrait"></nav>
```

and in landscape mode:

```html
<nav class="landscape"></nav>
```

With these new changes to Intention.js, Context.js has been given an overhaul as well. Now all of the axes have names and can be taken advantage of using the method outlined above. Here's the breakdown of the axes in Context.js:

* width
  * mobile
  * tablet
  * standard
* orientation
  * portrait
  * landscape
* touch (only one context with same name)
* highres (only one context with same name)

To accomplish this a few changes have been made to the way axes are made.

Consider the following:

```javascript
var depth=intent.responsive({
  // all possible options specified
  ID: 'depth',
	contexts:[{name:'shallow', offset:100}, 
		{name:'deep', offset:1000}, 
		{name:'reallyDeep', offset:Infinity}],
	measure: function(){
		return document.pageYOffset;
	},
	matcher: function(measure, context){
		return measure <= context.offset;
	}
});
```

The above example is an axis that is designed to respond on the window scroll event. The most obvious use for this is probably sticking components at specific scroll depths.

```javascript
console.log(depth);
// shows:
// {
//   ID:'depth', 
//   current:null,
//   contexts:[{name:'shallow', offset:100}, 
//     {name:'deep', offset:1000}, 
//     {name:'reallyDeep', offset:Infinity}],
//   respond: function
// }
```

Previously intent.responsive returned a function, now that function is a property of the object returned. This way all of the information about the axis is accessible by the implementor of the library at any time.

Now I will attach the respond function to the window scroll event using jquery,call the same function to set the initial state of the axis and add a responsive element to intent.

```javascript
$(window).on('scroll', depth.respond);
depth.respond();
intent.add($('nav'))
```

Assuming this exists in the DOM:

```html
<nav intent in-depth></nav>
```

A class of either "shallow," "deep," or "reallyDeep" will be added to that element depending on the current scroll depth!

Enjoy!
