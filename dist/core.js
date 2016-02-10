"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OJBase = function OJBase() {
  _classCallCheck(this, OJBase);
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

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaContainer).call(this));

    _this3._$src = $src;
    return _this3;
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
      //load spritesheets
      var spriteSheets = _.without(_.map(this._gamesQueue, function (g) {
        return g.prototype.SPRITE_SHEET_PATH;
      }), null);

      var loadSpriteSheet = function loadSpriteSheet(spriteSheet) {
        return new Promise(function (resolve, reject) {
          var img = new Image();
          img.onload = resolve;
          img.src = spriteSheet;
        });
      };

      var loader = function loader(resolve, reject) {
        if (!spriteSheets.length) return resolve();
        loadSpriteSheet(spriteSheets.shift()).then(function () {
          return loader(resolve);
        });
      };

      return new Promise(loader); /*(function(resolve, reject){
                                  loader(resolve);
                                  }));*/
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

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaMicroGameBase).call(this));

    _this4._randomSeed = randomSeed;
    return _this4;
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
	}, {
		key: "click",
		value: function click(x, y) {}
	}]);

	return OJCaptchaMicroGame_example;
}(OJCaptchaMicroGameBase);

OJCaptchaMicroGame_example.prototype.SPRITE_SHEET_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-265/explosion17.png";

