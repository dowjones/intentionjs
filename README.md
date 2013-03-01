# Intention.js

DOM Manipulation based on a html attribute specification

## Why Intention.js

The interface to define differences between documents should be in HTML. The manipulation of attributes is a better way to restructure a page than media queries. Because relying on CSS/HTML document flow patterns to change the hierarchy of a design is not sufficient to convey appropriate infomation. 

## Installation

include the script on your page via require
```html
	<script data-main="assets/js/main" src="assets/js/require/require.js"></script>
```
initialize the script
```javascript
	new Intention();
```

## Usage

By default Intention provides three responsive contexts: mobile (320), tablet (768) and desktop (1000)

a "base" context is recommended to solve the scenario where the client enters a context that has not been specified on an element. in other words this is the *fallback* context

Three manipulation types: class, attr, move (placement) 

### Attribute Manipulation
```html
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
```

### Class Manipulation
```html
	<!--  -->
```

### Placement Manipulation
```html
	<!--  -->
```
Intention determines the best match in a set of attributes when more that one may apply




## Authors
	
	* Joe Kendall
	* Erin Sparling


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
