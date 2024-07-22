 "strict mode";
// check if a number is even
Number.prototype.isEven=function(){
    return this%2===0;
};

Array.prototype.contains = function(item){
    return this.some(function(i){return i === item;});
};

Array.prototype.shuffle = function(){
    for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};

window.game = {
    svgns : "http://www.w3.org/2000/svg",
    ballMiddle : 375,
    balldifference : 150,
    balls:[],

    colors:['red','green','blue','yellow'],
    questions:{'red':'Which one is red?',
	     'green':'Which one is green?',
	     'blue':'Which one is blue?',
	     'yellow':'Which one is yellow?'},
    wrongBallMessage:'You chose the wrong ball, try again.',
    rightBallMessage:'You chose the right ball, well done!',

    applyConfig:function(color,count){
	this.currentColor = color;
	this.ballCount=count;
	this.startGame();
    },
    initConfig:function(element){
	var that = this;//for dialog onClick event
	this.configDialog = $(element).dialog({ autoOpen: false,
						title: 'Game Configuration',
						buttons:{save:function(){
							     var color =$('input[name=color]:checked:radio').val();
							     var count =$('input[name=count]:checked:radio').val();
							     that.applyConfig(color,count);
							     game.configDialog.dialog('close');}},
            		    closeOnEscape:true,
      			    modal:true
			    });
    },
    openConfig:function(){
	$('#color_'+this.currentColor).attr('checked','checked');
	$('#count'+this.ballCount).attr('checked','checked');
	game.configDialog.dialog('open');
    },
    init:function(svg,dialog,configLink,middleText){
	this.svg = svg;
	this.initConfig(dialog);
	this.initTruck();
	this.middleText = middleText;
	this.applyConfig('random',"4");
	this.initBalls(this.colors);
	// Add config link event.
	$(configLink).click(function(){this.openConfig();}.bind(this));
    },
    startGame:function(){
	logger.startLog('game.startGame');
	//clear old game data
	this.clearGame();
	// Initialize current variables
	var colors = this.colors;
	var currentColor = this.currentColor;
	var ballCount = this.ballCount;
	if(ballCount === "random"){
	    ballCount = Math.floor(Math.random()*4)+1;
	}else{
	    ballCount = parseInt(ballCount);
	}
	var currentColors = [];
	//if currentColor is not random, add chosen color to list
	if(currentColor!== 'random'){
	    logger.log('Color is preset. ' + currentColor + ' was added to array.');
	    currentColors.push(currentColor);
	}
	//fill rest of the ball list with random colors
	while(currentColors.length<ballCount){
	    var choosenColor = colors[Math.floor(Math.random()*colors.length)];
	    logger.log(choosenColor + ' is selected as candidate');
	    if(!currentColors.contains(choosenColor)){
		currentColors.push(choosenColor);
		logger.log(choosenColor + ' was added to current ball list.');
	    }
	}
	if(currentColor === 'random'){
	    currentColor = currentColors[0];
	}
	var currentBalls = this.initBalls(currentColors.shuffle());

	this.instance = {
	    "color": currentColor,
	    "count":ballCount,
	    "currentBalls":currentBalls
	};

	this.askQuestion();
	this.startBalls();
	this.truck.moveToMiddle();
	logger.endLog();
	
    },
    clearGame:function(){
	if(typeof this.instance !=="undefined"){
	    var svg = this.svg;
	    this.instance.currentBalls.forEach(function(item){
						   svg.removeChild(item.DOM);
					       });

	    };
    },
    removeAllEvents:function(){
	this.instance.currentBalls.forEach(function(item){
			       item.removeClickHandler();
			   });
    },
    setMiddleText:function(text){
	this.middleText.textContent = text;
    },
    askQuestion:function(){
	this.setMiddleText(this.questions[this.instance.color]);
    }
    

};
			 


window.onload=function(){
    game.init(document.getElementById('svgContainer'),
	      document.getElementById('configDialog'),
	      document.getElementById('configLink'),
	      document.getElementById('svgText'));

    game.startGame();
};