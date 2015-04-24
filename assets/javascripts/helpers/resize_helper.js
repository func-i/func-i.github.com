(function() {
  this.ResizeHelper = {
    handleResize: function(args) {
      var canvas, square, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      $('.square').each(function() {
        var $square, roundedWidth;
        $square = $(this);
        $square.css('width', '');
        roundedWidth = Math.round($(this).outerWidth());
        $square.css('width', roundedWidth);
        return $square.css('height', roundedWidth);
      });
      _ref = window.canvases;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        canvas = _ref[_i];
        canvas.orient();
        canvas.context.clear(0, 0, canvas.width, canvas.height);
        canvas.context.setMultiply();
        _ref1 = canvas.squares;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          square = _ref1[_j];
          square.orient();
        }
        canvas.adjustSquarePositions();
        _ref2 = canvas.squares;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          square = _ref2[_k];
          square.draw();
        }
      }
      if (blendingSupported) {
        window.logo.resize($(window).innerWidth());
        return window.logo.draw();
      }
    },
    windowOrientation: void 0
  };

}).call(this);
