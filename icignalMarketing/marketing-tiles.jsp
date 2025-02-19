<%@ page import="infavor.framework.util.Common"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="ifvm"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <title>iCignal Marketing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <script data-pace-options='{ "restartOnRequestAfter": true }' src="${pageContext.request.contextPath}/resources/bootstrap/js/plugin/pace/pace.min.js"></script>
    
    <!--[if lt IE 9]>
    <script src='${pageContext.request.contextPath}/resources/js/html5shiv.js' type="text/javascript"></script>
    <script src='${pageContext.request.contextPath}/resources/js/respond.min.js' type="text/javascript"></script>
    <![endif]-->
    
 	<script type="text/javascript">var frameworkReadyUrl = '<%= Common.getInstance().getCDNServerUrl() %>/resources';</script>
    <script src='<%= Common.getInstance().getCDNServerUrl() %>/resources/ifv-Framework/1.2/ifvCommon/js/ifvFramework.js' type="text/javascript"></script>
    
    
    <jsp:include page="/WEB-INF/views/layouts/marketing/sessionScript.jsp" />
    <jsp:include page="/WEB-INF/views/layouts/marketing/templete.jsp" />
    <jsp:include page="/WEB-INF/views/layouts/marketing/marketing-common.jsp" />
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/i18n/jquery-ui-i18n.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/lib/util.js"></script>
    <script src='${pageContext.request.contextPath}/resources/js/lib/uuid.js' type="text/javascript"></script>
    <script src="${pageContext.request.contextPath}/resources/js/marketing/popup.js" type="text/javascript"></script>
    
    <!-- BOOTSTRAP -->
    <script src="${pageContext.request.contextPath}/resources/bootstrap/js/bootstrap/bootstrap.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/bootstrap/js/notification/SmartNotification.min.js"></script>
    <link rel="stylesheet" type="text/css" media="screen" href="${pageContext.request.contextPath}/resources/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="${pageContext.request.contextPath}/resources/bootstrap/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="${pageContext.request.contextPath}/resources/bootstrap/css/smartadmin-production.css">
    
    <!-- syncfusion Start -->
    <script src="${pageContext.request.contextPath}/resources/js/syncfusion/scripts/knockout.min.js"></script>
    
    <script src="${pageContext.request.contextPath}/resources/js/syncfusion/scripts/jquery.globalize.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/syncfusion/scripts/jsrender.min.js"></script>
    
    <link href="${pageContext.request.contextPath}/resources/js/syncfusion/themes/default-theme/ej.widgets.all.min.css" rel="stylesheet" />
    <link href="${pageContext.request.contextPath}/resources/js/syncfusion/themes/default.css" rel="stylesheet" />
    <link href="${pageContext.request.contextPath}/resources/js/syncfusion/themes/default-responsive.css" rel="stylesheet" />
    <script src="${pageContext.request.contextPath}/resources/js/syncfusion/scripts/jquery.easing.1.3.min.js" type="text/javascript"></script>
    <script src="${pageContext.request.contextPath}/resources/js/syncfusion/scripts/ej.web.all.min.js" type="text/javascript"></script>
    <script src="${pageContext.request.contextPath}/resources/js/syncfusion/scripts/properties.js" type="text/javascript"></script>
    <%-- <script src="${pageContext.request.contextPath}/resources/js/syncfusion/scripts/watch.min.js"></script> --%>
    <!-- syncfusion End -->
    
    <!-- FAVICONS -->
    <link rel="shortcut icon" href="${pageContext.request.contextPath}/resources/images/favicon/icignal.ico" type="image/x-icon">
    <link rel="icon" href="${pageContext.request.contextPath}/resources/images/favicon/icignal.png" type="image/x-icon">
    
    <!-- style -->
    <link rel="stylesheet" type="text/css" media="screen" href="${pageContext.request.contextPath}/resources/css/common/common.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="${pageContext.request.contextPath}/resources/css/marketing/style.css" />
	
</head>
<body>
    <!--[if IE 7]>
    <h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>
    <![endif]-->
    <div id="wrapper">
        <tiles:insertAttribute name="marketingHeader" />
        <tiles:insertAttribute name="marketingLeft" />
        <div id="main" role="main">
            <div id="content">
                <tiles:insertAttribute name="content" />
            </div>
        </div>
    </div>
    <script src="${pageContext.request.contextPath}/resources/bootstrap/js/app.js"></script>
</body>
</html>