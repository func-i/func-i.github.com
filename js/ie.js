$(function() {

	$("#nav ul li a").click(function(){
		var anchor = $(this).attr('href').replace('#','');
		goToByScroll(anchor);
	});
	
	});