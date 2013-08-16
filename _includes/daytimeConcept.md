<article id="concept" class="special clearFix">
  <div class="inner clearFix" data-pattern="2">
    <section intent in-pseudostandard-before="#customPitch" in-pseudohdtv-before="#customPitch"
	     in-pseudotablet-after="#customPitch" in-pseudosmalltablet-after="#customPitch" in-pseudomobile-after="#customPitch"
	     in-standard-before="#customPitch" in-hdtv-before="#customPitch"
	     in-tablet-after="#customPitch" in-smalltablet-after="#customPitch" in-mobile-after="#customPitch">
      <div id="timeExample" intent in-time:> </div>

      {%highlight html%}
<div id="timeExample" intent in-time:></div>
      {%endhighlight%}
      {%highlight js%}
var time = intent.responsive({
   ID: 'time',
   contexts: [
      {name:'night',min:20},
      {name:'evening',min:17},
      {name:'sunset',min:16},
      {name:'day',min:9},
      {name:'morning',min:0}
   ],
   matcher: function(test, context) {
      return test >= context.min;
   },
   measure: function(arg) {
      var time = new Date();
      return time.getHours();
   }
});
time.respond(); //check the current context
   {%endhighlight%}
   <pre>time.respond('<select id="timeChange"><option></option><option value="night">night</option><option value="evening">evening</option><option value="sunset">sunset</option><option value="day">day</option><option value="morning">morning</option></select>');</pre>
    </section>
    <section id="customPitch">
      <h3>Intention.js responds to a bunch of device contexts, but it’s open to any index. You can create custom contexts based on anything you can measure, and restructure your code in response!</h3>
      <p>It’s not just changing a page based on the browser’s width: it’s noticing touch-capabilities, portrait/landscape orientation, high resolution contexts. Intention.js can be taught to restructure pages based on scroll depth, pageviews, time of day—basically anything!</p>
    </section>
  </div>
</article>
