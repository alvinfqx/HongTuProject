var viewModel = function() {
	var self = this;
	var moduleId = request('moduleId');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		$("#ModuleId").val(moduleId);
	}
	//保存表单
	this.AcceptClick = function(callback) {
		try {
			var data = [];
			var JsonText = eval($("#JSONText").val());
			$.each(JsonText, function(i) {
				var row = JsonText[i];
				data.push({
					EnCode: row.name,
					FullName: row.label,
					SortCode: i + 1,
					ModuleId: moduleId,
					ModuleColumnId: newGuid(),
					ParentId: "0"
				})
			});
			callback(data);
			dialogClose();
		} catch(e) {
			var str =  e.name + ":" + e.message ;
			dialogMsg(str, 2);
		}
	}
};

var model = new viewModel();