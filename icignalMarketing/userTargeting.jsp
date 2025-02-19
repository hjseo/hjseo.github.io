<%@page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="ifvm" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script src='${pageContext.request.contextPath}/resources/js/jquery.splitter-0.14.0.js' type="text/javascript"></script>

<script>

var targetLevelId = '<%= request.getParameter("targetLevelId") %>';
var confilterid = '<%= request.getParameter("id") %>';
var conditionList;
var seq = 0;
var selectedFilterId;
var selectedFilterName;
var filterId;

//첫번째 필터 숨김처리
function filterHide(){
	$("#fieldSelectArea").children().children().eq(1).find('select').hide();
}

//조건 변경 시 서버 업데이트
function changeAndOr(item){
    	
	debugger;
	
   	var obj = {};
   	obj.filterId = item.parentNode.parentNode.getAttribute('filterId');
   	
   	if(item.selectedIndex == '0'){
   		obj.andOr = 'AND';
   	}
   	else{
   		obj.andOr = 'OR';
   	}
   	
   	
   	$.ifvSyncPostJSON('<ifvm:action name="updateAndOr"/>',obj
	,function(result) {
		
		/* var filterId = fieldId + '_temp' + seq;
        
        $("#" + filterId).attr("filterId", result.message); */
        
        
	}); 
	
}

//필드를 끌어놓는 순간 빈 필드 저장
function setEmptyField(fieldId){
	
	debugger;
	
	var obj = {};
	obj.filterSeq = seq;
	obj.segmentId = confilterid;
	obj.fieldId = fieldId;
	
	$.ifvSyncPostJSON('<ifvm:action name="setEmptyField"/>',obj
	,function(result) {
		
		var filterId = fieldId + '_temp' + seq;
        
        $("#" + filterId).attr("filterId", result.message);
        
        
	}); 
	
}


//세그먼트 쿼리 조회
function getSegmentQuery(){
	
	$.ifvSyncPostJSON('<ifvm:action name="getSegmentQuery"/>',{segmentId : confilterid}
	,function(result) {
		$("#sqlQuery").text(result.sqlQuery);
	}); 

}


//세그먼트 저장
function setTargetSegment(){
	
	debugger;
	
	var obj = {};
 	if(typeof(quickFlag) != "undefined"){
		
 		if(camId != null && camId != 'null'){
			obj.camId = camId;
			obj.segmentId = confilterid;
			obj.targetLevelId = targetLevelId;
			obj.quickFlag = quickFlag;
			
			if($("#compareValue").val() != null && $("#compareValue").val().length > 0){
				obj.compareValue = $("#compareValue").val();
				obj.compareType = $("#compareSelect").val();
			}
			
			$.ifvSyncPostJSON('<ifvm:action name="setTargetSegment"/>',obj
			,function(result) {
				alert('<spring:message code="marketing.targeting.saveDone"/>');
			}); 
			
		}
		else{	
			alert('<spring:message code="marketing.quickCampaign.noCmapaignInfo"/>');
		}
		
	}
 	else{
	
 		obj.segmentId = confilterid;
		obj.targetLevelId = targetLevelId;
		
		if($("#compareValue").val() != null && $("#compareValue").val().length > 0){
			obj.compareValue = $("#compareValue").val();
			obj.compareType = $("#compareSelect").val();
		}
		
		$.ifvSyncPostJSON('<ifvm:action name="setTargetSegment"/>',obj
		,function(result) {
			alert('<spring:message code="marketing.targeting.saveDone"/>');
		}); 
			
 	}
}

