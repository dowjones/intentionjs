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
    // $(window).resize(tn.respondTo('width', [], callback, 
    //   function(curContext, retVal){

    //   }))

    function(oldVal, newVal){

    }

    var horizontalCheck = function(val){
      return function(retVal){
        if(retVal>val){
          return true;
        }
        return false;
      }
    }
    tn.respondTo('width', [
        {context:'mobile', val:320},
        {context:'tablet', val:768},
        {context:'standard', val:1000}
      ])
  });



});