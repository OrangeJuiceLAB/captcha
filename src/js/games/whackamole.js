"use strict"

class AnimatedSprite extends Point{
	constructor(x, y, spritesheet, width, height, numberOfFrames, scaleRatio) {
		super(x, y);

		this.img = new Image();
		this.img.src = spritesheet;

		this.width = width;
		this.height = height;
		this.numberOfFrames = numberOfFrames;
		this.widthOfFrame = this.width
		this.scaleRatio = (scaleRatio) ? scaleRatio : 1;

		this.x = x;
		this.y = y;
		this._frameIndex = 0;
		this.tickIndex = 0;

		return this;
	}

	frameIndex(index){
		this._frameIndex = index;
	}

	draw(ctx) {
		ctx.drawImage(
			this.img,
			this._frameIndex * this.width / this.numberOfFrames,
			0,
			this.width / this.numberOfFrames,
			this.height,
			this.x,
			this.y,
			this.width / this.numberOfFrames * this.scaleRatio,
			this.height  * this.scaleRatio
		);
	}

	_debugImage(ctx){
		ctx.fillStyle = "#FF0000";
		ctx.fillRect (this.x, this.y,this.width / this.numberOfFrames * this.scaleRatio, this.height * this.scaleRatio);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect (this.x + 1, this.y + 1,  (this.width / this.numberOfFrames * this.scaleRatio) -2 , (this.height * this.scaleRatio)-2);
	}
}



class Mole extends AnimatedSprite {
	constructor(x, y, SPRITE_SHEET_PATH){
		var spriteWidth = 2200,
		spriteHeight = 200,
		numberOfFrames = 11,
		scale = 0.5,
		startFrame = 0,
		endFrame = 9
		super(x, y, SPRITE_SHEET_PATH, spriteWidth, spriteHeight, numberOfFrames, scale, startFrame, endFrame);

		this.ticksPerFrame = 4;
		this.tickIndex = 0;
		this.numberOfFrames = numberOfFrames
		this.startFrame = startFrame
		this.endFrame = endFrame
		this.currentFrame = 0;
		this.delay = 50;
		this.setState("ALIVE");
	}

	update(){
		if (this.tickIndex <= this.ticksPerFrame ){
			this.tickIndex++;
		}
		else {
			this.tickIndex = 0;
			this.currentFrame = (this.currentFrame + 1 < this.numberOfFrames && this.currentFrame < this.endFrame) ? this.currentFrame + 1 : this.startFrame;
			this.frameIndex(this.currentFrame);
		}
	}

	isActive(){
		return this._active;
	}

	start(){
		this._active = true;
	}

	stop(){
		this._active = false;
	}

	setState(state){
		this._state = state;
	}

	setDelay(x){
		this.delay = x;
	}

	getState(){
		return this._state;
	}

	resetAnimation(){
		this.frameIndex(0);
		this.setState("ALIVE");
		this.stop();
	}

	showHitAnimation(){
		this.frameIndex(10);
		this.setDelay(20);
		this.tickIndex = 0;
	}

	updateAnimation(ctx){
		this.draw(ctx)
		if(!this.isActive()) return;

		if(this.delay){
			this.delay--;
			return;
		}

		this.update()
	}
}



class WhackAMole extends OJCaptchaMicroGameBase {
	constructor(randomSeed) {
		randomSeed = Math.floor(Math.random()* 9999999999999999999);
		console.log(randomSeed);
		super(randomSeed);
		this.init();
	}


	init(ctx){
		$("canvas").css("cursor", "url(assets/games/whack-a-mole/hammer.cur), none");
		this.moles = [];
		this.ticksWaitedForSpawn = 0;
		this.hits = 0;
		this.mouseClicks = [];
		this.splitter = this.randomSeed.toString().split("");

		var i = 1;
		while (this.moles.length < this.NUMMOLES) this.spawnMole(++i);

		this.currentMole = this.moles[0];
		this.currentMole.start();
	}