var container = new OJCaptchaContainer($("#oj-captcha-container"));
container.init([OJCaptchaMicroGame_example]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYmFzZS5qcyIsImdhbWVzL2V4YW1wbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUVNLFNBRUosU0FGSSxNQUVKLEdBQWE7d0JBRlQsUUFFUztDQUFiOztJQU1JOzs7QUFDTCxXQURLLEtBQ0wsQ0FBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQjswQkFEWCxPQUNXOzt1RUFEWCxtQkFDVzs7QUFFZixVQUFLLEVBQUwsR0FBVSxDQUFWLENBRmU7QUFHZixVQUFLLEVBQUwsR0FBVSxDQUFWLENBSGU7O0dBQWhCOztlQURLOzt3QkFPRTtBQUNOLGFBQU8sS0FBSyxFQUFMLENBREQ7O3NCQUlELElBQUc7QUFDUixXQUFLLEVBQUwsR0FBVSxFQUFWLENBRFE7Ozs7d0JBSUY7QUFDTixhQUFPLEtBQUssRUFBTCxDQUREOztzQkFJRCxJQUFHO0FBQ1IsV0FBSyxFQUFMLEdBQVUsRUFBVixDQURROzs7O1NBbkJKO0VBQWM7O0lBd0JkOzs7QUFDSixXQURJLGFBQ0osR0FBYTswQkFEVCxlQUNTOztrRUFEVCwyQkFDUztHQUFiOztTQURJO0VBQXNCOztJQU10Qjs7O0FBQ0osV0FESSxrQkFDSixDQUFZLElBQVosRUFBaUI7MEJBRGIsb0JBQ2E7O3dFQURiLGdDQUNhOztBQUVmLFdBQUssS0FBTCxHQUFhLElBQWIsQ0FGZTs7R0FBakI7O2VBREk7O3lCQXVCQyxVQUFTOztBQUdaLFdBQUssV0FBTCxHQUFtQixRQUFuQixDQUhZOztBQUtmLFdBQUssVUFBTCxHQUNFLElBREYsQ0FDTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBRFAsRUFMZTs7OztpQ0FTRjs7QUFFWCxVQUFJLGVBQWdCLEVBQUUsT0FBRixDQUFVLEVBQUUsR0FBRixDQUFNLEtBQUssV0FBTCxFQUFrQjtlQUFLLEVBQUUsU0FBRixDQUFZLGlCQUFaO09BQUwsQ0FBbEMsRUFBdUUsSUFBdkUsQ0FBaEIsQ0FGTzs7QUFJWCxVQUFJLGtCQUFrQixTQUFsQixlQUFrQixDQUFDLFdBQUQsRUFBaUI7QUFDeEMsZUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3ZDLGNBQUksTUFBTSxJQUFJLEtBQUosRUFBTixDQURtQztBQUV2QyxjQUFJLE1BQUosR0FBYSxPQUFiLENBRnVDO0FBR3ZDLGNBQUksR0FBSixHQUFVLFdBQVYsQ0FIdUM7U0FBckIsQ0FBbkIsQ0FEd0M7T0FBakIsQ0FKWDs7QUFZWCxVQUFJLFNBQVMsU0FBVCxNQUFTLENBQVMsT0FBVCxFQUFrQixNQUFsQixFQUF5QjtBQUN2QyxZQUFHLENBQUMsYUFBYSxNQUFiLEVBQXFCLE9BQU8sU0FBUCxDQUF6QjtBQUNBLHdCQUFnQixhQUFhLEtBQWIsRUFBaEIsRUFBc0MsSUFBdEMsQ0FBMkM7aUJBQU0sT0FBTyxPQUFQO1NBQU4sQ0FBM0MsQ0FGdUM7T0FBekIsQ0FaRjs7QUFpQlgsYUFBTyxJQUFJLE9BQUosQ0FBWSxNQUFaLENBQVA7OztBQWpCVzs7OzRCQXdCTDtBQUNMLFdBQUssT0FBTCxHQUFlLElBQWYsQ0FESztBQUVMLFdBQUssT0FBTCxHQUFlLEVBQUUsNENBQUYsQ0FBZixDQUZLO0FBR1IsV0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLElBQXBCLENBQXZCLEVBSFE7QUFJUixXQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQixFQUpRO0FBS0wsV0FBSyxHQUFMLEdBQVcsS0FBSyxPQUFMLENBQWEsQ0FBYixFQUFnQixVQUFoQixDQUEyQixJQUEzQixDQUFYLENBTEs7QUFNTCxXQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEtBQUssT0FBTCxDQUFsQixDQU5LOzs7OzRCQVNBO0FBQ0wsVUFBRyxDQUFDLEtBQUssT0FBTCxFQUFjLEtBQUssS0FBTCxHQUFsQjs7QUFESyxVQUdSLENBQUssVUFBTCxHQUFrQixZQUFZLEdBQVosRUFBbEIsQ0FIUTtBQUlMLGFBQU8scUJBQVAsQ0FBNkIsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBN0IsRUFKSzs7Ozt5QkFPRixXQUFVO0FBQ2IsV0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLEtBQUssR0FBTCxFQUFVLFlBQVksS0FBSyxVQUFMLENBQTNDLENBRGE7QUFFYixhQUFPLHFCQUFQLENBQTZCLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQTdCLEVBRmE7Ozs7Z0NBS0gsS0FBSTtBQUNqQixVQUFHLEtBQUssVUFBTCxFQUFpQixLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBSSxPQUFKLEVBQWEsSUFBSSxPQUFKLENBQW5DLENBQXBCOzs7OzhCQUdXLEtBQUk7QUFDZixVQUFHLEtBQUssVUFBTCxFQUFpQixLQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsQ0FBMEIsSUFBSSxPQUFKLEVBQWEsSUFBSSxPQUFKLENBQXZDLENBQXBCOzs7O3dCQTVFVztBQUNSLGFBQU8sS0FBSyxLQUFMLENBREM7Ozs7d0JBSU07QUFDZCxVQUFHLENBQUMsS0FBSyxXQUFMLEVBQWlCOzs7QUFHdEIsYUFBSyxXQUFMLEdBQW1CLEVBQUUsS0FBRixDQUFRLEVBQVIsRUFBWSxFQUFFLE1BQUYsQ0FBUyxDQUFULEVBQVcsQ0FBWCxDQUFaLEVBQTJCLElBQTNCLENBQWdDLEVBQWhDLENBQW5COzs7QUFIc0IsWUFNbkIsQ0FBSyxXQUFMLEdBQW1CLElBQUksS0FBSyxXQUFMLENBQWlCLENBQWpCLENBQUosQ0FBd0IsS0FBSyxXQUFMLENBQTNDLENBTm1CO09BQXJCOztBQVNBLGFBQU8sS0FBSyxXQUFMLENBVk87Ozs7U0FWWjtFQUEyQjs7SUF1RjNCOzs7QUFFSixXQUZJLHNCQUVKLENBQVksVUFBWixFQUF1QjswQkFGbkIsd0JBRW1COzt3RUFGbkIsb0NBRW1COztBQUVyQixXQUFLLFdBQUwsR0FBbUIsVUFBbkIsQ0FGcUI7O0dBQXZCOztlQUZJOzt5QkFXQyxHQUFFLEdBQUUsR0FBRSxHQUFFO0FBQ1osYUFBTyxVQUFVLENBQVYsR0FBYSxJQUFiLEdBQW9CLENBQXBCLEdBQXdCLElBQXhCLEdBQStCLENBQS9CLEdBQW1DLElBQW5DLEdBQTBDLENBQTFDLEdBQTZDLEdBQTdDLENBREs7Ozs7eUJBSVIsS0FBSyxJQUFHOzs7MEJBSVAsR0FBRSxHQUFFOzs7OEJBSUEsR0FBRSxHQUFFO0FBQ2YsV0FBSyxVQUFMLEdBQWtCLElBQUksS0FBSixDQUFVLENBQVYsRUFBWSxDQUFaLENBQWxCLENBRGU7Ozs7d0JBaEJFO0FBQ2QsYUFBTyxLQUFLLFdBQUwsQ0FETzs7Ozt3QkFvQkE7QUFDZixhQUFPLEtBQUssVUFBTCxDQURROzs7O1NBM0JaO0VBQStCOzs7Ozs7Ozs7Ozs7O0lDL0gvQjs7O0FBRUosVUFGSSwwQkFFSixDQUFZLFVBQVosRUFBdUI7d0JBRm5CLDRCQUVtQjs7cUVBRm5CLHVDQUdJLGFBRGU7O0FBRXhCLFFBQUssYUFBTCxHQUFxQixJQUFyQixDQUZ3Qjs7RUFBdkI7O2NBRkk7O3VCQU9DLEtBQUssSUFBRztBQUNYLDhCQVJFLGdFQVFTLEtBQUssR0FBaEIsQ0FEVzs7QUFHZCxPQUFJLFNBQUosR0FBZ0IsT0FBaEIsQ0FIYzs7QUFLWCxPQUFJLFFBQUosQ0FBYSxDQUFiLEVBQWUsQ0FBZixFQUFpQixHQUFqQixFQUFxQixHQUFyQixFQUxXOztBQU9kLE9BQUcsS0FBSyxhQUFMLEVBQW1CO0FBQ3JCLFNBQUssV0FBTCxDQUFpQixHQUFqQixFQUFzQixLQUFLLEdBQUwsQ0FBUyxLQUFHLElBQUgsRUFBUyxDQUFsQixDQUF0QixFQURxQjtJQUF0Qjs7OztvQ0FLbUI7QUFDbkIsT0FBSSxZQUFZLEtBQUssU0FBTCxDQURHO0FBRW5CLE9BQUcsQ0FBQyxTQUFELEVBQVksT0FBTyxJQUFJLEtBQUosQ0FBVSxHQUFWLEVBQWMsR0FBZCxDQUFQLENBQWY7QUFDQSxVQUFPLFNBQVAsQ0FIbUI7Ozs7OEJBTUwsS0FBSyxLQUFJO0FBQ3ZCLE9BQUksU0FBUyxLQUFLLGVBQUwsRUFBVCxDQURtQjtBQUV2QixPQUFJLFNBQUosR0FGdUI7QUFHdkIsT0FBSSxHQUFKLENBQVEsT0FBTyxDQUFQLEVBQVUsT0FBTyxDQUFQLEVBQVUsRUFBNUIsRUFBZ0MsQ0FBaEMsRUFBbUMsSUFBSSxLQUFLLEVBQUwsRUFBUyxLQUFoRCxFQUh1QjtBQUl2QixPQUFJLFNBQUosR0FBZ0IsS0FBSyxJQUFMLENBQVUsQ0FBVixFQUFhLEdBQWIsRUFBa0IsQ0FBbEIsRUFBcUIsR0FBckIsQ0FBaEIsQ0FKdUI7QUFLdkIsT0FBSSxJQUFKLEdBTHVCO0FBTXZCLE9BQUksU0FBSixHQUFnQixDQUFoQixDQU51QjtBQU92QixPQUFJLFdBQUosR0FBa0IsS0FBSyxJQUFMLENBQVUsQ0FBVixFQUFhLEdBQWIsRUFBa0IsQ0FBbEIsRUFBcUIsR0FBckIsQ0FBbEIsQ0FQdUI7QUFRdkIsT0FBSSxNQUFKLEdBUnVCOzs7O3dCQVdoQixHQUFFLEdBQUU7OztRQXBDTjtFQUFtQzs7QUF5Q3pDLDJCQUEyQixTQUEzQixDQUFxQyxpQkFBckMsR0FBeUQsb0VBQXpEOztBQUVBLElBQUksWUFBWSxJQUFJLGtCQUFKLENBQXVCLEVBQUUsdUJBQUYsQ0FBdkIsQ0FBWjtBQUNKLFVBQVUsSUFBVixDQUFlLENBQUMsMEJBQUQsQ0FBZiIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5jbGFzcyBPSkJhc2Uge1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBcclxuICB9XHJcbiAgXHJcbn1cclxuXHJcbmNsYXNzIFBvaW50IGV4dGVuZHMgT0pCYXNlIHtcclxuXHRjb25zdHJ1Y3Rvcih4LHkpe1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMuX3ggPSB4O1xyXG5cdFx0dGhpcy5feSA9IHk7XHJcblx0fVxyXG5cdFxyXG5cdGdldCB4KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5feDtcclxuXHR9XHJcblx0XHJcblx0c2V0IHgodG8pe1xyXG5cdFx0dGhpcy5feCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3k7IFxyXG5cdH1cclxuXHRcclxuXHRzZXQgeSh0byl7XHJcblx0XHR0aGlzLl95ID0gdG87XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFCYXNlIGV4dGVuZHMgT0pCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcbn0gXHJcblxyXG5jbGFzcyBPSkNhcHRjaGFDb250YWluZXIgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcigkc3JjKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl8kc3JjID0gJHNyYztcclxuICB9XHJcbiAgXHJcbiAgZ2V0ICRzcmMoKXtcclxuICAgIHJldHVybiB0aGlzLl8kc3JjOyBcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGFjdGl2ZUdhbWUoKXtcclxuICAgIGlmKCF0aGlzLl9hY3RpdmVHYW1lKXtcclxuXHRcdFxyXG5cdCAgLy9jcmVhdGUgYSAxNiBjaGFyIHJhbmRvbVNlZWRcclxuXHQgIHRoaXMuX2FjdGl2ZVNlZWQgPSBfLnRpbWVzKDE2LCBfLnJhbmRvbSgwLDkpKS5qb2luKFwiXCIpO1xyXG5cdCAgXHJcblx0ICAvL3N0YXJ0IHRoZSBhY3RpdmUgZ2FtZVxyXG4gICAgICB0aGlzLl9hY3RpdmVHYW1lID0gbmV3IHRoaXMuX2dhbWVzUXVldWVbMF0odGhpcy5fYWN0aXZlU2VlZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzLl9hY3RpdmVHYW1lO1xyXG4gIH1cclxuICBcclxuICBpbml0KGdhbWVzQXJyKXtcclxuXHQgIFxyXG5cdFxyXG4gICAgdGhpcy5fZ2FtZXNRdWV1ZSA9IGdhbWVzQXJyO1xyXG5cdFxyXG5cdHRoaXMubG9hZEFzc2V0cygpXHJcblx0XHQudGhlbih0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBcclxuICBsb2FkQXNzZXRzKCl7XHJcblx0ICAvL2xvYWQgc3ByaXRlc2hlZXRzXHJcblx0ICBsZXQgc3ByaXRlU2hlZXRzID0gIF8ud2l0aG91dChfLm1hcCh0aGlzLl9nYW1lc1F1ZXVlLCBnID0+IGcucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRIKSwgbnVsbCk7XHJcblxyXG5cdCAgbGV0IGxvYWRTcHJpdGVTaGVldCA9IChzcHJpdGVTaGVldCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHRpbWcub25sb2FkID0gcmVzb2x2ZTtcclxuXHRcdFx0aW1nLnNyYyA9IHNwcml0ZVNoZWV0O1xyXG5cdFx0fSk7IFxyXG5cdCAgfVxyXG5cdCAgXHJcblx0ICBsZXQgbG9hZGVyID0gZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdGlmKCFzcHJpdGVTaGVldHMubGVuZ3RoKSByZXR1cm4gcmVzb2x2ZSgpO1xyXG5cdFx0bG9hZFNwcml0ZVNoZWV0KHNwcml0ZVNoZWV0cy5zaGlmdCgpKS50aGVuKCgpID0+IGxvYWRlcihyZXNvbHZlKSk7XHJcblx0ICB9XHJcblx0ICBcclxuXHQgIHJldHVybiBuZXcgUHJvbWlzZShsb2FkZXIpOy8qKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcblx0XHRsb2FkZXIocmVzb2x2ZSk7XHJcblx0ICB9KSk7Ki9cclxuICB9XHJcbiAgXHJcbiAgXHJcbiAgXHJcbiAgYnVpbGQoKXtcclxuICAgIHRoaXMuaXNCdWlsZCA9IHRydWU7XHJcbiAgICB0aGlzLiRjYW52YXMgPSAkKFwiPGNhbnZhcyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzQwMCc+PC9jYW52YXM+XCIpO1xyXG5cdHRoaXMuJGNhbnZhcy5tb3VzZW1vdmUodGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSk7XHJcblx0dGhpcy4kY2FudmFzLmNsaWNrKHRoaXMuY2FudmFzY2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhc1swXS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB0aGlzLl8kc3JjLmFwcGVuZCh0aGlzLiRjYW52YXMpOyBcclxuICB9XHJcbiAgXHJcbiAgc3RhcnQoKXtcclxuICAgIGlmKCF0aGlzLmlzQnVpbHQpIHRoaXMuYnVpbGQoKTtcclxuICAgIC8vdGlja1xyXG5cdHRoaXMuX3N0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7ICBcclxuICB9XHJcbiAgXHJcbiAgdGljayh0aW1lU3RhbXApe1xyXG4gICAgdGhpcy5hY3RpdmVHYW1lLnRpY2sodGhpcy5jdHgsIHRpbWVTdGFtcCAtIHRoaXMuX3N0YXJ0VGltZSk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgXHJcbiAgY2FudmFzY2xpY2soZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5jbGljayhldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIG1vdXNlbW92ZShldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLm1vdXNlTW92ZShldnQub2Zmc2V0WCwgZXZ0Lm9mZnNldFkpO1xyXG4gIH1cclxuICBcclxufVxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhTWljcm9HYW1lQmFzZSBleHRlbmRzIE9KQ2FwdGNoYUJhc2Uge1xyXG5cdFxyXG4gIGNvbnN0cnVjdG9yKHJhbmRvbVNlZWQpe1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuX3JhbmRvbVNlZWQgPSByYW5kb21TZWVkO1xyXG4gIH1cclxuICBcclxuICBnZXQgcmFuZG9tU2VlZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX3JhbmRvbVNlZWQ7XHJcbiAgfVxyXG4gIFxyXG4gIHJnYmEocixnLGIsYSl7XHJcblx0ICByZXR1cm4gXCJyZ2JhKFwiICsgciArXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIiwgXCIgKyBhICtcIilcIjtcclxuICB9XHJcbiAgXHJcbiAgdGljayhjdHgsIG1zKXtcclxuICAgIFxyXG4gIH1cclxuICBcclxuICBjbGljayh4LHkpe1xyXG5cdCBcclxuICB9XHJcbiAgXHJcbiAgbW91c2VNb3ZlKHgseSl7XHJcblx0dGhpcy5fbGFzdE1vdXNlID0gbmV3IFBvaW50KHgseSk7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCBsYXN0TW91c2UoKSB7XHJcblx0ICByZXR1cm4gdGhpcy5fbGFzdE1vdXNlO1xyXG4gIH1cclxuICBcclxufSIsImNsYXNzIE9KQ2FwdGNoYU1pY3JvR2FtZV9leGFtcGxlIGV4dGVuZHMgT0pDYXB0Y2hhTWljcm9HYW1lQmFzZSB7IFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHJhbmRvbVNlZWQpe1xyXG4gICAgc3VwZXIocmFuZG9tU2VlZCk7XHJcblx0dGhpcy5mYWRlSW5CdXR0b25zID0gdHJ1ZTtcclxuICB9XHJcbiAgXHJcbiAgdGljayhjdHgsIG1zKXtcclxuICAgIHN1cGVyLnRpY2soY3R4LCBtcyk7IFxyXG5cdFx0XHJcblx0Y3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XHJcblx0XHJcbiAgICBjdHguZmlsbFJlY3QoMCwwLDQwMCw0MDApO1xyXG5cdFxyXG5cdGlmKHRoaXMuZmFkZUluQnV0dG9ucyl7XHJcblx0XHR0aGlzLmRyYXdCdXR0b25zKGN0eCwgTWF0aC5taW4obXMvNTAwMCwgMSkpO1xyXG5cdH1cclxuICB9XHJcbiAgXHJcbiAgZ2V0QnV0dG9uQ2VudGVyICgpe1xyXG5cdHZhciBsYXN0TW91c2UgPSB0aGlzLmxhc3RNb3VzZTtcclxuXHRpZighbGFzdE1vdXNlKSByZXR1cm4gbmV3IFBvaW50KDIwMCwyMDApO1xyXG5cdHJldHVybiBsYXN0TW91c2U7XHJcbiAgfVxyXG4gIFxyXG4gIGRyYXdCdXR0b25zIChjdHgsIHBjdCl7XHJcblx0dmFyIGNlbnRlciA9IHRoaXMuZ2V0QnV0dG9uQ2VudGVyKCk7XHJcblx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdGN0eC5hcmMoY2VudGVyLngsIGNlbnRlci55LCA1MCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuXHRjdHguZmlsbFN0eWxlID0gdGhpcy5yZ2JhKDAsIDEyOCwgMCwgcGN0KTtcclxuXHRjdHguZmlsbCgpO1xyXG5cdGN0eC5saW5lV2lkdGggPSA1O1xyXG5cdGN0eC5zdHJva2VTdHlsZSA9IHRoaXMucmdiYSgwLCAyNTUsIDAsIHBjdCk7XHJcblx0Y3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuICBcclxuICBjbGljayh4LHkpe1xyXG5cdFxyXG4gIH1cclxufSBcclxuXHJcbk9KQ2FwdGNoYU1pY3JvR2FtZV9leGFtcGxlLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCA9IFwiaHR0cHM6Ly9zMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9zLmNkcG4uaW8vdC0yNjUvZXhwbG9zaW9uMTcucG5nXCI7XHJcbiBcclxudmFyIGNvbnRhaW5lciA9IG5ldyBPSkNhcHRjaGFDb250YWluZXIoJChcIiNvai1jYXB0Y2hhLWNvbnRhaW5lclwiKSk7XHJcbmNvbnRhaW5lci5pbml0KFtPSkNhcHRjaGFNaWNyb0dhbWVfZXhhbXBsZV0pOyAiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
