$(function(){
  $(window).scroll(function(){
    setNavAlpha(this);
    scrollSpy(this);
  });

  //Make nav links scroll so the whole section is visible (include header height)
  $('.inline-link').click(function(e){
    var scrollTo = $($(this).attr('href')).position().top - $('#header .navbar').height();
    $("html, body").animate({ scrollTop: scrollTo }, 600);
    e.preventDefault();
  });

  //Work slider
  $('#work .left-arrow').click(function(){
    slideWork(true);
  });
  $('#work .right-arrow').click(function(){
    slideWork(false);
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

function slideWork(isSlideLeft){

}


function slideTeam(isSlideLeft){
    var memberWidth = $('#team .member').outerWidth(true);
    var currentPosition = -$('#team .team-container').position().left / memberWidth;

    //TODO on resize, hide arrows, resize container

    if(isSlideLeft)
      slideTeamTo(currentPosition - 1);
    else
      slideTeamTo(currentPosition + 1);

}

function slideTeamTo(slideTo){
    var memberWidth = $('#team .member').outerWidth(true);
    var thumbWidth = $('#team .thumbs img').outerWidth(true);
    var membersPerPage = $('#team .visible-container').width() / memberWidth;
    var maxPosition = $('#team .member').length - membersPerPage;
    var currentPosition = -$('#team .team-container').position().left / memberWidth;

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

    if(slideTo != currentPosition){
      $('#team .team-container').animate({left: -slideTo * memberWidth}, speed);
      $('#team .positioner .selector').animate({left: (slideTo * thumbWidth + 2.5)}, speed);
    }
}

function setNavAlpha(w){
    var navAlpha = 0.8 - 0.3 * (180 - $(w).scrollTop()) / 180;
    navAlpha = navAlpha > 0.8 ? 0.8 : navAlpha;
    $('#header .navbar-inner').css('background-color', 'rgba(228,25,16,' + navAlpha + ')');
}

//Assumes nav links are in order of content on page
function scrollSpy(w){
  var halfwayPoint = $(this).scrollTop() + $(window).height() / 2;
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
  $(a).closest('li').addClass('active');
  $('#footer .navbar ul.nav > li > a[href="' + $(a).attr('href') + '"]').closest('li').addClass('active');
}
