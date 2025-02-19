<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width; initial-scale=1.0" />
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/beacon/demo/common.css" />
		<style>
			#wrap {padding-bottom:19%; background:#90c1bb;}
		</style>
		<script>
			function appClose(){
				debugger;
				location.href = 'infavor://closeWebView';
			}
		</script>
		<!--[if lt IE 9]>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/html5shiv.js"></script>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/css3-mediaqueries.js"></script>
		<![endif]-->
		<title>인페이버 비콘</title>
	</head>
	<body>
		<div id="wrap">
			<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content08/content08_infavorBeacon.jpg" alt="" class="bg" />
		
			<div class="topBtn">
			
				<div class="btnBox">
					<input type="image" src="${pageContext.request.contextPath}/resources/images/beacon/demo/btn/close01.png" class="topClose" onclick="javascript:appClose();" />
				</div>
			</div>
			<div class="bottomBtn">
			
				<div class="btnBox">
					<input type="image" src="${pageContext.request.contextPath}/resources/images/beacon/demo/btn/close02.png" class="bottomClose" onclick="javascript:appClose();" />
				</div>
			</div>
		</div>
	</body>
</html>