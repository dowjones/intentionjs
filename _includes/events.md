<article class="equalize" data-pattern="2">
   <h2>Intent Events</h2>
   <article>
      <section>
         <p>It's possible (and very easy) to set up event listeners for context changes. Intention.js supports event binding to scenarios such as:
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
   
   <article>
      <h3 alt="First Response">Event Handlers for Intention's First Response</h3>
      <p>There are cases when you need to listen for Intention's first response on page load—maybe to insert specific content or run certain functions. There are obviously a number of ways to do this, but here are two simple methods.</p>
      <section>
         <h4>One-time Page Load Responses</h4>
         <p>On certain occasions you may only care about the first context passed when the page first loads. After that first load, you may not want the event handler to keep firing. In this scenario, we can use jQuery's <a href="http://api.jquery.com/category/deferred-object/">Deferred Objects</a>.</p>
         
{% highlight javascript %}
var init = function(contexts, callback){
   var dfds = [],
   _.each(contexts, function(ctx){
      var dfd = $.Deferred();
      
      dfds.push(dfd);
      
      if(intent.is(ctx)) {
         dfd.resolve();
      } else {
         intent.on(ctx, dfd.resolve);
      }
   });
   $.when.apply(this, dfds).done(callback);
};

init(['mobile'], function() {
console.log('mobile ctx is first passed');
});
init(['standard', 'tablet'], function() {
console.log('both standard and tablet have been passed');
});
{% endhighlight %}

         <p>The above function <code>init()</code> accepts two parameters: an array of context names to be passed and a callback function that is triggered when the array is satisfied. With supplied each context, <code>init()</code> creates a deferred object and adds it to a master array.</p>
         <p>If the user is <i>already</i> in that context when the function is called, the deferred object will be <a href="http://api.jquery.com/deferred.resolve/">resolved</a>. If the user is not already in that specific context, <code>init</code> will create an event handler to wait for the context to pass true, when it will resolve the deferred object. When all of the deferred objects in the master array have been resolved, the callback function will fire once and only once.</p>
      </section>
      <section>
         <h4>Repeating Event Handlers</h4>
         <p>If you do not care about the first response on page load <i>exclusively</i> but want to create an event handler that still affects the first response, the easiest way is to edit context.js. We want to have all event handlers be written before the affected axes respond. Otherwise, the first manipulations will have already occurred before the event handler is even created.</p>
{%highlight js%}
var intent = new Intention();

// Event handlers can be created
// before the axis is even written
intent.on('standard', function() {
//   ... 
});

var horizontal_axis = intent.responsive({
   ID: 'width',
   contexts: [
      {name:'standard', min:840}, 
      {name:'tablet', min:768},
      {name:'mobile', min:0}
   ],
   matcher: function(measure, context) {
      return measure >= context.min;
   },
   measure: function() {
      return $(window).width();
   }
});

// Just as long as they are made
// before the axis responds
// and after the intent object

intent.on('width:', function() {
//   ...
});

horizontal_axis.respond();

$(window)
.on('resize', horizontal_axis.respond);

window.intent = intent;

$(function() {
   intent.elements(document);
});
{%endhighlight%}
      </section>
   </article>
</article>