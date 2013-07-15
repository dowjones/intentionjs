#Let's start with the basics, though.
	Intention.js has three basic manipulations: attribution manipulations, class manipulations, and placement manipulations. With these three, you can change the value of any attribute, add or remove an element’s class, and adjust the position of an element within the structure of the document.
	
	Intention.js comes with Context.js, which provides you with some commonly used context groups (or <i>axes</i>). It includes:
	<pre><i>Axis</i>
	- <i>context_name, value</i>
	
width (a window of at least <i>x</i> pixels wide)
	- mobile, 0
	- tablet, 510
	- standard, 840
orientation (degree of window.rotation)
	- portrait, 0
	- landscape, 90
touch (window.ontouchstart boolean)
	- touch, true
highres (devicePixelRatio > 1)
	- highres, true
	</pre>
	
#Usage
	Giving Intention.js instructions is as easy as flagging the element as "intentional" and giving it an intentional attribute.
	
	<pre>&lt;div intent in-mobile&gt;</pre>
	
	<i>For the purposes of documentation, <code>in-</code> will be used instead of the proper HTML-valid <code>data-in-</code>.</i>

## Class Manipulations
	The simplest intentional attribute is a class manipulation. This manipulation adds the current context as a class to the element. Adding <code>in-axis_name</code to a flagged element is enough to get it working. 
	
	<pre>&lt;img intent in-orientation src="cat.jpg" /></pre>
	yields the following 
	<pre>//In portrait orientation
	&lt;img class="portrait" src="cat.jpg" /&gt;
	//In landscape orientation
	&lt;img class="landscape" src="cat.jpg" /&gt;</pre>
	
	Intention does not touch classes that are assigned outside of <code>in-</code> commands — so <code>&lt;div class="foo" intent in-width /&gt;</code> will keep it's class <code>foo</code> regardless of what <code>horizontal_axis</code> context is passed.
	
# Attribute Manipulations
	Intention.js can also manipulate an element's attributes with more specificity than just class manipulations. Set a base (default) attribute in case no contexts are met, then specify context-specific attribute values.
	
	<pre>&lt;img intent
		in-base-src="reg_img.png"
		in-highres-src="big_img.png" /&gt;</pre>
	yields:
	<pre>//On regular devices
	&;t;img src="reg_img.png" /&gt;
	
	//On retina displays
	&;t;img src="big_img.png" /&gt;</pre>
	
	Attribute manipulation can used for more specific class manipulations, too. 
	
	<pre>&lt;section intent 
		in-mobile-class="narrow"
		in-tablet-class="medium"
		in-standard-class="wide" /&gt;</pre>

#Placement Manipulations
	<p>Intention.js makes it possible to rearrange elements about a page depending on the context. </p>
	
	<p>Suppose we want to demote the status of the navigation when the user is on smaller devices. The following specification on the navigation might do what we need:</p>
	
	<pre>&lt;header&gt;
   &lt;nav intent 
      in-mobile-prepend="footer"
      in-tablet-append="section"
      in-standard-append="header"&gt;
   &lt;section&gt; ... &lt;/section&gt;
   &lt;footer&gt; ... &lt;/footer&gt;</pre>
	
	When the device is 320px wide or less, the navigation will at the top of the footer. When the device is between 321px and 768px wide, it will appear right below the <code>section</section>. Obviously, in larger displays (wider than 769px) the navigation at the end of the  header.
	
	<h3>Move functions</h3>
	Intention.js provides four basic functions for rearranging elements. They include:
	<pre>- prepend
- append
- before
- after</pre>
 	<p>These function just like jQuery DOM manipulations.</p>
 	<pre>intent in-context_name-move_function="selector"</pre>
 	<p>Selectors can be general element selections like above (<code>...prepend="footer"</code>), or specific (<code>...prepend="#intro"</code>)</p>
	
	
	
	
	
	
	
	
	
	
	
	
	
	