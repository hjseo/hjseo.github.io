//syncfusion popup
var ifvm = new Object();

//popup 높이 맞추기
ifvm.PopupHeight = function(obj){
	this.popupDivId = $("#"+obj.popupDivId);
	this.contentsId = $("#"+obj.contentsId);
	
	this.rePosition();
};

ifvm.PopupHeight.prototype = {
	popupDivId : null,	//팝업 부르는 div id (부모 jsp)
	contentsId : null	//popup을 전체 감싸는 id (popup jsp)
};

ifvm.PopupHeight.prototype.rePosition = function(){
	
	var parentItem = this.popupDivId.parent();
	var wrapperItem = this.popupDivId.parent().parent();
	var titieHeight = this.popupDivId.parent().prev().outerHeight();
	var popHeight = this.contentsId.outerHeight();
	
	this.popupDivId.height(popHeight);
	parentItem.height(popHeight);
	wrapperItem.height(popHeight + titieHeight);
};


//popup 가운데 정렬
ifvm.PopupCenter = function(obj){
	this.wrapperItem = $("#"+obj.popupDivId+"_wrapper");
	this.overLayItem = $("#"+obj.popupDivId+"_overLay");
	
	this.rePosition();
};

ifvm.PopupCenter.prototype = {
	popupDivId : null,	//팝업 부르는 div id (부모 jsp)
};

ifvm.PopupCenter.prototype.rePosition = function(){
	var overLayHeight = this.overLayItem.outerHeight()/2;
	var wrapperHeight = this.wrapperItem.outerHeight()/2;
	this.wrapperItem.css("top", overLayHeight-wrapperHeight);
};

//popup 가운데 정렬
ifvm.PopupTop = function(obj){
	this.wrapperItem = $("#"+obj.popupDivId+"_wrapper");
	this.overLayItem = $("#"+obj.popupDivId+"_overLay");
	
	this.rePosition();
};

ifvm.PopupTop.prototype = {
	popupDivId : null,	//팝업 부르는 div id (부모 jsp)
};

ifvm.PopupTop.prototype.rePosition = function(){
	var overLayHeight = this.overLayItem.outerHeight()/2;
	var wrapperHeight = this.wrapperItem.outerHeight()/2;
	//this.wrapperItem.css("top", overLayHeight-wrapperHeight);
	this.wrapperItem.css("top", 10);
};


