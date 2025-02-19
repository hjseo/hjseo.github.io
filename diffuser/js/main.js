var sly;
var $frame = $('#frame');
//var $slidee = $frame.children('ul').eq(0);
//var $wrap = $frame.parent();

var sliderArr = [];
var imgList = [
    [
        {src:"./images/img_01.jpg"},
        {src:"./images/img_02.jpg"},
        {src:"./images/img_03.jpg"}
    ], [
        {src:"./images/img_02.jpg"},
        {src:"./images/img_01.jpg"},
        {src:"./images/img_03.jpg"}
    ], [
        {src:"./images/img_03.jpg"},
        {src:"./images/img_02.jpg"},
        {src:"./images/img_01.jpg"}
    ], [
        {src:"./images/img_04.jpg"}
    ], [
        {src:"./images/img_05.jpg"}
    ], [
        {src:"./images/img_06.jpg"}
    ], [
        {src:"./images/img_07.jpg"}
    ], [
        {src:"./images/img_08.jpg"}
    ], [
        {src:"./images/img_09.jpg"}
    ], [
        {src:"./images/img_10.jpg"}
    ], [
        {src:"./images/img_11.jpg"}
    ], [
        {src:"./images/img_12.jpg"}
    ]

];

function mainLayout () {
    sly = new Sly($frame, {
        horizontal: 1,
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
    }).init();
    sly.on('active', function(eventName, itemIndex){
        closeLnb();
        setTimeout(function(){
            sly.reload();
        }, 300);
    });
    sly.on('load', function(eventName){
        sly.toStart(sly.rel.activeItem);
    });

}

function closeLnb( end ){
    if( $('.lnb_wrap').hasClass('on') ) {
        $('.lnb_wrap').removeClass('on').addClass('off');
    }
}

jQuery(function($) {

    var winWidth = $(window).outerWidth();

    if (winWidth >= 992) {
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

    // slider
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
        if ( imgList[i].length == 1 ) {
            $('.slider_wrap').eq(i).parent().children('.btn_arr').hide();
        }
    }

    $('.move_right').on('click', function(){
        $('#frame > ul > li').removeClass('active');
        $(this).closest('li').addClass('active');
        for (var i=0; i < $('#frame > ul > li').length-2; i++){
            if($('#frame > ul > li').eq(i).hasClass('active')) {
                sliderArr[i-1].leftBtn(this);
            }
        }
    });
    $('.move_left').on('click', function(){
        $('#frame > ul > li').removeClass('active');
        $(this).closest('li').addClass('active');
        for (var i=0; i < $('#frame > ul > li').length-2; i++){
            if($('#frame > ul > li').eq(i).hasClass('active')) {
                sliderArr[i-1].rightBtn(this);
            }
        }
    });

    // LNB
    $('.btn_lnb').on('click', function() {
        if( $('.lnb_wrap').hasClass('on') ) {
            $('.lnb_wrap').removeClass('on').addClass('off');
        } else {
            $('.lnb_wrap').addClass('on').removeClass('off');
        }
    });

     $('.lnb_box > ul > li').on('click', function() {
        closeLnb();
        var idx = $(this).index();
        sly.activate(idx+1);
    });

    // GNB
    $('.gnb ul li a').on('click', function(){
        $('.gnb ul li a').removeClass('active');
        $(this).addClass('active');
    });

    // list arrow
    $('.info_area .btn_arr, .footer .btn_arr').on('click', function(){
        sly.activate(1);
    });

});
