<article class="equalize" data-pattern="2">
   <h2 alt="Custom Axes">Custom Axes &amp; Contexts</h2>
   <p>One of intention.js's most exciting features is its scalability: you can use it to respond to almost anything! Any type of data that is quantifiable can be used to manipulate the page. Of course context.js comes with the most common patterns of responsive design, but let's take a look at how to create our own.</p>
   <h3>Markup</h3>
   <section>
      <p>Each axis is made up of four basic properties: the axis ID (optional), the context group, the matcher function, and the measure function,. As we know, an axis is a measurable object or set of information. This axis is optionally given an ID so it can be used in specific manipulations. A measure function finds the current measurement of that axis, and the matcher function finds where that measurement lies in a set of thresholds and breakpoints called contexts. Contexts are defined in an ordered array and help dictate when the DOM should be manipulated.</p>
   </section>
   <section>
{%highlight js%}
var axis = intent.responsive({
   ID: 'axisID',
   contexts: [
      {name:'ctx1', val:'3'},
      {name:'ctx2', val:'2'},
      {name:'ctx3', val:'1'}
   ],
   matcher: function(measure, context){
      return measure >= context.val;
   },
   measure: function(){
      return someMeasurement;
   }
});
{%endhighlight%}
   </section>
   <h3>First things first</h3>
   <section>
      <p>If you are completely abandoning context.js, you must be sure to first create an Intention object. This is required for any axis creation or response. Context.js does this right out of the box, so if you are only extending the included axes, you need not create a new Intention object. Be sure to check out the next section <a href="#t6"><b>Initialization</b></a> to see what else context.js takes care of—things you'll have to do when starting from scratch.</p>
   </section>
   <section>
{%highlight js%}
var intent = new Intention();

// axis creation

// be sure the Intention object
// is saved to a global variable
// if you want to use it
// across plugins
window.intent = intent;
{%endhighlight%}
   </section>

   <hr/>
   
   <article class="equalize" data-pattern="2">
      <h3>Contexts</h3>
      <section>
         <p>To work with whatever data we measure, we need to set up contexts that will act as thresholds. The <code>contexts</code> property is an ordered array of objects. Each context object represents a range of data. If a measurement falls in that range of data, the corresponding context passes true. Then that context is set as the current context.</p>
         <p>When a measurement is being matched against the contexts, the function will iterate through the array in order, so the breakpoints must be listed in an increasing or decreasing order. If a context passes true, the array is immediately exited.</p>
         <p>Each context object <b>must</b> have a <code>name</code> property. This is used to identify exactly <i>what</i> context is true. Be sure the context's name is a string!</p>
      </section>
      <section>
{%highlight js%}
var axis = intent.responsive({
// ...
    contexts: [
       {name:'ctx3', val:'20'},
       {name:'ctx2', val:'10'},
       {name:'ctx1', val:'0'}
    ],
//
// Here we use a descending value order
// and our matcher function will be
// written accordingly
// 
// ...
});
{%endhighlight%}
      </section>
   </article>
   
   <article class="equalize" data-pattern="2">
      <h3>Measure Function</h3>
      <section>
         <p>The measure function's task is simply to find data that will later be matched against the contexts. It can be a series of complex operations, but as long as it returns a value, it's doing its job. In most cases, this function is just a return that passes off a value to the matcher function.</p>
      </section>
      <section>
{%highlight js%}
var axis = intent.responsive({
// ...
measure: function(){
   return someMeasurement
}
});
{%endhighlight%}
      </section>
   </article>
   
   <article class="equalize" data-pattern="2">
      <h3>Matcher Function</h3>
      <section>
         <p>The matcher function uses the measure function's returned value and the context array as parameters. It tests the measurement against each context's value property. When a measurement fits in a context's data range, the context passes true. This is done with a comparative statement. For example, if a measurement does not exceed the maximum value of a context, then the context will pass true. If it does, then the matcher function will see if exceeds the next context's maximum value (which will be a higher value).</p>
         <p>The comparative statement must agree with the order of the contexts. If context values are listed in descending order, the matcher function must test if the measurement is <i>greater than or equal to the context minimum value</i>. If it is, then we know it definitely is greater than all of the other contexts' minimum values.</p>
      </section>
      <section>
{%highlight js%}
var axis = intent.responsive({
// ...
matcher: function(measure, context){

   // for contexts arranged in
   // greatest-to-least order
   // (exits array when the measure
   //  is greater than the minimum)
   return measure >= context.min;
   
   // for contexts arrange in
   // least-to-greatest order
   // (exits array when the measure
   //  is less than the maximum)
   return measure <= context.max;
   
   // the default matcher function
   // looks for an exact match
   return measure === context.val;
   
   // be sure to compare the measurement
   // to the context's value, not just
   // the context object
   
},
// ...
});
{%endhighlight%}
      </section>
   </article>
   
   <article class="equalize" data-pattern="2">
      <h3>Axis IDs</h3>
      <section>
         <p>An axis ID property allows for context-aware restructuring. Although this property is optional, it is used in HTML attributes to command DOM manipulations. An axis ID lets you create manipulations for any change in contexts in a specified axis, or for any specific context within a specific axis.</p>
         <p>Without an assigned ID, the axis is randomly given a hash as an ID that changes on every page load—not very helpful for making specific changes to the layout.</p>
      </section>
      <section>
{%highlight js%}
var axis = intent.responsive({
   ID:'axisID', 
   contexts: [
      {name:'ctx3', val:'20'},
      {name:'ctx2', val:'10'},
      {name:'ctx1', val:'0'}
   ],
   matcher: function(measure, ctx.min){
      return measure >= ctx.min;
   },
   measure: function(){
      return someMeasurement;
   }
});
{%endhighlight%}
{%highlight html%}
<div intent in-axisID:></div>
<img intent in-axisID:ctx3-src="..." />
{%endhighlight%}
      </section>
   </article>
   
   <article class="equalize" data-pattern="2">
      <h3>Putting it all together</h3>
      <h4>Responding</h4>
      <section>
         <p>Every <code>intent.responsive</code> axis returns some useful properties, of which <code>respond</code> is probably the most important. This property contains a function that sets off the <code>measure</code> and <code>matcher</code> functions. Calling <code>axis.respond()</code> updates the current context within an axis.</p>
         <p><i>Note that the <code>intent.responsive({...})</code>'s variable name is used to for responding, <u>not</u> the axis ID. Keep variable scope in mind! You can always use <code>intent.axes.axisID.respond()</code> if you are out of the axis variable's scope.</i></p>
      </section>
      <section>
{%highlight js%}
var axis = intent.responsive({
// ...
});

axis.respond(); // respond once

$(window).on('event', axis.respond);
// respond on each instance of 'event'
{%endhighlight%}
      </section>
      <section>
         <p>If your axis needs only respond once, you can make it do so right after you create the axis with a trailing respond command. The touch axis is such an axis: Intention needs only test touch capabilities at page load because they are unlikely to change mid-session.</p>
      </section>
      <section>
{%highlight js%}
var axis = intent.responsive({
// ...
}).respond();

// note that you cannot have the
// axis respond again after this
// axisID.respond(); won't work
{%endhighlight%}
      </section>
      
      <h4>Finding the Current Context</h4>
      <section>
         <p>Another useful property <code>intent.responsive</code> returns is <code>current</code>. Calling this property will return the name of the most recent context passed as a string.</p>
      </section>
      <section>
{%highlight js%}
// assuming your Intention() object
// is saved as "intent"

intent.axes.axisID.current
{%endhighlight%}
      </section>
      
   </article>
      
   </article>
</article>