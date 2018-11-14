var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
//	alert(keyValue);
	$(function() { //初始化

	})
	this.AcceptClickBackground = function() { //图片提交
		//		alert(111);
		var imgSrr = $("#picPath").val();
		if(imgSrr == "") {
			alert("请先上传缩略图。");
			return;
		}
		var postData = {}
		postData = escape(imgSrr);//图片路径
		
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/productinfo/UploadFile", //回访
			type: "POST",
			dataType: "json",
			data:{
				productInfoId:keyValue,
				thumbnailPath:postData
			},
			success: function(data) {
				console.log(data);
				dialogMsg(data.message, 1);
				dialogClose();
			},
			error: function(data) {
				console.log(data);
					dialogMsg(data.message, 2);
			}
		})
	}
};
var model = new viewModel();