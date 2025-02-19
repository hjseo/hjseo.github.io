
var windowHeight = null;
var headerHeight = null;
var contentHeight = null;
	
function init(){
	windowHeight = $( window ).height();
	headerHeight = $("#header").outerHeight();
	contentHeight =  $("#content").outerHeight();

	//height 100%로 하여 background-color채우기
	if( contentHeight + headerHeight > windowHeight ){
		$('#nav').css('min-height', contentHeight +'px');
		$('.content_box').css('min-height', contentHeight +'px');
	}else{
		$('#nav').css('min-height', ( windowHeight - headerHeight )+'px');
		$('.content_box').css('min-height', ( windowHeight - headerHeight )+'px');
	}

	

}

$("document").ready(function(){

	init();

	$( window ).resize(function() {
		init();
	});
	
	$("#nav ul li").removeClass("on");

});