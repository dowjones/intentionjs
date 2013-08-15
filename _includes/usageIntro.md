<article class="equalize" data-pattern="2">
  <h2>Usage</h2>
  <section>
      <h3>Basic Syntax</h3>
    <p>Giving Intention.js instructions is as easy as flagging the element as "intentional" and giving it an intentional attribute.</p>

   {% highlight html %}
<div intent in-mobile>
   {% endhighlight %}

    <p><i>For the purposes of documentation, <code>in-</code> will be used instead of the proper HTML-valid <code>data-in-</code>.</i></p>
  </section>
  <section>
    <h3>Dependencies</h3>
    <p>Intention.js requires <a href="http://jquery.com/">jQuery</a> and <a href="http://underscore.js" target="_blank">Underscore.js</a> to work. You can download and link to them manually, or you can include them via require.</p>
    {% highlight html %}
<script
   data-main="assets/js/context"
   src="assets/js/require/require.js">
</script>
   {% endhighlight %}
  </section>
  <section>
    <h3>Intention Markup</h3>
    {% highlight html %}
<header>
   <img src="logo.png" intent
      in-highres-src="retina.png" />
</header>

<nav intent
   in-mobile-prepend="#content"
   in-tablet-prepend="#content"
   in-standard-after="header"
   in-touch-class="swipeDrawer">

   <a id="about" intent
      in-mobile-href="about.html"
      in-tablet-href="about.html"
      in-standard-href="#about">About</a>
   <a id="projects" href="/faq"
      intent
      in-mobile-before="#about">FAQ</a>

</nav>

<div id="content" intent
   in-width in-orientation>
   This is all so easy!
</div>
    {%endhighlight%}
  </section>

  <div id="typesOfManip" class="thirds clearFix" intent in-width: in-container: in-touch:="swipe">

    <section>
      <h5>On an iPhone 5</h5>
      {% highlight html %}
<header>
   <img src="retina.png" />
</header>

<div id="content"
   class="mobile portrait">

   <nav class="swipeDrawer">
      <a href="/faq">
         FAQ
      </a>
      <a href="about.html">
         About
      </a>
   </nav>

   This is all so easy!

</div>

      {% endhighlight %}
    </section>

    <section>
      <h5>On Regular Tablets</h5>
      {% highlight html %}
<header>
   <img src="logo.png" />
</header>

<div id="content"
   class="tablet portrait">

   <nav
      class="swipeDrawer">
      <a href="about.html">
         About
      </a>
      <a href="/faq">
         FAQ
      </a>
   </nav>

   This is all so easy!

</div>
      {% endhighlight %}
    </section>

    <section>
      <h5>On Desktops</h5>
      {% highlight html %}
<header>
   <img src="logo.png" />
</header>

<nav class="swipeDrawer">
   <a href="about.html">
      About
   </a>
   <a href="/faq">
      FAQ
   </a>
</nav>

<div id="content"
   class="standard">

   This is all so easy!

</div>

      {% endhighlight %}
    </section>
  </div>
  <article>
    <h3>Compatibility</h3>
    <section>
       <p>Intention.js is tested to work on all modern browsers, including Internet Explorer back to IE8! Woo-hoo!
       <br/>
       <br/><u>Note:</u> jQuery 2.x dropped support for IE8, so obviously using it in conjunction with Intention will not work in IE8. If you don't care about that, rest assured there is nothing Intention needs in jQuery 1.x that isn't available in jQuery 2.x. </p>
    </section>
  </article>
</article>
