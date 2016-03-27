"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OJBase = function OJBase() {
	_classCallCheck(this, OJBase);
};

window.CONST = {
	CANVAS_WIDTH: 400,
	CANVAS_HEIGHT: 400
};

var Point = function (_OJBase) {
	_inherits(Point, _OJBase);

	function Point(x, y) {
		_classCallCheck(this, Point);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Point).call(this));

		_this._x = x;
		_this._y = y;
		return _this;
	}

	_createClass(Point, [{
		key: "interpolate",
		value: function interpolate(to, frac) {
			return new Point(this.x + (to.x - this.x) * frac, this.y + (to.y - this.y) * frac);
		}
	}, {
		key: "offset",
		value: function offset(x, y) {
			if (x.isPoint) {
				this.x += x.x;
				this.y += x.y;
			} else {
				this.x += x;
				this.y += y;
			}
			return this;
		}
	}, {
		key: "distanceTo",
		value: function distanceTo(p2) {
			return Math.sqrt(Math.pow(this.x - p2.x, 2) + Math.pow(this.y - p2.y, 2));
		}
	}, {
		key: "clone",
		value: function clone() {
			return new Point(this.x, this.y);
		}
	}, {
		key: "isPoint",
		get: function get() {
			return true;
		}
	}, {
		key: "x",
		get: function get() {
			return this._x;
		},
		set: function set(to) {
			this._x = to;
		}
	}, {
		key: "y",
		get: function get() {
			return this._y;
		},
		set: function set(to) {
			this._y = to;
		}
	}]);

	return Point;
}(OJBase);

var Rect = function (_Point) {
	_inherits(Rect, _Point);

	function Rect(x, y, width, height) {
		_classCallCheck(this, Rect);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Rect).call(this, x, y));

		_this2._width = width;
		_this2._height = height;
		return _this2;
	}

	_createClass(Rect, [{
		key: "contains",
		value: function contains(p) {
			return p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height;
		}
	}, {
		key: "clone",
		value: function clone() {
			return new Rect(this.x, this.y, this.width, this.height);
		}
	}, {
		key: "width",
		get: function get() {
			return this._width;
		},
		set: function set(to) {
			this._width = to;
		}
	}, {
		key: "height",
		get: function get() {
			return this._height;
		},
		set: function set(to) {
			this._height = to;
		}
	}]);

	return Rect;
}(Point);

var OJCaptchaBase = function (_OJBase2) {
	_inherits(OJCaptchaBase, _OJBase2);

	function OJCaptchaBase() {
		_classCallCheck(this, OJCaptchaBase);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaBase).call(this));
	}

	return OJCaptchaBase;
}(OJBase);

var OJCaptchaContainer = function (_OJCaptchaBase) {
	_inherits(OJCaptchaContainer, _OJCaptchaBase);

	function OJCaptchaContainer($src) {
		_classCallCheck(this, OJCaptchaContainer);

		var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaContainer).call(this));

		_this4._$src = $src;
		_this4.imageAssets = [];
		return _this4;
	}

	_createClass(OJCaptchaContainer, [{
		key: "init",
		value: function init(gamesArr) {

			this._gamesQueue = gamesArr;

			this.loadAssets().then(this.start.bind(this));
		}
	}, {
		key: "loadAssets",
		value: function loadAssets() {
			var _this5 = this;

			console.log("loadAssets");
			//get spritesheets from game classes
			_.forEach(this._gamesQueue, function (g) {
				var url = g.prototype.SPRITE_SHEET_PATH;
				console.log("load : " + url);
				if (url && !(url in _this5.imageAssets)) {
					_this5.imageAssets.push({ url: url, image: new Image() });
				}
			}, this);

			//load single spritesheet image
			var loadSpriteSheet = function loadSpriteSheet(spriteSheet) {
				return new Promise(function (resolve, reject) {
					spriteSheet.image.onload = function () {
						spriteSheet.complete = true;
						spriteSheet.width = spriteSheet.image.naturalWidth;
						spriteSheet.height = spriteSheet.image.naturalHeight;
						resolve();
					};
					spriteSheet.image.src = spriteSheet.url;
				});
			};

			//recursive closure that loads all spreadsheets from queue
			var loader = function (resolve, reject) {
				var next = _.find(this.imageAssets, function (a) {
					return !a.complete;
				});
				if (!next) return resolve();
				loadSpriteSheet(next).then(function () {
					return loader(resolve, reject);
				});
			}.bind(this);

			return new Promise(loader);
		}
	}, {
		key: "build",
		value: function build() {
			this.isBuild = true;
			this.$canvas = $("<canvas width='400' height='400'></canvas>");
			this.$canvas.mousemove(this.mousemove.bind(this));
			this.$canvas.mousedown(this.mousedown.bind(this));
			this.$canvas.mouseup(this.mouseup.bind(this));
			this.$canvas.click(this.canvasclick.bind(this));
			this.ctx = this.$canvas[0].getContext("2d");
			this._$src.append(this.$canvas);
		}
	}, {
		key: "start",
		value: function start() {
			console.log("assets loaded");
			if (!this.isBuilt) this.build();
			//tick
			this._startTime = performance.now();
			window.requestAnimationFrame(this.tick.bind(this));
		}
	}, {
		key: "tick",
		value: function tick(timeStamp) {
			this.activeGame.tick(this.ctx, timeStamp - this._startTime);
			window.requestAnimationFrame(this.tick.bind(this));
		}
	}, {
		key: "canvasclick",
		value: function canvasclick(evt) {
			if (this.activeGame) this.activeGame.click(evt.offsetX, evt.offsetY);
		}
	}, {
		key: "mousemove",
		value: function mousemove(evt) {
			if (this.activeGame) this.activeGame.mouseMove(evt.offsetX, evt.offsetY);
		}
	}, {
		key: "mousedown",
		value: function mousedown(evt) {
			if (this.activeGame) this.activeGame.mousedown(evt.offsetX, evt.offsetY);
		}
	}, {
		key: "mouseup",
		value: function mouseup(evt) {
			if (this.activeGame) this.activeGame.mouseup(evt.offsetX, evt.offsetY);
		}
	}, {
		key: "$src",
		get: function get() {
			return this._$src;
		}
	}, {
		key: "activeGame",
		get: function get() {
			if (!this._activeGame) {

				//create a 16 char randomSeed
				this._activeSeed = _.times(16, function () {
					return _.random(0, 9);
				}).join("");

				//start the active game
				this._activeGame = new this._gamesQueue[0](this._activeSeed, this.imageAssets);
			}

			return this._activeGame;
		}
	}]);

	return OJCaptchaContainer;
}(OJCaptchaBase);

