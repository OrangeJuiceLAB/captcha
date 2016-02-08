"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OJCaptchaMicroGame_example = function (_OJCaptchaMicroGameBa) {
	_inherits(OJCaptchaMicroGame_example, _OJCaptchaMicroGameBa);

	function OJCaptchaMicroGame_example(randomSeed) {
		_classCallCheck(this, OJCaptchaMicroGame_example);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaMicroGame_example).call(this, randomSeed));

		_this.fadeInButtons = true;
		return _this;
	}

	_createClass(OJCaptchaMicroGame_example, [{
		key: "tick",
		value: function tick(ctx, ms) {
			_get(Object.getPrototypeOf(OJCaptchaMicroGame_example.prototype), "tick", this).call(this, ctx, ms);

			ctx.fillStyle = 'black';

			ctx.fillRect(0, 0, 400, 400);

			if (this.fadeInButtons) {
				this.drawButtons(ctx, Math.min(ms / 5000, 1));
			}
		}
	}, {
		key: "getButtonCenter",
		value: function getButtonCenter() {
			var lastMouse = this.lastMouse;
			if (!lastMouse) return new Point(200, 200);
			return lastMouse;
		}
	}, {
		key: "drawButtons",
		value: function drawButtons(ctx, pct) {
			var center = this.getButtonCenter();
			ctx.beginPath();
			ctx.arc(center.x, center.y, 50, 0, 2 * Math.PI, false);
			ctx.fillStyle = this.rgba(0, 128, 0, pct);
			ctx.fill();
			ctx.lineWidth = 5;
			ctx.strokeStyle = this.rgba(0, 255, 0, pct);
			ctx.stroke();
		}
	}]);

	return OJCaptchaMicroGame_example;
}(OJCaptchaMicroGameBase);

var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_example]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OJBase = function OJBase() {
  _classCallCheck(this, OJBase);
};

var Point = function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this._x = x;
    this._y = y;
  }

  _createClass(Point, [{
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
}();

var OJCaptchaBase = function (_OJBase) {
  _inherits(OJCaptchaBase, _OJBase);

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

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaContainer).call(this));

    _this2._$src = $src;
    return _this2;
  }

  _createClass(OJCaptchaContainer, [{
    key: "init",
    value: function init(gamesArr) {
      this._gamesQueue = gamesArr;
      this.start();
    }
  }, {
    key: "build",
    value: function build() {
      this.isBuild = true;
      this.$canvas = $("<canvas width='400' height='400'></canvas>");
      this.$canvas.mousemove(this.mousemove.bind(this));
      this.ctx = this.$canvas[0].getContext("2d");
      this._$src.append(this.$canvas);
    }
  }, {
    key: "start",
    value: function start() {
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
        this._activeGame = new this._gamesQueue[0](this._activeSeed);
      }

      return this._activeGame;
    }
  }]);

  return OJCaptchaContainer;
}(OJCaptchaBase);

