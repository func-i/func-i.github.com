(function() {
  this.Logo = (function() {
    Logo.prototype.logoString = "FUNCTIONALIMPERATIVE";

    Logo.prototype.logoLetters = [];

    Logo.prototype.breakPoint = {
      large: 640,
      small: 320
    };

    Logo.prototype.popInterval = 1000;

    function Logo(args) {
      this.elem = args.elem;
      this.canvas = args.canvas;
      this.context = args.context;
      this.screenWidth = args.screenWidth;
      this.position = this.elem.offset();
      this.imgSrc = this.elem.data('imgSprite');
      this.expanded = true;
      this.setSize();
      this.setImg();
    }

    Logo.prototype.setSize = function() {
      return this.size = this.screenWidth >= this.breakPoint.large ? "large" : "small";
    };

    Logo.prototype.tooDamnSmall = function() {
      return this.screenWidth < this.breakPoint.small;
    };

    Logo.prototype.setImg = function() {
      var logo;
      logo = this;
      this.imgObject = new Image();
      this.imgObject.src = this.imgSrc;
      return this.imgObject.onload = function() {
        return logo.createLogo();
      };
    };

    Logo.prototype.createLogo = function() {
      this.createLetters();
      this.resize(this.screenWidth);
      return this.draw();
    };

    Logo.prototype.createLetters = function() {
      var index, logoLetter, _i, _ref, _results;
      _results = [];
      for (index = _i = 0, _ref = this.logoString.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
        logoLetter = new LogoLetter({
          text: this.logoString.charAt(index),
          anchor: this.position,
          logoImgObject: this.imgObject,
          context: this.context,
          logo: this,
          id: index
        });
        _results.push(this.logoLetters.push(logoLetter));
      }
      return _results;
    };

    Logo.prototype.getRandomLetter = function() {
      var logoLetter, unexpandedLetters, _i, _len, _ref;
      unexpandedLetters = _.where(this.logoLetters, {
        expanded: false
      });
      if (unexpandedLetters.length !== 0) {
        return unexpandedLetters[_.random(unexpandedLetters.length - 1)];
      } else {
        _ref = this.logoLetters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          logoLetter = _ref[_i];
          logoLetter.expanded = false;
        }
        return this.getRandomLetter();
      }
    };

    Logo.prototype.popLetters = function() {
      var that;
      that = this;
      return that.popLettersId = setInterval(function() {
        var logoLetter;
        logoLetter = that.getRandomLetter();
        logoLetter.expanded = true;
        logoLetter.expand();
        return setTimeout(function() {
          return logoLetter.contract();
        }, that.popInterval);
      }, that.popInterval);
    };

    Logo.prototype.isUnderMouse = function(mouseLeft, mouseTop) {
      var bottom, bottomLetter, left, leftLetter, right, rightLetter, top, topLetter;
      topLetter = _.min(this.logoLetters, function(logoLetter) {
        if (logoLetter.isVisible()) {
          return logoLetter.homeTop;
        }
      });
      rightLetter = _.max(this.logoLetters, function(logoLetter) {
        if (logoLetter.isVisible()) {
          return logoLetter.homeLeft;
        }
      });
      bottomLetter = _.max(this.logoLetters, function(logoLetter) {
        if (logoLetter.isVisible()) {
          return logoLetter.homeTop;
        }
      });
      leftLetter = _.min(this.logoLetters, function(logoLetter) {
        if (logoLetter.isVisible()) {
          return logoLetter.homeLeft;
        }
      });
      top = topLetter.top;
      right = rightLetter.left + rightLetter.sideLength;
      bottom = bottomLetter.top + bottomLetter.sideLength;
      left = leftLetter.left;
      return mouseLeft < right && mouseLeft > left && mouseTop < bottom && mouseTop > top;
    };

    Logo.prototype.resize = function(screenWidth) {
      this.screenWidth = screenWidth;
      this.changeAnchor(this.elem.offset());
      this.setSize();
      this.setSideLengths();
      if (this.tooDamnSmall()) {
        this.contract();
      }
      return this.setHomePosition();
    };

    Logo.prototype.changeAnchor = function(offset) {
      var logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        _results.push(logoLetter.anchor = offset);
      }
      return _results;
    };

    Logo.prototype.changeCursor = function(mouseLeft, mouseTop) {
      var cursor;
      cursor = this.isUnderMouse(mouseLeft, mouseTop) ? 'pointer' : 'default';
      return this.elem.css('cursor', cursor);
    };

    Logo.prototype.animate = function(mouseLeft, mouseTop) {
      var distanceFromMouse, logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        distanceFromMouse = logoLetter.getDistanceFromMouse(mouseLeft, mouseTop);
        _results.push(logoLetter.moveFromMouse({
          distanceFromMouse: distanceFromMouse
        }));
      }
      return _results;
    };

    Logo.prototype.explode = function(mouseLeft, mouseTop) {
      var distanceFromMouse, logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        distanceFromMouse = logoLetter.getDistanceFromMouse(mouseLeft, mouseTop);
        _results.push(logoLetter.moveFromMouse({
          distanceFromMouse: distanceFromMouse,
          mousemoveEffectDistance: 300
        }));
      }
      return _results;
    };

    Logo.prototype.expand = function() {
      this.expanded = true;
      return this.returnHome();
    };

    Logo.prototype.contract = function() {
      this.expanded = false;
      return this.returnHome();
    };

    Logo.prototype.setHomePosition = function() {
      var logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        _results.push(logoLetter.setHomePosition());
      }
      return _results;
    };

    Logo.prototype.setSideLengths = function() {
      var logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        _results.push(logoLetter.setSideLength());
      }
      return _results;
    };

    Logo.prototype.returnHome = function() {
      var logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        _results.push(logoLetter.returnHome());
      }
      return _results;
    };

    Logo.prototype.reset = function() {
      var logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        _results.push(logoLetter.reset());
      }
      return _results;
    };

    Logo.prototype.squeeze = function(pinch) {
      var logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        _results.push(logoLetter.squeeze(pinch));
      }
      return _results;
    };

    Logo.prototype.dragLetters = function(hold, mouseLeft, mouseTop) {
      var logoLetter, _i, _len, _ref, _results;
      _ref = hold.heldLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        _results.push(logoLetter.stickToTouch(mouseLeft, mouseTop));
      }
      return _results;
    };

    Logo.prototype.draw = function() {
      var logoLetter, _i, _len, _ref, _results;
      _ref = this.logoLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        _results.push(logoLetter.draw());
      }
      return _results;
    };

    return Logo;

  })();

}).call(this);
