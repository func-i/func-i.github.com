(function() {
  this.LogoLetter = (function() {
    LogoLetter.prototype.spriteSideLength = 120;

    LogoLetter.prototype.spritePadding = 4;

    LogoLetter.prototype.defaultSideLength = {
      large: 60,
      small: 35
    };

    LogoLetter.prototype.xOverlap = {
      large: 5,
      small: 3
    };

    LogoLetter.prototype.yOverlap = {
      large: 12,
      small: 6
    };

    LogoLetter.prototype.mousemoveEffectDistance = {
      large: 100,
      small: 75
    };

    LogoLetter.prototype.expansionSize = {
      large: 4,
      small: 8
    };

    function LogoLetter(args) {
      this.id = args.id;
      this.ctx = args.context.ctx;
      this.text = args.text;
      this.anchor = args.anchor;
      this.logo = args.logo;
      this.display = args.display;
      this.logoImgObject = args.logoImgObject;
      this.pixelRatio = args.context.pixelRatio;
      this.ySpriteOffset = this.id * (this.spriteSideLength + this.spritePadding);
      this.expanded = false;
      this.setSideLength();
      this.setWord();
      this.setColor();
      this.setHomePosition();
    }

    LogoLetter.prototype.setSideLength = function(sideLength) {
      return this.sideLength = sideLength || this.defaultSideLength[this.logo.size];
    };

    LogoLetter.prototype.middle = function() {
      var left, top;
      left = this.left + (this.sideLength / 2);
      top = this.top + (this.sideLength / 2);
      return {
        left: left,
        top: top
      };
    };

    LogoLetter.prototype.setFromMiddle = function(middleLeft, middleTop) {
      this.left = middleLeft - (this.sideLength / 2);
      return this.top = middleTop - (this.sideLength / 2);
    };

    LogoLetter.prototype.setWord = function() {
      return this.word = this.id < 10 ? 1 : 2;
    };

    LogoLetter.prototype.setColor = function() {
      var colorString;
      colorString = this.word === 1 ? "yellow" : "blue";
      return this.color = BASE_COLORS[colorString];
    };

    LogoLetter.prototype.setHomePosition = function() {
      var leftOffset, mult, topOffset;
      mult = this.word === 1 ? this.id : this.id - 10;
      leftOffset = (mult * this.sideLength) - (mult * this.xOverlap[this.logo.size]);
      this.homeLeft = this.anchor.left + leftOffset;
      this.initHomeLeft = this.homeLeft;
      topOffset = this.word === 1 ? 0 : this.sideLength - this.yOverlap[this.logo.size];
      this.homeTop = this.anchor.top + topOffset;
      this.initHomeTop = this.homeTop;
      return this.returnHome();
    };

    LogoLetter.prototype.returnHome = function() {
      this.left = this.homeLeft;
      return this.top = this.homeTop;
    };

    LogoLetter.prototype.reset = function() {
      this.left = this.homeLeft = this.initHomeLeft;
      return this.top = this.homeTop = this.initHomeTop;
    };

    LogoLetter.prototype.isVisible = function() {
      return (this.id === 0 || this.id === 10) || this.logo.expanded;
    };

    LogoLetter.prototype.draw = function() {
      if (this.isVisible()) {
        return this.ctx.drawImage(this.logoImgObject, 0, this.ySpriteOffset, this.spriteSideLength, this.spriteSideLength, this.left, this.top, this.sideLength, this.sideLength);
      }
    };

    LogoLetter.prototype.getDistanceFromMouse = function(mouseLeft, mouseTop) {
      var distanceFromMouse;
      distanceFromMouse = {
        left: mouseLeft - this.middle().left,
        top: mouseTop - this.middle().top
      };
      return distanceFromMouse;
    };

    LogoLetter.prototype.moveFromMouse = function(args) {
      var distanceFromMouse, mousemoveEffectDistance, mult, radialDistanceFromMouse;
      distanceFromMouse = args.distanceFromMouse;
      mousemoveEffectDistance = args.mousemoveEffectDistance || this.mousemoveEffectDistance[this.logo.size];
      radialDistanceFromMouse = Math.round(Math.sqrt(Math.pow(distanceFromMouse.left, 2) + Math.pow(distanceFromMouse.top, 2)));
      if (radialDistanceFromMouse <= mousemoveEffectDistance) {
        mult = (mousemoveEffectDistance - radialDistanceFromMouse) / mousemoveEffectDistance;
        this.left = Math.round(this.homeLeft - (distanceFromMouse.left * mult));
        return this.top = Math.round(this.homeTop - (distanceFromMouse.top * mult));
      } else {
        return this.returnHome();
      }
    };

    LogoLetter.prototype.squeeze = function(pinch) {
      var diffX, diffY, middleLeft, middleTop;
      diffX = pinch.center.pageX - this.middle().left;
      diffY = pinch.center.pageY - this.middle().top;
      middleLeft = Math.round(this.middle().left + (diffX * pinch.multiplier()));
      middleTop = Math.round(this.middle().top + (diffY * pinch.multiplier()));
      return this.setFromMiddle(middleLeft, middleTop);
    };

    LogoLetter.prototype.isUnderMouse = function(mouseLeft, mouseTop) {
      var underX, underY;
      underX = mouseLeft > this.left && mouseLeft < (this.left + this.sideLength);
      underY = mouseTop > this.top && mouseTop < (this.top + this.sideLength);
      return underX && underY;
    };

    LogoLetter.prototype.expand = function() {
      this.sideLength = this.sideLength + (this.expansionSize[this.logo.size] * 2);
      this.left = this.left - this.expansionSize[this.logo.size];
      return this.top = this.top - this.expansionSize[this.logo.size];
    };

    LogoLetter.prototype.contract = function() {
      this.left = this.left + this.expansionSize[this.logo.size];
      this.top = this.top + this.expansionSize[this.logo.size];
      return this.sideLength = this.sideLength - (this.expansionSize[this.logo.size] * 2);
    };

    LogoLetter.prototype.stickToTouch = function(mouseLeft, mouseTop) {
      this.left = mouseLeft + this.holdOffset.left;
      return this.top = mouseTop + this.holdOffset.top;
    };

    LogoLetter.prototype.savePos = function() {
      this.homeLeft = this.left;
      return this.homeTop = this.top;
    };

    return LogoLetter;

  })();

}).call(this);
