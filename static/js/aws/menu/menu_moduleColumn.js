var viewModel = function() {
	var self = this;
	var moduleColumnId = request('moduleColumnId');
	var moduleId = request('moduleId');
	$("#ModuleColumnId").val(cm.format.guid());
	$(function() {
		self.initControl();
	})
	var dataJson = window.top.page_parameters.GetParameters('/webpage/system/menu_moduleColumn.html');
	//初始化控件
	this.initControl = function() {
		if(!!moduleColumnId) {
			$.each(dataJson, function(i) {
				var row = dataJson[i];
				if(row.ModuleColumnId == moduleColumnId) {
					$("#form1").SetWebControls(row);
				}
			});
		} else {
			$("#ModuleId").val(moduleId);
		}
	}
	//保存表单
	this.AcceptClick = function(callback) {
		if(!$('#form1').Validform()) {
			return false;
		}
		var data = $("#form1").GetWebControls(moduleColumnId);
		data["ParentId"] = 0;
		callback(data);
		dialogClose();
	}
};

var model = new viewModel();