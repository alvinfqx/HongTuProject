var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var parentId = request('parentId');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//上级
		$("#ParentId").ComboBoxTree({
			url: "/SystemManage/DataItem/GetTreeJson4ProductCat",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			description: "==请选择==",
			height: "230px"
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AfterSaleManage/productcat/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					console.log(data)
					var parentCatId = data.parentCatId;
					$("#form1").SetWebControls(data);
					$("#ParentId").ComboBoxTreeSetValue(parentCatId);
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
		postData.parentCatId = $("#ParentId").attr('data-value');
//		alert(JSON.stringify(postData))
		$.SaveForm({
			url: "/AfterSaleManage/productcat/SaveForm?keyValue=" + keyValue,
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