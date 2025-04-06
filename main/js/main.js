var sly;
var $frame = $('#frame');
//var $slidee = $frame.children('ul').eq(0);
//var $wrap = $frame.parent();

var sliderArr = [];
// 이미지 리스트
var imgList = [
    [   {src: "./images/hana_event8531.png"},
        {src: "./images/hana_subscribe.png"}
    ],
    [   
        {src: "./images/hana_event7945.png"}
    ],
    [   
        {src: "./images/hana_event7843.png"}
    ],
    [   {src: "./images/samsungFire.png"},
        {src: "./images/samsungFire2.png"},
        {src: "./images/samsungFire3.png"}
    ],
    [   {src: "./images/podbbang.png"},
        {src: "./images/podbbang2.png"}
    ], [
        {src:"./images/alibabacloud.png"},
        {src:"./images/alibabacloud2.png"}
    ], [
        {src:"./images/cloudsecurity.png"},
        {src:"./images/cloudsecurity2.png"},
        {src:"./images/cloudsecurity3.png"}
    ], [
        {src:"./images/aws.png"}
    ],[
        {src:"./images/kgu.png"}
    ],[
        {src:"./images/hostingkr.jpg"},
        {src:"./images/hostingkr2.jpg"}
    ], [
        {src:"./images/segment.png"},
        {src:"./images/segment2.png"}
    ], [
        {src:"./images/soilebiz.png"}
    ], [
        {src:"./images/yellomarket2.png"},
        {src:"./images/yellomarket.png"}
    ], [
        {src:"./images/polared.png"}
    ], [
        {src:"./images/infavor.png"},
        {src:"./images/infavor2.png"}
    ]
];

// 전체 레이아웃. 가로 스크롤
function mainLayout () {
    sly = new Sly($frame, {
        horizontal: 1,
        itemNav: 'basic',
        activateOn: 'click',
        smart: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBy: 1,
        speed: 400,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        infinite: 1
    }).init();

    sly.on('active', function(eventName, itemIndex){
        closeLnb();
        
        // css3로 크기 transition한 후에 다시 사이즈 계산하기
        setTimeout(function(){
            sly.reload();
            
            //활성화된 영역으로 포커스
            $('#frame>ul>li.active').focus();
        }, 210);
    });
    
    sly.on('load', function(eventName){
        sly.toStart(sly.rel.activeItem);
    });

}

// 좌측 닫기
function closeLnb( end ) {
    $('#lnbWrap').removeClass('on').addClass('off');
    $('#lnbWrap a').attr('tabindex','-1');
}



jQuery(function($) {

    var winWidth = $(window).outerWidth();

    if (winWidth >= 1024) {
        mainLayout();
    } else {
        /*sly = new Sly($frame, {
            horizontal: 0,
            itemNav: 'basic',
            activateOn: 'click',
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            startAt: 0,
            scrollBy: 1,
            speed: 500,
            elasticBounds: 1,
            easing: 'easeOutExpo'
        }).init();*/
    }
    /*$('#frame > ul > li').on('click', function() {
        debugger;
        closeLnb(false);
        if( $(this).hasClass('active') ) {
            $(this).removeClass('active');
            setTimeout(function(){
                sly.reload();
            }, 200);
        } else {
            $('#frame > ul > li').removeClass('active');
            $(this).addClass('active');
            setTimeout(function(){
                sly.reload();
            }, 200);
        }
    });*/

    $(window).resize(function() {
        if ($(window).width() >= 1024) {
            document.location.reload();
        }
    });

    // 웹접근성 - enter를 눌렀을 때에도 클릭이 되도록
    $("#frame>ul>li").keyup(function(event) {
        if (event.which === 13) {
            this.click();
        }
    });

    // 이미지 배너 slider.js
    for (var i=0; i < $('.slider_wrap').length; i++){
        sliderArr[i] = $('.slider_wrap').eq(i).Slider({
            secondBox : $('.slider_wrap').eq(i).children('.second'),
            firstBox : $('.slider_wrap').eq(i).children('.first'),
            width : 779,
            imgList : imgList[i],
            imgClass : 'img_item'
            //brandImgList: brandImgList[i],
            //brandImgClass : 'brand_logo'
        });
        if ( imgList[i].length === 1 ) {
            $('.slider_wrap').eq(i).parent().children('.btn_arr').hide();
        }
    }

    // 이미지배너 우측하단 화살표 버튼
    $('.move_right').on('click', function(){
        $('#frame > ul > li').removeClass('active');
        $(this).closest('li').addClass('active');
        for (var i=0; i < $('#frame > ul > li').length; i++){
            if($('#frame > ul > li').eq(i).hasClass('active')) {
                sliderArr[i-1].leftBtn(this);
            }
        }
    });
    $('.move_left').on('click', function(){
        $('#frame > ul > li').removeClass('active');
        $(this).closest('li').addClass('active');
        for (var i=0; i < $('#frame > ul > li').length; i++){
            if($('#frame > ul > li').eq(i).hasClass('active')) {
                sliderArr[i-1].rightBtn(this);
            }
        }
    });

    // LNB 열고 닫기
    $('#btnLnb').on('click', function() {
        if( $('#lnbWrap').hasClass('on') ) {
        //닫기
            closeLnb();
        } else {
            //열기
            $('#lnbWrap').addClass('on').removeClass('off');
            $('#lnbWrap a').attr('tabindex','0');
        }
    });

     $('#lnbWrap .lnb_box > ul > li').on('click', function() {
        closeLnb();
        var idx = $(this).index();
        sly.activate(idx+1);
    });

    // GNB
    $('.gnb ul li a').on('click', function(){
        $('.gnb ul li a').removeClass('active');
        $(this).addClass('active');
    });

    //화살표 클릭 시, 첫 번째 리스트로 이동
    $('.info_area .btn_arr, .footer .btn_arr').on('click', function(){
        sly.activate(1);    
    });

});
