require.config({
  appDir: './',
  paths: {
      jquery: 'test/vendor/jquery',
      underscore: 'test/vendor/underscore'      
  }
});

require	([
   'Context'
], function(intent){

	intent.axes.width.contexts.unshift({
		name:'luxury',
		min:1100
	});

});