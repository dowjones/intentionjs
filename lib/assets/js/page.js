(function(){

	var pageWrapper = function(Intention, Context) {
		new Intention({context:new Context});
	};

	if ( typeof define === "function" && define.amd ) {

	      define('Page', ['Intention', 'Context'], pageWrapper);

	    } else {
	    	var dependencies = {Intention:Intention, Context:Context};

	    	for(var dep in dependencies){
	    		if(dependencies.hasOwnProperty(dep)){
	    			if(!dependencies[dep]){
	    				throw(dep + ' is not defined');

	    				return;
	    			}	
	    		}
	    	}
			pageWrapper(Intention, Context); 
		}
})()