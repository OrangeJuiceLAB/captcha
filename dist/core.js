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
		key: "angularDistance",
		value: function angularDistance(angle, distance) {
			return new Point(this.x + Math.cos(angle) * distance, this.y + Math.sin(angle) * distance);
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
	}, {
		key: "right",
		get: function get() {
			return this.x + this.width;
		}
	}, {
		key: "bottom",
		get: function get() {
			return this.y + this.height;
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
			var robotDrawRect = new Rect(x, y, cutOut.width * scale, cutOut.height * scale);

			//draw arm
			var armCutout = this.armSpriteSheetRect;

			var offset = new Point(robotDrawRect.x, robotDrawRect.y);

			ctx.save();

			ctx.translate(x + 10 * scale, y + 176 * scale);

			ctx.rotate(this.robotArmRotationDEG * (Math.PI / 180));

			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH, armCutout,
			//new Rect(-100,-100,armCutout.width, armCutout.height)
			new Rect(-armCutout.width / 2 * scale, -(armCutout.height * scale), armCutout.width * scale, armCutout.height * scale));

			ctx.restore();

			//draw robot on top
			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH, cutOut, robotDrawRect);

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

			this.keyTurnUpdate();

			this.draw(ctx, ms);
		}
	}, {
		key: "draw",
		value: function draw(ctx, ms) {

			if (this.zoomProgress >= 1) {
				this.drawKey(ctx);
			}
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

			//zoom complete, draw key
			if (this.zoomProgress >= 1) {
				this.drawArrow(ctx, ms);
			}
		}
	}, {
		key: "getKeyRect",
		value: function getKeyRect(frame) {

			if (!this._keyRectFramesCache) {
				this._keyRectFramesCache = [new Rect(407, 0, 84, 74), new Rect(407, 74, 84, 68), new Rect(407, 141, 84, 41), new Rect(407, 182, 84, 27), new Rect(407, 209, 84, 19)];
			}
			return this._keyRectFramesCache[frame === undefined ? this.drawKeyFrame : frame];
		}
	}, {
		key: "drawKey",
		value: function drawKey(ctx) {

			var frameRect = this.getKeyRect(this.drawKeyFrame);

			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH, frameRect, this.drawKeyRect);
		}
	}, {
		key: "getInsertOffset",
		value: function getInsertOffset() {
			if (this._inserted) return 30;
			if (this._insertMouseDown) {
				var num = Math.max(-100, Math.min(30, this.lastMouse.x - this._mouseDown.x - 100));
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
		key: "keyTurningCenter",
		value: function keyTurningCenter() {
			if (!this._keyTurning) return false;
			return this._mouseDown.clone().offset(-50, 0);
		}
	}, {
		key: "keyTurnUpdate",
		value: function keyTurnUpdate() {
			if (!this._keyTurning) return;
			//the percentage of completeness of the turning of the key		
			this._keyTurning.pct = Math.min(1, Math.max(0, (this.lastMouse.y - this._keyTurning.start.y) / (this._keyTurning.end.y - this._keyTurning.start.y)));

			if (this._keyTurning.pct >= 1) {
				this.keyTurnComplete();
			}
		}
	}, {
		key: "keyTurnComplete",
		value: function keyTurnComplete() {
			if (!this._keyTurnCount) this._keyTurnCount = 0;
			++this._keyTurnCount;
			this.mouseup();
		}

		//arrow

	}, {
		key: "drawArrow",
		value: function drawArrow(ctx, ms) {

			var src = this.arrowSpriteSheetRect;
			var keyRect = this.drawKeyRect;

			var animationDuration = 700;
			var animationProgress = ms % animationDuration / animationDuration;
			var animationLoop = animationProgress <= 0.5 ? animationProgress : 0.5 - Math.max(0, animationProgress - 0.5);
			var scale = 0.55 + 0.1 * animationLoop;

			if (!this._inserted) {
				//draw right next to the key

				if (this._mouseDown) return;

				var height = src.height * scale;

				this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH, src, new Rect(keyRect.right + animationLoop * 50, keyRect.y + (keyRect.height - height) / 2, src.width * scale, height));
			} else {

				var height = src.height * scale;
				var width = src.width * scale;
				var x = keyRect.x - width / 2;
				var y = keyRect.y + keyRect.height / 2;

				ctx.save();

				ctx.translate(x, y);
				ctx.rotate(90 * (Math.PI / 180));

				this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH, src, new Rect(-width / 2, -height / 2, width, height));

				ctx.restore();
			}
		}
	}, {
		key: "mousedown",
		value: function mousedown(x, y) {
			///console.log("mouse down: "+ x + ", " + y + ", distance: "+ this.keyBasePos.distanceTo(new Point(x,y)))
			//distance to basepos
			this._mouseDown = new Point(x, y);

			this._insertMouseDown = false;
			this._keyTurning = false;

			if (!this._inserted) {
				if (this.drawKeyRect.contains(new Point(x, y))) {
					//this.keyBasePos.distanceTo(new Point(x-this.getInsertOffset(),y)) < 50){
					this._insertMouseDown = true;
				}
			} else {

				//key is inserted, swipe it down a couple of time to turn
				var targetRect = this.drawKeyRect;

				if (Math.abs(targetRect.y - y) < 50) {
					this._keyTurning = {
						start: new Point(x, y),
						end: new Point(x, y + 75),
						pct: 0
					};
				}
			}
		}
	}, {
		key: "mouseup",
		value: function mouseup() {
			if (this.getInsertOffset() > 20) {
				this._inserted = true;
			}

			this._insertMouseDown = false;
			this._keyTurning = false;
			this._mouseDown = false;
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
		key: "keyTurnMax",
		get: function get() {
			return parseInt((this.randomSeed + "").charAt(6));
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
		key: "keyTurnCount",
		get: function get() {
			return this._keyTurnCount || 0;
		}
	}, {
		key: "robotArmRotationDEG",
		get: function get() {
			if (!this._inserted) return -90;else return 180 + 10 * this.keyTurnCount;
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
	}, {
		key: "armSpriteSheetRect",
		get: function get() {
			return new Rect(362, 0, 45, 171);
		}
	}, {
		key: "arrowSpriteSheetRect",
		get: function get() {
			return new Rect(362, 229, 129, 98);
		}
	}, {
		key: "drawKeyFrame",
		get: function get() {
			if (!this._keyTurning) return 0;

			var val = Math.min(8, Math.max(0, Math.round(8 * this._keyTurning.pct)));

			var frame = val < 5 ? val : 4 - Math.max(0, val - 4);

			return frame;
		}
	}, {
		key: "drawKeyRect",
		get: function get() {
			var basePos = this.keyBasePos;
			var scale = this.robotZoomData.scale;
			var frameRect = this.getKeyRect(this.drawKeyFrame);
			if (!frameRect) debugger;
			var drawRect = new Rect(basePos.x, basePos.y, frameRect.width * scale, frameRect.height * scale);

			drawRect.x -= drawRect.width;
			drawRect.y -= drawRect.height / 2;

			drawRect.x += this.getInsertOffset();

			return drawRect;
		}
	}]);

	return OJCaptchaMicroGame_game2;
}(OJCaptchaMicroGameBase);

OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/game_spritesheet_2.png";

