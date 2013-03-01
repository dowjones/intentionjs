(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'intention'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.tn = new Intention;
}));



/* 

tin.tin(elm, ctxInfo)

$('#elm').tn({
	base:{
		class:'nothing special',
		append:'body',
		href:'http://mysite/img/medium.png'
	},
	mobile:{
		class:'narrow touch',
		prepend:'#main',
		href:'http://mysite/img/small.png'
	}
});

*/
	
	
	var methods = {
		respondTo:function(elm, spec){
			return this;
		}, 
		add: function(elm){
			tn.add(elm)
		}
	};

  // this is the plugin initialization
  $.tn = function(elm, options){
    
    $elm = $(elm);
    // set the scr content on the first child,
    // should be the only element inside the viewport 
  };

  // set the prototype of the scroller to the method obj
  $.tn.prototype = methods;

  $.fn.intention = function(param) {
    if ( methods[param] ) {
      this.each(function(){
        var plugin = $(this).data('tn');
        plugin[param].apply(plugin, arguments);
      });
    } else if ( typeof param === 'object' || ! param ) {
      return this.each(function(){
        var plugin = new $.tn(this, param);
        $(this).data('tn', plugin);
      });
    } else {
      $.error( param + ' is not a jQuery.intention method!' );
    }
  };
  
  
})()
