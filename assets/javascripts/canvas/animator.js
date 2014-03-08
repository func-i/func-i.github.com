(function() {
  this.animationIds = [];

  this.animateLogo = function(logo, canvas, context) {
    var animationId;
    context.clear(0, 0, canvas.width, canvas.height);
    logo.draw();
    animationId = requestAnimationFrame(function() {
      return animateLogo(logo, canvas, context);
    });
    return animationIds.push(animationId);
  };

  this.animateSquare = function(square, canvas, context) {
    var animationId;
    context.clear(square.left, square.top, square.sideLength, square.sideLength);
    square.draw();
    animationId = requestAnimationFrame(function() {
      return animateSquare(square, canvas, context);
    });
    return animationIds.push(animationId);
  };

  this.animateAllSquares = function(canvas, context) {
    var animationId, square, _i, _len;
    context.clear(0, 0, canvas.width, canvas.height);
    for (_i = 0, _len = squares.length; _i < _len; _i++) {
      square = squares[_i];
      square.orient();
      square.draw();
    }
    animationId = requestAnimationFrame(function() {
      return animateAllSquares(canvas, context);
    });
    return animationIds.push(animationId);
  };

  this.stopAnimations = function() {
    var id, _i, _len;
    for (_i = 0, _len = animationIds.length; _i < _len; _i++) {
      id = animationIds[_i];
      cancelAnimationFrame(id);
    }
    return animationIds.length = 0;
  };

}).call(this);
