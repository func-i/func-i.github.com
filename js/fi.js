$(function(){
  scrollSpy();
  setNavAlpha();
  checkTeamOnResize();

  $(window).bind("touchmove", function(event) {
    scrolling(window.scrollY);
  });
  $(window).scroll(function(){
    scrolling($(window).scrollTop());
  });
  scrolling($(window).scrollTop());

  $(window).resize(function(){
    checkTeamOnResize();
  });

  //Make nav links scroll so the whole section is visible (include header height)
  $('.inline-link').click(function(e){
    var scrollTo = $($(this).attr('href')).position().top - $('#header .navbar').height();
    $("html, body").animate({ scrollTop: scrollTo }, 600);
    e.preventDefault();
  });

  //Work slider
  $('#work .left-arrow').click(function(){
    slideWork(false);
  });
  $('#work .right-arrow').click(function(){
    slideWork(true);
  });


  //Team slider
  $('#team .left-arrow').click(function(){
    slideTeam(true);
  });
  $('#team .right-arrow').click(function(){
    slideTeam(false);
  });
  $('#team .thumbs img').click(function(){
    var memberWidth = $('#team .member').outerWidth(true);
    var membersPerPage = $('#team .visible-container').width() / memberWidth;
    var maxPosition = $('#team .member').length - membersPerPage;

    var slideTo = $(this).data('index');

    if(slideTo > maxPosition)
      slideTeamTo(maxPosition);
    else
      slideTeamTo(slideTo);

  });
});

function scrolling(scrollTop){
    setNavAlpha(scrollTop);
    setHeroAlpha(scrollTop);
    scrollScientist(scrollTop);
    scrollSpy(scrollTop);
}

function slideWork(isSlideLeft){
  var imageHeight = $('#work .screenshots .positioner div').outerHeight(true);
  var currentPosition = -$('#work .screenshots .positioner').position().top / imageHeight;

  if(isSlideLeft)
    slideWorkTo(currentPosition - 1, isSlideLeft);
  else
    slideWorkTo(currentPosition + 1, isSlideLeft);

}

function slideWorkTo(slideTo, isSlideLeft){
  var imageHeight = $('#work .screenshots .positioner div').outerHeight(true);
  var imageWidth = $('#work .screenshots .positioner div').outerWidth(true);
  var maxPosition = $('#work .screenshots .positioner div').length - 1;
  var currentPosition = -$('#work .screenshots .positioner').position().top / imageHeight;
  var currentLeft = $('#work .screenshots .positioner').position().left;

  //Rollover
  if(slideTo < 0)
    slideTo = maxPosition;
  else if(slideTo > maxPosition)
    slideTo = 0;

  var firstLeft, secondLeft, firstAnimation, secondAnimation;
  if(isSlideLeft){
    firstLeft = -imageWidth;
    secondLeft = $(window).width();
    firstAnimation = 'easeOutCubic';
    secondAnimation = 'easeOutCubic';
  }
  else{
    firstLeft = $(window).width();
    secondLeft = -imageWidth;
    firstAnimation = 'easeOutCubic';
    secondAnimation = 'easeOutCubic';
  }
  //firstAnimation = secondAnimation = 'linear';//TEMP

  $('#work .screenshots .positioner').animate({
    left: firstLeft
  }, 300, firstAnimation, function(){
    $('#work .screenshots .positioner').css({left: secondLeft});
    $('#work .screenshots .positioner').removeClass('work-0 work-1 work-2 work-3');
    $('#work .screenshots .positioner').addClass('work-' + slideTo);

    $('#work .screenshots .positioner').animate({
      left: currentLeft
    }, 800, secondAnimation, function(){
        $('#work .screenshots .positioner').css('left', '');
    });
  });

  $('#work .work-text:visible').hide();
  $($('#work .work-text').get(slideTo)).fadeIn(900);
}


function slideTeam(isSlideLeft){
  var memberWidth = $('#team .member').outerWidth(true);
  var currentPosition = -$('#team .team-container').position().left / memberWidth;

  if(isSlideLeft)
    slideTeamTo(currentPosition - 1);
  else
    slideTeamTo(currentPosition + 1);

}

function checkTeamOnResize(){
  var memberWidth = $('#team .member').outerWidth(true);
  var membersPerPage = $('#team .visible-container').width() / memberWidth;
  var maxPosition = $('#team .member').length - membersPerPage;
  var currentPosition = -$('#team .team-container').position().left / memberWidth;

  if(currentPosition > maxPosition)
    slideTeamTo(maxPosition);

  if(0 == maxPosition){
    $('#team .left-arrow').hide();
    $('#team .right-arrow').hide();
  }
  else{
    $('#team .left-arrow').show();
    $('#team .right-arrow').show();
  }
}

function slideTeamTo(slideTo){
  var memberWidth = $('#team .member').outerWidth(true);
  var currentPosition = -Math.ceil($('#team .team-container').position().left / memberWidth);

  if(slideTo == currentPosition)
    return;

  var thumbWidth = $('#team .thumbs img').outerWidth(true);
  var membersPerPage = $('#team .visible-container').width() / memberWidth;
  var maxPosition = Math.floor($('#team .member').length - membersPerPage);

  //Rollover
  var speed = 600;
  if(slideTo < 0){
    slideTo = maxPosition;
    speed = 200;
  }
  else if(slideTo > maxPosition){
    slideTo = 0;
    speed = 200;
  }

  $('#team .team-container').stop().animate({left: -slideTo * memberWidth}, speed);
  $('#team .positioner .selector').stop().animate({left: (slideTo * thumbWidth + 2.5)}, speed);
}

function setNavAlpha(scrollTop){
    var navAlpha = 0.9 - 0.6 * (700 - scrollTop) / 700;
    navAlpha = navAlpha > 0.9 ? 0.9 : navAlpha;
    $('#header .navbar-inner').css('background-color', 'rgba(228,25,16,' + navAlpha + ')');
}

function setHeroAlpha(scrollTop){
  var alpha = (300 - scrollTop)/300;
  $('#splash_text .container').fadeTo(0, alpha);
  if(alpha <= 0)
    $('#splash_text .container').hide();
  else
    $('#splash_text .container').show();
}

function scrollScientist(scrollTop){
  if($(window).width() > 480){
    if(scrollTop > 584){
      $('#scientist').css({
        'position': 'absolute',
        'top': 554,
        'right': ''
      });
    }
    else
      $('#scientist').css({
        'position': 'fixed',
        'top': -30,
        'right':''
      });
  }
}

//Assumes nav links are in order of content on page
function scrollSpy(scrollTop){
  var halfwayPoint = scrollTop + $(window).height() / 2;
  var lastLink = null;
  var set = false;

  $.each($('#header .navbar ul.nav > li > a'), function(index, a){
    if($($(a).attr('href')).length > 0)
      if(halfwayPoint < $($(a).attr('href')).position().top){
        setNavToActive(lastLink);
        set = true;
        return false;
      }
      else
        lastLink = a;
  });

  if(!set) setNavToActive(lastLink);
}

function setNavToActive(a){
  $('.navbar ul.nav > li.active').removeClass('active');
  $('#header .navbar ul.nav > li > a[href="' + $(a).attr('href') + '"]').closest('li').addClass('active');
  $('#footer .navbar ul.nav > li > a[href="' + $(a).attr('href') + '"]').closest('li').addClass('active');
}
