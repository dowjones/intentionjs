define('Intention', ['Context', 'jquery'], function (ctz, $) {

    'use strict';

    var Intention = function(params){


      if(params){
        for(var param in params){
          if(params.hasOwnProperty(param)){
            this[param] = params[param];  
          }
        }
      }

      // store the initial container
      // create base attrs from initial attr vals
      // set interaction model
      this._setResponsiveElms();

      // TODO: get rid of this by using the hitch method
      var that = this;

      
      if(this.derive_context){
        this._deriveContext();
      }


      this.ctz=ctz;

      var intentHandler = function(info){

        that.context=info;

        that.filters = that._makeFilterPatterns(info);

        // set the context information to the info (event object that comes from ctz)
        that.intent.apply(that, [info.name]);

      };
      
      // run the intention on initialization to setup any elms that need setting
      intentHandler(this.ctz.info());

      this.ctz.on('change', intentHandler);

      return intentHandler;

    };

    Intention.prototype = {

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



      _deriveContext: function(){


        var setBase = function(elm){

          var attrs = elm.attributes;

          // find any attr w/ a func: data- + (func)

          // of those figure out if there is no base: func + reverse lookback of context

          // of those look to see if there is a attr set: i.e. "class"

          // if we have a definition for "class" -> data-class="whatever" otherwise data-class=""


        };


        for(var i=0; i<this.elms.length; i++){



        }

      },



      _makeInstructions: function(elm){
        
        var attrs=elm.attributes,
          instructions={},
          interaction=this.context.interaction,
          context=this.context.name;


        for(var i=0; i<attrs.length;i++){

          var attr = attrs[i];

          // if the attr is not the current interaction mode, try the next one
          
          if(this.filters.interaction.test(attr.name)){
            continue;
          }

          if(this.filters.context.test(attr.name)){

            // at this point we have a hold on a data attrs that is not of the 
            // current context it may be a base data attr a context attr
            // or a data attr that we are not interested in
            var funcMatch = attr.name.match(this.filters.func);

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

        return instructions;

      },

      _divideSubFuncs: function(func, options){

        var subFuncs = {};

        for(var i=0, l=options.length; i<l; i++){

          // find the specific attr we are manipulating

          // until we come up with a more intelligent algo, i'm just going to
          // take everything after the "func" hence the regex below          

          // this line is ready for some articulation
          var subFuncName = options[i]
                .name.match(new RegExp(func + '-([a-zA-Z\-\_]*$)'))[1];


          if(subFuncs[subFuncName]) {
            subFuncs[subFuncName].push(options[i])
          } else {
            subFuncs[subFuncName] = [options[i]];
          }
        }
    
      },

      _makeFilterPatterns: function(context){
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
        for(var i=0; i<this.ctz.thresholdNames.length;i++) {
          if(this.ctz.thresholdNames[i] !== context.name){
            notContexts+='(' + this.ctz.thresholdNames[i] + ')|'  
          }
        }

        // build the function filter for the regex
        for(var i=0; i<this.funcs.length;i++) {
          funcs+='(' + this.funcs[i] + ')|'  
        }

        for(var i=0; i<this.ctz.interactionModes.length;i++) {
          
          if(this.ctz.interactionModes[i] !== 
              context.interaction){
            notInteractions+='(' + this.ctz.interactionModes[i] + ')|'  
          }
        }

        notInteractions = notInteractions.replace(/\|$/, '');

        notContexts = notContexts.replace(/\|$/, '');

        funcs = funcs.replace(/\|$/, '');

        // these patterns should not be generated for every element,
          // they happen on a per "change" basis

        // pattern is a reverse lookback meaning: match anything that is not [string]
        var patterns = { 
          context: new RegExp('^data-((?!'+ notContexts +').)*$'),
          func: new RegExp(funcs),

          // find the interaction mode we're not in
          // do a reverse lookback regex
          interaction: new RegExp(notInteractions)
        };

        return patterns;

      },


      _findBest: function(func, options){

        // perhaps there's a more efficient way of doing this but naively this seems to work

        // context[mobile] +4, interaction[touch] +2, subfunction[append] +3

        var contextPattern = '';

        for(var i=0; i<this.ctz.thresholdNames.length;i++) {
          contextPattern += this.ctz.thresholdNames[i] + '|';
        }

        contextPattern = contextPattern.replace(/\|$/, '');
        
        var points = [
          {pattern:contextPattern, value:4}, 
          // for the foreseeable future there are not going to be any interaction modes
          // other than touch and mouse, but a dynamic pattern to come from ctz is in order
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
            lastRank=rank;
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
        if(this.elms.length === 0){
          this._setResponsiveElms();
        }
        // go through all of the elms
        for(var i=0; i<this.elms.length; i++){
          var elm = this.elms[i], 
            instructions = this._makeInstructions(elm);

          if(this._isEmpty(instructions)) {
            continue;
          }

          for(var instruction in instructions) {
            if(instructions.hasOwnProperty(instruction)){
              this['_' + instruction](elm, instructions[instruction]);
            }
          }


        }
      },


      _class:function(elm, instruction){

        $(elm).attr('class', this._combine(instruction.options));

        return;
      },

      _attr: function(elm, instruction) {

        for(var attr in instruction.arb){
          if(instruction.arb.hasOwnProperty(attr)){

            var attrVal = this._findBest('attr',instruction.arb[attr]);

            $(elm).attr(attr, attrVal);

          }
        }

        return;

      },

      _move: function(elm, instruction) {

        // find the base
        var choice = this._findBest('move',
              instruction.options),
          moveSelector = choice.value;

        var placementSpec = choice.name.match(new RegExp('move-([a-zA-Z\-\_]*$)'));

        if(placementSpec){
          $(moveSelector)[placementSpec[1]]( elm );
        } else {
          $(moveSelector).append( elm );
        }

      },

      // this supports the base attr functionality
      _union: function(x,y) {

        var obj = {};

        for (var i=x.length-1; i >= 0; --i) {
          obj[x[i]] = x[i];
        }
        for (var i=y.length-1; i >= 0; --i){
          obj[y[i]] = y[i];
        }
         
        var res = [];

        for (var k in obj) {
          if (obj.hasOwnProperty(k)){
            res.push(obj[k]); // <-- optional
          }  
        }
        return res;
      },

      _isEmpty: function(obj){
        for(var prop in obj) {
          if(obj.hasOwnProperty(prop)){ return false; }
        }
        return true;
      },

      update: function(context){

        if(context){
          // in the elms array before adding it
          $(context).find('[data-intention]').each(function(i, elm){
            this.elms.push(elm);
          });

        } else {
          this.elms = $('[data-intention]');
        }
      },

      add: function(){

      },



    };


  return new Intention();

});

