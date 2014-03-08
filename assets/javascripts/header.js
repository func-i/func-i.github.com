(function() {
  $(function() {
    var $body, $nav, menuActivated;
    $body = $('#body');
    $nav = $('.touch header nav');
    if ($nav.length !== 0) {
      menuActivated = false;
      $nav.find('a.has-menu').click(function(ev) {
        var $clickedA, $clickedLi, $otherAs, $otherLis;
        ev.stopPropagation();
        $clickedA = $(this);
        $clickedLi = $clickedA.closest('li');
        $otherLis = $clickedLi.siblings();
        $otherAs = $otherLis.find('>a');
        if (!$clickedA.hasClass('navigable')) {
          ev.preventDefault();
          $clickedLi.addClass('menu-activated');
          $clickedA.addClass('navigable');
          $otherLis.removeClass('menu-activated');
          $otherAs.removeClass('navigable');
        }
        return menuActivated = true;
      });
      return $('.touch #body').click(function(ev) {
        if (!$(this).closest('.sub-menu').length) {
          if (menuActivated) {
            $nav.find('li.menu-activated').removeClass('menu-activated');
            return $nav.find('a.navigable').removeClass('navigable');
          }
        }
      });
    }
  });

}).call(this);
