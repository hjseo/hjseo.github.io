<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="ifvm" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script>
var filterBtn;
var filterSetPopGrid; 
var storeArray = [];

function filterBtn(_this){
	filterBtn = _this;
}




//필터 상세 조회
function getFilter(){
		$.ifvSyncPostJSON('<ifvm:action name="getFieldvalue"/>',{filterId : filterId}
		,function(result) {
			
			var filterValue = "";
			var filterKeycode = "";
			
			for(var i=0; i<result.length; i++){
				
				/* if(result[i].groupFuncType != null && result[i].groupFuncType.length > 0){
					
					//그룹 조회
					$("#groupNm").val(result[i].groupFuncType);
					$("#fcon2").val(result[i].criteriaType);
					$("#fValue2").val(result[i].filterValue);
					//obj.groupfilterKeycode = $("#fValue2").text();
					
					
				}
				else{ */
					
					$("#groupNm").val(result[i].groupFuncType);
					
					if(result[i].criteriaType == "BETWEEN"){
						$("#between").show();
					}
					
					if(result[i].criteriaType =="CUSTDTDEF"){
						
						//사용자날짜정 일 경우 그리드 출력
						filterDefSetPopGrid();
						
					}
					
					$("#fcon").val(result[i].criteriaType);
					$("#andValue").val(result[i].filterAttrib1);
					
					if(i == result.length-1){
						//필터 조회
						filterValue += result[i].filterValue;
					}
					else{
						//필터 조회
						filterValue += result[i].filterValue + ",";
					}
					
					if(i == result.length-1){
						//필터코드 조회
						filterKeycode += result[i].filterKeycode;
					}
					else{
						//필터코드 조회
						filterKeycode += result[i].filterKeycode + ",";
					}
					
					
				//}
				
			}
			
			if(filterValue != null && filterValue.length > 0 && filterValue != 'null'){
				$("#fValue").val(filterValue);
			}
			
			if(filterKeycode!= null && filterKeycode.length > 0 && filterKeycode != 'null'){
				$("#fValue").text(filterKeycode);
			}
			 
		});
}


//타겟 테이블 컬럼 저장
function setFillter(){
	
	var obj = {};
	validation = $("#FormArea").ifvValidation();
	
	if(validation.confirm()){
		
		var fieldId = selectedFilterId.split("_")[0];
		
		//andor 조회
		if($("#" + selectedFilterId).find('select').eq(0).val() == '1'){
			obj.andOr = 'AND';
		}
		else{
			obj.andOr = 'OR';
		}
		
		//필터 순서 조회
		obj.filterSeq = selectedFilterId.split("_")[1].split('temp')[1];
		
		/* for(var i=1; i<=$("#fieldSelectArea").children().find('li').length; i++){
			
			if(selectedFilterId == $("#fieldSelectArea").children().find('li').eq(i).attr('id')){
				obj.filterSeq = i;
			}
		} */
		
		//세그먼트 아이디 저장
		obj.segmentId = confilterid;
		

		//필터 저장
		obj.criteriaType = $("#fcon").val();
		obj.filterValue = $("#fValue").val();
		
		debugger;
		var splitValue = "";
		
		if($("#fValue").text() != 'null' && $("#fValue").text() != ''){
			
			var splitFilter = $("#fValue").val().split(',');
			
			for(var i=0; i<splitFilter.length; i++){
				
				for(var k=0; k<filterSetPopGrid.getRowData().length; k++){
					
					if(splitFilter[i] == filterSetPopGrid.getRowData()[k].vName){
						
						if(k==filterSetPopGrid.getRowData().length){
							splitValue += filterSetPopGrid.getRowData()[k].keyCode;
						}
						else{
							splitValue += filterSetPopGrid.getRowData()[k].keyCode + ",";
						}
						
					}
				}
			}
			
			if(splitValue != "" && splitValue.length > 0){
				obj.filterKeycode = splitValue;
			}
			
			//obj.filterKeycode = $("#fValue").text();
		}
		obj.filterAttrib1 =  $("#andValue").val();
		obj.fieldId = fieldId;
		
		if(filterId != null && filterId.length > 0){
			obj.filterId = filterId;
		}
		
		//그룹 저장
		if($("#groupNm").val() != "NOTUSED"){
			obj.groupFuncType = $("#groupNm").val();
		}
		obj.groupcriteriaType = $("#fcon2").val();
		obj.groupfilterValue = $("#fValue2").val();
		obj.groupfilterKeycode = $("#fValue2").text();
		//obj.groupfilterAttrib1 =  $("#between2").text();
		
		debugger;
		
		var isValid = true; 
		
		if($("#fcon").val() != 'IN' && $("#fcon").val() != 'NOT IN'){
			
			var stringRegx = /,/gi; 
			
			if(stringRegx.test($("#fValue").val())) { 
			isValid = false; 
			} 
			  
		}
		
		if(isValid){
			
			$.ifvSyncPostJSON('<ifvm:action name="setFilterValue"/>',obj
			,function(result) {
				
				//필터 조건  셋팅
				
				if($("#fcon").val() != "BETWEEN"){
					var conditionValue = $("#fcon").val() + " : " + $("#fValue").val();
					$("#" + selectedFilterId).find('p').text(conditionValue);
				}
				else{
					var conditionValue = $("#fcon").val() + " : " + $("#fValue").val() + " AND " + $("#andValue").val();
					$("#" + selectedFilterId).find('p').text(conditionValue);
				}
				
				
				
				//필터 아이디 셋팅
				$("#" + selectedFilterId).attr("filterId", result.message);
				alert('<spring:message code="marketing.targeting.saveDone"/>');
				//userTargetingPopClose();
				
				userTargetingPopClose();
			});
			
		}
		else{
			alert('<spring:message code="marketing.userTargeting.multiValueAlert"/>');
		}
	}	
}


