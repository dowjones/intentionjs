(function(){

  define(['intention'], function(intention) {

		var tn = new intention,
			resizeContexts = [{name:'standard', min:769}, 
		        {name:'tablet', min:321},
		        {name:'mobile', min:0}],

		    hResponder = tn.responsive(resizeContexts,
		        // compare the return value of the callback to each context
		        // return true for a match
		        function(test, context){
		          if(test>=context.min){
		            return true;
		          }
		        },
		        // callback, return value is passed to matcher()
		        // to compare against current context
		        function(e){
		          return $(window).width();
		    	}),
		    baseResponder = tn.responsive([{name:'base'}])('base');

		hResponder();
		$(window).on('resize', hResponder);
	});

})();