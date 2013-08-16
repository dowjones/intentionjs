$(function(){
   // at doc ready grab all of the elements in the doc
   intent.elements(document);
   
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
      console.log('loaded into standard or hdtv');
      imageSetup();
      equalizeAll('#docs', 'article.equalize', 'section');
      contentPos = $('#content').offset().top;
   });
   if(intent.is('standard') || intent.is('hdtv')) { stdInit.resolve(); }
   else {
      intent
         .on('standard', function() { stdInit.resolve(); })
         .on('hdtv', function() { stdInit.resolve(); });
   }
   
   //Reset the point at which the green nav bar becomes fixed
   intent.axes.stickdepth.contexts[0]['min'] = contentPos;
   manageTitlePos();
 });