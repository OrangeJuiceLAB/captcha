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
//# sourceMappingURL=data:application/json;base64,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LEdBQW9CLENBQXBCLEdBQXdCLElBQXhCLEdBQStCLENBQS9CLEdBQW1DLElBQW5DLEdBQTBDLENBQTFDLEdBQTZDLEdBQTdDLENBREs7Ozs7eUJBSVIsS0FBSyxJQUFHOzs7MEJBSVAsR0FBRSxHQUFFOzs7OEJBSUEsR0FBRSxHQUFFO0FBQ2YsV0FBSyxVQUFMLEdBQWtCLElBQUksS0FBSixDQUFVLENBQVYsRUFBWSxDQUFaLENBQWxCLENBRGU7Ozs7d0JBaEJFO0FBQ2QsYUFBTyxLQUFLLFdBQUwsQ0FETzs7Ozt3QkFvQkE7QUFDZixhQUFPLEtBQUssVUFBTCxDQURROzs7O1NBM0JaO0VBQStCIiwiZmlsZSI6ImJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmNsYXNzIE9KQmFzZSB7XHJcbiAgXHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIFxyXG4gIH1cclxuICBcclxufVxyXG5cclxuY2xhc3MgUG9pbnQgZXh0ZW5kcyBPSkJhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKHgseSl7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5feCA9IHg7XHJcblx0XHR0aGlzLl95ID0geTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHgoKXtcclxuXHRcdHJldHVybiB0aGlzLl94O1xyXG5cdH1cclxuXHRcclxuXHRzZXQgeCh0byl7XHJcblx0XHR0aGlzLl94ID0gdG87XHJcblx0fVxyXG5cdFxyXG5cdGdldCB5KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5feTsgXHJcblx0fVxyXG5cdFxyXG5cdHNldCB5KHRvKXtcclxuXHRcdHRoaXMuX3kgPSB0bztcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIE9KQ2FwdGNoYUJhc2UgZXh0ZW5kcyBPSkJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxufSBcclxuXHJcbmNsYXNzIE9KQ2FwdGNoYUNvbnRhaW5lciBleHRlbmRzIE9KQ2FwdGNoYUJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCRzcmMpe1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuXyRzcmMgPSAkc3JjO1xyXG4gIH1cclxuICBcclxuICBnZXQgJHNyYygpe1xyXG4gICAgcmV0dXJuIHRoaXMuXyRzcmM7IFxyXG4gIH1cclxuICBcclxuICBnZXQgYWN0aXZlR2FtZSgpe1xyXG4gICAgaWYoIXRoaXMuX2FjdGl2ZUdhbWUpe1xyXG5cdFx0XHJcblx0ICAvL2NyZWF0ZSBhIDE2IGNoYXIgcmFuZG9tU2VlZFxyXG5cdCAgdGhpcy5fYWN0aXZlU2VlZCA9IF8udGltZXMoMTYsIF8ucmFuZG9tKDAsOSkpLmpvaW4oXCJcIik7XHJcblx0ICBcclxuXHQgIC8vc3RhcnQgdGhlIGFjdGl2ZSBnYW1lXHJcbiAgICAgIHRoaXMuX2FjdGl2ZUdhbWUgPSBuZXcgdGhpcy5fZ2FtZXNRdWV1ZVswXSh0aGlzLl9hY3RpdmVTZWVkKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUdhbWU7XHJcbiAgfVxyXG4gIFxyXG4gIGluaXQoZ2FtZXNBcnIpe1xyXG5cdCAgXHJcblx0XHJcbiAgICB0aGlzLl9nYW1lc1F1ZXVlID0gZ2FtZXNBcnI7XHJcblx0XHJcblx0dGhpcy5sb2FkQXNzZXRzKClcclxuXHRcdC50aGVuKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIFxyXG4gIGxvYWRBc3NldHMoKXtcclxuXHQgIC8vbG9hZCBzcHJpdGVzaGVldHNcclxuXHQgIGxldCBzcHJpdGVTaGVldHMgPSAgXy53aXRob3V0KF8ubWFwKHRoaXMuX2dhbWVzUXVldWUsIGcgPT4gZy5wcm90b3R5cGUuU1BSSVRFX1NIRUVUX1BBVEgpLCBudWxsKTtcclxuXHJcblx0ICBsZXQgbG9hZFNwcml0ZVNoZWV0ID0gKHNwcml0ZVNoZWV0KSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdGltZy5vbmxvYWQgPSByZXNvbHZlO1xyXG5cdFx0XHRpbWcuc3JjID0gc3ByaXRlU2hlZXQ7XHJcblx0XHR9KTsgXHJcblx0ICB9XHJcblx0ICBcclxuXHQgIGxldCBsb2FkZXIgPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0aWYoIXNwcml0ZVNoZWV0cy5sZW5ndGgpIHJldHVybiByZXNvbHZlKCk7XHJcblx0XHRsb2FkU3ByaXRlU2hlZXQoc3ByaXRlU2hlZXRzLnNoaWZ0KCkpLnRoZW4oKCkgPT4gbG9hZGVyKHJlc29sdmUpKTtcclxuXHQgIH1cclxuXHQgIFxyXG5cdCAgcmV0dXJuIG5ldyBQcm9taXNlKGxvYWRlcik7LyooZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuXHRcdGxvYWRlcihyZXNvbHZlKTtcclxuXHQgIH0pKTsqL1xyXG4gIH1cclxuICBcclxuICBcclxuICBcclxuICBidWlsZCgpe1xyXG4gICAgdGhpcy5pc0J1aWxkID0gdHJ1ZTtcclxuICAgIHRoaXMuJGNhbnZhcyA9ICQoXCI8Y2FudmFzIHdpZHRoPSc0MDAnIGhlaWdodD0nNDAwJz48L2NhbnZhcz5cIik7XHJcblx0dGhpcy4kY2FudmFzLm1vdXNlbW92ZSh0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpKTtcclxuXHR0aGlzLiRjYW52YXMuY2xpY2sodGhpcy5jYW52YXNjbGljay5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy4kY2FudmFzWzBdLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIHRoaXMuXyRzcmMuYXBwZW5kKHRoaXMuJGNhbnZhcyk7IFxyXG4gIH1cclxuICBcclxuICBzdGFydCgpe1xyXG4gICAgaWYoIXRoaXMuaXNCdWlsdCkgdGhpcy5idWlsZCgpO1xyXG4gICAgLy90aWNrXHJcblx0dGhpcy5fc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTsgIFxyXG4gIH1cclxuICBcclxuICB0aWNrKHRpbWVTdGFtcCl7XHJcbiAgICB0aGlzLmFjdGl2ZUdhbWUudGljayh0aGlzLmN0eCwgdGltZVN0YW1wIC0gdGhpcy5fc3RhcnRUaW1lKTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBcclxuICBjYW52YXNjbGljayhldnQpe1xyXG5cdGlmKHRoaXMuYWN0aXZlR2FtZSkgdGhpcy5hY3RpdmVHYW1lLmNsaWNrKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7ICBcclxuICB9XHJcbiAgXHJcbiAgbW91c2Vtb3ZlKGV2dCl7XHJcblx0aWYodGhpcy5hY3RpdmVHYW1lKSB0aGlzLmFjdGl2ZUdhbWUubW91c2VNb3ZlKGV2dC5vZmZzZXRYLCBldnQub2Zmc2V0WSk7XHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5jbGFzcyBPSkNhcHRjaGFNaWNyb0dhbWVCYXNlIGV4dGVuZHMgT0pDYXB0Y2hhQmFzZSB7XHJcblx0XHJcbiAgY29uc3RydWN0b3IocmFuZG9tU2VlZCl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fcmFuZG9tU2VlZCA9IHJhbmRvbVNlZWQ7XHJcbiAgfVxyXG4gIFxyXG4gIGdldCByYW5kb21TZWVkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcmFuZG9tU2VlZDtcclxuICB9XHJcbiAgXHJcbiAgcmdiYShyLGcsYixhKXtcclxuXHQgIHJldHVybiBcInJnYmEoXCIgKyByICtcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCBcIiArIGEgK1wiKVwiO1xyXG4gIH1cclxuICBcclxuICB0aWNrKGN0eCwgbXMpe1xyXG4gICAgXHJcbiAgfVxyXG4gIFxyXG4gIGNsaWNrKHgseSl7XHJcblx0IFxyXG4gIH1cclxuICBcclxuICBtb3VzZU1vdmUoeCx5KXtcclxuXHR0aGlzLl9sYXN0TW91c2UgPSBuZXcgUG9pbnQoeCx5KTtcclxuICB9XHJcbiAgXHJcbiAgZ2V0IGxhc3RNb3VzZSgpIHtcclxuXHQgIHJldHVybiB0aGlzLl9sYXN0TW91c2U7XHJcbiAgfVxyXG4gIFxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
