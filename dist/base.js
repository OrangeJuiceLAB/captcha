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
//# sourceMappingURL=data:application/json;base64,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clxuY2xhc3MgT0pCYXNlIHtcclxuICBcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG53aW5kb3cuQ09OU1QgPSB7XHJcblx0Y2FudmFzV2lkdGggOiA0MDAsXHJcblx0Y2FudmFzSGVpZ2h0IDogNDAwXHJcbn1cclxuXHJcbmNsYXNzIFBvaW50IGV4dGVuZHMgT0pCYXNlIHtcclxuXHRjb25zdHJ1Y3Rvcih4LHkpe1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMuX3ggPSB4O1xyXG5cdFx0dGhpcy5feSA9IHk7XHJcblx0fVxyXG5cdFxyXG5cdGdldCBpc1BvaW50KCl7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHgoKXtcclxuXHRcdHJldHVybiB0aGlzLl94O1xyXG5cdH1cclxuXHRcclxuXHRzZXQgeCh0byl7XHJcblx0XHR0aGlzLl94ID0gdG87XHJcblx0fVxyXG5cdFxyXG5cdGdldCB5KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5feTsgXHJcblx0fVxyXG5cdFxyXG5cdHNldCB5KHRvKXtcclxuXHRcdHRoaXMuX3kgPSB0bztcclxuXHR9XHJcblx0XHJcblx0b2Zmc2V0KHgseSl7XHJcblx0XHRpZih4LmlzUG9pbnQpIHtcclxuXHRcdFx0dGhpcy54ICs9IHgueDtcclxuXHRcdFx0dGhpcy55ICs9IHgueTtcclxuXHRcdH0gZWxzZSB7IFxyXG5cdFx0XHR0aGlzLnggKz0geDtcclxuXHRcdFx0dGhpcy55ICs9IHk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0XHJcblx0Y2xvbmUoKXtcclxuXHRcdHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgUmVjdCBleHRlbmRzIFBvaW50IHtcclxuXHRjb25zdHJ1Y3Rvcih4LHksd2lkdGgsaGVpZ2h0KXtcclxuXHRcdHN1cGVyKHgseSk7XHJcblx0XHR0aGlzLl93aWR0aCA9IHdpZHRoO1xyXG5cdFx0dGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdH1cclxuXHRcclxuXHRnZXQgd2lkdGgoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fd2lkdGg7XHJcblx0fVxyXG5cdFxyXG5cdHNldCB3aWR0aCh0byl7XHJcblx0XHR0aGlzLl93aWR0aCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgaGVpZ2h0KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG5cdH1cclxuXHRcclxuXHRzZXQgaGVpZ2h0KHRvKXtcclxuXHRcdHRoaXMuX2hlaWdodCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRcclxuXHRjb250YWlucyhwKXtcdFx0XHJcblx0XHRyZXR1cm4gKHAueCA+PSB0aGlzLnggJiYgcC54IDw9IHRoaXMueCArIHRoaXMud2lkdGggJiYgcC55ID49IHRoaXMueSAmJiBwLnkgPD0gdGhpcy55ICsgdGhpcy5oZWlnaHQpO1xyXG5cdH1cclxuXHRcclxuXHRjbG9uZSgpe1xyXG5cdFx0cmV0dXJuIG5ldyBSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFCYXNlIGV4dGVuZHMgT0pCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcbn0gXHJcblxyXG5jbGFzcyBPSkNhcHRjaGFDb250YWluZXIgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigkc3JjKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl8kc3JjID0gJHNyYztcclxuXHR0aGlzLmltYWdlQXNzZXRzID0gW107XHJcbiAgfVxyXG4gIFxyXG4gIGdldCAkc3JjKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fJHNyYzsgXHJcbiAgfVxyXG4gIFxyXG4gIGdldCBhY3RpdmVHYW1lKCl7XHJcbiAgICBpZighdGhpcy5fYWN0aXZlR2FtZSl7XHJcblx0XHRcclxuXHQgIC8vY3JlYXRlIGEgMTYgY2hhciByYW5kb21TZWVkXHJcblx0ICB0aGlzLl9hY3RpdmVTZWVkID0gXy50aW1lcygxNiwgXy5yYW5kb20oMCw5KSkuam9pbihcIlwiKTtcclxuXHQgIFxyXG5cdCAgLy9zdGFydCB0aGUgYWN0aXZlIGdhbWVcclxuICAgICAgdGhpcy5fYWN0aXZlR2FtZSA9IG5ldyB0aGlzLl9nYW1lc1F1ZXVlWzBdKHRoaXMuX2FjdGl2ZVNlZWQsIHRoaXMuaW1hZ2VBc3NldHMpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlR2FtZTtcclxuICB9XHJcbiAgXHJcbiAgaW5pdChnYW1lc0Fycil7XHJcblx0ICBcclxuICAgIHRoaXMuX2dhbWVzUXVldWUgPSBnYW1lc0FycjtcclxuXHRcclxuXHR0aGlzLmxvYWRBc3NldHMoKVxyXG5cdFx0LnRoZW4odGhpcy5zdGFydC5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgbG9hZEFzc2V0cygpe1xyXG5cdFx0Y29uc29sZS5sb2coXCJsb2FkQXNzZXRzXCIpO1xyXG5cdCAgLy9nZXQgc3ByaXRlc2hlZXRzIGZyb20gZ2FtZSBjbGFzc2VzXHJcblx0ICAgXy5mb3JFYWNoKHRoaXMuX2dhbWVzUXVldWUsIChnKSA9PiB7XHJcblx0XHQgIGxldCB1cmwgPSBnLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSDtcclxuXHRcdCAgY29uc29sZS5sb2coXCJsb2FkIDogXCIgKyB1cmwpO1xyXG5cdFx0ICBpZih1cmwgJiYgISh1cmwgaW4gdGhpcy5pbWFnZUFzc2V0cykpe1xyXG5cdFx0XHQgIHRoaXMuaW1hZ2VBc3NldHMucHVzaCh7IHVybCAsIGltYWdlIDogbmV3IEltYWdlKCl9KTtcclxuXHRcdCAgfVxyXG5cdCAgfSwgdGhpcyk7XHJcblxyXG5cdCAgLy9sb2FkIHNpbmdsZSBzcHJpdGVzaGVldCBpbWFnZVxyXG5cdCAgbGV0IGxvYWRTcHJpdGVTaGVldCA9IChzcHJpdGVTaGVldCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0c3ByaXRlU2hlZXQuaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG5cdFx0XHRcdHNwcml0ZVNoZWV0LmNvbXBsZXRlID0gdHJ1ZTtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC53aWR0aCA9IHNwcml0ZVNoZWV0LmltYWdlLm5hdHVyYWxXaWR0aDtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC5oZWlnaHQgPSBzcHJpdGVTaGVldC5pbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzcHJpdGVTaGVldC5pbWFnZS5zcmMgPSBzcHJpdGVTaGVldC51cmw7XHJcblx0XHR9KTtcclxuXHQgIH1cclxuXHQgIFxyXG5cdCAgLy9yZWN1cnNpdmUgY2xvc3VyZSB0aGF0IGxvYWRzIGFsbCBzcHJlYWRzaGVldHMgZnJvbSBxdWV1ZVxyXG5cdCAgbGV0IGxvYWRlciA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRsZXQgbmV4dCA9IF8uZmluZCh0aGlzLmltYWdlQXNzZXRzLCBhID0+ICFhLmNvbXBsZXRlKTtcclxuXHRcdGlmKCFuZXh0KSByZXR1cm4gcmVzb2x2ZSgpO1xyXG5cdFx0bG9hZFNwcml0ZVNoZWV0KG5leHQpLnRoZW4oICgpID0+IGxvYWRlcihyZXNvbHZlLHJlamVjdCkpO1xyXG5cdCAgfS5iaW5kKHRoaXMpO1xyXG5cdCAgXHJcblx0ICByZXR1cm4gbmV3IFByb21pc2UobG9hZGVyKTtcclxuICB9XHJcbiAgXHJcbiAgYnVpbGQoKXtcclxuICAgIHRoaXMuaXNCdWlsZCA9IHRydWU7XHJcbiAgICB0aGlzLiRjYW52YXMgPSAkKFwiPGNhbnZhcyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzQwMCc+PC9jYW52YXM+XCIpO1xyXG5cdHRoaXMuJGNhbnZhcy5tb3VzZW1vdmUodGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSk7XHJcblx0dGhpcy4kY2FudmFzLmNsaWNrKHRoaXMuY2FudmFzY2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhc1swXS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB0aGlzLl8kc3JjLmFwcGVuZCh0aGlzLiRjYW52YXMpOyBcclxuICB9XHJcbiAgXHJcbiAgc3RhcnQoKXtcclxuXHQgIGNvbnNvbGUubG9nKFwiYXNzZXRzIGxvYWRlZFwiKTtcclxuICAgIGlmKCF0aGlzLmlzQnVpbHQpIHRoaXMuYnVpbGQoKTtcclxuICAgIC8vdGlja1xyXG5cdHRoaXMuX3N0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7ICBcclxuICB9XHJcbiAgXHJcbiAgdGljayh0aW1lU3RhbXApe1xyXG4gICAgdGhpcy5hY3RpdmVHYW1lLnRpY2sodGhpcy5jdHgsIHRpbWVTdGFtcCAtIHRoaXMuX3N0YXJ0VGltZSk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgY2FudmFzY2xpY2soZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5jbGljayhldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlbW92ZShldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLm1vdXNlTW92ZShldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xyXG4gIH1cclxuICBcclxufVxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhTWljcm9HYW1lQmFzZSBleHRlbmRzIE9KQ2FwdGNoYUJhc2Uge1xyXG5cdFxyXG4gIGNvbnN0cnVjdG9yKHJhbmRvbVNlZWQsIGFzc2V0cyl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fcmFuZG9tU2VlZCA9IHJhbmRvbVNlZWQ7XHJcblx0dGhpcy5fYXNzZXRzID0gYXNzZXRzO1xyXG5cdHRoaXMuX2ZyYW1lcyA9IHt9O1xyXG4gIH1cclxuICBcclxuICBnZXQgcmFuZG9tU2VlZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX3JhbmRvbVNlZWQ7XHJcbiAgfVxyXG4gIFxyXG4gIHJnYmEocixnLGIsYSl7XHJcblx0ICByZXR1cm4gXCJyZ2JhKFwiICsgciArXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIiwgXCIgKyBhICtcIilcIjtcclxuICB9XHJcbiAgXHJcbiAgdGljayhjdHgsIG1zKXtcclxuICAgIFxyXG4gIH0gXHJcbiAgXHJcbiAgY2xpY2soeCx5KXtcclxuXHQgXHJcbiAgfVxyXG4gIFxyXG4gIGdldEFzc2V0KG5hbWUpe1xyXG5cdHJldHVybiBfLmZpbmQodGhpcy5fYXNzZXRzLCBhID0+IGEudXJsID09IG5hbWUpO1xyXG4gIH1cclxuICBcclxuICBkcmF3RnJvbVNwcml0ZUZyYW1lKGN0eCwgbmFtZSwgbnVtRnJhbWVzVywgbnVtRnJhbWVzSCwgZnJhbWVJbmRleCwgdGFyZ2V0WCwgdGFyZ2V0WSwgdGFyZ2V0VywgdGFyZ2V0SCl7XHJcblx0bGV0IGFzc2V0ID0gdGhpcy5nZXRBc3NldChuYW1lKSxcclxuXHRcdGZyYW1lVyA9IGFzc2V0LndpZHRoIC8gbnVtRnJhbWVzVyxcclxuXHRcdGZyYW1lSCA9IGFzc2V0LmhlaWdodCAvIG51bUZyYW1lc0gsIFxyXG5cdFx0ZnJhbWVZID0gTWF0aC5mbG9vcihmcmFtZUluZGV4IC8gbnVtRnJhbWVzVyksXHJcblx0XHRmcmFtZVggPSBmcmFtZUluZGV4IC0gKGZyYW1lWSAqIG51bUZyYW1lc1cpO1xyXG5cdFx0XHJcblx0Y3R4LmRyYXdJbWFnZShhc3NldC5pbWFnZSwgZnJhbWVYICogZnJhbWVXLCBmcmFtZVkgKiBmcmFtZUgsIGZyYW1lVywgZnJhbWVILCB0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRXLCB0YXJnZXRIKTtcclxuICB9XHJcbiAgXHJcbiAgZHJhd0Zyb21TcHJpdGVTaGVldChjdHgsIG5hbWUsIHNyY1JlY3QsIHRhcmdldFJlY3Qpe1xyXG5cdCAgbGV0IGFzc2V0ID0gdGhpcy5nZXRBc3NldChuYW1lKTtcclxuXHQgIGN0eC5kcmF3SW1hZ2UoYXNzZXQuaW1hZ2UsIHNyY1JlY3QueCwgc3JjUmVjdC55LCBzcmNSZWN0LndpZHRoLCBzcmNSZWN0LmhlaWdodCwgdGFyZ2V0UmVjdC54LCB0YXJnZXRSZWN0LnksIHRhcmdldFJlY3Qud2lkdGgsIHRhcmdldFJlY3QuaGVpZ2h0KTtcclxuXHQgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICBcclxuICBtb3VzZU1vdmUoeCx5KXtcclxuXHR0aGlzLl9sYXN0TW91c2UgPSBuZXcgUG9pbnQoeCx5KTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGxhc3RNb3VzZSgpIHtcclxuXHQgIGlmKCF0aGlzLl9sYXN0TW91c2UpIHJldHVybiBudWxsO1xyXG5cdCAgcmV0dXJuIHRoaXMuX2xhc3RNb3VzZS5jbG9uZSgpO1xyXG4gIH1cclxuICBcclxufVx0Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
