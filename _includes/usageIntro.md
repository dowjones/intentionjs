<article class="equalize" data-pattern="2">
  <h2>Usage</h2>
  <section>
    <p>Giving Intention.js instructions is as easy as flagging the element as "intentional" and giving it an intentional attribute.</p>

   {% highlight html %}
<div intent in-mobile>
   {% endhighlight %}

    <p><i>For the purposes of documentation, <code>in-</code> will be used instead of the proper HTML-valid <code>data-in-</code>.</i></p>
  </section>
  <section>
    <h3>Dependencies</h3>
    <p>Intention.js requires jQuery and Underscore.js to work. You can download and link to them manually, or you can include them via require.</p>
    {% highlight html %}
<script
   data-main="assets/js/context"
   src="assets/js/require/require.js">
</script>
   {% endhighlight %}
  </section>
  <section>
    <h3>This becomes</h3>
    <pre id="input">code code code</pre>
  </section>
  <div id="typesOfManip" class="thirds clearFix" intent in-width in-container in-touch in-touch-class="swipe">
    <section>
      <h5>on mobile</h5>
      <pre id="mobileOut">One
This code snippet will show
how the first code will look
on a mobile device.
Basically, just with a ".mobile"
class applied to it
Or a rearranged element.</pre>
    </section>
    <section>
      <h5>on tablets</h5>
      <pre id="tabletOut">two
Then how bout
This














   </pre>
    </section>
    <section>
      <h5>on desktops</h5>
      <pre id="stdOut">three</pre>
    </section>
  </div>
  <article>
    <h3>Compatibility</h3>
    <section></section>
  </article>
</article>
