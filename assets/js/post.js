$(function() {
	$.each($('article img'), function() {
		var src = $(this).attr('src');
		$(this).wrap('<a href="'+src+'" target="_blank" />');
	});
});