var OJCaptchaMicroGameBase = function (_OJCaptchaBase2) {
	_inherits(OJCaptchaMicroGameBase, _OJCaptchaBase2);

	function OJCaptchaMicroGameBase(randomSeed, assets) {
		_classCallCheck(this, OJCaptchaMicroGameBase);

		var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaMicroGameBase).call(this));

		_this6._randomSeed = randomSeed;
		_this6._assets = assets;
		_this6._frames = {};
		return _this6;
	}

	_createClass(OJCaptchaMicroGameBase, [{
		key: "rgba",
		value: function rgba(r, g, b, a) {
			return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
		}
	}, {
		key: "tick",
		value: function tick(ctx, ms) {}
	}, {
		key: "click",
		value: function click(x, y) {}
	}, {
		key: "solve",
		value: function solve() {}
	}, {
		key: "getAsset",
		value: function getAsset(name) {
			return _.find(this._assets, function (a) {
				return a.url == name;
			});
		}
	}, {
		key: "drawFromSpriteFrame",
		value: function drawFromSpriteFrame(ctx, name, numFramesW, numFramesH, frameIndex, targetX, targetY, targetW, targetH) {
			var asset = this.getAsset(name),
			    frameW = asset.width / numFramesW,
			    frameH = asset.height / numFramesH,
			    frameY = Math.floor(frameIndex / numFramesW),
			    frameX = frameIndex - frameY * numFramesW;

			ctx.drawImage(asset.image, frameX * frameW, frameY * frameH, frameW, frameH, targetX, targetY, targetW, targetH);
		}
	}, {
		key: "drawFromSpriteSheet",
		value: function drawFromSpriteSheet(ctx, name, srcRect, targetRect) {
			var asset = this.getAsset(name);
			ctx.drawImage(asset.image, srcRect.x, srcRect.y, srcRect.width, srcRect.height, targetRect.x, targetRect.y, targetRect.width, targetRect.height);
			return this;
		}
	}, {
		key: "mousedown",
		value: function mousedown(x, y) {}
	}, {
		key: "mouseup",
		value: function mouseup(x, y) {}
	}, {
		key: "mouseMove",
		value: function mouseMove(x, y) {
			this._lastMouse = new Point(x, y);
		}
	}, {
		key: "randomSeed",
		get: function get() {
			return this._randomSeed;
		}
	}, {
		key: "lastMouse",
		get: function get() {
			if (!this._lastMouse) return null;
			return this._lastMouse.clone();
		}
	}]);

	return OJCaptchaMicroGameBase;
}(OJCaptchaBase);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OJCaptchaMicroGame_game1 = function (_OJCaptchaMicroGameBa) {
	_inherits(OJCaptchaMicroGame_game1, _OJCaptchaMicroGameBa);

	function OJCaptchaMicroGame_game1(randomSeed, assets) {
		_classCallCheck(this, OJCaptchaMicroGame_game1);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaMicroGame_game1).call(this, randomSeed, assets));
	}

	_createClass(OJCaptchaMicroGame_game1, [{
		key: "getRobotTopLeft",
		value: function getRobotTopLeft(at) {
			if (at === undefined) at = this.timerProgress;

			var start = this.robotStartTopLeft,
			    targetY = -300,
			    yLen = targetY - start.y;

			start.y += yLen * (at * at);

			return start;
		}
	}, {
		key: "cloudPositions",
		value: function cloudPositions(atPct) {
			var x1 = -50;
			var y1 = -500;
			var yDistance = window.CONST.CANVAS_HEIGHT * atPct;

			return [new Point(x1, y1 + yDistance), new Point(x1 + 50, y1 + 300 + yDistance), new Point(x1 - 75, y1 + 600 + yDistance), new Point(x1 + 300, y1 + 100 + yDistance), new Point(x1 + 240, y1 + 400 + yDistance), new Point(x1 + 300, y1 + 700 + yDistance)];
		}
	}, {
		key: "tick",
		value: function tick(ctx, ms) {
			_get(Object.getPrototypeOf(OJCaptchaMicroGame_game1.prototype), "tick", this).call(this, ctx, ms);

			this.timerProgress = ms / this.maxDuration;

			//sky
			var grd = ctx.createLinearGradient(0, 0, 0, 400);
			grd.addColorStop(0, "#5db1ff");
			grd.addColorStop(1, "#bcddff");
			ctx.fillStyle = grd;
			ctx.fillRect(0, 0, 400, 400);

			if (this.isComplete) this.drawComplete(ctx);else this.draw(ctx);
		}
	}, {
		key: "draw",
		value: function draw(ctx) {

			//clouds
			var clouds = this.cloudPositions(this.timerProgress);

			var cloud = new Rect(197, 84, 195, 105);

			clouds.forEach(function (p) {
				this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH, cloud, new Rect(p.x, p.y, cloud.width, cloud.height));
			}.bind(this));

			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH, new Rect(0, 0, 190, 400), new Rect(this.getRobotTopLeft().x, this.getRobotTopLeft().y, 190, 400));

			var key = new Rect(189, 13, 45, 40);

			if (this.keyState === 1) {
				key.x += key.width;
				key.width = 41;
			} else if (this.keyState === 2) {
				key.x = 273;
				key.width = 39;
			}

			var drawKey = new Rect(65 - key.width, 280 - key.height, key.width, key.height).offset(this.getRobotTopLeft());

			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH, key, drawKey);
		}
	}, {
		key: "drawComplete",
		value: function drawComplete(ctx) {
			//clouds

			++this._tickSinceComplete;

			var cloudState = this._completeAt - this._tickSinceComplete / 400;
			console.log("complete: " + cloudState);

			var clouds = this.cloudPositions(Math.max(-100, cloudState));

			var cloud = new Rect(197, 84, 195, 105);

			clouds.forEach(function (p) {
				this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH, cloud, new Rect(p.x, p.y, cloud.width, cloud.height));
			}.bind(this));

			//robot
			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH, new Rect(393, 0, 231, 228), new Rect(this.getRobotTopLeft(cloudState).x, this.getRobotTopLeft(cloudState).y, 231, 228));
		}
	}, {
		key: "complete",
		value: function complete() {
			this._isComplete = true;
			this._completeAt = this.timerProgress;
			this._tickSinceComplete = 0;
		}
	}, {
		key: "click",
		value: function click(x, y) {
			//did we click inside the ballon? 
			if (this.balloonRect.contains(new Point(x, y))) {
				//hit
				console.log("hit");
				this.complete();
				this.solve({ x: x, y: y, progress: this.timerProgress });
			} else {
				//miss
				console.log("miss");
			}
		}
	}, {
		key: "maxDuration",
		get: function get() {
			return 5000;
		}
	}, {
		key: "timerProgress",
		get: function get() {
			return Math.min(this._timerProgress || 0, 100);
		},
		set: function set(to) {
			this._timerProgress = to;
		}
	}, {
		key: "gameSuccessProgress",
		get: function get() {
			return this._gameSuccessProgress || 0;
		},
		set: function set(to) {
			this._gameSuccessProgress = to;
		}
	}, {
		key: "robotStartTopLeft",
		get: function get() {

			if (!this._robotStartTopLeft) {

				var xMin = 0,
				    xMax = window.CONST.CANVAS_WIDTH - 200,
				    yMin = window.CONST.CANVAS_HEIGHT * .3,
				    yMax = window.CONST.CANVAS_HEIGHT * 0.6,
				    xLen = xMax - xMin,
				    yLen = yMax - yMin;

				this._robotStartTopLeft = new Point(Math.floor(xMin + xLen * Number(this.randomSeed.charAt(2) / 10)), Math.floor(yMin + yLen * Number(this.randomSeed.charAt(4) / 10)));
			}

			return this._robotStartTopLeft.clone();
		}
	}, {
		key: "balloonRect",
		get: function get() {
			var r = this.getRobotTopLeft();
			return new Rect(r.x + 40, r.y, 50, 65);
		}
	}, {
		key: "keyState",
		get: function get() {
			var s = Math.floor(this.timerProgress * 30 % 3);
			console.log("keystate: " + s);
			return s;
		}
	}, {
		key: "isComplete",
		get: function get() {
			return this._isComplete;
		}
	}]);

	return OJCaptchaMicroGame_game1;
}(OJCaptchaMicroGameBase);

