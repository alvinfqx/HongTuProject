var viewModel = function() {
	var self = this;
	var categoryId = request('categoryId');
	//保存事件
	this.AcceptClick = function() {
		var postData = $("#form1").GetWebControls("");
		postData["categoryId"] = categoryId;
		$.SaveForm({
			url:"/SystemManage/Log/RemoveLog",
			param: postData,
			loading: "正在清空数据...",
			success: function() {
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();