//타겟 테이블 컬럼 수정
function modifyFillter(){
	 var obj = {};

	validation = $("#FormArea").ifvValidation();
	
	if(validation.confirm()){
		obj.criteriaType = $("#fcon").val();
		obj.filterValue = $("#fValue").val();
		obj.filterKeycode = $("#fValue").text();
		obj.fieldId = confilterid;

		$.ifvSyncPostJSON('<ifvm:action name="editFilterValue"/>',obj
		,function(result) {
			alert('<spring:message code="marketing.targeting.modifyDone"/>');
		});
		
		obj.groupFuncType = $("#groupNm").val();
		obj.criteriaType = $("#fcon2").val();
		obj.filterValue = $("#fValue2").val();
		obj.fieldId = confilterid;
		
		$.ifvSyncPostJSON('<ifvm:action name="editFilterValue"/>',obj
		,function(result) {
			 alert('<spring:message code="marketing.targeting.modifyDone"/>');
		});
	} 
	
}


function filterSetPopGrid(){
	
	debugger;
	
	var jqGridOption = {
		onSelectRow : function (data) {
			
		},
		serializeGridData : function( data ){
			data.id = selectedFilterId.split("_")[0];
			data.enableNA = false;
		},	
		url: '<ifvm:action name="getFieldValueList"/>',
	    colNames:[
				  '<spring:message code="marketing.userTargeting.code"/>',
	              '<spring:message code="marketing.userTargeting.value"/>',
	              'code',
	              ],
	    colModel:[
			{name:'vCode',index:'v_code', resizable : false},
			{name:'vName',index:'fvv.v_name', resizable : false},
			{name:'keyCode',index:'fvv.key_code', resizable : false,hidden : true}
	    ],
	    multiselect : true,
	    sortname: 'fvv.v_name',
		sortorder: "desc",
	    tempId : 'ifvGridOriginTemplete2'
	};
	filterSetPopGrid = $("#filterSetPopGrid").ifvGrid({ jqGridOption : jqGridOption });
}

function filterDefSetPopGrid(){
	
	debugger;
	
	var jqGridOption = {
		onSelectRow : function (data) {
			
		},
		serializeGridData : function( data ){
			
		},	
		url: '<ifvm:action name="getFieldDefValue"/>',
	    colNames:[
				  '<spring:message code="marketing.userTargeting.code"/>',
	              '<spring:message code="marketing.userTargeting.value"/>',
	              'code',
	              ],
	    colModel:[
			{name:'vCode',index:'code_Name', resizable : false},
			{name:'vName',index:'mark_name', resizable : false},
			{name:'keyCode',index:'id', resizable : false,hidden : true}
	    ],
	    multiselect : true,
	    sortname: 'seq',
		sortorder: "desc",
	    tempId : 'ifvGridOriginTemplete2'
	};
	filterSetPopGrid = $("#filterSetPopGrid").ifvGrid({ jqGridOption : jqGridOption });
}

function selectOptionList() {
	debugger;
	
	var checkedList = filterSetPopGrid.getCheckedList();
	var textStore = null;
	var listFlowIdList = [];
	var temp = null;

	for( var i = 0; i < checkedList.length; i++ ){
		if(textStore == null){
			textStore = checkedList[i].vName;
			temp = checkedList[i].keyCode; 
		}
		else{
			textStore = textStore + ',' + checkedList[i].vName;
		    temp = temp + ',' + checkedList[i].keyCode;
		}
	}
	
	if(textStore != null){
		$("#fValue").val(textStore);
	}
	
	if(temp != null){
		$("#fValue").text(temp);
	}
	
}

