var timer;
var width = $(window).width();
function startTimer(){
	if( timer != null ) clearTimeout(timer);
	timer = setTimeout( function(){
		show();
	}, 250)
}

function show(){
	$( "#topWrap" ).slideDown("fast");
	
	if( $( window ).scrollTop() == 0 ){
		
		if( width <= 370 ){
			$( "#subContainer" ).animate({
				paddingTop: "231px"
			}, "fast" );
		}else if(  width >= 371 && width <= 750 ){
			$( "#subContainer" ).animate({
				paddingTop: "211px"
			}, "fast" );
		}else if( width >= 751 && width <= 999 ){
			$( "#subContainer" ).animate({
				paddingTop: "178px"
			}, "fast" );
		}else{
			$( "#subContainer" ).animate({
				paddingTop: "178px"
			}, "fast" );
		}
		
		$( "#subContainer2" ).animate({
			paddingTop: "178px"
		}, "fast" );
		
		
	}
}

function hide(){
	$( "#topWrap" ).slideUp("fast");
	
	$( "#subContainer" ).animate({
		paddingTop: "70px",
	}, "fast" );
	$( "#subContainer2" ).animate({
		paddingTop: "70px",
	}, "fast" );
	
}

function openSitemap(){
	$(".sitemap").slideDown();
}
function closeSitemap(){
	$(".sitemap").slideUp();	
}

//window.scrollTo(0, 1);//주소창 올림
$("document").ready(function(){

	$("#footer .right .site").click(function(){
		$(".sitemap").slideToggle();
	});


	$(".tabStyle").children().click(function(){
		
		$(this).parent().parent().children().removeClass("on");
		$(this).parent().addClass("on");

		
		var tarId = $(this).attr("tarId");
		$(this).parent().parent().parent().children(".tab_box").css("display","none");
		$("#"+tarId).css("display","table");

	});

	$("#inquireWrap .tabStyle").children().click(function(){
		
		for(var i=0; i<2; i++){
			src = $("#inquireWrap .tabStyle h4").eq(i).css('background-image');
			$("#inquireWrap .tabStyle h4").eq(i).css("background-image", src.replace("_on","_off"));
			
		}
		var src = $(this).css('background-image');
		$(this).css("background-image", src.replace("_off","_on"));

	});

	//if( $(window).width() < 1000 ){
		//$("#menuIcon").append($(window).width());
	//}
	
	/*$(window).scroll(function(){
		var t = window.pageYOffset || document.documentElement.scrollTop;
		$("#headerWrap").css('top', t + 'px' )
	})*/
	
	
	/*var Cheight = $(window).height();
	 
	$("#menuIcon").click(function() {
		
		if( $("#menuBox").css("display") == "none" ) {
			$(this).children().attr("src","/images/btn_close.gif");
			$("#menuBox").css({"height":Cheight});
			$("body").css({overflow:'hidden'}).bind('touchmove', function(e){e.preventDefault()});
		}else{
			$(this).children().attr("src","/images/menu.jpg");
			$("body").css({overflow:'auto'}).unbind('touchmove');
		} 
		
		$("#menuBox").fadeToggle();
		
	});*/
	  
	
	$("#menuBox ul").find("li").children().click(function(){

		$(this).parent().addClass("on");
		
		if( $("#menuIcon").css("display") == "block" ){
			
			$("#menuBox").css("display","none");
			$("body").css({overflow:'auto'}).unbind('touchmove');
		}
		
	});
	
	
	
	
});