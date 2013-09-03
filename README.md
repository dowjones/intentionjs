# intention.js

DOM Manipulation via html attribute specification

## Why intention.js

It's like a super amped up version of media queries on a per element basis!

The technology for dealing with responsive design is all over the place. Media queries, hacky javascript, and convoluted HTML. intention.js allows you to make all of the changes to HTML in the HTML itself. It's a way to describe the necessary differences of an HTML document between one device and another.

What should the classes of an element be on mobile vs tablet? Where should your advertising code get placed when you're on a desktop? Does the page require an alternate slideshow widget on touch enabled devices? These are all changes that intention.js can make to the page based on a user's device. context.js creates a set of common page contexts for width thresholds, touch devices, highres displays and a fallback.


And you can easily add your own contexts on top of these or create all your own custom contexts.

## What's included:
	* intention.js
	* context.js

intention.js is the library that manages the responsive axis, manipulates elements based on their specifications and emits events when contexts change.

context.js is an implementation of intention.js that sets up common use patterns in responsive design.

Specifically it has the responsive contexts:
	* base (a catch-all)
	* mobile (triggered by width)
	* tablet (triggered by width)
	* standard (triggered by width)
	* portrait (orientation axis)
	* landscape (orientation axis)
	* touch
	* highres

## Installation

### Dependencies of intention
	* jquery
	* underscore.js

include scripts on your page or just Intention via require.

```html
	<!-- use with context defaults -->
	<script
		data-main="assets/js/context"
		src="assets/js/require/require.js"></script>
```

OR:

```html
	<!-- use only intention to build your own context -->
	<script src="underscore.js"></script>
	<script src="jquery.js"></script>
	<script src="intention.js"></script>
	<script src="context.js"></script>
	<script>
		// your amazing contextual threshold specification here!
	</script>
```


## Usage

By default context.js provides a number of threshold groups via intention.js: browser widths, orientation, touch, highres, and a base group

the default thresholds in each group are respectively:
mobile (510 and below), tablet (510 to 840) and standard (840 to Infinity)
portrait or landscape
touch (are touch gestures available)
highres (devicePixelRatio > 1)
base (default, always on)

There are three manipulation types: class names, attributes, placement on the page

### Interface

flag the element as "intentional"

```html
	<div intent>
```

Or for valid html:

```html
	<div data-intent>
```

An intentional attribute:

For the purposes of the documentation the prefix "in-" will be used instead of "data-in-" to keep the code snippets concise

#### Context aware elements

```html
	<img intent in-orientation: src="cat.jpg" />
```

In the "portrait" orientation the above implementation will produce:

```html
	<img class="portrait" src="cat.jpg" />
```

And in "landscape" orientation:

```html
	<img class="landscape" src="cat.jpg" />
```

context.js includes four context groups or "axes"

	* width
	* orientation
	* touch
	* highres

They are associated with the following classes

	* width
		* mobile
		* tablet
		* standard
	* orientation
		* portrait
		* landscape
	* touch
		* touch
	* highres
		* highres

Attribute structure: prefix-context-function="value"

i.e.

```html
	<div class="not interesting" intent in-mobile-class="more interesting">
```

### Types of manipulation

#### Attribute Manipulation

mark an element as intention, set the base(default) attribute, specify which image to load in a given context

```html
	<img
		intent
		in-base-src="small_img.png"
		in-highres-src="big_img.png" />
```

the specification above will produce the following in each context
default:

```html
<img src="small_img.png" />
```

highres:

```html
<img src="big_img.png" />
```

#### Class Manipulation

An element can have more than one class. intent's aim is to be as unobtrusive as possible, at the same time allowing for a lot of flexibility with the way classes are combined.

```html
	<section
		class="column"
		intent
		in-mobile-class="narrow"
		in-tablet-class="medium"
		in-standard-class="wide"
		in-luxury-class="x-wide"
		in-touch-class="swipe-nav"
	>...</section>
```

#### Placement Manipulation

take this html structure

```html
	<header><nav></nav></header>
	<section>...</section>
	<footer>...</footer>
```

suppose we want to demote the status of the nav when the user is on smaller devices

the following specification on the nav might do what we need

```html
	<nav intent
		in-mobile-prepend="footer"
		in-tablet-append="section"
		in-standard-append="header">
```

when the device is 320px units or below the nav will appear at the top of the footer. when the device is between 320 and 768 it will go to the end of the section tag, and so forth.

##### Move functions
	* prepend
	* append
	* before
	* after

#### Why a base context?

In most scenarios you don't want to have to specify the way something will change in *every* context. Often times an element will be one of two things among many different contexts. take an img tag with two possible sources, it's either going to be highres or not. by specifying the in-highres-src attribute, you know that the source will be appropriately applied in that scenario. With a in-base-src attribute, you can rely on the source being set accordingly for all other contexts.

