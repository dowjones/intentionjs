'use strict';

(function ($,window,document) {

    var pluginName = 'menuDeck';

    function Plugin(element) {

      this.menu      = $(element);
      this.items     = this.menu.children();
      this._name     = pluginName;
      this.init();

    }

    var proto = Plugin.prototype;

    proto.init = function () {

      this.cover = this.findCover();
      this.open  = this.makeState('open');
      this.close = this.makeState('close');

      this.applyState(this.close);

      var self = this;

      this.items.each(function(i){
        $(this).css({'z-index':self.items.length - i});
        $(this).on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',function(){
            self.menu.removeClass('moving');
        });
        $(this).click(function(){
          $(self.items[self.cover]).removeClass('cover');
          self.cover = i;
          $(this).addClass('cover');
        });
      });

      this.menu.hover(function(){
         
        self.applyState(self.open);
        self.menu.addClass('moving');
      },function(){
        self.applyState(self.close);
        self.menu.addClass('moving');
      });

    };

    proto.findCover = function () {
      
      var cover = 0;
      this.items.each(function(i){
        if( $(this).hasClass('cover') ){
          cover = i;
          return false; // break jquery each
        }
      });
      return cover;

    }

    proto.makeState = function(type){
      var l = this.items.length,
          h = $(this.items[0]).outerHeight(),
          self = this,
          int = .01; //animation delay interval
      
      var states = {
         open: function(i){
            var t = $(self.items).siblings('.scrollCover').index(), //find cover item
                top = h * i;
            if(i >= t){
               var delay=0;
            } else {
               var delay = int*(t-i);
            }
            return {'top':top + "px", 'transition-delay':delay+'s'};   
        },
        close: function(i){
          if(i <= t){
            var delay = int*(l-t-1);
          }
          else{
            var delay = int * (l-i-1);
          }
          var t = self.cover;
          return {'top':'0px', 'transition-delay':delay+'s'};
        }
      }
      
      return states[type];

    };

    proto.applyState = function(shifter,target){
      this.items.each(function(i,elm){
        $(elm).css(shifter(i,target));
      });

    }

    $.fn[pluginName] = function(){

      return this.each(function(){
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, 
          new Plugin(this));
        }
      });

    }

})(jQuery,window,document);