/*
OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/spritesheet1.png";
 
var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_game1]); */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OJCaptchaMicroGame_game2 = function (_OJCaptchaMicroGameBa) {
	_inherits(OJCaptchaMicroGame_game2, _OJCaptchaMicroGameBa);

	function OJCaptchaMicroGame_game2(randomSeed, assets) {
		_classCallCheck(this, OJCaptchaMicroGame_game2);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaMicroGame_game2).call(this, randomSeed, assets));
	}

	_createClass(OJCaptchaMicroGame_game2, [{
		key: "drawRobot",
		value: function drawRobot(ctx, x, y, scale) {
			var cutOut = this.robotSpriteSheetRect;

			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH, cutOut, new Rect(x, y, cutOut.width * scale, cutOut.height * scale));
			return this;
		}
	}, {
		key: "tick",
		value: function tick(ctx, ms) {
			_get(Object.getPrototypeOf(OJCaptchaMicroGame_game2.prototype), "tick", this).call(this, ctx, ms);

			this.timerProgress = ms / this.maxDuration;

			//sky
			var grd = ctx.createLinearGradient(0, 0, 0, 400);
			grd.addColorStop(0, "#5db1ff");
			grd.addColorStop(1, "#bcddff");
			ctx.fillStyle = grd;
			ctx.fillRect(0, 0, 400, 400);

			this.draw(ctx);
		}
	}, {
		key: "draw",
		value: function draw(ctx) {

			//zoom complete, draw key
			if (this.zoomProgress >= 1) this.drawKey(ctx);

			//draw robot
			var center = new Point(window.CONST.CANVAS_WIDTH / 2, window.CONST.CANVAS_HEIGHT / 2);

			var canvas = new Rect(0, 0, window.CONST.CANVAS_WIDTH, window.CONST.CANVAS_HEIGHT);

			var robotRect = this.robotSpriteSheetRect;

			var initialScale = 0.4;

			robotRect.width *= initialScale;
			robotRect.height *= initialScale;

			var robotStartRect = new Rect((canvas.width - robotRect.width) * .5, canvas.height - robotRect.height, robotRect.width, robotRect.height);

			var robotEnd = this.robotZoomData;

			var topLeft = new Point(robotStartRect.x, robotStartRect.y).interpolate(new Point(robotEnd.x, robotEnd.y), this.zoomProgress);

			this.drawRobot(ctx, topLeft.x, topLeft.y, robotEnd.scale * this.zoomProgress);
		}
	}, {
		key: "getKeyRect",
		value: function getKeyRect(frame) {
			return new Rect(407, 0, 84, 74);
		}
	}, {
		key: "drawKey",
		value: function drawKey(ctx) {

			var basePos = this.keyBasePos;
			var scale = this.robotZoomData.scale;
			var frameRect = this.getKeyRect(0);
			var drawRect = new Rect(basePos.x, basePos.y, frameRect.width * scale, frameRect.height * scale);

			drawRect.x -= drawRect.width;
			drawRect.y -= drawRect.height / 2;

			drawRect.x += this.getInsertOffset();

			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH, frameRect, drawRect);
		}
	}, {
		key: "getInsertOffset",
		value: function getInsertOffset() {
			if (this._inserted) return 30;
			if (this._insertMouseDown) {
				var num = Math.max(-100, Math.min(30, this.lastMouse.x - this._insertMouseDownX - 100));
				console.log(num);
				return num;
			} else {
				return -100;
			}
		}
	}, {
		key: "drawKey_inserting",
		value: function drawKey_inserting(ctx) {

			//this.drawKey(ctx, basePos.x, basePos.y, 0)
		}
	}, {
		key: "drawKey_winding",
		value: function drawKey_winding(ctx) {}
	}, {
		key: "mousedown",
		value: function mousedown(x, y) {
			///console.log("mouse down: "+ x + ", " + y + ", distance: "+ this.keyBasePos.distanceTo(new Point(x,y)))
			//distance to basepos
			if (this.keyBasePos.distanceTo(new Point(x - this.getInsertOffset(), y)) < 100) {
				this._insertMouseDown = true;
				this._insertMouseDownX = x;
			} else {
				this._insertMouseDown = false;
			}
		}
	}, {
		key: "mouseup",
		value: function mouseup() {
			if (this.getInsertOffset() > 20) {
				this._inserted = true;
			}
			this._insertMouseDown = false;
		}
	}, {
		key: "complete",
		value: function complete() {}
	}, {
		key: "click",
		value: function click(x, y) {}
	}, {
		key: "maxDuration",
		get: function get() {
			return 5000;
		}
	}, {
		key: "windSide",
		get: function get() {
			if (!this._side) this._side = parseInt((this.randomSeed + "").charAt(2)) < 5 ? "left" : "right";
			return this._side;
		}
	}, {
		key: "timerProgress",
		get: function get() {
			return Math.min(this._timerProgress || 0, 100);
		},
		set: function set(to) {
			this._timerProgress = to;
		}
	}, {
		key: "zoomProgress",
		get: function get() {
			return Math.min(1, this._timerProgress / 0.2);
		}
	}, {
		key: "keyBasePos",
		get: function get() {
			var robot = this.robotZoomData;
			return new Point(robot.x + 121, robot.y + 350);
		}
	}, {
		key: "state",
		get: function get() {

			return "zooming";

			if (this.zoomProgress < 1) {
				return "zooming";
			}
			if (!this._inserted) return "inserting";
			return "winding";
		}
	}, {
		key: "robotSpriteSheetRect",
		get: function get() {
			return new Rect(0, 0, 358, 526);
		}
	}, {
		key: "robotZoomData",
		get: function get() {
			if (!this._robotZoomData) {
				this._robotZoomData = {
					x: 100,
					y: -50,
					scale: 1.2
				};
			}
			return this._robotZoomData;
		}
	}]);

	return OJCaptchaMicroGame_game2;
}(OJCaptchaMicroGameBase);

OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/game_spritesheet_2.png";

