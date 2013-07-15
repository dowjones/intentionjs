var buildBlogNav = function() {
	var posts = [];
	$.each($('#content article'), function() { 
		var list = $(this).children('.tags').children('li'),
			tags = [],
			pos = $(this).offset().top;
		$.each(list, function() {
			tags.push($(this).text());
		});
		posts.push(tags);
	});
	console.log(posts);
};

// major wokr eneded