//필드 필터 정보 조회
function fieldFilterList(){
	
	debugger;
	
	$.ifvSyncPostJSON('<ifvm:action name="getFieldFilterList"/>',{
		segmentId : confilterid
	},function(result) {
		
		 var fieldTemp = {};
	        
		 $("#selectedFilterCnt").text(result.fieldFilterItem.length);
		 
		 for(var i=0; i<result.fieldFilterItem.length; i++){
			
			$("#fieldSelectArea").find( ".placeholder" ).hide();
			 
			fieldTemp.id = result.fieldFilterItem[i].fieldId + '_temp' + result.fieldFilterItem[i].filterSeq;
	        fieldTemp.func = result.fieldFilterItem[i].fieldId + '_temp' + result.fieldFilterItem[i].filterSeq;
	        fieldTemp.text = result.fieldFilterItem[i].fieldName;
	        
	        seq = result.fieldFilterItem[i].filterSeq;
	        
	        var temp = $("#draggableTemp").tmpl(fieldTemp);
	        $("#fieldSelectArea ul").append(temp);
	        
	        $("#" + fieldTemp.id).attr("filterId", result.fieldFilterItem[i].filterId);
	        
	        if(result.fieldFilterItem[i].andOr == 'AND'){
	        	$("#" + fieldTemp.id).find('select').val("1");
	        }
	        else{
	        	$("#" + fieldTemp.id).find('select').val("2");
	        }
	        
	       //필터 값 셋팅
	        var filterValue = "";
	        
	        if(result.fieldFilterItem[i].filterValue!= null && result.fieldFilterItem[i].filterValue != 'null'){
	        	 
	        	if(result.fieldFilterItem[i].criteriaType != "BETWEEN"){
	        		filterValue += result.fieldFilterItem[i].criteriaType + " : " + result.fieldFilterItem[i].filterValue;
		        	 $("#" + fieldTemp.id).find('p').text(filterValue);
	        	}
	        	else{
	        		filterValue += result.fieldFilterItem[i].criteriaType + " : " + result.fieldFilterItem[i].filterValue + " AND " + result.fieldFilterItem[i].filterAttr;
		        	 $("#" + fieldTemp.id).find('p').text(filterValue);
	        	}
	        	
	        	 
	        	//버튼 색 변경
	 			$("#" + fieldTemp.id).find('button').addClass("btn_filter_save");
	 			$("#" + fieldTemp.id).find('button').children(".filter_ico").attr("src", "<ifvm:image name='ico_check2' />");
	 			
	        }
	        else{
	        	 $("#" + fieldTemp.id).find('p').text('<spring:message code="marketing.userTargeting.filterSettingValue"/>');
	        }
	       
	        
	        
		 }
	        
		 seq ++;
	        
		 filterHide();
	        /* var comTemp = $("#conditionTypeTemplate").tmpl(conditionList.rows);
			$("#" + fieldTemp.func).append(comTemp); 
			
			var notFunc = {};
			notFunc.codeName = 'NA';
			notFunc.markName = '--';
			
			var comNotFunc = $("#conditionTypeTemplate").tmpl(notFunc);
			$("#" + fieldTemp.func).prepend(comNotFunc);  */
		
	});
}

function divideScreen() {
	$('#adminCon').split({orientation:'vertical', limit:100, position:'15%'});
}

function accordionSetting(){
	$("#basicAccordion").ejAccordion({
		collapsible: true
	});
}


function init(){
	debugger;
	$("#adminCon").height(900);
	divideScreen();	//split
	accordionSetting();	//아코디언
	$("#userTargetingTab").ejTab();	//탭
	settingUserMenu();
	conditionType();
	compareType();
	fieldFilterList();
}

//대상 카운트
function countTarget(){
	
	debugger;
	/* var targetItem = [];
	
	
	for(var i=1; i<$("#fieldSelectArea").find('li').length; i++){
		
		var saveItem = {};
		
		//필드 아이템 조회
		saveItem.fieldSeq = i;
		saveItem.fieldId = $("#fieldSelectArea").find('li')[i].id;
		saveItem.groupVal = $("#" + saveItem.fieldId).find('select').eq(0).val();
		
		if(saveItem.groupVal != 'NA'){
			saveItem.groupFuncType = 'GROUP';
		}
		else{
			saveItem.groupFuncType = 'NORMAL';
		}
		
		if($("#" + saveItem.fieldId).find('select').eq(1).val() == '1'){
			saveItem.andOr = 'AND';
		}
		else{
			saveItem.andOr = 'OR';
		}
		
		saveItem.fieldId = $("#fieldSelectArea").find('li')[i].id.split('_')[0];
		
		//필터 정보 조회
		var filterVal = {};
		
		filterVal.filterSeq = i;
		
		var filterValue = new Array();
		filterValue.push('5000');
		
		filterVal.filterVal = filterValue;
		filterVal.operation = '<';
		
		saveItem.filterItem = filterVal;
		
		//그룹 정보 조회
		var groupVal = {};
		
		groupVal.filterSeq = i;
		
		var groupValue = new Array();
		groupValue.push('aaa');
		
		groupVal.filterVal = groupValue;
		groupVal.operation = '<=';
		
		saveItem.groupItem = groupVal;
		
		
		
		targetItem.push(saveItem);
		
		
	} */
	debugger;
	
	/* var targetItem = [];
	
	for(var i=1; i<$("#fieldSelectArea").find('li').length; i++){
		
		var saveItem = {};
		//saveItem.fieldId = $("#fieldSelectArea").find('li')[i].id;
		if($("#fieldSelectArea").find('li').eq(i).children().find('button').attr('class').indexOf('save') != '-1'){
			saveItem.filterId = $("#fieldSelectArea").find('li')[i].getAttribute('filterId');
			targetItem.push(saveItem);
		}
		
	} */
	
	var obj = {};
	obj.segmentId = confilterid;
	obj.targetLevelId = targetLevelId;
	
	 $.ifvSyncPostJSON('<ifvm:action name="getTargetCount"/>',obj
	,function(result) {
		debugger;
		
		$("#filterAllCnt").text(result.allCnt);
		
		for(var i=0; i<result.countItem.length; i++){
			
			for(var k=0; k<$("#fieldSelectArea").find('li').length; k++){
				
				if(result.countItem[i].filterId == $("#fieldSelectArea").find('li')[k].getAttribute('filterId')){
					$("#fieldSelectArea").find('li').eq(k).find('input').val(result.countItem[i].filterCount);
				}
			}
		}
		
	}); 
	
	
}