var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_game2]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYmFzZS5qcyIsImdhbWVzLzEuanMiLCJnYW1lcy8yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFFTSxTQUVKLFNBRkksTUFFSixHQUFhO3VCQUZULFFBRVM7Q0FBYjs7QUFNRixPQUFPLEtBQVAsR0FBZTtBQUNkLGVBQWUsR0FBZjtBQUNBLGdCQUFlLEdBQWY7Q0FGRDs7SUFLTTs7O0FBQ0wsVUFESyxLQUNMLENBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0I7d0JBRFgsT0FDVzs7cUVBRFgsbUJBQ1c7O0FBRWYsUUFBSyxFQUFMLEdBQVUsQ0FBVixDQUZlO0FBR2YsUUFBSyxFQUFMLEdBQVUsQ0FBVixDQUhlOztFQUFoQjs7Y0FESzs7OEJBMkJPLElBQUksTUFDaEI7QUFDQyxVQUFPLElBQUksS0FBSixDQUFVLEtBQUssQ0FBTCxHQUFPLENBQUMsR0FBRyxDQUFILEdBQUssS0FBSyxDQUFMLENBQU4sR0FBYyxJQUFkLEVBQW9CLEtBQUssQ0FBTCxHQUFPLENBQUMsR0FBRyxDQUFILEdBQUssS0FBSyxDQUFMLENBQU4sR0FBYyxJQUFkLENBQW5ELENBREQ7Ozs7eUJBSU8sR0FBRSxHQUFFO0FBQ1YsT0FBRyxFQUFFLE9BQUYsRUFBVztBQUNiLFNBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBRixDQURHO0FBRWIsU0FBSyxDQUFMLElBQVUsRUFBRSxDQUFGLENBRkc7SUFBZCxNQUdPO0FBQ04sU0FBSyxDQUFMLElBQVUsQ0FBVixDQURNO0FBRU4sU0FBSyxDQUFMLElBQVUsQ0FBVixDQUZNO0lBSFA7QUFPQSxVQUFPLElBQVAsQ0FSVTs7Ozs2QkFXQSxJQUFHO0FBQ2IsVUFBTyxLQUFLLElBQUwsQ0FBVyxLQUFLLEdBQUwsQ0FBVSxLQUFLLENBQUwsR0FBTyxHQUFHLENBQUgsRUFBTyxDQUF4QixJQUE2QixLQUFLLEdBQUwsQ0FBVSxLQUFLLENBQUwsR0FBTyxHQUFHLENBQUgsRUFBTyxDQUF4QixDQUE3QixDQUFsQixDQURhOzs7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QUR3QjtJQUF6QjtBQUdBLE9BQUcsQ0FBQyxLQUFLLFNBQUwsRUFBZ0IsT0FBTyxXQUFQLENBQXBCO0FBQ0EsVUFBTyxTQUFQLENBUlU7Ozs7c0JBV2U7QUFDekIsVUFBTyxJQUFJLElBQUosQ0FBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLEdBQWIsRUFBaUIsR0FBakIsQ0FBUCxDQUR5Qjs7OztzQkFpQlA7QUFDbEIsT0FBRyxDQUFDLEtBQUssY0FBTCxFQUFvQjtBQUN2QixTQUFLLGNBQUwsR0FBc0I7QUFDckIsUUFBRyxHQUFIO0FBQ0EsUUFBRyxDQUFDLEVBQUQ7QUFDSCxZQUFRLEdBQVI7S0FIRCxDQUR1QjtJQUF4QjtBQU9BLFVBQU8sS0FBSyxjQUFMLENBUlc7Ozs7UUE5RGQ7RUFBaUM7O0FBK0x2Qyx5QkFBeUIsU0FBekIsQ0FBbUMsaUJBQW5DLEdBQXVELDJFQUF2RDs7QUFFQSxJQUFJLFlBQVksSUFBSSxrQkFBSixDQUF1QixFQUFFLHVCQUFGLENBQXZCLENBQVo7QUFDSixVQUFVLElBQVYsQ0FBZSxDQUFDLHdCQUFELENBQWYiLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuY2xhc3MgT0pCYXNlIHtcclxuICBcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG53aW5kb3cuQ09OU1QgPSB7XHJcblx0Q0FOVkFTX1dJRFRIIDogNDAwLCBcclxuXHRDQU5WQVNfSEVJR0hUOiA0MDBcclxufVxyXG5cclxuY2xhc3MgUG9pbnQgZXh0ZW5kcyBPSkJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKHgseSl7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5feCA9IHg7XHJcblx0XHR0aGlzLl95ID0geTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGlzUG9pbnQoKXtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3g7XHJcblx0fVxyXG5cdFxyXG5cdHNldCB4KHRvKXtcclxuXHRcdHRoaXMuX3ggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IHkoKXtcclxuXHRcdHJldHVybiB0aGlzLl95OyBcclxuXHR9XHJcblx0XHJcblx0c2V0IHkodG8pe1xyXG5cdFx0dGhpcy5feSA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRpbnRlcnBvbGF0ZSh0bywgZnJhYykgXHJcblx0e1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludCh0aGlzLngrKHRvLngtdGhpcy54KSpmcmFjLCB0aGlzLnkrKHRvLnktdGhpcy55KSpmcmFjKTtcclxuXHR9XHJcblx0XHJcblx0b2Zmc2V0KHgseSl7XHJcblx0XHRpZih4LmlzUG9pbnQpIHtcclxuXHRcdFx0dGhpcy54ICs9IHgueDtcclxuXHRcdFx0dGhpcy55ICs9IHgueTtcclxuXHRcdH0gZWxzZSB7IFxyXG5cdFx0XHR0aGlzLnggKz0geDtcclxuXHRcdFx0dGhpcy55ICs9IHk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0XHJcblx0ZGlzdGFuY2VUbyhwMil7XHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KCBNYXRoLnBvdygodGhpcy54LXAyLngpLCAyKSArIE1hdGgucG93KCh0aGlzLnktcDIueSksIDIpICk7XHJcblx0fVxyXG5cdFxyXG5cdGNsb25lKCl7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFJlY3QgZXh0ZW5kcyBQb2ludCB7XHJcblx0Y29uc3RydWN0b3IoeCx5LHdpZHRoLGhlaWdodCl7XHJcblx0XHRzdXBlcih4LHkpO1xyXG5cdFx0dGhpcy5fd2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuX2hlaWdodCA9IGhlaWdodDtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHdpZHRoKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xyXG5cdH1cclxuXHRcclxuXHRzZXQgd2lkdGgodG8pe1xyXG5cdFx0dGhpcy5fd2lkdGggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IGhlaWdodCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX2hlaWdodDtcclxuXHR9XHJcblx0XHJcblx0c2V0IGhlaWdodCh0byl7XHJcblx0XHR0aGlzLl9oZWlnaHQgPSB0bztcclxuXHR9XHJcblx0XHJcblx0XHJcblx0Y29udGFpbnMocCl7XHRcdFxyXG5cdFx0cmV0dXJuIChwLnggPj0gdGhpcy54ICYmIHAueCA8PSB0aGlzLnggKyB0aGlzLndpZHRoICYmIHAueSA+PSB0aGlzLnkgJiYgcC55IDw9IHRoaXMueSArIHRoaXMuaGVpZ2h0KTtcclxuXHR9XHJcblx0XHJcblx0Y2xvbmUoKXtcclxuXHRcdHJldHVybiBuZXcgUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhQmFzZSBleHRlbmRzIE9KQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG59IFxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhQ29udGFpbmVyIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoJHNyYyl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fJHNyYyA9ICRzcmM7XHJcblx0dGhpcy5pbWFnZUFzc2V0cyA9IFtdO1xyXG4gIH1cclxuICBcclxuICBnZXQgJHNyYygpe1xyXG4gICAgcmV0dXJuIHRoaXMuXyRzcmM7IFxyXG4gIH1cclxuICBcclxuICBnZXQgYWN0aXZlR2FtZSgpe1xyXG4gICAgaWYoIXRoaXMuX2FjdGl2ZUdhbWUpe1xyXG5cdFx0XHJcblx0ICAvL2NyZWF0ZSBhIDE2IGNoYXIgcmFuZG9tU2VlZFxyXG5cdCAgdGhpcy5fYWN0aXZlU2VlZCA9IF8udGltZXMoMTYsICgpID0+IF8ucmFuZG9tKDAsOSkpLmpvaW4oXCJcIik7XHJcblx0ICBcclxuXHQgIC8vc3RhcnQgdGhlIGFjdGl2ZSBnYW1lXHJcbiAgICAgIHRoaXMuX2FjdGl2ZUdhbWUgPSBuZXcgdGhpcy5fZ2FtZXNRdWV1ZVswXSh0aGlzLl9hY3RpdmVTZWVkLCB0aGlzLmltYWdlQXNzZXRzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUdhbWU7XHJcbiAgfVxyXG4gIFxyXG4gIGluaXQoZ2FtZXNBcnIpe1xyXG5cdCAgXHJcbiAgICB0aGlzLl9nYW1lc1F1ZXVlID0gZ2FtZXNBcnI7XHJcblx0XHJcblx0dGhpcy5sb2FkQXNzZXRzKClcclxuXHRcdC50aGVuKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGxvYWRBc3NldHMoKXtcclxuXHRcdGNvbnNvbGUubG9nKFwibG9hZEFzc2V0c1wiKTtcclxuXHQgIC8vZ2V0IHNwcml0ZXNoZWV0cyBmcm9tIGdhbWUgY2xhc3Nlc1xyXG5cdCAgIF8uZm9yRWFjaCh0aGlzLl9nYW1lc1F1ZXVlLCAoZykgPT4ge1xyXG5cdFx0ICBsZXQgdXJsID0gZy5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEg7XHJcblx0XHQgIGNvbnNvbGUubG9nKFwibG9hZCA6IFwiICsgdXJsKTtcclxuXHRcdCAgaWYodXJsICYmICEodXJsIGluIHRoaXMuaW1hZ2VBc3NldHMpKXtcclxuXHRcdFx0ICB0aGlzLmltYWdlQXNzZXRzLnB1c2goeyB1cmwgLCBpbWFnZSA6IG5ldyBJbWFnZSgpfSk7XHJcblx0XHQgIH1cclxuXHQgIH0sIHRoaXMpO1xyXG5cclxuXHQgIC8vbG9hZCBzaW5nbGUgc3ByaXRlc2hlZXQgaW1hZ2VcclxuXHQgIGxldCBsb2FkU3ByaXRlU2hlZXQgPSAoc3ByaXRlU2hlZXQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdHNwcml0ZVNoZWV0LmltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC5jb21wbGV0ZSA9IHRydWU7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQud2lkdGggPSBzcHJpdGVTaGVldC5pbWFnZS5uYXR1cmFsV2lkdGg7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQuaGVpZ2h0ID0gc3ByaXRlU2hlZXQuaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuXHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3ByaXRlU2hlZXQuaW1hZ2Uuc3JjID0gc3ByaXRlU2hlZXQudXJsO1xyXG5cdFx0fSk7XHJcblx0ICB9XHJcblx0ICBcclxuXHQgIC8vcmVjdXJzaXZlIGNsb3N1cmUgdGhhdCBsb2FkcyBhbGwgc3ByZWFkc2hlZXRzIGZyb20gcXVldWVcclxuXHQgIGxldCBsb2FkZXIgPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0bGV0IG5leHQgPSBfLmZpbmQodGhpcy5pbWFnZUFzc2V0cywgYSA9PiAhYS5jb21wbGV0ZSk7XHJcblx0XHRpZighbmV4dCkgcmV0dXJuIHJlc29sdmUoKTtcclxuXHRcdGxvYWRTcHJpdGVTaGVldChuZXh0KS50aGVuKCAoKSA9PiBsb2FkZXIocmVzb2x2ZSxyZWplY3QpKTtcclxuXHQgIH0uYmluZCh0aGlzKTtcclxuXHQgIFxyXG5cdCAgcmV0dXJuIG5ldyBQcm9taXNlKGxvYWRlcik7XHJcbiAgfVxyXG4gIFxyXG4gIGJ1aWxkKCl7XHJcbiAgICB0aGlzLmlzQnVpbGQgPSB0cnVlO1xyXG4gICAgdGhpcy4kY2FudmFzID0gJChcIjxjYW52YXMgd2lkdGg9JzQwMCcgaGVpZ2h0PSc0MDAnPjwvY2FudmFzPlwiKTtcclxuXHR0aGlzLiRjYW52YXMubW91c2Vtb3ZlKHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcykpO1xyXG5cdHRoaXMuJGNhbnZhcy5tb3VzZWRvd24odGhpcy5tb3VzZWRvd24uYmluZCh0aGlzKSk7XHJcblx0dGhpcy4kY2FudmFzLm1vdXNldXAodGhpcy5tb3VzZXVwLmJpbmQodGhpcykpO1xyXG5cdHRoaXMuJGNhbnZhcy5jbGljayh0aGlzLmNhbnZhc2NsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLiRjYW52YXNbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgdGhpcy5fJHNyYy5hcHBlbmQodGhpcy4kY2FudmFzKTsgXHJcbiAgfVxyXG4gIFxyXG4gIHN0YXJ0KCl7XHJcblx0ICBjb25zb2xlLmxvZyhcImFzc2V0cyBsb2FkZWRcIik7XHJcbiAgICBpZighdGhpcy5pc0J1aWx0KSB0aGlzLmJ1aWxkKCk7XHJcbiAgICAvL3RpY2tcclxuXHR0aGlzLl9zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIHRpY2sodGltZVN0YW1wKXtcclxuICAgIHRoaXMuYWN0aXZlR2FtZS50aWNrKHRoaXMuY3R4LCB0aW1lU3RhbXAgLSB0aGlzLl9zdGFydFRpbWUpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGNhbnZhc2NsaWNrKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUuY2xpY2soZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTsgIFxyXG4gIH1cclxuICBcclxuICBtb3VzZW1vdmUoZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5tb3VzZU1vdmUoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcclxuICB9XHJcbiAgXHJcbiAgbW91c2Vkb3duKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUubW91c2Vkb3duKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNldXAoZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5tb3VzZXVwKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcblx0XHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl9yYW5kb21TZWVkID0gcmFuZG9tU2VlZDtcclxuXHR0aGlzLl9hc3NldHMgPSBhc3NldHM7XHJcblx0dGhpcy5fZnJhbWVzID0ge307XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByYW5kb21TZWVkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcmFuZG9tU2VlZDtcclxuICB9XHJcbiAgXHJcbiAgcmdiYShyLGcsYixhKXtcclxuXHQgIHJldHVybiBcInJnYmEoXCIgKyByICtcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCBcIiArIGEgK1wiKVwiO1xyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgXHJcbiAgfSBcclxuICBcclxuICBjbGljayh4LHkpe1xyXG5cdCBcclxuICB9XHJcbiAgXHJcbiAgc29sdmUoKXtcclxuXHQgIFxyXG4gIH1cclxuICBcclxuICBnZXRBc3NldChuYW1lKXtcclxuXHRyZXR1cm4gXy5maW5kKHRoaXMuX2Fzc2V0cywgYSA9PiBhLnVybCA9PSBuYW1lKTtcclxuICB9XHJcbiAgXHJcbiAgZHJhd0Zyb21TcHJpdGVGcmFtZShjdHgsIG5hbWUsIG51bUZyYW1lc1csIG51bUZyYW1lc0gsIGZyYW1lSW5kZXgsIHRhcmdldFgsIHRhcmdldFksIHRhcmdldFcsIHRhcmdldEgpe1xyXG5cdGxldCBhc3NldCA9IHRoaXMuZ2V0QXNzZXQobmFtZSksXHJcblx0XHRmcmFtZVcgPSBhc3NldC53aWR0aCAvIG51bUZyYW1lc1csXHJcblx0XHRmcmFtZUggPSBhc3NldC5oZWlnaHQgLyBudW1GcmFtZXNILCBcclxuXHRcdGZyYW1lWSA9IE1hdGguZmxvb3IoZnJhbWVJbmRleCAvIG51bUZyYW1lc1cpLFxyXG5cdFx0ZnJhbWVYID0gZnJhbWVJbmRleCAtIChmcmFtZVkgKiBudW1GcmFtZXNXKTtcclxuXHRcdFxyXG5cdGN0eC5kcmF3SW1hZ2UoYXNzZXQuaW1hZ2UsIGZyYW1lWCAqIGZyYW1lVywgZnJhbWVZICogZnJhbWVILCBmcmFtZVcsIGZyYW1lSCwgdGFyZ2V0WCwgdGFyZ2V0WSwgdGFyZ2V0VywgdGFyZ2V0SCk7XHJcbiAgfVxyXG4gIFxyXG4gIGRyYXdGcm9tU3ByaXRlU2hlZXQoY3R4LCBuYW1lLCBzcmNSZWN0LCB0YXJnZXRSZWN0KXtcclxuXHQgIGxldCBhc3NldCA9IHRoaXMuZ2V0QXNzZXQobmFtZSk7XHJcblx0ICBjdHguZHJhd0ltYWdlKGFzc2V0LmltYWdlLCBzcmNSZWN0LngsIHNyY1JlY3QueSwgc3JjUmVjdC53aWR0aCwgc3JjUmVjdC5oZWlnaHQsIHRhcmdldFJlY3QueCwgdGFyZ2V0UmVjdC55LCB0YXJnZXRSZWN0LndpZHRoLCB0YXJnZXRSZWN0LmhlaWdodCk7XHJcblx0ICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgXHJcbiAgbW91c2Vkb3duKHgseSl7XHJcblx0ICBcclxuICB9XHJcbiAgXHJcbiAgbW91c2V1cCh4LHkpe1xyXG5cdCAgXHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlTW92ZSh4LHkpe1xyXG5cdHRoaXMuX2xhc3RNb3VzZSA9IG5ldyBQb2ludCh4LHkpO1xyXG4gIH1cclxuICBcclxuICBnZXQgbGFzdE1vdXNlKCkge1xyXG5cdCAgaWYoIXRoaXMuX2xhc3RNb3VzZSkgcmV0dXJuIG51bGw7XHJcblx0ICByZXR1cm4gdGhpcy5fbGFzdE1vdXNlLmNsb25lKCk7XHJcbiAgfVxyXG4gIFxyXG59XHQiLCJjbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEgZXh0ZW5kcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIHsgXHJcbiAgXHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuICAgIHN1cGVyKHJhbmRvbVNlZWQsIGFzc2V0cyk7XHJcbiAgfVxyXG4gICAgXHJcbiAgZ2V0IG1heER1cmF0aW9uKCl7XHJcblx0ICByZXR1cm4gNTAwMDtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IHRpbWVyUHJvZ3Jlc3MoKXtcclxuXHQgIHJldHVybiBNYXRoLm1pbih0aGlzLl90aW1lclByb2dyZXNzIHx8IDAsMTAwKTtcclxuICB9XHJcbiAgXHJcbiAgc2V0IHRpbWVyUHJvZ3Jlc3ModG8pe1xyXG5cdCAgdGhpcy5fdGltZXJQcm9ncmVzcyA9IHRvO1xyXG4gIH1cclxuICBcclxuICBnZXQgZ2FtZVN1Y2Nlc3NQcm9ncmVzcygpe1xyXG5cdCAgcmV0dXJuIHRoaXMuX2dhbWVTdWNjZXNzUHJvZ3Jlc3N8fCAwO1xyXG4gIH1cclxuICBcclxuICBzZXQgZ2FtZVN1Y2Nlc3NQcm9ncmVzcyh0byl7XHJcblx0ICB0aGlzLl9nYW1lU3VjY2Vzc1Byb2dyZXNzID0gdG87XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByb2JvdFN0YXJ0VG9wTGVmdCgpe1xyXG5cdCAgXHJcblx0aWYoIXRoaXMuX3JvYm90U3RhcnRUb3BMZWZ0KXtcclxuXHJcblx0XHRsZXQgeE1pbiA9IDAsIHhNYXggPSB3aW5kb3cuQ09OU1QuQ0FOVkFTX1dJRFRIIC0gMjAwLFxyXG5cdFx0XHR5TWluID0gd2luZG93LkNPTlNULkNBTlZBU19IRUlHSFQgICouMywgeU1heCA9IHdpbmRvdy5DT05TVC5DQU5WQVNfSEVJR0hUKjAuNixcclxuXHRcdFx0eExlbiA9IHhNYXggLSB4TWluLFxyXG5cdFx0XHR5TGVuID0geU1heCAtIHlNaW47XHJcblxyXG5cdFx0dGhpcy5fcm9ib3RTdGFydFRvcExlZnQgPSBuZXcgUG9pbnQoXHJcblx0XHRcdE1hdGguZmxvb3IoeE1pbiArICh4TGVuICogKE51bWJlcih0aGlzLnJhbmRvbVNlZWQuY2hhckF0KDIpLzEwKSkpKSxcclxuXHRcdFx0TWF0aC5mbG9vcih5TWluICsgKHlMZW4gKiAoTnVtYmVyKHRoaXMucmFuZG9tU2VlZC5jaGFyQXQoNCkvMTApKSkpXHJcblx0XHRcdCk7XHJcblx0fVxyXG5cdFx0XHRcclxuXHRyZXR1cm4gdGhpcy5fcm9ib3RTdGFydFRvcExlZnQuY2xvbmUoKTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0Um9ib3RUb3BMZWZ0KGF0KSB7XHJcblx0aWYoYXQgPT09IHVuZGVmaW5lZCkgYXQgPSB0aGlzLnRpbWVyUHJvZ3Jlc3M7XHJcblx0XHJcblx0bGV0IHN0YXJ0ID0gdGhpcy5yb2JvdFN0YXJ0VG9wTGVmdCxcclxuXHRcdHRhcmdldFkgPSAtMzAwLCBcclxuXHRcdHlMZW4gPSB0YXJnZXRZIC0gc3RhcnQueTsgXHJcblx0XHJcblx0c3RhcnQueSArPSAoeUxlbiAqIChhdCphdCkpO1xyXG5cdFxyXG5cdHJldHVybiBzdGFydDtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGJhbGxvb25SZWN0KCl7XHJcblx0dmFyIHIgPSB0aGlzLmdldFJvYm90VG9wTGVmdCgpO1xyXG5cdHJldHVybiBuZXcgUmVjdChyLnggKyA0MCwgci55LCA1MCw2NSk7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCBrZXlTdGF0ZSAoKXtcclxuXHQgIHZhciBzID0gTWF0aC5mbG9vcih0aGlzLnRpbWVyUHJvZ3Jlc3MqMzAlMyk7XHJcblx0ICBjb25zb2xlLmxvZyhcImtleXN0YXRlOiBcIisgcyk7XHJcblx0ICByZXR1cm4gcztcclxuICB9XHJcbiAgXHJcbiAgY2xvdWRQb3NpdGlvbnMgKGF0UGN0KXtcclxuXHQgIHZhciB4MSA9IC01MDtcclxuXHQgIHZhciB5MSA9IC01MDA7XHJcblx0ICB2YXIgeURpc3RhbmNlID0gd2luZG93LkNPTlNULkNBTlZBU19IRUlHSFQgKiBhdFBjdDtcclxuXHQgIFxyXG5cdCAgcmV0dXJuIFsgXHJcblx0XHRcdG5ldyBQb2ludCh4MSwgeTEgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDEgKyA1MCwgeTEgKyAzMDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDEgLSA3NSwgeTEgKyA2MDArIHlEaXN0YW5jZSksXHJcblx0XHRcdFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDMwMCwgeTEgKyAxMDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDI0MCwgeTEgKyA0MDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDMwMCwgeTEgKyA3MDAgKyB5RGlzdGFuY2UpLFxyXG5cdCAgXVxyXG4gIH1cclxuICBcclxuXHR0aWNrKGN0eCwgbXMpe1xyXG5cdFx0c3VwZXIudGljayhjdHgsIG1zKTsgXHJcblx0XHRcclxuXHRcdHRoaXMudGltZXJQcm9ncmVzcyA9IG1zIC8gdGhpcy5tYXhEdXJhdGlvbjtcclxuXHRcdFx0XHJcblx0XHQvL3NreVxyXG5cdFx0dmFyIGdyZD1jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwwLDAsNDAwKTtcclxuXHRcdGdyZC5hZGRDb2xvclN0b3AoMCxcIiM1ZGIxZmZcIik7XHJcblx0XHRncmQuYWRkQ29sb3JTdG9wKDEsXCIjYmNkZGZmXCIpO1xyXG5cdFx0Y3R4LmZpbGxTdHlsZT1ncmQ7XHJcblx0XHRjdHguZmlsbFJlY3QoMCwwLDQwMCw0MDApO1xyXG5cdFx0XHRcclxuXHRcdGlmKHRoaXMuaXNDb21wbGV0ZSkgdGhpcy5kcmF3Q29tcGxldGUoY3R4KTtcclxuXHRcdGVsc2UgdGhpcy5kcmF3KGN0eCk7XHJcblx0fSBcclxuXHRcclxuXHRkcmF3KGN0eCl7XHJcblx0XHRcclxuXHRcdC8vY2xvdWRzXHJcblx0XHR2YXIgY2xvdWRzID0gdGhpcy5jbG91ZFBvc2l0aW9ucyh0aGlzLnRpbWVyUHJvZ3Jlc3MpO1xyXG5cdFx0XHJcblx0XHR2YXIgY2xvdWQgPSBuZXcgUmVjdCgxOTcsODQsMTk1LDEwNSlcclxuXHRcdFx0XHJcblx0XHRjbG91ZHMuZm9yRWFjaChmdW5jdGlvbihwKXtcdFx0XHRcclxuXHRcdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRcdGN0eCwgXHJcblx0XHRcdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdFx0XHRjbG91ZCxcclxuXHRcdFx0XHRuZXcgUmVjdChwLngscC55LCBjbG91ZC53aWR0aCwgY2xvdWQuaGVpZ2h0KVxyXG5cdFx0XHQpO1x0XHJcblx0XHR9LmJpbmQodGhpcykpO1xyXG5cdFx0XHJcblx0XHQgIFxyXG5cdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRjdHgsIFxyXG5cdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRuZXcgUmVjdCgwLDAsMTkwLDQwMCksXHJcblx0XHRcdG5ldyBSZWN0KHRoaXMuZ2V0Um9ib3RUb3BMZWZ0KCkueCx0aGlzLmdldFJvYm90VG9wTGVmdCgpLnksMTkwLDQwMClcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdHZhciBrZXkgPSBuZXcgUmVjdCgxODksMTMsNDUsNDApO1xyXG5cdFx0XHJcblx0XHRpZih0aGlzLmtleVN0YXRlID09PSAxKSB7XHJcblx0XHRcdGtleS54ICs9IGtleS53aWR0aDtcclxuXHRcdFx0a2V5LndpZHRoID0gNDE7XHJcblx0XHR9IGVsc2UgaWYodGhpcy5rZXlTdGF0ZSA9PT0gMil7XHJcblx0XHRcdGtleS54ID0gMjczO1xyXG5cdFx0XHRrZXkud2lkdGggPSAzOVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZHJhd0tleSA9IG5ldyBSZWN0KDY1IC0ga2V5LndpZHRoLCAyODAgLSBrZXkuaGVpZ2h0LGtleS53aWR0aCwga2V5LmhlaWdodCkub2Zmc2V0KHRoaXMuZ2V0Um9ib3RUb3BMZWZ0KCkpXHJcblx0XHQgIFxyXG5cdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRjdHgsIFxyXG5cdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRrZXksXHJcblx0XHRcdGRyYXdLZXlcclxuXHRcdCk7XHJcblx0XHRcclxuXHQgIH0gXHJcblx0ICBcclxuXHQgIGRyYXdDb21wbGV0ZShjdHgpe1xyXG5cdFx0Ly9jbG91ZHNcclxuXHRcdFx0XHJcblx0XHQrK3RoaXMuX3RpY2tTaW5jZUNvbXBsZXRlO1xyXG5cdFx0XHJcblx0XHR2YXIgY2xvdWRTdGF0ZSA9ICB0aGlzLl9jb21wbGV0ZUF0IC0gKHRoaXMuX3RpY2tTaW5jZUNvbXBsZXRlLzQwMCk7XHJcblx0XHRjb25zb2xlLmxvZyhcImNvbXBsZXRlOiBcIiArIGNsb3VkU3RhdGUpO1xyXG5cdFx0XHJcblx0XHR2YXIgY2xvdWRzID0gdGhpcy5jbG91ZFBvc2l0aW9ucyhNYXRoLm1heCgtMTAwLGNsb3VkU3RhdGUpKTsgXHJcblx0XHRcclxuXHRcdHZhciBjbG91ZCA9IG5ldyBSZWN0KDE5Nyw4NCwxOTUsMTA1KVxyXG5cdFx0XHQgIFxyXG5cdFx0Y2xvdWRzLmZvckVhY2goZnVuY3Rpb24ocCl7XHRcdFx0XHJcblx0XHRcdHRoaXMuZHJhd0Zyb21TcHJpdGVTaGVldChcclxuXHRcdFx0XHRjdHgsIFxyXG5cdFx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdFx0Y2xvdWQsXHJcblx0XHRcdFx0bmV3IFJlY3QocC54LHAueSwgY2xvdWQud2lkdGgsIGNsb3VkLmhlaWdodClcclxuXHRcdFx0KTtcdFxyXG5cdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdFxyXG5cdFx0Ly9yb2JvdFxyXG5cdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRjdHgsIFxyXG5cdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRuZXcgUmVjdCgzOTMsMCwyMzEsMjI4KSxcclxuXHRcdFx0bmV3IFJlY3QodGhpcy5nZXRSb2JvdFRvcExlZnQoY2xvdWRTdGF0ZSkueCx0aGlzLmdldFJvYm90VG9wTGVmdChjbG91ZFN0YXRlKS55LDIzMSwyMjgpXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0IH0gXHJcbiAgXHJcblx0Y29tcGxldGUgKCl7XHJcblx0XHR0aGlzLl9pc0NvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdHRoaXMuX2NvbXBsZXRlQXQgPSB0aGlzLnRpbWVyUHJvZ3Jlc3M7XHJcblx0XHR0aGlzLl90aWNrU2luY2VDb21wbGV0ZSA9MDtcclxuXHR9XHJcbiBcclxuXHRnZXQgaXNDb21wbGV0ZSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzQ29tcGxldGU7XHJcblx0fVxyXG5cdFxyXG4gICAgXHJcbiAgY2xpY2soeCx5KXtcclxuXHQvL2RpZCB3ZSBjbGljayBpbnNpZGUgdGhlIGJhbGxvbj8gIFxyXG5cdGlmKHRoaXMuYmFsbG9vblJlY3QuY29udGFpbnMobmV3IFBvaW50KHgseSkpKXtcclxuXHRcdC8vaGl0XHJcblx0XHRjb25zb2xlLmxvZyhcImhpdFwiKTsgXHJcblx0XHR0aGlzLmNvbXBsZXRlKCk7XHJcblx0XHR0aGlzLnNvbHZlKHt4LHksIHByb2dyZXNzIDogdGhpcy50aW1lclByb2dyZXNzfSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8vbWlzc1xyXG5cdFx0Y29uc29sZS5sb2coXCJtaXNzXCIpO1xyXG5cdH1cclxuICB9XHJcbn0gXHJcblxyXG4vKlxyXG5PSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRIID0gXCJodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby90LTI2NS9zcHJpdGVzaGVldDEucG5nXCI7XHJcbiBcclxudmFyIGNvbnRhaW5lciA9IG5ldyBPSkNhcHRjaGFDb250YWluZXIoJChcIiNvai1jYXB0Y2hhLWNvbnRhaW5lclwiKSk7XHJcbmNvbnRhaW5lci5pbml0KFtPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTFdKTsgKi8iLCJjbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTIgZXh0ZW5kcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIHsgXHJcbiAgXHJcblx0Y29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuXHRcdHN1cGVyKHJhbmRvbVNlZWQsIGFzc2V0cyk7XHJcblx0fVxyXG4gICAgXHJcblx0Z2V0IG1heER1cmF0aW9uKCl7XHJcblx0XHRyZXR1cm4gNTAwMDtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHdpbmRTaWRlKCl7XHJcblx0XHRpZighdGhpcy5fc2lkZSkgdGhpcy5fc2lkZSA9IHBhcnNlSW50KCh0aGlzLnJhbmRvbVNlZWQgKyBcIlwiKS5jaGFyQXQoMikpIDwgNSA/IFwibGVmdFwiIDogXCJyaWdodFwiO1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NpZGU7XHJcblx0fVxyXG4gIFxyXG5cdGdldCB0aW1lclByb2dyZXNzKCl7XHJcblx0XHRyZXR1cm4gTWF0aC5taW4odGhpcy5fdGltZXJQcm9ncmVzcyB8fCAwLDEwMCk7XHJcblx0fVxyXG4gIFxyXG5cdHNldCB0aW1lclByb2dyZXNzKHRvKXtcclxuXHRcdHRoaXMuX3RpbWVyUHJvZ3Jlc3MgPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IHpvb21Qcm9ncmVzcygpe1xyXG5cdFx0cmV0dXJuIE1hdGgubWluKDEsdGhpcy5fdGltZXJQcm9ncmVzcyAvIDAuMik7XHJcblx0fVxyXG5cdFxyXG5cdGdldCBrZXlCYXNlUG9zKCl7XHJcblx0XHR2YXIgcm9ib3QgPSB0aGlzLnJvYm90Wm9vbURhdGE7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KFxyXG5cdFx0XHRyb2JvdC54ICsgMTIxLFxyXG5cdFx0XHRyb2JvdC55ICsgMzUwKTtcclxuXHR9XHJcbiAgXHJcblx0Z2V0IHN0YXRlKCl7XHJcblx0XHRcclxuXHRcdHJldHVybiBcInpvb21pbmdcIjtcclxuXHRcdFxyXG5cdFx0aWYodGhpcy56b29tUHJvZ3Jlc3MgPCAxKXtcclxuXHRcdFx0cmV0dXJuIFwiem9vbWluZ1wiO1xyXG5cdFx0fSBcclxuXHRcdGlmKCF0aGlzLl9pbnNlcnRlZCkgcmV0dXJuIFwiaW5zZXJ0aW5nXCI7XHJcblx0XHRyZXR1cm4gXCJ3aW5kaW5nXCI7XHJcblx0fVxyXG5cdFxyXG5cdGdldCByb2JvdFNwcml0ZVNoZWV0UmVjdCgpe1xyXG5cdFx0cmV0dXJuIG5ldyBSZWN0KDAsMCwzNTgsNTI2KTtcclxuXHR9XHJcblx0XHJcblx0ZHJhd1JvYm90KGN0eCx4LHksc2NhbGUpe1xyXG5cdFx0dmFyIGN1dE91dCA9IHRoaXMucm9ib3RTcHJpdGVTaGVldFJlY3Q7XHJcblx0XHRcclxuXHRcdHRoaXMuZHJhd0Zyb21TcHJpdGVTaGVldChcclxuXHRcdFx0XHRjdHgsIFxyXG5cdFx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMi5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdFx0Y3V0T3V0LFxyXG5cdFx0XHRcdG5ldyBSZWN0KHgseSwgY3V0T3V0LndpZHRoICogc2NhbGUsIGN1dE91dC5oZWlnaHQgKiBzY2FsZSlcclxuXHRcdFx0KTtcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdGdldCByb2JvdFpvb21EYXRhKCl7XHJcblx0XHRpZighdGhpcy5fcm9ib3Rab29tRGF0YSl7XHJcblx0XHRcdHRoaXMuX3JvYm90Wm9vbURhdGEgPSB7IFxyXG5cdFx0XHRcdHg6IDEwMCxcclxuXHRcdFx0XHR5OiAtNTAsXHJcblx0XHRcdFx0c2NhbGUgOiAxLjJcclxuXHRcdFx0fVxyXG5cdFx0fVx0XHJcblx0XHRyZXR1cm4gdGhpcy5fcm9ib3Rab29tRGF0YTtcclxuXHR9XHJcbiAgXHJcblx0dGljayhjdHgsIG1zKXtcclxuXHRcdHN1cGVyLnRpY2soY3R4LCBtcyk7IFxyXG5cdFx0XHJcblx0XHR0aGlzLnRpbWVyUHJvZ3Jlc3MgPSBtcyAvIHRoaXMubWF4RHVyYXRpb247XHJcblx0XHRcdFxyXG5cdFx0Ly9za3lcclxuXHRcdHZhciBncmQ9Y3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsMCwwLDQwMCk7XHJcblx0XHRncmQuYWRkQ29sb3JTdG9wKDAsXCIjNWRiMWZmXCIpO1xyXG5cdFx0Z3JkLmFkZENvbG9yU3RvcCgxLFwiI2JjZGRmZlwiKTtcclxuXHRcdGN0eC5maWxsU3R5bGU9Z3JkO1xyXG5cdFx0Y3R4LmZpbGxSZWN0KDAsMCw0MDAsNDAwKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5kcmF3KGN0eCk7XHJcblx0XHRcclxuXHR9IFxyXG5cdFxyXG5cdGRyYXcoY3R4KXtcclxuXHRcdFxyXG5cdFx0Ly96b29tIGNvbXBsZXRlLCBkcmF3IGtleVxyXG5cdFx0aWYodGhpcy56b29tUHJvZ3Jlc3MgPj0gMSkgdGhpcy5kcmF3S2V5KGN0eCk7XHJcblx0XHRcclxuXHRcdC8vZHJhdyByb2JvdFxyXG5cdFx0dmFyIGNlbnRlciA9IG5ldyBQb2ludCh3aW5kb3cuQ09OU1QuQ0FOVkFTX1dJRFRIIC8yLCB3aW5kb3cuQ09OU1QuQ0FOVkFTX0hFSUdIVCAvMik7IFxyXG5cdFx0XHJcblx0XHR2YXIgY2FudmFzID0gbmV3IFJlY3QoMCwwLHdpbmRvdy5DT05TVC5DQU5WQVNfV0lEVEgsIHdpbmRvdy5DT05TVC5DQU5WQVNfSEVJR0hUKTsgXHJcblx0XHRcclxuXHRcdHZhciByb2JvdFJlY3QgPSB0aGlzLnJvYm90U3ByaXRlU2hlZXRSZWN0O1xyXG5cdFx0XHJcblx0XHR2YXIgaW5pdGlhbFNjYWxlID0gMC40O1xyXG5cdFx0XHJcblx0XHRyb2JvdFJlY3Qud2lkdGggKj0gaW5pdGlhbFNjYWxlO1xyXG5cdFx0cm9ib3RSZWN0LmhlaWdodCAqPSBpbml0aWFsU2NhbGU7IFxyXG5cdFx0XHJcblx0XHR2YXIgcm9ib3RTdGFydFJlY3QgPSBuZXcgUmVjdCggKCBjYW52YXMud2lkdGggLSByb2JvdFJlY3Qud2lkdGgpICogLjUsIChjYW52YXMuaGVpZ2h0IC0gcm9ib3RSZWN0LmhlaWdodCksIHJvYm90UmVjdC53aWR0aCwgcm9ib3RSZWN0LmhlaWdodCk7XHJcblx0XHRcclxuXHRcdHZhciByb2JvdEVuZCA9IHRoaXMucm9ib3Rab29tRGF0YTsgXHJcblx0XHRcclxuXHRcdHZhciB0b3BMZWZ0ID0gbmV3IFBvaW50KHJvYm90U3RhcnRSZWN0LngsIHJvYm90U3RhcnRSZWN0LnkpLmludGVycG9sYXRlKG5ldyBQb2ludChyb2JvdEVuZC54LCByb2JvdEVuZC55KSwgdGhpcy56b29tUHJvZ3Jlc3MpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmRyYXdSb2JvdChjdHgsIHRvcExlZnQueCwgdG9wTGVmdC55LCByb2JvdEVuZC5zY2FsZSAqIHRoaXMuem9vbVByb2dyZXNzKTtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRnZXRLZXlSZWN0KGZyYW1lKXtcclxuXHRcdHJldHVybiBuZXcgUmVjdCg0MDcsMCw4NCw3NCk7XHJcblx0fVxyXG5cdFxyXG5cdGRyYXdLZXkoY3R4KXtcclxuXHRcdFxyXG5cdFx0dmFyIGJhc2VQb3MgPSB0aGlzLmtleUJhc2VQb3M7XHJcblx0XHR2YXIgc2NhbGUgPSB0aGlzLnJvYm90Wm9vbURhdGEuc2NhbGU7XHJcblx0XHR2YXIgZnJhbWVSZWN0ID0gdGhpcy5nZXRLZXlSZWN0KDApO1xyXG5cdFx0dmFyIGRyYXdSZWN0ID0gbmV3IFJlY3QoYmFzZVBvcy54LCBiYXNlUG9zLnksIGZyYW1lUmVjdC53aWR0aCAqIHNjYWxlLCBmcmFtZVJlY3QuaGVpZ2h0ICogc2NhbGUpO1xyXG5cdFx0XHJcblx0XHRkcmF3UmVjdC54IC09IGRyYXdSZWN0LndpZHRoO1xyXG5cdFx0ZHJhd1JlY3QueSAtPSBkcmF3UmVjdC5oZWlnaHQgLzI7XHJcblx0XHRcclxuXHRcdGRyYXdSZWN0LnggKz0gdGhpcy5nZXRJbnNlcnRPZmZzZXQoKTtcclxuXHRcdFxyXG5cdFxyXG5cdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRjdHgsIFxyXG5cdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTIucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRmcmFtZVJlY3QsXHJcblx0XHRcdGRyYXdSZWN0XHJcblx0XHQpO1x0XHJcblx0fVxyXG5cdFxyXG5cdGdldEluc2VydE9mZnNldCgpIHtcclxuXHRcdGlmKHRoaXMuX2luc2VydGVkKSByZXR1cm4gMzA7XHJcblx0XHRpZih0aGlzLl9pbnNlcnRNb3VzZURvd24pe1xyXG5cdFx0XHR2YXIgbnVtID0gTWF0aC5tYXgoLTEwMCwgTWF0aC5taW4oMzAsIHRoaXMubGFzdE1vdXNlLnggLSB0aGlzLl9pbnNlcnRNb3VzZURvd25YIC0xMDApKTtcclxuXHRcdFx0Y29uc29sZS5sb2cobnVtKTtcclxuXHRcdFx0cmV0dXJuIG51bTsgXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gLTEwMDtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZHJhd0tleV9pbnNlcnRpbmcoY3R4KXtcclxuXHRcdFxyXG5cdFx0Ly90aGlzLmRyYXdLZXkoY3R4LCBiYXNlUG9zLngsIGJhc2VQb3MueSwgMClcclxuXHR9XHJcblx0XHJcblx0ZHJhd0tleV93aW5kaW5nKGN0eCl7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0bW91c2Vkb3duKHgseSl7XHJcblx0XHQvLy9jb25zb2xlLmxvZyhcIm1vdXNlIGRvd246IFwiKyB4ICsgXCIsIFwiICsgeSArIFwiLCBkaXN0YW5jZTogXCIrIHRoaXMua2V5QmFzZVBvcy5kaXN0YW5jZVRvKG5ldyBQb2ludCh4LHkpKSlcclxuXHRcdC8vZGlzdGFuY2UgdG8gYmFzZXBvc1xyXG5cdFx0aWYodGhpcy5rZXlCYXNlUG9zLmRpc3RhbmNlVG8obmV3IFBvaW50KHgtdGhpcy5nZXRJbnNlcnRPZmZzZXQoKSx5KSkgPCAxMDApe1xyXG5cdFx0XHR0aGlzLl9pbnNlcnRNb3VzZURvd24gPSB0cnVlO1xyXG5cdFx0XHR0aGlzLl9pbnNlcnRNb3VzZURvd25YID0geDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2luc2VydE1vdXNlRG93biA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQgXHJcblx0bW91c2V1cCgpe1xyXG5cdFx0aWYodGhpcy5nZXRJbnNlcnRPZmZzZXQoKSA+IDIwKSB7XHJcblx0XHRcdHRoaXMuX2luc2VydGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX2luc2VydE1vdXNlRG93biA9IGZhbHNlO1xyXG5cdH1cclxuXHQgIFxyXG5cdGNvbXBsZXRlKCl7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbiBcclxuXHRjbGljayh4LHkpe1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG59IFxyXG5cclxuXHJcbk9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMi5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEggPSBcImh0dHBzOi8vczMtdXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vcy5jZHBuLmlvL3QtMjY1L2dhbWVfc3ByaXRlc2hlZXRfMi5wbmdcIjtcclxuIFxyXG52YXIgY29udGFpbmVyID0gbmV3IE9KQ2FwdGNoYUNvbnRhaW5lcigkKFwiI29qLWNhcHRjaGEtY29udGFpbmVyXCIpKTtcclxuY29udGFpbmVyLmluaXQoW09KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMl0pOyAiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
