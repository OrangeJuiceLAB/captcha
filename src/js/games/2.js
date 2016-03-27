class OJCaptchaMicroGame_game2 extends OJCaptchaMicroGameBase { 
  
	constructor(randomSeed, assets){
		super(randomSeed, assets);
	}
    
	get maxDuration(){
		return 5000;
	}
	
	get windSide(){
		if(!this._side) this._side = parseInt((this.randomSeed + "").charAt(2)) < 5 ? "left" : "right";
		return this._side;
	}
  
	get timerProgress(){
		return Math.min(this._timerProgress || 0,100);
	}
  
	set timerProgress(to){
		this._timerProgress = to;
	}
	
	get zoomProgress(){
		return Math.min(1,this._timerProgress / 0.2);
	}
	
	get keyBasePos(){
		var robot = this.robotZoomData;
		return new Point(
			robot.x + 121,
			robot.y + 350);
	}
  
	get state(){
		
		return "zooming";
		
		if(this.zoomProgress < 1){
			return "zooming";
		} 
		if(!this._inserted) return "inserting";
		return "winding";
	}
	
	get robotSpriteSheetRect(){
		return new Rect(0,0,358,526);
	}
	
	drawRobot(ctx,x,y,scale){
		var cutOut = this.robotSpriteSheetRect;
		
		this.drawFromSpriteSheet(
				ctx, 
				OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH,
				cutOut,
				new Rect(x,y, cutOut.width * scale, cutOut.height * scale)
			);	
		return this;
	}
	
	
	get robotZoomData(){
		if(!this._robotZoomData){
			this._robotZoomData = { 
				x: 100,
				y: -50,
				scale : 1.2
			}
		}	
		return this._robotZoomData;
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
		
		this.draw(ctx);
		
	} 
	
	draw(ctx){
		
		//zoom complete, draw key
		if(this.zoomProgress >= 1) this.drawKey(ctx);
		
		//draw robot
		var center = new Point(window.CONST.CANVAS_WIDTH /2, window.CONST.CANVAS_HEIGHT /2); 
		
		var canvas = new Rect(0,0,window.CONST.CANVAS_WIDTH, window.CONST.CANVAS_HEIGHT); 
		
		var robotRect = this.robotSpriteSheetRect;
		
		var initialScale = 0.4;
		
		robotRect.width *= initialScale;
		robotRect.height *= initialScale; 
		
		var robotStartRect = new Rect( ( canvas.width - robotRect.width) * .5, (canvas.height - robotRect.height), robotRect.width, robotRect.height);
		
		var robotEnd = this.robotZoomData; 
		
		var topLeft = new Point(robotStartRect.x, robotStartRect.y).interpolate(new Point(robotEnd.x, robotEnd.y), this.zoomProgress);
		
		this.drawRobot(ctx, topLeft.x, topLeft.y, robotEnd.scale * this.zoomProgress);
		
	}
	
	getKeyRect(frame){
		return new Rect(407,0,84,74);
	}
	
	drawKey(ctx){
		
		var basePos = this.keyBasePos;
		var scale = this.robotZoomData.scale;
		var frameRect = this.getKeyRect(0);
		var drawRect = new Rect(basePos.x, basePos.y, frameRect.width * scale, frameRect.height * scale);
		
		drawRect.x -= drawRect.width;
		drawRect.y -= drawRect.height /2;
		
		drawRect.x += this.getInsertOffset();
		
	
		this.drawFromSpriteSheet(
			ctx, 
			OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH,
			frameRect,
			drawRect
		);	
	}
	
	getInsertOffset() {
		if(this._inserted) return 30;
		if(this._insertMouseDown){
			var num = Math.max(-100, Math.min(30, this.lastMouse.x - this._insertMouseDownX -100));
			console.log(num);
			return num; 
		} else {
			return -100;
		}
	}
	
	drawKey_inserting(ctx){
		
		//this.drawKey(ctx, basePos.x, basePos.y, 0)
	}
	
	drawKey_winding(ctx){
		
	}
	
	mousedown(x,y){
		///console.log("mouse down: "+ x + ", " + y + ", distance: "+ this.keyBasePos.distanceTo(new Point(x,y)))
		//distance to basepos
		if(this.keyBasePos.distanceTo(new Point(x-this.getInsertOffset(),y)) < 100){
			this._insertMouseDown = true;
			this._insertMouseDownX = x;
		} else {
			this._insertMouseDown = false;
		}
	}
	 
	mouseup(){
		if(this.getInsertOffset() > 20) {
			this._inserted = true;
		}
		this._insertMouseDown = false;
	}
	  
	complete(){
		
	}
	
 
	click(x,y){
		
	}
	
} 


OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/game_spritesheet_2.png";
 
var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_game2]); 