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
				url: "/AfterSaleManage/aw_address_books/GetClientInfo",
				param: {
					keyword: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data.rows[0]);
				}
			})
		}
	}
	
};

var model = new viewModel();