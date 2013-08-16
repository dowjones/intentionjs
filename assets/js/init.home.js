$(function(){

   var contentPos,
   curPos = 0;
   
   //Initialization functions
   function in_init(contexts, callback){
      var dfds = [];
      _.each(contexts, function(ctx){
         var dfd = $.Deferred();
         dfds.push(dfd);
         if(intent.is(ctx)) { dfd.resolve(); }
      });
      if((!contexts) || (contexts.length === 0)){ in_init(); }
      $.when.apply(this, dfds).done(callback);
   };
   in_init(['tablet'], function(){
      equalizeAll('#smallCode', 'pre');
      writeOutput(intent.axes.width.current);
      contentPos = $('#content').offset().top;
   });
   in_init(['smalltablet'], function(){
      writeOutput(intent.axes.width.current);
      contentPos = $('#content').offset().top;
   });
   in_init(['mobile'], function() {
      writeOutput(intent.axes.width.current);
      contentPos = $('#content').offset().top;
   });
    
   var stdInit = $.Deferred();
   stdInit.done(function() {
      imageSetup();
      equalizeAll('#docs', 'article.equalize', 'section');
      contentPos = $('#content').offset().top;
      console.log('loaded into std, whats contentPos', contentPos);
   });
   if(intent.is('standard') || intent.is('hdtv')) { stdInit.resolve(); }
   else {
      intent
         .on('standard', function() { stdInit.resolve(); })
         .on('hdtv', function() { stdInit.resolve(); });
   }
   
   
   
   //sort this
   
   function throttle(callback, interval){
      var lastExec = new Date(),
        timer = null;
   
      return function(e){
        var d = new Date();
        if (d-lastExec < interval) {
          if (timer) {
            window.clearTimeout(timer);
          }
          var callbackWrapper = function(event){
            return function(){
              callback(event);
            };
          };
          timer = window.setTimeout(callbackWrapper(e), interval);
          return false;
        }
        callback(e);
        lastExec = d;
      };
   };
   
   var stickdepth = intent.responsive({
      ID: 'stickdepth',
      contexts: [
         {name:'sticknav', min:contentPos},
       	{name:'movebrand', min:$('header').height()},
       	{name:'start', min:0}
      ],
      matcher: function(test, context){
      	return test >= context.min;
      },
      measure: function(arg){
       	if(typeof window.pageYOffset == 'undefined') { var scroll = D.scrollTop; }
       	else { var scroll = window.pageYOffset; }
       	return scroll;
      }
   }),
   // Docs Nav
   titleCtx = [{'name':'t0', 'val':0}],
   articles = $('#docs').children('article').not('.special'),
   articlect = articles.length,
   i = 1;
   
   $.each(articles, function() { //then create the nav
      $(this).attr('id', 't'+i); //#targeti
      if($(this).children('h2').attr('alt')) { var text = $(this).children('h2').attr('alt'); }
      else{ var text = $(this).children('h2').text(); }
   
      var markup = '<li id="a'+i+'"><a ref="#t'+i+'" >'+text+'</a></li>', //#anchori
      pos = $(this).offset().top - 50, //minus 20 for padding
      ctx = {name:'t'+i, val:pos},
      sub = $(this).children('article'),
      jumpMarkup = $('<div class="jump"><a>&uarr; Back to top</a></div>');
   
      titleCtx.push(ctx);
   
      $('ul#sections').append(markup);
      
      //this might cause a scorlldepth problem; we're appending elements after we've gotten the scrolldepth values :S
      if(sub.length<1){ $(this).append(jumpMarkup).addClass('clearFix'); }
      else { sub.append(jumpMarkup).addClass('clearFix'); } 
   
      i++;
   });
   
   titleCtx.reverse();
   
   var titleDepth = intent.responsive({
      ID: 'titleDepth',
      contexts: titleCtx,
      matcher: function(test, context){
         if($.type(test) == 'string'){ return test == context.name; }
         if(test >= context.val) {
            curPos = context.name.slice(1);
            return true;
         }
         return false;
      },
      measure: function(arg){
         if($.type(arg) == 'string'){ return arg; }
         if(typeof pageYOffset == 'undefined') { var scroll = D.scrollTop; }
         else { var scroll = pageYOffset; }
         if((scroll+$(window).height()) == $(document).height()) {
            return intent.axes.titleDepth.contexts[0]['name'];
         }
         return scroll;
      }
   });
   titleDepth.respond();
   
   $(window).on('scroll', function(){
      throttle(titleDepth.respond(), 50);
      throttle(stickdepth.respond(), 50);
   });
    
   $('.jump').add('#stickBrand').click(function() {
      $('html, body').animate({ scrollTop: $('#t1').offset().top - 49}, 1000);
   });
   
   $('#prevnext li').click(function() {
      console.log('clicked, old curPos', curPos);
      if( ($(this).attr('id') == 'next') && (curPos < articlect) ){ console.log('moving up'); curPos++; }
      else if(($(this).attr('id') == 'prev') && (curPos > 1)){ console.log('decrementing'); curPos--; }
      else { return false }
      console.log('new curPos:', curPos);
      var target = $('#t'+curPos).offset().top - 49; //minus 49 to make sure the nav won't cover it
      $('html, body').animate({ scrollTop: target}, 1000);
      return false;
   });
   
   $('ul#sections')
      .menuDeck()
      .children('li').children('a')
      .click(function() {
         var target = $($(this).attr('ref')).offset().top - 49;
         $('html, body').animate({ scrollTop: target}, 1000);
   });
   
   intent
      .on('titleDepth:', function() {
         curPos = intent.axes.titleDepth.current.slice(1);
         $('ul#sections')
            .children('.cover').removeClass('cover')
            .end() //in case no .cover is found
            .children('li:nth-of-type('+curPos+')').addClass('cover');
      })
      .on('sticknav', function(){
         //add padding so stickiness is applied without a jump
         //this is done here (as opposed to applying an intentional class to #docs
         //in case we decide the nav bar should be different sizes in different contexts
         $('#docs').css('padding-top', $('#topNav').outerHeight());
      })
      .on('movebrand', function() { //one context above the stickynav
         $('#docs').css('padding-top', ''); //remove that smoothening padding
      });
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
//   //Reset the point at which the green nav bar becomes fixed
//   intent.axes.stickdepth.contexts[0]['min'] = contentPos;
//   manageTitlePos();





   // at doc ready grab all of the elements in the doc
   intent.elements(document);
 });