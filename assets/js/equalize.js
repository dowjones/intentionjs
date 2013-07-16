//This script organizes elements into rows where each <section> element on the row is of equal height.
//It accepts two parameters:	(1) the parent container
//								(2) the number of element per row (the width of each element must fit to the parent container's width)
//For example, if the <div id="container"> holds 9 <section> elements, running `equalize('#container', 3)`
//	will examine all of nine elements, three at a time, to find the tallest height among them. Then, it will
//	apply that height to the group of three. If the elements' widths allow them to fit inline in a container,
//	they will form an equal height row. 
//
//This code is predictably useful for organizing floating <section>s into a grid
//
//Currently the code only "equalizes" <section> elements, but it can be changed easily by adjusting line 15

var equalize = function(parent, child, pattern){ 
	console.log("equalizing");
	var children = $(parent + ' > ' + child);
		totalChildren = children.length; //how many sections within an article
	for (var i=1; i <= totalChildren; i++) { //first clear all heights
		var current = $(parent + '>' + child + ':nth-child(' + i + ')');
		current.css('height', '');
	}
	for (var i=1; i < totalChildren; i+=pattern) {  //go through each section in this iteration of the pattern
		var end = i+pattern,
			heights = [];
		for (var p = i; p<end; p++) { //p is the nth-child in this iteration of the pattern	
			var current = $(parent + '>' + child + ':nth-child(' + p + ')'),
				height	= current.outerHeight();
			heights.push(height);
		}
		heights.sort(function(a, b) { return b - a }); 
		var maxHeight = heights[0];
		for (var p = i; p<end; p++) { //enter the loop again to set the height
			var current = $(parent + '>' + child + ':nth-child(' + p + ')');
			current.css('height', maxHeight);
		}
	}
	return maxHeight;
};

var equalizeAll = function(grandparent, child){ //grandparent contains all the parents to the children (i.e. multiple sections of equalized content)
	$(grandparent).each(function() { 
		var id = '#'+$(this).attr('id'),
			pattern = parseInt($(this).attr('data-pattern'));
		equalize(id, child, pattern);
	});
};

var unequalize = function(parent, child){
	console.log("remove heihgts");
	$(parent).children(child).css('height', '');
};