//공통코드 조회 - 조건유형
function conditionType(){
	$.ifvSyncPostJSON('<ifvm:action name="getCommCodeList"/>',{
		groupCode : 'MKT_SEG_GROUP_CONDITION_TYPE'
		, enableNA : true
	},function(result) {
		
		conditionList = result;
	});
}; 

//공통코드 조회 - 비교군
function compareType(){
	$.ifvSyncPostJSON('<ifvm:action name="getCommCodeList"/>',{
		groupCode : 'MKT_SEND_UNIT_CD'
		, enableNA : true
	},function(result) {
		
		var temp = $("#compareTemplate").tmpl(result.rows);
		$("#compareSelect").append(temp);
	});
}; 

//필터 저장시 버튼 변경
function filterSetBtnUI(_this){
	$(_this).addClass("btn_filter_save")
	.children(".filter_ico").attr("src", "<ifvm:image name='ico_check2' />");
}

function userTargetingPopClose(){
	$("#userTargetingPop").ejDialog('destroy');
}

//서브젝트 에어리어 영역 조회
function settingUserMenu(){
	
	$.ifvSyncPostJSON('<ifvm:action name="getSubjectFieldList"/>'
	, {targetLevelId : targetLevelId}
	,function(result) {
		debugger;
		
		for(var i=0; i<result.subjectAreaList.length; i++){
			
			$("#targetLevelNm").text(result.subjectAreaList[0].targetLevelNm);
			
			var temp = $("#toggleMenuTemp").tmpl(result.subjectAreaList[i]);
		    $("#menuArea").append(temp);
		    
		    var temp2 = $("#toggleSubMenuTemp").tmpl(result.subjectAreaList[i].fieldList);
		    $("#"+ result.subjectAreaList[i].subjectAreaId).append(temp2);
			
		}
		
	});
	draggable();
	
	/* var temp = $("#toggleMenuTemp").tmpl();
    $("#menuArea").append(temp);
    
    var temp2 = $("#toggleSubMenuTemp").tmpl();
    $("#menuArea .menu_ul").append(temp2); */
}
function draggable(){
	$( "#basicAccordion li" ).draggable({
    	appendTo: "body",
    	helper: "clone"
    });
}


function isKeyPressed(event, _this) {
	//ctrl key 눌렀을 때 event
	if (event.ctrlKey) {
    	
    	$(_this).addClass("sel");
    	var selectList = $( "#fieldSelectArea>ul>li.sel" ); 

    	if( selectList.length > 1 ){
			$("#groupBtn").removeAttr("disabled");
		}
    	
    } else {
    	removeSelClass();
    	$("#groupBtn").attr("disabled", "disabled");
    	$(_this).addClass("sel");
    }
}

//선택한 style 없애기
function removeSelClass(){
	$( "#fieldSelectArea ul" ).removeClass("sel");
	$( "#fieldSelectArea ul li" ).removeClass("sel");
}

//그룹안에 리스트 1개일 때 그룹 해제
function setUngroup(){
	var selectList = $( "#fieldSelectArea ul.group_list.sel li:not(.group_edge)" );
	
	if( selectList.length == 1 ){
		var html = "";
		
		for(var i=0; i<selectList.length; i++){
			html += selectList[i].outerHTML;	//복제
		}  
		
		$("#fieldSelectArea ul.group_list.sel").after(html);
		$("#fieldSelectArea ul.group_list.sel").remove();
		removeSelClass();
	}
}

