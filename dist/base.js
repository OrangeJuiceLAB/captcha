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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUVNLFNBRUosU0FGSSxNQUVKLEdBQWE7d0JBRlQsUUFFUztDQUFiOztJQU1JOzs7QUFDTCxXQURLLEtBQ0wsQ0FBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQjswQkFEWCxPQUNXOzt1RUFEWCxtQkFDVzs7QUFFZixVQUFLLEVBQUwsR0FBVSxDQUFWLENBRmU7QUFHZixVQUFLLEVBQUwsR0FBVSxDQUFWLENBSGU7O0dBQWhCOztlQURLOzs0QkF1QkU7QUFDTixhQUFPLElBQUksS0FBSixDQUFVLEtBQUssQ0FBTCxFQUFRLEtBQUssQ0FBTCxDQUF6QixDQURNOzs7O3dCQWhCQTtBQUNOLGFBQU8sS0FBSyxFQUFMLENBREQ7O3NCQUlELElBQUc7QUFDUixXQUFLLEVBQUwsR0FBVSxFQUFWLENBRFE7Ozs7d0JBSUY7QUFDTixhQUFPLEtBQUssRUFBTCxDQUREOztzQkFJRCxJQUFHO0FBQ1IsV0FBSyxFQUFMLEdBQVUsRUFBVixDQURROzs7O1NBbkJKO0VBQWM7O0lBNEJkOzs7QUFDSixXQURJLGFBQ0osR0FBYTswQkFEVCxlQUNTOztrRUFEVCwyQkFDUztHQUFiOztTQURJO0VBQXNCOztJQU10Qjs7O0FBQ0osV0FESSxrQkFDSixDQUFZLElBQVosRUFBaUI7MEJBRGIsb0JBQ2E7O3dFQURiLGdDQUNhOztBQUVmLFdBQUssS0FBTCxHQUFhLElBQWIsQ0FGZTtBQUdsQixXQUFLLFdBQUwsR0FBbUIsRUFBbkIsQ0FIa0I7O0dBQWpCOztlQURJOzt5QkF3QkMsVUFBUzs7QUFFWixXQUFLLFdBQUwsR0FBbUIsUUFBbkIsQ0FGWTs7QUFJZixXQUFLLFVBQUwsR0FDRSxJQURGLENBQ08sS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQURQLEVBSmU7Ozs7aUNBUUY7Ozs7QUFHVixRQUFFLE9BQUYsQ0FBVSxLQUFLLFdBQUwsRUFBa0IsVUFBQyxDQUFELEVBQU87QUFDbkMsWUFBSSxNQUFNLEVBQUUsU0FBRixDQUFZLGlCQUFaLENBRHlCO0FBRW5DLFlBQUcsT0FBTyxFQUFFLE9BQU8sT0FBSyxXQUFMLENBQVQsRUFBMkI7QUFDcEMsaUJBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixFQUFFLFFBQUYsRUFBUSxPQUFRLElBQUksS0FBSixFQUFSLEVBQTlCLEVBRG9DO1NBQXJDO09BRjRCLEVBSzFCLElBTEY7OztBQUhVLFVBV1Asa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsV0FBRCxFQUFpQjtBQUN4QyxlQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdkMsc0JBQVksS0FBWixDQUFrQixNQUFsQixHQUEyQixZQUFNO0FBQ2hDLHdCQUFZLFFBQVosR0FBdUIsSUFBdkIsQ0FEZ0M7QUFFaEMsd0JBQVksS0FBWixHQUFvQixZQUFZLEtBQVosQ0FBa0IsWUFBbEIsQ0FGWTtBQUdoQyx3QkFBWSxNQUFaLEdBQXFCLFlBQVksS0FBWixDQUFrQixhQUFsQixDQUhXO0FBSWhDLHNCQUpnQztXQUFOLENBRFk7QUFPdkMsc0JBQVksS0FBWixDQUFrQixHQUFsQixHQUF3QixZQUFZLEdBQVosQ0FQZTtTQUFyQixDQUFuQixDQUR3QztPQUFqQjs7O0FBWFgsVUF3QlAsU0FBUyxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBeUI7QUFDdkMsWUFBSSxPQUFPLEVBQUUsSUFBRixDQUFPLEtBQUssV0FBTCxFQUFrQjtpQkFBSyxDQUFDLEVBQUUsUUFBRjtTQUFOLENBQWhDLENBRG1DO0FBRXZDLFlBQUcsQ0FBQyxJQUFELEVBQU8sT0FBTyxTQUFQLENBQVY7QUFDQSx3QkFBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBNEI7aUJBQU0sT0FBTyxPQUFQLEVBQWUsTUFBZjtTQUFOLENBQTVCLENBSHVDO09BQXpCLENBSVgsSUFKVyxDQUlOLElBSk0sQ0FBVCxDQXhCTzs7QUE4QlgsYUFBTyxJQUFJLE9BQUosQ0FBWSxNQUFaLENBQVAsQ0E5Qlc7Ozs7NEJBaUNMO0FBQ0wsV0FBSyxPQUFMLEdBQWUsSUFBZixDQURLO0FBRUwsV0FBSyxPQUFMLEdBQWUsRUFBRSw0Q0FBRixDQUFmLENBRks7QUFHUixXQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBdkIsRUFIUTtBQUlSLFdBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CLEVBSlE7QUFLTCxXQUFLLEdBQUwsR0FBVyxLQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLFVBQWhCLENBQTJCLElBQTNCLENBQVgsQ0FMSztBQU1MLFdBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBSyxPQUFMLENBQWxCLENBTks7Ozs7NEJBU0E7QUFDTCxVQUFHLENBQUMsS0FBSyxPQUFMLEVBQWMsS0FBSyxLQUFMLEdBQWxCOztBQURLLFVBR1IsQ0FBSyxVQUFMLEdBQWtCLFlBQVksR0FBWixFQUFsQixDQUhRO0FBSUwsYUFBTyxxQkFBUCxDQUE2QixLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUE3QixFQUpLOzs7O3lCQU9GLFdBQVU7QUFDYixXQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsS0FBSyxHQUFMLEVBQVUsWUFBWSxLQUFLLFVBQUwsQ0FBM0MsQ0FEYTtBQUViLGFBQU8scUJBQVAsQ0FBNkIsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBN0IsRUFGYTs7OztnQ0FLSCxLQUFJO0FBQ2pCLFVBQUcsS0FBSyxVQUFMLEVBQWlCLEtBQUssVUFBTCxDQUFnQixLQUFoQixDQUFzQixJQUFJLE9BQUosRUFBYSxJQUFJLE9BQUosQ0FBbkMsQ0FBcEI7Ozs7OEJBR1csS0FBSTtBQUNmLFVBQUcsS0FBSyxVQUFMLEVBQWlCLEtBQUssVUFBTCxDQUFnQixTQUFoQixDQUEwQixJQUFJLE9BQUosRUFBYSxJQUFJLE9BQUosQ0FBdkMsQ0FBcEI7Ozs7d0JBcEZXO0FBQ1IsYUFBTyxLQUFLLEtBQUwsQ0FEQzs7Ozt3QkFJTTtBQUNkLFVBQUcsQ0FBQyxLQUFLLFdBQUwsRUFBaUI7OztBQUd0QixhQUFLLFdBQUwsR0FBbUIsRUFBRSxLQUFGLENBQVEsRUFBUixFQUFZLEVBQUUsTUFBRixDQUFTLENBQVQsRUFBVyxDQUFYLENBQVosRUFBMkIsSUFBM0IsQ0FBZ0MsRUFBaEMsQ0FBbkI7OztBQUhzQixZQU1uQixDQUFLLFdBQUwsR0FBbUIsSUFBSSxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBSixDQUF3QixLQUFLLFdBQUwsRUFBa0IsS0FBSyxXQUFMLENBQTdELENBTm1CO09BQXJCOztBQVNBLGFBQU8sS0FBSyxXQUFMLENBVk87Ozs7U0FYWjtFQUEyQjs7SUFnRzNCOzs7QUFFSixXQUZJLHNCQUVKLENBQVksVUFBWixFQUF3QixNQUF4QixFQUErQjswQkFGM0Isd0JBRTJCOzt3RUFGM0Isb0NBRTJCOztBQUU3QixXQUFLLFdBQUwsR0FBbUIsVUFBbkIsQ0FGNkI7QUFHaEMsV0FBSyxPQUFMLEdBQWUsTUFBZixDQUhnQztBQUloQyxXQUFLLE9BQUwsR0FBZSxFQUFmLENBSmdDOztHQUEvQjs7ZUFGSTs7eUJBYUMsR0FBRSxHQUFFLEdBQUUsR0FBRTtBQUNaLGFBQU8sVUFBVSxDQUFWLEdBQWEsSUFBYixHQUFvQixDQUFwQixHQUF3QixJQUF4QixHQUErQixDQUEvQixHQUFtQyxJQUFuQyxHQUEwQyxDQUExQyxHQUE2QyxHQUE3QyxDQURLOzs7O3lCQUlSLEtBQUssSUFBRzs7OzBCQUlQLEdBQUUsR0FBRTs7OzZCQUlELE1BQUs7QUFDZixhQUFPLEVBQUUsSUFBRixDQUFPLEtBQUssT0FBTCxFQUFjO2VBQUssRUFBRSxHQUFGLElBQVMsSUFBVDtPQUFMLENBQTVCLENBRGU7Ozs7d0NBSU0sS0FBSyxNQUFNLFlBQVksWUFBWSxZQUFZLFNBQVMsU0FBUyxTQUFTLFNBQVE7QUFDdkcsVUFBSSxRQUFRLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBUjtVQUNILFNBQVMsTUFBTSxLQUFOLEdBQWMsVUFBZDtVQUNULFNBQVMsTUFBTSxNQUFOLEdBQWUsVUFBZjtVQUNULFNBQVMsS0FBSyxLQUFMLENBQVcsYUFBYSxVQUFiLENBQXBCO1VBQ0EsU0FBUyxhQUFjLFNBQVMsVUFBVCxDQUwrRTs7QUFPdkcsVUFBSSxTQUFKLENBQWMsTUFBTSxLQUFOLEVBQWEsU0FBUyxNQUFULEVBQWlCLFNBQVMsTUFBVCxFQUFpQixNQUE3RCxFQUFxRSxNQUFyRSxFQUE2RSxPQUE3RSxFQUFzRixPQUF0RixFQUErRixPQUEvRixFQUF3RyxPQUF4RyxFQVB1Rzs7Ozs4QkFVNUYsR0FBRSxHQUFFO0FBQ2YsV0FBSyxVQUFMLEdBQWtCLElBQUksS0FBSixDQUFVLENBQVYsRUFBWSxDQUFaLENBQWxCLENBRGU7Ozs7d0JBOUJFO0FBQ2QsYUFBTyxLQUFLLFdBQUwsQ0FETzs7Ozt3QkFrQ0E7QUFDZixVQUFHLENBQUMsS0FBSyxVQUFMLEVBQWlCLE9BQU8sSUFBUCxDQUFyQjtBQUNBLGFBQU8sS0FBSyxVQUFMLENBQWdCLEtBQWhCLEVBQVAsQ0FGZTs7OztTQTNDWjtFQUErQiIsImZpbGUiOiJiYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5jbGFzcyBPSkJhc2Uge1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBcclxuICB9XHJcbiAgXHJcbn1cclxuXHJcbmNsYXNzIFBvaW50IGV4dGVuZHMgT0pCYXNlIHtcclxuXHRjb25zdHJ1Y3Rvcih4LHkpe1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMuX3ggPSB4O1xyXG5cdFx0dGhpcy5feSA9IHk7XHJcblx0fVxyXG5cdFxyXG5cdGdldCB4KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5feDtcclxuXHR9XHJcblx0XHJcblx0c2V0IHgodG8pe1xyXG5cdFx0dGhpcy5feCA9IHRvO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgeSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3k7IFxyXG5cdH1cclxuXHRcclxuXHRzZXQgeSh0byl7XHJcblx0XHR0aGlzLl95ID0gdG87XHJcblx0fVxyXG5cdFxyXG5cdGNsb25lKCl7XHJcblx0XHRyZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIE9KQ2FwdGNoYUJhc2UgZXh0ZW5kcyBPSkJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxufSBcclxuXHJcbmNsYXNzIE9KQ2FwdGNoYUNvbnRhaW5lciBleHRlbmRzIE9KQ2FwdGNoYUJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCRzcmMpe1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuXyRzcmMgPSAkc3JjO1xyXG5cdHRoaXMuaW1hZ2VBc3NldHMgPSBbXTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0ICRzcmMoKXtcclxuICAgIHJldHVybiB0aGlzLl8kc3JjOyBcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGFjdGl2ZUdhbWUoKXtcclxuICAgIGlmKCF0aGlzLl9hY3RpdmVHYW1lKXtcclxuXHRcdFxyXG5cdCAgLy9jcmVhdGUgYSAxNiBjaGFyIHJhbmRvbVNlZWRcclxuXHQgIHRoaXMuX2FjdGl2ZVNlZWQgPSBfLnRpbWVzKDE2LCBfLnJhbmRvbSgwLDkpKS5qb2luKFwiXCIpO1xyXG5cdCAgXHJcblx0ICAvL3N0YXJ0IHRoZSBhY3RpdmUgZ2FtZVxyXG4gICAgICB0aGlzLl9hY3RpdmVHYW1lID0gbmV3IHRoaXMuX2dhbWVzUXVldWVbMF0odGhpcy5fYWN0aXZlU2VlZCwgdGhpcy5pbWFnZUFzc2V0cyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzLl9hY3RpdmVHYW1lO1xyXG4gIH1cclxuICBcclxuICBpbml0KGdhbWVzQXJyKXtcclxuXHQgIFxyXG4gICAgdGhpcy5fZ2FtZXNRdWV1ZSA9IGdhbWVzQXJyO1xyXG5cdFxyXG5cdHRoaXMubG9hZEFzc2V0cygpXHJcblx0XHQudGhlbih0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBcclxuICBsb2FkQXNzZXRzKCl7XHJcblx0ICBcclxuXHQgIC8vZ2V0IHNwcml0ZXNoZWV0cyBmcm9tIGdhbWUgY2xhc3Nlc1xyXG5cdCAgIF8uZm9yRWFjaCh0aGlzLl9nYW1lc1F1ZXVlLCAoZykgPT4ge1xyXG5cdFx0ICBsZXQgdXJsID0gZy5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEg7XHJcblx0XHQgIGlmKHVybCAmJiAhKHVybCBpbiB0aGlzLmltYWdlQXNzZXRzKSl7XHJcblx0XHRcdCAgdGhpcy5pbWFnZUFzc2V0cy5wdXNoKHsgdXJsICwgaW1hZ2UgOiBuZXcgSW1hZ2UoKX0pO1xyXG5cdFx0ICB9XHJcblx0ICB9LCB0aGlzKTtcclxuXHJcblx0ICAvL2xvYWQgc2luZ2xlIHNwcml0ZXNoZWV0IGltYWdlXHJcblx0ICBsZXQgbG9hZFNwcml0ZVNoZWV0ID0gKHNwcml0ZVNoZWV0KSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRzcHJpdGVTaGVldC5pbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcblx0XHRcdFx0c3ByaXRlU2hlZXQuY29tcGxldGUgPSB0cnVlO1xyXG5cdFx0XHRcdHNwcml0ZVNoZWV0LndpZHRoID0gc3ByaXRlU2hlZXQuaW1hZ2UubmF0dXJhbFdpZHRoO1xyXG5cdFx0XHRcdHNwcml0ZVNoZWV0LmhlaWdodCA9IHNwcml0ZVNoZWV0LmltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcblx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNwcml0ZVNoZWV0LmltYWdlLnNyYyA9IHNwcml0ZVNoZWV0LnVybDtcclxuXHRcdH0pO1xyXG5cdCAgfVxyXG5cdCAgXHJcblx0ICAvL3JlY3Vyc2l2ZSBjbG9zdXJlIHRoYXQgbG9hZHMgYWxsIHNwcmVhZHNoZWV0cyBmcm9tIHF1ZXVlXHJcblx0ICBsZXQgbG9hZGVyID0gZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdGxldCBuZXh0ID0gXy5maW5kKHRoaXMuaW1hZ2VBc3NldHMsIGEgPT4gIWEuY29tcGxldGUpO1xyXG5cdFx0aWYoIW5leHQpIHJldHVybiByZXNvbHZlKCk7XHJcblx0XHRsb2FkU3ByaXRlU2hlZXQobmV4dCkudGhlbiggKCkgPT4gbG9hZGVyKHJlc29sdmUscmVqZWN0KSk7XHJcblx0ICB9LmJpbmQodGhpcyk7XHJcblx0ICBcclxuXHQgIHJldHVybiBuZXcgUHJvbWlzZShsb2FkZXIpO1xyXG4gIH1cclxuICBcclxuICBidWlsZCgpe1xyXG4gICAgdGhpcy5pc0J1aWxkID0gdHJ1ZTtcclxuICAgIHRoaXMuJGNhbnZhcyA9ICQoXCI8Y2FudmFzIHdpZHRoPSc0MDAnIGhlaWdodD0nNDAwJz48L2NhbnZhcz5cIik7XHJcblx0dGhpcy4kY2FudmFzLm1vdXNlbW92ZSh0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpKTtcclxuXHR0aGlzLiRjYW52YXMuY2xpY2sodGhpcy5jYW52YXNjbGljay5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy4kY2FudmFzWzBdLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIHRoaXMuXyRzcmMuYXBwZW5kKHRoaXMuJGNhbnZhcyk7IFxyXG4gIH1cclxuICBcclxuICBzdGFydCgpe1xyXG4gICAgaWYoIXRoaXMuaXNCdWlsdCkgdGhpcy5idWlsZCgpO1xyXG4gICAgLy90aWNrXHJcblx0dGhpcy5fc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTsgIFxyXG4gIH1cclxuICBcclxuICB0aWNrKHRpbWVTdGFtcCl7XHJcbiAgICB0aGlzLmFjdGl2ZUdhbWUudGljayh0aGlzLmN0eCwgdGltZVN0YW1wIC0gdGhpcy5fc3RhcnRUaW1lKTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBcclxuICBjYW52YXNjbGljayhldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLmNsaWNrKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7ICBcclxuICB9XHJcbiAgXHJcbiAgbW91c2Vtb3ZlKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUubW91c2VNb3ZlKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcblx0XHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCwgYXNzZXRzKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLl9yYW5kb21TZWVkID0gcmFuZG9tU2VlZDtcclxuXHR0aGlzLl9hc3NldHMgPSBhc3NldHM7XHJcblx0dGhpcy5fZnJhbWVzID0ge307XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByYW5kb21TZWVkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcmFuZG9tU2VlZDtcclxuICB9XHJcbiAgXHJcbiAgcmdiYShyLGcsYixhKXtcclxuXHQgIHJldHVybiBcInJnYmEoXCIgKyByICtcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCBcIiArIGEgK1wiKVwiO1xyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG4gIGNsaWNrKHgseSl7XHJcblx0IFxyXG4gIH1cclxuICBcclxuICBnZXRBc3NldChuYW1lKXtcclxuXHRyZXR1cm4gXy5maW5kKHRoaXMuX2Fzc2V0cywgYSA9PiBhLnVybCA9PSBuYW1lKTtcclxuICB9XHJcbiAgXHJcbiAgZHJhd0Zyb21TcHJpdGVGcmFtZShjdHgsIG5hbWUsIG51bUZyYW1lc1csIG51bUZyYW1lc0gsIGZyYW1lSW5kZXgsIHRhcmdldFgsIHRhcmdldFksIHRhcmdldFcsIHRhcmdldEgpe1xyXG5cdGxldCBhc3NldCA9IHRoaXMuZ2V0QXNzZXQobmFtZSksXHJcblx0XHRmcmFtZVcgPSBhc3NldC53aWR0aCAvIG51bUZyYW1lc1csXHJcblx0XHRmcmFtZUggPSBhc3NldC5oZWlnaHQgLyBudW1GcmFtZXNILFxyXG5cdFx0ZnJhbWVZID0gTWF0aC5mbG9vcihmcmFtZUluZGV4IC8gbnVtRnJhbWVzVyksXHJcblx0XHRmcmFtZVggPSBmcmFtZUluZGV4IC0gKGZyYW1lWSAqIG51bUZyYW1lc1cpO1xyXG5cdFx0XHJcblx0Y3R4LmRyYXdJbWFnZShhc3NldC5pbWFnZSwgZnJhbWVYICogZnJhbWVXLCBmcmFtZVkgKiBmcmFtZUgsIGZyYW1lVywgZnJhbWVILCB0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRXLCB0YXJnZXRIKTtcclxuICB9XHJcbiAgXHJcbiAgbW91c2VNb3ZlKHgseSl7XHJcblx0dGhpcy5fbGFzdE1vdXNlID0gbmV3IFBvaW50KHgseSk7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCBsYXN0TW91c2UoKSB7XHJcblx0ICBpZighdGhpcy5fbGFzdE1vdXNlKSByZXR1cm4gbnVsbDtcclxuXHQgIHJldHVybiB0aGlzLl9sYXN0TW91c2UuY2xvbmUoKTtcclxuICB9XHJcbiAgXHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
