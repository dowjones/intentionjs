$(function(){
			
			var container_width = intent.responsive({
				ID: 'container',
				contexts: [
					{name:"pseudohdtv",min:1800},
					{name:"pseudostandard",min:840},
					{name:"pseudotablet",min:780},
					{name:"pseudosmalltablet",min:510},
					{name:"pseudomobile",min:0}
				],
				matcher: function(test, context) {
					return test >= context.min;
				},
				measure:function(arg) {
					return $("#all").width();
				}
			});	
			var scrolldepth = intent.responsive({
				ID: 'scrolldepth',
				contexts: [
					{name:"belowfold", min:1057},
					{name:"abovefold", min:0}
				],
				matcher: function(test, context) {
					return test >= context.min;
				},
				measure:function(arg) {
					return window.pageYOffset;
				}
			});	
			$(window)
				.on('ready', container_width.respond)
				.on('ready', scrolldepth.respond)
				.on('resize', container_width.respond)
				.on('allResize', container_width.respond)
				.on('scroll', scrolldepth.respond);
			
			intent.on('pseudostandard', function() { //only call these functions if the container is wide enough to be a desktop
//				var emulateScroll = function() {
//					if($('#center').length < 1){ $('#all').wrap('<div id="center"/>').wrapInner('<div id="con" />'); }
//					var scroll = 0,
//						marginTop = 0;
//					$(window).scroll(function () {
//					    marginTop = ($(document).scrollTop() - scroll) + marginTop;
//					    scroll = $(document).scrollTop();
//					    $('#con').css('margin-top', -marginTop+'px');
//					}); 
//				};
				var emulateScroll = function() {
						if($('#center').length < 1){ $('#all').wrap('<div id="center"/>').wrapInner('<div id="con" />'); }
						var docHeight = $(document).height();
						$(window).scroll(function() {
							var winHeight = $(window).height(),  //set here in case someone resizes their window after devide emulation
								offscreen = docHeight - winHeight,
								conHeight = $('#con').height(),
								allHeight = $('#all').height(), //set here in case someone changes device orientation
								docPos = $(document).scrollTop(), //how much is offscreen now
								percentage = docPos / offscreen, //percentage of page scrolled (looking for docPos to match offscreen)
								scroll = (percentage * (conHeight-allHeight) * -1) + 'px';  //find the equivalent scroll for the container by multiplying the percentage of the document scrolled by how much of the container would be offscreen (just like how we measured the offscreen of the document)
							$('#con').css('margin-top', scroll);
						});	
				};
				intent.on("pseudomobile", function(){
					$('#docsLite article.equalize section').css('height', '');
					if(intent.is('standard')) {	emulateScroll(); };
				}).on("pseudosmalltablet", function(){
					$('#docsLite article.equalize section').css('height', '');
					if(intent.is('standard')) {
						emulateScroll();
					};
				}).on("pseudotablet", function(){
					console.log('the current width context is:', intent.axes.width.current);
					equalizeAll('article.equalize', 'section');
					if(intent.is('standard')){
						console.log("emulating scrollbars");
						emulateScroll();
					}
				}).on("pseudostandard", function() {
					equalizeAll('article.equalize', 'section');
					if($('#center').length > 0) {
						$('#all').unwrap().children().children().unwrap();
					}
				}).on("pseudohdtv", function() {
					equalizeAll('article.equalize', 'section');
				});
				
				var toggleOrientation = function() {
					var width = $('#all').width() + 'px',
						height	= $('#all').height() + 'px';
					$('#all').css({
						'width':height,
						'height':width
					});
				};
				var switchDevice = function(device) {
					$('#all')
						.css({'width':'', 'height':''})
						.removeClass()
						.addClass(device)
						.trigger('allResize');
					$('.toggleOrientation').click(function(){ 
						toggleOrientation();
					}); 
				};
				$('#makeMobile').click(function(){
					switchDevice('mobile');
				});
				$('#makeSmallTablet').click(function() { switchDevice('smallTablet');});
				$('#makeTablet').click(function() { switchDevice('tablet'); });
				$('#makeHdtv').click(function() { switchDevice('hdtv'); });
				$('#return').add('#cancel').click(function() {
					switchDevice('');
					$('#all').unwrap().children().children().unwrap();
				});
			});
			
			//Touch-enabled device functions
			$.each($('.swipe'), function() {
				var id = '#' + $(this).attr('id');
				buildSwipe(id);
			});
			intent.on('touch', function() {
				console.log("this is a touch device");
			});
			intent
				.on('pseudosmalltablet', function(){ $('#all').trigger('adjustPre'); })
				.on('pseudomobile', function(){ $('#all').trigger('adjustPre'); });
			
			
			var totalCodes = $('pre'),
			scaleFont = function(){
				$.each(totalCodes, function(){
					var width = $(this).width();
					var fontsize = (Math.floor(width / 36.7))/10;
					if(fontsize < 1.1) { fontsize = 1.1 }
					if(fontsize > 1.4) { fontsize = 1.4 }
					$(this).css('font-size', fontsize+'rem');
				});
			};
			$('#all').on('adjustPre', function() {
				scaleFont();
				$(window).on('resize', function() {
					scaleFont();
				});
			});
			
//			intent.on('pseudostandard', function() {
				var paper = new Raphael(document.getElementById('connections'), 820, 420);
				intent.on('belowfold', function() {
					console.log("below the fold");
				});
				var coordinates = {'orangeDark':[], 'orangeLight':[], 'greenDark':[], 'greenLight':[], 'greenDark':[], 'blueDark':[], 'blueLight':[]};
				var span = $('#codeImage span').not('span.white').not('span.ignore').not('span.selectable');
				$.each(span, function() {
					var classname = $(this).attr('class'),
						width	= $(this).width(),
						height	= $(this).height(),
						position= $(this).position(),
						x		= position.left + width + 10,
						y		= position.top + (0.5 * height) + 1,
						color	= $(this).css('color'),
						parent	= $(this).parent().attr('id');
					if(parent !== 'rawCodeImage') {
						x		= x - width + 10;
					}
					var xy		= {'x':x, 'y':y, 'color':color};
					coordinates[classname].push(xy);
				});
				$.each(coordinates, function(index, data) { //index: each span classname; data: all points in that classname
					var total = data.length-1;
					$.each(data, function(index, points) { //points: the x & y coordinates within a single classname
						var c	= paper
									.circle(points.x, points.y, 3.5)
									.attr({
										'stroke': points.color,
										'stroke-width':2
									});
					});
					$.each(data, function() { //draw the path after the circles are drawn
						var start	= $(this)[0],
							end		= data[total],
							hx		= (end.x - start.x)/2 + start.x,
							hy		= (end.y - start.y)/2 + start.y;
						var path = paper.path('M'+start.x+' '+start.y
							+' C'
							+hx+' '+start.y+' '
							+hx+' '+end.y+' '
							+end.x+' '+end.y)
							.attr({
								'stroke':start.color,
								'stroke-width':2
							});
					});
				});	
//			});
			
			//code image for mobile devices
			var writeOutput = function(device){				
				var output = '<h5>Outputs on your device</h5>\n&lt;section id="smallCode" class="'+device+'"&gt;\n   &lt;pre id="input"&gt;\n      //input\n   &lt;/pre&gt;\n   &lt;pre id="output" class="'+device+'"&gt;\n      //output\n   &lt;/pre&gt;\n&lt;/section&gt;';
				$('#output').empty().html(output);
			}
			

			intent
				.on('mobile', function() { console.log("mob"); writeOutput('mobile'); })
				.on('pseudomobile', function() { console.log("pseudo mob"); writeOutput('mobile'); })
				.on('smalltablet', function() { console.log("smalltablet"); writeOutput('smalltablet'); equalize('#smallCode', 'pre', 2); })
				.on('pseudosmalltablet', function() { console.log("pseudo small tab"); writeOutput('smalltablet'); equalize('#smallCode', 'pre', 2); })
				.on('tablet', function() { console.log("tab"); writeOutput('tablet'); equalize('#smallCode', 'pre', 2); })
				.on('pseudotablet', function() { console.log("pseudo tab"); writeOutput('tablet'); equalize('#smallCode', 'pre', 2); })
				.on('standard', function() { console.log("std"); })
				.on('pseudostandard', function() { console.log("pseudo std"); });
			
		});