var buildBlog = function() {
	var posts = [],
		titlePos = [],
		i = 1;
	$.each($('#content article'), function() { 
		var list = $(this).children('.tags').children('li'),
			tags = [],
			pos = $(this).position().top + 10;
		if(i != 1) { pos += (20); } //position() doesn't account for padding
		var markup = '<li id="a'+i+'" style="top:'+pos+'px"><div class="label"></div><div class="circle"></div></li>';
		$('#content nav ul').append(markup);
		$.each(list, function() {
			var tag = $(this).text(),
				linkMarkup = ' <a href="#">'+tag+'</a>';
			tags.push(tag);
			$('#a'+i+' .label').append(linkMarkup);
		});
		posts.push(tags);
		i++;
	});
};