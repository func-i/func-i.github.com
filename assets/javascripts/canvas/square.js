(function() {
  this.Square = (function() {
    Square.prototype.fillHeight = 0;

    Square.prototype.fillSpeed = 36;

    function Square(args) {
      this.id = args.id;
      this.canvas = args.canvas;
      this.context = args.context;
      this.ctx = this.context.ctx;
      this.elem = args.elem;
      this.color = BASE_COLORS[this.elem.data('color')];
      this.type = this.elem.data('type');
      this.rollover = this.elem.data('rollover') === 'true';
      this.isHalfImage = this.elem.hasClass('half-image');
      this.isImage = this.elem.hasClass('image');
      this.orient();
      this.elem = this.elem.data('obj', this);
      this.canvas.squares.push(this);
    }

    Square.prototype.orient = function() {
      this.sideLength = Math.round(this.elem.outerWidth());
      this.top = Math.round(this.elem.offset().top) - this.canvas.offsetTop;
      this.left = Math.round(this.elem.offset().left) - this.canvas.offsetLeft;
      if (this.isHalfImage) {
        this.orientHalfImage();
      }
      if (this.isImage) {
        return this.orientImage();
      }
    };

    Square.prototype.orientHalfImage = function() {
      return this.elem.find('img').css('width', this.elem.width() - 2);
    };

    Square.prototype.orientImage = function() {
      return this.elem.find('img').css('width', this.elem.outerWidth());
    };

    Square.prototype.draw = function() {
      if (this.type === "outlined") {
        return this.strokeRect();
      } else if (this.type === "filled") {
        return this.fillRect();
      }
    };

    Square.prototype.strokeRect = function(color) {
      color = color || this.color;
      this.ctx.lineWidth = "1";
      this.ctx.strokeStyle = color;
      return this.ctx.strokeRect(this.left + .5, this.top + .5, this.sideLength, this.sideLength);
    };

    Square.prototype.fillRect = function(color) {
      color = color || this.color;
      this.ctx.fillStyle = color;
      return this.ctx.fillRect(this.left, this.top, this.sideLength, this.sideLength);
    };

    return Square;

  })();

}).call(this);
