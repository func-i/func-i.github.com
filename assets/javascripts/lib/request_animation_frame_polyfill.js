(function() {
  (function() {
    var i, lastTime, vendors;
    lastTime = 0;
    vendors = ["ms", "moz", "webkit", "o"];
    i = 0;
    while (i < vendors.length && !window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vendors[i] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
      ++i;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout(function() {
          return callback(currTime + timeToCall);
        });
        timeToCall;
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      return window.cancelAnimationFrame = function(id) {
        return clearTimeout(id);
      };
    }
  })();

}).call(this);
