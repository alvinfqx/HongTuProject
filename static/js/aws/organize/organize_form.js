var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var parentId = request('parentId');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//上级公司
		$("#ParentId").ComboBoxTree({
			url: "/BaseManage/Organize/GetTreeJson",
			description: "==请选择==",
			height: "260px",
			allowSearch: true,
			cbiconpath:"../../monitorpage/util/tree/images/icons/",
			allowSearch: true
		});
		//公司性质
		$("#Nature").ComboBox({
			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
			param: {
				EnCode: "CompanyNature"
			},
			id: "ItemValue",
			text: "ItemName",
			description: "==请选择==",
			height: "200px"
		});
		//负责人
		$("#ManagerId").ComboBoxTree({
			url: "/BaseManage/User/GetTreeJson",
			param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
			description: "==请选择==",
			height: "220px",
			allowSearch: true,
			cbiconpath:"../../monitorpage/util/tree/images/icons/"
		});
		//省份
		$("#ProvinceId").ComboBox({
			url: "/SystemManage/Area/GetAreaListJson",
			param: {
				parentId: "0"
			},
			id: "AreaCode",
			text: "AreaName",
			description: "选择省",
			height: "170px"
		}).bind("change", function() {
			var value = $(this).attr('data-value');
			$("#CityId").ComboBox({
				url: "/SystemManage/Area/GetAreaListJson",
				param: {
					parentId: value
				},
				id: "AreaCode",
				text: "AreaName",
				description: "选择市",
				height: "170px"
			});
		});
		//城市
		$("#CityId").ComboBox({
			description: "选择市",
			height: "170px"
		}).bind("change", function() {
			var value = $(this).attr('data-value');
			if(value) {
				$("#CountyId").ComboBox({
					url: "/SystemManage/Area/GetAreaListJson",
					param: {
						parentId: value
					},
					id: "AreaCode",
					text: "AreaName",
					description: "选择县/区",
					height: "170px"
				});
			}
		});
		//县/区
		$("#CountyId").ComboBox({
			description: "选择县/区",
			height: "170px"
		});
		
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/BaseManage/Organize/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
		
					$("#form1").SetWebControls(data);
					$("#FoundedTime").val(formatDate(data.FoundedTime, "yyyy-MM-dd"));
					$("#ProvinceId").trigger("change");
					if(data.CityId != undefined) {
						$("#CityId").ComboBoxSetValue(data.CityId).trigger("change");
						$("#CountyId").ComboBoxSetValue(data.CountyId);
					}
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
		postData["Manager"] = $("#ManagerId").attr('data-text');
		if(postData["ParentId"] == "") {
			postData["ParentId"] = 0;
		}
		$.SaveForm({
			url: "/BaseManage/Organize/SaveForm?keyValue=" + keyValue,
			param: JSON.stringify(postData),
			loading: "正在保存数据...",
			success: function() {
				$.parentIframe().$("#gridTable").resetSelection();
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();