	tick(ctx, ms) {
		super.tick(ctx, ms);
		if(this.hammerDelay < 1)$("canvas").css("cursor", "url(assets/games/whack-a-mole/hammer.cur), none");
		else {this.hammerDelay--;}

		if(this.gameWon){
			ctx.font = "50px Verdana";
			ctx.fillStyle = "#000000";
			ctx.fillText("YOU WON!", 70, 200);
		} else if(this.failed){
			ctx.font = "50px Verdana";
			ctx.fillStyle = "#000000";
			ctx.fillText("YOU FAILED!", 40, 200);
		}
		if(this.completed || this.failed)return;

		// Canvas background
		ctx.fillStyle = "#76cf42";
		ctx.fillRect(0, 141, 400, 254);

		// Tick background
		ctx.fillStyle = "#2cc0c7";
		ctx.fillRect(0, 0, 400, 141);

		// Grass
		var imageObj = new Image();
      	imageObj.src = "assets/games/whack-a-mole/grasstop.png";
		ctx.drawImage(imageObj, 0, 95);

		// Title clouds
		var imageObj = new Image();
      	imageObj.src = "assets/games/whack-a-mole/cloud-big.png";
		ctx.drawImage(imageObj, 15, 15);

		// Title text
		ctx.font = "20px Verdana";
		ctx.fillStyle = "#ffffff";
		ctx.fillText("whack the mole!", 40, 60);

		// Tick cloud
		var imageObj = new Image();
      	imageObj.src = "assets/games/whack-a-mole/cloud.png";
		ctx.drawImage(imageObj, 300, 15);

		// Tick text
		ctx.font = "25px Verdana";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(this.ATTEMPTSREMAINING, 325, 49);

		// Tick hammer
		var imageObj = new Image();
      	imageObj.src = "assets/games/whack-a-mole/hammer-ticker.png"; 
		ctx.drawImage(imageObj, 345, 29);

		// console.log(this.HITSREQUIRED);
		// console.log(this.HITS);
		if (this.ATTEMPTSREMAINING === 0 || this.hits === this.HITSREQUIRED) this.finishGame();

		if(this.currentMole._frameIndex === 9 && this.currentMole.tickIndex === this.currentMole.ticksPerFrame){
			this.currentMole.resetAnimation();
			var index = Math.floor(Math.random() * this.moles.length);
			this.currentMole = this.moles[index];
			var delay = Math.floor(Math.random() * (50 - 25) + 25);
			this.currentMole.setDelay(delay);
			this.currentMole.start();
		}

		this.moles.forEach((mole) => mole.updateAnimation(ctx));
	}

	spawnMole(num) {
		var obj, x, y;
		console.log(this.splitter)

		var seed = (parseInt(this.randomSeed) * (num+1)).toString().split("");

		var possibleLocations = [];
		for(var i =0; i < 4; i++){
			for(var j =0; j < 3; j++){
				if(!this.determineObjectOnLocation(i * 100, (j * 100) + 100)) possibleLocations.push({x:i,y:j});
			}
		}

		var loc = possibleLocations[seed.shift()%possibleLocations.length];

		if(!loc) return;
		x = loc.x;
		y = loc.y;

		if (isNaN(y)) debugger;

		obj = this.determineObjectOnLocation(x * 100, (y * 100) + 100);
		if (!obj) {
			this.moles.push(new Mole(x * 100, (y * 100) + 100, this.SPRITE_SHEET_PATH));
			console.log(x, y)
		}
	}

	finishGame(){
		var numberOfMolesHit = 0;
		this.moles.forEach((mole) => {
			mole.stop();
		});

		this.mouseClicks.forEach((mouseClick) => {
			if(mouseClick.hit) numberOfMolesHit++;
		})

		if(numberOfMolesHit >= this.HITSREQUIRED ){
			this.gameWon = true;
		}

		if(numberOfMolesHit < this.HITSREQUIRED && !this.ATTEMPTSREMAINING ){
			this.failed = true;
		}

		// TODO send this.mouseClicks to the server


		console.log(this.mouseClicks)
		this.completed = true;
	}

	determineObjectOnLocation(x, y) {
		var shapeToReturn = null;
		var found = false;
		this.moles.forEach(function(mole) {
			if (found) return null;
			if (x >= mole.x && x <= (mole.x + (mole.width / mole.numberOfFrames * mole.scaleRatio)) && y >= mole.y && y <= (mole.y + mole.height * mole.scaleRatio)) {
				found = true;
				shapeToReturn = mole;
			}
		});
		return shapeToReturn;
	}

	click(x, y) {
		$("canvas").css("cursor", "url(assets/games/whack-a-mole/hammer-hit.cur), none");
		this.hammerDelay=10;
		var object = this.determineObjectOnLocation(x, y);
		var obj = {x: x, y: y};
		this.ATTEMPTSREMAINING--;

		if (object) {
			var index = this.moles.indexOf(object);
			var mole = this.moles[index];
			if(mole.isActive()){
				mole.showHitAnimation();
				mole.setState("DEAD");
				obj.hit = true;
				this.hits++;
			}
		}
		this.mouseClicks.push(obj);
	}
}


WhackAMole.prototype.SPRITE_SHEET_PATH = "assets/games/whack-a-mole/mole-sheet.png";
WhackAMole.prototype.NUMMOLES = 5;
WhackAMole.prototype.HITSREQUIRED = 1;
WhackAMole.prototype.ATTEMPTSREMAINING = 3;

var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([WhackAMole]);
