<article class="equalize" data-pattern="2">
   <h2 alt="Custom Axes">Custom Axes &amp; Contexts</h2>
   <p>One of intention.js's most exciting features is its scalability: you can use it to respond to almost anything! Any type of data that is quantifiable can be used to manipulate the page. Of course context.js comes with the most common patterns of responsive design, but let's take a look at how to create our own.</p>
   <h3>Markup</h3>
   <section>
      <p>Each axis is made up of four basic properties: the axis ID (optional), the measure function, the context group, and the matcher function. As we know, an axis is a measurable object or set of information. This axis is optionally given an ID so it can be used in specific manipulations. A measure function finds the current measurement of that axis, and the matcher function finds where that measurement lies in a set of thresholds and breakpoints called contexts. Contexts are defined in an ordered array and help dictate how the DOM should be manipulated.</p>
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
      <h3>Let's actually make a custom axis</h3>
      <section>
         <p>For demonstration, we will construct an axis that measures how often a visitor has been to our site.</p>
         <p>To do that, we'll need to do a little set up. We need to keep track of those visits somehow, so we'll keep a counter in the visitor's localstorage as a property <code>visits</code>. If that property doesn't yet exist in localstorage, we'll assume this is their first visit. In that case, we'll set the counter to 1. On every subsequent visit, this value will be incremented by 1.</p>
      </section>
      <section>
{%highlight js%}
if(!window.localStorage.getItem('visits')){
   window.localStorage.setItem('visits', 1);
}

var visits = parseInt(window.localStorage.getItem('visits'), 10) + 1;
window.localStorage.setItem('visits', visits);
{%endhighlight%}
      </section>
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
      <section>
         <p>To make an axis measuring how many times a visitor has been to our page, we have to make some correlations between number of visits (the measurement) and the visitor's assumed character (the context).</p>
         <p>In this example, we'll say that a minimum of 25 visits would qualify a visitor as a "frequenter", while less than 10 visits would qualify a "new" visitor. We order our contexts in descending value order, and construct them with minimum values.</p>
      </section>
      <section>
{%highlight js%}
var visit_axis = intent.responsive({
// ...
   contexts: [
      {name:'frequenter', min:25},
      {name:'casual', min:10},
      {name:'new', min:0}
   ],
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
      <section>
         <p>For our page view tracker, we obviously want to measure how many times the visitor has been to our page. For this axis <code>visit_axis</code> measure function, we want to grab the current value of the counter we saved in their local storage. We want to eventually compare this number against other numerical breakpoints, so its type needs to be an actual number. We need to parse it into an integer.</p>
      </section>
      <section>
{%highlight js%}
var visit_axis = intent.responsive({
// ...
measure: function() {
   var count = window.localStorage.getItem('visits');
   return parseInt(count);
}
});
{%endhighlight%}
      </section>
   </article>
   
   <article class="equalize" data-pattern="2">
      <h3>Matcher Function</h3>
      <section>
         <p>The matcher function is called with the measure function's result and the context array as parameters. It tests the measurement against each context's value property. When a measurement fits in a context's data range, the context passes true. This is done with a comparative statement. For example, if a measurement does not exceed the maximum value of a context, then the context will pass true. If it does, then the matcher function will see if exceeds the next context's maximum value.</p>
         <p>The comparative statement must agree with the order of the contexts. If context values are listed in descending order, the matcher function must test if the measurement is <i>greater than or equal to the context minimum value</i>. If it is, then we know it definitely is greater than all of the other contexts' minimum values.</p>
         <p>Conversely, if context values are listed in increasing order, the matcher function must test if the measure is <i>less than or equal to the context maximum value</i>. If it is, it doesn't exceed that context's maximum, so it definitely doesn't exceed the other context's maxima. Therefore, it falls within the initial context's data range.</p>
      </section>
      <section>
{%highlight js%}
var axis = intent.responsive({
// ...
matcher: function(measure, context){

   // for contexts arranged in
   // greatest-to-least order
   return measure >= context.min;
   
   // for contexts arrange in
   // least-to-greatest order
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
      <section>
         <p>In our example, we ordered the contexts from greatest-to-least with minimum values as our breakpoints. Therefore, we want to test if the measure is greater than the minimum value necessary for to pass the context. If it's not, the function moves on to the next context.</p>
      </section>
      <section>
{%highlight js%}
var visit_axis = intent.responsive({
// ...
matcher: function(measure, ctx.min){
   return measure >= ctx.min;
},
// ...
});
{%endhighlight%}
      </section>
   </article>
   
   <article class="equalize" data-pattern="2">
      <h3>Putting it all together</h3>
      <h4>Axis IDs</h4>
      <section>
         <p>Now we can make measurements and figure out where they fall on an axis of contexts, we need something to make this data useful. The axis ID helps us do this. Although this property is optional, it is used in HTML attributes to command DOM manipulations. An axis ID lets you create manipulations for any change in contexts in a specified axis, or for any specific context within a specific axis.</p>
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
      <h4>Responding</h4>
      <section>
         <p>Every <code>intent.responsive</code> axis returns some useful properties, of which <code>respond</code> is probably the most important. This property contains a function that sets off the <code>measure</code> and <code>matcher</code> functions. Calling <code>axisID.respond()</code> updates the current context within an axis <code>axisID</code>.</p>
      </section>
      <section>
{%highlight js%}
var axis = intent.responsive({
// ...
});

axisID.respond(); // respond once

$(window).on('event', axisID.respond);
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
      
      <h4>Our finished visit tracker axis</h4>
      <section>
{%highlight js%}
if(!window.localStorage.getItem('visits')){
   window.localStorage.setItem('visits', 1);
}
var visits = parseInt(window.localStorage.getItem('visits'), 10) + 1;
window.localStorage.setItem('visits', visits);

var visit_axis = intent.responsive({
   ID: 'visits'
   contexts: [
      {name:'frequenter', min:25},
      {name:'casual', min:10},
      {name:'new', min:0}
   ],
   matcher: function(measure, ctx.min){
      return measure >= ctx.min;
   },   
   measure: function() {
      var count = window.localStorage.getItem('visits');
      return parseInt(count);
   }
}).respond();
// ↑ only need to run at page load because
// a visit will not increment during
// a session.
{%endhighlight%}
      </section>
   </article>
      
      // construct an axis with an ID
      // talk about why an ID is useful (actually manipulating the DOM)
      
      // response property
      // response scope parameter
      
   </article>
</article>