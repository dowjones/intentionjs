$(function() {
	$('#resizable').resizable();
	var mini_example = intent.responsive({ //set up a new context based on the container div#all
		ID: 'mini_example',
		contexts: [
			{name:"large",min:300},
			{name:"small",min:75},
			{name:"tiny",min:0}
		],
		matcher: function(test, context) {
			return test >= context.min;
		},
		measure:function(arg) {
			return $("#resizable").width();
		}
	});
	$(document).on('ready', mini_example.respond);
	$('#resizable').on('resize', mini_example.respond);
});
