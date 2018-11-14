"use strict";
var viewModel = function() {
	var self = this;
	//根据不同登录账号显示不同的公司名称
	var comSystemID_html = '';
	comSystemID_html += cm.comSystemName;
	comSystemID_html += '<strong style="font-weight: 400;">';
	comSystemID_html += cm.systemName;
	comSystemID_html += '</strong>';
	$("#smallNameID").html(cm.smallSystemName);
	$("#comSystemID").html(comSystemID_html);
	
	var Imageurl = sessionStorage.getItem("headIcon");
	if(Imageurl == cm.domain+"/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist="){
//		alert("哈哈哈哈哈")
		$(".user-image, .img-circle").attr("src", "../../static/lib/images/head/user2.jpg");
	}else{
//		alert("哈哈")
		$(".user-image, .img-circle").attr("src", (sessionStorage.getItem("headIcon")+"&token="+cm.token));
	}
	
}

var model = new viewModel();








//"use strict";
//var viewModel = function() {
//	var self = this;
//	//根据不同登录账号显示不同的公司名称
//	var comSystemID_html = '';
//	comSystemID_html += cm.comSystemName;
//	comSystemID_html += '<strong style="font-weight: 400;">';
//	comSystemID_html += cm.systemName;
//	comSystemID_html += '</strong>';
//	$("#smallNameID").html(cm.smallSystemName);
//	$("#comSystemID").html(comSystemID_html);
//
//	var Imageurl = sessionStorage.getItem("headIcon");
//	var new_img_url = Imageurl + '&token=' + cm.token;
//	//	if(Imageurl == '' || Imageurl == "null" || Imageurl == null) {
//	//		$(".user-image, .img-circle").attr("src", "../../static/lib/images/head/user2-160x160.jpg");
//	//	} else {
//	//		$(".user-image, .img-circle").attr("src", (top.contentPath + sessionStorage.getItem("headIcon")));
//	//	}
//	$(function() {
//		var rs = self.getURL(new_img_url);
//		//console.log(rs);
//		if(rs == false){
//			$(".user-image, .img-circle").attr("src", "../../static/lib/images/head/user2.jpg");
//		}
//		else{
//			$(".user-image, .img-circle").attr("src", (sessionStorage.getItem("headIcon")+"&token="+cm.token));
////			$(".user-image, .img-circle").attr("src", (top.contentPath + sessionStorage.getItem("headIcon")));
//		}
//			
//	});
//
//	this.getURL = function(new_img_url) {
//		var xmlhttp = new window.XMLHttpRequest();
//		xmlhttp.open("post", new_img_url, false);
//		xmlhttp.send();
//		if(xmlhttp.readyState == 4) {
//			if(xmlhttp.Status != 200)
//				return false //alert("不存在");
//			else
//				return true;
//			//return xmlhttp.Status == 200;
//		}
//	}
//}
//
//var model = new viewModel();