# Intention.js

DOM Manipulation based on a html attribute specification

## Installation

install the dependencies [jquery, mocha]

	npm install

include the script on your page via require

	<script data-main="assets/js/main" src="assets/js/require/require.js"></script>

initialize the script

	new Intention();


## Usage

By default Intention provides three responsive contexts: mobile (320), tablet (768) and desktop (1000)

a "base" context is recommended to solve the scenario where the client enters a context that has not been specified on an element. in other words this is the *fallback* context

Three manipulation types: class, attr, move (placement) 

### Attribute Manipulation

	<!-- mark an element as responsive, set the base(default) attr, specify which image to load in a given context -->
	<img 
		data-intention 
		data-base-src="medium_img.png" 
		data-mobile-src="small_img.png"
		data-desktop-src="big_img.png" />

	<!-- the above spec will produce the following in each context
		mobile: <img src="small_img.png" />
		tablet: <img src="medium_img.png" />
		desktop: <img src="big_img.png" />
	-->


### Class Manipulation

	<!--  -->


### Placement Manipulation

	<!--  -->

Intention determines the best match in a set of attributes when more that one may apply



## Context

Reports information about the browser window when the dimension crosses a user defined threshold

information reported is: 
----------------------------------------------------
+	threshold value (number in pixels)
+	name of threshold
+	pixel density
+	interaction mode (mouse or touch)

-----------------------------------------------------

The purpose of this software is to constantly incorporate new interaction modes and the events that transition between contexts (resize, orientation change, etc.)


## Authors
	
	* Joe Kendall
	* Erin Sparling


## Testing

Do this once to get all of the testing dependencies:

    npm install

Run the following to test the project (testing is done via [Mocha](http://visionmedia.github.com/mocha/)):

    make test


## License

### Intention.js

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


### RequireJS 

RequireJS 0.22.0 Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
Available via the MIT or new BSD license.
see: http://github.com/jrburke/requirejs for details



## IGNORE BELOW!!! SORT THROUGH

	
	would one ever want multiple contextualizers?
		sure
			you could contextualize on a per mod level opposed to the window lvl

	would one ever want multiple intention libs?
		yes
			i wrote with the option for multiple instantiations so that we could think about a per module responsiveness
			wherein we manufacture a resize or other context change event for an individual element on the page



	data+1 [if prefix continue], function[move|attr] +0, context[mobile] +4, interaction[touch] +2, subfunction[append] +9

	// func should give 0 because for certain attrs the sub func is enough to derive the main

	data-move 1
	data-mobile-move 5
	data-touch-move 3
	data-touch-mobile-move 7
	data-mobile-touch-move 7

	data-mobile-move-append 8

	data-mobile-touch-move-append 9

	data-attr-class 5
	data-mobile-attr-class 8
	data-touch-attr-class 6

	// these three are all the same
	data-mobile-touch-attr-class 10
	data-touch-mobile-attr-class 10
	data-touch-mobile-class 10 

	[data, attr, class, touch, mobile, value]

	funcList
		class
		attr
		move

	attr([which attr], which val)

	class

	data-attr-id

	data-itn-mobile-touch-attr-class

	prefix option

	finding the correct attrs
		to get the base attrs we need a regex that looks for
			all attrs with the function and no context specification
			data-[function][^([context1|context2])]
				of this subset only those that are either of the current interaction model
				or
				no interaction model specified

	once we have found the subset of attrs to consider the data should be organized by filter
	remove "data"

	to organize into the respective functions first check to see if a sub func is employed

	instr = {
		class:{
			options:[{name:data-foo-bar,value:baz},]
		},
		attr: {
			options:[{name:data-foo,value:bar},
				{name:data-mobile-class, value:holler}]
		}
	}


	instr = {
		
		attr: {
			src:[{name:something, value:else}]
			href:[{name:something, value:else}] // choose best
			class:[class1,class2,class3],
		}
		move: 
	}




	{
		name:attr,
		category: [href],
		value: 'http://www.wsj.com'
		rank: 10
	}

	{attr:[class, val, context, interaction]}
	{move:[]}



	list of functions
		class
		move
		attr

