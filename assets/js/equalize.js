//This script organizes elements into rows where each <section> element on the row is of equal height.
//It accepts three parameters:	(1) the parent container, as an object
//								(2) the selector to be equalized, as an object
//								(3) the number of element per row (the width of each element must fit to the parent container's width)
//For example, if the <div id="container"> holds 9 <section> elements, running `equalize('#container', 'section', 3)`
//	will examine all of nine elements, three at a time, to find the tallest height among them. Then, it will
//	apply that height to the group of three. If the elements' widths allow them to fit inline in a container,
//	they will form an equal height row. 
//
//equalizeAll is used for repetitive equalization commands, for example equalizing all the sections within all the articles within a container
//	The added paramter for this function is the grandparent container. Re: the last example: equalizeAll('#container', article, section)

var equalize = function(parent, child, pattern){ 
	var totalChildren = child.length; //how many sections within an article
	var heights = []
	$.each(child, function(index, child) {
		$(child).css('height', '');
		var height = $(child).outerHeight();
		heights.push(height);
	});
	for (var i=0; i<totalChildren; i+=pattern) {
		var end = i+pattern,
			slice = heights.slice(i, end).sort(function(a, b) { return b - a }),
			max = slice[0];
		for (var p=i; p<end; p++) {
			$(child[p]).css('height', max);
		}
	}
};
var equalizeAll = function(grandparent, parent, child){ //grandparent contains all the parents to the children (i.e. multiple sections of equalized content)
	if(child==undefined||child=='') { //just in case equalizeAll is used when equalize really should be
		child = parent,
		parent = grandparent,
		grandparent = $(grandparent).parent();
	}
	$(grandparent).find(parent).each(function() { 
		var parent = $(this),
			children = $(this).children(child),
			pattern = parseInt($(this).attr('data-pattern'));
		equalize(parent, children, pattern);
	});

};
var unequalize = function(parent, child){
	$(parent).children(child).css('height', '');
};