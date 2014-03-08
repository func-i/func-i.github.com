(function() {
  this.Pinch = (function() {
    Pinch.prototype.distanceLowerBound = 20;

    function Pinch(args) {
      this.initDistance = this.getDistance(args.center, args.rawTouches[0].pageX, args.rawTouches[0].pageY);
      this.touches = [];
      this.saveTouches(args.rawTouches, args.center);
    }

    Pinch.prototype.saveTouches = function(rawTouches, center) {
      var rawTouch, touch, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = rawTouches.length; _i < _len; _i++) {
        rawTouch = rawTouches[_i];
        touch = {
          id: rawTouch.identifier
        };
        _results.push(this.touches.push(touch));
      }
      return _results;
    };

    Pinch.prototype.getDistance = function(center, touchPosX, touchPosY) {
      var distanceX, distanceY;
      distanceX = center.pageX - touchPosX;
      distanceY = center.pageY - touchPosY;
      return Math.round(Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)));
    };

    Pinch.prototype.multiplier = function() {
      return ((this.initDistance - this.distance) / this.initDistance).toFixed(2);
    };

    Pinch.prototype.updatePosition = function(center, rawTouches) {
      var rawTouch, touch, _i, _len;
      this.center = center;
      for (_i = 0, _len = rawTouches.length; _i < _len; _i++) {
        rawTouch = rawTouches[_i];
        touch = _.findWhere(this.touches, {
          id: rawTouch.identifier
        });
        touch.position = {
          left: rawTouch.pageX,
          top: rawTouch.pageY
        };
      }
      return this.distance = this.getDistance(this.center, rawTouches[0].pageX, rawTouches[0].pageY);
    };

    return Pinch;

  })();

}).call(this);
