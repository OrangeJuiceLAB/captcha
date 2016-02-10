class OJCaptchaMicroGame_example extends OJCaptchaMicroGameBase { 
  
  constructor(randomSeed){
    super(randomSeed);
	this.fadeInButtons = true;
  }
  
  tick(ctx, ms){
    super.tick(ctx, ms); 
		
	ctx.fillStyle = 'black';
	
    ctx.fillRect(0,0,400,400);
	
	if(this.fadeInButtons){
		this.drawButtons(ctx, Math.min(ms/5000, 1));
	}
  }
  
  getButtonCenter (){
	var lastMouse = this.lastMouse;
	if(!lastMouse) return new Point(200,200);
	return lastMouse;
  }
  
  drawButtons (ctx, pct){
	var center = this.getButtonCenter();
	ctx.beginPath();
	ctx.arc(center.x, center.y, 50, 0, 2 * Math.PI, false);
	ctx.fillStyle = this.rgba(0, 128, 0, pct);
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = this.rgba(0, 255, 0, pct);
	ctx.stroke();
  }
  
  click(x,y){
	
  }
} 

OJCaptchaMicroGame_example.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/explosion17.png";
 
var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_example]); 