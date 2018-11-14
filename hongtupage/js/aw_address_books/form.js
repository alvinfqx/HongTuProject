var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');

	$(function() {
		self.initControl();
	});
	//初始化控件
	this.initControl = function() {
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AfterSaleManage/client_info/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data);
				}
			})
		}
	}
	//保存表单;
	this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}
		var postData = $("#form1").GetWebControls(keyValue);
		$.SaveForm({
			url: "/AfterSaleManage/client_info/SaveForm?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();