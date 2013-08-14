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
    callback();
  }

  $.when
    .apply(this, dfds)
    .done(callback);
};

in_init(['standard'], function(){
  console.log('standard has been entered');
});