var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_game2]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYmFzZS5qcyIsImdhbWVzLzEuanMiLCJnYW1lcy8yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxTQUVKLFNBRkksTUFFSixHQUFhO3VCQUZULFFBRVM7Q0FBYjs7QUFNRixPQUFPLEtBQVAsR0FBZTtBQUNkLGVBQWUsR0FBZjtBQUNBLGdCQUFlLEdBQWY7Q0FGRDs7SUFLTTs7O0FBQ0wsVUFESyxLQUNMLENBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0I7d0JBRFgsT0FDVzs7cUVBRFgsbUJBQ1c7O0FBRWYsUUFBSyxFQUFMLEdBQVUsQ0FBVixDQUZlO0FBR2YsUUFBSyxFQUFMLEdBQVUsQ0FBVixDQUhlOztFQUFoQjs7Y0FESzs7OEJBMkJPLElBQUksTUFDaEI7QUFDQyxVQUFPLElBQUksS0FBSixDQUFVLEtBQUssQ0FBTCxHQUFPLENBQUMsR0FBRyxDQUFILEdBQUssS0FBSyxDQUFMLENBQU4sR0FBYyxJQUFkLEVBQW9CLEtBQUssQ0FBTCxHQUFPLENBQUMsR0FBRyxDQUFILEdBQUssS0FBSyxDQUFMLENBQU4sR0FBYyxJQUFkLENBQW5ELENBREQ7Ozs7eUJBSU8sR0FBRSxHQUFFO0FBQ1YsT0FBRyxFQUFFLE9BQUYsRUFBVztBQUNiLFNBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBRixDQURHO0FBRWIsU0FBSyxDQUFMLElBQVUsRUFBRSxDQUFGLENBRkc7SUFBZCxNQUdPO0FBQ04sU0FBSyxDQUFMLElBQVUsQ0FBVixDQURNO0FBRU4sU0FBSyxDQUFMLElBQVUsQ0FBVixDQUZNO0lBSFA7QUFPQSxVQUFPLElBQVAsQ0FSVTs7Ozs2QkFXQSxJQUFHO0FBQ2IsVUFBTyxLQUFLLElBQUwsQ0FBVyxLQUFLLEdBQUwsQ0FBVSxLQUFLLENBQUwsR0FBTyxHQUFHLENBQUgsRUFBTyxDQUF4QixJQUE2QixLQUFLLEdBQUwsQ0FBVSxLQUFLLENBQUwsR0FBTyxHQUFHLENBQUgsRUFBTyxDQUF4QixDQUE3QixDQUFsQixDQURhOzs7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QUFRLENBQVIsRUFBVyxVQUFVLEtBQVYsR0FBa0IsS0FBbEIsRUFBeUIsVUFBVSxNQUFWLEdBQW1CLEtBQW5CLENBQW5FLENBTFk7O0FBT2hCLFlBQVMsQ0FBVCxJQUFjLFNBQVMsS0FBVCxDQVBFO0FBUWhCLFlBQVMsQ0FBVCxJQUFjLFNBQVMsTUFBVCxHQUFpQixDQUFqQixDQVJFOztBQVVoQixZQUFTLENBQVQsSUFBYyxLQUFLLGVBQUwsRUFBZCxDQVZnQjs7QUFZaEIsVUFBTyxRQUFQLENBWmdCOzs7O1FBeE1aO0VBQWlDOztBQStXdkMseUJBQXlCLFNBQXpCLENBQW1DLGlCQUFuQyxHQUF1RCwyRUFBdkQ7O0FBRUEsSUFBSSxZQUFZLElBQUksa0JBQUosQ0FBdUIsRUFBRSx1QkFBRixDQUF2QixDQUFaO0FBQ0osVUFBVSxJQUFWLENBQWUsQ0FBQyx3QkFBRCxDQUFmIiwiZmlsZSI6ImNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBPSkJhc2Uge1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBcclxuICB9XHJcbiAgXHJcbn1cclxuXHJcbndpbmRvdy5DT05TVCA9IHtcclxuXHRDQU5WQVNfV0lEVEggOiA0MDAsIFxyXG5cdENBTlZBU19IRUlHSFQ6IDQwMFxyXG59XHJcblxyXG5jbGFzcyBQb2ludCBleHRlbmRzIE9KQmFzZSB7XHJcblx0Y29uc3RydWN0b3IoeCx5KXtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLl94ID0geDtcclxuXHRcdHRoaXMuX3kgPSB5O1xyXG5cdH1cclxuXHRcclxuXHRnZXQgaXNQb2ludCgpe1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdGdldCB4KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5feDtcclxuXHR9XHJcblx0XHJcblx0c2V0IHgodG8pe1xyXG5cdFx0dGhpcy5feCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3k7IFxyXG5cdH1cclxuXHRcclxuXHRzZXQgeSh0byl7XHJcblx0XHR0aGlzLl95ID0gdG87XHJcblx0fVxyXG5cdFxyXG5cdGludGVycG9sYXRlKHRvLCBmcmFjKSBcclxuXHR7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KHRoaXMueCsodG8ueC10aGlzLngpKmZyYWMsIHRoaXMueSsodG8ueS10aGlzLnkpKmZyYWMpO1xyXG5cdH1cclxuXHRcclxuXHRvZmZzZXQoeCx5KXtcclxuXHRcdGlmKHguaXNQb2ludCkge1xyXG5cdFx0XHR0aGlzLnggKz0geC54O1xyXG5cdFx0XHR0aGlzLnkgKz0geC55O1xyXG5cdFx0fSBlbHNlIHsgXHJcblx0XHRcdHRoaXMueCArPSB4O1xyXG5cdFx0XHR0aGlzLnkgKz0geTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHRkaXN0YW5jZVRvKHAyKXtcclxuXHRcdHJldHVybiBNYXRoLnNxcnQoIE1hdGgucG93KCh0aGlzLngtcDIueCksIDIpICsgTWF0aC5wb3coKHRoaXMueS1wMi55KSwgMikgKTtcclxuXHR9XHJcblx0XHJcblx0YW5ndWxhckRpc3RhbmNlKGFuZ2xlLCBkaXN0YW5jZSl7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KFxyXG5cdFx0XHR0aGlzLnggKyBNYXRoLmNvcyhhbmdsZSkgKiBkaXN0YW5jZSxcclxuXHRcdFx0dGhpcy55ICsgTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2VcclxuXHRcdCk7XHJcblx0fVxyXG5cdFxyXG5cdGNsb25lKCl7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFJlY3QgZXh0ZW5kcyBQb2ludCB7XHJcblx0Y29uc3RydWN0b3IoeCx5LHdpZHRoLGhlaWdodCl7XHJcblx0XHRzdXBlcih4LHkpO1xyXG5cdFx0dGhpcy5fd2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuX2hlaWdodCA9IGhlaWdodDtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHdpZHRoKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xyXG5cdH1cclxuXHRcclxuXHRzZXQgd2lkdGgodG8pe1xyXG5cdFx0dGhpcy5fd2lkdGggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IGhlaWdodCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX2hlaWdodDtcclxuXHR9XHJcblx0XHJcblx0c2V0IGhlaWdodCh0byl7XHJcblx0XHR0aGlzLl9oZWlnaHQgPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IHJpZ2h0KCl7XHJcblx0XHRyZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aDtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGJvdHRvbSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0O1xyXG5cdH1cclxuXHRcclxuXHRjb250YWlucyhwKXtcdFx0XHJcblx0XHRyZXR1cm4gKHAueCA+PSB0aGlzLnggJiYgcC54IDw9IHRoaXMueCArIHRoaXMud2lkdGggJiYgcC55ID49IHRoaXMueSAmJiBwLnkgPD0gdGhpcy55ICsgdGhpcy5oZWlnaHQpO1xyXG5cdH1cclxuXHRcclxuXHRjbG9uZSgpe1xyXG5cdFx0cmV0dXJuIG5ldyBSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFCYXNlIGV4dGVuZHMgT0pCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcbn0gXHJcblxyXG5jbGFzcyBPSkNhcHRjaGFDb250YWluZXIgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigkc3JjKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl8kc3JjID0gJHNyYztcclxuXHR0aGlzLmltYWdlQXNzZXRzID0gW107XHJcbiAgfVxyXG4gIFxyXG4gIGdldCAkc3JjKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fJHNyYzsgXHJcbiAgfVxyXG4gIFxyXG4gIGdldCBhY3RpdmVHYW1lKCl7XHJcbiAgICBpZighdGhpcy5fYWN0aXZlR2FtZSl7XHJcblx0XHRcclxuXHQgIC8vY3JlYXRlIGEgMTYgY2hhciByYW5kb21TZWVkXHJcblx0ICB0aGlzLl9hY3RpdmVTZWVkID0gXy50aW1lcygxNiwgKCkgPT4gXy5yYW5kb20oMCw5KSkuam9pbihcIlwiKTtcclxuXHQgIFxyXG5cdCAgLy9zdGFydCB0aGUgYWN0aXZlIGdhbWVcclxuICAgICAgdGhpcy5fYWN0aXZlR2FtZSA9IG5ldyB0aGlzLl9nYW1lc1F1ZXVlWzBdKHRoaXMuX2FjdGl2ZVNlZWQsIHRoaXMuaW1hZ2VBc3NldHMpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlR2FtZTtcclxuICB9XHJcbiAgXHJcbiAgaW5pdChnYW1lc0Fycil7XHJcblx0ICBcclxuICAgIHRoaXMuX2dhbWVzUXVldWUgPSBnYW1lc0FycjtcclxuXHRcclxuXHR0aGlzLmxvYWRBc3NldHMoKVxyXG5cdFx0LnRoZW4odGhpcy5zdGFydC5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgbG9hZEFzc2V0cygpe1xyXG5cdFx0Y29uc29sZS5sb2coXCJsb2FkQXNzZXRzXCIpO1xyXG5cdCAgLy9nZXQgc3ByaXRlc2hlZXRzIGZyb20gZ2FtZSBjbGFzc2VzXHJcblx0ICAgXy5mb3JFYWNoKHRoaXMuX2dhbWVzUXVldWUsIChnKSA9PiB7XHJcblx0XHQgIGxldCB1cmwgPSBnLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSDtcclxuXHRcdCAgY29uc29sZS5sb2coXCJsb2FkIDogXCIgKyB1cmwpO1xyXG5cdFx0ICBpZih1cmwgJiYgISh1cmwgaW4gdGhpcy5pbWFnZUFzc2V0cykpe1xyXG5cdFx0XHQgIHRoaXMuaW1hZ2VBc3NldHMucHVzaCh7IHVybCAsIGltYWdlIDogbmV3IEltYWdlKCl9KTtcclxuXHRcdCAgfVxyXG5cdCAgfSwgdGhpcyk7XHJcblxyXG5cdCAgLy9sb2FkIHNpbmdsZSBzcHJpdGVzaGVldCBpbWFnZVxyXG5cdCAgbGV0IGxvYWRTcHJpdGVTaGVldCA9IChzcHJpdGVTaGVldCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0c3ByaXRlU2hlZXQuaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHNwcml0ZVNoZWV0LmNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC53aWR0aCA9IHNwcml0ZVNoZWV0LmltYWdlLm5hdHVyYWxXaWR0aDtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC5oZWlnaHQgPSBzcHJpdGVTaGVldC5pbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzcHJpdGVTaGVldC5pbWFnZS5zcmMgPSBzcHJpdGVTaGVldC51cmw7XHJcblx0XHR9KTtcclxuXHQgIH1cclxuXHQgIFxyXG5cdCAgLy9yZWN1cnNpdmUgY2xvc3VyZSB0aGF0IGxvYWRzIGFsbCBzcHJlYWRzaGVldHMgZnJvbSBxdWV1ZVxyXG5cdCAgbGV0IGxvYWRlciA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRsZXQgbmV4dCA9IF8uZmluZCh0aGlzLmltYWdlQXNzZXRzLCBhID0+ICFhLmNvbXBsZXRlKTtcclxuXHRcdGlmKCFuZXh0KSByZXR1cm4gcmVzb2x2ZSgpO1xyXG5cdFx0bG9hZFNwcml0ZVNoZWV0KG5leHQpLnRoZW4oICgpID0+IGxvYWRlcihyZXNvbHZlLHJlamVjdCkpO1xyXG5cdCAgfS5iaW5kKHRoaXMpO1xyXG5cdCAgXHJcblx0ICByZXR1cm4gbmV3IFByb21pc2UobG9hZGVyKTtcclxuICB9XHJcbiAgXHJcbiAgYnVpbGQoKXtcclxuICAgIHRoaXMuaXNCdWlsZCA9IHRydWU7XHJcbiAgICB0aGlzLiRjYW52YXMgPSAkKFwiPGNhbnZhcyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzQwMCc+PC9jYW52YXM+XCIpO1xyXG5cdHRoaXMuJGNhbnZhcy5tb3VzZW1vdmUodGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSk7XHJcblx0dGhpcy4kY2FudmFzLm1vdXNlZG93bih0aGlzLm1vdXNlZG93bi5iaW5kKHRoaXMpKTtcclxuXHR0aGlzLiRjYW52YXMubW91c2V1cCh0aGlzLm1vdXNldXAuYmluZCh0aGlzKSk7XHJcblx0dGhpcy4kY2FudmFzLmNsaWNrKHRoaXMuY2FudmFzY2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhc1swXS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB0aGlzLl8kc3JjLmFwcGVuZCh0aGlzLiRjYW52YXMpOyBcclxuICB9XHJcbiAgXHJcbiAgc3RhcnQoKXtcclxuXHQgIGNvbnNvbGUubG9nKFwiYXNzZXRzIGxvYWRlZFwiKTtcclxuICAgIGlmKCF0aGlzLmlzQnVpbHQpIHRoaXMuYnVpbGQoKTtcclxuICAgIC8vdGlja1xyXG5cdHRoaXMuX3N0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7ICBcclxuICB9XHJcbiAgXHJcbiAgdGljayh0aW1lU3RhbXApe1xyXG4gICAgdGhpcy5hY3RpdmVHYW1lLnRpY2sodGhpcy5jdHgsIHRpbWVTdGFtcCAtIHRoaXMuX3N0YXJ0VGltZSk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgY2FudmFzY2xpY2soZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5jbGljayhldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlbW92ZShldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLm1vdXNlTW92ZShldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xyXG4gIH1cclxuICBcclxuICBtb3VzZWRvd24oZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5tb3VzZWRvd24oZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcclxuICB9XHJcbiAgXHJcbiAgbW91c2V1cChldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLm1vdXNldXAoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcclxuICB9XHJcbiAgXHJcbn1cclxuXHJcbmNsYXNzIE9KQ2FwdGNoYU1pY3JvR2FtZUJhc2UgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuXHRcclxuICBjb25zdHJ1Y3RvcihyYW5kb21TZWVkLCBhc3NldHMpe1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuX3JhbmRvbVNlZWQgPSByYW5kb21TZWVkO1xyXG5cdHRoaXMuX2Fzc2V0cyA9IGFzc2V0cztcclxuXHR0aGlzLl9mcmFtZXMgPSB7fTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IHJhbmRvbVNlZWQoKXtcclxuICAgIHJldHVybiB0aGlzLl9yYW5kb21TZWVkO1xyXG4gIH1cclxuICBcclxuICByZ2JhKHIsZyxiLGEpe1xyXG5cdCAgcmV0dXJuIFwicmdiYShcIiArIHIgK1wiLCBcIiArIGcgKyBcIiwgXCIgKyBiICsgXCIsIFwiICsgYSArXCIpXCI7XHJcbiAgfVxyXG4gIFxyXG4gIHRpY2soY3R4LCBtcyl7XHJcbiAgICBcclxuICB9IFxyXG4gIFxyXG4gIGNsaWNrKHgseSl7XHJcblx0IFxyXG4gIH1cclxuICBcclxuICBzb2x2ZSgpe1xyXG5cdCAgXHJcbiAgfVxyXG4gIFxyXG4gIGdldEFzc2V0KG5hbWUpe1xyXG5cdHJldHVybiBfLmZpbmQodGhpcy5fYXNzZXRzLCBhID0+IGEudXJsID09IG5hbWUpO1xyXG4gIH1cclxuICBcclxuICBkcmF3RnJvbVNwcml0ZUZyYW1lKGN0eCwgbmFtZSwgbnVtRnJhbWVzVywgbnVtRnJhbWVzSCwgZnJhbWVJbmRleCwgdGFyZ2V0WCwgdGFyZ2V0WSwgdGFyZ2V0VywgdGFyZ2V0SCl7XHJcblx0bGV0IGFzc2V0ID0gdGhpcy5nZXRBc3NldChuYW1lKSxcclxuXHRcdGZyYW1lVyA9IGFzc2V0LndpZHRoIC8gbnVtRnJhbWVzVyxcclxuXHRcdGZyYW1lSCA9IGFzc2V0LmhlaWdodCAvIG51bUZyYW1lc0gsIFxyXG5cdFx0ZnJhbWVZID0gTWF0aC5mbG9vcihmcmFtZUluZGV4IC8gbnVtRnJhbWVzVyksXHJcblx0XHRmcmFtZVggPSBmcmFtZUluZGV4IC0gKGZyYW1lWSAqIG51bUZyYW1lc1cpO1xyXG5cdFx0XHJcblx0Y3R4LmRyYXdJbWFnZShhc3NldC5pbWFnZSwgZnJhbWVYICogZnJhbWVXLCBmcmFtZVkgKiBmcmFtZUgsIGZyYW1lVywgZnJhbWVILCB0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRXLCB0YXJnZXRIKTtcclxuICB9XHJcbiAgXHJcbiAgZHJhd0Zyb21TcHJpdGVTaGVldChjdHgsIG5hbWUsIHNyY1JlY3QsIHRhcmdldFJlY3Qpe1xyXG5cdCAgbGV0IGFzc2V0ID0gdGhpcy5nZXRBc3NldChuYW1lKTtcclxuXHQgIGN0eC5kcmF3SW1hZ2UoYXNzZXQuaW1hZ2UsIHNyY1JlY3QueCwgc3JjUmVjdC55LCBzcmNSZWN0LndpZHRoLCBzcmNSZWN0LmhlaWdodCwgdGFyZ2V0UmVjdC54LCB0YXJnZXRSZWN0LnksIHRhcmdldFJlY3Qud2lkdGgsIHRhcmdldFJlY3QuaGVpZ2h0KTtcclxuXHQgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICBcclxuICBtb3VzZWRvd24oeCx5KXtcclxuXHQgIFxyXG4gIH1cclxuICBcclxuICBtb3VzZXVwKHgseSl7XHJcblx0ICBcclxuICB9XHJcbiAgXHJcbiAgbW91c2VNb3ZlKHgseSl7XHJcblx0dGhpcy5fbGFzdE1vdXNlID0gbmV3IFBvaW50KHgseSk7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCBsYXN0TW91c2UoKSB7XHJcblx0ICBpZighdGhpcy5fbGFzdE1vdXNlKSByZXR1cm4gbnVsbDtcclxuXHQgIHJldHVybiB0aGlzLl9sYXN0TW91c2UuY2xvbmUoKTtcclxuICB9XHJcbiAgXHJcbn1cdCIsImNsYXNzIE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMSBleHRlbmRzIE9KQ2FwdGNoYU1pY3JvR2FtZUJhc2UgeyBcclxuICBcclxuICBjb25zdHJ1Y3RvcihyYW5kb21TZWVkLCBhc3NldHMpe1xyXG4gICAgc3VwZXIocmFuZG9tU2VlZCwgYXNzZXRzKTtcclxuICB9XHJcbiAgICBcclxuICBnZXQgbWF4RHVyYXRpb24oKXtcclxuXHQgIHJldHVybiA1MDAwO1xyXG4gIH1cclxuICBcclxuICBnZXQgdGltZXJQcm9ncmVzcygpe1xyXG5cdCAgcmV0dXJuIE1hdGgubWluKHRoaXMuX3RpbWVyUHJvZ3Jlc3MgfHwgMCwxMDApO1xyXG4gIH1cclxuICBcclxuICBzZXQgdGltZXJQcm9ncmVzcyh0byl7XHJcblx0ICB0aGlzLl90aW1lclByb2dyZXNzID0gdG87XHJcbiAgfVxyXG4gIFxyXG4gIGdldCBnYW1lU3VjY2Vzc1Byb2dyZXNzKCl7XHJcblx0ICByZXR1cm4gdGhpcy5fZ2FtZVN1Y2Nlc3NQcm9ncmVzc3x8IDA7XHJcbiAgfVxyXG4gIFxyXG4gIHNldCBnYW1lU3VjY2Vzc1Byb2dyZXNzKHRvKXtcclxuXHQgIHRoaXMuX2dhbWVTdWNjZXNzUHJvZ3Jlc3MgPSB0bztcclxuICB9XHJcbiAgXHJcbiAgZ2V0IHJvYm90U3RhcnRUb3BMZWZ0KCl7XHJcblx0ICBcclxuXHRpZighdGhpcy5fcm9ib3RTdGFydFRvcExlZnQpe1xyXG5cclxuXHRcdGxldCB4TWluID0gMCwgeE1heCA9IHdpbmRvdy5DT05TVC5DQU5WQVNfV0lEVEggLSAyMDAsXHJcblx0XHRcdHlNaW4gPSB3aW5kb3cuQ09OU1QuQ0FOVkFTX0hFSUdIVCAgKi4zLCB5TWF4ID0gd2luZG93LkNPTlNULkNBTlZBU19IRUlHSFQqMC42LFxyXG5cdFx0XHR4TGVuID0geE1heCAtIHhNaW4sXHJcblx0XHRcdHlMZW4gPSB5TWF4IC0geU1pbjtcclxuXHJcblx0XHR0aGlzLl9yb2JvdFN0YXJ0VG9wTGVmdCA9IG5ldyBQb2ludChcclxuXHRcdFx0TWF0aC5mbG9vcih4TWluICsgKHhMZW4gKiAoTnVtYmVyKHRoaXMucmFuZG9tU2VlZC5jaGFyQXQoMikvMTApKSkpLFxyXG5cdFx0XHRNYXRoLmZsb29yKHlNaW4gKyAoeUxlbiAqIChOdW1iZXIodGhpcy5yYW5kb21TZWVkLmNoYXJBdCg0KS8xMCkpKSlcclxuXHRcdFx0KTtcclxuXHR9XHJcblx0XHRcdFxyXG5cdHJldHVybiB0aGlzLl9yb2JvdFN0YXJ0VG9wTGVmdC5jbG9uZSgpO1xyXG4gIH1cclxuICBcclxuICBnZXRSb2JvdFRvcExlZnQoYXQpIHtcclxuXHRpZihhdCA9PT0gdW5kZWZpbmVkKSBhdCA9IHRoaXMudGltZXJQcm9ncmVzcztcclxuXHRcclxuXHRsZXQgc3RhcnQgPSB0aGlzLnJvYm90U3RhcnRUb3BMZWZ0LFxyXG5cdFx0dGFyZ2V0WSA9IC0zMDAsIFxyXG5cdFx0eUxlbiA9IHRhcmdldFkgLSBzdGFydC55OyBcclxuXHRcclxuXHRzdGFydC55ICs9ICh5TGVuICogKGF0KmF0KSk7XHJcblx0XHJcblx0cmV0dXJuIHN0YXJ0O1xyXG4gIH1cclxuICBcclxuICBnZXQgYmFsbG9vblJlY3QoKXtcclxuXHR2YXIgciA9IHRoaXMuZ2V0Um9ib3RUb3BMZWZ0KCk7XHJcblx0cmV0dXJuIG5ldyBSZWN0KHIueCArIDQwLCByLnksIDUwLDY1KTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGtleVN0YXRlICgpe1xyXG5cdCAgdmFyIHMgPSBNYXRoLmZsb29yKHRoaXMudGltZXJQcm9ncmVzcyozMCUzKTtcclxuXHQgIGNvbnNvbGUubG9nKFwia2V5c3RhdGU6IFwiKyBzKTtcclxuXHQgIHJldHVybiBzO1xyXG4gIH1cclxuICBcclxuICBjbG91ZFBvc2l0aW9ucyAoYXRQY3Qpe1xyXG5cdCAgdmFyIHgxID0gLTUwO1xyXG5cdCAgdmFyIHkxID0gLTUwMDtcclxuXHQgIHZhciB5RGlzdGFuY2UgPSB3aW5kb3cuQ09OU1QuQ0FOVkFTX0hFSUdIVCAqIGF0UGN0O1xyXG5cdCAgXHJcblx0ICByZXR1cm4gWyBcclxuXHRcdFx0bmV3IFBvaW50KHgxLCB5MSArIHlEaXN0YW5jZSksXHJcblx0XHRcdG5ldyBQb2ludCh4MSArIDUwLCB5MSArIDMwMCArIHlEaXN0YW5jZSksXHJcblx0XHRcdG5ldyBQb2ludCh4MSAtIDc1LCB5MSArIDYwMCsgeURpc3RhbmNlKSxcclxuXHRcdFx0XHJcblx0XHRcdG5ldyBQb2ludCh4MSsgMzAwLCB5MSArIDEwMCArIHlEaXN0YW5jZSksXHJcblx0XHRcdG5ldyBQb2ludCh4MSsgMjQwLCB5MSArIDQwMCArIHlEaXN0YW5jZSksXHJcblx0XHRcdG5ldyBQb2ludCh4MSsgMzAwLCB5MSArIDcwMCArIHlEaXN0YW5jZSksXHJcblx0ICBdXHJcbiAgfVxyXG4gIFxyXG5cdHRpY2soY3R4LCBtcyl7XHJcblx0XHRzdXBlci50aWNrKGN0eCwgbXMpOyBcclxuXHRcdFxyXG5cdFx0dGhpcy50aW1lclByb2dyZXNzID0gbXMgLyB0aGlzLm1heER1cmF0aW9uO1xyXG5cdFx0XHRcclxuXHRcdC8vc2t5XHJcblx0XHR2YXIgZ3JkPWN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLDAsMCw0MDApO1xyXG5cdFx0Z3JkLmFkZENvbG9yU3RvcCgwLFwiIzVkYjFmZlwiKTtcclxuXHRcdGdyZC5hZGRDb2xvclN0b3AoMSxcIiNiY2RkZmZcIik7XHJcblx0XHRjdHguZmlsbFN0eWxlPWdyZDtcclxuXHRcdGN0eC5maWxsUmVjdCgwLDAsNDAwLDQwMCk7XHJcblx0XHRcdFxyXG5cdFx0aWYodGhpcy5pc0NvbXBsZXRlKSB0aGlzLmRyYXdDb21wbGV0ZShjdHgpO1xyXG5cdFx0ZWxzZSB0aGlzLmRyYXcoY3R4KTtcclxuXHR9IFxyXG5cdFxyXG5cdGRyYXcoY3R4KXtcclxuXHRcdFxyXG5cdFx0Ly9jbG91ZHNcclxuXHRcdHZhciBjbG91ZHMgPSB0aGlzLmNsb3VkUG9zaXRpb25zKHRoaXMudGltZXJQcm9ncmVzcyk7XHJcblx0XHRcclxuXHRcdHZhciBjbG91ZCA9IG5ldyBSZWN0KDE5Nyw4NCwxOTUsMTA1KVxyXG5cdFx0XHRcclxuXHRcdGNsb3Vkcy5mb3JFYWNoKGZ1bmN0aW9uKHApe1x0XHRcdFxyXG5cdFx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdFx0Y3R4LCBcclxuXHRcdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRcdGNsb3VkLFxyXG5cdFx0XHRcdG5ldyBSZWN0KHAueCxwLnksIGNsb3VkLndpZHRoLCBjbG91ZC5oZWlnaHQpXHJcblx0XHRcdCk7XHRcclxuXHRcdH0uYmluZCh0aGlzKSk7XHJcblx0XHRcclxuXHRcdCAgXHJcblx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdGN0eCwgXHJcblx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdG5ldyBSZWN0KDAsMCwxOTAsNDAwKSxcclxuXHRcdFx0bmV3IFJlY3QodGhpcy5nZXRSb2JvdFRvcExlZnQoKS54LHRoaXMuZ2V0Um9ib3RUb3BMZWZ0KCkueSwxOTAsNDAwKVxyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0dmFyIGtleSA9IG5ldyBSZWN0KDE4OSwxMyw0NSw0MCk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMua2V5U3RhdGUgPT09IDEpIHtcclxuXHRcdFx0a2V5LnggKz0ga2V5LndpZHRoO1xyXG5cdFx0XHRrZXkud2lkdGggPSA0MTtcclxuXHRcdH0gZWxzZSBpZih0aGlzLmtleVN0YXRlID09PSAyKXtcclxuXHRcdFx0a2V5LnggPSAyNzM7XHJcblx0XHRcdGtleS53aWR0aCA9IDM5XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBkcmF3S2V5ID0gbmV3IFJlY3QoNjUgLSBrZXkud2lkdGgsIDI4MCAtIGtleS5oZWlnaHQsa2V5LndpZHRoLCBrZXkuaGVpZ2h0KS5vZmZzZXQodGhpcy5nZXRSb2JvdFRvcExlZnQoKSlcclxuXHRcdCAgXHJcblx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdGN0eCwgXHJcblx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdGtleSxcclxuXHRcdFx0ZHJhd0tleVxyXG5cdFx0KTtcclxuXHRcdFxyXG5cdCAgfSBcclxuXHQgIFxyXG5cdCAgZHJhd0NvbXBsZXRlKGN0eCl7XHJcblx0XHQvL2Nsb3Vkc1xyXG5cdFx0XHRcclxuXHRcdCsrdGhpcy5fdGlja1NpbmNlQ29tcGxldGU7XHJcblx0XHRcclxuXHRcdHZhciBjbG91ZFN0YXRlID0gIHRoaXMuX2NvbXBsZXRlQXQgLSAodGhpcy5fdGlja1NpbmNlQ29tcGxldGUvNDAwKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiY29tcGxldGU6IFwiICsgY2xvdWRTdGF0ZSk7XHJcblx0XHRcclxuXHRcdHZhciBjbG91ZHMgPSB0aGlzLmNsb3VkUG9zaXRpb25zKE1hdGgubWF4KC0xMDAsY2xvdWRTdGF0ZSkpOyBcclxuXHRcdFxyXG5cdFx0dmFyIGNsb3VkID0gbmV3IFJlY3QoMTk3LDg0LDE5NSwxMDUpXHJcblx0XHRcdCAgXHJcblx0XHRjbG91ZHMuZm9yRWFjaChmdW5jdGlvbihwKXtcdFx0XHRcclxuXHRcdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRcdGN0eCwgXHJcblx0XHRcdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdFx0XHRjbG91ZCxcclxuXHRcdFx0XHRuZXcgUmVjdChwLngscC55LCBjbG91ZC53aWR0aCwgY2xvdWQuaGVpZ2h0KVxyXG5cdFx0XHQpO1x0XHJcblx0XHR9LmJpbmQodGhpcykpO1xyXG5cdFx0XHJcblx0XHQvL3JvYm90XHJcblx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdGN0eCwgXHJcblx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdG5ldyBSZWN0KDM5MywwLDIzMSwyMjgpLFxyXG5cdFx0XHRuZXcgUmVjdCh0aGlzLmdldFJvYm90VG9wTGVmdChjbG91ZFN0YXRlKS54LHRoaXMuZ2V0Um9ib3RUb3BMZWZ0KGNsb3VkU3RhdGUpLnksMjMxLDIyOClcclxuXHRcdCk7XHJcblx0XHRcclxuXHQgfSBcclxuICBcclxuXHRjb21wbGV0ZSAoKXtcclxuXHRcdHRoaXMuX2lzQ29tcGxldGUgPSB0cnVlO1xyXG5cdFx0dGhpcy5fY29tcGxldGVBdCA9IHRoaXMudGltZXJQcm9ncmVzcztcclxuXHRcdHRoaXMuX3RpY2tTaW5jZUNvbXBsZXRlID0wO1xyXG5cdH1cclxuIFxyXG5cdGdldCBpc0NvbXBsZXRlKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5faXNDb21wbGV0ZTtcclxuXHR9XHJcblx0XHJcbiAgICBcclxuICBjbGljayh4LHkpe1xyXG5cdC8vZGlkIHdlIGNsaWNrIGluc2lkZSB0aGUgYmFsbG9uPyAgXHJcblx0aWYodGhpcy5iYWxsb29uUmVjdC5jb250YWlucyhuZXcgUG9pbnQoeCx5KSkpe1xyXG5cdFx0Ly9oaXRcclxuXHRcdGNvbnNvbGUubG9nKFwiaGl0XCIpOyBcclxuXHRcdHRoaXMuY29tcGxldGUoKTtcclxuXHRcdHRoaXMuc29sdmUoe3gseSwgcHJvZ3Jlc3MgOiB0aGlzLnRpbWVyUHJvZ3Jlc3N9KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Ly9taXNzXHJcblx0XHRjb25zb2xlLmxvZyhcIm1pc3NcIik7XHJcblx0fVxyXG4gIH1cclxufSBcclxuXHJcbi8qXHJcbk9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEggPSBcImh0dHBzOi8vczMtdXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vcy5jZHBuLmlvL3QtMjY1L3Nwcml0ZXNoZWV0MS5wbmdcIjtcclxuIFxyXG52YXIgY29udGFpbmVyID0gbmV3IE9KQ2FwdGNoYUNvbnRhaW5lcigkKFwiI29qLWNhcHRjaGEtY29udGFpbmVyXCIpKTtcclxuY29udGFpbmVyLmluaXQoW09KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMV0pOyAqLyIsImNsYXNzIE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMiBleHRlbmRzIE9KQ2FwdGNoYU1pY3JvR2FtZUJhc2UgeyBcclxuICBcclxuXHRjb25zdHJ1Y3RvcihyYW5kb21TZWVkLCBhc3NldHMpe1xyXG5cdFx0c3VwZXIocmFuZG9tU2VlZCwgYXNzZXRzKTtcclxuXHR9XHJcbiAgICBcclxuXHRnZXQgbWF4RHVyYXRpb24oKXtcclxuXHRcdHJldHVybiA1MDAwO1xyXG5cdH1cclxuXHRcclxuXHRnZXQga2V5VHVybk1heCgpe1xyXG5cdFx0cmV0dXJuIHBhcnNlSW50KCh0aGlzLnJhbmRvbVNlZWQgKyBcIlwiKS5jaGFyQXQoNikpO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgd2luZFNpZGUoKXtcclxuXHRcdGlmKCF0aGlzLl9zaWRlKSB0aGlzLl9zaWRlID0gcGFyc2VJbnQoKHRoaXMucmFuZG9tU2VlZCArIFwiXCIpLmNoYXJBdCgyKSkgPCA1ID8gXCJsZWZ0XCIgOiBcInJpZ2h0XCI7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2lkZTtcclxuXHR9XHJcbiAgXHJcblx0Z2V0IHRpbWVyUHJvZ3Jlc3MoKXtcclxuXHRcdHJldHVybiBNYXRoLm1pbih0aGlzLl90aW1lclByb2dyZXNzIHx8IDAsMTAwKTtcclxuXHR9XHJcbiAgXHJcblx0c2V0IHRpbWVyUHJvZ3Jlc3ModG8pe1xyXG5cdFx0dGhpcy5fdGltZXJQcm9ncmVzcyA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgem9vbVByb2dyZXNzKCl7XHJcblx0XHRyZXR1cm4gTWF0aC5taW4oMSx0aGlzLl90aW1lclByb2dyZXNzIC8gMC4yKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGtleUJhc2VQb3MoKXtcclxuXHRcdHZhciByb2JvdCA9IHRoaXMucm9ib3Rab29tRGF0YTtcclxuXHRcdHJldHVybiBuZXcgUG9pbnQoXHJcblx0XHRcdHJvYm90LnggKyAxMjEsXHJcblx0XHRcdHJvYm90LnkgKyAzNTApO1xyXG5cdH1cclxuXHRcclxuXHRnZXQga2V5VHVybkNvdW50KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5fa2V5VHVybkNvdW50IHx8IDA7XHJcblx0fVxyXG5cdFxyXG5cdGdldCByb2JvdEFybVJvdGF0aW9uREVHKCl7XHJcblx0XHRpZighdGhpcy5faW5zZXJ0ZWQpIHJldHVybiAtOTA7XHJcblx0XHRlbHNlIHJldHVybiAxODAgKyAoIDEwICogdGhpcy5rZXlUdXJuQ291bnQpO1xyXG5cdH1cclxuICBcclxuXHRnZXQgc3RhdGUoKXtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIFwiem9vbWluZ1wiO1xyXG5cdFx0XHJcblx0XHRpZih0aGlzLnpvb21Qcm9ncmVzcyA8IDEpe1xyXG5cdFx0XHRyZXR1cm4gXCJ6b29taW5nXCI7XHJcblx0XHR9ICBcclxuXHRcdGlmKCF0aGlzLl9pbnNlcnRlZCkgcmV0dXJuIFwiaW5zZXJ0aW5nXCI7XHJcblx0XHRyZXR1cm4gXCJ3aW5kaW5nXCI7XHJcblx0fVxyXG5cdFxyXG5cdGdldCByb2JvdFNwcml0ZVNoZWV0UmVjdCgpe1xyXG5cdFx0cmV0dXJuIG5ldyBSZWN0KDAsMCwzNTgsNTI2KTtcclxuXHR9XHJcblx0XHJcblx0ZHJhd1JvYm90KGN0eCx4LHksc2NhbGUpe1xyXG5cdFx0XHJcblx0XHR2YXIgY3V0T3V0ID0gdGhpcy5yb2JvdFNwcml0ZVNoZWV0UmVjdDtcclxuXHRcdHZhciByb2JvdERyYXdSZWN0ID0gbmV3IFJlY3QoeCx5LCBjdXRPdXQud2lkdGggKiBzY2FsZSwgY3V0T3V0LmhlaWdodCAqIHNjYWxlKTtcclxuXHRcdFxyXG5cdFx0Ly9kcmF3IGFybSBcclxuXHRcdHZhciBhcm1DdXRvdXQgPSB0aGlzLmFybVNwcml0ZVNoZWV0UmVjdDtcclxuXHQgXHJcblx0XHR2YXIgb2Zmc2V0ID0gbmV3IFBvaW50KHJvYm90RHJhd1JlY3QueCwgcm9ib3REcmF3UmVjdC55KTtcclxuXHRcdFxyXG5cdFx0Y3R4LnNhdmUoKTtcclxuXHRcdFxyXG5cdFx0XHJcblx0XHRjdHgudHJhbnNsYXRlKHgrKDEwKnNjYWxlKSwgeSsoMTc2KnNjYWxlKSk7IFxyXG5cdFx0XHRcdFxyXG5cdFx0Y3R4LnJvdGF0ZSh0aGlzLnJvYm90QXJtUm90YXRpb25ERUcgKiAoTWF0aC5QSS8xODApKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRjdHgsIFxyXG5cdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTIucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRhcm1DdXRvdXQsXHJcblx0XHRcdC8vbmV3IFJlY3QoLTEwMCwtMTAwLGFybUN1dG91dC53aWR0aCwgYXJtQ3V0b3V0LmhlaWdodClcclxuXHRcdFx0bmV3IFJlY3QoLWFybUN1dG91dC53aWR0aC8yKnNjYWxlLCAtKGFybUN1dG91dC5oZWlnaHQqc2NhbGUpLCBhcm1DdXRvdXQud2lkdGggKiBzY2FsZSwgYXJtQ3V0b3V0LmhlaWdodCAqc2NhbGUpXHJcblx0XHQpO1x0IFx0XHJcblx0XHRcclxuXHRcdGN0eC5yZXN0b3JlKCk7XHJcblx0XHQgXHJcblx0XHQvL2RyYXcgcm9ib3Qgb24gdG9wXHJcblx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdFx0Y3R4LCBcclxuXHRcdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTIucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRcdGN1dE91dCxcclxuXHRcdFx0XHRyb2JvdERyYXdSZWN0XHJcblx0XHRcdCk7XHRcclxuXHRcdFx0XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHRcclxuXHRcclxuXHRnZXQgcm9ib3Rab29tRGF0YSgpe1xyXG5cdFx0aWYoIXRoaXMuX3JvYm90Wm9vbURhdGEpe1xyXG5cdFx0XHR0aGlzLl9yb2JvdFpvb21EYXRhID0geyBcclxuXHRcdFx0XHR4OiAxMDAsXHJcblx0XHRcdFx0eTogLTUwLFxyXG5cdFx0XHRcdHNjYWxlIDogMS4yXHJcblx0XHRcdH1cclxuXHRcdH1cdFxyXG5cdFx0cmV0dXJuIHRoaXMuX3JvYm90Wm9vbURhdGE7XHJcblx0fVxyXG5cdFxyXG5cdGdldCBhcm1TcHJpdGVTaGVldFJlY3QoKXtcclxuXHRcdHJldHVybiBuZXcgUmVjdChcclxuXHRcdFx0MzYyLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQ0NSxcclxuXHRcdFx0MTcxXHJcblx0XHQpO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgYXJyb3dTcHJpdGVTaGVldFJlY3QoKXtcclxuXHRcdHJldHVybiBuZXcgUmVjdCgzNjIsMjI5LDEyOSw5OCk7XHJcblx0fVxyXG4gIFxyXG5cdHRpY2soY3R4LCBtcyl7XHJcblx0XHRzdXBlci50aWNrKGN0eCwgbXMpOyBcclxuXHRcdFxyXG5cdFx0dGhpcy50aW1lclByb2dyZXNzID0gbXMgLyB0aGlzLm1heER1cmF0aW9uO1xyXG5cdFx0XHRcclxuXHRcdC8vc2t5XHJcblx0XHR2YXIgZ3JkPWN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLDAsMCw0MDApO1xyXG5cdFx0Z3JkLmFkZENvbG9yU3RvcCgwLFwiIzVkYjFmZlwiKTtcclxuXHRcdGdyZC5hZGRDb2xvclN0b3AoMSxcIiNiY2RkZmZcIik7XHJcblx0XHRjdHguZmlsbFN0eWxlPWdyZDtcclxuXHRcdGN0eC5maWxsUmVjdCgwLDAsNDAwLDQwMCk7XHJcblx0XHRcclxuXHRcdHRoaXMua2V5VHVyblVwZGF0ZSgpO1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdHRoaXMuZHJhdyhjdHgsIG1zKTtcclxuXHRcdFxyXG5cdH0gXHJcblx0XHJcblx0ZHJhdyhjdHgsbXMpe1xyXG5cdFx0XHJcblx0XHRpZih0aGlzLnpvb21Qcm9ncmVzcyA+PSAxKSB7XHJcblx0XHRcdHRoaXMuZHJhd0tleShjdHgpO1xyXG5cdFx0fVxyXG5cdFx0Ly9kcmF3IHJvYm90XHJcblx0XHR2YXIgY2VudGVyID0gbmV3IFBvaW50KHdpbmRvdy5DT05TVC5DQU5WQVNfV0lEVEggLzIsIHdpbmRvdy5DT05TVC5DQU5WQVNfSEVJR0hUIC8yKTsgXHJcblx0XHRcclxuXHRcdHZhciBjYW52YXMgPSBuZXcgUmVjdCgwLDAsd2luZG93LkNPTlNULkNBTlZBU19XSURUSCwgd2luZG93LkNPTlNULkNBTlZBU19IRUlHSFQpOyBcclxuXHRcdFxyXG5cdFx0dmFyIHJvYm90UmVjdCA9IHRoaXMucm9ib3RTcHJpdGVTaGVldFJlY3Q7XHJcblx0XHRcclxuXHRcdHZhciBpbml0aWFsU2NhbGUgPSAwLjQ7XHJcblx0XHRcclxuXHRcdHJvYm90UmVjdC53aWR0aCAqPSBpbml0aWFsU2NhbGU7XHJcblx0XHRyb2JvdFJlY3QuaGVpZ2h0ICo9IGluaXRpYWxTY2FsZTsgXHJcblx0XHRcclxuXHRcdHZhciByb2JvdFN0YXJ0UmVjdCA9IG5ldyBSZWN0KCAoIGNhbnZhcy53aWR0aCAtIHJvYm90UmVjdC53aWR0aCkgKiAuNSwgKGNhbnZhcy5oZWlnaHQgLSByb2JvdFJlY3QuaGVpZ2h0KSwgcm9ib3RSZWN0LndpZHRoLCByb2JvdFJlY3QuaGVpZ2h0KTtcclxuXHRcdFxyXG5cdFx0dmFyIHJvYm90RW5kID0gdGhpcy5yb2JvdFpvb21EYXRhOyBcclxuXHRcdFxyXG5cdFx0dmFyIHRvcExlZnQgPSBuZXcgUG9pbnQocm9ib3RTdGFydFJlY3QueCwgcm9ib3RTdGFydFJlY3QueSkuaW50ZXJwb2xhdGUobmV3IFBvaW50KHJvYm90RW5kLngsIHJvYm90RW5kLnkpLCB0aGlzLnpvb21Qcm9ncmVzcyk7XHJcblx0XHRcclxuXHRcdHRoaXMuZHJhd1JvYm90KGN0eCwgdG9wTGVmdC54LCB0b3BMZWZ0LnksIHJvYm90RW5kLnNjYWxlICogdGhpcy56b29tUHJvZ3Jlc3MpO1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8vem9vbSBjb21wbGV0ZSwgZHJhdyBrZXlcclxuXHRcdGlmKHRoaXMuem9vbVByb2dyZXNzID49IDEpIHtcclxuXHRcdFx0dGhpcy5kcmF3QXJyb3coY3R4LG1zKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Z2V0S2V5UmVjdChmcmFtZSl7XHJcblx0XHRcclxuXHRcdGlmKCF0aGlzLl9rZXlSZWN0RnJhbWVzQ2FjaGUpIHtcclxuXHRcdFx0dGhpcy5fa2V5UmVjdEZyYW1lc0NhY2hlID0gIFtcclxuXHRcdFx0XHRuZXcgUmVjdCg0MDcsMCw4NCw3NCksXHJcblx0XHRcdFx0bmV3IFJlY3QoNDA3LDc0LDg0LDY4KSxcclxuXHRcdFx0XHRuZXcgUmVjdCg0MDcsMTQxLDg0LDQxKSxcclxuXHRcdFx0XHRuZXcgUmVjdCg0MDcsMTgyLDg0LDI3KSxcclxuXHRcdFx0XHRuZXcgUmVjdCg0MDcsMjA5LDg0LDE5KVx0XHRcdFxyXG5cdFx0XHRdXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5fa2V5UmVjdEZyYW1lc0NhY2hlW2ZyYW1lID09PSB1bmRlZmluZWQgP3RoaXMuZHJhd0tleUZyYW1lIDogZnJhbWVdO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgZHJhd0tleUZyYW1lKCl7XHJcblx0XHRpZighdGhpcy5fa2V5VHVybmluZykgcmV0dXJuIDA7XHJcblx0XHRcclxuXHRcdHZhciB2YWwgPSBNYXRoLm1pbig4LCBNYXRoLm1heCgwLE1hdGgucm91bmQoIDggKiB0aGlzLl9rZXlUdXJuaW5nLnBjdCkpKTtcclxuXHRcdFxyXG5cdFx0dmFyIGZyYW1lID0gdmFsIDwgNSA/IHZhbCA6IDQgLSBNYXRoLm1heCgwLCB2YWwgLSA0KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZyYW1lO1xyXG5cdFx0IFxyXG5cdH1cclxuXHRcclxuXHRnZXQgZHJhd0tleVJlY3QoKXtcclxuXHRcdHZhciBiYXNlUG9zID0gdGhpcy5rZXlCYXNlUG9zO1xyXG5cdFx0dmFyIHNjYWxlID0gdGhpcy5yb2JvdFpvb21EYXRhLnNjYWxlO1xyXG5cdFx0dmFyIGZyYW1lUmVjdCA9IHRoaXMuZ2V0S2V5UmVjdCh0aGlzLmRyYXdLZXlGcmFtZSk7XHJcblx0XHRpZighZnJhbWVSZWN0KSBkZWJ1Z2dlcjtcclxuXHRcdHZhciBkcmF3UmVjdCA9IG5ldyBSZWN0KGJhc2VQb3MueCwgYmFzZVBvcy55LCBmcmFtZVJlY3Qud2lkdGggKiBzY2FsZSwgZnJhbWVSZWN0LmhlaWdodCAqIHNjYWxlKTtcclxuXHRcdFxyXG5cdFx0ZHJhd1JlY3QueCAtPSBkcmF3UmVjdC53aWR0aDtcclxuXHRcdGRyYXdSZWN0LnkgLT0gZHJhd1JlY3QuaGVpZ2h0IC8yO1xyXG5cdFx0XHJcblx0XHRkcmF3UmVjdC54ICs9IHRoaXMuZ2V0SW5zZXJ0T2Zmc2V0KCk7XHRcdFxyXG5cdFxyXG5cdFx0cmV0dXJuIGRyYXdSZWN0O1xyXG5cdH1cclxuXHRcclxuXHRkcmF3S2V5KGN0eCl7XHJcblx0XHRcclxuXHRcdHZhciBmcmFtZVJlY3QgPSB0aGlzLmdldEtleVJlY3QodGhpcy5kcmF3S2V5RnJhbWUpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdGN0eCwgXHJcblx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMi5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdGZyYW1lUmVjdCxcclxuXHRcdFx0dGhpcy5kcmF3S2V5UmVjdFxyXG5cdFx0KTtcdFxyXG5cdH1cclxuXHRcclxuXHRnZXRJbnNlcnRPZmZzZXQoKSB7XHJcblx0XHRpZih0aGlzLl9pbnNlcnRlZCkgcmV0dXJuIDMwO1xyXG5cdFx0aWYodGhpcy5faW5zZXJ0TW91c2VEb3duKXtcclxuXHRcdFx0dmFyIG51bSA9IE1hdGgubWF4KC0xMDAsIE1hdGgubWluKDMwLCB0aGlzLmxhc3RNb3VzZS54IC0gdGhpcy5fbW91c2VEb3duLnggLTEwMCkpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhudW0pO1xyXG5cdFx0XHRyZXR1cm4gbnVtOyBcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiAtMTAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRkcmF3S2V5X2luc2VydGluZyhjdHgpe1xyXG5cdFx0XHJcblx0XHQvL3RoaXMuZHJhd0tleShjdHgsIGJhc2VQb3MueCwgYmFzZVBvcy55LCAwKVxyXG5cdH1cclxuXHRcclxuXHRkcmF3S2V5X3dpbmRpbmcoY3R4KXtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRrZXlUdXJuaW5nQ2VudGVyKCl7XHJcblx0XHRpZighdGhpcy5fa2V5VHVybmluZykgcmV0dXJuIGZhbHNlOyBcclxuXHRcdHJldHVybiB0aGlzLl9tb3VzZURvd24uY2xvbmUoKS5vZmZzZXQoLTUwLDApO1xyXG5cdH1cclxuXHRcclxuXHRrZXlUdXJuVXBkYXRlKCl7XHJcblx0XHRpZighdGhpcy5fa2V5VHVybmluZykgcmV0dXJuO1xyXG5cdFx0Ly90aGUgcGVyY2VudGFnZSBvZiBjb21wbGV0ZW5lc3Mgb2YgdGhlIHR1cm5pbmcgb2YgdGhlIGtleVx0XHRcclxuXHRcdHRoaXMuX2tleVR1cm5pbmcucGN0ID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwodGhpcy5sYXN0TW91c2UueSAtIHRoaXMuX2tleVR1cm5pbmcuc3RhcnQueSkvICggdGhpcy5fa2V5VHVybmluZy5lbmQueSAtIHRoaXMuX2tleVR1cm5pbmcuc3RhcnQueSApKSk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMuX2tleVR1cm5pbmcucGN0ID49IDEpe1xyXG5cdFx0XHR0aGlzLmtleVR1cm5Db21wbGV0ZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRrZXlUdXJuQ29tcGxldGUoKXtcclxuXHRcdGlmKCF0aGlzLl9rZXlUdXJuQ291bnQpIHRoaXMuX2tleVR1cm5Db3VudCA9IDA7XHJcblx0XHQrK3RoaXMuX2tleVR1cm5Db3VudDtcclxuXHRcdHRoaXMubW91c2V1cCgpO1xyXG5cdH1cclxuXHRcclxuXHQvL2Fycm93XHJcblx0ZHJhd0Fycm93KGN0eCwgbXMpe1xyXG5cdFx0XHJcblx0XHR2YXIgc3JjID0gdGhpcy5hcnJvd1Nwcml0ZVNoZWV0UmVjdDtcclxuXHRcdHZhciBrZXlSZWN0ID0gdGhpcy5kcmF3S2V5UmVjdDtcclxuXHRcdCBcclxuXHRcdHZhciBhbmltYXRpb25EdXJhdGlvbiA9IDcwMDtcclxuXHRcdHZhciBhbmltYXRpb25Qcm9ncmVzcyA9IChtcyAlIGFuaW1hdGlvbkR1cmF0aW9uIC8gYW5pbWF0aW9uRHVyYXRpb24pO1xyXG5cdFx0dmFyIGFuaW1hdGlvbkxvb3AgPSBhbmltYXRpb25Qcm9ncmVzcyA8PSAwLjUgPyBhbmltYXRpb25Qcm9ncmVzcyA6IDAuNSAtIE1hdGgubWF4KDAsIGFuaW1hdGlvblByb2dyZXNzIC0gMC41KTtcclxuXHRcdHZhciBzY2FsZSA9ICAoMC41NSArICgwLjEgKiBhbmltYXRpb25Mb29wKSk7XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0aWYoIXRoaXMuX2luc2VydGVkKXtcclxuXHRcdFx0Ly9kcmF3IHJpZ2h0IG5leHQgdG8gdGhlIGtleVxyXG5cdFx0XHRcclxuXHRcdFx0aWYodGhpcy5fbW91c2VEb3duKSByZXR1cm47XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgaGVpZ2h0ID0gc3JjLmhlaWdodCAqIHNjYWxlO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRcdGN0eCwgXHJcblx0XHRcdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUyLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdFx0XHRzcmMsIFxyXG5cdFx0XHRcdG5ldyBSZWN0KGtleVJlY3QucmlnaHQgKyAoYW5pbWF0aW9uTG9vcCAqIDUwKSwga2V5UmVjdC55ICsgKChrZXlSZWN0LmhlaWdodCAtIGhlaWdodCkvMiksIHNyYy53aWR0aCAqIHNjYWxlLCBoZWlnaHQpIFxyXG5cdFx0XHQpO1x0XHJcblx0XHRcdFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBoZWlnaHQgPSBzcmMuaGVpZ2h0ICogc2NhbGU7XHJcblx0XHRcdHZhciB3aWR0aCA9IHNyYy53aWR0aCAqIHNjYWxlO1xyXG5cdFx0XHR2YXIgeCA9IGtleVJlY3QueCAtIHdpZHRoIC8yO1xyXG5cdFx0XHR2YXIgeSA9IGtleVJlY3QueSArICgga2V5UmVjdC5oZWlnaHQgLzIgKVxyXG5cdFx0XHRcclxuXHRcdFx0Y3R4LnNhdmUoKTtcclxuXHRcdFx0XHJcblx0XHRcdGN0eC50cmFuc2xhdGUoeCx5KTtcclxuXHRcdFx0Y3R4LnJvdGF0ZSg5MCAqIChNYXRoLlBJLzE4MCkpOyBcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuZHJhd0Zyb21TcHJpdGVTaGVldChcclxuXHRcdFx0XHRjdHgsIFxyXG5cdFx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMi5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdFx0c3JjLCBcclxuXHRcdFx0XHRuZXcgUmVjdCgtd2lkdGgvMiwtaGVpZ2h0LzIsIHdpZHRoLCBoZWlnaHQpIFxyXG5cdFx0XHQpO1x0XHJcblx0XHRcdCBcclxuXHRcdFx0Y3R4LnJlc3RvcmUoKTtcclxuXHRcdH0gXHJcblx0fVx0XHJcblx0bW91c2Vkb3duKHgseSl7XHJcblx0XHQvLy9jb25zb2xlLmxvZyhcIm1vdXNlIGRvd246IFwiKyB4ICsgXCIsIFwiICsgeSArIFwiLCBkaXN0YW5jZTogXCIrIHRoaXMua2V5QmFzZVBvcy5kaXN0YW5jZVRvKG5ldyBQb2ludCh4LHkpKSlcclxuXHRcdC8vZGlzdGFuY2UgdG8gYmFzZXBvc1xyXG5cdFx0dGhpcy5fbW91c2VEb3duID0gbmV3IFBvaW50KHgseSk7XHJcblx0XHRcclxuXHRcdHRoaXMuX2luc2VydE1vdXNlRG93biA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fa2V5VHVybmluZyA9IGZhbHNlO1xyXG5cdFx0XHJcblx0XHRpZighdGhpcy5faW5zZXJ0ZWQpeyBcclxuXHRcdFx0aWYodGhpcy5kcmF3S2V5UmVjdC5jb250YWlucyhuZXcgUG9pbnQoeCx5KSkpeyAvL3RoaXMua2V5QmFzZVBvcy5kaXN0YW5jZVRvKG5ldyBQb2ludCh4LXRoaXMuZ2V0SW5zZXJ0T2Zmc2V0KCkseSkpIDwgNTApeyBcclxuXHRcdFx0XHR0aGlzLl9pbnNlcnRNb3VzZURvd24gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcclxuXHRcdFx0Ly9rZXkgaXMgaW5zZXJ0ZWQsIHN3aXBlIGl0IGRvd24gYSBjb3VwbGUgb2YgdGltZSB0byB0dXJuXHJcblx0XHRcdHZhciB0YXJnZXRSZWN0ID0gdGhpcy5kcmF3S2V5UmVjdDtcclxuXHRcdFx0XHJcblx0XHRcdGlmKE1hdGguYWJzKHRhcmdldFJlY3QueSAtIHkpIDwgNTApe1xyXG5cdFx0XHRcdHRoaXMuX2tleVR1cm5pbmcgPSB7XHJcblx0XHRcdFx0XHRzdGFydCA6IG5ldyBQb2ludCh4LHkpLCBcclxuXHRcdFx0XHRcdGVuZCA6bmV3IFBvaW50KHgseSArIDc1KSxcclxuXHRcdFx0XHRcdHBjdCA6IDBcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdH1cclxuXHQgXHJcblx0bW91c2V1cCgpe1xyXG5cdFx0aWYodGhpcy5nZXRJbnNlcnRPZmZzZXQoKSA+IDIwKSB7XHJcblx0XHRcdHRoaXMuX2luc2VydGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5faW5zZXJ0TW91c2VEb3duID0gZmFsc2U7XHJcblx0XHR0aGlzLl9rZXlUdXJuaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLl9tb3VzZURvd24gPSBmYWxzZTtcclxuXHR9XHJcblx0ICBcclxuXHRjb21wbGV0ZSgpe1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG4gXHJcblx0Y2xpY2soeCx5KXtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxufSBcclxuXHJcblxyXG5PSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTIucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRIID0gXCJodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby90LTI2NS9nYW1lX3Nwcml0ZXNoZWV0XzIucG5nXCI7XHJcbiBcclxudmFyIGNvbnRhaW5lciA9IG5ldyBPSkNhcHRjaGFDb250YWluZXIoJChcIiNvai1jYXB0Y2hhLWNvbnRhaW5lclwiKSk7XHJcbmNvbnRhaW5lci5pbml0KFtPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTJdKTsgIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
