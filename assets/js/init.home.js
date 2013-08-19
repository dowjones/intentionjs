$(function(){
   // at doc ready grab all of the elements in the doc
   intent.elements(document);
   
   var manageScrollDepth = function() {
      for(var i = 0; i <= intent.axes.titleDepth.contexts.length-2; i++){
      	var depth = $('#'+intent.axes.titleDepth.contexts[i]['name']).offset().top - 50;
         intent.axes.titleDepth.contexts[i]['val'] = depth;
      }
      contentPos = $('#content').offset().top;
      intent.axes.stickdepth.contexts[0]['min'] = contentPos;
      stickdepth.respond();
   };
   
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
   });
   if(intent.is('standard') || intent.is('hdtv')) { stdInit.resolve(); }
   else {
      intent
         .on('standard', function() { stdInit.resolve(); })
         .on('hdtv', function() { stdInit.resolve(); });
   }
   
   //Reset the point at which the green nav bar becomes fixed
   manageScrollDepth();
 });