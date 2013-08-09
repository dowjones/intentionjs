<article>
  <h2>Manipulations</h2>

  <article class="equalize" data-pattern="2">
    <h3>Class Manipulations</h3>
    <section>
      <p>The simplest intentional attribute is a class manipulation. This manipulation adds the current context as a class to the element. Adding <code>in-axis_name</code> to a flagged element is enough to get it working.</p>
    </section>
    <section>
      <pre>&lt;img intent in-orientation src="a.jpg" /></pre>
      <p>&darr; &darr; &darr;</p>
      <pre><span class="comment">//In portrait orientation</span>
        &lt;img class="portrait" src="a.jpg" /&gt;

        <span class="comment">//In landscape orientation</span>
        &lt;img class="landscape" src="a.jpg" /&gt;</pre>
    </section>
    <section>
      <p>Intention does not touch attributes that are assigned outside of <code>in-</code> commands — so</p>
      <pre>&lt;div class="foo" intent in-width /&gt;</pre>
      <p>will keep it's class <code>foo</code> regardless of what <code>horizontal_axis</code> context is passed.</p>
    </section>
  </article>

  <article class="equalize" data-pattern="2">
    <h3>Attribute Manipulation</h3>
    <section>
      <p>Intention.js can also manipulate an element's attributes with more specificity than just class manipulations. Set a base (default) attribute in case no contexts are met, then specify context-specific attribute values.</p>
    </section>
    <section>
      <pre>&lt;img intent
        in-base-src="reg_img.png"
        in-highres-src="big_img.png" /&gt;</pre>
      <p>&darr; &darr; &darr;</p>
      <pre><span class="comment">//On regular devices</span>
        &lt;img src="reg_img.png" /&gt;

        <span class="comment">//On retina displays</span>
        &lt;img src="big_img.png" /&gt;</pre>
    </section>
    <section>
      <p>Attribute manipulation can used for more specific class manipulations, too.</p>

      <pre>&lt;section intent
        in-mobile-class="narrow"
        in-tablet-class="medium"
        in-standard-class="wide" /&gt;</pre>
    </section>
  </article>

  <article class="equalize" data-pattern="2">
    <h3>Placement Manipulation</h3>
    <section>
      <p>Intention.js makes it possible to rearrange elements about a page depending on the context. </p>
      <p>Suppose we want to demote the status of the navigation when the user is on smaller devices. The following specification on the navigation might do what we need:</p>
      <pre>&lt;header&gt;
        &lt;nav intent
        in-mobile-prepend="footer"
        in-tablet-append="section"
        in-standard-append="header"&gt;
        &lt;/nav&gt;
        &lt;section&gt; <span class="comment">...</span> &lt;/section&gt;
        &lt;footer&gt; <span class="comment">...</span> &lt;/footer&gt;
        &lt;/header&gt;</pre>

      <p>When the device is 320px wide or less, the navigation will at the top of the footer. When the device is between 321px and 768px wide, it will appear right below the <code>&lt;section&gt;</code>. Obviously, in larger displays (wider than 769px) the navigation at the end of the <code>&lt;header&gt;</code>.</p>
      <p> </p>
      <h3>Move functions</h3>
      <p>Intention.js provides four basic functions for rearranging elements. They include:</p>
      <pre>- prepend
        - append
        - before
        - after</pre>
      <p>These function just like jQuery DOM manipulations.</p>
      <pre>intent in-context_name-move_function="selector"</pre>
      <p>Selectors can be general element selections like above (<code>...prepend="footer"</code>), or specific (<code>...prepend="#intro"</code>).</p>
    </section>
    <section intent in-standard-class="show" in-mobile-class="hide" in-smalltablet-class="hide" in-tablet-class="hide"> <!--You could probably just use in-touch-class when that starts working again.-->
      <div id="resizeExample">
        <div id="resizable">
          <div id="miniFade"></div>
          <div class="orange" intent in-mini_example>
            <div id="orange1">Play with me</div>
            <div id="orange2"></div>
          </div>
          <div class="blue" intent in-mini_example in-small-before="#orange2" in-large-after=".orange"></div>
          <div class="green" intent in-mini_example in-small-after=".orange" in-large-append=".blue">
            <div id="green1"><a intent in-small-href="http://thisissmall.gov" in-large-href="http://wowthisishuge.info">A</a></div>
            <div id="green2">B</div>
            <div id="green3">C</div>
          </div>
        </div>
      </div>
      <pre id="resizeCode">&lt;div id="resizable"&gt;
        &lt;div class="orange" <span class="white">intent in-mini</span>&gt;
        &lt;div id="orange1"&gt; Play with me &lt;/div&gt;
        &lt;div id="orange2"&gt; &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="blue" <span class="white">intent in-mini</span>
        <span class="greenLight">in-avg-before="#orange2"</span>
        <span class="orangeDark">in-large-after=".orange"&gt;</span> &lt;/div&gt;
        &lt;div class="green" <span class="white">intent in-mini</span>
        <span class="greenLight">in-avg-after=".orange"</span>
        <span class="orangeDark">in-large-append=".blue"&gt;</span>
        &lt;div id="green1"&gt;
        &lt;a <span class="white">intent</span>
        <span class="greenLight">in-avg-href="#average"</span>
        <span class="orangeDark">in-large-href="#large"&gt;</span> A &lt;/a&gt;
        &lt;/div&gt;
        &lt;div id="green2"&gt; B &lt;/div&gt;
        &lt;div id="green3"&gt; C &lt;/div&gt;
        &lt;/div&gt;
        &lt;/div&gt;

        &lt;script&gt;
        var mini = intent.responsive({
        <span class="white">ID: 'mini',</span>
        contexts: [
        <span class="orangeDark">{name:"large",min:300},</span>
        <span class="greenLight">{name:"avg",min:75}</span>
        ],
        matcher: function(test, context) {
        return test &gt;= context.min;
        },
        measure:function(arg) {
        return $("#resizable").width();
        }
        }).respond();
        <span class="comment">//'resize' is a jQueryUI event</span>
        $('#resizable').on('resize', mini.respond);
        &lt;/script&gt;</pre>
    </section>
  </article>


</article>
