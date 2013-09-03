$(function(){
  scrollSpy();
  setNavAlpha();
  checkTeamOnResize();
  checkWorkOnResize();
  //getTweets();

  $(window).bind("touchmove", function(event) {
    scrolling(window.scrollY);
  });
  $(window).scroll(function(){
    scrolling($(window).scrollTop());
  });
  scrolling($(window).scrollTop());

  $(window).resize(function(){
    checkTeamOnResize();
    checkWorkOnResize();
  });

  //Make nav links scroll so the whole section is visible (include header height)
  $('.inline-link').click(function(e){
    if(!/Mobile/.test(navigator.userAgent)){
      var scrollTo = $($(this).attr('href')).position().top - $('#header .navbar').height();
      $("html, body").animate({ scrollTop: scrollTo }, 600);
      e.preventDefault();
    }
  });

/*  $("#tweet_box").mouseenter(function(){
    stopTweetAnimation();
  });
  $("#tweet_box").mouseleave(function(){
    animateTweets();
  });*/

  //Manifesto link
  $('#mission_text h4').click(function(){
    $('#mission').addClass('manifesto');
    $('#mission_text').addClass('manifesto');
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
  $('#team .team-container .member img').mouseenter(function(){
    $('#team .team-container .member').addClass('fade');
    $(this).parent().addClass('open');
  });
  $('#team .team-container .member').mouseleave(function(){
    $('#team .team-container .member').removeClass('fade');
    $(this).removeClass('open');
  });
});

function scrolling(scrollTop){
    setNavAlpha(scrollTop);
    setHeroAlpha(scrollTop);
    setMissionHighlight(scrollTop);
    scrollScientist(scrollTop);
    scrollSpy(scrollTop);
}

function slideWork(isSlideLeft){
  var currentPosition = $('#work .screenshots .positioner').data('currentposition') || 0;

  if(isSlideLeft)
    slideWorkTo(currentPosition + 1, isSlideLeft);
  else
    slideWorkTo(currentPosition - 1, isSlideLeft);

}

function slideWorkTo(slideTo, isSlideLeft){
  var imageWidth = $('#work .screenshots .positioner img').outerWidth(true) / 2;
  var maxPosition = $('#work .screenshots .positioner img').length - 1;

  //Rollover
  if(slideTo < 0)
    slideTo = maxPosition;
  else if(slideTo > maxPosition)
    slideTo = 0;

  $('#work .screenshots .positioner').data('currentposition', slideTo);

  var slideLeftAmount = slideTo * imageWidth * 2;

  if(Modernizr.csstransitions){
    var translateString = 'translateX(' + -slideLeftAmount + 'px)';
    var transitionString = 'transform 1s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
    $('#work .screenshots .positioner').css({
      '-webkit-transform': translateString,
      '-moz-transform': translateString,
      '-o-transform': translateString,
      'transform': translateString,
      '-webkit-transition': '-webkit-' + transitionString,
      '-moz-transition': '-moz-' + transitionString,
      '-o-transition': '-o-' + transitionString,
      'transition': transitionString
    });

    $('#work .work-text:visible').removeClass('selected');
    $($('#work .work-text').get(slideTo)).addClass('selected');
  }
  else{
    $('#work .screenshots .positioner').animate({
      left: -slideLeftAmount
    }, 1000, 'easeOutCubic');

    $('#work .work-text:visible').hide();
    $($('#work .work-text').get(slideTo)).fadeIn(900);
  }


}

function checkWorkOnResize(){
  var imageWidth = $('#work .screenshots .positioner img').outerWidth(true) / 2;
  var currentPosition = $('#work .screenshots .positioner').data('currentposition') || 0;

  var slideLeftAmount = currentPosition * imageWidth * 2;

  if(Modernizr.csstransitions){
    var translateString = 'translateX(' + -slideLeftAmount + 'px)';
    var transitionString = 'transform 0s linear';
    $('#work .screenshots .positioner').css({
      '-webkit-transform': translateString,
      '-moz-transform': translateString,
      '-o-transform': translateString,
      'transform': translateString,
      '-webkit-transition': '-webkit-' + transitionString,
      '-moz-transition': '-moz-' + transitionString,
      '-o-transition': '-o-' + transitionString,
      'transition': transitionString
    });
  }
  else{
    $('#work .screenshots .positioner').css({
      left: -slideLeftAmount
    });
  }
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

  if(Modernizr.csstransitions){
    var translateString = 'translateX(' + -slideTo * memberWidth + 'px)';
    var transitionString = 'all ' + speed + 'ms linear';
    $('#team .team-container').css({
      '-webkit-transform': translateString,
      '-moz-transform': translateString,
      '-o-transform': translateString,
      'transform': translateString,
      '-webkit-transition': transitionString,
      '-moz-transition': transitionString,
      '-o-transition': transitionString,
      'transition': transitionString
    });
    translateString = 'translateX(' + (slideTo * thumbWidth + 2.5) + 'px)';
    $('#team .positioner .selector').css({
      '-webkit-transform': translateString,
      '-moz-transform': translateString,
      '-o-transform': translateString,
      'transform': translateString,
      '-webkit-transition': transitionString,
      '-moz-transition': transitionString,
      '-o-transition': transitionString,
      'transition': transitionString
    });
  }
  else{
    $('#team .team-container').stop().animate({left: -slideTo * memberWidth}, speed);
    $('#team .positioner .selector').stop().animate({left: (slideTo * thumbWidth + 2.5)}, speed);
  }
}

function setNavAlpha(scrollTop){
    var navAlpha = 0.9 - 0.6 * (700 - scrollTop) / 700;
    navAlpha = navAlpha > 0.9 ? 0.9 : navAlpha;
    $('#header .navbar-inner').css('background-color', 'rgba(228,25,16,' + navAlpha + ')');
}

function setHeroAlpha(scrollTop){
  var alpha = (300 - scrollTop)/300;
  if(alpha <= 0)
    $('#splash_text .container').hide();
  else{
    $('#splash_text .container').fadeTo(0, alpha);
    $('#splash_text .container').show();
  }
}

function setMissionHighlight(scrollTop){
  if(scrollTop < 200)
    return;

  var missionBlockSize = (650 - 200)/$('#mission_text p span').length;
  var index = Math.floor((scrollTop - 200)/missionBlockSize);

  var $currentElem = $($('#mission_text p span').get(index));
  if(!$currentElem.hasClass('active')){
    $('#mission_text p span').removeClass('active');
    $currentElem.addClass('active');
  }

/*  if($currentElem.length == 0){
    $('#mission_text h4').show();
  }
  else{
    $('#mission_text h4').hide();
  }*/

}

function scrollScientist(scrollTop){
  if($(window).width() > 480){
    if(scrollTop > 584){
      if($('#scientist').css('position') != 'absolute'){
        $('#scientist').css({
          'position': 'absolute',
          'top': 604,
          'right': ''
        });
      }
    }
    else if($('#scientist').css('position') != 'fixed'){
      $('#scientist').css({
        'position': 'fixed',
        'top': 20,
        'right':''
      });
    }
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
  var href = $(a).attr('href');
  var header = $('#header .navbar ul.nav > li > a[href="' + href + '"]').closest('li');
  var footer = $('#footer .navbar ul.nav > li > a[href="' + href + '"]').closest('li');

  $('.navbar ul.nav > li.active').removeClass('active');
  header.addClass('active');
  footer.addClass('active');
}

function getTweets(){
  $("#tweet_box").tweet(
    {
      username: "func_i",
      count: 10
    }
  );

  animateTweets();

}

function stopTweetAnimation(){
  $("#tweet_box .tweet_list").stop();
}

function animateTweets(){
  if($("#tweet_box .tweet_list").height() <= 0){
    setTimeout(function(){animateTweets()}, 500);
  }
  else{
    var pixelsPerSecond = 18;
    var timeToFinish = ($("#tweet_box .tweet_list").height() + parseInt($("#tweet_box .tweet_list").css('top'),10))/(pixelsPerSecond/1000);

    $("#tweet_box .tweet_list").animate(
      {
        top:-$("#tweet_box .tweet_list").height()
      },
      timeToFinish, 'linear', function(){
        $("#tweet_box .tweet_list").css('top', $('#tweet_box').height());
        animateTweets();
      }
    );
  }
}
