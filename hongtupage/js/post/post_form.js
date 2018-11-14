var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var organizeId = request('organizeId');
	var _itemId = request('_itemId');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		console.log(_itemId)
		//所在公司
		//		if(_itemId == "") {
		$("#OrganizeId").ComboBoxTree({
			url: "/BaseManage/Organize/GetTreeJson",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			description: "==请选择==",
			height: "200px",
			allowSearch: true
		});
		//		} else {
		//			$("#OrganizeId").ComboBoxTree({
		//				url: "/BaseManage/Organize/GetTreeJson?OrganizeId=" + _itemId,
		//				cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
		//				description: "==请选择==",
		//				height: "200px"
		//			});
		//			$("#OrganizeId").ComboBoxTreeSetValue(_itemId);
		//		}

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
			url: "/BaseManage/Post/SaveForm?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();