(function(){

    var modalWrapper = function ($, Intention, Context) {
  
      $.intention = Intention;

      $.fn.intention = function(param) {

        if ( $.intention[param] ) {
          this.each(function(){
            var plugin = $(this).data('intention');
            plugin[param].apply(plugin, arguments);
          });
        } else if ( typeof param === 'object' || ! param ) {

          return this.each(function(){
          	var options = $.extend({container:this}, param, {context: new Context({elm:$(this)})}),
          		plugin = new $.intention(options);

          	$(this).data('intention', plugin);
          });
        } else {
          $.error( param + ' is not a jQuery.intention method!' );
        }
      }
    };

    if ( typeof define === "function" && define.amd ) {
      define('Modal', ['jquery', 'Intention', 'JQueryContext'], modalWrapper )
    } else {
      modalWrapper(jQuery, Intention, Context);
    }

})();