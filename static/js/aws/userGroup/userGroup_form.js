var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var organizeId = request('organizeId');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//所在公司
		$("#OrganizeId").ComboBoxTree({
			url: "/BaseManage/Organize/GetTreeJson",
			description: "==请选择==",
			height: "200px",
			cbiconpath:"../../monitorpage/util/tree/images/icons/",
			allowSearch: true
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/BaseManage/UserGroup/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data);
				}
			});
		}
	}
	//保存表单
	this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}
		var postData = $("#form1").GetWebControls(keyValue);
		$.SaveForm({
			url: "/BaseManage/UserGroup/SaveForm?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();