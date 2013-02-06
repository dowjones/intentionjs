describe("Intention", function() {

  tn = new Intention;

  describe("Constructor", function(){
    it("Should return an object", function(){
      expect(typeof tn).toBe('object');
    })
  });

  // create some elements to test with
  var container = $('<div>'),
    // this container does not have tn attrs
    nonResponsiveElm = $('<div id="getRidOfMe">'),
    responsiveElm1 = $('<div data-tn>');

  // basic tn attrs
  responsiveElm1
    .attr('tn-class','base')
    .attr('tn-mobile-class','mobile')
    .attr('tn-tablet-class','tablet')
    .attr('tn-touch-class','touch')
    .attr('tn-standard-class','standard');
  
  container.append(nonResponsiveElm, responsiveElm1, $('<div tn>'))


  describe("add and remove: add and remove responsive elements", 
    function(){
      it("Should add three items to tn.elms", function(){
        expect(tn.elms.length).toBe(0);
        // tn.add returns the tn object so i should be able access the elms prop
        var divs = container.find('div');
        expect(tn.add(divs).elms.length).toBe(3);
      });

      it("Should remove one item from tn.elms", function(){
        // find the element that should be removed
        var rmElm = container.find('#getRidOfMe');
        expect(tn.remove(rmElm).elms.length).toBe(2);
      });
    });

  describe("setElms: set the responsive elements from a dom scope", 
    function(){
      it("Should replace whatever is in the tn.elms \
        with all the *reponsive* elms in the container div", function(){
          // set the tn.elms to be empty just to keep things clean
          tn.elms=$();
          expect(tn.setElms(container).elms.length).toBe(2);
        });

      it("Should query the dom for responsive elms, there are none.", 
        function(){
          expect(tn.setElms().elms.length).toBe(0);
        });
    });

  describe("_makeInstructions: create a list of instructions \
    from a reponsive element", function(){

      // it("Should return an object", function(){

      // })

    });

  describe("respondTo: create custom responders", function(){


    // we need the callback and the evaluator function
    // 1. name the response, that will be the event emmitted by tn
    // 2. pass a list of contexts to check against {context:'name', val:true}
      // name will be used in the data attrs
      // val is what will be checked against the return value of the callback
    // 3. the callback is what is going to be fired on this event
    // 4. optionally pass an evaluation function to compare the callback return value with the context values
      //  
    // $(window).resize(tn.respondTo('width', [], callback, 
    //   function(curContext, retVal){

    //   }))


    // var horizontalCheck = function(val){
    //   return function(retVal){
    //     if(retVal>val){
    //       return true;
    //     }
    //     return false;
    //   }
    // }
    // tn.respondTo('width', [
    //     {context:'mobile', val:320},
    //     {context:'tablet', val:768},
    //     {context:'standard', val:1000}
    //   ])
  });

  describe("responsive: creating responsive functions", function(){

    var responder = tn.responsive('resize', 
      [{name:'big', val:400}, {name:'small', val:0}], 
      function(){return $(window).width();},
      function(response, context){
        return response > context.val;
      });

    $(window).on('scroll', tn.responsive('depth', [{name:'shallow', val:500}], 
      function(){
        return window.scrollDepth;
      }, function(context, response){
        if(context.value > response) return true;
      }));

    var contexts = ['big', 'medium','small'],
      simpleResponder = tn.responsive('simple', 
        contexts, function(i, contexts){ return contexts[i]; });

    var simplerResponder = tn.responsive('simpler', 
      ['big', 'small']);

    

    it("Should return a function", function(){
      expect($.isFunction(responder)).toBe(true);
    });

    // this is incorrect at < 400 screen sizes, fix
    it("Should execute to return the current context", function(){
      expect(responder()).toEqual(
        $(window).width() < 400 ? {name:'small',val:0}:{name:'big',val:400});
    });

    it("Should execute to return the specified context", function(){
      expect(simplerResponder('big')).toEqual({name: 'big'});
    });

    it("Should execute to return alternative context", function(){
      expect(simplerResponder('small')).toEqual({name: 'small'});
    });

    it("Should return the item specified via the index. multiple arguments", 
      function(){
        expect(simpleResponder(0, contexts)).toEqual({name: 'big'});
    });

    it("Should fire the simple event", function(){
      var simpleEventCount=0;
      tn.on('simple', function(ctx){simpleEventCount++;})
      simpleResponder(0, contexts);
      expect(simpleEventCount).toBe(1);
    });


  });



});