(function() {
  this.Hold = (function() {
    function Hold(args) {
      this.logo = args.logo;
      this.initMouseLeft = args.mouseX;
      this.initMouseTop = args.mouseY;
      this.heldLetters = [];
      this.findHeldLetters();
      this.expandHeldLetters();
      this.setHoldOffset();
    }

    Hold.prototype.findHeldLetters = function() {
      var logoLetter, _i, _len, _ref;
      _ref = this.logo.logoLetters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        logoLetter = _ref[_i];
        if (logoLetter.isUnderMouse(this.initMouseLeft, this.initMouseTop)) {
          this.heldLetters.push(logoLetter);
        }
      }
      return this.heldLetters;
    };

    Hold.prototype.setHoldOffset = function() {
      var heldLetter, _i, _len, _ref, _results;
      _ref = this.heldLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        heldLetter = _ref[_i];
        _results.push(heldLetter.holdOffset = {
          left: heldLetter.left - this.initMouseLeft,
          top: heldLetter.top - this.initMouseTop
        });
      }
      return _results;
    };

    Hold.prototype.expandHeldLetters = function() {
      var heldLetter, _i, _len, _ref, _results;
      _ref = this.heldLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        heldLetter = _ref[_i];
        _results.push(heldLetter.expand());
      }
      return _results;
    };

    Hold.prototype.end = function() {
      var heldLetter, _i, _len, _ref, _results;
      _ref = this.heldLetters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        heldLetter = _ref[_i];
        heldLetter.contract();
        _results.push(heldLetter.savePos());
      }
      return _results;
    };

    return Hold;

  })();

}).call(this);