function initoption(){
	//상태 값 코드
	$.ifvSyncPostJSON('<ifvm:action name="getCommCodeList"/>',{
		groupCode : 'MKT_SERC_OPRT_TYPE'
		, enableNA : true
	},function(result) {
		
		var temp = $("#commStatustemp").tmpl(result.rows);
		$("#fcon").append(temp);
	});
	debugger;
	//상태 값 코드
	$.ifvSyncPostJSON('<ifvm:action name="getCommCodeList"/>',{
		groupCode : 'MKT_SERC_OPRT_TYPE'
		, enableNA : true
	},function(result) {
		var store = []
		
		var size = result.rows.length;
		for(var i=0;i<size;i++){
			if(result.rows[i].attrib01 == "group")
			{
				var store2 = {}
				store2.codeName = result.rows[i].codeName
				store2.markName = result.rows[i].markName
				store.push(store2)
			}
		}
		
		var temp = $("#commStatustemp").tmpl(store);
		$("#fcon2").append(temp);
	});
	
}

function groupFuncList(){
	
	//상태 값 코드
	$.ifvSyncPostJSON('<ifvm:action name="getCommCodeList"/>',{
		groupCode : 'MKT_SEG_GROUP_CONDITION_TYPE'
		, enableNA : true
	},function(result) {
		var temp = $("#commStatustemp").tmpl(result.rows);
		$("#groupNm").append(temp);

		//그룹 미선택 추가
		var notSelect = {};
		notSelect.codeName = "NOTUSED";
		notSelect.markName = '<spring:message code="marketing.userTargeting.selectGroupList"/>';
		var tempGroup = $("#commStatustemp").tmpl(notSelect);
		$("#groupNm").prepend(tempGroup);
		
		
	});
	
}


$(document).ready(function(){
	
	//그룹 영역 숨김 - 현재 미사용 추후 사용가능
	$("#groupArea").hide();
	//필드명 셋팅
	$("#popFieldName").text(selectedFilterName);
	
	filterSetPopGrid();
	initoption();
	
	groupFuncList();
	
	if(filterId != null && filterId.length > 0){
		getFilter();
	}
	
	//취소
	$("#filterSetCancelBtn").on("click", function(){
		userTargetingPopClose();
	});
	
	//선택
	$("#selectField").on("click", function(){
		selectOptionList();
	});
	

	//취소
	$("#cancleField").on("click", function(){
		//$(".filter_textarea").val("");
		$("#fValue").val("");
		$("#fValue").text("");
		$("#andValue").val("");
		filterSetPopGrid.resetChecked();
	});
	 
	//취소
	$("#fcon").on("change", function(){
		
		if("BETWEEN" == $("#fcon option:selected").text()) $("#between").show();
		else{
			$("#between").hide();
			$("#between").val("");
		}
		
		debugger;
		
		if("CUSTDTDEF" == $("#fcon option:selected").val()){
			
			filterDefSetPopGrid();
			//filterDefSetPopGrid.requestData({fType:this.value});
			
		}
		
		
	});
	
	//취소
	$("#fcon2").on("change", function(){
		
		if("BETWEEN" == $("#fcon2 option:selected").text()) $("#between2").show();
		else{
			$("#between2").hide();
			$("#between2").val("");
		}
	});
	
	//저장
	$("#filterSetSaveBtn").on("click", function(){
		
		setFillter();
		
		//저장 성공시 필터설정 버튼 변경
		filterSetBtnUI(filterBtn);
		
	});
	
	//초기화 버튼
	$("#initValue").on("click", function(){
		
		$("#fValue").val("");
		$("#fValue").text("");
		$("#andValue").val("");
		
		$("#fcon").html("");
		$("#groupNm").html("");
		$("#andValue").val("");
		$("#between").hide();
		
		initoption();
		groupFuncList();
		
		var jqGridOption = {
		onSelectRow : function (data) {
			
		},
		serializeGridData : function( data ){
			data.id = selectedFilterId.split("_")[0];
			data.enableNA = false;
		},	
		url: '<ifvm:action name="getFieldValueList"/>',
	    colNames:[
				  '<spring:message code="marketing.userTargeting.code"/>',
	              '<spring:message code="marketing.userTargeting.value"/>',
	              'code',
	              ],
	    colModel:[
			{name:'vCode',index:'v_code', resizable : false},
			{name:'vName',index:'fvv.v_name', resizable : false},
			{name:'keyCode',index:'fvv.key_code', resizable : false,hidden : true}
	    ],
	    multiselect : true,
	    sortname: 'fvv.v_name',
		sortorder: "desc",
	    tempId : 'ifvGridOriginTemplete2'
	};
	filterSetPopGrid = $("#filterSetPopGrid").ifvGrid({ jqGridOption : jqGridOption });
		
		//filterSetPopGrid();
		
	});
	
	//조건 between일 때 and 입력창
	//$(".between_row").show();
	
	
	
	
	
});
</script>

	
<script id="commStatustemp" type="text/x-jquery-tmpl">
<option value="${'${'}codeName}">${'${'}markName}</option>
</script>