$(document).ready(function() {

	if(typeof(quickFlag) == "undefined"){
		$.ifvmLnbSetting('userMain');
		init();
		
	}

	//drag and drop
	draggable();
    $( "#fieldSelectArea ul" ).droppable({
    	//activeClass: "ui-state-default",
    	//hoverClass: "ui-state-hover",
        accept: "#basicAccordion li",
        drop: function( event, ui ) {
	        $( this ).find( ".placeholder" ).hide();
	        //$( "<li></li>" ).text( ui.draggable.text() ).appendTo( this );
	        debugger;
	        
	        var fieldTemp = {};
	        
	        fieldTemp.id = ui.draggable.attr('id') + '_temp' + seq;
	        fieldTemp.func = ui.draggable.attr('id') + '_func' + seq;
	        fieldTemp.text = ui.draggable.text();
	        
	        var temp = $("#draggableTemp").tmpl(fieldTemp);
	        $("#fieldSelectArea>ul").append(temp);
	        
	        var comTemp = $("#conditionTypeTemplate").tmpl(conditionList.rows);
			$("#" + fieldTemp.func).append(comTemp); 
			
			var notFunc = {};
			notFunc.codeName = 'NA';
			notFunc.markName = '--';
			
			var comNotFunc = $("#conditionTypeTemplate").tmpl(notFunc);
			$("#" + fieldTemp.func).prepend(comNotFunc); 
			
			var fieldCnt = parseInt($("#selectedFilterCnt").text()) + 1;
			$("#selectedFilterCnt").text(fieldCnt);
			
			//필터 저장
			setEmptyField(ui.draggable.attr('id'));
			
			filterHide();
			
			seq++;
	    }
    }).sortable({
    	axis : "y",
        items : "li:not(.placeholder, .group_edge), ul.group_list",
        opacity : 0.8,
		start : function (event, ui){
			//그룹일 때
			var parent = ui.item.parent();
			
			if( $(parent).hasClass("group_list") ){
				 if( $(parent).children("li:not(.group_edge)").length == 3 ){
					 $(".group_list").removeClass("sel");
					 $(parent).addClass("sel");
				 }
			}
		},
        sort : function(event, ui) {
        	var item = ui.item[0];
        	$(item).addClass("sort");
        },
        stop : function(event, ui){
        	var item = ui.item[0];
        	$(item).removeClass("sort");
        	setUngroup();	//1개 남을 때 그룹해제
        	
        	//그룹안에 그룹 방지
        	if( ui.item.hasClass("group_list") ){
        		if( ui.item.parent().hasClass("group_list") ){
            		$(this).sortable('cancel');	
            	}	
        	}
        	
        	
        }
    });
    
  //필드 조건 리스트 클릭
	$( "#fieldSelectArea ul li" ).live("click", function(event){
		var _this = $(this);
		$( "#groupBtn" ).text("Group");
		isKeyPressed(event, _this);
    });
	
    //group버튼 클릭
	$( "#groupBtn" ).live("click", function(event){
		
		if( $(this).text() == "Group" ){
			var selectList = $( "#fieldSelectArea>ul>li.sel" ); 
			
			if( selectList.length > 1 ){
				removeSelClass();
				var html = "";
				html += "<ul class='group_list'>";
				html += "<li class='group_start_item group_edge'>{</li>";
				
				for(var i=0; i<selectList.length; i++){
					html += selectList[i].outerHTML;	//복제
				}  
	
				html += "<li class='group_end_item group_edge'>}</li>";
				html += "</ul>";
			   
			    $(selectList[0]).before(html);
			    selectList.remove();	//선택된 list 삭제
			}
		} else {	// Ungroup
			
			var selectList = $( "#fieldSelectArea ul.group_list.sel li:not(.group_edge)" );
			var html = "";

			for(var i=0; i<selectList.length; i++){
				html += selectList[i].outerHTML;	//복제
			}  
			
			$("#fieldSelectArea ul.group_list.sel").after(html);
			$("#fieldSelectArea ul.group_list.sel").remove();	//선택된 list 삭제
			removeSelClass();
			
		}
		
		$("#groupBtn").attr("disabled", "disabled");
    });
    
    //그룹 리스트 클릭
	$( "#fieldSelectArea ul.group_list" ).live("click", function(){
		removeSelClass();
		$(this).addClass("sel");
		$( "#groupBtn" ).text("Ungroup");
		$("#groupBtn").removeAttr("disabled");
	});
    
    //토글 메뉴
    $(".menu_wrap .menu_title").live("click", function(){
    	$(this).next('ul').slideToggle( "fast", function(){
    		$(this).prev(".menu_title").toggleClass( "focus", 1000 );	
    	} );
    	
    });
    
    //토글 메뉴 리스트 drag시 style 
    $( "#basicAccordion li" ).live("dragstart", function(){
    	$(this).addClass("focus");
    });
    $( "body" ).live("mouseup", function(){
    	$( "#basicAccordion li" ).removeClass("focus");
    });
    
    //필드 조건 닫기 버튼
    $(".draggable_close").live("hover", function(e){
    	if(e.type== "mouseleave"){
    		$(this).children("img").attr("src", "<ifvm:image name='ico_close' />");	
    	} else {
    		$(this).children("img").attr("src", "<ifvm:image name='ico_close_hover' />");	
    	}
    	
    }).live("click", function(){
    	var group = $(this).parent().parent(".group_list");
    	
    	if( $(group).hasClass("group_list") ){
    		$(".group_list").removeClass("sel");
    		$(group).addClass("sel");
    	}
    	
    	var delFilterId = this.parentElement.getAttribute('filterId');
    	
    	if(delFilterId.length > 0){
    		
    		$.ifvSyncPostJSON('<ifvm:action name="deleteFilterValue"/>',{filterId : delFilterId}
    		,function(result) {
    			debugger;
    			//alert('<spring:message code="marketing.targeting.deleteDone"/>');
    		});
    	}
    	
    	$(this).parent().remove();	//제거
		setUngroup();	//1개남을 때 그룹해제
		
    	if( $(".draggable_list").length == 0 ){
    		$("#fieldSelectArea").find( ".placeholder" ).show();	
    	}

    	var fieldCnt = $("#fieldSelectArea").children().children().length -1
    	$("#selectedFilterCnt").text(fieldCnt);
    	
    });
    
    //필터설정 버튼
    $(".btn_filter").live("click", function(){
    	debugger;
    	selectedFilterName = this.parentElement.parentElement.getElementsByClassName("field_row_label")[0].id;
    	selectedFilterId = this.parentElement.parentElement.id;
    	
    	//필터값 유무 조회
    	if(this.parentElement.parentElement.getAttribute('filterId').length > 0){
    		filterId = this.parentElement.parentElement.getAttribute('filterId');
    	}
    	else{
    		filterId = null;
    	}
    	
    	var _this = $(this);
    	$("#userTargetingPop").ejDialog({
    		enableModal : true,
            enableResize: false,
            contentUrl: '<ifvm:url name="filterSettingPop" />',
            contentType: "ajax",
            title: '<spring:message code="marketing.userTargeting.filterSetting"/>',
            width: 828,
            open : function(){
            	filterBtn(_this);
            },
            close : 'userTargetingPopClose'
        }); 
    	
    });
    
    //카운트 버튼 클릭
    $("#countBtn").on('click', function(){
    	countTarget();
    });
    
    //저장 버튼 클릭
    $("#targetSegmentSaveBtn").on('click', function(){
    	setTargetSegment();
    });
    
    //sql 확인 버튼 클릭
    $("#sqlConfirm").on('click', function(){
    	getSegmentQuery();
    });
    
    
    
});

