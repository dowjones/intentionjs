# Intention.js

## Howda do

install the dependencies [jquery]

	npm install


Intention
	DOM Manipulation based on a html attribute specifications

	Three manipulation types: class, attribute, placement (move)

	An algo to determine the best match in a set of attributes is used for single value attributes

	in the case of classes (multi-value attribute) a combination algo is used. simple union

	


Context
	Reports information about the browser window when the dimension crosses a user defined threshold

	information reported is: 
		threshold value (number in pixels)
		name of threshold (allows for easy integration with intention framework)
		pixel density
		interaction mode (mouse or touch)

	The purpose of this software is to constantly incorporate new interaction modes and the transition between them
		i.e. Device A transitions from touch interaction mode -> mouse interaction via a mouseDeviceDetected event (imaginary js event)






### Usage


	//include the script in your HTML file:
	<script src="intention.js"></script>


	// Implement like so:
	window.appIntentions = new window.Intention({
		thresholds:{mobile:400, desktop:768},
		respond:function(info){
			console.log(info);
			//do whatever crazy stuff you want!
		}});

	//Or simply (if the names are not important):
	window.appIntentions = new window.Intention({
		thresholds:[400,768],
		respond:function(info){
			console.log(info);
			//do whatever crazy stuff you want!
		}});

	// access any value on the appIntentions object like so:
	window.appIntentions.value('width'); // returns the current width of the window

	// OR
	window.appIntentions.value('threshold'); // returns the name of the current threshold



## Authors
	
	* Joe Kendall
	* Erin Sparling


That will create a directory called **build/**. Open **build/main.html** in the browser.
You'll see that it will only pull **4 files**. That is because the build-step combines 
all CSS and JS into the fewest possible number of files.

## Testing

Do this once to get all of the testing dependencies:

    npm install

Run the following to test the project (testing is done via [Mocha](http://visionmedia.github.com/mocha/)):

    make test


## License
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


## SORT THROUGH

	
	derive context features
		placement
		class/attr base
		set theory: union (all options are the union of the base plus context spec, if there is no context spec it is the base)
		empty attr + context specific attr means there is no base
			provide a list of supported attrs and save all of their bases 


	fix the getter and setter for "responsive elms" in intention


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


