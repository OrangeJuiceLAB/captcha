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
    key: "clone",
    value: function clone() {
      return new Point(this.x, this.y);
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
    _this3.imageAssets = [];
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
      var _this4 = this;

      //get spritesheets from game classes
      _.forEach(this._gamesQueue, function (g) {
        var url = g.prototype.SPRITE_SHEET_PATH;
        if (url && !(url in _this4.imageAssets)) {
          _this4.imageAssets.push({ url: url, image: new Image() });
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

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(OJCaptchaMicroGameBase).call(this));

    _this5._randomSeed = randomSeed;
    _this5._assets = assets;
    _this5._frames = {};
    return _this5;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWVzL2V4YW1wbGUuanMiLCJiYXNlL2Jhc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU07OztBQUVKLFVBRkksMEJBRUosQ0FBWSxVQUFaLEVBQXdCLE1BQXhCLEVBQStCO3dCQUYzQiw0QkFFMkI7O3FFQUYzQix1Q0FHSSxZQUFZLFNBRFc7O0FBRWhDLFFBQUssYUFBTCxHQUFxQixJQUFyQixDQUZnQzs7RUFBL0I7O2NBRkk7OzBDQU9tQjtBQUN2QixPQUFHLEtBQUssZUFBTCxLQUF5QixTQUF6QixFQUFvQyxLQUFLLGVBQUwsR0FBdUIsQ0FBQyxDQUFELENBQTlEO0FBQ0EsUUFBSyxlQUFMLEdBQXVCLEVBQUcsS0FBSyxlQUFMLElBQXVCLElBQUUsQ0FBRixDQUExQixDQUZBO0FBR3ZCLFVBQU8sS0FBSyxlQUFMLENBSGdCOzs7O3VCQU1sQixLQUFLLElBQUc7QUFDWCw4QkFkRSxnRUFjUyxLQUFLLEdBQWhCLENBRFc7O0FBR2QsT0FBSSxTQUFKLEdBQWdCLE9BQWhCLENBSGM7O0FBS1gsT0FBSSxRQUFKLENBQWEsQ0FBYixFQUFlLENBQWYsRUFBaUIsR0FBakIsRUFBcUIsR0FBckIsRUFMVzs7QUFPZCxPQUFJLFNBQVMsS0FBSyxTQUFMLElBQWtCLElBQUksS0FBSixDQUFVLEdBQVYsRUFBYyxHQUFkLENBQWxCLENBUEM7QUFRZCxPQUFHLENBQUMsTUFBRCxFQUFTLFNBQVMsSUFBSSxLQUFKLENBQVUsR0FBVixDQUFULENBQVo7O0FBRUEsVUFBTyxDQUFQLElBQVksRUFBWixDQVZjO0FBV2QsVUFBTyxDQUFQLElBQVksRUFBWixDQVhjOztBQWFkLFFBQUssbUJBQUwsQ0FDQyxHQURELEVBRUMsMkJBQTJCLFNBQTNCLENBQXFDLGlCQUFyQyxFQUNBLENBSEQsRUFJQyxDQUpELEVBS0MsS0FBSyxxQkFBTCxFQUxELEVBTUMsT0FBTyxDQUFQLEVBQ0EsT0FBTyxDQUFQLEVBQ0EsR0FSRCxFQVNDLEdBVEQsRUFiYzs7Ozt3QkF5QlAsR0FBRSxHQUFFOzs7UUF0Q047RUFBbUM7O0FBMkN6QywyQkFBMkIsU0FBM0IsQ0FBcUMsaUJBQXJDLEdBQXlELG9FQUF6RDs7QUFFQSxJQUFJLFlBQVksSUFBSSxrQkFBSixDQUF1QixFQUFFLHVCQUFGLENBQXZCLENBQVo7QUFDSixVQUFVLElBQVYsQ0FBZSxDQUFDLDBCQUFELENBQWY7Ozs7Ozs7Ozs7O0lDNUNNLFNBRUosU0FGSSxNQUVKLEdBQWE7d0JBRlQsUUFFUztDQUFiOztJQU1JOzs7QUFDTCxXQURLLEtBQ0wsQ0FBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQjswQkFEWCxPQUNXOzt1RUFEWCxtQkFDVzs7QUFFZixVQUFLLEVBQUwsR0FBVSxDQUFWLENBRmU7QUFHZixVQUFLLEVBQUwsR0FBVSxDQUFWLENBSGU7O0dBQWhCOztlQURLOzs0QkF1QkU7QUFDTixhQUFPLElBQUksS0FBSixDQUFVLEtBQUssQ0FBTCxFQUFRLEtBQUssQ0FBTCxDQUF6QixDQURNOzs7O3dCQWhCQTtBQUNOLGFBQU8sS0FBSyxFQUFMLENBREQ7O3NCQUlELElBQUc7QUFDUixXQUFLLEVBQUwsR0FBVSxFQUFWLENBRFE7Ozs7d0JBSUY7QUFDTixhQUFPLEtBQUssRUFBTCxDQUREOztzQkFJRCxJQUFHO0FBQ1IsV0FBSyxFQUFMLEdBQVUsRUFBVixDQURROzs7O1NBbkJKO0VBQWM7O0lBNEJkOzs7QUFDSixXQURJLGFBQ0osR0FBYTswQkFEVCxlQUNTOztrRUFEVCwyQkFDUztHQUFiOztTQURJO0VBQXNCOztJQU10Qjs7O0FBQ0osV0FESSxrQkFDSixDQUFZLElBQVosRUFBaUI7MEJBRGIsb0JBQ2E7O3dFQURiLGdDQUNhOztBQUVmLFdBQUssS0FBTCxHQUFhLElBQWIsQ0FGZTtBQUdsQixXQUFLLFdBQUwsR0FBbUIsRUFBbkIsQ0FIa0I7O0dBQWpCOztlQURJOzt5QkF3QkMsVUFBUzs7QUFFWixXQUFLLFdBQUwsR0FBbUIsUUFBbkIsQ0FGWTs7QUFJZixXQUFLLFVBQUwsR0FDRSxJQURGLENBQ08sS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQURQLEVBSmU7Ozs7aUNBUUY7Ozs7QUFHVixRQUFFLE9BQUYsQ0FBVSxLQUFLLFdBQUwsRUFBa0IsVUFBQyxDQUFELEVBQU87QUFDbkMsWUFBSSxNQUFNLEVBQUUsU0FBRixDQUFZLGlCQUFaLENBRHlCO0FBRW5DLFlBQUcsT0FBTyxFQUFFLE9BQU8sT0FBSyxXQUFMLENBQVQsRUFBMkI7QUFDcEMsaUJBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixFQUFFLFFBQUYsRUFBUSxPQUFRLElBQUksS0FBSixFQUFSLEVBQTlCLEVBRG9DO1NBQXJDO09BRjRCLEVBSzFCLElBTEY7OztBQUhVLFVBV1Asa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsV0FBRCxFQUFpQjtBQUN4QyxlQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdkMsc0JBQVksS0FBWixDQUFrQixNQUFsQixHQUEyQixZQUFNO0FBQ2hDLHdCQUFZLFFBQVosR0FBdUIsSUFBdkIsQ0FEZ0M7QUFFaEMsd0JBQVksS0FBWixHQUFvQixZQUFZLEtBQVosQ0FBa0IsWUFBbEIsQ0FGWTtBQUdoQyx3QkFBWSxNQUFaLEdBQXFCLFlBQVksS0FBWixDQUFrQixhQUFsQixDQUhXO0FBSWhDLHNCQUpnQztXQUFOLENBRFk7QUFPdkMsc0JBQVksS0FBWixDQUFrQixHQUFsQixHQUF3QixZQUFZLEdBQVosQ0FQZTtTQUFyQixDQUFuQixDQUR3QztPQUFqQjs7O0FBWFgsVUF3QlAsU0FBUyxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBeUI7QUFDdkMsWUFBSSxPQUFPLEVBQUUsSUFBRixDQUFPLEtBQUssV0FBTCxFQUFrQjtpQkFBSyxDQUFDLEVBQUUsUUFBRjtTQUFOLENBQWhDLENBRG1DO0FBRXZDLFlBQUcsQ0FBQyxJQUFELEVBQU8sT0FBTyxTQUFQLENBQVY7QUFDQSx3QkFBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBNEI7aUJBQU0sT0FBTyxPQUFQLEVBQWUsTUFBZjtTQUFOLENBQTVCLENBSHVDO09BQXpCLENBSVgsSUFKVyxDQUlOLElBSk0sQ0FBVCxDQXhCTzs7QUE4QlgsYUFBTyxJQUFJLE9BQUosQ0FBWSxNQUFaLENBQVAsQ0E5Qlc7Ozs7NEJBaUNMO0FBQ0wsV0FBSyxPQUFMLEdBQWUsSUFBZixDQURLO0FBRUwsV0FBSyxPQUFMLEdBQWUsRUFBRSw0Q0FBRixDQUFmLENBRks7QUFHUixXQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBdkIsRUFIUTtBQUlSLFdBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CLEVBSlE7QUFLTCxXQUFLLEdBQUwsR0FBVyxLQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLFVBQWhCLENBQTJCLElBQTNCLENBQVgsQ0FMSztBQU1MLFdBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBSyxPQUFMLENBQWxCLENBTks7Ozs7NEJBU0E7QUFDTCxVQUFHLENBQUMsS0FBSyxPQUFMLEVBQWMsS0FBSyxLQUFMLEdBQWxCOztBQURLLFVBR1IsQ0FBSyxVQUFMLEdBQWtCLFlBQVksR0FBWixFQUFsQixDQUhRO0FBSUwsYUFBTyxxQkFBUCxDQUE2QixLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUE3QixFQUpLOzs7O3lCQU9GLFdBQVU7QUFDYixXQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsS0FBSyxHQUFMLEVBQVUsWUFBWSxLQUFLLFVBQUwsQ0FBM0MsQ0FEYTtBQUViLGFBQU8scUJBQVAsQ0FBNkIsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBN0IsRUFGYTs7OztnQ0FLSCxLQUFJO0FBQ2pCLFVBQUcsS0FBSyxVQUFMLEVBQWlCLEtBQUssVUFBTCxDQUFnQixLQUFoQixDQUFzQixJQUFJLE9BQUosRUFBYSxJQUFJLE9BQUosQ0FBbkMsQ0FBcEI7Ozs7OEJBR1csS0FBSTtBQUNmLFVBQUcsS0FBSyxVQUFMLEVBQWlCLEtBQUssVUFBTCxDQUFnQixTQUFoQixDQUEwQixJQUFJLE9BQUosRUFBYSxJQUFJLE9BQUosQ0FBdkMsQ0FBcEI7Ozs7d0JBcEZXO0FBQ1IsYUFBTyxLQUFLLEtBQUwsQ0FEQzs7Ozt3QkFJTTtBQUNkLFVBQUcsQ0FBQyxLQUFLLFdBQUwsRUFBaUI7OztBQUd0QixhQUFLLFdBQUwsR0FBbUIsRUFBRSxLQUFGLENBQVEsRUFBUixFQUFZLEVBQUUsTUFBRixDQUFTLENBQVQsRUFBVyxDQUFYLENBQVosRUFBMkIsSUFBM0IsQ0FBZ0MsRUFBaEMsQ0FBbkI7OztBQUhzQixZQU1uQixDQUFLLFdBQUwsR0FBbUIsSUFBSSxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBSixDQUF3QixLQUFLLFdBQUwsRUFBa0IsS0FBSyxXQUFMLENBQTdELENBTm1CO09BQXJCOztBQVNBLGFBQU8sS0FBSyxXQUFMLENBVk87Ozs7U0FYWjtFQUEyQjs7SUFnRzNCOzs7QUFFSixXQUZJLHNCQUVKLENBQVksVUFBWixFQUF3QixNQUF4QixFQUErQjswQkFGM0Isd0JBRTJCOzt3RUFGM0Isb0NBRTJCOztBQUU3QixXQUFLLFdBQUwsR0FBbUIsVUFBbkIsQ0FGNkI7QUFHaEMsV0FBSyxPQUFMLEdBQWUsTUFBZixDQUhnQztBQUloQyxXQUFLLE9BQUwsR0FBZSxFQUFmLENBSmdDOztHQUEvQjs7ZUFGSTs7eUJBYUMsR0FBRSxHQUFFLEdBQUUsR0FBRTtBQUNaLGFBQU8sVUFBVSxDQUFWLEdBQWEsSUFBYixHQUFvQixDQUFwQixHQUF3QixJQUF4QixHQUErQixDQUEvQixHQUFtQyxJQUFuQyxHQUEwQyxDQUExQyxHQUE2QyxHQUE3QyxDQURLOzs7O3lCQUlSLEtBQUssSUFBRzs7OzBCQUlQLEdBQUUsR0FBRTs7OzZCQUlELE1BQUs7QUFDZixhQUFPLEVBQUUsSUFBRixDQUFPLEtBQUssT0FBTCxFQUFjO2VBQUssRUFBRSxHQUFGLElBQVMsSUFBVDtPQUFMLENBQTVCLENBRGU7Ozs7d0NBSU0sS0FBSyxNQUFNLFlBQVksWUFBWSxZQUFZLFNBQVMsU0FBUyxTQUFTLFNBQVE7QUFDdkcsVUFBSSxRQUFRLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBUjtVQUNILFNBQVMsTUFBTSxLQUFOLEdBQWMsVUFBZDtVQUNULFNBQVMsTUFBTSxNQUFOLEdBQWUsVUFBZjtVQUNULFNBQVMsS0FBSyxLQUFMLENBQVcsYUFBYSxVQUFiLENBQXBCO1VBQ0EsU0FBUyxhQUFjLFNBQVMsVUFBVCxDQUwrRTs7QUFPdkcsVUFBSSxTQUFKLENBQWMsTUFBTSxLQUFOLEVBQWEsU0FBUyxNQUFULEVBQWlCLFNBQVMsTUFBVCxFQUFpQixNQUE3RCxFQUFxRSxNQUFyRSxFQUE2RSxPQUE3RSxFQUFzRixPQUF0RixFQUErRixPQUEvRixFQUF3RyxPQUF4RyxFQVB1Rzs7Ozs4QkFVNUYsR0FBRSxHQUFFO0FBQ2YsV0FBSyxVQUFMLEdBQWtCLElBQUksS0FBSixDQUFVLENBQVYsRUFBWSxDQUFaLENBQWxCLENBRGU7Ozs7d0JBOUJFO0FBQ2QsYUFBTyxLQUFLLFdBQUwsQ0FETzs7Ozt3QkFrQ0E7QUFDZixVQUFHLENBQUMsS0FBSyxVQUFMLEVBQWlCLE9BQU8sSUFBUCxDQUFyQjtBQUNBLGFBQU8sS0FBSyxVQUFMLENBQWdCLEtBQWhCLEVBQVAsQ0FGZTs7OztTQTNDWjtFQUErQiIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgT0pDYXB0Y2hhTWljcm9HYW1lX2V4YW1wbGUgZXh0ZW5kcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIHsgXHJcbiAgXHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuICAgIHN1cGVyKHJhbmRvbVNlZWQsIGFzc2V0cyk7XHJcblx0dGhpcy5mYWRlSW5CdXR0b25zID0gdHJ1ZTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0TmV4dGV4cGxvc2lvbkZyYW1lKCl7XHJcblx0IGlmKHRoaXMuX2V4cGxvc2lvbkZyYW1lID09PSB1bmRlZmluZWQpIHRoaXMuX2V4cGxvc2lvbkZyYW1lID0gLTE7XHJcblx0IHRoaXMuX2V4cGxvc2lvbkZyYW1lID0gKCsrdGhpcy5fZXhwbG9zaW9uRnJhbWUpJSg1KjUpO1xyXG5cdCByZXR1cm4gdGhpcy5fZXhwbG9zaW9uRnJhbWU7XHJcbiAgfVxyXG4gIFxyXG4gIHRpY2soY3R4LCBtcyl7XHJcbiAgICBzdXBlci50aWNrKGN0eCwgbXMpOyBcclxuXHRcdFxyXG5cdGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG5cdFxyXG4gICAgY3R4LmZpbGxSZWN0KDAsMCw0MDAsNDAwKTtcclxuXHRcdFxyXG5cdHZhciBjZW50ZXIgPSB0aGlzLmxhc3RNb3VzZSB8fCBuZXcgUG9pbnQoMjAwLDIwMCk7XHJcblx0aWYoIWNlbnRlcikgY2VudGVyID0gbmV3IFBvaW50KDIwMClcclxuXHRcclxuXHRjZW50ZXIueCAtPSA1MDtcclxuXHRjZW50ZXIueSAtPSA1MDtcclxuXHRcclxuXHR0aGlzLmRyYXdGcm9tU3ByaXRlRnJhbWUoXHJcblx0XHRjdHgsIFxyXG5cdFx0T0pDYXB0Y2hhTWljcm9HYW1lX2V4YW1wbGUucHJvdG90eXBlLlNQUklURV9TSEVFVF9QQVRILFxyXG5cdFx0NSxcclxuXHRcdDUsXHJcblx0XHR0aGlzLmdldE5leHRleHBsb3Npb25GcmFtZSgpLCBcclxuXHRcdGNlbnRlci54LCBcclxuXHRcdGNlbnRlci55LFxyXG5cdFx0MTAwLFxyXG5cdFx0MTAwKTtcclxuICB9XHJcbiAgICBcclxuICBjbGljayh4LHkpe1xyXG5cdFxyXG4gIH1cclxufSBcclxuXHJcbk9KQ2FwdGNoYU1pY3JvR2FtZV9leGFtcGxlLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSCA9IFwiaHR0cHM6Ly9zMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9zLmNkcG4uaW8vdC0yNjUvZXhwbG9zaW9uMTcucG5nXCI7XHJcbiBcclxudmFyIGNvbnRhaW5lciA9IG5ldyBPSkNhcHRjaGFDb250YWluZXIoJChcIiNvai1jYXB0Y2hhLWNvbnRhaW5lclwiKSk7XHJcbmNvbnRhaW5lci5pbml0KFtPSkNhcHRjaGFNaWNyb0dhbWVfZXhhbXBsZV0pOyAiLCJcclxuXHJcbmNsYXNzIE9KQmFzZSB7XHJcbiAgXHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIFxyXG4gIH1cclxuICBcclxufVxyXG5cclxuY2xhc3MgUG9pbnQgZXh0ZW5kcyBPSkJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKHgseSl7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5feCA9IHg7XHJcblx0XHR0aGlzLl95ID0geTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHgoKXtcclxuXHRcdHJldHVybiB0aGlzLl94O1xyXG5cdH1cclxuXHRcclxuXHRzZXQgeCh0byl7XHJcblx0XHR0aGlzLl94ID0gdG87XHJcblx0fVxyXG5cdFxyXG5cdGdldCB5KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5feTsgXHJcblx0fVxyXG5cdFxyXG5cdHNldCB5KHRvKXtcclxuXHRcdHRoaXMuX3kgPSB0bztcclxuXHR9XHJcblx0XHJcblx0Y2xvbmUoKXtcclxuXHRcdHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhQmFzZSBleHRlbmRzIE9KQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG59IFxyXG5cclxuY2xhc3MgT0pDYXB0Y2hhQ29udGFpbmVyIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoJHNyYyl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fJHNyYyA9ICRzcmM7XHJcblx0dGhpcy5pbWFnZUFzc2V0cyA9IFtdO1xyXG4gIH1cclxuICBcclxuICBnZXQgJHNyYygpe1xyXG4gICAgcmV0dXJuIHRoaXMuXyRzcmM7IFxyXG4gIH1cclxuICBcclxuICBnZXQgYWN0aXZlR2FtZSgpe1xyXG4gICAgaWYoIXRoaXMuX2FjdGl2ZUdhbWUpe1xyXG5cdFx0XHJcblx0ICAvL2NyZWF0ZSBhIDE2IGNoYXIgcmFuZG9tU2VlZFxyXG5cdCAgdGhpcy5fYWN0aXZlU2VlZCA9IF8udGltZXMoMTYsIF8ucmFuZG9tKDAsOSkpLmpvaW4oXCJcIik7XHJcblx0ICBcclxuXHQgIC8vc3RhcnQgdGhlIGFjdGl2ZSBnYW1lXHJcbiAgICAgIHRoaXMuX2FjdGl2ZUdhbWUgPSBuZXcgdGhpcy5fZ2FtZXNRdWV1ZVswXSh0aGlzLl9hY3RpdmVTZWVkLCB0aGlzLmltYWdlQXNzZXRzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUdhbWU7XHJcbiAgfVxyXG4gIFxyXG4gIGluaXQoZ2FtZXNBcnIpe1xyXG5cdCAgXHJcbiAgICB0aGlzLl9nYW1lc1F1ZXVlID0gZ2FtZXNBcnI7XHJcblx0XHJcblx0dGhpcy5sb2FkQXNzZXRzKClcclxuXHRcdC50aGVuKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGxvYWRBc3NldHMoKXtcclxuXHQgIFxyXG5cdCAgLy9nZXQgc3ByaXRlc2hlZXRzIGZyb20gZ2FtZSBjbGFzc2VzXHJcblx0ICAgXy5mb3JFYWNoKHRoaXMuX2dhbWVzUXVldWUsIChnKSA9PiB7XHJcblx0XHQgIGxldCB1cmwgPSBnLnByb3RvdHlwZS5TUFJJVEVfU0hFRVRfUEFUSDtcclxuXHRcdCAgaWYodXJsICYmICEodXJsIGluIHRoaXMuaW1hZ2VBc3NldHMpKXtcclxuXHRcdFx0ICB0aGlzLmltYWdlQXNzZXRzLnB1c2goeyB1cmwgLCBpbWFnZSA6IG5ldyBJbWFnZSgpfSk7XHJcblx0XHQgIH1cclxuXHQgIH0sIHRoaXMpO1xyXG5cclxuXHQgIC8vbG9hZCBzaW5nbGUgc3ByaXRlc2hlZXQgaW1hZ2VcclxuXHQgIGxldCBsb2FkU3ByaXRlU2hlZXQgPSAoc3ByaXRlU2hlZXQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdHNwcml0ZVNoZWV0LmltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuXHRcdFx0XHRzcHJpdGVTaGVldC5jb21wbGV0ZSA9IHRydWU7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQud2lkdGggPSBzcHJpdGVTaGVldC5pbWFnZS5uYXR1cmFsV2lkdGg7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQuaGVpZ2h0ID0gc3ByaXRlU2hlZXQuaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuXHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3ByaXRlU2hlZXQuaW1hZ2Uuc3JjID0gc3ByaXRlU2hlZXQudXJsO1xyXG5cdFx0fSk7XHJcblx0ICB9XHJcblx0ICBcclxuXHQgIC8vcmVjdXJzaXZlIGNsb3N1cmUgdGhhdCBsb2FkcyBhbGwgc3ByZWFkc2hlZXRzIGZyb20gcXVldWVcclxuXHQgIGxldCBsb2FkZXIgPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0bGV0IG5leHQgPSBfLmZpbmQodGhpcy5pbWFnZUFzc2V0cywgYSA9PiAhYS5jb21wbGV0ZSk7XHJcblx0XHRpZighbmV4dCkgcmV0dXJuIHJlc29sdmUoKTtcclxuXHRcdGxvYWRTcHJpdGVTaGVldChuZXh0KS50aGVuKCAoKSA9PiBsb2FkZXIocmVzb2x2ZSxyZWplY3QpKTtcclxuXHQgIH0uYmluZCh0aGlzKTtcclxuXHQgIFxyXG5cdCAgcmV0dXJuIG5ldyBQcm9taXNlKGxvYWRlcik7XHJcbiAgfVxyXG4gIFxyXG4gIGJ1aWxkKCl7XHJcbiAgICB0aGlzLmlzQnVpbGQgPSB0cnVlO1xyXG4gICAgdGhpcy4kY2FudmFzID0gJChcIjxjYW52YXMgd2lkdGg9JzQwMCcgaGVpZ2h0PSc0MDAnPjwvY2FudmFzPlwiKTtcclxuXHR0aGlzLiRjYW52YXMubW91c2Vtb3ZlKHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcykpO1xyXG5cdHRoaXMuJGNhbnZhcy5jbGljayh0aGlzLmNhbnZhc2NsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLiRjYW52YXNbMF0uZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgdGhpcy5fJHNyYy5hcHBlbmQodGhpcy4kY2FudmFzKTsgXHJcbiAgfVxyXG4gIFxyXG4gIHN0YXJ0KCl7XHJcbiAgICBpZighdGhpcy5pc0J1aWx0KSB0aGlzLmJ1aWxkKCk7XHJcbiAgICAvL3RpY2tcclxuXHR0aGlzLl9zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpOyAgXHJcbiAgfVxyXG4gIFxyXG4gIHRpY2sodGltZVN0YW1wKXtcclxuICAgIHRoaXMuYWN0aXZlR2FtZS50aWNrKHRoaXMuY3R4LCB0aW1lU3RhbXAgLSB0aGlzLl9zdGFydFRpbWUpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGNhbnZhc2NsaWNrKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUuY2xpY2soZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTsgIFxyXG4gIH1cclxuICBcclxuICBtb3VzZW1vdmUoZXZ0KXtcclxuXHRpZih0aGlzLmFjdGl2ZUdhbWUpIHRoaXMuYWN0aXZlR2FtZS5tb3VzZU1vdmUoZXZ0Lm9mZnNldFgsIGV2dC5vZmZzZXRZKTtcclxuICB9XHJcbiAgXHJcbn1cclxuXHJcbmNsYXNzIE9KQ2FwdGNoYU1pY3JvR2FtZUJhc2UgZXh0ZW5kcyBPSkNhcHRjaGFCYXNlIHtcclxuXHRcclxuICBjb25zdHJ1Y3RvcihyYW5kb21TZWVkLCBhc3NldHMpe1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuX3JhbmRvbVNlZWQgPSByYW5kb21TZWVkO1xyXG5cdHRoaXMuX2Fzc2V0cyA9IGFzc2V0cztcclxuXHR0aGlzLl9mcmFtZXMgPSB7fTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IHJhbmRvbVNlZWQoKXtcclxuICAgIHJldHVybiB0aGlzLl9yYW5kb21TZWVkO1xyXG4gIH1cclxuICBcclxuICByZ2JhKHIsZyxiLGEpe1xyXG5cdCAgcmV0dXJuIFwicmdiYShcIiArIHIgK1wiLCBcIiArIGcgKyBcIiwgXCIgKyBiICsgXCIsIFwiICsgYSArXCIpXCI7XHJcbiAgfVxyXG4gIFxyXG4gIHRpY2soY3R4LCBtcyl7XHJcbiAgICBcclxuICB9XHJcbiAgXHJcbiAgY2xpY2soeCx5KXtcclxuXHQgXHJcbiAgfVxyXG4gIFxyXG4gIGdldEFzc2V0KG5hbWUpe1xyXG5cdHJldHVybiBfLmZpbmQodGhpcy5fYXNzZXRzLCBhID0+IGEudXJsID09IG5hbWUpO1xyXG4gIH1cclxuICBcclxuICBkcmF3RnJvbVNwcml0ZUZyYW1lKGN0eCwgbmFtZSwgbnVtRnJhbWVzVywgbnVtRnJhbWVzSCwgZnJhbWVJbmRleCwgdGFyZ2V0WCwgdGFyZ2V0WSwgdGFyZ2V0VywgdGFyZ2V0SCl7XHJcblx0bGV0IGFzc2V0ID0gdGhpcy5nZXRBc3NldChuYW1lKSxcclxuXHRcdGZyYW1lVyA9IGFzc2V0LndpZHRoIC8gbnVtRnJhbWVzVyxcclxuXHRcdGZyYW1lSCA9IGFzc2V0LmhlaWdodCAvIG51bUZyYW1lc0gsXHJcblx0XHRmcmFtZVkgPSBNYXRoLmZsb29yKGZyYW1lSW5kZXggLyBudW1GcmFtZXNXKSxcclxuXHRcdGZyYW1lWCA9IGZyYW1lSW5kZXggLSAoZnJhbWVZICogbnVtRnJhbWVzVyk7XHJcblx0XHRcclxuXHRjdHguZHJhd0ltYWdlKGFzc2V0LmltYWdlLCBmcmFtZVggKiBmcmFtZVcsIGZyYW1lWSAqIGZyYW1lSCwgZnJhbWVXLCBmcmFtZUgsIHRhcmdldFgsIHRhcmdldFksIHRhcmdldFcsIHRhcmdldEgpO1xyXG4gIH1cclxuICBcclxuICBtb3VzZU1vdmUoeCx5KXtcclxuXHR0aGlzLl9sYXN0TW91c2UgPSBuZXcgUG9pbnQoeCx5KTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGxhc3RNb3VzZSgpIHtcclxuXHQgIGlmKCF0aGlzLl9sYXN0TW91c2UpIHJldHVybiBudWxsO1xyXG5cdCAgcmV0dXJuIHRoaXMuX2xhc3RNb3VzZS5jbG9uZSgpO1xyXG4gIH1cclxuICBcclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