</script>

<!-- 비교군 공통코드 -->
<script id="compareTemplate" type="text/x-jquery-tmpl">
<option id="${'${'}codeName}" value="${'${'}codeName}">${'${'}markName}</option>
</script>

<!-- 조건 공통코드 -->
<script id="conditionTypeTemplate" type="text/x-jquery-tmpl">
<option id="${'${'}codeName}" value="${'${'}codeName}">${'${'}markName}</option>
</script>

<!-- 메뉴 타이틀 -->
<script id="toggleMenuTemp" type="text/x-jquery-tmpl">
<h3 class="menu_title"><a href="#">${'${'}subjectAreaNm}</a></h3>
<ul class="menu_ul" id="${'${'}subjectAreaId}">
	
</ul>	
</script>

<!-- 메뉴 리스트 -->
<script id="toggleSubMenuTemp" type="text/x-jquery-tmpl">
<li id="${'${'}fieldId}">${'${'}fieldKroNm}</li>
</script>

<!-- 필드 조건 편집 템플릿 -->
<script id="draggableTemp" type="text/x-jquery-tmpl">
<li class="draggable_list" id="${'${'}id}" filterId="">
	<div class="in_select select_and">
		<select onChange="changeAndOr(this)">
			<option value="1" selected="selected">AND</option>
			<option value="2">OR</option>
		</select>
	</div>
	<span class="field_row_label" id="${'${'}text}">${'${'}text}</span>
	<div class="right_area">
		<button class="btn_filter">
			<img src="<ifvm:image name='ico_setting' />" alt="" class="filter_ico" />
			<spring:message code="marketing.userTargeting.filterSettings"/>
		</button>
		
		<ifvm:input type="text" className="in_text text-right" disabled="true" placeholder="marketing.userTargeting.count" />
	</div>			
	<p class="field_txt_area"><spring:message code="marketing.userTargeting.filterSettingValue"/></p>
	
	<a href="javascript:;" class="draggable_close"><img src="<ifvm:image name='ico_close' />" alt="" /></a>
