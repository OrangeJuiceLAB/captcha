class OJCaptchaMicroGame_example extends OJCaptchaMicroGameBase { 
  
  constructor(randomSeed, assets){
    super(randomSeed, assets);
	this.fadeInButtons = true;
  }
  
  getNextexplosionFrame(){
	 if(this._explosionFrame === undefined) this._explosionFrame = -1;
	 this._explosionFrame = (++this._explosionFrame)%(5*5);
	 return this._explosionFrame;
  }
  
  tick(ctx, ms){
    super.tick(ctx, ms); 
		
	ctx.fillStyle = 'black';
	
    ctx.fillRect(0,0,400,400);
		
	var center = this.lastMouse || new Point(200,200);
	if(!center) center = new Point(200)
	
	center.x -= 50;
	center.y -= 50;
	
	this.drawFromSpriteFrame(
		ctx, 
		OJCaptchaMicroGame_example.prototype.SPRITE_SHEET_PATH,
		5,
		5,
		this.getNextexplosionFrame(), 
		center.x, 
		center.y,
		100,
		100);
  }
    
  click(x,y){
	
  }
} 

OJCaptchaMicroGame_example.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/explosion17.png";
 
 /*
var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_example]); 
*/