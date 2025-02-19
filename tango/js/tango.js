TangoLayoutClass = function(){
	
	this.init();
}

TangoLayoutClass.prototype = {
	
	topTab : null,
	middleTab : null,
	
	init : function(){
		$('#container').split({orientation:'vertical', limit:100, position:'13%'});
		this.blackSkin();
		this.makeTreeMenu();
		this.tabInit();
	},
	
	tabInit : function(){
		this.topTab = new TangoLayoutClass.TabMenu({
			tabArr : [],
			container : $("#topTabCon"),
			parent : $("#topTab"),
			leftArrow : $("#topTabArrowLeft"),
			rightArrow : $("#topTabArrowRight")
			
		});
		this.topTab.ArrowClickEvent();
		
		this.middleTab = new TangoLayoutClass.TabMenu({
			tabArr : [],
			container : $("#middleTabCon"),
			parent : $("#middleTab"),
			leftArrow : $("#middleTabArrowLeft"),
			rightArrow : $("#middleTabArrowRight")
		}); 
		this.middleTab.ArrowClickEvent();
	},
	
	blackSkin : function(){
		document.getElementById('black').disabled = false;
	    document.getElementById('white').disabled = true;
	},
	
	whiteSkin : function(){
		document.getElementById('black').disabled = false;
	    document.getElementById('white').disabled = false;
	},
	
	makeTreeMenu : function(){
		var _this = this;
		$('#jstree').jstree({
			"core" : {
			    'data' : [
			     	{ "id" : "ajson1", "parent" : "#", "text" : "Application" },
			       	{ "id" : "ajson3", "parent" : "ajson1", "text" : "menu" },
			       	{ "id" : "ajson4", "parent" : "ajson1", "text" : "menu" },
			       	{ "id" : "ajson2", "parent" : "#", "text" : "Menu" },
			       	{ "id" : "ajson5", "parent" : "#", "text" : "view" },
			       	{ "id" : "ajson6", "parent" : "ajson5", "text" : "menu" },
			       	{ "id" : "ajson7", "parent" : "ajson5", "text" : "menu" },
			    ],
			    "multiple" : false,
			    "check_callback" : true
			}, 
			
			"types" : {
				"default" : {
			    	"icon" : "../images/common/menu/bu_tree_child.gif"
				}
			},
		  
			"plugins" : [
			 	"contextmenu", "dnd", "types"
			]
		})
		.bind("select_node.jstree", function( event, data ){
			_this.makeTopTab( data.node.text );
		});
	},
	
	makeTopTab : function( text ){
		this.topTab.makeTab( text );
	},
	
	splitterCollapsible : function(){
		$(".left_panel").width("100");
		$(".vsplitter").css("left","100px");
		
		var windowWidth = $(window).width();
		
		$(".right_panel").width( windowWidth-"107" );
	}
}

/**
 * TangoLayoutClass.TabMenu
 * tabMenu class by seo.hj
 */
TangoLayoutClass.TabMenu = function(obj){
	$.extend( this, obj );
	
	this.init();
}
	
TangoLayoutClass.TabMenu.prototype = {
	wrapWidth : 0,
	conWidth : 0,
	num : 0,	
	tabArr : [],
	container : null,
	parent : null,
	leftArrow : null,
	rightArrow : null,
	itemWidth : 0,
	
	init : function(){
		
	},
	
	makeTab : function( text ){
		var _this = this;
		var obj = {
			dataObj : {tabTitle : text, contentUrl : ''},
	    	closeFunc : function(){
	    		_this.settingWidth();
	    	}
	    };
	   
		this.container.children(".title").removeClass("on");
	    var tab = new TangoLayoutClass.TabMenu.Tab(obj);
	    this.container.append( tab.view );
	    this.tabArr.push( tab );
	    
	    this.settingWidth();
	    //this.ArrowClickEvent();
	},
	
	settingWidth : function(  ){
		var sum = 0;
	    for( var i = 0; i < this.tabArr.length; i++ ){
	    	
	    	this.itemWidth = this.container.children().eq(i).outerWidth();
	    	sum += this.itemWidth;
	    }
	    this.container.width( sum + 1 );
		
		this.wrapWidth = this.parent.width();
		this.conWidth = this.container.width();
	    
	    if( this.conWidth > this.wrapWidth ){
	    	this.leftArrow.show();
	    	this.rightArrow.show();
	    }
	},
	
	ArrowClickEvent : function(){
		var _this = this;
		var firstWidth = 0; 
	    this.rightArrow.click(function(){
	    	
	    	firstWidth += _this.container.children().eq(_this.num).outerWidth();

	    	_this.num += 1;
	    	
	    	_this.container.animate({
	    	    left: -firstWidth
	    	}, 300, function() {
	    	    // Animation complete.
	    	});
	    	
	    });
	    
	    this.leftArrow.click(function(){
	    	var prevWidth = _this.container.children().eq(_this.num-1).outerWidth();
	    	
	    	_this.num -= 1;
	    	if( _this.num < 0 ){
	    		_this.num = 0;
	    		return;
	    	}
	    	
	    	firstWidth = firstWidth - prevWidth;
	    	
	    	_this.container.animate({
	    	    left: -firstWidth
	    	}, 300, function() {
	    	    // Animation complete.
	    	});
	    });
	},
	
	
};

/**
 * TangoLayoutClass.TabMenu.Tab
 * tab class
 */
TangoLayoutClass.TabMenu.Tab = function(obj){
	
	$.extend( this, obj );
	
	this.init()
}

TangoLayoutClass.TabMenu.Tab.prototype = {
	
	dataObj : null,
	view : null,
	closeFunc : null,
	
	init : function(){
		var temp = $("#tabTemplate").tmpl(this.dataObj);
		this.view = $(temp);
		
		this.view.addClass("on");
		this.tabClickEvent();
	},

	tabClickEvent : function(){
		var _this = this;
		
		this.view.click(function(){
			_this.view.parent().find(".title").removeClass("on");
	    	_this.view.addClass("on");
		});
		
		this.view.hover(function(){
			_this.view.children(".close").show();
		}, function(){
			_this.view.children(".close").hide();
		});
		
		this.view.find(".close").click(function(){
			_this.view.remove();
			_this.closeFunc();
			
		});
	}
	
}
