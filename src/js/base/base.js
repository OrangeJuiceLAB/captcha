class OJBase {
  
  constructor(){
    
  }
  
}

class Point {
	constructor(x,y){
		this._x = x;
		this._y = y;
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
  }
  
  get $src(){
    return this._$src; 
  }
  
  get activeGame(){
    if(!this._activeGame){
		
	  //create a 16 char randomSeed
	  this._activeSeed = _.times(16, _.random(0,9)).join("");
	  
	  //start the active game
      this._activeGame = new this._gamesQueue[0](this._activeSeed);
    }
    
    return this._activeGame;
  }
  
  init(gamesArr){
    this._gamesQueue = gamesArr;
    this.start();
  }
  
  build(){
    this.isBuild = true;
    this.$canvas = $("<canvas width='400' height='400'></canvas>");
	this.$canvas.mousemove(this.mousemove.bind(this));
    this.ctx = this.$canvas[0].getContext("2d");
    this._$src.append(this.$canvas); 
  }
  
  start(){
    if(!this.isBuilt) this.build();
    //tick
	this._startTime = performance.now();
    window.requestAnimationFrame(this.tick.bind(this));  
  }
  
  tick(timeStamp){
    this.activeGame.tick(this.ctx, timeStamp - this._startTime);
    window.requestAnimationFrame(this.tick.bind(this));
  }
  
  mousemove(evt){
	if(this.activeGame) this.activeGame.mouseMove(evt.offsetX, evt.offsetY);
  }
  
}

class OJCaptchaMicroGameBase extends OJCaptchaBase {
	
  constructor(randomSeed){
    super();
    this._randomSeed = randomSeed;
  }
  
  get randomSeed(){
    return this._randomSeed;
  }
  
  rgba(r,g,b,a){
	  return "rgba(" + r +", " + g + ", " + b + ", " + a +")";
  }
  
  tick(ctx, ms){
    
  }
  
  mouseMove(x,y){
	this._lastMouse = new Point(x,y);
  }
  
  get lastMouse() {
	  return this._lastMouse;
  }
  
}