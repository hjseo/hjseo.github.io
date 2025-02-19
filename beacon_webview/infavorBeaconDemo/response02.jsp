<%@page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="ik" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>

<html lang="en-us"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<head>
		<meta charset="utf-8">
		
		<meta name="viewport" content="width=device-width; initial-scale=1.0" />
		
		<!-- Link to Google CDN's jQuery + jQueryUI; fall back to local -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
		<script>
			if (!window.jQuery) {
				document.write('<script src="${pageContext.request.contextPath}/resources/bootstrap/js/libs/jquery-2.0.2.min.js"><\/script>');
			}
		</script>

		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
		<script>
			if (!window.jQuery.ui) {
				document.write('<script src="${pageContext.request.contextPath}/resources/bootstrap/js/libs/jquery-ui-1.10.3.min.js"><\/script>');
			}
		</script>
		
		<!-- PAGE RELATED PLUGIN(S) -->
		<script src="${pageContext.request.contextPath}/resources/bootstrap/js/plugin/jquery-form/jquery-form.min.js"></script>
		<script src='${pageContext.request.contextPath}/resources/js/jquery.json-2.3.js' type="text/javascript"></script>
		<script src='${pageContext.request.contextPath}/resources/js/jquery.xml2json.js' type="text/javascript"></script>
		<script src='${pageContext.request.contextPath}/resources/js/jquery.selectboxes.js' type="text/javascript"></script>
		<script src='${pageContext.request.contextPath}/resources/js/jquery.tmpl.js' type="text/javascript"></script>
		
		<script src='${pageContext.request.contextPath}/resources/js/icekake/icekake.js' type="text/javascript"></script>
		
		<script>
		
		var resultControls;
		
		function parseHTML(items, containerId){
			if(items.length > 0){
				for(var i = 0;i<items.length;i++){
					var item = createControl(items[i]);
					$('#' + containerId).append(item);
				}
			}
		}
		
		function createControl(item){
			var rtnValue;
			
			switch (item.variableType) {
			case 'TEXT':
				rtnValue = $("#textTemplate").tmpl([item]);
				break;
			case 'RADIO':
				rtnValue = $("#radioTemplate").tmpl([item]);
				break;
			case 'CHECK':
				rtnValue = $("#checkTemplate").tmpl([item]);
				break;
			case 'SELECT':
				rtnValue = $("#selectTemplate").tmpl([item]);
				break;
			}
			
			return rtnValue;
		}
		
		function addOption(ctl, items){
			for(var i = 0;i<items.length;i++){
				ctl.add(new Option(items[i], items[i]), i)
			}
		}
		
		function setSaveData(){
			var rtnValue = [];
			for(var i = 0;i<resultControls.length;i++){
				var item = {};

				item.conditionId = resultControls[i].conditionId;
				switch (resultControls[i].variableType) {
				case 'TEXT':
					item.value = $('#' + resultControls[i].conditionId).val();
					break;
				case 'RADIO':
					var result = 
					    $('input:radio[name="'+resultControls[i].conditionId+'"]:checked')
					        .map(function() {
					            return $(this).val();
					        }).get();
					item.value = result[0];
					break;
				case 'CHECK':
					var result = '';
					var checkedCheckboxesValues = 
					    $('input:checkbox[name="'+resultControls[i].conditionId+'"]:checked')
					        .map(function() {
					            return $(this).val();
					        }).get();
					for(var j = 0;j<checkedCheckboxesValues.length;j++){
						result += checkedCheckboxesValues[j] + '#@;';
					}
					if(checkedCheckboxesValues.length > 0){
						result = result.substring(0,result.length - 3);
					}
					item.value = result;
					break;
				case 'SELECT':
					item.value = $('#' + resultControls[i].conditionId).val();
					break;
				}
				
				rtnValue.push(item);
			}
			
			return rtnValue;
		}
		
		$(document).ready(function() {
			var ctlObj = {};
			ctlObj.taskId = $.ikGetParam('taskId');
			
			$.ikPostJSON('/beacon/mbl/getUserReponseCtl.do', ctlObj,
			function(result) {
				resultControls = result.ctls;
				//$('#divDescription').text(result.ctls[0].description);
				parseHTML(result.ctls, 'container');
			});	
			
			$("#btnSubmit").click(function(){
				
				var obj = {};
				obj.type = $.ikGetParam('type');
				obj.uuid = $.ikGetParam('uuid');
				obj.regId = $.ikGetParam('regId');
				obj.memId = decodeURIComponent($.ikGetParam('memId'));
				obj.items = setSaveData();
				
				$.ikPostJSON('/beacon/mbl/saveResponse.do', obj,
				function(result) {
					location.href = 'infavor://closeWebView';
				});	
			});
		});
		</script>
<script id="textTemplate" type="text/x-jquery-tmpl">
<fieldset id="fld_${'${'}conditionId}">
	<section>
		<label class="label">${'${'}variableLabel}</label>
		<label class="input"> 
			<input name="${'${'}conditionId}" type="text" id="${'${'}conditionId}">
		</label>
	</section>
</fieldset>
</script>

<script id="selectTemplate" type="text/x-jquery-tmpl">
<fieldset id="fld_${'${'}conditionId}">
	<section>
		<label class="label">${'${'}variableLabel}</label>
			<label class="select">
				<select id="${'${'}conditionId}">
{{each(i, ci) codes}}
	<option value="${'${'}ci.codeValue}">${'${'}ci.displayValue}</option>
{{/each}} 
				</select>
				<i></i>
			</label>
	</section>
</fieldset>
</script>


<script id="checkTemplate" type="text/x-jquery-tmpl">
<fieldset id="fld_${'${'}conditionId}">
	<section>
		<label class="label">${'${'}variableLabel}</label>						   
{{each(i, ci) codes}}
		<span class="col-sm-2">
		<input type="checkbox" value="${'${'}ci.codeValue}" name="${'${'}conditionId}" placeholder=".col-sm-2">
		${'${'}ci.displayValue} 
		</span>
{{/each}} 
	</section>							
</fieldset>	
</script>

<script id="radioTemplate" type="text/x-jquery-tmpl">
<div class="text">
	${'${'}variableLabel}
</div>
<div class="radio">
{{each(i, ci) codes}}
    <input name="${'${'}conditionId}" type="radio" value="${'${'}ci.codeValue}">
    ${'${'}ci.displayValue}
	<br />
{{/each}} 	
</div>
</script>
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/beacon/demo/common.css" />
		<style>
			.box{
				width:100%; 
				height:53%; 
				position:absolute; 
				left:0; bottom:20%; 
				
			}
			.text{height:40%; padding-left:13%; padding-right:25%;}
			.radio{height:60%; padding:0 13%; }
			
			.btn{
				width:100%; 
				height:16%; 
				position:absolute; 
				left:0; bottom:0; 
				text-align:center;
			}
			.btn input[type=image]{ width:33%; }
			
		</style>
		<!--[if lt IE 9]>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/html5shiv.js"></script>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/css3-mediaqueries.js"></script>
		<![endif]-->
	</head>
	<body>
		<div id="wrap">
			<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content07/content07_survey_bg.JPG" alt="" class="bg" />
			
			<div class="box" id="container">
			</div>	
			<div class="btn">
				<input id="btnSubmit" type="image" src="${pageContext.request.contextPath}/resources/images/beacon/demo/content07/btn07.gif" />
			</div>		
		</div>
	</body>
</html>