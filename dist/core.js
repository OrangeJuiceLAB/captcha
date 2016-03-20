"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OJBase = function OJBase() {
	_classCallCheck(this, OJBase);
};

window.CONST = {
	canvasWidth: 400,
	canvasHeight: 400
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
			var yDistance = window.CONST.canvasHeight * atPct;

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
				    xMax = window.CONST.canvasWidth - 200,
				    yMin = window.CONST.canvasHeight * .3,
				    yMax = window.CONST.canvasHeight * 0.6,
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

OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/spritesheet1.png";

var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_game1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OJCaptchaMicroGame_example = function (_OJCaptchaMicroGameBa) {
	_inherits(OJCaptchaMicroGame_example, _OJCaptchaMicroGameBa);

	function OJCaptchaMicroGame_example(randomSeed, assets) {
		_classCallCheck(this, OJCaptchaMicroGame_example);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaMicroGame_example).call(this, randomSeed, assets));

		_this.fadeInButtons = true;
		return _this;
	}

	_createClass(OJCaptchaMicroGame_example, [{
		key: "getNextexplosionFrame",
		value: function getNextexplosionFrame() {
			if (this._explosionFrame === undefined) this._explosionFrame = -1;
			this._explosionFrame = ++this._explosionFrame % (5 * 5);
			return this._explosionFrame;
		}
	}, {
		key: "tick",
		value: function tick(ctx, ms) {
			_get(Object.getPrototypeOf(OJCaptchaMicroGame_example.prototype), "tick", this).call(this, ctx, ms);

			ctx.fillStyle = 'black';

			ctx.fillRect(0, 0, 400, 400);

			var center = this.lastMouse || new Point(200, 200);
			if (!center) center = new Point(200);

			center.x -= 50;
			center.y -= 50;

			this.drawFromSpriteFrame(ctx, OJCaptchaMicroGame_example.prototype.SPRITE_SHEET_PATH, 5, 5, this.getNextexplosionFrame(), center.x, center.y, 100, 100);
		}
	}, {
		key: "click",
		value: function click(x, y) {}
	}]);

	return OJCaptchaMicroGame_example;
}(OJCaptchaMicroGameBase);

OJCaptchaMicroGame_example.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/explosion17.png";

