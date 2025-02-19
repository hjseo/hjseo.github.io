(function($){
	
	$.fn.ikSlider = function(options){
		
		this.opt = $.extend({
			secondBox : null,
    		firstBox : null,
    		currentBox : null,
    		currentNum : 0,
    		imgList : null,
    		length : null,
    		width : null
		}, options);
		
		this.init = function(){
			this.opt.length = this.opt.imgList.length;
			this.opt.currentBox = this.opt.firstBox;
			this.makeImg();
			this.makePaging();
		};
		
		//이미지 생성
		this.makeImg = function(){
			var img = document.createElement("img");
   			img.src=this.opt.imgList[this.opt.currentNum].src;
           	
   			this.opt.currentBox.html('');
   			this.opt.currentBox.append(img);
		};
		
		//오른쪽으로 하나씩 이동
		this.rightBtn = function(){
			
			this.opt.currentNum--
			if(this.opt.currentNum == -1){
				this.opt.currentNum = this.opt.length-1;
			}
    		
    		this.rightMoveImg();
    		this.makeImg();
    		this.movePaging();
		}

		//왼쪽으로 하나씩 이동
		this.leftBtn = function(){
			
			this.opt.currentNum++
			if(this.opt.currentNum > this.opt.length-1){
				this.opt.currentNum = 0;
			}
			
			this.leftMoveImg();
    		this.makeImg();
    		this.movePaging();
		}
		
		//오른쪽으로 이동할 수 있게 위치잡기
		this.rightMoveImg = function(){
			if(this.opt.currentBox == this.opt.secondBox){
    			this.opt.currentBox = this.opt.firstBox;
    			this.opt.firstBox.css("left",-this.opt.width+"px");
    			this.opt.secondBox.css("left","0");
    		}else{
    			this.opt.currentBox = this.opt.secondBox;
    			this.opt.secondBox.css("left",-this.opt.width+"px");
    			this.opt.firstBox.css("left","0");
    		}
    		
    		$("#wrap").children().stop().animate({
    			
    			left:"+="+this.opt.width
    		},300);
			
		}
		
		//왼쪽으로 이동할 수 있게 위치잡기
		this.leftMoveImg = function(){
			if(this.opt.currentBox == this.opt.secondBox){
    			this.opt.currentBox = this.opt.firstBox;
    			this.opt.secondBox.css("left","0");
    			this.opt.firstBox.css("left",this.opt.width+"px");
    		}else{
    			this.opt.currentBox = this.opt.secondBox;
    			this.opt.firstBox.css("left","0");
    			this.opt.secondBox.css("left",this.opt.width+"px");
    		}
    		
    		$("#wrap").children().stop().animate({
    			
    			left:"-="+this.opt.width
    		},300);
			
		}
		
		//페이징 생성
		this.makePaging = function(){
			for( var i=0; i<this.opt.length; i++ ){
				var li = document.createElement("li");
				if(i==0){
					$(li).addClass('active');
				}
				$("#pagination").append(li);
			}
		}		
		
		//페이징 컬러
		this.movePaging = function(){
			$("#pagination li").removeClass('active');
			$("#pagination li").eq(this.opt.currentNum).addClass('active');
		}
		
		//페이징 클릭
		this.clickPaging = function( item ){
			
			if( this.opt.currentNum < $(item).index() ){	
				this.opt.currentNum = $(item).index();
				this.leftMoveImg();
	    		
			}else if( this.opt.currentNum > $(item).index() ){
				this.opt.currentNum = $(item).index();
				this.rightMoveImg();
			}else{
				//현재 페이징 클릭했을 때
			}

			this.makeImg();
			this.movePaging();
			
			
		}
		
		
		this.init();
		
		return this;
	};
	
})(jQuery);