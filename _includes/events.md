<article class="equalize" data-pattern="2">
   <h2>Intent Events</h2>
   <section>
      <p>It's possible (and very easy) to set up event listeners for context changes. Intention.js allows for event binding for
         <ol>
            <li>When a specific context passes true</li>
            <li>When a specific context in a specific axis passes true</li>
            <li>When a specific axis passes any context</li>
         </ol>
      </p>
      <p>The syntax generally follows jQuery's syntax for event binding. Preface the <code>.on()</code> event handler with the namespace <code>intent</code>.</p>
      <p>The event itself is made up of two optional parts: an axis ID and a context name. The axis ID refers to the axis' ID property and should always be followed by a <code>:</code> . Using the axis ID on its own will fire every time a context in that axis is passed. Specifying a context name will narrow the event to fire only when that context within that axis is passed.</p>
      <p>Alternatively, an event handler can be created for contexts without a specified axis. Simply excluding the axis ID component (and its trailing <code>:</code>) will make a more general event listener for the specified context name. In this scenario, <b>be careful of naming conflicts</b>. If any two contexts share the same name, both will fire this same event.
      <p>Below is a list of reference IDs for the axes supplied in context.js</p>
      <pre><span class="comment">axis: ID
   - contexts</span>

horizontal_axis: width
   - standard
   - tablet
   - mobile
orientation_axis: orientation
   - portrait
   - landscape
touch: touch
highres: highres</pre>
   </section>
   <section>
   
      <h4>1. When a specific context passed true.</h4>
      {% highlight javascript %}
intent.on('contextName', function() {
// ...
});

intent.on('mobile', function() {
// ...
});
      {% endhighlight %}
      
      <h4>2. When a specific context in an specific axis passes true</h4>
      {% highlight javascript %}
intent.on('axisID:contextName', function() {
// ...
});

intent.on('width:mobile', function() {
// ...
});
      {% endhighlight %}
      
      <h4>3. When a specific axis passes any context</h4>
      {% highlight javascript %}
intent.on('axisName:', function() {
// where axisName is the axis' ID property
// ...
});

intent.on('width:', function() {
// ...
});
      {% endhighlight %}
      
      
   </section>
   <section><p><u>Note:</u> currently, Intention does not support multiple event types per event handler. You will have to chain events instead.</p></section>
</article>