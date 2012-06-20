define('Intention', ['Inquisitor', 'jquery'], function (inq, $) {

  (function(){

    window.Intention = function(){

      // store the initial container
      // create base attrs from initial attr vals
      // set interaction model
      this._setResponsiveElms();

      var that = this;

      this.inq=inq;

      
      var intentHandler = function(info){

        console.log('the Inquisitor has detected a change here is the info: ', info);

        that.context=info;

        // set the context information to the info (event object that comes from inq)
        that.intent.apply(that, [info.name]);

      };
      
      // run the intention on initialization to setup any elms that need settin
      intentHandler(this.inq.info());

      this.inq.on('change', intentHandler);

      return intentHandler;

    };

    window.Intention.prototype = {

      // props
      derive_context:false,

      funcs: ['move', 'class', 'attr'],

      _responsiveElms: function(){
        // store all relevant elms in an array
        return $('[data-intention]');
      },

      _setResponsiveElms: function(){
        this.elms = this._responsiveElms();
        return false;
      },

      _makeInstructions: function(elm){
        
        var attrs=elm.attributes,
          instructions={
            move: [],
            class: []
          },
          interaction=this.context.interaction,
          context=this.context.name;

        // to keep things clear for myself and for those that may look at this code
        // i am breaking the task of matching relevant attrs into two regexes
        // this also gives the added benefit of allowing me on the second pass
        // to extract the function string and create the instruction object right there

        var notContexts = '',
          funcs='',
          notInteractions = '';
        // looking for the context or the interaction or the function NO ORDER
        

        // TODO: for efficiency sake this stuff can be externalized
          // because it is the same for every interation

        // build the context filter for the regex
        for(var i=0; i<this.inq.thresholdNames.length;i++) {
          if(this.inq.thresholdNames[i] !== context){
            notContexts+='(' + this.inq.thresholdNames[i] + ')|'  
          }
        }

        // build the function filter for the regex
        for(var i=0; i<this.funcs.length;i++) {
          funcs+='(' + this.funcs[i] + ')|'  
        }

        for(var i=0; i<this.inq.interactionModes.length;i++) {
          if(this.inq.interactionModes[i] !== 
              this.context.interaction){
            notInteractions+='(' + this.inq.interactionModes[i] + ')|'  
          }
        }

        notInteractions = notContexts.replace(/\|$/, '');

        notContexts = notContexts.replace(/\|$/, '');

        funcs = funcs.replace(/\|$/, '');

        // these patterns should not be generated for every element,
          // they happen on a per "change" basis

        // pattern is a reverse lookback meaning: match anything that is not [string]
        var contextFilter = new RegExp('^data-((?!'+ notContexts +').)*$'),
          functionFilter = new RegExp(funcs),
          // find the interaction mode we're not in
          // do a reverse lookback regex
          interactionFilter = new RegExp(notInteractions);

        var instructions = {};

        for(var i=0; i<attrs.length;i++){

          var attr = attrs[i];

          // if the attr is not the current interaction mode, try the next one
          
          if(interactionFilter.test(attr.name)){
            continue;
          }

          if(contextFilter.test(attr.name)){

            // at this point we have a hold on a data attrs that is not of the 
            // current context it may be a base data attr a context attr
            // or a data attr that we are not interested in
            var funcMatch = attr.name.match(functionFilter);

            // test that it includes a function we have specified
            if(funcMatch){
              var func = funcMatch[0];

              if(!instructions[func]){

                instructions[func] = {
                  options:[attr]
                }

              } else {

                instructions[func].options.push(attr)
                
              }
            }
          }
        }
        
        // go through the attrs and further organize: move class attrs to "class" object
        // figure out which attr is being changed and place that in a sub category
        if(instructions.attr){
          for(var i=0, l=instructions.attr.options.length; i<l; i++){

            
            if(/class/.test(instructions.attr.options[i].name)){

              // this could be written more clearly as:

                // instructions.class.options.push(
                //   instructions.attr.options[i]);

                // instructions.attr.options.splice(i, 1);

              instructions.class.options.push(
                instructions.attr.options.splice(i, 1)[0]);

              // decrement l and i 
              l--;
              i--;
            } else {

              // find the specific attr we are manipulating

              // until we come up with a more intelligent algo, i'm just going to
              // take everything after the "attr" hence the regex below
              if(!instructions.attr.arb) {
                instructions.attr.arb = {};
              }

              // this line is ready for some articulation
              var specificAttr = instructions.attr.options[i].name.match(/attr-(.*$)/)[1];

              if(instructions.attr.arb[specificAttr]) {
                instructions.attr.arb[specificAttr].push(instructions.attr.options[i])
              } else {
                instructions.attr.arb[specificAttr] = [instructions.attr.options[i]];
              }
            }
          }
        }
        
        return instructions;

      },

      _findBest: function(func, options){

        // perhaps there's a more efficient way of doing this but naively this seems to work

        // context[mobile] +4, interaction[touch] +2, subfunction[append] +3

        var contextPattern = '';

        for(var i=0; i<this.inq.thresholdNames.length;i++) {
          contextPattern += this.inq.thresholdNames[i] + '|';
        }

        contextPattern = contextPattern.replace(/\|$/, '');

        var points = [
          {pattern:contextPattern, value:4}, 
          // for the foreseeable future there are not going to be any interaction modes
          // other than touch and mouse, but a dynamic pattern to come from inq is in order
          {pattern: 'touch|mouse', value:2}, 
          {pattern: func + '-[a-zA-Z\-\_]+$', value:3}]

        // search for string, apply rank
        var best,
          lastRank=0;

        for(var i=0; i<options.length; i++) {

          var rank=1;

          for(var j=0; j<points.length; j++){
            if(new RegExp(points[j].pattern).test(options[i].name)){
              rank+=points[j].value;
            }
          }

          if(rank > lastRank){
            best=options[i];
          }

        }

        return best;
        
      },

      _combine:function(options){

        // take the base and make it into an array
        // a.split(' ')
        // a =union(a,b);
        // a.toString();
        // a.replace(/,/g, ' ')

        var values = [];

        for(var i=0; i<options.length; i++){
          values=this._union(values, options[i].value.split(' '))
        }

        values = values.toString();

        values = values.replace(/,/g, ' ');


        return values;

      },

      // public methods
      intent: function(context){

        
        // get the context name if a number is passed??
        // if(typeof context === 'number'){}

        // go through all of the elms
        for(var i=0; i<this.elms.length; i++){
          var elm = this.elms[i], 
            instructions = this._makeInstructions(elm);

          for(instruction in instructions) {
            if(instructions.hasOwnProperty(instruction)){
              this['_'+instruction](elm, instructions[instruction]);
            }
          }
        }
      },


      _class:function(elm, instruction){

        $(elm).attr('class', this._combine(instruction.options));

      },

      _attr: function(elm, instruction) {

        // console.log('in attr')
        // console.log(elm, attr, val);
        for(var attr in instruction.arb){
          if(instruction.arb.hasOwnProperty(attr)){
            var attrVal = this._findBest('attr',instruction.arb[attr]);
            $(elm).attr(attr, attrVal);
          }
        }

      },

      _move: function(elm, instruction) {

        // find the base
        var moveSelector = this._findBest('move', 
              instruction.options).value;
        
        $(moveSelector).append( elm );

      },

      // this supports the base attr functionality
      _union: function(x,y) {

        var obj = {};

        for (var i = x.length-1; i >= 0; -- i)
           obj[x[i]] = x[i];

        for (var i = y.length-1; i >= 0; -- i)
           obj[y[i]] = y[i];

        var res = [];

        for (var k in obj) {
          if (obj.hasOwnProperty(k))  // <-- optional
            res.push(obj[k]);
        }

        return res;
      },

      update: function(elm){

        if(elm){
          // TODO: poor man's solution check to see whether or not the elm exists 
          // in the elms array before adding it
          this.elms.push(elm)
        } else {
          this._setResponsiveElms();  
        }
      }

    };

    var intention = new window.Intention();
    
    if(!window.intention){
      window.intention = intention;
    }

  })()

  return intention;

});