### Making your own custom contexts or Intentional plugins

In addition to what is provided as a set of useful page contexts in the context.js script. You can define your own contexts, for anything!

You can extend the functionality of context.js or scrap the whole thing entirely.

Here is an example for scroll depth responsive axis:

```javascript
	var scrolldepth_axis = intent.responsive({
		ID: 'scrolldepth',
		// contexts
		contexts: [{name:'shallow', value:20}, {name:'deep', value:1/0}],
		// matching:
		matcher: function(measure, context){
			return measure < context.value;
		},
		// measure
		measure:function(){
			return window.pageYOffset;
		}});
```

intent.responsive returns an object with a bunch of useful properties.
probably the most important is "respond"
	when you want to evaluate which context is relevant call scrolldepth_axis.respond();

for the above example you would want to call the respond function on window scroll

like so:

```javascript
	$(window).on('scroll', scrolldepth_axis.respond);
```

The optional "ID" property allows for context aware element feature for the axis outlined above.

this will compare the measurement against each context and determine which context is relevant every time the window is scrolled.

Other properties of intent.responsive include:

	* ID
	* current (the current context)
	* contexts (the list of contexts you passed)

this will add all elements matching the "$('[data-intent],[intent],[data-in],[in]')" selector. Optionally pass a scope argument to this function to specify where in the dom to start searching. The default is the document.

calling the elements function will change the elements' attributes to the specification provided in the html as it finds them. This way your responsive axis can all be defined *before* any changes are made to the DOM.


#### The components intent.responsive

##### axis (contexts)

The thresholds are an array of context objects. the only requirement of these objects is that they have a name property.

name is a required property of a context object
```javascript
	[{name:'shallow'}, {name:'deep'}]
```

You can specify any other properties (such as scroll depth values)

```javascript
	[{name:'shallow', depth:20},
		{name:'deep', depth: Infinity}]
```

##### "matcher" function

The matching function is called for each item in the thresholds array until a match is made i.e. it returns true. it is totally optional. However if it is not specified a default will be used which matches based on the context name. have a look in the Default Compare Functions section for the specifics.

The context that produces a match is then understood as the current context for the threshold group. In other words there will only every be ONE matched context for a threshold group.

If a matching function is not specified this default is used:
```javascript
    function(measure, context){
      return measure === context.name;
    };
```

##### "measure" function

default measure function is a pass-through

```javascript
	function(arg){
      return arg;
    };
```

why? intent.responsive() // outputs a function. so calling the result of that function with an argument passed to it will get used as the measure arg in the *matcher* function

like so:

```javascript
	// make a responsive group *thresholds* is the array of contexts and *matcher* is a custom comparison function
	var responsive = intent.responsive(thresholds, matcher);
	// assuming we want to compare the scroll depth against each context you could do something like this:
	responsive(window.pageYOffset);
```

in this example window.pageYOffset would get passed as the first argument to the matcher function for every context until the matcher returns true.

#### Putting it all together

Threshold objects must be passed to intent.responsive as an array

The only other requirement is that the threshold object has a "name" property, i.e. {name:'slow_page'}. The name is used for two main things: emmiting an event of that name on the intent object and allowing you to create specifications in the html for that threshold.

	* names may *not* have dashes
	* names can have "_"
	* the regex to match them is simply: [_a-zA-Z0-9]+

to create an event handler for a threshold:

```javascript
intent.on('slow_page', function(){
	alert('try another wifi network');
});
```
to specify changes to the html when in that threshold

```html
	<img intent in-slow_page-src="toobad.gif" />
```

#### Default Matcher and Measure Functions

Matcher

```javascript
    function(measure, ctx){
      return measure === ctx.name;
    };
```

Measure

```javascript
  	// measure default is just a pass through
    function(arg){
      return arg;
    };
```


### Stuff to note:

### Master list of document manipulation types:

#### Multi-value attr (union of all current contexts)
	* class
#### Move Functions
	* append
	* prepend
	* before
	* after
#### Single-value attrs, (everything else)
	* any arbitrary atribute that doesn't include a dash.


## Author
	* Joe Kendall

## Contributors
	* Erin Sparling
	* Adrian Lafond
	* Mike Stamm

## Major Contributions to examples and documentation
	* Camila Mercado
	* Paul Pangrazzi



## License
```javascript
	// MIT license for everything

	// Copyright (c) 2012 The Wall Street Journal,
	// http://wsj.com/

	// Permission is hereby granted, free of charge, to any person obtaining
	// a copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to
	// permit persons to whom the Software is furnished to do so, subject to
	// the following conditions:

	// The above copyright notice and this permission notice shall be
	// included in all copies or substantial portions of the Software.

	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
