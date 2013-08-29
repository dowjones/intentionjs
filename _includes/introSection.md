<section id="splash" class="standard" intent in-width: in-container: in-orientation:>
   <div class="inner clearFix">
      <section>
         <h2>Intention.js offers a light-weight and clear way to dynamically restructure HTML in a responsive manner.</h2>
         <h3>Easily increase layout options and flexibility, reduce development time and lessen dependence on media-query-driven stylesheet overrides.</h3>
      </section>
      <section id="buttons" class="clearFix">
            <a id="bundle" href="intention-context.js.zip">Download the latest bundle<h5>intention.js + context.js</h5></a>
            <a id="mini" href="intention.js">Build your own contexts<h5>intention.js v0.9.7.2</h5></a>
      </section>
   </div>
</section>

<!-- Start the ugly Code-as-Image section -->

<section id="codeImage" class="standard" intent in-width: in-container:>
   <div class="inner clearFix">
      <div id="connections"></div>
      <pre id="rawCodeImage"><span class="selectable">&lt;body&gt;
   &lt;header&gt;
      &lt;img</span> <span class="white"><span class="selectable">intent</span></span>
         <span class="orangeDark"><span class="selectable">in-standard-src="med.png"</span></span>
         <span class="orangeLight"><span class="selectable">in-mobile-src="small.png" /&gt;</span></span>
   <span class="selectable">&lt;/header&gt;
   &lt;nav</span> <span class="white"><span class="selectable">intent</span></span>
      <span class="greenDark"><span class="selectable">in-abovethefold-after="header"</span></span>
      <span class="greenLight"><span class="selectable">in-belowthefold-prepend="body"
      in-belowthefold-class="sticky"&gt;</span></span>
   <span class="selectable">&lt;/nav&gt;
   &lt;section</span> <span class="white"><span class="selectable">intent</span></span>
      <span class="blueLight"><span class="selectable">in-daytime-class="light"</span></span>
      <span class="blueDark"><span class="selectable">in-nighttime-class="dark"&gt;</span></span>
         <span class="selectable">Hello, World!
   &lt;/section&gt;

   &lt;script&gt;</span>
      <span class="white"><span class="selectable">intent.on(</span><span class="blueDark ignore"><span class="selectable">'nighttime'</span></span><span class="selectable">, function() {</span></span>
         <span class="blueDark"><span class="selectable">$('section').text("Goodnight, World!");</span></span>
      <span class="white"><span class="selectable">});</span></span>
   <span class="selectable">&lt;/script&gt;
&lt;/body&gt;</span>

      <!--[if lt IE 9]>
          <![endif]--></pre>

    <pre id="standardCodeImage"><div id="standardRed"><h5>Outputs on desktops:</h5>
<span class="selectable">&lt;body&gt;</span>
   <span class="orangeDark"><span class="selectable">&lt;header&gt;
      &lt;img src="med.png" /&gt;
   &lt;/header&gt;</span></span></div><div id="standardGreen"><span class="greenDark"><span class="selectable">   &lt;nav&gt;
   &lt;/nav&gt;</span></span></div><div id="standardBlue"><span class="blueDark"><span class="selectable">   &lt;section class="dark"&gt;
      Goodnight, World!
   &lt;/section&gt;</span></span>
<span class="selectable">&lt;/body&gt;</span></div></pre>

    <pre id="mobileCodeImage"><div id="mobileGreen"><h5>Outputs on mobile:</h5>
<span class="selectable">&lt;body&gt;</span>
   <span class="greenLight"><span class="selectable">&lt;nav class="sticky"&gt;
   &lt;/nav&gt;</span></span></div><div id="mobileRed"><span class="orangeLight"><span class="selectable">   &lt;header&gt;
      &lt;img src="small.png" /&gt;
   &lt;/header&gt;</span></span></div><div id="mobileBlue"> <span class="blueLight"><span class="selectable">   &lt;section class="light"&gt;
      Hello, World!
   &lt;/section&gt;</span></span>
<span class="selectable">&lt;/body&gt;

</span></div></pre>
</div></section>

<!-- End ugly Code-as-Image section -->
<!-- But start the slightly less ugly mobile version of that -->
<section id="smallCode" class="clearFix standard" intent in-width: in-container: data-pattern="2">
  <pre id="output" class="standard" intent
       in-width:
       in-container:
       in-mobile-after="#input"
       in-smalltablet-after="#input"
       in-tablet-after="#input"
       in-pseudomobile-after="#input"
       in-pseudosmalltablet-after="#input"
       in-pseudotablet-after="#input">

  </pre>
  <pre id="input"><h5>This input</h5>
&lt;style&gt;
   <span class="orangeDark mobile">#smallCode.mobile #output{</span>
      color:orange
   <span class="orangeDark">}</span>
   <span class="blueLight smalltablet">#smallCode.smalltablet #output{</span>
      color:blue
   <span class="blueLight">}</span>
   <span class="greenDark tablet">#smallCode.tablet #output{</span>
      color:green
   <span class="greenDark">}</span>
&lt;/style&gt;

&lt;section id="smallCode"
   <span class="white">intent in-width:</span>&gt;
   &lt;pre id="output"
      <span class="white">intent in-width:</span>
      <span class="orangeDark mobile">in-mobile-after="#input"</span>
      <span class="blueLight smalltablet">in-smalltablet-after="#input"</span>
      <span class="greenDark tablet">in-tablet-after="#input"&gt;</span>
         <span class="comment">//output</span>
   &lt;/pre&gt;
   &lt;pre id="input"&gt;
      <span class="comment">//input</span>
   &lt;/pre&gt;
&lt;/section&gt;
  </pre>
</section>
<!-- End that too. Back to decently formatted code -->


<section id="heading" class="try clearFix standard" intent
   	 in-pseudomobile-prepend="body"
   	 in-pseudosmalltablet-prepend="body"
   	 in-pseudotablet-prepend="body"
   	 in-pseudohdtv-prepend="body"
   	 in-pseudostandard-after="#codeImage"
   	 in-container:
   	 in-width:> <!-- Hide this functionality on *real* mobile devices but not on faked ones-->
  <div class="inner">
    <h2>Try it!</h2>
    <div id="devices">
      <div id="pseudomobile" intent in-pseudomobile-class="toggleOrientation" in-base-class="null"></div>
      <div id="pseudosmalltablet" intent in-pseudosmalltablet-class="toggleOrientation"  in-base-class="null"></div>
      <div id="pseudotablet" intent in-pseudotablet-class="toggleOrientation"  in-base-class="null"></div>
      <div id="pseudohdtv"></div>
      <div class="cancel"></div>
    </div>
  </div>
</section>
