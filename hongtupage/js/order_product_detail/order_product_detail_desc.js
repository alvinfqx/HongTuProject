var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;
//	alert(keyValue)
	

	$(function() {
		self.initControl();
		self.product();
		self.init_ext_atttribute();
	});
	//初始化控件
	this.initControl = function() {
		//获取基本表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AfterSaleManage/orderproduct/GetProductInfo",
				param: {
					orderProductId: keyValue
				},
				success: function(data) {					
					$("#form1").SetWebControls(data[0]);
//					var html = '<img src="'+ cm.domain + '/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=' + data[0].photourl +'&token=' + cm.token +'" />';
//					$("#img_id").html(html);
				}
			})
		}
	}

	//获取产品拓展属性
	this.init_ext_atttribute = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/orderproduct/GetProductExtAttribute",
			data: {
				orderProductId: $("#orderproductid").val()
			},
			async: false,
			success: function(data) {
				if(data && data.length > 0) {
					var new_data = cm.format.split_array(data, 2);
					var html = '';
					for(var j = 0; j < new_data.length; j++) {
						html += '<tr>';
						for(var i = 0; i < new_data[j].length; i++) {							
							html += '<th>' + new_data[j][i].attributename + '</th>';
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

	//产品详细介绍
	this.product = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/orderproduct/GetProductHtmlContent",
			data: {
				orderProductId: $("#orderproductid").val()
			},
			async: false,
			success: function(data) {
				$("#content").html(data[0].htmlcontent);
			}
		});
	}

};

var model = new viewModel();