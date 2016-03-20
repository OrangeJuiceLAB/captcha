

class OJBase {
  
  constructor(){
    
  }
  
}

window.CONST = {
	canvasWidth : 400,
	canvasHeight : 400
}

class Point extends OJBase {
	constructor(x,y){
		super();
		this._x = x;
		this._y = y;
	}
	
	get isPoint(){
		return true;
	}
	
	get x(){
		return this._x;
	}
	
	set x(to){
		this._x = to;
	}
	
	get y(){
		return this._y; 
	}
	
	set y(to){
		this._y = to;
	}
	
	offset(x,y){
		if(x.isPoint) {
			this.x += x.x;
			this.y += x.y;
		} else { 
			this.x += x;
			this.y += y;
		}
		return this;
	}
	
	clone(){
		return new Point(this.x, this.y);
	}
}

class Rect extends Point {
	constructor(x,y,width,height){
		super(x,y);
		this._width = width;
		this._height = height;
	}
	
	get width() {
		return this._width;
	}
	
	set width(to){
		this._width = to;
	}
	
	get height(){
		return this._height;
	}
	
	set height(to){
		this._height = to;
	}
	
	
	contains(p){		
		return (p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height);
	}
	
	clone(){
		return new Rect(this.x, this.y, this.width, this.height);
	}
}

class OJCaptchaBase extends OJBase {
  constructor(){
    super();
  }
} 

class OJCaptchaContainer extends OJCaptchaBase {
  constructor($src){
    super();
    this._$src = $src;
	this.imageAssets = [];
  }
  
  get $src(){
    return this._$src; 
  }
  
  get activeGame(){
    if(!this._activeGame){
		
	  //create a 16 char randomSeed
	  this._activeSeed = _.times(16, () => _.random(0,9)).join("");
	  
	  //start the active game
      this._activeGame = new this._gamesQueue[0](this._activeSeed, this.imageAssets);
    }
    
    return this._activeGame;
  }
  
  init(gamesArr){
	  
    this._gamesQueue = gamesArr;
	
	this.loadAssets()
		.then(this.start.bind(this));
  }
  
  loadAssets(){
		console.log("loadAssets");
	  //get spritesheets from game classes
	   _.forEach(this._gamesQueue, (g) => {
		  let url = g.prototype.SPRITE_SHEET_PATH;
		  console.log("load : " + url);
		  if(url && !(url in this.imageAssets)){
			  this.imageAssets.push({ url , image : new Image()});
		  }
	  }, this);

	  //load single spritesheet image
	  let loadSpriteSheet = (spriteSheet) => {
		return new Promise((resolve, reject) => {
			spriteSheet.image.onload = () => {
				spriteSheet.complete = true;
				spriteSheet.width = spriteSheet.image.naturalWidth;
				spriteSheet.height = spriteSheet.image.naturalHeight;
				resolve();
			}
			spriteSheet.image.src = spriteSheet.url;
		});
	  }
	  
	  //recursive closure that loads all spreadsheets from queue
	  let loader = function(resolve, reject){
		let next = _.find(this.imageAssets, a => !a.complete);
		if(!next) return resolve();
		loadSpriteSheet(next).then( () => loader(resolve,reject));
	  }.bind(this);
	  
	  return new Promise(loader);
  }
  
  build(){
    this.isBuild = true;
    this.$canvas = $("<canvas width='400' height='400'></canvas>");
	this.$canvas.mousemove(this.mousemove.bind(this));
	this.$canvas.click(this.canvasclick.bind(this));
    this.ctx = this.$canvas[0].getContext("2d");
    this._$src.append(this.$canvas); 
  }
  
  start(){
	  console.log("assets loaded");
    if(!this.isBuilt) this.build();
    //tick
	this._startTime = performance.now();
    window.requestAnimationFrame(this.tick.bind(this));  
  }
  
  tick(timeStamp){
    this.activeGame.tick(this.ctx, timeStamp - this._startTime);
    window.requestAnimationFrame(this.tick.bind(this));
  }
  
  canvasclick(evt){
	if(this.activeGame) this.activeGame.click(evt.offsetX, evt.offsetY);  
  }
  
  mousemove(evt){
	if(this.activeGame) this.activeGame.mouseMove(evt.offsetX, evt.offsetY);
  }
  
}

class OJCaptchaMicroGameBase extends OJCaptchaBase {
	
  constructor(randomSeed, assets){
    super();
    this._randomSeed = randomSeed;
	this._assets = assets;
	this._frames = {};
  }
  
  get randomSeed(){
    return this._randomSeed;
  }
  
  rgba(r,g,b,a){
	  return "rgba(" + r +", " + g + ", " + b + ", " + a +")";
  }
  
  tick(ctx, ms){
    
  } 
  
  click(x,y){
	 
  }
  
  solve(){
	  
  }
  
  getAsset(name){
	return _.find(this._assets, a => a.url == name);
  }
  
  drawFromSpriteFrame(ctx, name, numFramesW, numFramesH, frameIndex, targetX, targetY, targetW, targetH){
	let asset = this.getAsset(name),
		frameW = asset.width / numFramesW,
		frameH = asset.height / numFramesH, 
		frameY = Math.floor(frameIndex / numFramesW),
		frameX = frameIndex - (frameY * numFramesW);
		
	ctx.drawImage(asset.image, frameX * frameW, frameY * frameH, frameW, frameH, targetX, targetY, targetW, targetH);
  }
  
  drawFromSpriteSheet(ctx, name, srcRect, targetRect){
	  let asset = this.getAsset(name);
	  ctx.drawImage(asset.image, srcRect.x, srcRect.y, srcRect.width, srcRect.height, targetRect.x, targetRect.y, targetRect.width, targetRect.height);
	  return this;
  }
  
  mouseMove(x,y){
	this._lastMouse = new Point(x,y);
  }
  
  get lastMouse() {
	  if(!this._lastMouse) return null;
	  return this._lastMouse.clone();
  }
  
}	