$(function(){
  $(window).scroll(function(){
    var navAlpha = 1 - 0.3 * (180 - $(this).scrollTop()) / 180;
    navAlpha = navAlpha > 1 ? 1 : navAlpha;
    $('#header .navbar-inner').css('background-color', 'rgba(232, 32, 22,' + navAlpha + ')');
  });
});
