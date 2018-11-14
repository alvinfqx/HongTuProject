var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;

	$(function() {
		self.initControl();
		self.init_ext_atttribute();
	});
	
	//初始化控件
	this.initControl = function() {
		//获取基本表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AfterSaleManage/productinfo/GetProductInfo",
				param: {
					productInfoId: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data[0]);
				}
			})
		}
	}

	//获取产品拓展属性
	this.init_ext_atttribute = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/productinfo/GetProductExtAttribute",
			data: {
				productInfoId: keyValue
			},
			async: false,
			success: function(data) {
				if(data && data.length > 0) {
					var new_data = cm.format.split_array(data, 2);
					var html = '';
					for(var j = 0; j < new_data.length; j++) {
						html += '<tr>';
						for(var i = 0; i < new_data[j].length; i++) {							
							html += '<th>' + new_data[j][i].attributename + ': </th>';
							html += '<td data-id="' + new_data[j][i].productattuid + '">' + new_data[j][i].productattuvalue + '</td>';		
							if(new_data[j].length == 1){
								html += '<td></td><td></td>';
							}
						}
						html += '</tr>';
					}
					$(".append_tr").after(html);
				}
			}
		});
	}
};

var model = new viewModel();