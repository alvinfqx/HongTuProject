var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;
	$(function() {
		self.specif();
	});
	
	this.specif = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/orderproduct/GetSpecDataItemList",
			data: {
				orderProductId: keyValue
			},
			async: false,
			success: function(data) {

				var html = '';
				html += '<table  width="100%" height="100%" >';
				if(data && data.length == 1) {
					$.each(data[0].itemModelList, function(i, n) {
						html += '<tr>';
						html += '<td class="title_text" style="background-color:#f7f7f7;">' + n.ItemName + '</td>';
						html += '<td data-id=' + n.ItemId + '>' + n.ItemValue + '</td>';
						html += '</tr>';
					});

				} else if(data && data.length >= 2) {
					for(var i = 0; i < data.length; i++) {
						html += '<tr>';
					html += '<td colspan="2" class="title_texts" style="background-color:#cfcfcf;" data-id="' + data[i].ItemTypeId + '">' + data[i].ItemTypeName + '</td>';
						html += '</tr>';
						for(var j = 0; j < data[i].itemModelList.length; j++) {
							html += '<tr>';
							html += '<td style="background-color:#f7f7f7;">' + data[i].itemModelList[j].ItemName + '</td>';
							html += '<td data-id=' + data[i].itemModelList[j].ItemId + '>' + data[i].itemModelList[j].ItemValue + '</td>';
							html += '</tr>';
						}
					}
				} else {
					html += '';
				}
				html += '</table>';

				$("#table_div_id").html(html);
			}
		});
	}

};

var model = new viewModel();
