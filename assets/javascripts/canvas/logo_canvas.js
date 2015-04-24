(function() {
  this.LogoCanvas = (function() {
    function LogoCanvas(args) {
      this.elem = args.elem;
      this.pixelRatio = this.getPixelRatio();
      this.orient();
    }

    LogoCanvas.prototype.getPixelRatio = function() {
      var bspr, dpr, testCtx;
      testCtx = this.elem[0].getContext('2d');
      dpr = window.devicePixelRatio || 1;
      bspr = testCtx.webkitBackingStorePixelRatio || testCtx.mozBackingStorePixelRatio || testCtx.msBackingStorePixelRatio || testCtx.oBackingStorePixelRatio || testCtx.backingStorePixelRatio || 1;
      return dpr / bspr;
    };

    LogoCanvas.prototype.orient = function() {
      this.width = $(window).width();
      this.height = this.elem.height();
      this.elem.css('width', this.width);
      this.elem.css('height', this.height);
      this.elem.attr('width', this.width * this.pixelRatio);
      return this.elem.attr('height', this.height * this.pixelRatio);
    };

    return LogoCanvas;

  })();

}).call(this);
