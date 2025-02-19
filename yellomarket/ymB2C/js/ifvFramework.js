
var frameworkUrl = "//img.yellomarket.co.kr/resources";
if( typeof frameworkReadyUrl != 'undefined' ){
	frameworkUrl = frameworkReadyUrl;
}else if( typeof frameworkUrlTest != 'undefined' ){
	frameworkUrl = "";
}
frameworkUrl += "/ifv-Framework/1.1/";

window.appServiceId;
window.country;
window.lang;

document.write("<link href='"+ frameworkUrl + "ifvCommon/css/reset.css' rel='stylesheet' type='text/css'>");
document.write("<link href='"+ frameworkUrl + "ifvCommon/css/button.css' rel='stylesheet' type='text/css'>");
document.write("<link href='"+ frameworkUrl + "ifvCommon/css/common.css' rel='stylesheet' type='text/css'>");

document.write("<script src='"+ frameworkUrl + "ifvCommon/js/jquery-1.8.3.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvCommon/js/jquery.tmpl.min.js' type='text/javascript'></script>");

document.write("<script src='"+ frameworkUrl + "ifvCommon/js/jquery.json-2.3.min.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvCommon/js/jquery-ui.min.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvCommon/js/jquery.watermark.min.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvCommon/js/templete.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvCommon/js/util.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvCommon/js/lib.js' type='text/javascript'></script>");

document.write("<script src='"+ frameworkUrl + "ifvPager/js/ifvPager.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvPager/js/ifvSimplePager.js' type='text/javascript'></script>");

document.write("<script src='"+ frameworkUrl + "ifvCalendar/js/ifvCalendarPop.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvPopup/js/ifvPopup.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvSearchBox/js/ifvSearchBox.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvSelectBox/js/ifvSelectBox.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvValidation/js/ifvValidation.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvAjax/js/ifvAjax.js' type='text/javascript'></script>");

document.write("<script src='"+ frameworkUrl + "ifvGrid/js/i18n/grid.locale-kr.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvGrid/js/jquery.jqGrid.src.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvGrid/js/ifvGrid.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvGrid/js/jquery.jqJSONPGrid.src.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvGrid/js/ifvJSONPGrid.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvUI/js/ifvAddRemove.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvCommon/js/jquery-ui-i18n.js' type='text/javascript'></script>");

document.write("<script src='"+ frameworkUrl + "ifvCommon/js/bootstrap-timepicker.js' type='text/javascript'></script>");

document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jquery.iframe-transport.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jquery.fileupload.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jquery.fileupload-ui.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jquery.fileupload-fp.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jquery.multiFilestyle.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/MultiUploader.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jQueryRotate.2.2.js' type='text/javascript'></script>");

document.write("<script src='"+ frameworkUrl + "ifvExcelReader/js/xlsx.core.min.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvExcelReader/js/cpexcel.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvExcelReader/js/ods.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvExcelReader/js/shim.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvExcelReader/js/jszip.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvExcelReader/js/xlsx.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvExcelReader/js/ifvExcelReader.js' type='text/javascript'></script>");


/*document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jquery.iframe-transport.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jquery.fileupload.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/ifvFileUpload.js' type='text/javascript'></script>");*/

/*document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/jquery.fileDownload.js' type='text/javascript'></script>");
document.write("<script src='"+ frameworkUrl + "ifvFileUploader/js/ifvFileDownload.js' type='text/javascript'></script>");*/

