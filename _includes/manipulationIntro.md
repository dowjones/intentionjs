<article>
  <h2>Manipulations</h2>

  <article class="equalize" data-pattern="2">
    <h3>Class Manipulations</h3>
    <section>
      <p>The simplest intentional attribute is a class manipulation. This manipulation adds the current context as a class to the element. Adding <code>in-axis_name</code> to a flagged element is enough to get it working.</p>
    </section>
    <section>
      {%highlight html%}
<img intent in-orientation: src="a.jpg" />
      {%endhighlight%}
      <p>&darr; &darr; &darr;</p>
      {%highlight html%}
<!--In portrait orientation-->
<img class="portrait" src="a.jpg" />

<!--In landscape orientation-->
<img class="landscape" src="a.jpg" />
      {%endhighlight%}
    </section>
    <section>
      <p>Intention does not touch attributes that are assigned outside of <code>in-</code> commands — so</p>
      {%highlight html%}
<div class="foo" intent in-width: />
      {%endhighlight%}
      <p>will keep it's class <code>foo</code> regardless of what <code>horizontal_axis</code> context is passed.</p>
    </section>
  </article>

  <article class="equalize" data-pattern="2">
    <h3>Attribute Manipulation</h3>
    <section>
      <p>Intention.js can also manipulate an element's attributes with more specificity than just class manipulations. Set a base (default) attribute in case no contexts are met, then specify context-specific attribute values.</p>
    </section>
    <section>
       {%highlight html%}
<img intent
   in-base-src="reg_img.png"
   in-highres-src="big_img.png" />
      {%endhighlight%}

      <p>&darr; &darr; &darr;</p>

      {%highlight html%}
<!--On regular devices-->
<img src="reg_img.png" />

<!--On retina displays-->
<img src="big_img.png" />
      {%endhighlight%}
    </section>
    <section>
      <p>Attribute manipulation can used for more specific class manipulations, too.</p>

      {%highlight html%}
<section intent
   in-mobile-class="narrow"
   in-tablet-class="medium"
   in-standard-class="wide" />
      {%endhighlight%}
    </section>
  </article>

  <article class="equalize" data-pattern="2">
    <h3>Placement Manipulation</h3>
    <section>
      <p>Intention.js makes it possible to rearrange elements about a page depending on the context. </p>
      <p>Suppose we want to demote the status of the navigation when the user is on smaller devices. The following specification on the navigation might do what we need:</p>
      {%highlight html%}
<header>
   <nav intent
      in-mobile-prepend="footer"
      in-tablet-append="section"
      in-standard-append="header">
   </nav>
   <section> ... </section>
   <footer> ... </footer>
</header>
      {%endhighlight%}

      <p>When the device is 320px wide or less, the navigation will at the top of the footer. When the device is between 321px and 768px wide, it will appear right below the <code>section</code>. Obviously, in larger displays (wider than 769px) the navigation at the end of the <code>header</code>.</p>
      <p> </p>
      <h3>Move functions</h3>
      <p>Intention.js provides four basic functions for rearranging elements. They include:</p>
      {%highlight html%}
- prepend
- append
- before
- after
      {%endhighlight%}

      <p>These function just like jQuery DOM manipulations.</p>
      {%highlight html%}
intent in-context_name-move_function="selector"
      {%endhighlight%}

      <p>Selectors can be general element selections like above (<code>...prepend="footer"</code>), or specific (<code>...prepend="#intro"</code>).</p>
    </section>
    <section intent in-hdtv-class="show" in-standard-class="show" in-mobile-class="hide" in-smalltablet-class="hide" in-tablet-class="hide">
      <div id="resizeExample">
        <div id="resizable">
          <div id="miniFade"></div>
          <div class="orange" intent in-mini_example:>
            <div id="orange1">Play with me</div>
            <div id="orange2"></div>
          </div>
          <div class="blue" intent in-mini_example: in-small-before="#orange2" in-large-after=".orange"></div>
          <div class="green" intent in-mini_example: in-small-after=".orange" in-large-append=".blue">
            <div id="green1"><a intent in-small-href="http://thisissmall.gov" in-large-href="http://wowthisishuge.info">A</a></div>
            <div id="green2">B</div>
            <div id="green3">C</div>
          </div>
        </div>
      </div>

      {% highlight html %}
<div id="resizable">
   <div class="orange" intent in-mini:>
      Play with me
      <div id="orange1"> </div>
      <div id="orange2"> </div>
   </div>
   <div class="blue" intent in-mini:
      in-avg-before="#orange2"
      in-large-after=".orange"> </div>
   <div class="green" intent in-mini:
      in-avg-after=".orange"
      in-large-append=".blue">
      <div id="green1">
         <a intent
            in-avg-href="#average"
            in-large-href="#large"> A </a>
      </div>
      <div id="green2"> B </div>
      <div id="green3"> C </div>
   </div>
</div>
   {% endhighlight %}
   {% highlight javascript %}
var mini = intent.responsive({
   ID: 'mini',
   contexts: [
      {name:"large",min:300},
      {name:"avg",min:75}
   ],
   matcher: function(test, context) {
      return test >= context.min;
   },
   measure:function(arg) {
      return $("#resizable").width();
   }
});
mini.respond();
//'resize' is a jQueryUI event
$('#resizable')
   .on('resize', mini.respond);
      {% endhighlight %}
    </section>
  </article>


</article>
