var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var parentId = request('parentId');
	var productInfoId = request('productInfoId');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//上级
		$("#parentCatId").ComboBoxTree({
			url: "/SystemManage/DataItem/GetTreeJson4ItemTypeCat",
			param:{
				productInfoId: productInfoId
			},
			description: "==请选择==",
			height: "230px"
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AfterSaleManage/productbomcat/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					var parentCatId = data.parentCatId;
					var productInfoId = data.productInfoId;
					$("#form1").SetWebControls(data);
					$("#parentCatId").ComboBoxTreeSetValue(parentCatId);
				}
			});
		} else {
			$("#parentCatId").ComboBoxTreeSetValue(parentId);
		}
	}
	//保存表单
	this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}
		var postData = $("#form1").GetWebControls(keyValue);
		if(postData["parentCatId"] == "") {
			postData["parentCatId"] = 0;
		}
		postData.parentCatId = $("#parentCatId").attr('data-value');
		postData.productInfoId = productInfoId;
//		alert(JSON.stringify(postData))
		$.SaveForm({
			url: "/AfterSaleManage/productbomcat/SaveForm?keyValue=" + keyValue,
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