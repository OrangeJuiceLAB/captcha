class OJCaptchaMicroGame_game1 extends OJCaptchaMicroGameBase { 
  
  constructor(randomSeed, assets){
    super(randomSeed, assets);
  }
    
  get maxDuration(){
	  return 5000;
  }
  
  get timerProgress(){
	  return Math.min(this._timerProgress || 0,100);
  }
  
  set timerProgress(to){
	  this._timerProgress = to;
  }
  
  get robotStartTopLeft(){
	  
	if(!this._robotStartTopLeft){

		let xMin = 0, xMax = window.CONST.canvasWidth - 200,
			yMin = window.CONST.canvasHeight  *.3, yMax = window.CONST.canvasHeight*0.6,
			xLen = xMax - xMin,
			yLen = yMax - yMin;

		this._robotStartTopLeft = new Point(
			Math.floor(xMin + (xLen * (Number(this.randomSeed.charAt(2)/10)))),
			Math.floor(yMin + (yLen * (Number(this.randomSeed.charAt(4)/10))))
			);
	} 
	
	return this._robotStartTopLeft.clone();
  }
  
  get robotTopLeft(){
	let start = this.robotStartTopLeft,
		targetY = -300,
		yLen = targetY - start.y; 
	
	start.y += (yLen * (this.timerProgress*this.timerProgress));
	
	return start;
  }
  
  get balloonRect(){
	var r = this.robotTopLeft;
	return new Rect(r.x + 40, r.y, 50,65);
  }
  
  get keyState (){
	  var s = Math.floor(this.timerProgress*30%3);
	  console.log("keystate: "+ s);
	  return s;
  }
  
  cloudPositions (){
	  var x1 = -50;
	  var y1 = -500;
	  var yDistance = window.CONST.canvasHeight * this.timerProgress;
	  
	  return [ 
			new Point(x1, y1 + yDistance),
			new Point(x1 + 50, y1 + 300 + yDistance),
			new Point(x1 - 75, y1 + 600+ yDistance),
			
			new Point(x1+ 300, y1 + 100 + yDistance),
			new Point(x1+ 240, y1 + 400 + yDistance),
			new Point(x1+ 300, y1 + 700 + yDistance),
			
	  ]
  }
  
  tick(ctx, ms){
    super.tick(ctx, ms); 
	
	this.timerProgress = ms / this.maxDuration;
		
	//sky
	var grd=ctx.createLinearGradient(0,0,0,400);
	grd.addColorStop(0,"#5db1ff");
	grd.addColorStop(1,"#bcddff");
	ctx.fillStyle=grd;
    ctx.fillRect(0,0,400,400);
		
	//clouds
	var clouds = this.cloudPositions();
	
	var cloud = new Rect(197,84,195,105)
	
	clouds.forEach(function(p){			
		this.drawFromSpriteSheet(
			ctx, 
			OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH,
			cloud,
			new Rect(p.x,p.y, cloud.width, cloud.height)
		);	
	}.bind(this));
	
	  
	this.drawFromSpriteSheet(
		ctx, 
		OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH,
		new Rect(0,0,190,400),
		new Rect(this.robotTopLeft.x,this.robotTopLeft.y,190,400)
	);
	
	var key = new Rect(189,13,45,40);
	
	if(this.keyState === 1) {
		key.x += key.width;
		key.width = 41;
	} else if(this.keyState === 2){
		key.x = 273;
		key.width = 39
	}
	
	var drawKey = new Rect(65 - key.width, 280 - key.height,key.width, key.height).offset(this.robotTopLeft)
	  
	this.drawFromSpriteSheet(
		ctx, 
		OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH,
		key,
		drawKey
	);
	
	
	
  } 
    
  click(x,y){
	//did we click inside the ballon?  
	if(this.balloonRect.contains(new Point(x,y))){
		//hit
		console.log("hit"); 
  
	} else {
		//miss
		console.log("miss");
	}
  }
} 


OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/spritesheet1.png";
 
var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_game1]); 