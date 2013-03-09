describe("Intention", function() {

  describe("Constructor:", function(){
    var intent = new Intention;
    it("Should return an object", function(){
      expect(intent).to.be.an('object')
    })
  });

  // create some elements to test with
  var container = $('<div>'),
    // this container does not have tn attrs
    nonResponsiveElm = $('<div id="getRidOfMe">'),
    responsiveElm1 = $('<div data-intent>');

  // basic tn attrs
  responsiveElm1
    .attr('in-class','base')
    .attr('in-mobile-class','mobile')
    .attr('in-tablet-class','tablet')
    .attr('in-touch-class','touch')
    .attr('in-standard-class','standard');
  
  container.append(nonResponsiveElm, responsiveElm1, $('<div intent>'));

  describe("add and remove: add and remove responsive elements", 
    function(){
      var intent = new Intention;

      it("Should add three items to intent.elms", function(){
        expect(intent.elms.length).to.equal(0);
        // intent.add returns the intent object so i should be able access the elms prop
        var divs = container.find('div');
        expect(intent.add(divs).elms.length).to.equal(3);
      });

      it("Should remove one item from intent.elms", function(){
        // find the element that should be removed
        var rmElm = container.find('#getRidOfMe');
        expect(intent.remove(rmElm).elms.length).to.equal(2);
      });
    });

  describe("elements: set the responsive elements from a dom scope", 
    function(){
      it("Should add all *reponsive* elms in the container div", function(){
          var intent = new Intention;
          expect(intent.elements(container).elms.length).to.equal(2);
        });

      it("Should query the dom for responsive elms, there are none.", 
        function(){
          var intent = new Intention;
          expect(intent.elements(document).elms.length).to.equal(0);
      });
    });

  describe("responsive: creating responsive functions", function(){

    var intent = new Intention,
      big={name:'big', val:400},
      small={name:'small', val:0},
      medium={name:'medium', val:200},
      sizeCtxs = [big, medium, small],
      size = intent.responsive( 
        sizeCtxs, 
        function(response, context){
          return response >= context.val;
        });

    it("Should return a function", function(){
      expect(_.isFunction(size)).to.equal(true);
    });

    // this is incorrect at < 400 screen sizes, fix
    it("Should add the the appropriate context and remove all others", function(){
      
      // in the small context
      expect(_.contains(size(0).contexts, small)).to.equal(true);
      expect(_.contains(size(0).contexts, big)).to.equal(false);
      expect(_.contains(size(0).contexts, medium)).to.equal(false);
      // in the medium context
      expect(_.contains(size(200).contexts, medium)).to.equal(true);
      expect(_.contains(size(200).contexts, big)).to.equal(false);
      expect(_.contains(size(200).contexts, small)).to.equal(false);
      // in the big context
      expect(_.contains(size(1000).contexts, big)).to.equal(true);
      expect(_.contains(size(1000).contexts, small)).to.equal(false);
      expect(_.contains(size(1000).contexts, medium)).to.equal(false);
    });

    it("events should only fire when crossing a threshold", function(){
      var callbackCount = 0;
      // set the current context to small
      size(0);
      // attach a callback to big
      intent.on('big', function(){
        callbackCount++;
      });
      // change to the big context
      size(1000);
      expect(callbackCount).to.equal(1);
      // resolve the responder to the big context again.
      size(1000);
      // the event should not have fired
      expect(callbackCount).to.equal(1);
    });


  });

  describe("is: test to see if a context name is in the .contexts property",
    function(){
      var intent = new Intention,
        axis=intent.responsive([{name:'foo'}, {name:'bar'}]);
      it('should confirm the applied context is current and others are not', 
        function(){
          // change the axis into the foo context
          axis('foo');
          expect(intent.is('foo')).to.equal(true);
          expect(intent.is('bar')).to.equal(false);

        });

      it('should change contexts and confirm the new context is \
        in the contexts list', function(){
          axis('bar');
          expect(intent.is('bar')).to.equal(true);
          expect(intent.is('foo')).to.equal(false);  
        });
    });

  describe("_fillSpec: takes a spec and fills in unspecified funcs", function(){
    var intent = new Intention;

    it('should take a spec and return a new one filled out', function(){

      var spec = {
          base:{
            append:'#default'
          },
          mobile: {
            'class': 'a',
            src: 'a.png',
            append: '#a'
          },
          tablet: {
            'class':'b',
            src: 'b.jpg'
          }
        },
        filled = {
          base:{
            append:'#default',
            'class':'',
            src:''
          },
          mobile: {
            'class': 'a',
            src: 'a.png',
            append: '#a'
          },
          tablet: {
            'class':'b',
            src: 'b.jpg',
            append:''
          }
          
        };
      expect(intent._fillSpec(spec)).to.eql(filled);
    });
  });
  

  describe("_contextualize: keeping track of the current contexts", function(){
    // takes a context object to add, the axis that context belongs 
    // (ofContexts) and the list of current contexts
    var intent = new Intention;
    
    it('should return a list including the "foo" and the "baz" context', function(){
      var inCtx = {name:'foo'},
        expectedCtxs = [{ name:"baz"},{ name:"foo"}],
        currentContexts = intent._contextualize(inCtx, 
          [inCtx, {name:'bar'}], 
          expectedCtxs);

      _.each(expectedCtxs, function(ctx){
        expect(_.contains(ctx, currentContexts)).to.equal(false);  
      });
    });

    it('should add context from axis and remove any other from same context', 
      function(){
        var intent = new Intention,
          inCtx = {name:'foo'},
          constantCtx = {name:'base'},
          outCtx = {name:'bar'},
          current = intent._contextualize(inCtx, 
            [inCtx, outCtx], 
            [constantCtx]);

        expect(_.contains(current, inCtx)).to.equal(true);
        expect(_.contains(current, constantCtx)).to.equal(true);
        expect(_.contains(current, outCtx)).to.equal(false);
      });

    it('Should replace contexts of the same group at \
      the same index of current contexts', function(){
        var intent = new Intention,
          inCtx = {name:'foo'},
          outCtx = {name:'bar'},
          ofCtxs = [inCtx, outCtx],
          current=intent._contextualize(inCtx, ofCtxs, [{name:'base'}, outCtx]);
        expect(_.indexOf(current, inCtx)).to.equal(1)
      });

    it('Should put new contexts at the beginning of current contexts', 
      function(){
        var intent = new Intention,
          ctxA={name:'a'},
          ctxB={name:'b'},
          ctxAA={name:'aa'},
          axisA = intent.responsive([ctxA, ctxAA]);;

        axisA('a')

        intent.responsive([ctxB])('b');

        expect(_.indexOf(intent.contexts, ctxA)).to.equal(1);
        expect(_.indexOf(intent.contexts, ctxB)).to.equal(0);

        // switch axisA to ctx AA
        axisA('aa');

        // the index should be the same
        expect(_.indexOf(intent.contexts, ctxAA)).to.equal(1);

      });
  });

  describe("_attrsToSpec: convert element's attrs to a responsive specification", 
    function(){
      it('should match when only one func is specified (class)', function(){
        var intent= new Intention,
          elm = $('<div>')
            .attr({'in-mobile-class':'foo',
              'in-tablet-class':'bar',
              'in-standard-class':'baz'});

        expect(intent._attrsToSpec(elm[0].attributes)).to.eql({
          mobile:{
            'class':'foo'
          },
          tablet:{
            'class':'bar'
          },
          standard:{
            'class':'baz'
          }
        });
      });

      it('should match when many funcs are specified', function(){
        var intent= new Intention,
          elm = $('<div>')
            .attr({'in-mobile-class':'foo',
              'in-tablet-class':'bar',
              'in-standard-class':'baz',
              'in-mobile-append':'#foo',
              'in-standard-href':'http://baz.baz'});

        expect(intent._fillSpec(intent._attrsToSpec(elm[0].attributes)))
          .to.eql({
            mobile:{
              'class':'foo',
              append:'#foo',
              href:''
            },
            tablet:{
              'class':'bar',
              append:'',
              href:''
            },
            standard:{
              'class':'baz',
              href:'http://baz.baz',
              append:''
            }
          });
      });
    });
  
  describe('_resolveSpecs: from a list of names make object of changes', 
    function(){

      it('should combine the classes and cascade to specified attr', function(){
        var intent = new Intention;
        expect(
          intent._resolveSpecs(['foo', 'bar'], {
            foo: {
              'class':'foo',
              href:''
            },
            bar:{
              'class':'bar',
              href:'http://bar.bar'
            }
          }))
          .to.eql({
            'class':['foo', 'bar'],
            href:'http://bar.bar'
          });
      });
    });

  describe('_changes: compiles a list of contexts to be applied and \
    those that are not applied', 
    function(){
      it('should add the foo spec to in contexts and bar to out contexts', function(){
        var intent = new Intention,
          changes = intent._changes({
            foo:{
              'class':'foo',
              append:'#foo'
            },
            bar: {
              'class':'bar',
              append:'#bar'
            }
          }, [{name:'foo'}]);

        expect(changes.inSpecs)
          .to.eql({
            'class':['foo'],
            move:{value:'#foo', placement:'append'}
          });

        expect(changes.outSpecs)
          .to.eql({
            'class':['bar'],
            move:{value:'#bar', placement:'append'}
          });
      });
    });

  describe('_makeChanges: maniputate an element based on responsive specification', 
    function(){

        var intent = new Intention,
          elm=$('<div class="baz">'),
          changes = intent._changes({
            foo:{
              'class':'foo',
              href:'http://foo.foo'
            },
            bar: {
              'class':'bar',
              append:'#bar'
            }
          }, [{name:'foo'}]);

        intent._makeChanges(elm, changes);

        it('should have classes of appropriate context', function(){
          expect(elm.hasClass('foo')).to.equal(true);
          expect(elm.hasClass('bar')).to.equal(false);
        });

        it('should have attr of current context', function(){
          expect(elm.attr('href')).to.equal('http://foo.foo')
        })

        it('should not have deleted a class that is not specified in the out contexts', 
          function(){
            expect(elm.hasClass('baz')).to.equal(true);
          });
    });

  describe('jquery event', function(){
    it('should fire a jquery trigger event on every elm', function(){
      var intent = new Intention,
        fire=false;

      intent.add($('<div>').on('intent', function(){
        fire=true
      }));

      intent.responsive([{name:'base'}])('base');

      expect(fire).to.equal(true);
    })
  })
  
  describe("regex tests", function(){
    // TODO: update this regex
    var attrPattern = new RegExp(
      '(^(data-)?(in|intent)-)?([_a-zA-Z0-9]+)-([A-Za-z:-]+)');

    it('should match on an abbreviated nonstandard prefix', function(){
        expect(
          attrPattern
            .test('in-mobile-class')).to.equal(true);

    });

    it('should match on an abbreviated standard prefix', function(){
        expect(
          attrPattern
            .test('data-in-mobile-class')).to.equal(true);
    });

    it('should match on a nonstandard prefix', function(){
        expect(
          attrPattern
            .test('intent-mobile-class')).to.equal(true);

    });

    it('should match on an standard prefix', function(){
        expect(
          attrPattern
            .test('data-intent-mobile-class')).to.equal(true);

    });

    it('should match without a prefix', function(){
        expect(
          attrPattern
            .test('mobile-class')).to.equal(true);
    });

  });

  describe('underscore test', function(){
    it('should be the relative complement', function(){
      expect(_.difference([1,2,3], [3,4,5])).to.eql([1,2]);
      expect(_.difference([1,2,3], [3,2])).to.eql([1]);
    });
  });

});