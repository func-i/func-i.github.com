(function() {
  var assignTransitionCss, getPaths, getSvg, getSvgContext;

  getSvgContext = function($icon) {
    var $object, svgDoc;
    $object = $icon.find('object')[0];
    svgDoc = $object.contentDocument;
    return svgDoc.documentElement;
  };

  getPaths = function($svgContext) {
    return $('path, rect, circle, polygon', $svgContext).not("[fill='#027D12']");
  };

  getSvg = function($svgContext) {
    return $('svg', $svgContext);
  };

  assignTransitionCss = function($paths) {
    return $paths.css({
      WebkitTransition: 'fill .5s linear',
      MozTransition: 'fill .5s linear',
      OTransition: 'fill .5s linear',
      transition: 'fill .5s linear'
    });
  };

  if (!Modernizr.touch) {
    $(window).load(function() {
      var $icons, $logos;
      $icons = $('.icon').not('.no-hover').not('.logo');
      $icons.each(function() {
        var $icon, $object, $paths, $svg, $svgContext;
        $icon = $(this);
        $object = $icon.find('object');
        $svgContext = getSvgContext($icon);
        $paths = getPaths($svgContext);
        $svg = getSvg($svgContext);
        assignTransitionCss($paths);
        return $icon.hover(function(ev) {
          $paths.css('fill', BASE_COLORS.darkGray);
          if (!Modernizr.csstransitions) {
            return $icon.css({
              backgroundColor: BASE_COLORS.green
            });
          }
        }, function() {
          $paths.css('fill', '');
          if (!Modernizr.csstransitions) {
            return $icon.css({
              backgroundColor: ""
            });
          }
        });
      });
      $logos = $('#business-logos .logo');
      return $logos.hover(function(ev) {
        if (!Modernizr.csstransitions) {
          return $(this).css({
            backgroundColor: BASE_COLORS.green
          });
        }
      }, function() {
        if (!Modernizr.csstransitions) {
          return $(this).css({
            backgroundColor: ""
          });
        }
      });
    });
  }

}).call(this);
