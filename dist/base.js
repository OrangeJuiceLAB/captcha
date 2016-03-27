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
//# sourceMappingURL=data:application/json;base64,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QWEsVUFBYixDQUFwQjtPQUNBLFNBQVMsYUFBYyxTQUFTLFVBQVQsQ0FMK0U7O0FBT3ZHLE9BQUksU0FBSixDQUFjLE1BQU0sS0FBTixFQUFhLFNBQVMsTUFBVCxFQUFpQixTQUFTLE1BQVQsRUFBaUIsTUFBN0QsRUFBcUUsTUFBckUsRUFBNkUsT0FBN0UsRUFBc0YsT0FBdEYsRUFBK0YsT0FBL0YsRUFBd0csT0FBeEcsRUFQdUc7Ozs7c0NBVWxGLEtBQUssTUFBTSxTQUFTLFlBQVc7QUFDbEQsT0FBSSxRQUFRLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBUixDQUQ4QztBQUVsRCxPQUFJLFNBQUosQ0FBYyxNQUFNLEtBQU4sRUFBYSxRQUFRLENBQVIsRUFBVyxRQUFRLENBQVIsRUFBVyxRQUFRLEtBQVIsRUFBZSxRQUFRLE1BQVIsRUFBZ0IsV0FBVyxDQUFYLEVBQWMsV0FBVyxDQUFYLEVBQWMsV0FBVyxLQUFYLEVBQWtCLFdBQVcsTUFBWCxDQUE5SCxDQUZrRDtBQUdsRCxVQUFPLElBQVAsQ0FIa0Q7Ozs7NEJBTXpDLEdBQUUsR0FBRTs7OzBCQUlOLEdBQUUsR0FBRTs7OzRCQUlGLEdBQUUsR0FBRTtBQUNmLFFBQUssVUFBTCxHQUFrQixJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQVksQ0FBWixDQUFsQixDQURlOzs7O3NCQWhERTtBQUNkLFVBQU8sS0FBSyxXQUFMLENBRE87Ozs7c0JBb0RBO0FBQ2YsT0FBRyxDQUFDLEtBQUssVUFBTCxFQUFpQixPQUFPLElBQVAsQ0FBckI7QUFDQSxVQUFPLEtBQUssVUFBTCxDQUFnQixLQUFoQixFQUFQLENBRmU7Ozs7UUE3RFo7RUFBK0IiLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuY2xhc3MgT0pCYXNlIHtcclxuICBcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG53aW5kb3cuQ09OU1QgPSB7XHJcblx0Q0FOVkFTX1dJRFRIIDogNDAwLCBcclxuXHRDQU5WQVNfSEVJR0hUOiA0MDBcclxufVxyXG5cclxuY2xhc3MgUG9pbnQgZXh0ZW5kcyBPSkJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKHgseSl7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5feCA9IHg7XHJcblx0XHR0aGlzLl95ID0geTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGlzUG9pbnQoKXtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3g7XHJcblx0fVxyXG5cdFxyXG5cdHNldCB4KHRvKXtcclxuXHRcdHRoaXMuX3ggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IHkoKXtcclxuXHRcdHJldHVybiB0aGlzLl95OyBcclxuXHR9XHJcblx0XHJcblx0c2V0IHkodG8pe1xyXG5cdFx0dGhpcy5feSA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRpbnRlcnBvbGF0ZSh0bywgZnJhYykgXHJcblx0e1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludCh0aGlzLngrKHRvLngtdGhpcy54KSpmcmFjLCB0aGlzLnkrKHRvLnktdGhpcy55KSpmcmFjKTtcclxuXHR9XHJcblx0XHJcblx0b2Zmc2V0KHgseSl7XHJcblx0XHRpZih4LmlzUG9pbnQpIHtcclxuXHRcdFx0dGhpcy54ICs9IHgueDtcclxuXHRcdFx0dGhpcy55ICs9IHgueTtcclxuXHRcdH0gZWxzZSB7IFxyXG5cdFx0XHR0aGlzLnggKz0geDtcclxuXHRcdFx0dGhpcy55ICs9IHk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0XHJcblx0ZGlzdGFuY2VUbyhwMil7XHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KCBNYXRoLnBvdygodGhpcy54LXAyLngpLCAyKSArIE1hdGgucG93KCh0aGlzLnktcDIueSksIDIpICk7XHJcblx0fVxyXG5cdFxyXG5cdGNsb25lKCl7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFJlY3QgZXh0ZW5kcyBQb2ludCB7XHJcblx0Y29uc3RydWN0b3IoeCx5LHdpZHRoLGhlaWdodCl7XHJcblx0XHRzdXBlcih4LHkpO1xyXG5cdFx0dGhpcy5fd2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuX2hlaWdodCA9IGhlaWdodDtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHdpZHRoKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xyXG5cdH1cclxuXHRcclxuXHRzZXQgd2lkdGgodG8pe1xyXG5cdFx0dGhpcy5fd2lkdGggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IGhlaWdodCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX2hlaWdodDtcclxuXHR9XHJcblx0XHJcblx0c2V0IGhlaWdodCh0byl7XHJcblx0XHR0aGlzLl9oZWlnaHQgPSB0bztcclxuXHR9XHJcblx0XHJcblx0XHJcblx0Y29udGFpbnMocCl7XHRcdFxyXG5cdFx0cmV0dXJuIChwLnggPj0gdGhpcy54ICYmIHAueCA8PSB0aGlzLnggKyB0aGlzLndpZHRoICYmIHAueSA+PSB0aGlzLnkgJiYgcC55IDw9IHRoaXMueSArIHRoaXMuaGVpZ2h0KTtcclxuXHR9XHJcblx0XHJcblx0Y2xvbmUoKXtcclxuXHRcdHJldHVybiBuZXcgUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhQmFzZSBleHRlbmRzIE9KQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG59IFxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhQ29udGFpbmVyIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoJHNyYyl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fJHNyYyA9ICRzcmM7XHJcblx0dGhpcy5pbWFnZUFzc2V0cyA9IFtdO1xyXG4gIH1cclxuICBcclxuICBnZXQgJHNyYygpe1xyXG4gICAgcmV0dXJuIHRoaXMuXyRzcmM7IFxyXG4gIH1cclxuICBcclxuICBnZXQgYWN0aXZlR2FtZSgpe1xyXG4gICAgaWYoIXRoaXMuX2FjdGl2ZUdhbWUpe1xyXG5cdFx0XHJcblx0ICAvL2NyZWF0ZSBhIDE2IGNoYXIgcmFuZG9tU2VlZFxyXG5cdCAgdGhpcy5fYWN0aXZlU2VlZCA9IF8udGltZXMoMTYsICgpID0+IF8ucmFuZG9tKDAsOSkpLmpvaW4oXCJcIik7XHJcblx0ICBcclxuXHQgIC8vc3RhcnQgdGhlIGFjdGl2ZSBnYW1lXHJcbiAgICAgIHRoaXMuX2FjdGl2ZUdhbWUgPSBuZXcgdGhpcy5fZ2FtZXNRdWV1ZVswXSh0aGlzLl9hY3RpdmVTZWVkLCB0aGlzLmltYWdlQXNzZXRzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUdhbWU7XHJcbiAgfVxyXG4gIFxyXG4gIGluaXQoZ2FtZXNBcnIpe1xyXG5cdCAgXHJcbiAgICB0aGlzLl9nYW1lc1F1ZXVlID0gZ2FtZXNBcnI7XHJcblx0XHJcblx0dGhpcy5sb2FkQXNzZXRzKClcclxuXHRcdC50aGVuKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGxvYWRBc3NldHMoKXtcclxuXHRcdGNvbnNvbGUubG9nKFwibG9hZEFzc2V0c1wiKTtcclxuXHQgIC8vZ2V0IHNwcml0ZXNoZWV0cyBmcm9tIGdhbWUgY2xhc3Nlc1xyXG5cdCAgIF8uZm9yRWFjaCh0aGlzLl9nYW1lc1F1ZXVlLCAoZykgPT4ge1xyXG5cdFx0ICBsZXQgdXJsID0gZy5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEg7XHJcblx0XHQgIGNvbnNvbGUubG9nKFwibG9hZCA6IFwiICsgdXJsKTtcclxuXHRcdCAgaWYodXJsICYmICEodXJsIGluIHRoaXMuaW1hZ2VBc3NldHMpKXtcclxuXHRcdFx0ICB0aGlzLmltYWdlQXNzZXRzLnB1c2goeyB1cmwgLCBpbWFnZSA6IG5ldyBJbWFnZSgpfSk7XHJcblx0XHQgIH1cclxuXHQgIH0sIHRoaXMpO1xyXG5cclxuXHQgIC8vbG9hZCBzaW5nbGUgc3ByaXRlc2hlZXQgaW1hZ2VcclxuXHQgIGxldCBsb2FkU3ByaXRlU2hlZXQgPSAoc3ByaXRlU2hlZXQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdHNwcml0ZVNoZWV0LmltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC5jb21wbGV0ZSA9IHRydWU7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQud2lkdGggPSBzcHJpdGVTaGVldC5pbWFnZS5uYXR1cmFsV2lkdGg7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQuaGVpZ2h0ID0gc3ByaXRlU2hlZXQuaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuXHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3ByaXRlU2hlZXQuaW1hZ2Uuc3JjID0gc3ByaXRlU2hlZXQudXJsO1xyXG5cdFx0fSk7XHJcblx0ICB9XHJcblx0ICBcclxuXHQgIC8vcmVjdXJzaXZlIGNsb3N1cmUgdGhhdCBsb2FkcyBhbGwgc3ByZWFkc2hlZXRzIGZyb20gcXVldWVcclxuXHQgIGxldCBsb2FkZXIgPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0bGV0IG5leHQgPSBfLmZpbmQodGhpcy5pbWFnZUFzc2V0cywgYSA9PiAhYS5jb21wbGV0ZSk7XHJcblx0XHRpZighbmV4dCkgcmV0dXJuIHJlc29sdmUoKTtcclxuXHRcdGxvYWRTcHJpdGVTaGVldChuZXh0KS50aGVuKCAoKSA9PiBsb2FkZXIocmVzb2x2ZSxyZWplY3QpKTtcclxuXHQgIH0uYmluZCh0aGlzKTtcclxuXHQgIFxyXG5cdCAgcmV0dXJuIG5ldyBQcm9taXNlKGxvYWRlcik7XHJcbiAgfVxyXG4gIFxyXG4gIGJ1aWxkKCl7XHJcbiAgICB0aGlzLmlzQnVpbGQgPSB0cnVlO1xyXG4gICAgdGhpcy4kY2FudmFzID0gJChcIjxjYW52YXMgd2lkdGg9JzQwMCcgaGVpZ2h0PSc0MDAnPjwvY2FudmFzPlwiKTtcclxuXHR0aGlzLiRjYW52YXMubW91c2Vtb3ZlKHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcykpO1xyXG5cdHRoaXMuJGNhbnZhcy5tb3VzZWRvd24odGhpcy5tb3VzZWRvd24uYmluZCh0aGlzKSk7XHJcblx0dGhpcy4kY2FudmFzLm1vdXNldXAodGhpcy5tb3VzZXVwLmJpbmQodGhpcykpO1xyXG5cdHRoaXMuJGNhbnZhcy5jbGljayh0aGlzLmNhbnZhc2NsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLiRjYW52YXNbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgdGhpcy5fJHNyYy5hcHBlbmQodGhpcy4kY2FudmFzKTsgXHJcbiAgfVxyXG4gIFxyXG4gIHN0YXJ0KCl7XHJcblx0ICBjb25zb2xlLmxvZyhcImFzc2V0cyBsb2FkZWRcIik7XHJcbiAgICBpZighdGhpcy5pc0J1aWx0KSB0aGlzLmJ1aWxkKCk7XHJcbiAgICAvL3RpY2tcclxuXHR0aGlzLl9zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIHRpY2sodGltZVN0YW1wKXtcclxuICAgIHRoaXMuYWN0aXZlR2FtZS50aWNrKHRoaXMuY3R4LCB0aW1lU3RhbXAgLSB0aGlzLl9zdGFydFRpbWUpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGNhbnZhc2NsaWNrKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUuY2xpY2soZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTsgIFxyXG4gIH1cclxuICBcclxuICBtb3VzZW1vdmUoZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5tb3VzZU1vdmUoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcclxuICB9XHJcbiAgXHJcbiAgbW91c2Vkb3duKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUubW91c2Vkb3duKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNldXAoZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5tb3VzZXVwKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcblx0XHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl9yYW5kb21TZWVkID0gcmFuZG9tU2VlZDtcclxuXHR0aGlzLl9hc3NldHMgPSBhc3NldHM7XHJcblx0dGhpcy5fZnJhbWVzID0ge307XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByYW5kb21TZWVkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcmFuZG9tU2VlZDtcclxuICB9XHJcbiAgXHJcbiAgcmdiYShyLGcsYixhKXtcclxuXHQgIHJldHVybiBcInJnYmEoXCIgKyByICtcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCBcIiArIGEgK1wiKVwiO1xyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgXHJcbiAgfSBcclxuICBcclxuICBjbGljayh4LHkpe1xyXG5cdCBcclxuICB9XHJcbiAgXHJcbiAgc29sdmUoKXtcclxuXHQgIFxyXG4gIH1cclxuICBcclxuICBnZXRBc3NldChuYW1lKXtcclxuXHRyZXR1cm4gXy5maW5kKHRoaXMuX2Fzc2V0cywgYSA9PiBhLnVybCA9PSBuYW1lKTtcclxuICB9XHJcbiAgXHJcbiAgZHJhd0Zyb21TcHJpdGVGcmFtZShjdHgsIG5hbWUsIG51bUZyYW1lc1csIG51bUZyYW1lc0gsIGZyYW1lSW5kZXgsIHRhcmdldFgsIHRhcmdldFksIHRhcmdldFcsIHRhcmdldEgpe1xyXG5cdGxldCBhc3NldCA9IHRoaXMuZ2V0QXNzZXQobmFtZSksXHJcblx0XHRmcmFtZVcgPSBhc3NldC53aWR0aCAvIG51bUZyYW1lc1csXHJcblx0XHRmcmFtZUggPSBhc3NldC5oZWlnaHQgLyBudW1GcmFtZXNILCBcclxuXHRcdGZyYW1lWSA9IE1hdGguZmxvb3IoZnJhbWVJbmRleCAvIG51bUZyYW1lc1cpLFxyXG5cdFx0ZnJhbWVYID0gZnJhbWVJbmRleCAtIChmcmFtZVkgKiBudW1GcmFtZXNXKTtcclxuXHRcdFxyXG5cdGN0eC5kcmF3SW1hZ2UoYXNzZXQuaW1hZ2UsIGZyYW1lWCAqIGZyYW1lVywgZnJhbWVZICogZnJhbWVILCBmcmFtZVcsIGZyYW1lSCwgdGFyZ2V0WCwgdGFyZ2V0WSwgdGFyZ2V0VywgdGFyZ2V0SCk7XHJcbiAgfVxyXG4gIFxyXG4gIGRyYXdGcm9tU3ByaXRlU2hlZXQoY3R4LCBuYW1lLCBzcmNSZWN0LCB0YXJnZXRSZWN0KXtcclxuXHQgIGxldCBhc3NldCA9IHRoaXMuZ2V0QXNzZXQobmFtZSk7XHJcblx0ICBjdHguZHJhd0ltYWdlKGFzc2V0LmltYWdlLCBzcmNSZWN0LngsIHNyY1JlY3QueSwgc3JjUmVjdC53aWR0aCwgc3JjUmVjdC5oZWlnaHQsIHRhcmdldFJlY3QueCwgdGFyZ2V0UmVjdC55LCB0YXJnZXRSZWN0LndpZHRoLCB0YXJnZXRSZWN0LmhlaWdodCk7XHJcblx0ICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgXHJcbiAgbW91c2Vkb3duKHgseSl7XHJcblx0ICBcclxuICB9XHJcbiAgXHJcbiAgbW91c2V1cCh4LHkpe1xyXG5cdCAgXHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlTW92ZSh4LHkpe1xyXG5cdHRoaXMuX2xhc3RNb3VzZSA9IG5ldyBQb2ludCh4LHkpO1xyXG4gIH1cclxuICBcclxuICBnZXQgbGFzdE1vdXNlKCkge1xyXG5cdCAgaWYoIXRoaXMuX2xhc3RNb3VzZSkgcmV0dXJuIG51bGw7XHJcblx0ICByZXR1cm4gdGhpcy5fbGFzdE1vdXNlLmNsb25lKCk7XHJcbiAgfVxyXG4gIFxyXG59XHQiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
