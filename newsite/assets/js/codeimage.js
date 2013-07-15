var drawCodeImage = function(coordinates) {
	var paper = new Raphael(document.getElementById('connections'), 900, 420);
	$.each(coordinates, function(index, data) { //index: each span classname; data: all points in that classname
		var total = data.length-1;
		$.each(data, function(index, points) { //points: the x & y coordinates within a single classname
			console.log(index, '(', points.x, ', ', points.y, ') #', points.color);
			var c = paper
					.circle(points.x, points.y, 3.5)
					.attr({'stroke': points.color, 'stroke-width':2	});
		});
		$.each(data, function() { 
			var start	= $(this)[0], //start point
				end		= data[total], //end point
				hx		= (end.x - start.x)/2 + start.x; //handle
			var path = paper
				.path('M'+start.x+' '+start.y+' C' +hx+' '+start.y+' '+hx+' '+end.y+' '+end.x+' '+end.y)
				.attr({
					'stroke':start.color,
					'stroke-width':2
				});
		});
	});
};

var writeOutput = function(device){				
	var output = '<h5>Outputs on your device</h5>\n&lt;section id="smallCode" class="'+device+'"&gt;\n   &lt;pre id="input"&gt;\n      //input\n   &lt;/pre&gt;\n   &lt;pre id="output" class="'+device+'"&gt;\n      //output\n   &lt;/pre&gt;\n&lt;/section&gt;';
	$('#output').empty().html(output);
}