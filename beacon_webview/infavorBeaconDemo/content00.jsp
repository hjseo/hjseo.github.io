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
			.btn {position:absolute; right:0; bottom:0; width:100%; height:13.8%;}
			.btn input[type=image]{ position:absolute; right:0; bottom:0; width:18.7%; hegiht:auto;}
		</style>
		<!--[if lt IE 9]>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/html5shiv.js"></script>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/css3-mediaqueries.js"></script>
		<![endif]-->
	</head>
	<body>
		<div id="wrap">
			<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content00/content00_main.jpg" alt="" class="bg" />
		
			<div class="btn">
				<input type="image" src="${pageContext.request.contextPath}/resources/images/beacon/demo/content00/close03.jpg" onclick="javascript:appClose();" />
			</div>
		</div>
	</body>
</html>