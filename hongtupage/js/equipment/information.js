var viewModel = function() {
	var self = this;
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
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
	}
};

var model = new viewModel();