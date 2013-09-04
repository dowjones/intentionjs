<article class="equalize" data-pattern="2">
   <h2>Intialization</h2>
   <p>If you're not using context.js, there's a few things you need to do to get Intention working. Context.js does this for you, but you may find yourself using intention.js for something other than standard responses.
   <article>
      <h3>Finding Elements</h3>
      <section>
         <p>Once all the contexts have been written, Intention must search the DOM for elements that have been flagged "intentional". It will find each element and create a record of it and its manipulations in an array of objects <code>intent.elms</code>. Every specified manipulation will be saved in this array as instructions, so when an axis or context is passed the manipulation is more immediate.</p>
         
         <p>To perform this search, first construct all of your axes and threshold groups, then run this function at doc ready.</p>
         
         {%highlight js%}
$(function(){
  intent.elements(document);
});
         {%endhighlight%}
         <p>Should you need to inject intentional HTML after the page load, you can always add elements to this registry using <code>intent.add()</code>.</p>
      </section>
      <section>
         <p>For demonstration purposes, here's an example of an object saved in the element array.</p>
<pre>[...
<span class="comment">&darr; Object
   &rarr; elm: elementObject
   &darr; spec: manipulationsObject
      __move__:"#movementTarget" 
      __placement__:"moveMethod"
      &darr; axisName: Object
         &darr; contextName: Object
            class:"className"
            attribute:"value"</span>
            
&darr; Object
   &rarr; elm: section#output
   &darr; spec: Object
      __move__:"#input"
      __placement__:"after"
      &darr; width: Object
         standard: Object
            class:"standard"
         tablet: Object
            class:"tablet"
         mobile: Object
            class="mobile"
...]</pre>
      </section>
   </article>
   
   <article>
      <h3 alt="Extending Intention">Extending Intention For Other Plugins</h3>
      <section>
         <p>Context.js returns the Intentional object right out of the box, so you can use it across plugins and files; but if you are just using intention.js and your own custom axes, you might want to also extend the Intentional object yourself.</p>
         <p>Allowing the Intentional object to be used in plugins and other files is as simple as saving it to a global variable. At the end of your document, simply create a variable for the window scope that matches the variable name for the Intention object you created in the very beginning.</p>
{%highlight js%}
var intent = new Intention();

//...
//all your stuff
//...

window.intent = intent;
{%endhighlight%}
      </section>
      <section>
{%highlight js%}
(function(){
   var intent = new Intention(),
   
   axisName = intent.responsive({
      ID: 'axisID',
      contexts: [
         {name:'context1', min:1},
         {name:'context2', min:0}
      ],
      matcher: function(measure, context){
         return measure >= context.min;
      },
      measure: function() {
         return someMeasurement;
      }
   });
       
   $(window).on('event', axisName.respond);
   
   $(function() {
      intent.elements(document);
   });
   
   //save it to a global variable
   window.intent = intent;
});
{%endhighlight%}
      </section>
   </article>
</article>
