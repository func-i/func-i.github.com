(function() {
  this.Context = (function() {
    Context.prototype.clearBuffer = 1;

    function Context(canvas) {
      this.canvasElem = canvas.elem[0];
      this.width = canvas.width;
      this.height = canvas.height;
      this.pixelRatio = canvas.pixelRatio;
      this.getCtx();
      this.setMultiply();
    }

    Context.prototype.getCtx = function() {
      return this.ctx = this.canvasElem.getContext("2d");
    };

    Context.prototype.setMultiply = function() {
      this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
      return this.ctx.globalCompositeOperation = 'multiply';
    };

    Context.prototype.clear = function(offsetX, offsetY, width, height) {
      this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
      return this.ctx.clearRect(offsetX, offsetY, width + this.clearBuffer, height + this.clearBuffer);
    };

    return Context;

  })();

}).call(this);
