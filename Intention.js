(function () {

    'use strict';

    var intentionWrapper = function($){

      var Intention = function(params){


        if(params){
          for(var param in params){
            if(params.hasOwnProperty(param)){
              this[param] = params[param];  
            }
          }
        }

        // by default the container is the document
        this._setResponsiveElms(this.container);  
                
        if(this.derive_context){
          this._deriveContext();
        }

        // this part of initialization allows me to externalize the
        // messiness of a regex to arrays that are stored as props of 
        // the intention object. abstraction for clarity, or regexes are
        // regexes
        this._setStaticPatterns();

        var intentHandler = this._hitch(this, function(info){
          
          this.info=info;
          this.filters = this._makeFilterPatterns(info);

          // set the context information to the info (event object that comes from context)
          this.intent(info.name);
        });
        
        // run the intention on initialization to setup any elms that need setting
        intentHandler(this.context.info());

        this.context.on('change', intentHandler);
        
        return intentHandler;

      };

      Intention.prototype = {

        // public props
        container: document,

        derive_context:false,

        // privates
        _funcs: ['move', 'class', 'attr'],
        _placements:['before', 'after', 'prepend', 'append'],
        _attrs: [
          'src',
          'href',
          'dir',
          'lang',
          'xml:lang',
          'accesskey',
          'align',
          'background',
          'bgcolor',
          'class',
          'contenteditable',
          'contextmenu',
          'draggable',
          'height',
          'hidden',
          'id',
          'item',
          'itemprop',
          'spellcheck',
          'style',
          'subject',
          'tabindex',
          'title',
          'valign',
          'width'],

        _staticPatterns: {},

        _setStaticPatterns: function(){

          var patterns = ['funcs', 'attrs', 'placements'];

          for(var i=0; i<patterns.length; i++){
            this._staticPatterns[patterns[i]] = 
              this._listToPattern(this['_' + patterns[i]])
          }

        },

        _listToPattern: function(list){

          // this function takes the above list and converts it into a pattern
          // for use with the intentional attrs
          var pattern='';

          for(var i=0; i<list.length; i++) {
            pattern+= list[i] + '|'; 
          }

          return pattern.replace(/\|$/, '');

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
            interaction=this.info.interaction,
            context=this.info.name;

          
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

        _makeFilterPatterns: function(context){

          // to keep things clear for myself and for those that may look at this code
          // i am breaking the task of matching relevant attrs into two regexes
          // this also gives the added benefit of allowing me on the second pass
          // to extract the function string and create the instruction object right there
          var notContexts = '',
            notInteractions = '';
          // looking for the context or the interaction or the function NO ORDER
          
          // build the context filter for the regex
          for(var i=0; i<this.context.thresholdNames.length;i++) {
            if(this.context.thresholdNames[i] !== context.name){
              notContexts+='(' + this.context.thresholdNames[i] + ')|'  
            }
          }

          for(var i=0; i<this.context.interactionModes.length;i++) {
            
            if(this.context.interactionModes[i] !== 
                context.interaction){
              notInteractions+='(' + this.context.interactionModes[i] + ')|'  
            }
          }

          notInteractions = notInteractions.replace(/\|$/, '');

          notContexts = notContexts.replace(/\|$/, '');

          // these patterns should not be generated for every element,
            // they happen on a per "change" basis

          // pattern is a reverse lookback meaning: match anything that is not [string]
          var patterns = { 
            context: new RegExp('^data-((?!'+ notContexts +').)*$'),
            func: new RegExp(this._staticPatterns.funcs),

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

          for(var i=0; i<this.context.thresholdNames.length;i++) {
            contextPattern += this.context.thresholdNames[i] + '|';
          }

          contextPattern = contextPattern.replace(/\|$/, '');
          
          var points = [
            {pattern:contextPattern, value:4}, 
            // for the foreseeable future there are not going to be any interaction modes
            // other than touch and mouse, but a dynamic pattern to come from context is in order
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

        _setResponsiveElms: function(context){

          if(context){
            // in the elms array before adding it
            this.elms = $('[data-intention]', context);

            var itnAttr = $(context).attr('data-intention');

            if((itnAttr !== false) && (itnAttr !== undefined)){
              this.elms.push(context);
            }

          } else {
            this.elms = $('[data-intention]');
          }

          
        },


        _class:function(elm, instruction){

          $(elm).attr('class', this._combine(instruction.options));

          return;
        },


        _attr: function(elm, instruction) {

          var attrs = this._divideAttrs(instruction.options);

          for(var attr in attrs){
            if(attrs.hasOwnProperty(attr) ){
              var attrVal = this._findBest('attr', attrs[attr]).value;
              $(elm).attr(attr, attrVal);
            }
          }

          return;

        },

        _move: function(elm, instruction) {

          // find the base
          var choice = this._findBest('move', instruction.options),
            moveSelector = choice.value;

          var placementSpec = choice.name.match(new RegExp('move-('+ 
                this._staticPatterns.placements + '$)'));

          if(placementSpec){
            $(moveSelector)[placementSpec[1]]( elm );
          } else {
            $(moveSelector).append( elm );
          }

        },

        _divideAttrs: function(options){

          var attrs = {};

          for(var i=0, l=options.length; i<l; i++){

            // find the specific attr we are manipulating

            // until we come up with a more intelligent algo, i'm just going to
            // take everything after the "func" hence the regex below          

            // this line is ready for some articulation
            var attrName = options[i]
                  .name.match(new RegExp('attr' + '-('+ this._staticPatterns.attrs +'$)'))[1];

            if(attrs[attrName]) {
              attrs[attrName].push(options[i])
            } else {
              attrs[attrName] = [options[i]];
            }
          }

          return attrs;
      
        },

        _hitch: function(scope,fn){
            return function(){
              return fn.apply(scope, arguments); 
            };
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


        // public methods
        intent: function(context){
          
          // get the context name if a number is passed??
          // if(typeof context === 'number'){}
          
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

        addFrom: function(context){
          if(context){
            // in the elms array before adding it
            $('[data-intention]', context).each(
              this._hitch(this, function(i, elm){
                this.elms.push(elm);
            }));
            return;
          } 
          // TODO: throw error?

        },

        add: function(elm){
          this.elms.push(elm);
        },

        remove: function(elm){
          $.each(this.elms, this._hitch(this, function(i, candidate){
            if(elm === candidate){
              this.elms.splice(i, 1);
              return false;
            }
          }));
        }
      };

      return Intention;

    };

    if ( typeof define === "function" && define.amd ) {
      define( "Intention", ['jquery'], intentionWrapper );
    } else {

      if(!window.jQuery) {
        throw('jQuery is not defined!!');
      }

      window.Intention = intentionWrapper(jQuery);
    }

})();
