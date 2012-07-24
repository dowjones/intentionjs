
var http = require('http'),
  Intention=require('./tmp/Intention.js').Intention;
  
var itn = new Intention;
var head = '<!DOCTYPE html> <html> <head> <title>Intention</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Le styles --> <link href="http://localhost/~Brain/itn/lib/assets/css/main.css" rel="stylesheet"> <style> #mobile_box { position:relative; height:300px; width:100%; background:yellow; display: none; } #tablet_box { position:relative; height:300px; width:100%; background:tan; display: none; } #desk_box { position:relative; height:300px; width:100%; background:blue; display: none; } #lux_box { display: none; position:relative; height:300px; width:100%; background:violet; } #desk_box.on, #mobile_box.on, #tablet_box.on, #lux_box.on { display: block; } #mobile_box #responder, #tablet_box #responder, #desk_box #responder, #lux_box #responder { display: block; } #responder { background:#000; color:#fff; font-weight:bold; text-transform:uppercase; font-family:sans-serif; font-size:20px; height:150px; width:150px; position:absolute; top:50%; left:50%; margin-top:-75px; margin-left:-75px; /*display:none;*/ } #responder.blue { background:blue; } #responder.yellow { background:yellow; } #responder.red { background:red; } #responder.blue.red { background:magenta; } #responder.blue.yellow { background:green; } #responder.red.yellow { background:orange; } #responder.red.yellow.blue { background:brown; } </style> </head> <body> ',
  foot = '<script data-main="http://localhost/~Brain/itn/lib/assets/js/main" src="http://localhost/~Brain/itn/lib/assets/js/require/require.js"></body></html>'
  tmpl = '<div data-intention data-mobile-class="on" data-base-class="" id="mobile_box"></div> <div data-intention data-tablet-class="on" data-base-class="" id="tablet_box"></div> <div data-intention data-standard-class="on" data-base-class="" id="desk_box"></div> <div data-intention data-base-class="" data-luxury-class="on" id="lux_box"></div> <div id="responder" data-intention data-move = "#standard_box" data-mobile-move-prepend = "#mobile_box" data-tablet-move = "#tablet_box" data-tablet-touch-move = "#tablet_box_b" data-move = "#standard_box" data-tablet-mouse-class = "yellow" data-class = "color newsItem" data-tablet-class = "blue" data-tablet-touch-class = "black" data-attr-href = "http://www.pandas.com/a" data-tablet-attr-href = "http://www.pandas.com/b" data-tablet-mouse-attr-href = "http://www.pandas.com/c" data-standard-move="#desk_box" data-standard-class="red" ></div>'



var context = itn.intent({
  name:'mobile',
  interaction:'mouse',
  pixelRatio:1
}, tmpl);

http.createServer(function (req, resp) {

  resp.setHeader("Access-Control-Allow-Origin", "*");
  resp.writeHead(200, {'Content-Type': 'text/html'});

  resp.end(context);


}).listen(8000, "127.0.0.1");


