var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	$(function() {
		self.GetModuleTree();
	})
	//加载功能模块树
	var moduleId = "";

	this.GetModuleTree = function() {
		var item = {
			url: "/AuthorizeManage/Module/GetTreeJson",
			onnodeclick: function(item) {
				moduleId = item.id;
			},			
		};
		$("#ModuleTree").treeview(item);
	}
	//保存事件
	this.AcceptClick = function() {
		if(moduleId) {
			$.SaveForm({
				url: "/AuthorizeManage/ModuleButton/CopyForm",
				param: {
					keyValue: keyValue,
					moduleId: moduleId
				},
				loading: "正在提交数据...",
				success: function() {

				}
			})
		} else {
			dialogMsg('请选择系统功能！', 0);
		}
	}
};

var model = new viewModel();