function Circle(x, y) {
  this.x = x;
  this.y = y;
  this.isAudioSource = (this.x === audioXCoor && this.y === audioYCoor);

  if(this.isAudioSource){
    this.outerCircleColor = COLORS[1];
    this.innerCircleColor = COLORS[1];

    this.drawSource();
    this.startBroadcast(1, 0.7);

    var that = this;
    this.svgSet.hover(function(){
       that.svgSet.forEach(function (el) {
        if(el == that.outerCircle)
          el.hide();
        else if(el.attr('stroke') != 'none')
          el.show().stop().animate({r: el.attr('r') + 10, 'stroke': COLORS[1]}, COLOR_TIME);
        else
          el.show().stop().animate({'fill': COLORS[1]}, COLOR_TIME);
      });

      that.startBroadcast(3, 1);
    },
    function(){
       that.svgSet.forEach(function (el) {
        if(el == that.outerCircle){
          el.show();
          return;
        }
        else if(el == that.innerCircle)
          el.show();
        else
          el.hide();

        if(el.attr('stroke') != 'none')
          el.stop().animate({r: el.attr('r') - 10, 'stroke': '#E0DCDC'}, COLOR_TIME);
        else
          el.stop().animate({'fill': '#E0DCDC'}, COLOR_TIME);
      });

      that.startBroadcast(1, 0.7);
    });
  }
  else{
    this.innerCircleRadius = (MAX_INNER_CIRCLE_RADIUS - MIN_INNER_CIRCLE_RADIUS) * Math.random() + MIN_INNER_CIRCLE_RADIUS;

    this.drawCircle();
    this.setupOnHover();
    this.setupOnClick();

    this.outerCircleColor = COLORS[Math.floor(COLORS.length  * Math.random())];
    this.innerCircleColor = COLORS[Math.floor(COLORS.length  * Math.random())];
  }

};

Circle.prototype.setupOnClick = function(){
    var that = this;
    this.svgSet.click(function(){
      that.clickOn = true;
      that.pushNeighbours(BOX_WIDTH + OUTER_CIRCLE_RADIUS);
      that.startBroadcast();
    });
};

Circle.prototype.setupOnHover = function(){
    var that = this;
    that.svgSet.hover(function() {
      that.outerCircle.stop().animate({r: MAX_GROWTH_RADIUS}, GROWTH_TIME, 'easeIn');
      that.innerCircle.stop().animate({r: OUTER_CIRCLE_RADIUS}, GROWTH_TIME,'easeIn');
      that.colorOn();
    },
    function() {
      that.reset();
      if(that.clickOn) that.resetNeighbours();
    });
};

Circle.prototype.drawCircle = function(){
  this.innerCircle = svgElem.circle(this.x, this.y, this.innerCircleRadius);
  this.innerCircle.attr({
    stroke: "none",
    fill: "E0DCDC"
  });

  this.outerCircle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS);
  this.outerCircle.attr({
    "stroke": "E0DCDC",
    "stroke-width": OUTER_CIRCLE_STROKE_WIDTH
  });

  hoverArea = svgElem.rect(this.x - BOX_WIDTH/2, this.y-BOX_WIDTH/2, BOX_WIDTH, BOX_WIDTH);
  hoverArea.attr({stroke: "none",
          fill:   "#f00",
          "fill-opacity": 0});

  this.svgSet = svgElem.set();
  this.svgSet.push(this.outerCircle, this.innerCircle, hoverArea);
};