</li>
</script>

<div class="user_targeting_area">
	<div class="page-title">
		<h1>
			<spring:message code="marketing.userTargeting.selectedEligible"/>
			<span> &gt; <spring:message code="marketing.targeting.list"/></span>
		</h1>
	</div>
	<div id="adminCon">
		<!-- 좌측 아코디언 -->
 		<div id="basicAccordion" class="left_userTargeting">
			<h2>
				<a href="#"><spring:message code="marketing.userTargeting.conditionsSet"/></a>
			</h2>
			<div class="menu_wrap" id="menuArea">
				
			</div>
		</div>
		<!-- 우측 컨텐츠 -->
		<div class="right_userTargeting">
			<div class="page_btn_area">
				<div class="col-xs-7">
					<span><spring:message code="marketing.userTargeting.targetLevel"/><span class="level_label" id="targetLevelNm"></span></span>
				</div>
				<div class="col-xs-5 searchbtn_r">
					<button class="btn btn-sm" id="targetSegmentSaveBtn">
						<i class="glyphicon glyphicon-check"></i>
						<spring:message code="marketing.common.save"/>
					</button> 
				</div>
			</div>
			<div class="well">
				<p class="user_description"><spring:message code="marketing.userTargeting.newFilterAdd"/></p>
				<div id="userTargetingTab" class="round_tab">
					<ul>
						<li><a href="#fieldConditionTab"><spring:message code="marketing.userTargeting.editFieldConditions"/></a></li>
						<li><a href="#sqlConfirmTab" id="sqlConfirm"><spring:message code="marketing.userTargeting.verifySQL"/></a></li>
					</ul>
					<!-- 필드 조건편집 -->
					<div id="fieldConditionTab">
						<div class="field_condition_top">
							<p class="field_label">
								<spring:message code="marketing.userTargeting.chooseField"/> <!-- 선택 필드 -->
								<span><span id="selectedFilterCnt">0</span> <spring:message code="marketing.userTargeting.items"/></span>
							</p> 
							<p class="field_label">
								<spring:message code="marketing.userTargeting.fullextractCustomers"/> <!-- 전체 추출 고객 수 -->
								<span><span id="filterAllCnt">0</span> <spring:message code="marketing.userTargeting.persons"/></span>
							</p>
							<div class="pull-right right_area">
								<span class="field_label"><spring:message code="marketing.userTargeting.comparisonGroup"/></span>
								<ifvm:input type="select" className="in_select" id="compareSelect" />
								<ifvm:input type="text" className="in_text" id="compareValue"/>
								<button class="btn btn-sm btn_gray" id="countBtn"><spring:message code="marketing.userTargeting.countBtn"/></button>	<!-- count 버튼 -->
								<button class="btn btn-sm btn_gray" id="groupBtn" disabled="disabled">Group</button>
							</div>
							
						</div>
						<div id="fieldSelectArea" class="field_select_area">
							<ul>
						      <li class="placeholder">
							      <span class="font_bold"><spring:message code="marketing.userTargeting.noSelectedField"/></span><br />
							      <spring:message code="marketing.userTargeting.addDragLeftSelectField"/>
						      </li>
						    </ul>
						</div>
					</div>
					<!-- SQL 확인  -->
					<div id="sqlConfirmTab">
						<ifvm:input type="textarea" className="sql_readOnly" disabled="true" id="sqlQuery" />
					</div>
				</div>
			</div>
			
		</div>	 
	</div>
</div>

<div id="userTargetingPop" class="popup_container"></div>