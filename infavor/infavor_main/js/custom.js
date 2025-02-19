
$(document).ready(function(){
	
	//창 닫히기
	$("body").mousedown(function(){
		var src = $("#category_btn img").attr("src");
		
		$( "#categoryList" ).hide();
		$("#category_btn img").attr("src",src.replace("_on.gif", "_off.gif"));
		$(".category_area .btn").removeClass("on");
		
		
		var src2 = $("#plusBtn").attr("src");
		
		$( "#plusListComponent" ).hide();
		$("#plusBtn").attr("src",src2.replace("_on.gif", "_off.gif"));
		
		
		$(".info .favorItemList").css("display","none");
	});
	
	//login popup
	$("#hearder_right .btn_login").click(function(){
		$("#popupFullScreen0").show();
		$("html").css("overflow","hidden");	//스크롤 없애기
	});
	
	$("#popupFullScreen0 .btn_close").click(function(){
		$(this).parent().parent().hide();
		$("html").css("overflow","visible");
	});
	
	
	// category 
	var flag = 0;
	var flag2 = 0;
	
	
	$("#category_btn").click(function(){
		var src = $("#category_btn img").attr("src");
		
		
		if (flag == 0) {
			$( "#categoryList" ).show();
			$(".category_area .btn").addClass("on");
			$("#category_btn img").attr("src",src.replace("_off.gif","_on.gif"));
			$( "#categoryList" ).css("top","60px");
			$( "#categoryList" ).animate({
		 		top:"40px"
		  	}, 300 );
			flag = 1;
		} else {
			$( "#categoryList" ).hide();
			$(".category_area .btn").removeClass("on");
			$("#category_btn img").attr("src",src.replace("_on.gif", "_off.gif"));
			flag = 0;
		}
		
	});
	
	
	$("#plusBtn").click(function(){
		var src = $("#plusBtn").attr("src");
		
		
		if (flag2 == 0) {
			$( "#plusListComponent" ).show();
			$("#plusBtn").attr("src",src.replace("_off.gif","_on.gif"));
			$( "#plusListComponent" ).css("top","60px");
			$( "#plusListComponent" ).animate({
		 		top:"40px"
		  	}, 300 );
			flag2 = 1;
		} else {
			$( "#plusListComponent" ).hide();
			$("#plusBtn").attr("src",src.replace("_on.gif", "_off.gif"));
			flag2 = 0;
		}
		
	});
			
	//contents
	//화살표
	$(".main_contents_faver_item").hover(function(){
		$(this).children(".info").find(".favorItemBtn").css("display","block");
		
	}, function(){
		$(this).children(".info").find(".favorItemBtn").css("display","none");
	});
	
	//퍼가기 신고하기
	$(".info .favorItemBtn").click(function(){
		var src = $(this).attr("src");
		$(this).attr("src",src.replace("_off.gif","_on.gif"))
		.parent().next().css("display","block")
		.css("top","35px")
		.animate({
		 	top:"25px"
		}, 300 );
	});
	
	//텍스트
	$(".textinput").click(function(){
		$(this).addClass("on")
		.parent().parent().next(".writebtn").css("display","block");
		
	});
	
	//취소
	$(".btns .btn_white_21").click(function(){
		
		$(this).parent().css("display","none")
		.prev().children().eq(1).children(".textinput").removeClass("on");
		
	});
	//댓글남기기 - 로그인창 띄우기
	$(".btns .btn_blue_21").click(function(){
		
		$("#popupFullScreen0").show();
		$("html").css("overflow","hidden");	
	});
	
	
	
	
	// rolling banner

	var index;
	var length = $("#mainMoveConRight li").length;
	var width = parseInt($("#mainMoveConRight li").css("width"));
			
	var autoBannerPlay = setInterval(autoBanner,2000);
	
	function autoBanner(){
		
		
		$("#mainMoveConRight").animate({"left":-width},500,function(){
			
			
			var copy = $("#mainMoveConRight li").eq(0).clone();
			copy.appendTo("#mainMoveConRight");
			$("#mainMoveConRight li").eq(0).remove();
			$("#mainMoveConRight").css("left",0);
			
			
			index = $("#mainMoveConRight li").eq(0).children("a").attr("class").substr(15, 1) ;
			
			
			$("#txtCon span").text(index);
		});
		
	}
	
	$("#leftBtn").click(function(){
		clearInterval(autoBannerPlay); //중복 방지
		
		$("#mainMoveConRight").animate({"left":-width},500,function(){
			
			
			var copy = $("#mainMoveConRight li").eq(0).clone();
			copy.appendTo("#mainMoveConRight");
			$("#mainMoveConRight li").eq(0).remove();
			$("#mainMoveConRight").css("left",0);
			
			
			index = $("#mainMoveConRight li").eq(0).children("a").attr("class").substr(15, 1) ;
			
			
			$("#txtCon span").text(index);
		});
		
		autoBannerPlay = setInterval(autoBanner,2000);
		
	});
	
	$("#rightBtn").click(function(){
		clearInterval(autoBannerPlay);
		
		
		var copy = $("#mainMoveConRight li").last().clone();
		copy.prependTo("#mainMoveConRight");
		$("#mainMoveConRight").css("left",-width);
		$("#mainMoveConRight li").last().remove();
			
		$("#mainMoveConRight").animate({"left":0},500,function(){
			
			
			index = $("#mainMoveConRight li").eq(0).children("a").attr("class").substr(15, 1) ;
			
			$("#txtCon span").text(index);
		});
		
		autoBannerPlay = setInterval(autoBanner,2000);
	});
	
	
	
	$("#gallery_slider").mouseover(function(){
		clearInterval(autoBannerPlay);
	});
	$("#gallery_slider").mouseout(function(){
		clearInterval(autoBannerPlay);
			
		autoBannerPlay = setInterval(autoBanner,2000);
		
	});
	
	
	
	// 인기페이버
	$(".pop_favor li").mouseover(function(){
		$(this).children(".toggle").css("display","block");
	});
	$(".pop_favor li").mouseout(function(){
		$(this).children(".toggle").css("display","none");
	});
	
	//인기 피플
	$(".pop_people li .picture").mouseover(function(){
		$(this).parent().next(".toggle").css("display","inline");
	});
	$(".pop_people li .picture").mouseout(function(){
		$(this).parent().next(".toggle").css("display","none");
	});
	
	
});
