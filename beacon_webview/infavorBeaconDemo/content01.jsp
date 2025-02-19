<%@page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="ik" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>

<html lang="en-us">
	<head>
		<meta charset="utf-8">
		<!--<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">-->

		<title> Infavor Beacon Manager</title>
		<meta name="description" content="">
		<meta name="author" content="">

		<!-- Use the correct meta names below for your web application
			 Ref: http://davidbcalhoun.com/2010/viewport-metatag 
			 
		<meta name="HandheldFriendly" content="True">
		<meta name="MobileOptimized" content="320">-->
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">

		
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
			var control;
			var lblControl;
			
			switch (item.variableType) {
			case 'TEXT':
				/* control = document.createElement('input');
				$(control).attr('id', item.variableName);
				$(control).attr('type', 'text'); 
				$(control).data('obj', item);
				$(rtnValue).append(control); */
				rtnValue = $("#textTemplate").tmpl([item]);
				break;
			case 'LIST':
				control = document.createElement('div');
				break;
			case 'RADIO':
				rtnValue = $("#radioTemplate").tmpl([item]);
				break;
			case 'CHECK':
				rtnValue = $("#checkTemplate").tmpl([item]);
				break;
			case 'SELECT':
				/* control = document.createElement('select');
				$(control).attr('id', item.variableName);
				addOption(control, item.codes); 
				$(control).data('obj', item);
				$(rtnValue).append(control); */
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
					item.value = $('#' + resultControls[i].variableName).val();
					break;
				case 'LIST':
					break;
				case 'RADIO':
					var result = 
					    $('input:radio[name="'+resultControls[i].variableName+'"]:checked')
					        .map(function() {
					            return $(this).val();
					        }).get();
					item.value = result[0];
					break;
				case 'CHECK':
					var result = '';
					var checkedCheckboxesValues = 
					    $('input:checkbox[name="'+resultControls[i].variableName+'"]:checked')
					        .map(function() {
					            return $(this).val();
					        }).get();
					for(var j = 0;j<checkedCheckboxesValues.length;j++){
						result += checkedCheckboxesValues[j] + ',';
					}
					if(checkedCheckboxesValues.length > 0){
						result = result.substring(0,result.length - 1);
					}
					item.value = result;
					break;
				case 'SELECT':
					item.value = $('#' + resultControls[i].variableName).val();
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
<fieldset id="${'${'}conditionId}">
	<section>
		<label class="label">${'${'}description}</label>
		<label class="input"> 
			<input name="name" type="text" id="${'${'}variableName}" class="${'${'}variableName}">
		</label>
	</section>
</fieldset>
</script>

<script id="selectTemplate" type="text/x-jquery-tmpl">
<fieldset id="${'${'}conditionId}">
	<section>
		<label class="label">${'${'}description}</label>
			<label class="select">
				<select id="${'${'}variableName}">
{{each(i, ci) codes}}
	<option value="${'${'}ci}">${'${'}ci}</option>
{{/each}} 
				</select>
				<i></i>
			</label>
	</section>
</fieldset>
</script>


<script id="checkTemplate" type="text/x-jquery-tmpl">
<fieldset id="${'${'}conditionId}">
	<section>
		<label class="label">${'${'}description}</label>						   
{{each(i, ci) codes}}
		<span class="col-sm-2">
		<input type="checkbox" value="${'${'}ci}" name="${'${'}variableName}" placeholder=".col-sm-2">
		${'${'}ci} 
		</span>
{{/each}} 
	</section>							
</fieldset>	
</script>

<script id="radioTemplate" type="text/x-jquery-tmpl">
<fieldset id="${'${'}conditionId}">
	   <section>
		<label class="label">${'${'}description}</label>
{{each(i, ci) codes}}
		<span class="col-sm-6">
		<input name="${'${'}variableName}" type="radio" placeholder=".col-sm-6" value="${'${'}ci}">
		${'${'}ci}  
		</span>
{{/each}} 	
	</section>
</fieldset>	
</script>

<script id="selectTemplate" type="text/x-jquery-tmpl">
</script>

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/beacon/demo/common.css" />
		<style>
			.box{
				width:100%; 
				height:20%; 
				position:absolute; 
				left:0; bottom:20%; 
				text-align:center;
			}
			.text{height:25%; padding-top:5%;}
			.radio{height:30%; padding-top:5%;}
			
			.btn{
				position:absolute; 
				left:0; bottom:0; 
				width:100%;
				height:15%;
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
			<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content01/content01_select_bg.jpg" alt="" class="bg" />
			
			<div class="box">
				<div class="text">
					성별을 선택해주세요.
				</div>
				<div class="radio">
				    <input type="radio" name="sex" id="male" value="male">
				    <label for="male">남자</label>
				  
				    <input type="radio" name="sex" id="female" value="female">
				    <label for="female">여자</label>
					   
				</div>
			</div>	
			<div class="btn">
				<input type="image" src="${pageContext.request.contextPath}/resources/images/beacon/demo/content01/btn01.gif" />
			</div>		
		</div>
	</body>
</html>

