(function() {
  var $body, $loading, $logo, $logoAnchor, $noTouchIcons, $noTouchLogo, $touchLogo, anchorHtml, currentHold, currentPinch, fadeIn, holding, imgFullHtml, imgFullSrc, imgSmallHtml, imgSmallSrc, logoCanvas, logoContext, onHome, pinchStarted;

  window.canvases = [];

  window.logo = {};

  this.blendingSupported = Modernizr.canvasblending;

  onHome = function() {
    return window.location.pathname === "/";
  };

  $loading = $('#loading');

  $body = $('#body');

  fadeIn = function() {
    $loading.css('opacity', '0');
    $body.css('opacity', '1');
    return $loading.remove();
  };

  $(window).load(function() {
    return ResizeHelper.handleResize();
  });

  if (blendingSupported) {
    logoCanvas = new LogoCanvas({
      elem: $('#logo-canvas')
    });
    logoContext = new Context(logoCanvas);
    window.logo = new Logo({
      elem: $('#logo'),
      canvas: logoCanvas,
      context: logoContext,
      screenWidth: $(window).width()
    });
    if (onHome() && Modernizr.touch) {
      LogoHelper.startAnimation(logo);
      logo.popLetters();
      logo.isPoppin = true;
    }
  } else {
    $logo = $('#logo');
    anchorHtml = "<a href='http://functionalimperative.com' alt='Functional Imperative'></a>";
    $logo.append(anchorHtml);
    $logoAnchor = $logo.find('a');
    imgFullSrc = $logo.data('imgFull');
    imgFullHtml = "<img class='full' src='" + imgFullSrc + "' alt='Functional Imperative' />";
    $logoAnchor.append(imgFullHtml);
    imgSmallSrc = $logo.data('imgSmall');
    imgSmallHtml = "<img class='small' src='" + imgSmallSrc + "' alt='Functional Imperative' />";
    $logoAnchor.append(imgSmallHtml);
    $('#logo-canvas').remove();
  }

  fadeIn();

  $('.square').each(function() {
    var $square, roundedWidth;
    $square = $(this);
    $square.css('width', '');
    roundedWidth = Math.round($square.outerWidth());
    $square.css('width', roundedWidth);
    return $square.css('height', roundedWidth);
  });

  $('.canvas').each(function(index) {
    var canvas, context, square, _i, _len, _ref, _results;
    canvas = new Canvas({
      referenceElem: $(this)
    });
    context = new Context(canvas);
    canvas.context = context;
    window.canvases.push(canvas);
    $('.square', this).each(function(index) {
      var square;
      return square = new Square({
        elem: $(this),
        canvas: canvas,
        context: context,
        id: index
      });
    });
    canvas.adjustSquarePositions();
    _ref = canvas.squares;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      square = _ref[_i];
      _results.push(square.draw());
    }
    return _results;
  });

  $noTouchIcons = $('.no-touch .square.icon');

  if ($noTouchIcons.length !== 0) {
    $noTouchIcons.mouseover(function() {
      var square;
      square = SquareHelper.findSquare($(this));
      square.context.clear(square.left, square.top, square.sideLength, square.sideLength);
      return square.strokeRect("green");
    });
    $noTouchIcons.mouseout(function() {
      var square, _i, _len, _ref, _results;
      square = SquareHelper.findSquare($(this));
      square.context.clear(0, 0, square.canvas.width, square.canvas.height);
      _ref = square.canvas.squares;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        square = _ref[_i];
        _results.push(square.draw());
      }
      return _results;
    });
  }

  $noTouchLogo = $('.no-touch.canvasblending #logo');

  if ($noTouchLogo.length !== 0) {
    $noTouchLogo.mouseover(function() {
      return LogoHelper.noTouch.mouseover(logo);
    });
    $noTouchLogo.mouseout(function() {
      return LogoHelper.noTouch.mouseout(logo);
    });
    $noTouchLogo.mousemove(function(ev) {
      return LogoHelper.noTouch.mousemove(logo, ev);
    });
    $noTouchLogo.mousedown(function(ev) {
      return LogoHelper.noTouch.mousedown({
        logo: window.logo,
        ev: ev,
        onHome: onHome()
      });
    });
  }

  $touchLogo = $('.touch.canvasblending #logo');

  if ($touchLogo.length !== 0) {
    $touchLogo.hammer().on('touch', function(ev) {
      var mouseX, mouseY;
      if (logo.isPoppin) {
        LogoHelper.reset(logo);
        logo.isPoppin = false;
      }
      mouseX = ev.gesture.touches[0].pageX;
      mouseY = ev.gesture.touches[0].pageY;
      if (window.logo.isUnderMouse(mouseX, mouseY)) {
        ev.gesture.preventDefault();
      }
      return LogoHelper.startAnimation(window.logo);
    });
    $touchLogo.hammer().on('tap', function(ev) {
      LogoHelper.touch.tap({
        logo: window.logo,
        ev: ev,
        onHome: onHome()
      });
      return ev.gesture.stopDetect();
    });
    holding = false;
    currentHold = void 0;
    $('.touch #logo').hammer({
      hold_timeout: 300
    }).on('hold', function(ev) {
      if (!logo.tooDamnSmall()) {
        currentHold = new Hold({
          logo: window.logo,
          mouseX: ev.gesture.touches[0].pageX,
          mouseY: ev.gesture.touches[0].pageY
        });
        return window.logo.holding = true;
      }
    });
    $touchLogo.hammer().on('drag', function(ev) {
      if (!logo.tooDamnSmall()) {
        return LogoHelper.touch.drag({
          logo: window.logo,
          ev: ev,
          hold: currentHold
        });
      }
    });
    pinchStarted = false;
    currentPinch = void 0;
    $touchLogo.hammer().on('release', function(ev) {
      window.logo.holding = false;
      if (currentHold !== void 0) {
        currentHold.end();
      }
      currentHold = void 0;
      window.logo.returnHome();
      setTimeout(function() {
        return stopAnimations();
      }, 200);
      return pinchStarted = false;
    });
  }

  $(window).resize(function() {
    return ResizeHelper.handleResize();
  });

  $(window).bind('orientationchange', function() {
    var orientation;
    orientation = window.orientation;
    if (orientation !== ResizeHelper.windowOrientation) {
      ResizeHelper.handleResize();
      return ResizeHelper.windowOrientation = orientation;
    }
  });

}).call(this);
