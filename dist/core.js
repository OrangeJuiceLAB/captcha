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
				this._activeSeed = _.times(16, _.random(0, 9)).join("");

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
		key: "cloudPositions",
		value: function cloudPositions() {
			var x1 = -50;
			var y1 = -500;
			var yDistance = window.CONST.canvasHeight * this.timerProgress;

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

			//clouds
			var clouds = this.cloudPositions();

			var cloud = new Rect(197, 84, 195, 105);

			clouds.forEach(function (p) {
				this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH, cloud, new Rect(p.x, p.y, cloud.width, cloud.height));
			}.bind(this));

			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH, new Rect(0, 0, 190, 400), new Rect(this.robotTopLeft.x, this.robotTopLeft.y, 190, 400));

			var key = new Rect(189, 13, 45, 40);

			if (this.keyState === 1) {
				key.x += key.width;
				key.width = 41;
			} else if (this.keyState === 2) {
				key.x = 273;
				key.width = 39;
			}

			var drawKey = new Rect(65 - key.width, 280 - key.height, key.width, key.height).offset(this.robotTopLeft);

			this.drawFromSpriteSheet(ctx, OJCaptchaMicroGame_game1.prototype.SPRITE_SHEET_PATH, key, drawKey);
		}
	}, {
		key: "click",
		value: function click(x, y) {
			//did we click inside the ballon? 
			if (this.balloonRect.contains(new Point(x, y))) {
				//hit
				console.log("hit");
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
		key: "robotTopLeft",
		get: function get() {
			var start = this.robotStartTopLeft,
			    targetY = -300,
			    yLen = targetY - start.y;

			start.y += yLen * (this.timerProgress * this.timerProgress);

			return start;
		}
	}, {
		key: "balloonRect",
		get: function get() {
			var r = this.robotTopLeft;
			return new Rect(r.x + 40, r.y, 50, 65);
		}
	}, {
		key: "keyState",
		get: function get() {
			var s = Math.floor(this.timerProgress * 30 % 3);
			console.log("keystate: " + s);
			return s;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYmFzZS5qcyIsImdhbWVzLzEuanMiLCJnYW1lcy9leGFtcGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFFTSxTQUVKLFNBRkksTUFFSixHQUFhO3VCQUZULFFBRVM7Q0FBYjs7QUFNRixPQUFPLEtBQVAsR0FBZTtBQUNkLGNBQWMsR0FBZDtBQUNBLGVBQWUsR0FBZjtDQUZEOztJQUtNOzs7QUFDTCxVQURLLEtBQ0wsQ0FBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQjt3QkFEWCxPQUNXOztxRUFEWCxtQkFDVzs7QUFFZixRQUFLLEVBQUwsR0FBVSxDQUFWLENBRmU7QUFHZixRQUFLLEVBQUwsR0FBVSxDQUFWLENBSGU7O0VBQWhCOztjQURLOzt5QkEyQkUsR0FBRSxHQUFFO0FBQ1YsT0FBRyxFQUFFLE9BQUYsRUFBVztBQUNiLFNBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBRixDQURHO0FBRWIsU0FBSyxDQUFMLElBQVUsRUFBRSxDQUFGLENBRkc7SUFBZCxNQUdPO0FBQ04sU0FBSyxDQUFMLElBQVUsQ0FBVixDQURNO0FBRU4sU0FBSyxDQUFMLElBQVUsQ0FBVixDQUZNO0lBSFA7QUFPQSxVQUFPLElBQVAsQ0FSVTs7OzswQkFXSjtBQUNOLFVBQU8sSUFBSSxLQUFKLENBQVUsS0FBSyxDQUFMLEVBQVEsS0FBSyxDQUFMLENBQXpCLENBRE07Ozs7c0JBL0JNO0FBQ1osVUFBTyxJQUFQLENBRFk7Ozs7c0JBSU47QUFDTixVQUFPLEtBQUssRUFBTCxDQUREOztvQkFJRCxJQUFHO0FBQ1IsUUFBSyxFQUFMLEdBQVUsRUFBVixDQURROzs7O3NCQUlGO0FBQ04sVUFBTyxLQUFLLEVBQUwsQ0FERDs7b0JBSUQsSUFBRztBQUNSLFFBQUssRUFBTCxHQUFVLEVBQVYsQ0FEUTs7OztRQXZCSjtFQUFjOztJQTJDZDs7O0FBQ0wsVUFESyxJQUNMLENBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0IsS0FBaEIsRUFBc0IsTUFBdEIsRUFBNkI7d0JB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QUYzQiw0QkFFMkI7O3FFQUYzQix1Q0FHSSxZQUFZLFNBRFc7O0FBRWhDLFFBQUssYUFBTCxHQUFxQixJQUFyQixDQUZnQzs7RUFBL0I7O2NBRkk7OzBDQU9tQjtBQUN2QixPQUFHLEtBQUssZUFBTCxLQUF5QixTQUF6QixFQUFvQyxLQUFLLGVBQUwsR0FBdUIsQ0FBQyxDQUFELENBQTlEO0FBQ0EsUUFBSyxlQUFMLEdBQXVCLEVBQUcsS0FBSyxlQUFMLElBQXVCLElBQUUsQ0FBRixDQUExQixDQUZBO0FBR3ZCLFVBQU8sS0FBSyxlQUFMLENBSGdCOzs7O3VCQU1sQixLQUFLLElBQUc7QUFDWCw4QkFkRSxnRUFjUyxLQUFLLEdBQWhCLENBRFc7O0FBR2QsT0FBSSxTQUFKLEdBQWdCLE9BQWhCLENBSGM7O0FBS1gsT0FBSSxRQUFKLENBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUIsR0FBakIsRUFBcUIsR0FBckIsRUFMVzs7QUFPZCxPQUFJLFNBQVMsS0FBSyxTQUFMLElBQWtCLElBQUksS0FBSixDQUFVLEdBQVYsRUFBYyxHQUFkLENBQWxCLENBUEM7QUFRZCxPQUFHLENBQUMsTUFBRCxFQUFTLFNBQVMsSUFBSSxLQUFKLENBQVUsR0FBVixDQUFULENBQVo7O0FBRUEsVUFBTyxDQUFQLElBQVksRUFBWixDQVZjO0FBV2QsVUFBTyxDQUFQLElBQVksRUFBWixDQVhjOztBQWFkLFFBQUssbUJBQUwsQ0FDQyxHQURELEVBRUMsMkJBQTJCLFNBQTNCLENBQXFDLGlCQUFyQyxFQUNBLENBSEQsRUFJQyxDQUpELEVBS0MsS0FBSyxxQkFBTCxFQUxELEVBTUMsT0FBTyxDQUFQLEVBQ0EsT0FBTyxDQUFQLEVBQ0EsR0FSRCxFQVNDLEdBVEQsRUFiYzs7Ozt3QkF5QlAsR0FBRSxHQUFFOzs7UUF0Q047RUFBbUM7O0FBMkN6QywyQkFBMkIsU0FBM0IsQ0FBcUMsaUJBQXJDLEdBQXlELG9FQUF6RCIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5jbGFzcyBPSkJhc2Uge1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBcclxuICB9XHJcbiAgXHJcbn1cclxuXHJcbndpbmRvdy5DT05TVCA9IHtcclxuXHRjYW52YXNXaWR0aCA6IDQwMCxcclxuXHRjYW52YXNIZWlnaHQgOiA0MDBcclxufVxyXG5cclxuY2xhc3MgUG9pbnQgZXh0ZW5kcyBPSkJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKHgseSl7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5feCA9IHg7XHJcblx0XHR0aGlzLl95ID0geTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGlzUG9pbnQoKXtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3g7XHJcblx0fVxyXG5cdFxyXG5cdHNldCB4KHRvKXtcclxuXHRcdHRoaXMuX3ggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IHkoKXtcclxuXHRcdHJldHVybiB0aGlzLl95OyBcclxuXHR9XHJcblx0XHJcblx0c2V0IHkodG8pe1xyXG5cdFx0dGhpcy5feSA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRvZmZzZXQoeCx5KXtcclxuXHRcdGlmKHguaXNQb2ludCkge1xyXG5cdFx0XHR0aGlzLnggKz0geC54O1xyXG5cdFx0XHR0aGlzLnkgKz0geC55O1xyXG5cdFx0fSBlbHNlIHsgXHJcblx0XHRcdHRoaXMueCArPSB4O1xyXG5cdFx0XHR0aGlzLnkgKz0geTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRcclxuXHRjbG9uZSgpe1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBSZWN0IGV4dGVuZHMgUG9pbnQge1xyXG5cdGNvbnN0cnVjdG9yKHgseSx3aWR0aCxoZWlnaHQpe1xyXG5cdFx0c3VwZXIoeCx5KTtcclxuXHRcdHRoaXMuX3dpZHRoID0gd2lkdGg7XHJcblx0XHR0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XHJcblx0fVxyXG5cdFxyXG5cdGdldCB3aWR0aCgpIHtcclxuXHRcdHJldHVybiB0aGlzLl93aWR0aDtcclxuXHR9XHJcblx0XHJcblx0c2V0IHdpZHRoKHRvKXtcclxuXHRcdHRoaXMuX3dpZHRoID0gdG87XHJcblx0fVxyXG5cdFxyXG5cdGdldCBoZWlnaHQoKXtcclxuXHRcdHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcblx0fVxyXG5cdFxyXG5cdHNldCBoZWlnaHQodG8pe1xyXG5cdFx0dGhpcy5faGVpZ2h0ID0gdG87XHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdGNvbnRhaW5zKHApe1x0XHRcclxuXHRcdHJldHVybiAocC54ID49IHRoaXMueCAmJiBwLnggPD0gdGhpcy54ICsgdGhpcy53aWR0aCAmJiBwLnkgPj0gdGhpcy55ICYmIHAueSA8PSB0aGlzLnkgKyB0aGlzLmhlaWdodCk7XHJcblx0fVxyXG5cdFxyXG5cdGNsb25lKCl7XHJcblx0XHRyZXR1cm4gbmV3IFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIE9KQ2FwdGNoYUJhc2UgZXh0ZW5kcyBPSkJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxufSBcclxuXHJcbmNsYXNzIE9KQ2FwdGNoYUNvbnRhaW5lciBleHRlbmRzIE9KQ2FwdGNoYUJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCRzcmMpe1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuXyRzcmMgPSAkc3JjO1xyXG5cdHRoaXMuaW1hZ2VBc3NldHMgPSBbXTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0ICRzcmMoKXtcclxuICAgIHJldHVybiB0aGlzLl8kc3JjOyBcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGFjdGl2ZUdhbWUoKXtcclxuICAgIGlmKCF0aGlzLl9hY3RpdmVHYW1lKXtcclxuXHRcdFxyXG5cdCAgLy9jcmVhdGUgYSAxNiBjaGFyIHJhbmRvbVNlZWRcclxuXHQgIHRoaXMuX2FjdGl2ZVNlZWQgPSBfLnRpbWVzKDE2LCBfLnJhbmRvbSgwLDkpKS5qb2luKFwiXCIpO1xyXG5cdCAgXHJcblx0ICAvL3N0YXJ0IHRoZSBhY3RpdmUgZ2FtZVxyXG4gICAgICB0aGlzLl9hY3RpdmVHYW1lID0gbmV3IHRoaXMuX2dhbWVzUXVldWVbMF0odGhpcy5fYWN0aXZlU2VlZCwgdGhpcy5pbWFnZUFzc2V0cyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzLl9hY3RpdmVHYW1lO1xyXG4gIH1cclxuICBcclxuICBpbml0KGdhbWVzQXJyKXtcclxuXHQgIFxyXG4gICAgdGhpcy5fZ2FtZXNRdWV1ZSA9IGdhbWVzQXJyO1xyXG5cdFxyXG5cdHRoaXMubG9hZEFzc2V0cygpXHJcblx0XHQudGhlbih0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBcclxuICBsb2FkQXNzZXRzKCl7XHJcblx0XHRjb25zb2xlLmxvZyhcImxvYWRBc3NldHNcIik7XHJcblx0ICAvL2dldCBzcHJpdGVzaGVldHMgZnJvbSBnYW1lIGNsYXNzZXNcclxuXHQgICBfLmZvckVhY2godGhpcy5fZ2FtZXNRdWV1ZSwgKGcpID0+IHtcclxuXHRcdCAgbGV0IHVybCA9IGcucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRIO1xyXG5cdFx0ICBjb25zb2xlLmxvZyhcImxvYWQgOiBcIiArIHVybCk7XHJcblx0XHQgIGlmKHVybCAmJiAhKHVybCBpbiB0aGlzLmltYWdlQXNzZXRzKSl7XHJcblx0XHRcdCAgdGhpcy5pbWFnZUFzc2V0cy5wdXNoKHsgdXJsICwgaW1hZ2UgOiBuZXcgSW1hZ2UoKX0pO1xyXG5cdFx0ICB9XHJcblx0ICB9LCB0aGlzKTtcclxuXHJcblx0ICAvL2xvYWQgc2luZ2xlIHNwcml0ZXNoZWV0IGltYWdlXHJcblx0ICBsZXQgbG9hZFNwcml0ZVNoZWV0ID0gKHNwcml0ZVNoZWV0KSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRzcHJpdGVTaGVldC5pbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQuY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0XHRcdHNwcml0ZVNoZWV0LndpZHRoID0gc3ByaXRlU2hlZXQuaW1hZ2UubmF0dXJhbFdpZHRoO1xyXG5cdFx0XHRcdHNwcml0ZVNoZWV0LmhlaWdodCA9IHNwcml0ZVNoZWV0LmltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcblx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNwcml0ZVNoZWV0LmltYWdlLnNyYyA9IHNwcml0ZVNoZWV0LnVybDtcclxuXHRcdH0pO1xyXG5cdCAgfVxyXG5cdCAgXHJcblx0ICAvL3JlY3Vyc2l2ZSBjbG9zdXJlIHRoYXQgbG9hZHMgYWxsIHNwcmVhZHNoZWV0cyBmcm9tIHF1ZXVlXHJcblx0ICBsZXQgbG9hZGVyID0gZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdGxldCBuZXh0ID0gXy5maW5kKHRoaXMuaW1hZ2VBc3NldHMsIGEgPT4gIWEuY29tcGxldGUpO1xyXG5cdFx0aWYoIW5leHQpIHJldHVybiByZXNvbHZlKCk7XHJcblx0XHRsb2FkU3ByaXRlU2hlZXQobmV4dCkudGhlbiggKCkgPT4gbG9hZGVyKHJlc29sdmUscmVqZWN0KSk7XHJcblx0ICB9LmJpbmQodGhpcyk7XHJcblx0ICBcclxuXHQgIHJldHVybiBuZXcgUHJvbWlzZShsb2FkZXIpO1xyXG4gIH1cclxuICBcclxuICBidWlsZCgpe1xyXG4gICAgdGhpcy5pc0J1aWxkID0gdHJ1ZTtcclxuICAgIHRoaXMuJGNhbnZhcyA9ICQoXCI8Y2FudmFzIHdpZHRoPSc0MDAnIGhlaWdodD0nNDAwJz48L2NhbnZhcz5cIik7XHJcblx0dGhpcy4kY2FudmFzLm1vdXNlbW92ZSh0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpKTtcclxuXHR0aGlzLiRjYW52YXMuY2xpY2sodGhpcy5jYW52YXNjbGljay5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy4kY2FudmFzWzBdLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIHRoaXMuXyRzcmMuYXBwZW5kKHRoaXMuJGNhbnZhcyk7IFxyXG4gIH1cclxuICBcclxuICBzdGFydCgpe1xyXG5cdCAgY29uc29sZS5sb2coXCJhc3NldHMgbG9hZGVkXCIpO1xyXG4gICAgaWYoIXRoaXMuaXNCdWlsdCkgdGhpcy5idWlsZCgpO1xyXG4gICAgLy90aWNrXHJcblx0dGhpcy5fc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTsgIFxyXG4gIH1cclxuICBcclxuICB0aWNrKHRpbWVTdGFtcCl7XHJcbiAgICB0aGlzLmFjdGl2ZUdhbWUudGljayh0aGlzLmN0eCwgdGltZVN0YW1wIC0gdGhpcy5fc3RhcnRUaW1lKTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBcclxuICBjYW52YXNjbGljayhldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLmNsaWNrKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7ICBcclxuICB9XHJcbiAgXHJcbiAgbW91c2Vtb3ZlKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUubW91c2VNb3ZlKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcblx0XHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl9yYW5kb21TZWVkID0gcmFuZG9tU2VlZDtcclxuXHR0aGlzLl9hc3NldHMgPSBhc3NldHM7XHJcblx0dGhpcy5fZnJhbWVzID0ge307XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByYW5kb21TZWVkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcmFuZG9tU2VlZDtcclxuICB9XHJcbiAgXHJcbiAgcmdiYShyLGcsYixhKXtcclxuXHQgIHJldHVybiBcInJnYmEoXCIgKyByICtcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCBcIiArIGEgK1wiKVwiO1xyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgXHJcbiAgfSBcclxuICBcclxuICBjbGljayh4LHkpe1xyXG5cdCBcclxuICB9XHJcbiAgXHJcbiAgZ2V0QXNzZXQobmFtZSl7XHJcblx0cmV0dXJuIF8uZmluZCh0aGlzLl9hc3NldHMsIGEgPT4gYS51cmwgPT0gbmFtZSk7XHJcbiAgfVxyXG4gIFxyXG4gIGRyYXdGcm9tU3ByaXRlRnJhbWUoY3R4LCBuYW1lLCBudW1GcmFtZXNXLCBudW1GcmFtZXNILCBmcmFtZUluZGV4LCB0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRXLCB0YXJnZXRIKXtcclxuXHRsZXQgYXNzZXQgPSB0aGlzLmdldEFzc2V0KG5hbWUpLFxyXG5cdFx0ZnJhbWVXID0gYXNzZXQud2lkdGggLyBudW1GcmFtZXNXLFxyXG5cdFx0ZnJhbWVIID0gYXNzZXQuaGVpZ2h0IC8gbnVtRnJhbWVzSCwgXHJcblx0XHRmcmFtZVkgPSBNYXRoLmZsb29yKGZyYW1lSW5kZXggLyBudW1GcmFtZXNXKSxcclxuXHRcdGZyYW1lWCA9IGZyYW1lSW5kZXggLSAoZnJhbWVZICogbnVtRnJhbWVzVyk7XHJcblx0XHRcclxuXHRjdHguZHJhd0ltYWdlKGFzc2V0LmltYWdlLCBmcmFtZVggKiBmcmFtZVcsIGZyYW1lWSAqIGZyYW1lSCwgZnJhbWVXLCBmcmFtZUgsIHRhcmdldFgsIHRhcmdldFksIHRhcmdldFcsIHRhcmdldEgpO1xyXG4gIH1cclxuICBcclxuICBkcmF3RnJvbVNwcml0ZVNoZWV0KGN0eCwgbmFtZSwgc3JjUmVjdCwgdGFyZ2V0UmVjdCl7XHJcblx0ICBsZXQgYXNzZXQgPSB0aGlzLmdldEFzc2V0KG5hbWUpO1xyXG5cdCAgY3R4LmRyYXdJbWFnZShhc3NldC5pbWFnZSwgc3JjUmVjdC54LCBzcmNSZWN0LnksIHNyY1JlY3Qud2lkdGgsIHNyY1JlY3QuaGVpZ2h0LCB0YXJnZXRSZWN0LngsIHRhcmdldFJlY3QueSwgdGFyZ2V0UmVjdC53aWR0aCwgdGFyZ2V0UmVjdC5oZWlnaHQpO1xyXG5cdCAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlTW92ZSh4LHkpe1xyXG5cdHRoaXMuX2xhc3RNb3VzZSA9IG5ldyBQb2ludCh4LHkpO1xyXG4gIH1cclxuICBcclxuICBnZXQgbGFzdE1vdXNlKCkge1xyXG5cdCAgaWYoIXRoaXMuX2xhc3RNb3VzZSkgcmV0dXJuIG51bGw7XHJcblx0ICByZXR1cm4gdGhpcy5fbGFzdE1vdXNlLmNsb25lKCk7XHJcbiAgfVxyXG4gIFxyXG59XHQiLCJjbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVfZ2FtZTEgZXh0ZW5kcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIHsgXHJcbiAgXHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuICAgIHN1cGVyKHJhbmRvbVNlZWQsIGFzc2V0cyk7XHJcbiAgfVxyXG4gICAgXHJcbiAgZ2V0IG1heER1cmF0aW9uKCl7XHJcblx0ICByZXR1cm4gNTAwMDtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IHRpbWVyUHJvZ3Jlc3MoKXtcclxuXHQgIHJldHVybiBNYXRoLm1pbih0aGlzLl90aW1lclByb2dyZXNzIHx8IDAsMTAwKTtcclxuICB9XHJcbiAgXHJcbiAgc2V0IHRpbWVyUHJvZ3Jlc3ModG8pe1xyXG5cdCAgdGhpcy5fdGltZXJQcm9ncmVzcyA9IHRvO1xyXG4gIH1cclxuICBcclxuICBnZXQgcm9ib3RTdGFydFRvcExlZnQoKXtcclxuXHQgIFxyXG5cdGlmKCF0aGlzLl9yb2JvdFN0YXJ0VG9wTGVmdCl7XHJcblxyXG5cdFx0bGV0IHhNaW4gPSAwLCB4TWF4ID0gd2luZG93LkNPTlNULmNhbnZhc1dpZHRoIC0gMjAwLFxyXG5cdFx0XHR5TWluID0gd2luZG93LkNPTlNULmNhbnZhc0hlaWdodCAgKi4zLCB5TWF4ID0gd2luZG93LkNPTlNULmNhbnZhc0hlaWdodCowLjYsXHJcblx0XHRcdHhMZW4gPSB4TWF4IC0geE1pbixcclxuXHRcdFx0eUxlbiA9IHlNYXggLSB5TWluO1xyXG5cclxuXHRcdHRoaXMuX3JvYm90U3RhcnRUb3BMZWZ0ID0gbmV3IFBvaW50KFxyXG5cdFx0XHRNYXRoLmZsb29yKHhNaW4gKyAoeExlbiAqIChOdW1iZXIodGhpcy5yYW5kb21TZWVkLmNoYXJBdCgyKS8xMCkpKSksXHJcblx0XHRcdE1hdGguZmxvb3IoeU1pbiArICh5TGVuICogKE51bWJlcih0aGlzLnJhbmRvbVNlZWQuY2hhckF0KDQpLzEwKSkpKVxyXG5cdFx0XHQpO1xyXG5cdH0gXHJcblx0XHJcblx0cmV0dXJuIHRoaXMuX3JvYm90U3RhcnRUb3BMZWZ0LmNsb25lKCk7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByb2JvdFRvcExlZnQoKXtcclxuXHRsZXQgc3RhcnQgPSB0aGlzLnJvYm90U3RhcnRUb3BMZWZ0LFxyXG5cdFx0dGFyZ2V0WSA9IC0zMDAsXHJcblx0XHR5TGVuID0gdGFyZ2V0WSAtIHN0YXJ0Lnk7IFxyXG5cdFxyXG5cdHN0YXJ0LnkgKz0gKHlMZW4gKiAodGhpcy50aW1lclByb2dyZXNzKnRoaXMudGltZXJQcm9ncmVzcykpO1xyXG5cdFxyXG5cdHJldHVybiBzdGFydDtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGJhbGxvb25SZWN0KCl7XHJcblx0dmFyIHIgPSB0aGlzLnJvYm90VG9wTGVmdDtcclxuXHRyZXR1cm4gbmV3IFJlY3Qoci54ICsgNDAsIHIueSwgNTAsNjUpO1xyXG4gIH1cclxuICBcclxuICBnZXQga2V5U3RhdGUgKCl7XHJcblx0ICB2YXIgcyA9IE1hdGguZmxvb3IodGhpcy50aW1lclByb2dyZXNzKjMwJTMpO1xyXG5cdCAgY29uc29sZS5sb2coXCJrZXlzdGF0ZTogXCIrIHMpO1xyXG5cdCAgcmV0dXJuIHM7XHJcbiAgfVxyXG4gIFxyXG4gIGNsb3VkUG9zaXRpb25zICgpe1xyXG5cdCAgdmFyIHgxID0gLTUwO1xyXG5cdCAgdmFyIHkxID0gLTUwMDtcclxuXHQgIHZhciB5RGlzdGFuY2UgPSB3aW5kb3cuQ09OU1QuY2FudmFzSGVpZ2h0ICogdGhpcy50aW1lclByb2dyZXNzO1xyXG5cdCAgXHJcblx0ICByZXR1cm4gWyBcclxuXHRcdFx0bmV3IFBvaW50KHgxLCB5MSArIHlEaXN0YW5jZSksXHJcblx0XHRcdG5ldyBQb2ludCh4MSArIDUwLCB5MSArIDMwMCArIHlEaXN0YW5jZSksXHJcblx0XHRcdG5ldyBQb2ludCh4MSAtIDc1LCB5MSArIDYwMCsgeURpc3RhbmNlKSxcclxuXHRcdFx0XHJcblx0XHRcdG5ldyBQb2ludCh4MSsgMzAwLCB5MSArIDEwMCArIHlEaXN0YW5jZSksXHJcblx0XHRcdG5ldyBQb2ludCh4MSsgMjQwLCB5MSArIDQwMCArIHlEaXN0YW5jZSksXHJcblx0XHRcdG5ldyBQb2ludCh4MSsgMzAwLCB5MSArIDcwMCArIHlEaXN0YW5jZSksXHJcblx0XHRcdFxyXG5cdCAgXVxyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgc3VwZXIudGljayhjdHgsIG1zKTsgXHJcblx0XHJcblx0dGhpcy50aW1lclByb2dyZXNzID0gbXMgLyB0aGlzLm1heER1cmF0aW9uO1xyXG5cdFx0XHJcblx0Ly9za3lcclxuXHR2YXIgZ3JkPWN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLDAsMCw0MDApO1xyXG5cdGdyZC5hZGRDb2xvclN0b3AoMCxcIiM1ZGIxZmZcIik7XHJcblx0Z3JkLmFkZENvbG9yU3RvcCgxLFwiI2JjZGRmZlwiKTtcclxuXHRjdHguZmlsbFN0eWxlPWdyZDtcclxuICAgIGN0eC5maWxsUmVjdCgwLDAsNDAwLDQwMCk7XHJcblx0XHRcclxuXHQvL2Nsb3Vkc1xyXG5cdHZhciBjbG91ZHMgPSB0aGlzLmNsb3VkUG9zaXRpb25zKCk7XHJcblx0XHJcblx0dmFyIGNsb3VkID0gbmV3IFJlY3QoMTk3LDg0LDE5NSwxMDUpXHJcblx0XHJcblx0Y2xvdWRzLmZvckVhY2goZnVuY3Rpb24ocCl7XHRcdFx0XHJcblx0XHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRcdGN0eCwgXHJcblx0XHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRcdGNsb3VkLFxyXG5cdFx0XHRuZXcgUmVjdChwLngscC55LCBjbG91ZC53aWR0aCwgY2xvdWQuaGVpZ2h0KVxyXG5cdFx0KTtcdFxyXG5cdH0uYmluZCh0aGlzKSk7XHJcblx0XHJcblx0ICBcclxuXHR0aGlzLmRyYXdGcm9tU3ByaXRlU2hlZXQoXHJcblx0XHRjdHgsIFxyXG5cdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdG5ldyBSZWN0KDAsMCwxOTAsNDAwKSxcclxuXHRcdG5ldyBSZWN0KHRoaXMucm9ib3RUb3BMZWZ0LngsdGhpcy5yb2JvdFRvcExlZnQueSwxOTAsNDAwKVxyXG5cdCk7XHJcblx0XHJcblx0dmFyIGtleSA9IG5ldyBSZWN0KDE4OSwxMyw0NSw0MCk7XHJcblx0XHJcblx0aWYodGhpcy5rZXlTdGF0ZSA9PT0gMSkge1xyXG5cdFx0a2V5LnggKz0ga2V5LndpZHRoO1xyXG5cdFx0a2V5LndpZHRoID0gNDE7XHJcblx0fSBlbHNlIGlmKHRoaXMua2V5U3RhdGUgPT09IDIpe1xyXG5cdFx0a2V5LnggPSAyNzM7XHJcblx0XHRrZXkud2lkdGggPSAzOVxyXG5cdH1cclxuXHRcclxuXHR2YXIgZHJhd0tleSA9IG5ldyBSZWN0KDY1IC0ga2V5LndpZHRoLCAyODAgLSBrZXkuaGVpZ2h0LGtleS53aWR0aCwga2V5LmhlaWdodCkub2Zmc2V0KHRoaXMucm9ib3RUb3BMZWZ0KVxyXG5cdCAgXHJcblx0dGhpcy5kcmF3RnJvbVNwcml0ZVNoZWV0KFxyXG5cdFx0Y3R4LCBcclxuXHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9nYW1lMS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgsXHJcblx0XHRrZXksXHJcblx0XHRkcmF3S2V5XHJcblx0KTtcclxuXHRcclxuXHRcclxuXHRcclxuICB9IFxyXG4gICAgXHJcbiAgY2xpY2soeCx5KXtcclxuXHQvL2RpZCB3ZSBjbGljayBpbnNpZGUgdGhlIGJhbGxvbj8gIFxyXG5cdGlmKHRoaXMuYmFsbG9vblJlY3QuY29udGFpbnMobmV3IFBvaW50KHgseSkpKXtcclxuXHRcdC8vaGl0XHJcblx0XHRjb25zb2xlLmxvZyhcImhpdFwiKTsgXHJcbiAgXHJcblx0fSBlbHNlIHtcclxuXHRcdC8vbWlzc1xyXG5cdFx0Y29uc29sZS5sb2coXCJtaXNzXCIpO1xyXG5cdH1cclxuICB9XHJcbn0gXHJcblxyXG5cclxuT0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCA9IFwiaHR0cHM6Ly9zMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9zLmNkcG4uaW8vdC0yNjUvc3ByaXRlc2hlZXQxLnBuZ1wiO1xyXG4gXHJcbnZhciBjb250YWluZXIgPSBuZXcgT0pDYXB0Y2hhQ29udGFpbmVyKCQoXCIjb2otY2FwdGNoYS1jb250YWluZXJcIikpO1xyXG5jb250YWluZXIuaW5pdChbT0pDYXB0Y2hhTWljcm9HYW1lX2dhbWUxXSk7ICIsImNsYXNzIE9KQ2FwdGNoYU1pY3JvR2FtZV9leGFtcGxlIGV4dGVuZHMgT0pDYXB0Y2hhTWljcm9HYW1lQmFzZSB7IFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHJhbmRvbVNlZWQsIGFzc2V0cyl7XHJcbiAgICBzdXBlcihyYW5kb21TZWVkLCBhc3NldHMpO1xyXG5cdHRoaXMuZmFkZUluQnV0dG9ucyA9IHRydWU7XHJcbiAgfVxyXG4gIFxyXG4gIGdldE5leHRleHBsb3Npb25GcmFtZSgpe1xyXG5cdCBpZih0aGlzLl9leHBsb3Npb25GcmFtZSA9PT0gdW5kZWZpbmVkKSB0aGlzLl9leHBsb3Npb25GcmFtZSA9IC0xO1xyXG5cdCB0aGlzLl9leHBsb3Npb25GcmFtZSA9ICgrK3RoaXMuX2V4cGxvc2lvbkZyYW1lKSUoNSo1KTtcclxuXHQgcmV0dXJuIHRoaXMuX2V4cGxvc2lvbkZyYW1lO1xyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgc3VwZXIudGljayhjdHgsIG1zKTsgXHJcblx0XHRcclxuXHRjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuXHRcclxuICAgIGN0eC5maWxsUmVjdCgwLDAsNDAwLDQwMCk7XHJcblx0XHRcclxuXHR2YXIgY2VudGVyID0gdGhpcy5sYXN0TW91c2UgfHwgbmV3IFBvaW50KDIwMCwyMDApO1xyXG5cdGlmKCFjZW50ZXIpIGNlbnRlciA9IG5ldyBQb2ludCgyMDApXHJcblx0XHJcblx0Y2VudGVyLnggLT0gNTA7XHJcblx0Y2VudGVyLnkgLT0gNTA7XHJcblx0XHJcblx0dGhpcy5kcmF3RnJvbVNwcml0ZUZyYW1lKFxyXG5cdFx0Y3R4LCBcclxuXHRcdE9KQ2FwdGNoYU1pY3JvR2FtZV9leGFtcGxlLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCxcclxuXHRcdDUsXHJcblx0XHQ1LFxyXG5cdFx0dGhpcy5nZXROZXh0ZXhwbG9zaW9uRnJhbWUoKSwgXHJcblx0XHRjZW50ZXIueCwgXHJcblx0XHRjZW50ZXIueSxcclxuXHRcdDEwMCxcclxuXHRcdDEwMCk7XHJcbiAgfVxyXG4gICAgXHJcbiAgY2xpY2soeCx5KXtcclxuXHRcclxuICB9XHJcbn0gXHJcblxyXG5PSkNhcHRjaGFNaWNyb0dhbWVfZXhhbXBsZS5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEggPSBcImh0dHBzOi8vczMtdXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vcy5jZHBuLmlvL3QtMjY1L2V4cGxvc2lvbjE3LnBuZ1wiO1xyXG4gXHJcbiAvKlxyXG52YXIgY29udGFpbmVyID0gbmV3IE9KQ2FwdGNoYUNvbnRhaW5lcigkKFwiI29qLWNhcHRjaGEtY29udGFpbmVyXCIpKTtcclxuY29udGFpbmVyLmluaXQoW09KQ2FwdGNoYU1pY3JvR2FtZV9leGFtcGxlXSk7IFxyXG4qLyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