/*
var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_example]); 
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYmFzZS5qcyIsImdhbWVzLzEuanMiLCJnYW1lcy9leGFtcGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFFTSxTQUVKLFNBRkksTUFFSixHQUFhO3VCQUZULFFBRVM7Q0FBYjs7QUFNRixPQUFPLEtBQVAsR0FBZTtBQUNkLGNBQWMsR0FBZDtBQUNBLGVBQWUsR0FBZjtDQUZEOztJQUtNOzs7QUFDTCxVQURLLEtBQ0wsQ0FBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQjt3QkFEWCxPQUNXOztxRUFEWCxtQkFDVzs7QUFFZixRQUFLLEVBQUwsR0FBVSxDQUFWLENBRmU7QUFHZixRQUFLLEVBQUwsR0FBVSxDQUFWLENBSGU7O0VBQWhCOztjQURLOzt5QkEyQkUsR0FBRSxHQUFFO0FBQ1YsT0FBRyxFQUFFLE9BQUYsRUFBVztBQUNiLFNBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBRixDQURHO0FBRWIsU0FBSyxDQUFMLElBQVUsRUFBRSxDQUFGLENBRkc7SUFBZCxNQUdPO0FBQ04sU0FBSyxDQUFMLElBQVUsQ0FBVixDQURNO0FBRU4sU0FBSyxDQUFMLElBQVUsQ0FBVixDQUZNO0lBSFA7QUFPQSxVQUFPLElBQVAsQ0FSVTs7OzswQkFXSjtBQUNOLFVBQU8sSUFBSSxLQUFKLENBQVUsS0FBSyxDQUFMLEVBQVEsS0FBSyxDQUFMLENBQXpCLENBRE07Ozs7c0JBL0JNO0FBQ1osVUFBTyxJQUFQLENBRFk7Ozs7c0JBSU47QUFDTixVQUFPLEtBQUssRUFBTCxDQUREOztvQkFJRCxJQUFHO0FBQ1IsUUFBSyxFQUFMLEdBQVUsRUFBVixDQURROzs7O3NCQUlGO0FBQ04sVUFBTyxLQUFLLEVBQUwsQ0FERDs7b0JBSUQsSUFBRztBQUNSLFFBQUssRUFBTCxHQUFVLEVBQVYsQ0FEUTs7OztRQXZCSjtFQUFjOztJQTJDZDs7O0FBQ0wsVUFESyxJQUNMLENBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0IsS0FBaEIsRUFBc0IsTUFBdEIsRUFBNkI7d0JB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QUcsQ0FBQyxNQUFELEVBQVMsU0FBUyxJQUFJLEtBQUosQ0FBVSxHQUFWLENBQVQsQ0FBWjs7QUFFQSxVQUFPLENBQVAsSUFBWSxFQUFaLENBVmM7QUFXZCxVQUFPLENBQVAsSUFBWSxFQUFaLENBWGM7O0FBYWQsUUFBSyxtQkFBTCxDQUNDLEdBREQsRUFFQywyQkFBMkIsU0FBM0IsQ0FBcUMsaUJBQXJDLEVBQ0EsQ0FIRCxFQUlDLENBSkQsRUFLQyxLQUFLLHFCQUFMLEVBTEQsRUFNQyxPQUFPLENBQVAsRUFDQSxPQUFPLENBQVAsRUFDQSxHQVJELEVBU0MsR0FURCxFQWJjOzs7O3dCQXlCUCxHQUFFLEdBQUU7OztRQXRDTjtFQUFtQzs7QUEyQ3pDLDJCQUEyQixTQUEzQixDQUFxQyxpQkFBckMsR0FBeUQsb0VBQXpEIiwiZmlsZSI6ImNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmNsYXNzIE9KQmFzZSB7XHJcbiAgXHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIFxyXG4gIH1cclxuICBcclxufVxyXG5cclxud2luZG93LkNPTlNUID0ge1xyXG5cdGNhbnZhc1dpZHRoIDogNDAwLFxyXG5cdGNhbnZhc0hlaWdodCA6IDQwMFxyXG59XHJcblxyXG5jbGFzcyBQb2ludCBleHRlbmRzIE9KQmFzZSB7XHJcblx0Y29uc3RydWN0b3IoeCx5KXtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLl94ID0geDtcclxuXHRcdHRoaXMuX3kgPSB5O1xyXG5cdH1cclxuXHRcclxuXHRnZXQgaXNQb2ludCgpe1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdGdldCB4KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5feDtcclxuXHR9XHJcblx0XHJcblx0c2V0IHgodG8pe1xyXG5cdFx0dGhpcy5feCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3k7IFxyXG5cdH1cclxuXHRcclxuXHRzZXQgeSh0byl7XHJcblx0XHR0aGlzLl95ID0gdG87XHJcblx0fVxyXG5cdFxyXG5cdG9mZnNldCh4LHkpe1xyXG5cdFx0aWYoeC5pc1BvaW50KSB7XHJcblx0XHRcdHRoaXMueCArPSB4Lng7XHJcblx0XHRcdHRoaXMueSArPSB4Lnk7XHJcblx0XHR9IGVsc2UgeyBcclxuXHRcdFx0dGhpcy54ICs9IHg7XHJcblx0XHRcdHRoaXMueSArPSB5O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdFxyXG5cdGNsb25lKCl7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFJlY3QgZXh0ZW5kcyBQb2ludCB7XHJcblx0Y29uc3RydWN0b3IoeCx5LHdpZHRoLGhlaWdodCl7XHJcblx0XHRzdXBlcih4LHkpO1xyXG5cdFx0dGhpcy5fd2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuX2hlaWdodCA9IGhlaWdodDtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHdpZHRoKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xyXG5cdH1cclxuXHRcclxuXHRzZXQgd2lkdGgodG8pe1xyXG5cdFx0dGhpcy5fd2lkdGggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IGhlaWdodCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX2hlaWdodDtcclxuXHR9XHJcblx0XHJcblx0c2V0IGhlaWdodCh0byl7XHJcblx0XHR0aGlzLl9oZWlnaHQgPSB0bztcclxuXHR9XHJcblx0XHJcblx0XHJcblx0Y29udGFpbnMocCl7XHRcdFxyXG5cdFx0cmV0dXJuIChwLnggPj0gdGhpcy54ICYmIHAueCA8PSB0aGlzLnggKyB0aGlzLndpZHRoICYmIHAueSA+PSB0aGlzLnkgJiYgcC55IDw9IHRoaXMueSArIHRoaXMuaGVpZ2h0KTtcclxuXHR9XHJcblx0XHJcblx0Y2xvbmUoKXtcclxuXHRcdHJldHVybiBuZXcgUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhQmFzZSBleHRlbmRzIE9KQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG59IFxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhQ29udGFpbmVyIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoJHNyYyl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fJHNyYyA9ICRzcmM7XHJcblx0dGhpcy5pbWFnZUFzc2V0cyA9IFtdO1xyXG4gIH1cclxuICBcclxuICBnZXQgJHNyYygpe1xyXG4gICAgcmV0dXJuIHRoaXMuXyRzcmM7IFxyXG4gIH1cclxuICBcclxuICBnZXQgYWN0aXZlR2FtZSgpe1xyXG4gICAgaWYoIXRoaXMuX2FjdGl2ZUdhbWUpe1xyXG5cdFx0XHJcblx0ICAvL2NyZWF0ZSBhIDE2IGNoYXIgcmFuZG9tU2VlZFxyXG5cdCAgdGhpcy5fYWN0aXZlU2VlZCA9IF8udGltZXMoMTYsICgpID0+IF8ucmFuZG9tKDAsOSkpLmpvaW4oXCJcIik7XHJcblx0ICBcclxuXHQgIC8vc3RhcnQgdGhlIGFjdGl2ZSBnYW1lXHJcbiAgICAgIHRoaXMuX2FjdGl2ZUdhbWUgPSBuZXcgdGhpcy5fZ2FtZXNRdWV1ZVswXSh0aGlzLl9hY3RpdmVTZWVkLCB0aGlzLmltYWdlQXNzZXRzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUdhbWU7XHJcbiAgfVxyXG4gIFxyXG4gIGluaXQoZ2FtZXNBcnIpe1xyXG5cdCAgXHJcbiAgICB0aGlzLl9nYW1lc1F1ZXVlID0gZ2FtZXNBcnI7XHJcblx0XHJcblx0dGhpcy5sb2FkQXNzZXRzKClcclxuXHRcdC50aGVuKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGxvYWRBc3NldHMoKXtcclxuXHRcdGNvbnNvbGUubG9nKFwibG9hZEFzc2V0c1wiKTtcclxuXHQgIC8vZ2V0IHNwcml0ZXNoZWV0cyBmcm9tIGdhbWUgY2xhc3Nlc1xyXG5cdCAgIF8uZm9yRWFjaCh0aGlzLl9nYW1lc1F1ZXVlLCAoZykgPT4ge1xyXG5cdFx0ICBsZXQgdXJsID0gZy5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEg7XHJcblx0XHQgIGNvbnNvbGUubG9nKFwibG9hZCA6IFwiICsgdXJsKTtcclxuXHRcdCAgaWYodXJsICYmICEodXJsIGluIHRoaXMuaW1hZ2VBc3NldHMpKXtcclxuXHRcdFx0ICB0aGlzLmltYWdlQXNzZXRzLnB1c2goeyB1cmwgLCBpbWFnZSA6IG5ldyBJbWFnZSgpfSk7XHJcblx0XHQgIH1cclxuXHQgIH0sIHRoaXMpO1xyXG5cclxuXHQgIC8vbG9hZCBzaW5nbGUgc3ByaXRlc2hlZXQgaW1hZ2VcclxuXHQgIGxldCBsb2FkU3ByaXRlU2hlZXQgPSAoc3ByaXRlU2hlZXQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdHNwcml0ZVNoZWV0LmltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC5jb21wbGV0ZSA9IHRydWU7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQud2lkdGggPSBzcHJpdGVTaGVldC5pbWFnZS5uYXR1cmFsV2lkdGg7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQuaGVpZ2h0ID0gc3ByaXRlU2hlZXQuaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuXHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3ByaXRlU2hlZXQuaW1hZ2Uuc3JjID0gc3ByaXRlU2hlZXQudXJsO1xyXG5cdFx0fSk7XHJcblx0ICB9XHJcblx0ICBcclxuXHQgIC8vcmVjdXJzaXZlIGNsb3N1cmUgdGhhdCBsb2FkcyBhbGwgc3ByZWFkc2hlZXRzIGZyb20gcXVldWVcclxuXHQgIGxldCBsb2FkZXIgPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0bGV0IG5leHQgPSBfLmZpbmQodGhpcy5pbWFnZUFzc2V0cywgYSA9PiAhYS5jb21wbGV0ZSk7XHJcblx0XHRpZighbmV4dCkgcmV0dXJuIHJlc29sdmUoKTtcclxuXHRcdGxvYWRTcHJpdGVTaGVldChuZXh0KS50aGVuKCAoKSA9PiBsb2FkZXIocmVzb2x2ZSxyZWplY3QpKTtcclxuXHQgIH0uYmluZCh0aGlzKTtcclxuXHQgIFxyXG5cdCAgcmV0dXJuIG5ldyBQcm9taXNlKGxvYWRlcik7XHJcbiAgfVxyXG4gIFxyXG4gIGJ1aWxkKCl7XHJcbiAgICB0aGlzLmlzQnVpbGQgPSB0cnVlO1xyXG4gICAgdGhpcy4kY2FudmFzID0gJChcIjxjYW52YXMgd2lkdGg9JzQwMCcgaGVpZ2h0PSc0MDAnPjwvY2FudmFzPlwiKTtcclxuXHR0aGlzLiRjYW52YXMubW91c2Vtb3ZlKHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcykpO1xyXG5cdHRoaXMuJGNhbnZhcy5jbGljayh0aGlzLmNhbnZhc2NsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLiRjYW52YXNbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgdGhpcy5fJHNyYy5hcHBlbmQodGhpcy4kY2FudmFzKTsgXHJcbiAgfVxyXG4gIFxyXG4gIHN0YXJ0KCl7XHJcblx0ICBjb25zb2xlLmxvZyhcImFzc2V0cyBsb2FkZWRcIik7XHJcbiAgICBpZighdGhpcy5pc0J1aWx0KSB0aGlzLmJ1aWxkKCk7XHJcbiAgICAvL3RpY2tcclxuXHR0aGlzLl9zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIHRpY2sodGltZVN0YW1wKXtcclxuICAgIHRoaXMuYWN0aXZlR2FtZS50aWNrKHRoaXMuY3R4LCB0aW1lU3RhbXAgLSB0aGlzLl9zdGFydFRpbWUpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGNhbnZhc2NsaWNrKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUuY2xpY2soZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTsgIFxyXG4gIH1cclxuICBcclxuICBtb3VzZW1vdmUoZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5tb3VzZU1vdmUoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcclxuICB9XHJcbiAgXHJcbn1cclxuXHJcbmNsYXNzIE9KQ2FwdGNoYU1pY3JvR2FtZUJhc2UgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuXHRcclxuICBjb25zdHJ1Y3RvcihyYW5kb21TZWVkLCBhc3NldHMpe1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuX3JhbmRvbVNlZWQgPSByYW5kb21TZWVkO1xyXG5cdHRoaXMuX2Fzc2V0cyA9IGFzc2V0cztcclxuXHR0aGlzLl9mcmFtZXMgPSB7fTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IHJhbmRvbVNlZWQoKXtcclxuICAgIHJldHVybiB0aGlzLl9yYW5kb21TZWVkO1xyXG4gIH1cclxuICBcclxuICByZ2JhKHIsZyxiLGEpe1xyXG5cdCAgcmV0dXJuIFwicmdiYShcIiArIHIgK1wiLCBcIiArIGcgKyBcIiwgXCIgKyBiICsgXCIsIFwiICsgYSArXCIpXCI7XHJcbiAgfVxyXG4gIFxyXG4gIHRpY2soY3R4LCBtcyl7XHJcbiAgICBcclxuICB9IFxyXG4gIFxyXG4gIGNsaWNrKHgseSl7XHJcblx0IFxyXG4gIH1cclxuICBcclxuICBzb2x2ZSgpe1xyXG5cdCAgXHJcbiAgfVxyXG4gIFxyXG4gIGdldEFzc2V0KG5hbWUpe1xyXG5cdHJldHVybiBfLmZpbmQodGhpcy5fYXNzZXRzLCBhID0+IGEudXJsID09IG5hbWUpO1xyXG4gIH1cclxuICBcclxuICBkcmF3RnJvbVNwcml0ZUZyYW1lKGN0eCwgbmFtZSwgbnVtRnJhbWVzVywgbnVtRnJhbWVzSCwgZnJhbWVJbmRleCwgdGFyZ2V0WCwgdGFyZ2V0WSwgdGFyZ2V0VywgdGFyZ2V0SCl7XHJcblx0bGV0IGFzc2V0ID0gdGhpcy5nZXRBc3NldChuYW1lKSxcclxuXHRcdGZyYW1lVyA9IGFzc2V0LndpZHRoIC8gbnVtRnJhbWVzVyxcclxuXHRcdGZyYW1lSCA9IGFzc2V0LmhlaWdodCAvIG51bUZyYW1lc0gsIFxyXG5cdFx0ZnJhbWVZID0gTWF0aC5mbG9vcihmcmFtZUluZGV4IC8gbnVtRnJhbWVzVyksXHJcblx0XHRmcmFtZVggPSBmcmFtZUluZGV4IC0gKGZyYW1lWSAqIG51bUZyYW1lc1cpO1xyXG5cdFx0XHJcblx0Y3R4LmRyYXdJbWFnZShhc3NldC5pbWFnZSwgZnJhbWVYICogZnJhbWVXLCBmcmFtZVkgKiBmcmFtZUgsIGZyYW1lVywgZnJhbWVILCB0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRXLCB0YXJnZXRIKTtcclxuICB9XHJcbiAgXHJcbiAgZHJhd0Zyb21TcHJpdGVTaGVldChjdHgsIG5hbWUsIHNyY1JlY3QsIHRhcmdldFJlY3Qpe1xyXG5cdCAgbGV0IGFzc2V0ID0gdGhpcy5nZXRBc3NldChuYW1lKTtcclxuXHQgIGN0eC5kcmF3SW1hZ2UoYXNzZXQuaW1hZ2UsIHNyY1JlY3QueCwgc3JjUmVjdC55LCBzcmNSZWN0LndpZHRoLCBzcmNSZWN0LmhlaWdodCwgdGFyZ2V0UmVjdC54LCB0YXJnZXRSZWN0LnksIHRhcmdldFJlY3Qud2lkdGgsIHRhcmdldFJlY3QuaGVpZ2h0KTtcclxuXHQgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICBcclxuICBtb3VzZU1vdmUoeCx5KXtcclxuXHR0aGlzLl9sYXN0TW91c2UgPSBuZXcgUG9pbnQoeCx5KTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGxhc3RNb3VzZSgpIHtcclxuXHQgIGlmKCF0aGlzLl9sYXN0TW91c2UpIHJldHVybiBudWxsO1xyXG5cdCAgcmV0dXJuIHRoaXMuX2xhc3RNb3VzZS5jbG9uZSgpO1xyXG4gIH1cclxuICBcclxufVx0IiwiY2xhc3MgT0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxIGV4dGVuZHMgT0pDYXB0Y2hhTWljcm9HYW1lQmFzZSB7IFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHJhbmRvbVNlZWQsIGFzc2V0cyl7XHJcbiAgICBzdXBlcihyYW5kb21TZWVkLCBhc3NldHMpO1xyXG4gIH1cclxuICAgIFxyXG4gIGdldCBtYXhEdXJhdGlvbigpe1xyXG5cdCAgcmV0dXJuIDUwMDA7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCB0aW1lclByb2dyZXNzKCl7XHJcblx0ICByZXR1cm4gTWF0aC5taW4odGhpcy5fdGltZXJQcm9ncmVzcyB8fCAwLDEwMCk7XHJcbiAgfVxyXG4gIFxyXG4gIHNldCB0aW1lclByb2dyZXNzKHRvKXtcclxuXHQgIHRoaXMuX3RpbWVyUHJvZ3Jlc3MgPSB0bztcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGdhbWVTdWNjZXNzUHJvZ3Jlc3MoKXtcclxuXHQgIHJldHVybiB0aGlzLl9nYW1lU3VjY2Vzc1Byb2dyZXNzfHwgMDtcclxuICB9XHJcbiAgXHJcbiAgc2V0IGdhbWVTdWNjZXNzUHJvZ3Jlc3ModG8pe1xyXG5cdCAgdGhpcy5fZ2FtZVN1Y2Nlc3NQcm9ncmVzcyA9IHRvO1xyXG4gIH1cclxuICBcclxuICBnZXQgcm9ib3RTdGFydFRvcExlZnQoKXtcclxuXHQgIFxyXG5cdGlmKCF0aGlzLl9yb2JvdFN0YXJ0VG9wTGVmdCl7XHJcblxyXG5cdFx0bGV0IHhNaW4gPSAwLCB4TWF4ID0gd2luZG93LkNPTlNULmNhbnZhc1dpZHRoIC0gMjAwLFxyXG5cdFx0XHR5TWluID0gd2luZG93LkNPTlNULmNhbnZhc0hlaWdodCAgKi4zLCB5TWF4ID0gd2luZG93LkNPTlNULmNhbnZhc0hlaWdodCowLjYsXHJcblx0XHRcdHhMZW4gPSB4TWF4IC0geE1pbixcclxuXHRcdFx0eUxlbiA9IHlNYXggLSB5TWluO1xyXG5cclxuXHRcdHRoaXMuX3JvYm90U3RhcnRUb3BMZWZ0ID0gbmV3IFBvaW50KFxyXG5cdFx0XHRNYXRoLmZsb29yKHhNaW4gKyAoeExlbiAqIChOdW1iZXIodGhpcy5yYW5kb21TZWVkLmNoYXJBdCgyKS8xMCkpKSksXHJcblx0XHRcdE1hdGguZmxvb3IoeU1pbiArICh5TGVuICogKE51bWJlcih0aGlzLnJhbmRvbVNlZWQuY2hhckF0KDQpLzEwKSkpKVxyXG5cdFx0XHQpO1xyXG5cdH1cclxuXHRcdFx0XHJcblx0cmV0dXJuIHRoaXMuX3JvYm90U3RhcnRUb3BMZWZ0LmNsb25lKCk7XHJcbiAgfVxyXG4gIFxyXG4gIGdldFJvYm90VG9wTGVmdChhdCkge1xyXG5cdGlmKGF0ID09PSB1bmRlZmluZWQpIGF0ID0gdGhpcy50aW1lclByb2dyZXNzO1xyXG5cdFxyXG5cdGxldCBzdGFydCA9IHRoaXMucm9ib3RTdGFydFRvcExlZnQsXHJcblx0XHR0YXJnZXRZID0gLTMwMCwgXHJcblx0XHR5TGVuID0gdGFyZ2V0WSAtIHN0YXJ0Lnk7IFxyXG5cdFxyXG5cdHN0YXJ0LnkgKz0gKHlMZW4gKiAoYXQqYXQpKTtcclxuXHRcclxuXHRyZXR1cm4gc3RhcnQ7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCBiYWxsb29uUmVjdCgpe1xyXG5cdHZhciByID0gdGhpcy5nZXRSb2JvdFRvcExlZnQoKTtcclxuXHRyZXR1cm4gbmV3IFJlY3Qoci54ICsgNDAsIHIueSwgNTAsNjUpO1xyXG4gIH1cclxuICBcclxuICBnZXQga2V5U3RhdGUgKCl7XHJcblx0ICB2YXIgcyA9IE1hdGguZmxvb3IodGhpcy50aW1lclByb2dyZXNzKjMwJTMpO1xyXG5cdCAgY29uc29sZS5sb2coXCJrZXlzdGF0ZTogXCIrIHMpO1xyXG5cdCAgcmV0dXJuIHM7XHJcbiAgfVxyXG4gIFxyXG4gIGNsb3VkUG9zaXRpb25zIChhdFBjdCl7XHJcblx0ICB2YXIgeDEgPSAtNTA7XHJcblx0ICB2YXIgeTEgPSAtNTAwO1xyXG5cdCAgdmFyIHlEaXN0YW5jZSA9IHdpbmRvdy5DT05TVC5jYW52YXNIZWlnaHQgKiBhdFBjdDtcclxuXHQgIFxyXG5cdCAgcmV0dXJuIFsgXHJcblx0XHRcdG5ldyBQb2ludCh4MSwgeTEgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDEgKyA1MCwgeTEgKyAzMDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDEgLSA3NSwgeTEgKyA2MDArIHlEaXN0YW5jZSksXHJcblx0XHRcdFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDMwMCwgeTEgKyAxMDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDI0MCwgeTEgKyA0MDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRuZXcgUG9pbnQoeDErIDMwMCwgeTEgKyA3MDAgKyB5RGlzdGFuY2UpLFxyXG5cdFx0XHRcclxuXHQgIF1cclxuICB9XHJcbiAgXHJcblx0dGljayhjdHgsIG1zKXtcclxuXHRcdHN1cGVyLnRpY2soY3R4LCBtcyk7IFxyXG5cdFx0XHJcblx0XHR0aGlzLnRpbWVyUHJvZ3Jlc3MgPSBtcyAvIHRoaXMubWF4RHVyYXRpb247XHJcblx0XHRcdFxyXG5cdFx0Ly9za3lcclxuXHRcdHZhciBncmQ9Y3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsMCwwLDQwMCk7XHJcblx0XHRncmQuYWRkQ29sb3JTdG9wKDAsXCIjNWRiMWZmXCIpO1xyXG5cdFx0Z3JkLmFkZENvbG9yU3RvcCgxLFwiI2JjZGRmZlwiKTtcclxuXHRcdGN0eC5maWxsU3R5bGU9Z3JkO1xyXG5cdFx0Y3R4LmZpbGxSZWN0KDAsMCw0MDAsNDAwKTtcclxuXHRcdFx0XHJcblx0XHRpZih0aGlzLmlzQ29tcGxldGUpIHRoaXMuZHJhd0NvbXBsZXRlKGN0eCk7XHJcblx0XHRlbHNlIHRoaXMuZHJhdyhjdHgpO1xyXG5cdH0gXHJcblx0XHJcblx0ZHJhdyhjdHgpe1xyXG5cdFx0XHJcblx0XHQvL2Nsb3Vkc1xyXG5cdFx0dmFyIGNsb3VkcyA9IHRoaXMuY2xvdWRQb3NpdGlvbnModGhpcy50aW1lclByb2dyZXNzKTtcclxuXHRcdFxyXG5cdFx0dmFyIGNsb3VkID0gbmV3IFJlY3QoMTk3LDg0LDE5NSwxMDUpXHJcblx0XHRcdFxyXG5cdFx0Y2xvdWRzLmZvckVhY2goZnVuY3Rpb24ocCl7XHRcdFx0XHJcblx0XHRcdHRoaXMuZHJhd0Zyb21TcHJpdGVTaGVldChcclxuXHRcdFx0XHRjdHgsIFxyXG5cdFx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdFx0Y2xvdWQsXHJcblx0XHRcdFx0bmV3IFJlY3QocC54LHAueSwgY2xvdWQud2lkdGgsIGNsb3VkLmhlaWdodClcclxuXHRcdFx0KTtcdFxyXG5cdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdFxyXG5cdFx0ICBcclxuXHRcdHRoaXMuZHJhd0Zyb21TcHJpdGVTaGVldChcclxuXHRcdFx0Y3R4LCBcclxuXHRcdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdFx0bmV3IFJlY3QoMCwwLDE5MCw0MDApLFxyXG5cdFx0XHRuZXcgUmVjdCh0aGlzLmdldFJvYm90VG9wTGVmdCgpLngsdGhpcy5nZXRSb2JvdFRvcExlZnQoKS55LDE5MCw0MDApXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHR2YXIga2V5ID0gbmV3IFJlY3QoMTg5LDEzLDQ1LDQwKTtcclxuXHRcdFxyXG5cdFx0aWYodGhpcy5rZXlTdGF0ZSA9PT0gMSkge1xyXG5cdFx0XHRrZXkueCArPSBrZXkud2lkdGg7XHJcblx0XHRcdGtleS53aWR0aCA9IDQxO1xyXG5cdFx0fSBlbHNlIGlmKHRoaXMua2V5U3RhdGUgPT09IDIpe1xyXG5cdFx0XHRrZXkueCA9IDI3MztcclxuXHRcdFx0a2V5LndpZHRoID0gMzlcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGRyYXdLZXkgPSBuZXcgUmVjdCg2NSAtIGtleS53aWR0aCwgMjgwIC0ga2V5LmhlaWdodCxrZXkud2lkdGgsIGtleS5oZWlnaHQpLm9mZnNldCh0aGlzLmdldFJvYm90VG9wTGVmdCgpKVxyXG5cdFx0ICBcclxuXHRcdHRoaXMuZHJhd0Zyb21TcHJpdGVTaGVldChcclxuXHRcdFx0Y3R4LCBcclxuXHRcdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdFx0a2V5LFxyXG5cdFx0XHRkcmF3S2V5XHJcblx0XHQpO1xyXG5cdFx0XHJcblx0ICB9IFxyXG5cdCAgXHJcblx0ICBkcmF3Q29tcGxldGUoY3R4KXtcclxuXHRcdC8vY2xvdWRzXHJcblx0XHRcdFxyXG5cdFx0Kyt0aGlzLl90aWNrU2luY2VDb21wbGV0ZTtcclxuXHRcdFxyXG5cdFx0dmFyIGNsb3VkU3RhdGUgPSAgdGhpcy5fY29tcGxldGVBdCAtICh0aGlzLl90aWNrU2luY2VDb21wbGV0ZS80MDApO1xyXG5cdFx0Y29uc29sZS5sb2coXCJjb21wbGV0ZTogXCIgKyBjbG91ZFN0YXRlKTtcclxuXHRcdFxyXG5cdFx0dmFyIGNsb3VkcyA9IHRoaXMuY2xvdWRQb3NpdGlvbnMoTWF0aC5tYXgoLTEwMCxjbG91ZFN0YXRlKSk7IFxyXG5cdFx0XHJcblx0XHR2YXIgY2xvdWQgPSBuZXcgUmVjdCgxOTcsODQsMTk1LDEwNSlcclxuXHRcdFx0ICBcclxuXHRcdGNsb3Vkcy5mb3JFYWNoKGZ1bmN0aW9uKHApe1x0XHRcdFxyXG5cdFx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdFx0Y3R4LCBcclxuXHRcdFx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0XHRcdGNsb3VkLFxyXG5cdFx0XHRcdG5ldyBSZWN0KHAueCxwLnksIGNsb3VkLndpZHRoLCBjbG91ZC5oZWlnaHQpXHJcblx0XHRcdCk7XHRcclxuXHRcdH0uYmluZCh0aGlzKSk7XHJcblx0XHRcclxuXHRcdC8vcm9ib3RcclxuXHRcdHRoaXMuZHJhd0Zyb21TcHJpdGVTaGVldChcclxuXHRcdFx0Y3R4LCBcclxuXHRcdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdFx0bmV3IFJlY3QoMzkzLDAsMjMxLDIyOCksXHJcblx0XHRcdG5ldyBSZWN0KHRoaXMuZ2V0Um9ib3RUb3BMZWZ0KGNsb3VkU3RhdGUpLngsdGhpcy5nZXRSb2JvdFRvcExlZnQoY2xvdWRTdGF0ZSkueSwyMzEsMjI4KVxyXG5cdFx0KTtcclxuXHRcdFxyXG5cdCB9IFxyXG4gIFxyXG5cdGNvbXBsZXRlICgpe1xyXG5cdFx0dGhpcy5faXNDb21wbGV0ZSA9IHRydWU7XHJcblx0XHR0aGlzLl9jb21wbGV0ZUF0ID0gdGhpcy50aW1lclByb2dyZXNzO1xyXG5cdFx0dGhpcy5fdGlja1NpbmNlQ29tcGxldGUgPTA7XHJcblx0fVxyXG4gXHJcblx0Z2V0IGlzQ29tcGxldGUoKXtcclxuXHRcdHJldHVybiB0aGlzLl9pc0NvbXBsZXRlO1xyXG5cdH1cclxuXHRcclxuICAgIFxyXG4gIGNsaWNrKHgseSl7XHJcblx0Ly9kaWQgd2UgY2xpY2sgaW5zaWRlIHRoZSBiYWxsb24/ICBcclxuXHRpZih0aGlzLmJhbGxvb25SZWN0LmNvbnRhaW5zKG5ldyBQb2ludCh4LHkpKSl7XHJcblx0XHQvL2hpdFxyXG5cdFx0Y29uc29sZS5sb2coXCJoaXRcIik7IFxyXG5cdFx0dGhpcy5jb21wbGV0ZSgpO1xyXG5cdFx0dGhpcy5zb2x2ZSh7eCx5LCBwcm9ncmVzcyA6IHRoaXMudGltZXJQcm9ncmVzc30pO1xyXG5cdH0gZWxzZSB7XHJcblx0XHQvL21pc3NcclxuXHRcdGNvbnNvbGUubG9nKFwibWlzc1wiKTtcclxuXHR9XHJcbiAgfVxyXG59IFxyXG5cclxuXHJcbk9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEggPSBcImh0dHBzOi8vczMtdXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vcy5jZHBuLmlvL3QtMjY1L3Nwcml0ZXNoZWV0MS5wbmdcIjtcclxuIFxyXG52YXIgY29udGFpbmVyID0gbmV3IE9KQ2FwdGNoYUNvbnRhaW5lcigkKFwiI29qLWNhcHRjaGEtY29udGFpbmVyXCIpKTtcclxuY29udGFpbmVyLmluaXQoW09KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMV0pOyAiLCJjbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVfZXhhbXBsZSBleHRlbmRzIE9KQ2FwdGNoYU1pY3JvR2FtZUJhc2UgeyBcclxuICBcclxuICBjb25zdHJ1Y3RvcihyYW5kb21TZWVkLCBhc3NldHMpe1xyXG4gICAgc3VwZXIocmFuZG9tU2VlZCwgYXNzZXRzKTtcclxuXHR0aGlzLmZhZGVJbkJ1dHRvbnMgPSB0cnVlO1xyXG4gIH1cclxuICBcclxuICBnZXROZXh0ZXhwbG9zaW9uRnJhbWUoKXtcclxuXHQgaWYodGhpcy5fZXhwbG9zaW9uRnJhbWUgPT09IHVuZGVmaW5lZCkgdGhpcy5fZXhwbG9zaW9uRnJhbWUgPSAtMTtcclxuXHQgdGhpcy5fZXhwbG9zaW9uRnJhbWUgPSAoKyt0aGlzLl9leHBsb3Npb25GcmFtZSklKDUqNSk7XHJcblx0IHJldHVybiB0aGlzLl9leHBsb3Npb25GcmFtZTtcclxuICB9XHJcbiAgXHJcbiAgdGljayhjdHgsIG1zKXtcclxuICAgIHN1cGVyLnRpY2soY3R4LCBtcyk7IFxyXG5cdFx0XHJcblx0Y3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XHJcblx0XHJcbiAgICBjdHguZmlsbFJlY3QoMCwwLDQwMCw0MDApO1xyXG5cdFx0XHJcblx0dmFyIGNlbnRlciA9IHRoaXMubGFzdE1vdXNlIHx8IG5ldyBQb2ludCgyMDAsMjAwKTtcclxuXHRpZighY2VudGVyKSBjZW50ZXIgPSBuZXcgUG9pbnQoMjAwKVxyXG5cdFxyXG5cdGNlbnRlci54IC09IDUwO1xyXG5cdGNlbnRlci55IC09IDUwO1xyXG5cdFxyXG5cdHRoaXMuZHJhd0Zyb21TcHJpdGVGcmFtZShcclxuXHRcdGN0eCwgXHJcblx0XHRPSkNhcHRjaGFNaWNyb0dhbWVfZXhhbXBsZS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHQ1LFxyXG5cdFx0NSxcclxuXHRcdHRoaXMuZ2V0TmV4dGV4cGxvc2lvbkZyYW1lKCksIFxyXG5cdFx0Y2VudGVyLngsIFxyXG5cdFx0Y2VudGVyLnksXHJcblx0XHQxMDAsXHJcblx0XHQxMDApO1xyXG4gIH1cclxuICAgIFxyXG4gIGNsaWNrKHgseSl7XHJcblx0XHJcbiAgfVxyXG59IFxyXG5cclxuT0pDYXB0Y2hhTWljcm9HYW1lX2V4YW1wbGUucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRIID0gXCJodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby90LTI2NS9leHBsb3Npb24xNy5wbmdcIjtcclxuIFxyXG4gLypcclxudmFyIGNvbnRhaW5lciA9IG5ldyBPSkNhcHRjaGFDb250YWluZXIoJChcIiNvai1jYXB0Y2hhLWNvbnRhaW5lclwiKSk7XHJcbmNvbnRhaW5lci5pbml0KFtPSkNhcHRjaGFNaWNyb0dhbWVfZXhhbXBsZV0pOyBcclxuKi8iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
