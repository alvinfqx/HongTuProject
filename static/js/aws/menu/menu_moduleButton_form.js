var viewModel = function() {
	var self = this;
	var parentId = request('parentId');
	var moduleButtonId = request('moduleButtonId');
	var moduleId = request('moduleId');
	$("#ModuleButtonId").val(cm.format.guid());
	$(function() {
		self.initControl();
	})
	var dataJson = window.top.page_parameters.GetParameters('/webpage/system/menu_moduleButton_form.html');
	//初始化控件
	this.initControl = function() {
		//上级
		$("#ParentId").ComboBoxTree({
			url:"/AuthorizeManage/ModuleButton/ListToTreeJson",
			param: {
				moduleButtonJson: JSON.stringify(dataJson),
			},
			method: "post",
			description: "==请选择==",
			height: "150px",
			cbiconpath:"../../monitorpage/util/tree/images/icons/"
		});
		if(!!moduleButtonId) {
			$.each(dataJson, function(i) {
				var row = dataJson[i];
				if(row.ModuleButtonId == moduleButtonId) {
					
					$("#form1").SetWebControls(row);
				}
			});
		} else {
			$("#ModuleId").val(moduleId);
			
			if(!!parentId) {
				$("#ParentId").ComboBoxTreeSetValue(parentId);
			} else {
				$("#ParentId").ComboBoxTreeSetValue(0);
			}
		}
	}
	//保存表单
	this.AcceptClick = function(callback) {
		if(!$('#form1').Validform()) {
			return false;
		}
		
		var data = $("#form1").GetWebControls(moduleButtonId);
		if(data["ParentId"] == "") {
			data["ParentId"] = 0;
		}
		
		callback(data);
		dialogClose();
	}
};

var model = new viewModel();