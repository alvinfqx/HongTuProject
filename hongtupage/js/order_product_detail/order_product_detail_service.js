var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;
//	alert(keyValue)

	$(function() {
		self.service();
		self.warranty_content();
	});

	this.service = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/orderproduct/GetProductCustomerSeviceHtmlContent",
			data: {
				orderProductId: keyValue
			},
			async: false,
			success: function(data) {
				console.log(data);
				$("#content").html(data[0].customerservicehtml);
			}
		});
	}

	this.warranty_content = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/orderproduct/GetProductwarrentyHtmlContent",
			data: {
				orderProductId: keyValue
			},
			async: false,
			success: function(data) {
				
				$("#warranty_content").html(data[0].warrantdeschtml);
			}
		});
	}

};

var model = new viewModel();