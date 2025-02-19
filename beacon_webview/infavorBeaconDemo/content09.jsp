<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width; initial-scale=1.0" />
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/beacon/demo/common.css" />
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/beacon/demo/idangerous.swiper.css" />
		<script>
			function appClose(){
				debugger;
				location.href = 'infavor://closeWebView';
			}
		</script>
		<style>
			
			html{height:100%;}
			body{height:100%;}
			#wrap{position:relative; height:auto; padding-bottom:53%; background:#e3e3e3;}
			.box{position:absolute;
				left:0; bottom:0;
				width:100%;
				height:37%;
				overflow:hidden; 
				margin-left:-13%;
				padding-right:13%;
			}
			.swiper-container{ 
				width:60%;
				height:auto;
				text-align:center;
			}
			
			.swiper-slide {
				box-sizing:border-box;
				-moz-box-sizing:border-box; 
				padding:0 1%;
			}
			.swiper-slide img{width:100%; height:auto;}
			.pagination{position:absolute;z-index:20;left:10px;bottom:10px;}
			
		</style>
		<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/jquery-1.10.1.min.js"></script>
		<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/idangerous.swiper.js"></script>
		<!--[if lt IE 9]>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/html5shiv.js"></script>
			<script src="${pageContext.request.contextPath}/resources/js/beacon/demo/css3-mediaqueries.js"></script>
		<![endif]-->
		<title>workFlow</title>
	</head>
	<body>
		<div id="wrap">
			<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content09/content09_workflow_bg.jpg" alt="" class="bg" />
			
			<div class="box">
				<div class="swiper-container">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content09/taskType_01.jpg" alt="" />
						</div>
						<div class="swiper-slide">
							<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content09/taskType_02.jpg" alt="" />
						</div>
						<div class="swiper-slide">
							<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content09/taskType_03.jpg" alt="" />
						</div>
						<div class="swiper-slide">
							<img src="${pageContext.request.contextPath}/resources/images/beacon/demo/content09/taskType_04.jpg" alt="" />
						</div>
					</div>
					<div class="pagination"></div>
				</div>
				<script>
					var mySwiper = new Swiper('.swiper-container',{
				    	pagination: '.pagination',
				    	paginationClickable: true
					})
				</script>
			</div>
			
			<div class="topBtn" style="height:4.3%;">
			
				<div class="btnBox">
					<input type="image" src="${pageContext.request.contextPath}/resources/images/beacon/demo/btn/close01.png" class="topClose" style="padding:0; margin-top:2%;" onclick="javascript:appClose();" />
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