Circle.prototype.drawSource = function(){
  this.svgSet = svgElem.set();

  this.innerCircle = svgElem.circle(this.x, this.y, MAX_INNER_CIRCLE_RADIUS*2/3);
  this.innerCircle.attr({stroke: "none", fill: "E0DCDC"});
  this.svgSet.push(this.innerCircle);

  this.outerCircle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS);
  this.outerCircle.attr({"stroke": "E0DCDC", "stroke-width": OUTER_CIRCLE_STROKE_WIDTH});
  this.svgSet.push(this.outerCircle);

  var circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS);
  circle.attr({"stroke": "E0DCDC", "stroke-width": 1});
  this.svgSet.push(circle);

  circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS+3);
  circle.attr({"stroke": "E0DCDC", "stroke-width": 2});
  circle.hide();
  this.svgSet.push(circle);

  circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS+10);
  circle.attr({"stroke": "E0DCDC", "stroke-width": 3, 'opacity': 0.5});
  circle.hide();
  this.svgSet.push(circle);

  circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS+15);
  circle.attr({"stroke": "E0DCDC", "stroke-width": 1, 'opacity': 0.5});
  circle.hide();
  this.svgSet.push(circle);

  circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS+25);
  circle.attr({"stroke": "E0DCDC", "stroke-width": 1, 'opacity': 0.2});
  circle.hide();
  this.svgSet.push(circle);

  hoverArea = svgElem.rect(this.x - BOX_WIDTH/2, this.y-BOX_WIDTH/2, BOX_WIDTH, BOX_WIDTH);
  hoverArea.attr({stroke: "none", fill:   "#f00", "fill-opacity": 0});
  this.svgSet.push(hoverArea);
};

Circle.prototype.colorOn = function(opacity, delay){
  opacity = opacity || 1;
  delay = delay || 0;

  var outerAnim = Raphael.animation({stroke: this.outerCircleColor, 'opacity': opacity}, COLOR_TIME);
  this.outerCircle.animate(outerAnim.delay(delay));
  var innerAnim = Raphael.animation({fill: this.innerCircleColor, 'opacity': opacity}, COLOR_TIME);
  this.innerCircle.animate(innerAnim.delay(delay));
};

Circle.prototype.colorOff = function(delay){
  delay = delay || 0;

  var outerAnim = Raphael.animation({stroke: '#E0DCDC', 'opacity': 1}, RESET_TIME);
  this.outerCircle.animate(outerAnim.delay(delay));
  var innerAnim = Raphael.animation({fill: "#E0DCDC", 'opacity': 1}, RESET_TIME);
  this.innerCircle.animate(innerAnim.delay(delay));
};

Circle.prototype.pushNeighbours = function(desiredRadius){
  this.callOnNeighbours(1, this.pushed, this, desiredRadius);
};

Circle.prototype.pushed = function(pusher, desiredDistance){
  var xDistance = this.x - pusher.x;
  var yDistance = this.y - pusher.y;

  var newXDistance = desiredDistance * (xDistance == 0 ? 0 : yDistance == 0 ? 1 : 0.70710678119);
  var newYDistance = desiredDistance * (yDistance == 0 ? 0 : xDistance == 0 ? 1 : 0.70710678119);

  var newXCoor = pusher.x + newXDistance * (xDistance == 0 ? 0 : xDistance / Math.abs(xDistance));
  var newYCoor = pusher.y + newYDistance * (yDistance == 0 ? 0 : yDistance / Math.abs(yDistance));

  var anim = Raphael.animation({'cx': newXCoor, 'cy': newYCoor}, BROADCAST_NEIGHBOUR_MOVE_TIME, 'bounce');
  this.svgSet.stop().animate(anim);

  this.colorOn(BROADCAST_NEIGHBOUR_OPACITY);
};

Circle.prototype.resetNeighbours = function(){
    this.callOnNeighbours(3, this.reset);
};

Circle.prototype.reset = function(){
  this.outerCircle.stop().animate({r: OUTER_CIRCLE_RADIUS}, RESET_TIME);
  this.innerCircle.stop().animate({r: this.innerCircleRadius}, RESET_TIME);
  this.colorOff();

  this.svgSet.animate({
    cx: this.x,
    cy: this.y
  }, RESET_TIME);

  this.stopBroadcast();
};

Circle.prototype.startBroadcast = function(numberOfNeighbours, opacity){
  numberOfNeighbours = numberOfNeighbours || MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS;
  opacity = opacity || 1;

  var that = this;
  that.stopBroadcast();
  that.sendBroadcast(numberOfNeighbours, opacity);
  that.broadcastTimer = setInterval(function(){that.sendBroadcast(numberOfNeighbours, opacity)}, BROADCAST_FREQUENCY);
};

Circle.prototype.stopBroadcast = function(){
  clearInterval(this.broadcastTimer);
};

