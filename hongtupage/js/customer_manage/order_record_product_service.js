var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;

	$(function() {
		self.service();
		self.warranty_content();
	});

	this.service = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/productinfo/GetProductCustomerSeviceHtmlContent",
			data: {
				productInfoId: keyValue
			},
			async: false,
			success: function(data) {
				$("#content").html(data[0].customerservicehtml);
			}
		});
	}
	
	this.warranty_content = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/productinfo/GetProductwarrentyHtmlContent",
			data: {
				productInfoId: keyValue
			},
			async: false,
			success: function(data) {
				$("#warranty_content").html(data[0].warrantdeschtml);
			}
		});
	}




};

var model = new viewModel();