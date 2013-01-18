# Intention.js

## Howda do

install the dependencies [jquery]

	npm install


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


open **lib/main.html** in the browser. Notice the number of 
CSS & JS files that it pulls **(8 in total)**. Then run: 

    make build

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


### Intention.js

