class OJCaptchaMicroGame_game2 extends OJCaptchaMicroGameBase { 
  
	constructor(randomSeed, assets){
		super(randomSeed, assets);
	}
    
	get maxDuration(){
		return 5000;
	}
	
	get keyTurnMax(){
		return parseInt((this.randomSeed + "").charAt(6));
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
	
	get keyTurnCount(){
		return this._keyTurnCount || 0;
	}
	
	get robotArmRotationDEG(){
		if(!this._inserted) return -90;
		else return 180 + ( 10 * this.keyTurnCount);
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
		var robotDrawRect = new Rect(x,y, cutOut.width * scale, cutOut.height * scale);
		
		//draw arm 
		var armCutout = this.armSpriteSheetRect;
	 
		var offset = new Point(robotDrawRect.x, robotDrawRect.y);
		
		ctx.save();
		
		
		ctx.translate(x+(10*scale), y+(176*scale)); 
				
		ctx.rotate(this.robotArmRotationDEG * (Math.PI/180));
		
		this.drawFromSpriteSheet(
			ctx, 
			OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH,
			armCutout,
			//new Rect(-100,-100,armCutout.width, armCutout.height)
			new Rect(-armCutout.width/2*scale, -(armCutout.height*scale), armCutout.width * scale, armCutout.height *scale)
		);	 	
		
		ctx.restore();
		 
		//draw robot on top
		this.drawFromSpriteSheet(
				ctx, 
				OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH,
				cutOut,
				robotDrawRect
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
	
	get armSpriteSheetRect(){
		return new Rect(
			362,
			0,
			45,
			171
		);
	}
	
	get arrowSpriteSheetRect(){
		return new Rect(362,229,129,98);
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
		
		this.keyTurnUpdate();
		
		
		this.draw(ctx, ms);
		
	} 
	
	draw(ctx,ms){
		
		if(this.zoomProgress >= 1) {
			this.drawKey(ctx);
		}
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
		
		
		//zoom complete, draw key
		if(this.zoomProgress >= 1) {
			this.drawArrow(ctx,ms);
		}
	}
	
	getKeyRect(frame){
		
		if(!this._keyRectFramesCache) {
			this._keyRectFramesCache =  [
				new Rect(407,0,84,74),
				new Rect(407,74,84,68),
				new Rect(407,141,84,41),
				new Rect(407,182,84,27),
				new Rect(407,209,84,19)			
			]
		}
		return this._keyRectFramesCache[frame === undefined ?this.drawKeyFrame : frame];
	}
	
	get drawKeyFrame(){
		if(!this._keyTurning) return 0;
		
		var val = Math.min(8, Math.max(0,Math.round( 8 * this._keyTurning.pct)));
		
		var frame = val < 5 ? val : 4 - Math.max(0, val - 4);
		
		return frame;
		 
	}
	
	get drawKeyRect(){
		var basePos = this.keyBasePos;
		var scale = this.robotZoomData.scale;
		var frameRect = this.getKeyRect(this.drawKeyFrame);
		if(!frameRect) debugger;
		var drawRect = new Rect(basePos.x, basePos.y, frameRect.width * scale, frameRect.height * scale);
		
		drawRect.x -= drawRect.width;
		drawRect.y -= drawRect.height /2;
		
		drawRect.x += this.getInsertOffset();		
	
		return drawRect;
	}
	
	drawKey(ctx){
		
		var frameRect = this.getKeyRect(this.drawKeyFrame);
		
		this.drawFromSpriteSheet(
			ctx, 
			OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH,
			frameRect,
			this.drawKeyRect
		);	
	}
	
	getInsertOffset() {
		if(this._inserted) return 30;
		if(this._insertMouseDown){
			var num = Math.max(-100, Math.min(30, this.lastMouse.x - this._mouseDown.x -100));
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
	
	keyTurningCenter(){
		if(!this._keyTurning) return false; 
		return this._mouseDown.clone().offset(-50,0);
	}
	
	keyTurnUpdate(){
		if(!this._keyTurning) return;
		//the percentage of completeness of the turning of the key		
		this._keyTurning.pct = Math.min(1, Math.max(0,(this.lastMouse.y - this._keyTurning.start.y)/ ( this._keyTurning.end.y - this._keyTurning.start.y )));
		
		if(this._keyTurning.pct >= 1){
			this.keyTurnComplete();
		}
		
	}
	
	keyTurnComplete(){
		if(!this._keyTurnCount) this._keyTurnCount = 0;
		++this._keyTurnCount;
		this._turnKeySolve += (this.randomSeed * this._keyTurnCount + "");
		this.mouseup();
		
		if(this._keyTurnCount >= this.keyTurnMax) this.complete();
	}
	
	//arrow
	drawArrow(ctx, ms){
		
		var src = this.arrowSpriteSheetRect;
		var keyRect = this.drawKeyRect;
		 
		var animationDuration = 700;
		var animationProgress = (ms % animationDuration / animationDuration);
		var animationLoop = animationProgress <= 0.5 ? animationProgress : 0.5 - Math.max(0, animationProgress - 0.5);
		var scale =  (0.55 + (0.1 * animationLoop));
		
		
		if(!this._inserted){
			//draw right next to the key
			
			if(this._mouseDown) return;
			
			var height = src.height * scale;
			
			this.drawFromSpriteSheet(
				ctx, 
				OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH,
				src, 
				new Rect(keyRect.right + (animationLoop * 50), keyRect.y + ((keyRect.height - height)/2), src.width * scale, height) 
			);	
			
		} else {
			
			var height = src.height * scale;
			var width = src.width * scale;
			var x = keyRect.x - width /2;
			var y = keyRect.y + ( keyRect.height /2 )
			
			ctx.save();
			
			ctx.translate(x,y);
			ctx.rotate(90 * (Math.PI/180)); 
			
			this.drawFromSpriteSheet(
				ctx, 
				OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH,
				src, 
				new Rect(-width/2,-height/2, width, height) 
			);	
			 
			ctx.restore();
		} 
	}	
	mousedown(x,y){
		///console.log("mouse down: "+ x + ", " + y + ", distance: "+ this.keyBasePos.distanceTo(new Point(x,y)))
		//distance to basepos
		this._mouseDown = new Point(x,y);
		
		this._insertMouseDown = false;
		this._keyTurning = false;
		
		if(!this._inserted){ 
			if(this.drawKeyRect.contains(new Point(x,y))){ //this.keyBasePos.distanceTo(new Point(x-this.getInsertOffset(),y)) < 50){ 
				this._insertMouseDown = true;
				this._insertMouseY = y;
				this._insertMouseX = x;
			}
		} else {
			
			//key is inserted, swipe it down a couple of time to turn
			var targetRect = this.drawKeyRect;
			
			if(Math.abs(targetRect.y - y) < 50){
				this._keyTurning = {
					start : new Point(x,y), 
					end :new Point(x,y + 75),
					pct : 0
				}
			}
			
			
		}
	}
	 
	mouseup(){
		if(this.getInsertOffset() > 20) {
			this._inserted = true;
		}
		
		this._insertMouseDown = false;
		this._keyTurning = false;
		this._mouseDown = false;
	}
	  
	complete(){
		this.solve(this._insertMouseX + "_" + this._insertMouseY + "_" + this._turnKeySolve);
	}
	
 
	click(x,y){
		
	}
	
} 


OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/game_spritesheet_2.png";
 
var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_game2]); 