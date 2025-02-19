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
		<!--[if lt IE 9]>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/html5shiv.js"></script>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/css3-mediaqueries.js"></script>
		<![endif]-->
		<title>실내위치 안내</title>
	</head>
	<body>
		<div id="wrap">
			<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content02/map3.gif" alt="" class="bg" />
		
			<div class="topBtn" style="height:14%;" >
			
				<div class="btnBox">
					<input type="image" src="${pageContext.request.contextPath}/resources/images/beacon/demo/btn/close01.png" class="topClose" onclick="javascript:appClose();" style="top:30%;" />
				</div>
			</div>
		</div>
	</body>
</html>