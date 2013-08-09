<article id="basics" class="equalize" data-pattern="2">
  <h2 alt="The Basics">Let's start with the basics, though.</h2>
  <section>
    <h3 alt="Thresholds, Axes, Contexts">Thresholds, Axes, &amp; Contexts</h3>
    <p>Intention.js works by determining what are called “threshold groups”. These threshold groups define  the context in which a user is viewing your site. Threshold groups work by measuring an axis, like the browser’s width or the device’s pixel density (for high resolution screens).</p>
    <p>A lot of these contexts are predictable, and a common pattern of them are included in a handy implementation of intention.js called context.js</p>
    <pre><span class="comment"><i>Axis</i></span>

      - <i>context_name, value</i></span>

width <span class="comment">(a window of at least <i>x</i> pixels wide)</span>
- mobile, 0
- tablet, 510
- standard, 840
orientation <span class="comment">(degree of window.rotation)</span>
- portrait, 0
- landscape, 90
touch <span class="comment">(window.ontouchstart boolean)</span>
- touch, true
highres <span class="comment">(devicePixelRatio > 1)</span>
- highres, true</pre>

</section>
<section>
  <h3 alt="Manipulations">Methods</h3>
  <p>intention.js has three basic manipulations: attribution manipulations, class manipulations, and placement manipulations. With these three, you can change the value of any attribute, add or remove an element’s class, and adjust the position of an element within the structure of the document. </p>

  <p>Intention.js comes with Context.js, which provides you with some commonly used context groups (or <i>axes</i>). It includes:</p>


</section>

</article>
