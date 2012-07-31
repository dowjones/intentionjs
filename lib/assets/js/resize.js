define('resize', ['jquery', 'jqueryUI','Modal'], function ($) {
	
	$('#box').resizable({handles: "se"});
	
	$('#box').intention();

})