var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	$(function() {
		$("#Account").val(request('Account'));
		$("#RealName").val(request('RealName'));
	})
	//保存事件
	this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}
		var postData = $("#form1").GetWebControls(keyValue);
		postData["Password"] = $.md5($.trim($("#Password").val()))
		$.SaveForm({
			url: "/BaseManage/User/SaveRevisePassword?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {}
		})
	}
};

var model = new viewModel();