<div class="pop_inner_wrap filter_wrap">

	<div class="filter_left" id="FormArea">
	
		<!-- 필터 조건 -->
		<div class="temp_title">
			<spring:message code="marketing.userTargeting.filterCriteria"/>
		</div>
		<div class="group_box_bg2 filter_condition">
			<!-- 필드명 -->
			<div class="row row_bottom">
				<label class="filter_label text-right"><spring:message code="marketing.userTargeting.fieldName"/></label>
				<span class="field_name" id="popFieldName"></span>
			</div>
			<!-- 조건 -->
			<div class="row row_bottom">
				<label class="filter_label text-right"><spring:message code="marketing.userTargeting.condition"/></label>
				<ifvm:input type="select" className="filter_input" id="fcon"/>
			</div>
			
			<!-- 그룹 조건 -->
			<div class="row row_bottom">
				<label class="filter_label text-right"><spring:message code="marketing.userTargeting.group"/></label>
				<ifvm:input type="select" className="filter_input" id="groupNm"/>
			</div>
				
			<!-- 값 -->
			<div class="row row_bottom">
				<label class="filter_label text-right"><spring:message code="marketing.userTargeting.value"/></label>
				<ifvm:input type="text" className="long_text" id="fValue"/>
			</div>
			<!-- and -->
			<div class="row between_row" id="between">
				<label class="filter_label text-right"><spring:message code="marketing.userTargeting.and"/></label>
				<ifvm:input type="text" className="long_text" id="andValue"/>
			</div>
			
			<div class="row row_bottom">
				<spring:message code="marketing.userTargeting.multiValueDesc"/>
			</div>
			
			<div class="row row_bottom">
				<spring:message code="marketing.userTargeting.multiValueSample"/>
			</div>
		</div>
		
		<div id="groupArea">
			<!-- 그룹 함수 -->
			<div class="temp_title">
				<spring:message code="marketing.userTargeting.groupFunc"/>
			</div>
			<div class="group_box_bg2 group_func">
				<!-- 그룹 -->
				<div class="row row_bottom">
					<label class="filter_label text-right"><spring:message code="marketing.userTargeting.group"/></label>
					<ifvm:input type="select" className="filter_input" id="groupNm_notUsed"/>
				</div>
				<!-- 조건 -->
				<div class="row row_bottom">
					<label class="filter_label text-right"><spring:message code="marketing.userTargeting.condition"/></label>
					<ifvm:input type="select" className="filter_input" id="fcon2_notUsed"/>
				</div>
				<!-- 값 -->
				<div class="row row_bottom">
					<label class="filter_label text-right"><spring:message code="marketing.userTargeting.value"/></label>
					<ifvm:input type="text" className="long_text" id="fValue2_notUsed"/>
				</div>
				<!-- and -->
				<div class="row between_row" id="between2">
					<label class="filter_label text-right"><spring:message code="marketing.userTargeting.and"/></label>
					<ifvm:input type="text" className="long_text" id="andValue2_notUsed"/>
				</div>
			</div>
		</div>
	</div>
	<div class="filter_right">
		<!-- 목록 선택 -->
		<div class="temp_title">
			<spring:message code="marketing.userTargeting.selectionList"/>
			<div class="pop_top_btn">
				<button class="btn_pop_white" id="selectField">
			        <img src="<ifvm:image name='ico_check' />" alt="">
			      	<spring:message code="marketing.common.select"/>
			    </button>  
			    <button class="btn_pop_white" id="cancleField">  
			        <img src="<ifvm:image name='btn_delete' />" alt="">
			      	<spring:message code="marketing.common.cancel"/>
			   </button> 
			</div>
		</div>
		<div id="filterSetPopGrid" class="grid_bd0 con_size"></div>
	</div>
	
	
</div>
<div class="pop_btn_area">
	<button class="btn btn-sm btn_gray" id="filterSetSaveBtn">  
		<i class="glyphicon glyphicon-check"></i>       
		<spring:message code="marketing.common.save"/>
	</button> 
	<button class="btn btn-sm btn_lightGray2" id="initValue">  
		<spring:message code="marketing.common.init"/>
	</button>
	<button class="btn btn-sm btn_lightGray2" id="filterSetCancelBtn">         
		<spring:message code="marketing.common.cancel"/>
	</button>
</div> 
