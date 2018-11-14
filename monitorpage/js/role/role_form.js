var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var organizeId = request('organizeId');
	var companyId = sessionStorage.getItem("companyId") ? sessionStorage.getItem("companyId") : '';
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//所在公司
		$("#OrganizeId").ComboBoxTree({
			url: "/BaseManage/Organize/GetTreeJson?OrganizeId="+companyId,
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			description: "==请选择==",
			height: "200px"
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/BaseManage/Role/GetFormJson",

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
			url: "/BaseManage/Role/SaveForm?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();