Circle.prototype.sendBroadcast = function(numberOfNeighbours, opacity){
  numberOfNeighbours = numberOfNeighbours || MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS;
  opacity = opacity || 1;

  var broadcastCircle = svgElem.circle(this.outerCircle.attr('cx'), this.outerCircle.attr('cy'), this.outerCircle.attr('r'));
  broadcastCircle.attr({
    "stroke": this.outerCircle.attr('stroke'),
    "stroke-width": BROADCAST_STROKE_WIDTH,
    'opacity': opacity
  });

  broadcastCircle.animate({
    r: numberOfNeighbours * BOX_WIDTH,
    opacity: 0
  }, BROADCAST_TIME, function(){
    this.remove();
  });

  this.callOnNeighbours(2, this.setDelayedAnimationFromBroadcast, this);
};


Circle.prototype.setDelayedAnimationFromBroadcast = function(broadcastSender){
  //Precompute broadcast effect on neighbours
  //using linear easing, broadcast wave radius at time t =>
  //r(t) = (MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS * BOX_WIDTH - broadcastSender.outerCircle.attr('r")) * t / BROADCAST_TIME + broadcastSender.outerCircle.attr('r")
  //solving for t, given a radius R=>
  //t = (R - broadcastSender.outerCircle.attr('r")) * BROADCAST_TIME / (MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS * BOX_WIDTH - broadcastSender.outerCircle.attr('r"))
  var maxDistance = MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS * BOX_WIDTH;
  var distanceFromSender =  Math.sqrt((this.x - broadcastSender.x)*(this.x - broadcastSender.x) + (this.y - broadcastSender.y)*(this.y - broadcastSender.y));
  var timeUntilWaveArrives = (distanceFromSender - broadcastSender.outerCircle.attr('r'))*BROADCAST_TIME / (maxDistance - broadcastSender.outerCircle.attr('r'));

  //var anim = Raphael.animation({cx: this.outerCircle.attr('cx'), cy: this.outerCircle.attr('cy')}, 1000, 'bounce');
  //this.svgSet.animate(anim.delay(timeUntilWaveArrives));
  var opacity = (maxDistance - distanceFromSender)/maxDistance;
  //this.colorOn(opacity, timeUntilWaveArrives);
 // this.vibrateOn(timeUntilWaveArrives);
  //this.colorOff(timeUntilWaveArrives+200);
};

Circle.prototype.callOnNeighbours = function(maxDegreesOfSeperation, functionToCall){
  maxDegreesOfSeperation = maxDegreesOfSeperation || 1

  var args = [];
  for(var i = 2; i < arguments.length; i++)
  {
    args.push(arguments[i]);
  }

  var xIndex = this.x/BOX_WIDTH - 0.5;
  var yIndex = this.y/BOX_WIDTH - 0.5;

  //STARTING TOP LEFT CORNER OF NEIGHBOURS, LOOP THROUGH EACH LEVEL
  for(var xLevel = -maxDegreesOfSeperation; xLevel <= maxDegreesOfSeperation; xLevel++){
    if(xIndex + xLevel < 0 || xIndex + xLevel > circleMatrix.length - 1 || typeof circleMatrix[xIndex + xLevel] == 'undefined') continue;

    for(var yLevel = -maxDegreesOfSeperation; yLevel <= maxDegreesOfSeperation; yLevel++){
      if(yIndex + yLevel < 0 || yIndex + yLevel > circleMatrix[xIndex + xLevel].length - 1) continue;

      if(xLevel == 0 && yLevel == 0) continue;

      functionToCall.apply(circleMatrix[xIndex + xLevel][yIndex + yLevel], args);
    }
  }
};

Circle.prototype.vibrateOn = function(delay){
  delay = delay || 0;

  var that = this;
  this.vibrateAnimation = Raphael.animation(
    {
      cx: this.outerCircle.attr('cx') + 5,
      cy: this.outerCircle.attr('cy') + 5
    },
    200, 'linear',
    function(){
      that.svgSet.animate(
        {
          cx: that.outerCircle.attr('cx') - 5,
          cy: that.outerCircle.attr('cy') - 5
        },
        200, 'linear',
        function(){
          that.vibrateOn();
        }
      )
    }
  );
  this.svgSet.stop().animate(this.vibrateAnimation.delay(delay));

};

Circle.prototype.vibrateOff = function(delay){
  delay = delay || 0;

  this.svgSet.stop(this.vibrateAnimation);
};
