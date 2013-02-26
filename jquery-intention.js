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