var OJCaptchaMicroGameBase = function (_OJCaptchaBase2) {
  _inherits(OJCaptchaMicroGameBase, _OJCaptchaBase2);

  function OJCaptchaMicroGameBase(randomSeed) {
    _classCallCheck(this, OJCaptchaMicroGameBase);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaMicroGameBase).call(this));

    _this3._randomSeed = randomSeed;
    return _this3;
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
      return this._lastMouse;
    }
  }]);

  return OJCaptchaMicroGameBase;
}(OJCaptchaBase);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVzL2V4YW1wbGUuanMiLCJiYXNlL2Jhc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU07OztBQUVKLFVBRkksMEJBRUosQ0FBWSxVQUFaLEVBQXVCO3dCQUZuQiw0QkFFbUI7O3FFQUZuQix1Q0FHSSxhQURlOztBQUV4QixRQUFLLGFBQUwsR0FBcUIsSUFBckIsQ0FGd0I7O0VBQXZCOztjQUZJOzt1QkFPQyxLQUFLLElBQUc7QUFDWCw4QkFSRSxnRUFRUyxLQUFLLEdBQWhCLENBRFc7O0FBR2QsT0FBSSxTQUFKLEdBQWdCLE9BQWhCLENBSGM7O0FBS1gsT0FBSSxRQUFKLENBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUIsR0FBakIsRUFBcUIsR0FBckIsRUFMVzs7QUFPZCxPQUFHLEtBQUssYUFBTCxFQUFtQjtBQUNyQixTQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsS0FBSyxHQUFMLENBQVMsS0FBRyxJQUFILEVBQVMsQ0FBbEIsQ0FBdEIsRUFEcUI7SUFBdEI7Ozs7b0NBS21CO0FBQ25CLE9BQUksWUFBWSxLQUFLLFNBQUwsQ0FERztBQUVuQixPQUFHLENBQUMsU0FBRCxFQUFZLE9BQU8sSUFBSSxLQUFKLENBQVUsR0FBVixFQUFjLEdBQWQsQ0FBUCxDQUFmO0FBQ0EsVUFBTyxTQUFQLENBSG1COzs7OzhCQU1MLEtBQUssS0FBSTtBQUN2QixPQUFJLFNBQVMsS0FBSyxlQUFMLEVBQVQsQ0FEbUI7QUFFdkIsT0FBSSxTQUFKLEdBRnVCO0FBR3ZCLE9BQUksR0FBSixDQUFRLE9BQU8sQ0FBUCxFQUFVLE9BQU8sQ0FBUCxFQUFVLEVBQTVCLEVBQWdDLENBQWhDLEVBQW1DLElBQUksS0FBSyxFQUFMLEVBQVMsS0FBaEQsRUFIdUI7QUFJdkIsT0FBSSxTQUFKLEdBQWdCLEtBQUssSUFBTCxDQUFVLENBQVYsRUFBYSxHQUFiLEVBQWtCLENBQWxCLEVBQXFCLEdBQXJCLENBQWhCLENBSnVCO0FBS3ZCLE9BQUksSUFBSixH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QUF3QixLQUFLLFdBQUwsQ0FBM0MsQ0FObUI7T0FBckI7O0FBU0EsYUFBTyxLQUFLLFdBQUwsQ0FWTzs7OztTQVZaO0VBQTJCOztJQXNEM0I7OztBQUVKLFdBRkksc0JBRUosQ0FBWSxVQUFaLEVBQXVCOzBCQUZuQix3QkFFbUI7O3dFQUZuQixvQ0FFbUI7O0FBRXJCLFdBQUssV0FBTCxHQUFtQixVQUFuQixDQUZxQjs7R0FBdkI7O2VBRkk7O3lCQVdDLEdBQUUsR0FBRSxHQUFFLEdBQUU7QUFDWixhQUFPLFVBQVUsQ0FBVixHQUFhLElBQWIsR0FBb0IsQ0FBcEIsR0FBd0IsSUFBeEIsR0FBK0IsQ0FBL0IsR0FBbUMsSUFBbkMsR0FBMEMsQ0FBMUMsR0FBNkMsR0FBN0MsQ0FESzs7Ozt5QkFJUixLQUFLLElBQUc7Ozs4QkFJSCxHQUFFLEdBQUU7QUFDZixXQUFLLFVBQUwsR0FBa0IsSUFBSSxLQUFKLENBQVUsQ0FBVixFQUFZLENBQVosQ0FBbEIsQ0FEZTs7Ozt3QkFaRTtBQUNkLGFBQU8sS0FBSyxXQUFMLENBRE87Ozs7d0JBZ0JBO0FBQ2YsYUFBTyxLQUFLLFVBQUwsQ0FEUTs7OztTQXZCWjtFQUErQiIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgT0pDYXB0Y2hhTWljcm9HYW1lX2V4YW1wbGUgZXh0ZW5kcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIHsgXHJcbiAgXHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCl7XHJcbiAgICBzdXBlcihyYW5kb21TZWVkKTtcclxuXHR0aGlzLmZhZGVJbkJ1dHRvbnMgPSB0cnVlO1xyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgc3VwZXIudGljayhjdHgsIG1zKTtcclxuXHRcclxuXHRjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuXHRcclxuICAgIGN0eC5maWxsUmVjdCgwLDAsNDAwLDQwMCk7XHJcblx0XHJcblx0aWYodGhpcy5mYWRlSW5CdXR0b25zKXtcclxuXHRcdHRoaXMuZHJhd0J1dHRvbnMoY3R4LCBNYXRoLm1pbihtcy81MDAwLCAxKSk7XHJcblx0fVxyXG4gIH1cclxuICBcclxuICBnZXRCdXR0b25DZW50ZXIgKCl7XHJcblx0dmFyIGxhc3RNb3VzZSA9IHRoaXMubGFzdE1vdXNlO1xyXG5cdGlmKCFsYXN0TW91c2UpIHJldHVybiBuZXcgUG9pbnQoMjAwLDIwMCk7XHJcblx0cmV0dXJuIGxhc3RNb3VzZTtcclxuICB9XHJcbiAgXHJcbiAgZHJhd0J1dHRvbnMgKGN0eCwgcGN0KXtcclxuXHR2YXIgY2VudGVyID0gdGhpcy5nZXRCdXR0b25DZW50ZXIoKTtcclxuXHRjdHguYmVnaW5QYXRoKCk7XHJcblx0Y3R4LmFyYyhjZW50ZXIueCwgY2VudGVyLnksIDUwLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG5cdGN0eC5maWxsU3R5bGUgPSB0aGlzLnJnYmEoMCwgMTI4LCAwLCBwY3QpO1xyXG5cdGN0eC5maWxsKCk7XHJcblx0Y3R4LmxpbmVXaWR0aCA9IDU7XHJcblx0Y3R4LnN0cm9rZVN0eWxlID0gdGhpcy5yZ2JhKDAsIDI1NSwgMCwgcGN0KTtcclxuXHRjdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG4gIFxyXG59IFxyXG4gXHJcbnZhciBjb250YWluZXIgPSBuZXcgT0pDYXB0Y2hhQ29udGFpbmVyKCQoXCIjb2otY2FwdGNoYS1jb250YWluZXJcIikpO1xyXG5jb250YWluZXIuaW5pdChbT0pDYXB0Y2hhTWljcm9HYW1lX2V4YW1wbGVdKTsgIiwiY2xhc3MgT0pCYXNlIHtcclxuICBcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5jbGFzcyBQb2ludCB7XHJcblx0Y29uc3RydWN0b3IoeCx5KXtcclxuXHRcdHRoaXMuX3ggPSB4O1xyXG5cdFx0dGhpcy5feSA9IHk7XHJcblx0fVxyXG5cdFxyXG5cdGdldCB4KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5feDtcclxuXHR9XHJcblx0XHJcblx0c2V0IHgodG8pe1xyXG5cdFx0dGhpcy5feCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3k7IFxyXG5cdH1cclxuXHRcclxuXHRzZXQgeSh0byl7XHJcblx0XHR0aGlzLl95ID0gdG87XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFCYXNlIGV4dGVuZHMgT0pCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcbn0gXHJcblxyXG5jbGFzcyBPSkNhcHRjaGFDb250YWluZXIgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigkc3JjKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl8kc3JjID0gJHNyYztcclxuICB9XHJcbiAgXHJcbiAgZ2V0ICRzcmMoKXtcclxuICAgIHJldHVybiB0aGlzLl8kc3JjOyBcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGFjdGl2ZUdhbWUoKXtcclxuICAgIGlmKCF0aGlzLl9hY3RpdmVHYW1lKXtcclxuXHRcdFxyXG5cdCAgLy9jcmVhdGUgYSAxNiBjaGFyIHJhbmRvbVNlZWRcclxuXHQgIHRoaXMuX2FjdGl2ZVNlZWQgPSBfLnRpbWVzKDE2LCBfLnJhbmRvbSgwLDkpKS5qb2luKFwiXCIpO1xyXG5cdCAgXHJcblx0ICAvL3N0YXJ0IHRoZSBhY3RpdmUgZ2FtZVxyXG4gICAgICB0aGlzLl9hY3RpdmVHYW1lID0gbmV3IHRoaXMuX2dhbWVzUXVldWVbMF0odGhpcy5fYWN0aXZlU2VlZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzLl9hY3RpdmVHYW1lO1xyXG4gIH1cclxuICBcclxuICBpbml0KGdhbWVzQXJyKXtcclxuICAgIHRoaXMuX2dhbWVzUXVldWUgPSBnYW1lc0FycjtcclxuICAgIHRoaXMuc3RhcnQoKTtcclxuICB9XHJcbiAgXHJcbiAgYnVpbGQoKXtcclxuICAgIHRoaXMuaXNCdWlsZCA9IHRydWU7XHJcbiAgICB0aGlzLiRjYW52YXMgPSAkKFwiPGNhbnZhcyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzQwMCc+PC9jYW52YXM+XCIpO1xyXG5cdHRoaXMuJGNhbnZhcy5tb3VzZW1vdmUodGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhc1swXS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB0aGlzLl8kc3JjLmFwcGVuZCh0aGlzLiRjYW52YXMpOyBcclxuICB9XHJcbiAgXHJcbiAgc3RhcnQoKXtcclxuICAgIGlmKCF0aGlzLmlzQnVpbHQpIHRoaXMuYnVpbGQoKTtcclxuICAgIC8vdGlja1xyXG5cdHRoaXMuX3N0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7ICBcclxuICB9XHJcbiAgXHJcbiAgdGljayh0aW1lU3RhbXApe1xyXG4gICAgdGhpcy5hY3RpdmVHYW1lLnRpY2sodGhpcy5jdHgsIHRpbWVTdGFtcCAtIHRoaXMuX3N0YXJ0VGltZSk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgbW91c2Vtb3ZlKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUubW91c2VNb3ZlKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcblx0XHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fcmFuZG9tU2VlZCA9IHJhbmRvbVNlZWQ7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByYW5kb21TZWVkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcmFuZG9tU2VlZDtcclxuICB9XHJcbiAgXHJcbiAgcmdiYShyLGcsYixhKXtcclxuXHQgIHJldHVybiBcInJnYmEoXCIgKyByICtcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCBcIiArIGEgK1wiKVwiO1xyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlTW92ZSh4LHkpe1xyXG5cdHRoaXMuX2xhc3RNb3VzZSA9IG5ldyBQb2ludCh4LHkpO1xyXG4gIH1cclxuICBcclxuICBnZXQgbGFzdE1vdXNlKCkge1xyXG5cdCAgcmV0dXJuIHRoaXMuX2xhc3RNb3VzZTtcclxuICB9XHJcbiAgXHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=