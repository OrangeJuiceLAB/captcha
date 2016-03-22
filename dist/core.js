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

			this["draw_" + this.state](ctx);
		}
	}, {
		key: "draw_zooming",
		value: function draw_zooming(ctx) {

			var center = new Point(window.CONST.CANVAS_WIDTH / 2, window.CONST.CANVAS_HEIGHT / 2);

			var canvas = new Rect(0, 0, window.CONST.CANVAS_WIDTH, window.CONST.CANVAS_HEIGHT);

			var robotRect = this.robotSpriteSheetRect;

			var initialScale = 0.4;

			robotRect.width *= initialScale;
			robotRect.height *= initialScale;

			var robotStartRect = new Rect((canvas.width - robotRect.width) * .5, canvas.height - robotRect.height, robotRect.width, robotRect.height);
			console.log(canvas.width + " - " + robotRect.width + " * 5");

			var robotEnd = this.robotZoomData;

			var topLeft = new Point(robotStartRect.x, robotStartRect.y).interpolate(new Point(robotEnd.x, robotEnd.y), this.zoomProgress);

			this.drawRobot(ctx, topLeft.x, topLeft.y, robotEnd.scale * this.zoomProgress);
		}
	}, {
		key: "draw_inserting",
		value: function draw_inserting(ctx) {}
	}, {
		key: "draw_winding",
		value: function draw_winding(ctx) {}
	}, {
		key: "draw",
		value: function draw(ctx) {

			//clouds
			var clouds = this.cloudPositions(this.timerProgress);

			var cloud = new Rect(197, 84, 195, 105);

			clouds.forEach(function (p) {
				this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game2.prototype.SPRITE_SHEET_PATH, cloud, new Rect(p.x, p.y, cloud.width, cloud.height));
			}.bind(this));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYmFzZS5qcyIsImdhbWVzLzEuanMiLCJnYW1lcy8yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFFTSxTQUVKLFNBRkksTUFFSixHQUFhO3VCQUZULFFBRVM7Q0FBYjs7QUFNRixPQUFPLEtBQVAsR0FBZTtBQUNkLGVBQWUsR0FBZjtBQUNBLGdCQUFlLEdBQWY7Q0FGRDs7SUFLTTs7O0FBQ0wsVUFESyxLQUNMLENBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0I7d0JBRFgsT0FDVzs7cUVBRFgsbUJBQ1c7O0FBRWYsUUFBSyxFQUFMLEdBQVUsQ0FBVixDQUZlO0FBR2YsUUFBSyxFQUFMLEdBQVUsQ0FBVixDQUhlOztFQUFoQjs7Y0FESzs7OEJBMkJPLElBQUksTUFDaEI7QUFDQyxVQUFPLElBQUksS0FBSixDQUFVLEtBQUssQ0FBTCxHQUFPLENBQUMsR0FBRyxDQUFILEdBQUssS0FBSyxDQUFMLENBQU4sR0FBYyxJQUFkLEVBQW9CLEtBQUssQ0FBTCxHQUFPLENBQUMsR0FBRyxDQUFILEdBQUssS0FBSyxDQUFMLENBQU4sR0FBYyxJQUFkLENBQW5ELENBREQ7Ozs7eUJBSU8sR0FBRSxHQUFFO0FBQ1YsT0FBRyxFQUFFLE9BQUYsRUFBVztBQUNiLFNBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBRixDQURHO0FBRWIsU0FBSyxDQUFMLElBQVUsRUFBRSxDQUFGLENBRkc7SUFBZCxNQUdPO0FBQ04sU0FBSyxDQUFMLElBQVUsQ0FBVixDQURNO0FBRU4sU0FBSyxDQUFMLElBQVUsQ0FBVixDQUZNO0lBSFA7QUFPQSxVQUFPLElBQVAsQ0FSVTs7OzswQkFXSjtBQUNOLFVBQU8sSUFBSSxLQUFKLENBQVUsS0FBSyxDQUFMLEVBQVEsS0FBSyxDQUFMLENBQXpCLENBRE07Ozs7c0JBcENNO0FBQ1osVUFBTyxJQUFQLENBRFk7Ozs7c0JBSU47QUFDTixVQUFPLEtBQUssRUFBTCxDQUREOztvQkFJRCxJQUFHO0FBQ1IsUUFBSyxFQUFMLEdBQVUs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SyxLQUFMLENBRk07Ozs7c0JBS0s7QUFDbEIsVUFBTyxLQUFLLEdBQUwsQ0FBUyxLQUFLLGNBQUwsSUFBdUIsQ0FBdkIsRUFBeUIsR0FBbEMsQ0FBUCxDQURrQjs7b0JBSUQsSUFBRztBQUNwQixRQUFLLGNBQUwsR0FBc0IsRUFBdEIsQ0FEb0I7Ozs7c0JBSUg7QUFDakIsVUFBTyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVcsS0FBSyxjQUFMLEdBQXNCLEdBQXRCLENBQWxCLENBRGlCOzs7O3NCQUlQOztBQUVWLFVBQU8sU0FBUCxDQUZVOztBQUlWLE9BQUcsS0FBSyxZQUFMLEdBQW9CLENBQXBCLEVBQXNCO0FBQ3hCLFdBQU8sU0FBUCxDQUR3QjtJQUF6QjtBQUdBLE9BQUcsQ0FBQyxLQUFLLFNBQUwsRUFBZ0IsT0FBTyxXQUFQLENBQXBCO0FBQ0EsVUFBTyxTQUFQLENBUlU7Ozs7c0JBV2U7QUFDekIsVUFBTyxJQUFJLElBQUosQ0FBUyxDQUFULEVBQVcsQ0FBWCxFQUFhLEdBQWIsRUFBaUIsR0FBakIsQ0FBUCxDQUR5Qjs7OztzQkFnQlA7QUFDbEIsT0FBRyxDQUFDLEtBQUssY0FBTCxFQUFvQjtBQUN2QixTQUFLLGNBQUwsR0FBc0I7QUFDckIsUUFBRyxHQUFIO0FBQ0EsUUFBRyxDQUFDLEVBQUQ7QUFDSCxZQUFRLEdBQVI7S0FIRCxDQUR1QjtJQUF4QjtBQU9BLFVBQU8sS0FBSyxjQUFMLENBUlc7Ozs7UUF0RGQ7RUFBaUM7O0FBK0l2Qyx5QkFBeUIsU0FBekIsQ0FBbUMsaUJBQW5DLEdBQXVELDJFQUF2RDs7QUFFQSxJQUFJLFlBQVksSUFBSSxrQkFBSixDQUF1QixFQUFFLHVCQUFGLENBQXZCLENBQVo7QUFDSixVQUFVLElBQVYsQ0FBZSxDQUFDLHdCQUFELENBQWYiLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuY2xhc3MgT0pCYXNlIHtcclxuICBcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG53aW5kb3cuQ09OU1QgPSB7XHJcblx0Q0FOVkFTX1dJRFRIIDogNDAwLCBcclxuXHRDQU5WQVNfSEVJR0hUOiA0MDBcclxufVxyXG5cclxuY2xhc3MgUG9pbnQgZXh0ZW5kcyBPSkJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKHgseSl7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5feCA9IHg7XHJcblx0XHR0aGlzLl95ID0geTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGlzUG9pbnQoKXtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3g7XHJcblx0fVxyXG5cdFxyXG5cdHNldCB4KHRvKXtcclxuXHRcdHRoaXMuX3ggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IHkoKXtcclxuXHRcdHJldHVybiB0aGlzLl95OyBcclxuXHR9XHJcblx0XHJcblx0c2V0IHkodG8pe1xyXG5cdFx0dGhpcy5feSA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRpbnRlcnBvbGF0ZSh0bywgZnJhYykgXHJcblx0e1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludCh0aGlzLngrKHRvLngtdGhpcy54KSpmcmFjLCB0aGlzLnkrKHRvLnktdGhpcy55KSpmcmFjKTtcclxuXHR9XHJcblx0XHJcblx0b2Zmc2V0KHgseSl7XHJcblx0XHRpZih4LmlzUG9pbnQpIHtcclxuXHRcdFx0dGhpcy54ICs9IHgueDtcclxuXHRcdFx0dGhpcy55ICs9IHgueTtcclxuXHRcdH0gZWxzZSB7IFxyXG5cdFx0XHR0aGlzLnggKz0geDtcclxuXHRcdFx0dGhpcy55ICs9IHk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0XHJcblx0Y2xvbmUoKXtcclxuXHRcdHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgUmVjdCBleHRlbmRzIFBvaW50IHtcclxuXHRjb25zdHJ1Y3Rvcih4LHksd2lkdGgsaGVpZ2h0KXtcclxuXHRcdHN1cGVyKHgseSk7XHJcblx0XHR0aGlzLl93aWR0aCA9IHdpZHRoO1xyXG5cdFx0dGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdH1cclxuXHRcclxuXHRnZXQgd2lkdGgoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fd2lkdGg7XHJcblx0fVxyXG5cdFxyXG5cdHNldCB3aWR0aCh0byl7XHJcblx0XHR0aGlzLl93aWR0aCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgaGVpZ2h0KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG5cdH1cclxuXHRcclxuXHRzZXQgaGVpZ2h0KHRvKXtcclxuXHRcdHRoaXMuX2hlaWdodCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRcclxuXHRjb250YWlucyhwKXtcdFx0XHJcblx0XHRyZXR1cm4gKHAueCA+PSB0aGlzLnggJiYgcC54IDw9IHRoaXMueCArIHRoaXMud2lkdGggJiYgcC55ID49IHRoaXMueSAmJiBwLnkgPD0gdGhpcy55ICsgdGhpcy5oZWlnaHQpO1xyXG5cdH1cclxuXHRcclxuXHRjbG9uZSgpe1xyXG5cdFx0cmV0dXJuIG5ldyBSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFCYXNlIGV4dGVuZHMgT0pCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcbn0gXHJcblxyXG5jbGFzcyBPSkNhcHRjaGFDb250YWluZXIgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigkc3JjKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl8kc3JjID0gJHNyYztcclxuXHR0aGlzLmltYWdlQXNzZXRzID0gW107XHJcbiAgfVxyXG4gIFxyXG4gIGdldCAkc3JjKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fJHNyYzsgXHJcbiAgfVxyXG4gIFxyXG4gIGdldCBhY3RpdmVHYW1lKCl7XHJcbiAgICBpZighdGhpcy5fYWN0aXZlR2FtZSl7XHJcblx0XHRcclxuXHQgIC8vY3JlYXRlIGEgMTYgY2hhciByYW5kb21TZWVkXHJcblx0ICB0aGlzLl9hY3RpdmVTZWVkID0gXy50aW1lcygxNiwgKCkgPT4gXy5yYW5kb20oMCw5KSkuam9pbihcIlwiKTtcclxuXHQgIFxyXG5cdCAgLy9zdGFydCB0aGUgYWN0aXZlIGdhbWVcclxuICAgICAgdGhpcy5fYWN0aXZlR2FtZSA9IG5ldyB0aGlzLl9nYW1lc1F1ZXVlWzBdKHRoaXMuX2FjdGl2ZVNlZWQsIHRoaXMuaW1hZ2VBc3NldHMpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlR2FtZTtcclxuICB9XHJcbiAgXHJcbiAgaW5pdChnYW1lc0Fycil7XHJcblx0ICBcclxuICAgIHRoaXMuX2dhbWVzUXVldWUgPSBnYW1lc0FycjtcclxuXHRcclxuXHR0aGlzLmxvYWRBc3NldHMoKVxyXG5cdFx0LnRoZW4odGhpcy5zdGFydC5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgbG9hZEFzc2V0cygpe1xyXG5cdFx0Y29uc29sZS5sb2coXCJsb2FkQXNzZXRzXCIpO1xyXG5cdCAgLy9nZXQgc3ByaXRlc2hlZXRzIGZyb20gZ2FtZSBjbGFzc2VzXHJcblx0ICAgXy5mb3JFYWNoKHRoaXMuX2dhbWVzUXVldWUsIChnKSA9PiB7XHJcblx0XHQgIGxldCB1cmwgPSBnLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSDtcclxuXHRcdCAgY29uc29sZS5sb2coXCJsb2FkIDogXCIgKyB1cmwpO1xyXG5cdFx0ICBpZih1cmwgJiYgISh1cmwgaW4gdGhpcy5pbWFnZUFzc2V0cykpe1xyXG5cdFx0XHQgIHRoaXMuaW1hZ2VBc3NldHMucHVzaCh7IHVybCAsIGltYWdlIDogbmV3IEltYWdlKCl9KTtcclxuXHRcdCAgfVxyXG5cdCAgfSwgdGhpcyk7XHJcblxyXG5cdCAgLy9sb2FkIHNpbmdsZSBzcHJpdGVzaGVldCBpbWFnZVxyXG5cdCAgbGV0IGxvYWRTcHJpdGVTaGVldCA9IChzcHJpdGVTaGVldCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0c3ByaXRlU2hlZXQuaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHNwcml0ZVNoZWV0LmNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC53aWR0aCA9IHNwcml0ZVNoZWV0LmltYWdlLm5hdHVyYWxXaWR0aDtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC5oZWlnaHQgPSBzcHJpdGVTaGVldC5pbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzcHJpdGVTaGVldC5pbWFnZS5zcmMgPSBzcHJpdGVTaGVldC51cmw7XHJcblx0XHR9KTtcclxuXHQgIH1cclxuXHQgIFxyXG5cdCAgLy9yZWN1cnNpdmUgY2xvc3VyZSB0aGF0IGxvYWRzIGFsbCBzcHJlYWRzaGVldHMgZnJvbSBxdWV1ZVxyXG5cdCAgbGV0IGxvYWRlciA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRsZXQgbmV4dCA9IF8uZmluZCh0aGlzLmltYWdlQXNzZXRzLCBhID0+ICFhLmNvbXBsZXRlKTtcclxuXHRcdGlmKCFuZXh0KSByZXR1cm4gcmVzb2x2ZSgpO1xyXG5cdFx0bG9hZFNwcml0ZVNoZWV0KG5leHQpLnRoZW4oICgpID0+IGxvYWRlcihyZXNvbHZlLHJlamVjdCkpO1xyXG5cdCAgfS5iaW5kKHRoaXMpO1xyXG5cdCAgXHJcblx0ICByZXR1cm4gbmV3IFByb21pc2UobG9hZGVyKTtcclxuICB9XHJcbiAgXHJcbiAgYnVpbGQoKXtcclxuICAgIHRoaXMuaXNCdWlsZCA9IHRydWU7XHJcbiAgICB0aGlzLiRjYW52YXMgPSAkKFwiPGNhbnZhcyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzQwMCc+PC9jYW52YXM+XCIpO1xyXG5cdHRoaXMuJGNhbnZhcy5tb3VzZW1vdmUodGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSk7XHJcblx0dGhpcy4kY2FudmFzLmNsaWNrKHRoaXMuY2FudmFzY2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhc1swXS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB0aGlzLl8kc3JjLmFwcGVuZCh0aGlzLiRjYW52YXMpOyBcclxuICB9XHJcbiAgXHJcbiAgc3RhcnQoKXtcclxuXHQgIGNvbnNvbGUubG9nKFwiYXNzZXRzIGxvYWRlZFwiKTtcclxuICAgIGlmKCF0aGlzLmlzQnVpbHQpIHRoaXMuYnVpbGQoKTtcclxuICAgIC8vdGlja1xyXG5cdHRoaXMuX3N0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7ICBcclxuICB9XHJcbiAgXHJcbiAgdGljayh0aW1lU3RhbXApe1xyXG4gICAgdGhpcy5hY3RpdmVHYW1lLnRpY2sodGhpcy5jdHgsIHRpbWVTdGFtcCAtIHRoaXMuX3N0YXJ0VGltZSk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgY2FudmFzY2xpY2soZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5jbGljayhldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlbW92ZShldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLm1vdXNlTW92ZShldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xyXG4gIH1cclxuICBcclxufVxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhTWljcm9HYW1lQmFzZSBleHRlbmRzIE9KQ2FwdGNoYUJhc2Uge1xyXG5cdFxyXG4gIGNvbnN0cnVjdG9yKHJhbmRvbVNlZWQsIGFzc2V0cyl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fcmFuZG9tU2VlZCA9IHJhbmRvbVNlZWQ7XHJcblx0dGhpcy5fYXNzZXRzID0gYXNzZXRzO1xyXG5cdHRoaXMuX2ZyYW1lcyA9IHt9O1xyXG4gIH1cclxuICBcclxuICBnZXQgcmFuZG9tU2VlZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX3JhbmRvbVNlZWQ7XHJcbiAgfVxyXG4gIFxyXG4gIHJnYmEocixnLGIsYSl7XHJcblx0ICByZXR1cm4gXCJyZ2JhKFwiICsgciArXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIiwgXCIgKyBhICtcIilcIjtcclxuICB9XHJcbiAgXHJcbiAgdGljayhjdHgsIG1zKXtcclxuICAgIFxyXG4gIH0gXHJcbiAgXHJcbiAgY2xpY2soeCx5KXtcclxuXHQgXHJcbiAgfVxyXG4gIFxyXG4gIHNvbHZlKCl7XHJcblx0ICBcclxuICB9XHJcbiAgXHJcbiAgZ2V0QXNzZXQobmFtZSl7XHJcblx0cmV0dXJuIF8uZmluZCh0aGlzLl9hc3NldHMsIGEgPT4gYS51cmwgPT0gbmFtZSk7XHJcbiAgfVxyXG4gIFxyXG4gIGRyYXdGcm9tU3ByaXRlRnJhbWUoY3R4LCBuYW1lLCBudW1GcmFtZXNXLCBudW1GcmFtZXNILCBmcmFtZUluZGV4LCB0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRXLCB0YXJnZXRIKXtcclxuXHRsZXQgYXNzZXQgPSB0aGlzLmdldEFzc2V0KG5hbWUpLFxyXG5cdFx0ZnJhbWVXID0gYXNzZXQud2lkdGggLyBudW1GcmFtZXNXLFxyXG5cdFx0ZnJhbWVIID0gYXNzZXQuaGVpZ2h0IC8gbnVtRnJhbWVzSCwgXHJcblx0XHRmcmFtZVkgPSBNYXRoLmZsb29yKGZyYW1lSW5kZXggLyBudW1GcmFtZXNXKSxcclxuXHRcdGZyYW1lWCA9IGZyYW1lSW5kZXggLSAoZnJhbWVZICogbnVtRnJhbWVzVyk7XHJcblx0XHRcclxuXHRjdHguZHJhd0ltYWdlKGFzc2V0LmltYWdlLCBmcmFtZVggKiBmcmFtZVcsIGZyYW1lWSAqIGZyYW1lSCwgZnJhbWVXLCBmcmFtZUgsIHRhcmdldFgsIHRhcmdldFksIHRhcmdldFcsIHRhcmdldEgpO1xyXG4gIH1cclxuICBcclxuICBkcmF3RnJvbVNwcml0ZVNoZWV0KGN0eCwgbmFtZSwgc3JjUmVjdCwgdGFyZ2V0UmVjdCl7XHJcblx0ICBsZXQgYXNzZXQgPSB0aGlzLmdldEFzc2V0KG5hbWUpO1xyXG5cdCAgY3R4LmRyYXdJbWFnZShhc3NldC5pbWFnZSwgc3JjUmVjdC54LCBzcmNSZWN0LnksIHNyY1JlY3Qud2lkdGgsIHNyY1JlY3QuaGVpZ2h0LCB0YXJnZXRSZWN0LngsIHRhcmdldFJlY3QueSwgdGFyZ2V0UmVjdC53aWR0aCwgdGFyZ2V0UmVjdC5oZWlnaHQpO1xyXG5cdCAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlTW92ZSh4LHkpe1xyXG5cdHRoaXMuX2xhc3RNb3VzZSA9IG5ldyBQb2ludCh4LHkpO1xyXG4gIH1cclxuICBcclxuICBnZXQgbGFzdE1vdXNlKCkge1xyXG5cdCAgaWYoIXRoaXMuX2xhc3RNb3VzZSkgcmV0dXJuIG51bGw7XHJcblx0ICByZXR1cm4gdGhpcy5fbGFzdE1vdXNlLmNsb25lKCk7XHJcbiAgfVxyXG4gIFxyXG59XHQiLCJjbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEgZXh0ZW5kcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIHsgXHJcbiAgXHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuICAgIHN1cGVyKHJhbmRvbVNlZWQsIGFzc2V0cyk7XHJcbiAgfVxyXG4gICAgXHJcbiAgZ2V0IG1heER1cmF0aW9uKCl7XHJcblx0ICByZXR1cm4gNTAwMDtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IHRpbWVyUHJvZ3Jlc3MoKXtcclxuXHQgIHJldHVybiBNYXRoLm1pbih0aGlzLl90aW1lclByb2dyZXNzIHx8IDAsMTAwKTtcclxuICB9XHJcbiAgXHJcbiAgc2V0IHRpbWVyUHJvZ3Jlc3ModG8pe1xyXG5cdCAgdGhpcy5fdGltZXJQcm9ncmVzcyA9IHRvO1xyXG4gIH1cclxuICBcclxuICBnZXQgZ2FtZVN1Y2Nlc3NQcm9ncmVzcygpe1xyXG5cdCAgcmV0dXJuIHRoaXMuX2dhbWVTdWNjZXNzUHJvZ3Jlc3N8fCAwO1xyXG4gIH1cclxuICBcclxuICBzZXQgZ2FtZVN1Y2Nlc3NQcm9ncmVzcyh0byl7XHJcblx0ICB0aGlzLl9nYW1lU3VjY2Vzc1Byb2dyZXNzID0gdG87XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByb2JvdFN0YXJ0VG9wTGVmdCgpe1xyXG5cdCAgXHJcblx0aWYoIXRoaXMuX3JvYm90U3RhcnRUb3BMZWZ0KXtcclxuXHJcblx0XHRsZXQgeE1pbiA9IDAsIHhNYXggPSB3aW5kb3cuQ09OU1QuQ0FOVkFTX1dJRFRIIC0gMjAwLFxyXG5cdFx0XHR5TWluID0gd2luZG93LkNPTlNULkNBTlZBU19IRUlHSFQgICouMywgeU1heCA9IHdpbmRvdy5DT05TVC5DQU5WQVNfSEVJR0hUKjAuNixcclxuXHRcdFx0eExlbiA9IHhNYXggLSB4TWluLFxyXG5cdFx0XHR5TGVuID0geU1heCAtIHlNaW47XHJcblxyXG5cdFx0dGhpcy5fcm9ib3RTdGFydFRvcExlZnQgPSBuZXcgUG9pbnQoXHJcblx0XHRcdE1hdGguZmxvb3IoeE1pbiArICh4TGVuICogKE51bWJlcih0aGlzLnJhbmRvbVNlZWQuY2hhckF0KDIpLzEwKSkpKSxcclxuXHRcdFx0TWF0aC5mbG9vcih5TWluICsgKHlMZW4gKiAoTnVtYmVyKHRoaXMucmFuZG9tU2VlZC5jaGFyQXQoNCkvMTApKSkpXHJcblx0XHRcdCk7XHJcblx0fVxyXG5cdFx0XHRcclxuXHRyZXR1cm4gdGhpcy5fcm9ib3RTdGFydFRvcExlZnQuY2xvbmUoKTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0Um9ib3RUb3BMZWZ0KGF0KSB7XHJcblx0aWYoYXQgPT09IHVuZGVmaW5lZCkgYXQgPSB0aGlzLnRpbWVyUHJvZ3Jlc3M7XHJcblx0XHJcblx0bGV0IHN0YXJ0ID0gdGhpcy5yb2JvdFN0YXJ0VG9wTGVmdCxcclxuXHRcdHRhcmdldFkgPSAtMzAwLCBcclxuXHRcdHlMZW4gPSB0YXJnZXRZIC0gc3RhcnQueTsgXHJcblx0XHJcblx0c3RhcnQueSArPSAoeUxlbiAqIChhdCphdCkpO1xyXG5cdFxyXG5cdHJldHVybiBzdGFydDtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGJhbGxvb25SZWN0KCl7XHJcblx0dmFyIHIgPSB0aGlzLmdldFJvYm90VG9wTGVmdCgpO1xyXG5cdHJldHVybiBuZXcgUmVjdChyLnggKyA0MCwgci55LCA1MCw2NSk7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCBrZXlTdGF0ZSAoKXtcclxuXHQgIHZhciBzID0gTWF0aC5mbG9vcih0aGlzLnRpbWVyUHJvZ3Jlc3MqMzAlMyk7XHJcblx0ICBjb25zb2xlLmxvZyhcImtleXN0YXRlOiBcIisgcyk7XHJcblx0ICByZXR1cm4gcztcclxuICB9XHJcbiAgXHJcbiAgY2xvdWRQb3NpdGlvbnMgKGF0UGN0KXtcclxuXHQgIHZhciB4MSA9IC01MDtcclxuXHQgIHZhciB5MSA9IC01MDA7XHJcblx0ICB2YXIgeURpc3RhbmNlID0gd2luZG93LkNPTlNULkNBTlZBU19IRUlHSFQgKiBhdFBjdDtcclxuXHQgIFxyXG5cdCAgcmV0dXJuIFsgXHJcblx0XHRcdG5ldyBQb2ludCh4MSwgeTEgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDEgKyA1MCwgeTEgKyAzMDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDEgLSA3NSwgeTEgKyA2MDArIHlEaXN0YW5jZSksXHJcblx0XHRcdFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDMwMCwgeTEgKyAxMDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDI0MCwgeTEgKyA0MDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDMwMCwgeTEgKyA3MDAgKyB5RGlzdGFuY2UpLFxyXG5cdCAgXVxyXG4gIH1cclxuICBcclxuXHR0aWNrKGN0eCwgbXMpe1xyXG5cdFx0c3VwZXIudGljayhjdHgsIG1zKTsgXHJcblx0XHRcclxuXHRcdHRoaXMudGltZXJQcm9ncmVzcyA9IG1zIC8gdGhpcy5tYXhEdXJhdGlvbjtcclxuXHRcdFx0XHJcblx0XHQvL3NreVxyXG5cdFx0dmFyIGdyZD1jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwwLDAsNDAwKTtcclxuXHRcdGdyZC5hZGRDb2xvclN0b3AoMCxcIiM1ZGIxZmZcIik7XHJcblx0XHRncmQuYWRkQ29sb3JTdG9wKDEsXCIjYmNkZGZmXCIpO1xyXG5cdFx0Y3R4LmZpbGxTdHlsZT1ncmQ7XHJcblx0XHRjdHguZmlsbFJlY3QoMCwwLDQwMCw0MDApO1xyXG5cdFx0XHRcclxuXHRcdGlmKHRoaXMuaXNDb21wbGV0ZSkgdGhpcy5kcmF3Q29tcGxldGUoY3R4KTtcclxuXHRcdGVsc2UgdGhpcy5kcmF3KGN0eCk7XHJcblx0fSBcclxuXHRcclxuXHRkcmF3KGN0eCl7XHJcblx0XHRcclxuXHRcdC8vY2xvdWRzXHJcblx0XHR2YXIgY2xvdWRzID0gdGhpcy5jbG91ZFBvc2l0aW9ucyh0aGlzLnRpbWVyUHJvZ3Jlc3MpO1xyXG5cdFx0XHJcblx0XHR2YXIgY2xvdWQgPSBuZXcgUmVjdCgxOTcsODQsMTk1LDEwNSlcclxuXHRcdFx0XHJcblx0XHRjbG91ZHMuZm9yRWFjaChmdW5jdGlvbihwKXtcdFx0XHRcclxuXHRcdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRcdGN0eCwgXHJcblx0XHRcdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdFx0XHRjbG91ZCxcclxuXHRcdFx0XHRuZXcgUmVjdChwLngscC55LCBjbG91ZC53aWR0aCwgY2xvdWQuaGVpZ2h0KVxyXG5cdFx0XHQpO1x0XHJcblx0XHR9LmJpbmQodGhpcykpO1xyXG5cdFx0XHJcblx0XHQgIFxyXG5cdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRjdHgsIFxyXG5cdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRuZXcgUmVjdCgwLDAsMTkwLDQwMCksXHJcblx0XHRcdG5ldyBSZWN0KHRoaXMuZ2V0Um9ib3RUb3BMZWZ0KCkueCx0aGlzLmdldFJvYm90VG9wTGVmdCgpLnksMTkwLDQwMClcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdHZhciBrZXkgPSBuZXcgUmVjdCgxODksMTMsNDUsNDApO1xyXG5cdFx0XHJcblx0XHRpZih0aGlzLmtleVN0YXRlID09PSAxKSB7XHJcblx0XHRcdGtleS54ICs9IGtleS53aWR0aDtcclxuXHRcdFx0a2V5LndpZHRoID0gNDE7XHJcblx0XHR9IGVsc2UgaWYodGhpcy5rZXlTdGF0ZSA9PT0gMil7XHJcblx0XHRcdGtleS54ID0gMjczO1xyXG5cdFx0XHRrZXkud2lkdGggPSAzOVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgZHJhd0tleSA9IG5ldyBSZWN0KDY1IC0ga2V5LndpZHRoLCAyODAgLSBrZXkuaGVpZ2h0LGtleS53aWR0aCwga2V5LmhlaWdodCkub2Zmc2V0KHRoaXMuZ2V0Um9ib3RUb3BMZWZ0KCkpXHJcblx0XHQgIFxyXG5cdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRjdHgsIFxyXG5cdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRrZXksXHJcblx0XHRcdGRyYXdLZXlcclxuXHRcdCk7XHJcblx0XHRcclxuXHQgIH0gXHJcblx0ICBcclxuXHQgIGRyYXdDb21wbGV0ZShjdHgpe1xyXG5cdFx0Ly9jbG91ZHNcclxuXHRcdFx0XHJcblx0XHQrK3RoaXMuX3RpY2tTaW5jZUNvbXBsZXRlO1xyXG5cdFx0XHJcblx0XHR2YXIgY2xvdWRTdGF0ZSA9ICB0aGlzLl9jb21wbGV0ZUF0IC0gKHRoaXMuX3RpY2tTaW5jZUNvbXBsZXRlLzQwMCk7XHJcblx0XHRjb25zb2xlLmxvZyhcImNvbXBsZXRlOiBcIiArIGNsb3VkU3RhdGUpO1xyXG5cdFx0XHJcblx0XHR2YXIgY2xvdWRzID0gdGhpcy5jbG91ZFBvc2l0aW9ucyhNYXRoLm1heCgtMTAwLGNsb3VkU3RhdGUpKTsgXHJcblx0XHRcclxuXHRcdHZhciBjbG91ZCA9IG5ldyBSZWN0KDE5Nyw4NCwxOTUsMTA1KVxyXG5cdFx0XHQgIFxyXG5cdFx0Y2xvdWRzLmZvckVhY2goZnVuY3Rpb24ocCl7XHRcdFx0XHJcblx0XHRcdHRoaXMuZHJhd0Zyb21TcHJpdGVTaGVldChcclxuXHRcdFx0XHRjdHgsIFxyXG5cdFx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdFx0Y2xvdWQsXHJcblx0XHRcdFx0bmV3IFJlY3QocC54LHAueSwgY2xvdWQud2lkdGgsIGNsb3VkLmhlaWdodClcclxuXHRcdFx0KTtcdFxyXG5cdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdFxyXG5cdFx0Ly9yb2JvdFxyXG5cdFx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0XHRjdHgsIFxyXG5cdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRuZXcgUmVjdCgzOTMsMCwyMzEsMjI4KSxcclxuXHRcdFx0bmV3IFJlY3QodGhpcy5nZXRSb2JvdFRvcExlZnQoY2xvdWRTdGF0ZSkueCx0aGlzLmdldFJvYm90VG9wTGVmdChjbG91ZFN0YXRlKS55LDIzMSwyMjgpXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0IH0gXHJcbiAgXHJcblx0Y29tcGxldGUgKCl7XHJcblx0XHR0aGlzLl9pc0NvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdHRoaXMuX2NvbXBsZXRlQXQgPSB0aGlzLnRpbWVyUHJvZ3Jlc3M7XHJcblx0XHR0aGlzLl90aWNrU2luY2VDb21wbGV0ZSA9MDtcclxuXHR9XHJcbiBcclxuXHRnZXQgaXNDb21wbGV0ZSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzQ29tcGxldGU7XHJcblx0fVxyXG5cdFxyXG4gICAgXHJcbiAgY2xpY2soeCx5KXtcclxuXHQvL2RpZCB3ZSBjbGljayBpbnNpZGUgdGhlIGJhbGxvbj8gIFxyXG5cdGlmKHRoaXMuYmFsbG9vblJlY3QuY29udGFpbnMobmV3IFBvaW50KHgseSkpKXtcclxuXHRcdC8vaGl0XHJcblx0XHRjb25zb2xlLmxvZyhcImhpdFwiKTsgXHJcblx0XHR0aGlzLmNvbXBsZXRlKCk7XHJcblx0XHR0aGlzLnNvbHZlKHt4LHksIHByb2dyZXNzIDogdGhpcy50aW1lclByb2dyZXNzfSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8vbWlzc1xyXG5cdFx0Y29uc29sZS5sb2coXCJtaXNzXCIpO1xyXG5cdH1cclxuICB9XHJcbn0gXHJcblxyXG4vKlxyXG5PSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRIID0gXCJodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby90LTI2NS9zcHJpdGVzaGVldDEucG5nXCI7XHJcbiBcclxudmFyIGNvbnRhaW5lciA9IG5ldyBPSkNhcHRjaGFDb250YWluZXIoJChcIiNvai1jYXB0Y2hhLWNvbnRhaW5lclwiKSk7XHJcbmNvbnRhaW5lci5pbml0KFtPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTFdKTsgKi8iLCJjbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTIgZXh0ZW5kcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIHsgXHJcbiAgXHJcblx0Y29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuXHRcdHN1cGVyKHJhbmRvbVNlZWQsIGFzc2V0cyk7XHJcblx0fVxyXG4gICAgXHJcblx0Z2V0IG1heER1cmF0aW9uKCl7XHJcblx0XHRyZXR1cm4gNTAwMDtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHdpbmRTaWRlKCl7XHJcblx0XHRpZighdGhpcy5fc2lkZSkgdGhpcy5fc2lkZSA9IHBhcnNlSW50KCh0aGlzLnJhbmRvbVNlZWQgKyBcIlwiKS5jaGFyQXQoMikpIDwgNSA/IFwibGVmdFwiIDogXCJyaWdodFwiO1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NpZGU7XHJcblx0fVxyXG4gIFxyXG5cdGdldCB0aW1lclByb2dyZXNzKCl7XHJcblx0XHRyZXR1cm4gTWF0aC5taW4odGhpcy5fdGltZXJQcm9ncmVzcyB8fCAwLDEwMCk7XHJcblx0fVxyXG4gIFxyXG5cdHNldCB0aW1lclByb2dyZXNzKHRvKXtcclxuXHRcdHRoaXMuX3RpbWVyUHJvZ3Jlc3MgPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IHpvb21Qcm9ncmVzcygpe1xyXG5cdFx0cmV0dXJuIE1hdGgubWluKDEsdGhpcy5fdGltZXJQcm9ncmVzcyAvIDAuMik7XHJcblx0fVxyXG4gIFxyXG5cdGdldCBzdGF0ZSgpe1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gXCJ6b29taW5nXCI7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMuem9vbVByb2dyZXNzIDwgMSl7XHJcblx0XHRcdHJldHVybiBcInpvb21pbmdcIjtcclxuXHRcdH0gXHJcblx0XHRpZighdGhpcy5faW5zZXJ0ZWQpIHJldHVybiBcImluc2VydGluZ1wiO1xyXG5cdFx0cmV0dXJuIFwid2luZGluZ1wiO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgcm9ib3RTcHJpdGVTaGVldFJlY3QoKXtcclxuXHRcdHJldHVybiBuZXcgUmVjdCgwLDAsMzU4LDUyNik7XHJcblx0fVxyXG5cdFxyXG5cdGRyYXdSb2JvdChjdHgseCx5LHNjYWxlKXtcclxuXHRcdHZhciBjdXRPdXQgPSB0aGlzLnJvYm90U3ByaXRlU2hlZXRSZWN0O1xyXG5cdFx0XHJcblx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdFx0Y3R4LCBcclxuXHRcdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTIucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRcdGN1dE91dCxcclxuXHRcdFx0XHRuZXcgUmVjdCh4LHksIGN1dE91dC53aWR0aCAqIHNjYWxlLCBjdXRPdXQuaGVpZ2h0ICogc2NhbGUpXHJcblx0XHRcdCk7XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgcm9ib3Rab29tRGF0YSgpe1xyXG5cdFx0aWYoIXRoaXMuX3JvYm90Wm9vbURhdGEpe1xyXG5cdFx0XHR0aGlzLl9yb2JvdFpvb21EYXRhID0geyBcclxuXHRcdFx0XHR4OiAxMDAsXHJcblx0XHRcdFx0eTogLTUwLFxyXG5cdFx0XHRcdHNjYWxlIDogMS4yXHJcblx0XHRcdH1cclxuXHRcdH1cdFxyXG5cdFx0cmV0dXJuIHRoaXMuX3JvYm90Wm9vbURhdGE7XHJcblx0fVxyXG4gIFxyXG5cdHRpY2soY3R4LCBtcyl7XHJcblx0XHRzdXBlci50aWNrKGN0eCwgbXMpOyBcclxuXHRcdFxyXG5cdFx0dGhpcy50aW1lclByb2dyZXNzID0gbXMgLyB0aGlzLm1heER1cmF0aW9uO1xyXG5cdFx0XHRcclxuXHRcdC8vc2t5XHJcblx0XHR2YXIgZ3JkPWN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLDAsMCw0MDApO1xyXG5cdFx0Z3JkLmFkZENvbG9yU3RvcCgwLFwiIzVkYjFmZlwiKTtcclxuXHRcdGdyZC5hZGRDb2xvclN0b3AoMSxcIiNiY2RkZmZcIik7XHJcblx0XHRjdHguZmlsbFN0eWxlPWdyZDtcclxuXHRcdGN0eC5maWxsUmVjdCgwLDAsNDAwLDQwMCk7XHJcblx0XHRcclxuXHRcdHRoaXNbXCJkcmF3X1wiK3RoaXMuc3RhdGVdKGN0eCk7XHJcblx0fSBcclxuXHRcclxuXHRkcmF3X3pvb21pbmcoY3R4KXtcclxuXHRcdFxyXG5cdFx0XHJcblx0XHR2YXIgY2VudGVyID0gbmV3IFBvaW50KHdpbmRvdy5DT05TVC5DQU5WQVNfV0lEVEggLzIsIHdpbmRvdy5DT05TVC5DQU5WQVNfSEVJR0hUIC8yKTsgXHJcblx0XHRcclxuXHRcdHZhciBjYW52YXMgPSBuZXcgUmVjdCgwLDAsd2luZG93LkNPTlNULkNBTlZBU19XSURUSCwgd2luZG93LkNPTlNULkNBTlZBU19IRUlHSFQpOyBcclxuXHRcdFxyXG5cdFx0dmFyIHJvYm90UmVjdCA9IHRoaXMucm9ib3RTcHJpdGVTaGVldFJlY3Q7XHJcblx0XHRcclxuXHRcdHZhciBpbml0aWFsU2NhbGUgPSAwLjQ7XHJcblx0XHRcclxuXHRcdHJvYm90UmVjdC53aWR0aCAqPSBpbml0aWFsU2NhbGU7XHJcblx0XHRyb2JvdFJlY3QuaGVpZ2h0ICo9IGluaXRpYWxTY2FsZTsgXHJcblx0XHRcclxuXHRcdHZhciByb2JvdFN0YXJ0UmVjdCA9IG5ldyBSZWN0KCAoIGNhbnZhcy53aWR0aCAtIHJvYm90UmVjdC53aWR0aCkgKiAuNSwgKGNhbnZhcy5oZWlnaHQgLSByb2JvdFJlY3QuaGVpZ2h0KSwgcm9ib3RSZWN0LndpZHRoLCByb2JvdFJlY3QuaGVpZ2h0KTtcclxuXHRcdGNvbnNvbGUubG9nKCBjYW52YXMud2lkdGggKyBcIiAtIFwiICsgcm9ib3RSZWN0LndpZHRoKyBcIiAqIDVcIiApO1xyXG5cdFx0XHJcblx0XHR2YXIgcm9ib3RFbmQgPSB0aGlzLnJvYm90Wm9vbURhdGE7XHJcblx0XHRcclxuXHRcdHZhciB0b3BMZWZ0ID0gbmV3IFBvaW50KHJvYm90U3RhcnRSZWN0LngsIHJvYm90U3RhcnRSZWN0LnkpLmludGVycG9sYXRlKG5ldyBQb2ludChyb2JvdEVuZC54LCByb2JvdEVuZC55KSwgdGhpcy56b29tUHJvZ3Jlc3MpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmRyYXdSb2JvdChjdHgsIHRvcExlZnQueCwgdG9wTGVmdC55LCByb2JvdEVuZC5zY2FsZSAqIHRoaXMuem9vbVByb2dyZXNzKTtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRkcmF3X2luc2VydGluZyhjdHgpe1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdGRyYXdfd2luZGluZyhjdHgpe1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdGRyYXcoY3R4KXtcclxuXHRcdFxyXG5cdFx0Ly9jbG91ZHNcclxuXHRcdHZhciBjbG91ZHMgPSB0aGlzLmNsb3VkUG9zaXRpb25zKHRoaXMudGltZXJQcm9ncmVzcyk7XHJcblx0XHRcclxuXHRcdHZhciBjbG91ZCA9IG5ldyBSZWN0KDE5Nyw4NCwxOTUsMTA1KVxyXG5cdFx0XHRcclxuXHRcdGNsb3Vkcy5mb3JFYWNoKGZ1bmN0aW9uKHApe1x0XHRcdFxyXG5cdFx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdFx0Y3R4LCBcclxuXHRcdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTIucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRcdGNsb3VkLFxyXG5cdFx0XHRcdG5ldyBSZWN0KHAueCxwLnksIGNsb3VkLndpZHRoLCBjbG91ZC5oZWlnaHQpXHJcblx0XHRcdCk7XHRcclxuXHRcdH0uYmluZCh0aGlzKSk7XHJcblx0XHRcclxuXHR9IFxyXG4gIFxyXG5cdGNvbXBsZXRlKCl7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbiBcclxuXHRjbGljayh4LHkpe1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG59IFxyXG5cclxuXHJcbk9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMi5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEggPSBcImh0dHBzOi8vczMtdXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vcy5jZHBuLmlvL3QtMjY1L2dhbWVfc3ByaXRlc2hlZXRfMi5wbmdcIjtcclxuIFxyXG52YXIgY29udGFpbmVyID0gbmV3IE9KQ2FwdGNoYUNvbnRhaW5lcigkKFwiI29qLWNhcHRjaGEtY29udGFpbmVyXCIpKTtcclxuY29udGFpbmVyLmluaXQoW09KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMl0pOyAiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
