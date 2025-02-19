
var uAgent;
var mobilePhones = [];
var isMobile;

var excuteurl_and = '';	    //앱실행 경로
var installurl_and = '';	//앱다운 경로

var excuteurl_ios = '';	    //앱실행 경로
var installurl_ios = '';	//앱다운 경로

var uagentLow = '';

function iosGoApp() {
	if ( !$("#infavorLink").length ) {
		$("body").append("<iframe id='infavorLink'></iframe>");
	}
	$("#infavorLink").hide();
	setTimeout( function() {
		location.replace( installurl_ios );
	}, 1000);
	 
	$("#infavorLink").attr("src",  excuteurl_ios );
};

function andGoApp() {
	if ( !$("#infavorLink").length ) {
		$("body").append("<iframe id='infavorLink'></iframe>");
	}
	$("#infavorLink").hide();
	setTimeout( function() {
	  	location.replace( installurl_and );
	}, 1000);
	$("#infavorLink").attr("src", excuteurl_and );
};

function linkDataSetting(){
	var andLinkData = getLinkData('play.google.com');
	var iosLinkData = getLinkData('itunes.apple.com');
    
	excuteurl_and = andLinkData.excuteurl;
	installurl_and = andLinkData.installurl;
	excuteurl_ios = iosLinkData.excuteurl;
	installurl_ios = iosLinkData.installurl;
};

function getLinkData(type){
	for( var i = 0; i<appLinkArr.length; i++ ){
		if( appLinkArr[i].installurl.indexOf( type ) > -1 ){
			return appLinkArr[i];
		}
	}
};

/* 모바일 검색 영역 */
function mobileUI(){
	$("#searchArea").on("focusin", function(){
		$("#ymHeader").addClass("m_search_ui");
	}).on("focusout", function(){	
		$("#ymHeader").removeClass("m_search_ui");
	});
}

/* 왼쪽 스토어 정보 이미지 */
function infoImgSetting(){
	$("#infoImg").css({'background-image':'url(images/@tmp_store_bg.jpg)'});
	$("#storeLogo").attr('src','images/@tmp_store_img.png');
	$("#storeName").html('옐로마켓');
	$("#storeDesc").html('Design your slim &amp; Healthy food');
}


//top버튼 클릭시 스크롤이동
function goTop(orix,oriy,desx,desy) {
   var Timer;
   if (document.body.scrollTop == 0) {
       var winHeight = document.documentElement.scrollTop;
   } else {
       var winHeight = document.body.scrollTop;
   }
   if(Timer) clearTimeout(Timer);
   startx = 0;
   starty = winHeight;
   if(!orix || orix < 0) orix = 0;
   if(!oriy || oriy < 0) oriy = 0;
   var speed = 7;
   if(!desx) desx = 0 + startx;
   if(!desy) desy = 0 + starty;
   desx += (orix - startx) / speed;
   if (desx < 0) desx = 0;
   desy += (oriy - starty) / speed;
   if (desy < 0) desy = 0;
   var posX = Math.ceil(desx);
   var posY = Math.ceil(desy);
   window.scrollTo(posX, posY);
   if((Math.floor(Math.abs(startx - orix)) < 1) && (Math.floor(Math.abs(starty - oriy)) < 1)){
       clearTimeout(Timer);
       window.scroll(orix,oriy);
   }else if(posX != orix || posY != oriy){
       Timer = setTimeout("goTop("+orix+","+oriy+","+desx+","+desy+")",15);
   }else{
       clearTimeout(Timer);
   }
}


//Top버튼 위치 조절
function btnTopSetting() {
    var windowWidth = window.innerWidth;

    if(windowWidth < 980) {
        $('#remote_top').hide();
    }

    windowWidth = (windowWidth - 900) / 2 - 130;

    $('#remote_top').css({
        "right" : windowWidth + "px",
        "bottom" : "50px"
    });
}

$( document ).ready(function() {

	uAgent = navigator.userAgent.toLowerCase();
	mobilePhones = ['iphone','ipod','android','blackberry','windows ce',
	                'nokia','webos','opera mini','sonyericsson','opera mobi','iemobile'];
	isMobile = false;

	infoImgSetting();
    $(window).on("load resize", btnTopSetting);
		           
	for(var i=0;i<mobilePhones.length;i++) {
		if(uAgent.indexOf(mobilePhones[i]) != -1) {
			isMobile = true;
			mobileUI();	
		}
	}

	if(isMobile == false) {
		$(window).scroll(function() {
            var _top = $(document).scrollTop();
            if(_top > 0) {
                $('#remote_top').css({"display": "table"});
            } else {
                $('#remote_top').css({"display": "none"});
            }
        });
	}

	/* 앱 다운로드 */
	$(".link_app_down").on("click",function(){

		if(uAgent.search("chrome") > -1) {
			andGoApp();
		} else if(uAgent.search("iphone") > -1) {
			iosGoApp();
		}	
	});


	
});


