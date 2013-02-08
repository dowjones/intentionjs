var assert = chai.assert,
      expect = chai.expect,
      should = chai.should(); // Note that should has to be executed

describe("Intention", function() {

  tn = new Intention;

  describe("Constructor", function(){
    it("Should return an object", function(){
      assert.typeOf(tn, 'object', 'constructor is an object');
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
        expect(tn.elms.length).to.equal(0);
        // tn.add returns the tn object so i should be able access the elms prop
        var divs = container.find('div');
        expect(tn.add(divs).elms.length).to.equal(3);
      });

      it("Should remove one item from tn.elms", function(){
        // find the element that should be removed
        var rmElm = container.find('#getRidOfMe');
        expect(tn.remove(rmElm).elms.length).to.equal(2);
      });
    });

  describe("setElms: set the responsive elements from a dom scope", 
    function(){
      it("Should replace whatever is in the tn.elms \
        with all the *reponsive* elms in the container div", function(){
          // set the tn.elms to be empty just to keep things clean
          tn.elms=$();
          expect(tn.setElms(container).elms.length).to.equal(2);
        });

      it("Should query the dom for responsive elms, there are none.", 
        function(){
          expect(tn.setElms().elms.length).to.equal(0);
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

    var contexts = ['big', 'medium','small'],
      simpleResponder = tn.responsive('simple', 
        contexts, function(i, contexts){ return contexts[i]; });

    var simplerResponder = tn.responsive('simpler', 
      ['big', 'small']);

    

    it("Should return a function", function(){
      expect($.isFunction(responder)).to.equal(true);
    });

    // this is incorrect at < 400 screen sizes, fix
    it("Should execute to return the current context", function(){
      expect(responder()).to.deep.equal(
        $(window).width() < 400 ? {name:'small',val:0}:{name:'big',val:400});
    });

    it("Should execute to return the specified context", function(){
      expect(simplerResponder('big')).to.deep.equal({name: 'big'});
    });

    it("Should execute to return alternative context", function(){
      expect(simplerResponder('small')).to.deep.equal({name: 'small'});
    });

    it("Should return the item specified via the index. multiple arguments", 
      function(){
        expect(simpleResponder(0, contexts)).to.deep.equal({name: 'big'});
    });

    it("Should fire the simple event", function(){
      var simpleEventCount=0;
      tn.on('simple', function(ctx){simpleEventCount++;})
      simpleResponder(0, contexts);
      expect(simpleEventCount).to.equal(1);
    });


    var performTest = false,
      currentContext,
      winW,
      resizeContexts = [{name:'standard', min:769}, 
        {name:'tablet', min:321},
        {name:'mobile', min:0}],
      // hResponder is a function which passes arguments to the 
      // callback canary

      hResponder = tn.responsive('hr', resizeContexts,
        // callback, return value is passed to matcher()
        // to compare against current context
        function(e){
          performTest=true;
          return $(window).width();
        },
        // compare the return value of the callback to each context
        // return true for a match
        function(test, context){
          if(test>=context.min){
            return true;
          }
        });

    $(window).on('resize', hResponder);



    $(window).trigger('resize');

    it("should wrap the window resize event callback", function(){
      expect(performTest).to.equal(true);
    });

    
    it('should switch between all contexts', function(done){
      
      this.timeout(9); //000

      var winW;

      var tablet = $.Deferred().done(function(){
        expect(winW).to.be.below(769);
        expect(hResponder().name).to.equal('tablet');
      }),
      standard = $.Deferred().done(function(){
        expect(winW).to.be.at.least(769);
        expect(hResponder().name).to.equal('standard');
      }),
      mobile = $.Deferred().done(function(){
        expect(winW).to.be.below(321);
        expect(hResponder().name).to.equal('mobile');
      });

      $.when(tablet, mobile, standard).done(function(){
        done();
      });

      tn.on('hr', function(context){

        winW=$(window).width();

        if(context.name === 'mobile') {
          mobile.resolve();
        } else if (context.name === 'tablet'){
          tablet.resolve();
        } else if (context.name === 'standard'){
          standard.resolve();
        }
        
      });

      // alert('RESIZE the window small to large or vise versa')
    });
    
    


    it('_respond: should change appropriate attrs in a given context', function(done){
      
      this.timeout(90);
      var testElm = $('<div class="original" tn-mobile-class="mobile small" \
            tn-tablet-class="tablet medium" tn-standard-class="standard big" \
            ></div>');

      // test the _respond attr matching method
      var match= false;

      $.each(testElm[0].attributes, function(i, attr){

        if(attr.name === 'class'){
          match = true
          expect(attr.value).to.equal('original')
        }
      });

      expect(match).to.equal(true);

      expect(
        tn.add(
          testElm).elms.length).to.equal(1);
  
      // done();
      
      var tablet = $.Deferred().done(function(){
          
        }),

        standard = $.Deferred().done(function(){
          
        }),
        mobile = $.Deferred().done(function(){
          
        });

      $.when(tablet, mobile, standard).done(function(){
        done();
      });

      tn.on('hr', function(context){
        if(context.name === 'mobile') {
          mobile.resolve();
        } else if (context.name === 'tablet'){
          tablet.resolve();
        } else if (context.name === 'standard'){
          standard.resolve();
        }
      });

      

      // alert('RESIZE the window small to large or vise versa')
    });
  });


  describe("regex tests", function(){

    var attrPattern = new RegExp('(^tn-|^intention-|^data-tn-|^data-intention-)?' 
      + 'mobile' + '-' + 'class' + '$');

    it('should match on an abbreviated nonstandard prefix', function(){
        expect(
          attrPattern
            .test('tn-mobile-class')).to.equal(true);

    });

    it('should match on an abbreviated standard prefix', function(){
        expect(
          attrPattern
            .test('data-tn-mobile-class')).to.equal(true);
    });

    it('should match on a nonstandard prefix', function(){
        expect(
          attrPattern
            .test('intention-mobile-class')).to.equal(true);

    });

    it('should match on an standard prefix', function(){
        expect(
          attrPattern
            .test('data-intention-mobile-class')).to.equal(true);

    });

    it('should match without a prefix', function(){
        expect(
          attrPattern
            .test('mobile-class')).to.equal(true);
    });

  });






});