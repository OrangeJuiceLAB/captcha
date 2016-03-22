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
//# sourceMappingURL=data:application/json;base64,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QUFsQixDQURlOzs7O3NCQXhDRTtBQUNkLFVBQU8sS0FBSyxXQUFMLENBRE87Ozs7c0JBNENBO0FBQ2YsT0FBRyxDQUFDLEtBQUssVUFBTCxFQUFpQixPQUFPLElBQVAsQ0FBckI7QUFDQSxVQUFPLEtBQUssVUFBTCxDQUFnQixLQUFoQixFQUFQLENBRmU7Ozs7UUFyRFo7RUFBK0IiLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuY2xhc3MgT0pCYXNlIHtcclxuICBcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG53aW5kb3cuQ09OU1QgPSB7XHJcblx0Q0FOVkFTX1dJRFRIIDogNDAwLCBcclxuXHRDQU5WQVNfSEVJR0hUOiA0MDBcclxufVxyXG5cclxuY2xhc3MgUG9pbnQgZXh0ZW5kcyBPSkJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKHgseSl7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5feCA9IHg7XHJcblx0XHR0aGlzLl95ID0geTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGlzUG9pbnQoKXtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeCgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3g7XHJcblx0fVxyXG5cdFxyXG5cdHNldCB4KHRvKXtcclxuXHRcdHRoaXMuX3ggPSB0bztcclxuXHR9XHJcblx0XHJcblx0Z2V0IHkoKXtcclxuXHRcdHJldHVybiB0aGlzLl95OyBcclxuXHR9XHJcblx0XHJcblx0c2V0IHkodG8pe1xyXG5cdFx0dGhpcy5feSA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRpbnRlcnBvbGF0ZSh0bywgZnJhYykgXHJcblx0e1xyXG5cdFx0cmV0dXJuIG5ldyBQb2ludCh0aGlzLngrKHRvLngtdGhpcy54KSpmcmFjLCB0aGlzLnkrKHRvLnktdGhpcy55KSpmcmFjKTtcclxuXHR9XHJcblx0XHJcblx0b2Zmc2V0KHgseSl7XHJcblx0XHRpZih4LmlzUG9pbnQpIHtcclxuXHRcdFx0dGhpcy54ICs9IHgueDtcclxuXHRcdFx0dGhpcy55ICs9IHgueTtcclxuXHRcdH0gZWxzZSB7IFxyXG5cdFx0XHR0aGlzLnggKz0geDtcclxuXHRcdFx0dGhpcy55ICs9IHk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0XHJcblx0Y2xvbmUoKXtcclxuXHRcdHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgUmVjdCBleHRlbmRzIFBvaW50IHtcclxuXHRjb25zdHJ1Y3Rvcih4LHksd2lkdGgsaGVpZ2h0KXtcclxuXHRcdHN1cGVyKHgseSk7XHJcblx0XHR0aGlzLl93aWR0aCA9IHdpZHRoO1xyXG5cdFx0dGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdH1cclxuXHRcclxuXHRnZXQgd2lkdGgoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fd2lkdGg7XHJcblx0fVxyXG5cdFxyXG5cdHNldCB3aWR0aCh0byl7XHJcblx0XHR0aGlzLl93aWR0aCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgaGVpZ2h0KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG5cdH1cclxuXHRcclxuXHRzZXQgaGVpZ2h0KHRvKXtcclxuXHRcdHRoaXMuX2hlaWdodCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRcclxuXHRjb250YWlucyhwKXtcdFx0XHJcblx0XHRyZXR1cm4gKHAueCA+PSB0aGlzLnggJiYgcC54IDw9IHRoaXMueCArIHRoaXMud2lkdGggJiYgcC55ID49IHRoaXMueSAmJiBwLnkgPD0gdGhpcy55ICsgdGhpcy5oZWlnaHQpO1xyXG5cdH1cclxuXHRcclxuXHRjbG9uZSgpe1xyXG5cdFx0cmV0dXJuIG5ldyBSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFCYXNlIGV4dGVuZHMgT0pCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcbn0gXHJcblxyXG5jbGFzcyBPSkNhcHRjaGFDb250YWluZXIgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigkc3JjKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl8kc3JjID0gJHNyYztcclxuXHR0aGlzLmltYWdlQXNzZXRzID0gW107XHJcbiAgfVxyXG4gIFxyXG4gIGdldCAkc3JjKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fJHNyYzsgXHJcbiAgfVxyXG4gIFxyXG4gIGdldCBhY3RpdmVHYW1lKCl7XHJcbiAgICBpZighdGhpcy5fYWN0aXZlR2FtZSl7XHJcblx0XHRcclxuXHQgIC8vY3JlYXRlIGEgMTYgY2hhciByYW5kb21TZWVkXHJcblx0ICB0aGlzLl9hY3RpdmVTZWVkID0gXy50aW1lcygxNiwgKCkgPT4gXy5yYW5kb20oMCw5KSkuam9pbihcIlwiKTtcclxuXHQgIFxyXG5cdCAgLy9zdGFydCB0aGUgYWN0aXZlIGdhbWVcclxuICAgICAgdGhpcy5fYWN0aXZlR2FtZSA9IG5ldyB0aGlzLl9nYW1lc1F1ZXVlWzBdKHRoaXMuX2FjdGl2ZVNlZWQsIHRoaXMuaW1hZ2VBc3NldHMpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlR2FtZTtcclxuICB9XHJcbiAgXHJcbiAgaW5pdChnYW1lc0Fycil7XHJcblx0ICBcclxuICAgIHRoaXMuX2dhbWVzUXVldWUgPSBnYW1lc0FycjtcclxuXHRcclxuXHR0aGlzLmxvYWRBc3NldHMoKVxyXG5cdFx0LnRoZW4odGhpcy5zdGFydC5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgbG9hZEFzc2V0cygpe1xyXG5cdFx0Y29uc29sZS5sb2coXCJsb2FkQXNzZXRzXCIpO1xyXG5cdCAgLy9nZXQgc3ByaXRlc2hlZXRzIGZyb20gZ2FtZSBjbGFzc2VzXHJcblx0ICAgXy5mb3JFYWNoKHRoaXMuX2dhbWVzUXVldWUsIChnKSA9PiB7XHJcblx0XHQgIGxldCB1cmwgPSBnLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSDtcclxuXHRcdCAgY29uc29sZS5sb2coXCJsb2FkIDogXCIgKyB1cmwpO1xyXG5cdFx0ICBpZih1cmwgJiYgISh1cmwgaW4gdGhpcy5pbWFnZUFzc2V0cykpe1xyXG5cdFx0XHQgIHRoaXMuaW1hZ2VBc3NldHMucHVzaCh7IHVybCAsIGltYWdlIDogbmV3IEltYWdlKCl9KTtcclxuXHRcdCAgfVxyXG5cdCAgfSwgdGhpcyk7XHJcblxyXG5cdCAgLy9sb2FkIHNpbmdsZSBzcHJpdGVzaGVldCBpbWFnZVxyXG5cdCAgbGV0IGxvYWRTcHJpdGVTaGVldCA9IChzcHJpdGVTaGVldCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0c3ByaXRlU2hlZXQuaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHNwcml0ZVNoZWV0LmNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC53aWR0aCA9IHNwcml0ZVNoZWV0LmltYWdlLm5hdHVyYWxXaWR0aDtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC5oZWlnaHQgPSBzcHJpdGVTaGVldC5pbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzcHJpdGVTaGVldC5pbWFnZS5zcmMgPSBzcHJpdGVTaGVldC51cmw7XHJcblx0XHR9KTtcclxuXHQgIH1cclxuXHQgIFxyXG5cdCAgLy9yZWN1cnNpdmUgY2xvc3VyZSB0aGF0IGxvYWRzIGFsbCBzcHJlYWRzaGVldHMgZnJvbSBxdWV1ZVxyXG5cdCAgbGV0IGxvYWRlciA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRsZXQgbmV4dCA9IF8uZmluZCh0aGlzLmltYWdlQXNzZXRzLCBhID0+ICFhLmNvbXBsZXRlKTtcclxuXHRcdGlmKCFuZXh0KSByZXR1cm4gcmVzb2x2ZSgpO1xyXG5cdFx0bG9hZFNwcml0ZVNoZWV0KG5leHQpLnRoZW4oICgpID0+IGxvYWRlcihyZXNvbHZlLHJlamVjdCkpO1xyXG5cdCAgfS5iaW5kKHRoaXMpO1xyXG5cdCAgXHJcblx0ICByZXR1cm4gbmV3IFByb21pc2UobG9hZGVyKTtcclxuICB9XHJcbiAgXHJcbiAgYnVpbGQoKXtcclxuICAgIHRoaXMuaXNCdWlsZCA9IHRydWU7XHJcbiAgICB0aGlzLiRjYW52YXMgPSAkKFwiPGNhbnZhcyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzQwMCc+PC9jYW52YXM+XCIpO1xyXG5cdHRoaXMuJGNhbnZhcy5tb3VzZW1vdmUodGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSk7XHJcblx0dGhpcy4kY2FudmFzLmNsaWNrKHRoaXMuY2FudmFzY2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhc1swXS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB0aGlzLl8kc3JjLmFwcGVuZCh0aGlzLiRjYW52YXMpOyBcclxuICB9XHJcbiAgXHJcbiAgc3RhcnQoKXtcclxuXHQgIGNvbnNvbGUubG9nKFwiYXNzZXRzIGxvYWRlZFwiKTtcclxuICAgIGlmKCF0aGlzLmlzQnVpbHQpIHRoaXMuYnVpbGQoKTtcclxuICAgIC8vdGlja1xyXG5cdHRoaXMuX3N0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7ICBcclxuICB9XHJcbiAgXHJcbiAgdGljayh0aW1lU3RhbXApe1xyXG4gICAgdGhpcy5hY3RpdmVHYW1lLnRpY2sodGhpcy5jdHgsIHRpbWVTdGFtcCAtIHRoaXMuX3N0YXJ0VGltZSk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgY2FudmFzY2xpY2soZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5jbGljayhldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlbW92ZShldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLm1vdXNlTW92ZShldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xyXG4gIH1cclxuICBcclxufVxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhTWljcm9HYW1lQmFzZSBleHRlbmRzIE9KQ2FwdGNoYUJhc2Uge1xyXG5cdFxyXG4gIGNvbnN0cnVjdG9yKHJhbmRvbVNlZWQsIGFzc2V0cyl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fcmFuZG9tU2VlZCA9IHJhbmRvbVNlZWQ7XHJcblx0dGhpcy5fYXNzZXRzID0gYXNzZXRzO1xyXG5cdHRoaXMuX2ZyYW1lcyA9IHt9O1xyXG4gIH1cclxuICBcclxuICBnZXQgcmFuZG9tU2VlZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX3JhbmRvbVNlZWQ7XHJcbiAgfVxyXG4gIFxyXG4gIHJnYmEocixnLGIsYSl7XHJcblx0ICByZXR1cm4gXCJyZ2JhKFwiICsgciArXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIiwgXCIgKyBhICtcIilcIjtcclxuICB9XHJcbiAgXHJcbiAgdGljayhjdHgsIG1zKXtcclxuICAgIFxyXG4gIH0gXHJcbiAgXHJcbiAgY2xpY2soeCx5KXtcclxuXHQgXHJcbiAgfVxyXG4gIFxyXG4gIHNvbHZlKCl7XHJcblx0ICBcclxuICB9XHJcbiAgXHJcbiAgZ2V0QXNzZXQobmFtZSl7XHJcblx0cmV0dXJuIF8uZmluZCh0aGlzLl9hc3NldHMsIGEgPT4gYS51cmwgPT0gbmFtZSk7XHJcbiAgfVxyXG4gIFxyXG4gIGRyYXdGcm9tU3ByaXRlRnJhbWUoY3R4LCBuYW1lLCBudW1GcmFtZXNXLCBudW1GcmFtZXNILCBmcmFtZUluZGV4LCB0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRXLCB0YXJnZXRIKXtcclxuXHRsZXQgYXNzZXQgPSB0aGlzLmdldEFzc2V0KG5hbWUpLFxyXG5cdFx0ZnJhbWVXID0gYXNzZXQud2lkdGggLyBudW1GcmFtZXNXLFxyXG5cdFx0ZnJhbWVIID0gYXNzZXQuaGVpZ2h0IC8gbnVtRnJhbWVzSCwgXHJcblx0XHRmcmFtZVkgPSBNYXRoLmZsb29yKGZyYW1lSW5kZXggLyBudW1GcmFtZXNXKSxcclxuXHRcdGZyYW1lWCA9IGZyYW1lSW5kZXggLSAoZnJhbWVZICogbnVtRnJhbWVzVyk7XHJcblx0XHRcclxuXHRjdHguZHJhd0ltYWdlKGFzc2V0LmltYWdlLCBmcmFtZVggKiBmcmFtZVcsIGZyYW1lWSAqIGZyYW1lSCwgZnJhbWVXLCBmcmFtZUgsIHRhcmdldFgsIHRhcmdldFksIHRhcmdldFcsIHRhcmdldEgpO1xyXG4gIH1cclxuICBcclxuICBkcmF3RnJvbVNwcml0ZVNoZWV0KGN0eCwgbmFtZSwgc3JjUmVjdCwgdGFyZ2V0UmVjdCl7XHJcblx0ICBsZXQgYXNzZXQgPSB0aGlzLmdldEFzc2V0KG5hbWUpO1xyXG5cdCAgY3R4LmRyYXdJbWFnZShhc3NldC5pbWFnZSwgc3JjUmVjdC54LCBzcmNSZWN0LnksIHNyY1JlY3Qud2lkdGgsIHNyY1JlY3QuaGVpZ2h0LCB0YXJnZXRSZWN0LngsIHRhcmdldFJlY3QueSwgdGFyZ2V0UmVjdC53aWR0aCwgdGFyZ2V0UmVjdC5oZWlnaHQpO1xyXG5cdCAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlTW92ZSh4LHkpe1xyXG5cdHRoaXMuX2xhc3RNb3VzZSA9IG5ldyBQb2ludCh4LHkpO1xyXG4gIH1cclxuICBcclxuICBnZXQgbGFzdE1vdXNlKCkge1xyXG5cdCAgaWYoIXRoaXMuX2xhc3RNb3VzZSkgcmV0dXJuIG51bGw7XHJcblx0ICByZXR1cm4gdGhpcy5fbGFzdE1vdXNlLmNsb25lKCk7XHJcbiAgfVxyXG4gIFxyXG59XHQiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
