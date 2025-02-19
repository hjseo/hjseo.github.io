<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width; initial-scale=1.0" />
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/beacon/demo/common.css" />
		<script>
			function appClose(){
				debugger;
				location.href = 'infavor://closeWebView';
			}
		</script>
		<style>
			.box{
				width:100%; 
				height:25%; 
				position:absolute; 
				left:0; bottom:0; 
				text-align:center;
			}
			.btn input[type=image]{width:33%;}
		</style>
		<!--[if lt IE 9]>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/html5shiv.js"></script>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/css3-mediaqueries.js"></script>
		<![endif]-->
		<title></title>
	</head>
	<body>
		<div id="wrap">
			<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content06/content06_information_bg.JPG" alt="" class="bg" />
			
			<div class="box">
				
				<div class="btn">
					<input id="btnSubmit" onclick="javascript:appClose();" type="image" src="${pageContext.request.contextPath}/resources/images/beacon/demo/content06/btn06.gif" />
				</div>
			</div>			
		</div>
	</body>
</html>