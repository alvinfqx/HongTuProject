var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var parentId = request('parentId');
	var orderProductId = request('orderProductId');
//	orderProductId="00388d33-132c-470f-8b16-cebcc48b7153";
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//上级
		$("#parentcatId").ComboBoxTree({
			url: "/SystemManage/DataItem/GetBOMTreeJson4SingleProduct",
			param:{
				keyword: "",
				orderProductId: orderProductId
			},
			description: "==请选择==",
			height: "230px"
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AfterSaleManage/orderproductbomcat/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					var parentCatId = data.parentCatId;
					var orderProductId = data.orderProductId;
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
//		alert(postData.parentCatId);
		postData.orderProductId = orderProductId;
// 	alert(JSON.stringify(postData))
		$.SaveForm({
			url: "/AfterSaleManage/orderproductbomcat/SaveForm?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				$("#gridTable").resetSelection();
				$("#gridTable").trigger("reloadGrid");
			}
		})
	}
	
};

var model = new viewModel();