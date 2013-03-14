# The [Who](#who), [What](#what), [Where](#where), [When](#where) and [Why](#why) of intention.js

## What
Intention.js is a library to help with the edge-cases in responsive design that are apparent in large-scale implementations. Flipping the standard convention of "html is static, css can fix everything" mentality, the philosophical underpinnings are very straight-forward: What if the html for a given site is always correct?

With a standard responsive design website, there are choices made very early on in the process that have ramifications throughout the lifetime of the site. Generally, modern web designs adhere to a [print-inspired grid system](http://grids.subtraction.com/) to help with structure, balance and visual consistency. Problems start to arise though when translating a grid, rendered in static html, from a large device to a smaller one. Using a 10- or 12-unit grid on a desktop makes perfect sense, but discussing a design on a phone tends to focus on 3- or 4-unit grids. The html to accommodate both of these concerns is either too general, using conceptual-hierarchy-only class names like "main" or "secondary", or too specific, in which case a designer talks about a 3-unit design, but a developer has to code based on 12-unit semantic mark-up.

Through the use of the intention.js library, developers are able to effectively code variables into their html, describing certain configurations that should exist, if a given context is achieved. By having a layout physically alter itself from a 12-unit grid to a 3-unit grid, significant time-savings are achieved in less re-writing of code, more consistent re-use, and an easier communication process between designers and developers, who can meaningfully talk about the same thing from both a conceptual and code perspective.

## Who
Intention.js was created at the Dow Jones Design Studio, starting in the fall of 2011. Joe Kendall, as the lead of new platforms within the Design Technology team, was the key author of intention.js, performing both a complete re-write of Erin Sparling's original prototype, as well as completely re-thinking the relationship between the library and contexts, providing the generalized solution that we know of as intentions today, and the context-extension pattern found in context.js.

The Design Studio is comprised of more than 60 designers, user experience and design technology-focused individuals, led by Brandon Whightsel, Sharon Denning and Erin Sparling respectively. Without the hard work of the complete team, this library wouldn't have existed in the way that it does today. 

Ben Rubenstein worked through countless IA iterations around what the most desirable ux would be for a given context, filtering editorial requirements via Kevin Delaney's team (later superceded by Raju	Narisetti), working hand-in-hand with Katharine Bailey to handle the product requirements of what an intentional site would mean to the broader organization, and championed by Daniel Bernard, then the Chief Product Officer for The Wall Street Journal.

Camila Mercado spent hours above and beyond her normal commitment to build the gh-pages site for intention.js, with the ever-helpful creative direction of Paul Pangrazzi.

