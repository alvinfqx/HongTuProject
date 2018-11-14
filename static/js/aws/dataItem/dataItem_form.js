var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
//	alert(keyValue);
	var parentId = request('parentId');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//上级
		$("#ParentId").ComboBoxTree({
			url: "/SystemManage/DataItem/GetTreeJson",
			description: "==请选择==",
			height: "230px",
			cbiconpath:"../../monitorpage/util/tree/images/icons/"
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/SystemManage/DataItem/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data);
				}
			});
		} else {
			$("#ParentId").ComboBoxTreeSetValue(parentId);
		}
	}
	//保存表单
	this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}
		var postData = $("#form1").GetWebControls(keyValue);
		if(postData["ParentId"] == "") {
			postData["ParentId"] = 0;
		}
		$.SaveForm({
			url: "/SystemManage/DataItem/SaveForm?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				top.DataItemSort.$("#gridTable").resetSelection();
				top.DataItemSort.$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();