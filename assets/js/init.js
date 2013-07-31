function in_init(contexts, callback){
  var dfds = [];

  _.each(contexts, function(ctx){
    var dfd = $.Deferred();

    dfds.push(dfd);

    if(intent.is(ctx)) {
      dfd.resolve();
    } else {
      intent.on(ctx, dfd.resolve);
    }
  });

  if((!contexts) || (contexts.length === 0)){
    sheetWriter();
  }
  $.when.apply(this, dfds).done(callback);

};

//usage:
in_init(['standard', 'hdtv'], function(){
  console.log('standard has been entered');
  imageSetup();
  equalizeAll('#docs', 'article.equalize', 'section');
});

in_init(['tablet', 'smalltablet'], function(){
	console.log('tablets entered');
	console.log('whats this?', $(this), this);
	equalizeAll('#smallCode', 'pre');
	writeOutput(intent.axes.width.current);
});

in_init(['mobile'], function() {
	console.log('mobile entered');
	writeOutput(device);
});