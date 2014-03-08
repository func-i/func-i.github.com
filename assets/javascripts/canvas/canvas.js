(function() {
  this.Canvas = (function() {
    Canvas.prototype.buffer = 2;

    function Canvas(args) {
      this.referenceElem = args.referenceElem;
      this.createElem();
      this.setOffset();
      this.pixelRatio = this.getPixelRatio();
      this.orient();
      this.elem.data('obj', this);
      this.squares = [];
    }

    Canvas.prototype.createElem = function() {
      this.elem = $('<canvas></canvas>');
      return this.referenceElem.prepend(this.elem);
    };

    Canvas.prototype.getPixelRatio = function() {
      var bspr, dpr, testCtx;
      testCtx = this.elem[0].getContext('2d');
      dpr = window.devicePixelRatio || 1;
      bspr = testCtx.webkitBackingStorePixelRatio || testCtx.mozBackingStorePixelRatio || testCtx.msBackingStorePixelRatio || testCtx.oBackingStorePixelRatio || testCtx.backingStorePixelRatio || 1;
      return dpr / bspr;
    };

    Canvas.prototype.setOffset = function() {
      this.offsetLeft = Math.round(this.referenceElem.offset().left - this.buffer);
      return this.offsetTop = Math.round(this.referenceElem.offset().top - this.buffer);
    };

    Canvas.prototype.orient = function() {
      this.setOffset();
      this.width = this.referenceElem.width() + (this.buffer * 2);
      this.height = this.referenceElem.height() + (this.buffer * 2);
      this.elem.css('width', this.width);
      this.elem.css('height', this.height);
      this.elem.attr('width', this.width * this.pixelRatio);
      return this.elem.attr('height', this.height * this.pixelRatio);
    };

    Canvas.prototype.adjustSquarePositions = function() {
      var currentSquare, currentSquareRight, i, otherSquare, _i, _len, _ref, _results;
      _ref = this.squares;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        currentSquare = _ref[i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = this.squares.slice(i + 1, this.squares.length);
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            otherSquare = _ref1[_j];
            currentSquareRight = currentSquare.left + currentSquare.sideLength;
            if (otherSquare.left === (currentSquareRight + 1)) {
              otherSquare.left -= 1;
              otherSquare.elem.css('left', -1);
              _results1.push(otherSquare.alreadyAdjusted = true);
            } else if (otherSquare.left === (currentSquareRight - 1)) {
              otherSquare.left += 1;
              otherSquare.elem.css('left', 1);
              _results1.push(otherSquare.alreadyAdjusted = true);
            } else if (otherSquare.left === (currentSquareRight + 2)) {
              otherSquare.left -= 2;
              otherSquare.elem.css('left', -2);
              _results1.push(otherSquare.alreadyAdjusted = true);
            } else {
              if (!otherSquare.alreadyAdjusted) {
                _results1.push(otherSquare.elem.css('left', 0));
              } else {
                _results1.push(void 0);
              }
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return Canvas;

  })();

}).call(this);
