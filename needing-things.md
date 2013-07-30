# Needin' Thangs

## Notes on meshing content with form
- I think the whole "open source" ethics thing really demands "normal speak". All content should be written in a fairly casual voice.
- Try to constantly check what you think is implicit: there are things that seem obvious to those familiar with the tool and the language, but it's better to appeal to mass audience. While some Javascript and jQuery knowledge will make a user's experience easier, it would be ideal for a user to have the ability without advanced scripting knowledge. After all, this is a tool that works directly with HTML. 
- RE that point: Let's think of intention.js that **starts** with a base of making responsive design easier for the average front-ender and **ends** *(or DOESN'T end)* with creative responses to information.

## Okay with that in mind, here's what needs to be written for the site.
*Unless otherwise noted, all of these need code examples.*
- A "sales pitchy" explanation of why responsive design needs to happen in the DOM on the element level. This will be placed next to the download/github links. No code example needed, obviously.
	* 1 Shorter h1 pitch 
	* 1 longer paragraph elaborating on why h1 makes sense/why intention is important. This could also talk about the benefits of intention other more establish responsive methods
	* Someone once wrote an article (I can't find it right now) about how responsive design doesn't actually exist yet because it needs to happen on the element level. If we can find that, it would be awesome.
- A clear and concise description of the following terms (even if it's just linking certain terms as interchangeable) and how they relate: (This will go under "The Basics"). No code example needed, obviously.
	* Axes
	* Thresholds/Threshold groups
	* Contexts
- A paragraph about how Intention works: talk about how axes get saved as objects in `intent.axes`. How Intention will go through a list of contexts and exit when one passes true. How it works with attributes. The absolute basics of the technical. (This will also go under the usage)
- Base context example. The paragraph currently detailing it seems fine, but it could use a code sample. (This will go under usage)
- A section on manipulations: one that talks about how all manipulations happen via attributes, how that works, and the significance of it. (Manipulation will be its own article with the methods of manipulation as subsections). Probably good on examples here.
- Custom contexts
	- Firstly a callback to custom contexts' potential for awesome creative implementations
	- Describe the four main properties:	
		- ID and how it is referenced later (`in-axisName`, `intent.axes.axisName.current`), naming rules
		- Contexts: what they mean obviously, but conceptually how to order them. When to use maximum-value breakpoints, when to use minimum-value breakpoints. Naming rules
		- Matcher: what passes it values, what to do to allow for forced context (if the measure is a string), how it goes through the array in order. Describe the default matcher function.
		- Measure: seems fine just to describe this as the function that gets the data to which intention will respond. Describe the default function.
	- Describe how to control when and how the custom context responds
- A section about context events (both on axis events and context events)
- Something that references intent.axes.axisName.current
- A section about inserting responsive element with javascript. Simply appending a `<div intent in-width />` will not make an intentional element. You must also run `intent.add('#selector');`. This isn't in the documentation currently, so I think it's worth talking about maybe the order of operations? Like how when intention runs it gets all the intentional elements, but if you want to add one after, you need to … well … add it. This could also talk about the order of intention to context

## Organization
I'm not 100% on the flow of the docs, so here's some questions/qualms/thoughts on how it's organized.
- I like using a green bar to act as an em-dash. It should contain an escape from the current linear narrative: something that isn't exactly relevant to the track we're on but is still interesting and important. In application, I like using this highlight to suggest using intention.js in creative ways (beyond standard responsive web design). I'm not sure where it should interrupt the flow though.
- I'm worried there is a disconnect between the homepage/lite docs  and the hope for Intention's creative implementations. Currently the homepage feels like it's written for the intention/context.js bundle, not for intention on its own. Should the stuff specific to context have its own page? Its own section?
- In the original documentation, things like `in-mobile-class="narrow"` are included under **Class Manipulations**. While that's true, conceptually I think they fall more under **Attribute Manipulations**. Instead, I limited **Class Manipulations** to things like `in-orientation` or `in-width`
- I think `intent.axes.axisName.current` is rrreally important, but I can't figure out where to put it in the existing document structure. If there are other really useful properties (about which I don't know), a whole section about them could be great. A proposed section could be #5 in doc tree below.

## Proposed document tree:
1. The Basics: how it works, terminology, the order in which it operates, how to make elements intentional (initially by flagging them with `data-intent`, later by `intent.add()` )
2. Usage: dependencies, how it works on the element level with attributes
3. Manipulations: class manipulations, attribute manipulations, placement manipulations
4. Events: axis events, context events, in_init(?). Try to incorporate `intext.axes.axisName.current` because it seems important
5. Intent object items: `intent.axes.axisName.current`, lists of axes, lists of contexts within axes
6. Custom Contexts:
* Spotlight on creative implementations
* Everything is wrapped in an intent.responsive() objects
* Describe the properties of each responsive axis
* Matcher functions
* Measure functions
* Responding
7. Highlight some working examples

## Notes on content form:

`<article class="equalize" data-pattern="n"> // where n is the number of sections desired per row in the standard/luxury display contexts`
	<h2 alt="Handle for article">Article Title</h2> // where alt is a small summation that will be used as a link in the documentation navigation
	<section>A section of content documentation. The first section should be mostly explicit descriptions. Within a section, you can use an <h3/> to describe a subsection. Know that all content should fall within a section.</section>
	<section>The second section should contain 
		<pre>A code to exemplify what the first section describes</pre>
	</section>
	<section>
		Further sections can describe less important information. Sections left off as a remainder of the total number of sections divided by the data-pattern n will take the full width of the container. 

		For example, in an article with a data-pattern of 2, the fifth and final section will stretch across the container.
	</section>
`</article>`

`<article>`
	// articles don't have to be equalized. Equalizing them only makes them align into more of a grid. 
	<div class="thirds">
		// you can wrap the inner sections in a div.thirds to make it three columns, though.
		<section>left</section>
		<section>middle</section>
		<section>right</section>
	</div>
`</article>`