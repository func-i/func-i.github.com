(function() {
  this.LogoHelper = {
    startAnimation: function(logo) {
      var animationId;
      animationId = requestAnimationFrame(function() {
        return animateLogo(logo, logo.canvas, logo.context);
      });
      return animationIds.push(animationId);
    },
    reset: function(logo) {
      stopAnimations();
      return clearInterval(logo.popLettersId);
    },
    noTouch: {
      mouseover: function(logo) {
        if (logo.isPoppin) {
          LogoHelper.reset(logo);
          logo.isPoppin = false;
        }
        return LogoHelper.startAnimation(logo);
      },
      mouseout: function(logo) {
        logo.returnHome();
        return setTimeout(function() {
          return stopAnimations();
        }, 100);
      },
      mousemove: function(logo, ev) {
        var mouseX, mouseY;
        mouseX = ev.pageX;
        mouseY = ev.pageY;
        if (logo.expanded) {
          logo.animate(mouseX, mouseY);
        }
        return logo.changeCursor(mouseX, mouseY);
      },
      mousedown: function(args) {
        var logo, mouseX, mouseY, onHome, wasExpanded;
        logo = args.logo;
        mouseX = args.ev.pageX;
        mouseY = args.ev.pageY;
        onHome = args.onHome;
        if (logo.isUnderMouse(mouseX, mouseY)) {
          wasExpanded = logo.expanded;
          logo.expand();
          logo.explode(mouseX, mouseY);
          return logo.elem.mouseup(function() {
            if (!onHome) {
              window.location.replace("/");
            }
            if (wasExpanded) {
              logo.contract();
            } else {
              logo.expand();
            }
            logo.reset();
            return logo.elem.unbind('mouseup');
          });
        }
      }
    },
    touch: {
      tap: function(args) {
        var logo, mouseX, mouseY, onHome, wasExpanded;
        logo = args.logo;
        mouseX = args.ev.gesture.touches[0].pageX;
        mouseY = args.ev.gesture.touches[0].pageY;
        onHome = args.onHome;
        if (logo.isUnderMouse(mouseX, mouseY)) {
          if (!logo.tooDamnSmall()) {
            wasExpanded = logo.expanded;
            logo.expand();
            logo.explode(mouseX, mouseY);
            return setTimeout(function() {
              if (!onHome) {
                window.location.replace("/");
              }
              if (wasExpanded) {
                logo.contract();
              } else {
                logo.expand();
              }
              return logo.reset();
            }, 100);
          } else {
            return window.location.replace("/");
          }
        }
      },
      drag: function(args) {
        var ev, hold, logo, mouseX, mouseY;
        logo = args.logo;
        ev = args.ev;
        mouseX = args.ev.gesture.touches[0].pageX;
        mouseY = args.ev.gesture.touches[0].pageY;
        hold = args.hold;
        if (logo.holding) {
          logo.dragLetters(hold, mouseX, mouseY);
        } else {
          logo.animate(mouseX, mouseY);
        }
        if (logo.isUnderMouse(mouseX, mouseY)) {
          return ev.gesture.preventDefault();
        }
      }
    }
  };

}).call(this);
