var viewModel = function(){
	var self = this;
	
	var paramStr = request('id');
	var proCode = request('code');
	
	
	$(function(){
		self.initInformation();
	});
	
	
	this.initInformation = function(){
		cm.ajax({
			type: 'get',
			url: '/Monitor/GetRealNodeOnlyTableList',
			data: {
				keyValue: proCode,
				NODE_TYPE: paramStr
			},
			async: false,
			success: function(data){
				var basic = '';
				if(data && data.length > 0 ){
					var new_data = data[0];
					basic += '<tr>';
					basic += '<td>产品型号</td>';
					basic += '<td>'+ new_data.EQ_TYPE +'</td>';
					basic += '<td>产品名称</td>';
					basic += '<td>'+ new_data.EQ_NAME +'</td>';
					basic +=  '</tr>';
				    basic += '<tr>';
				    basic += '<td><span style="color:red;">[ * ]</span> 产品编号</td>';
				    basic += '<td>' + new_data.EQ_CODE + '</td>';
				    basic += '<td>产品代号</td>';
				    basic += '<td>' + new_data.EQ_NO +'</td>';
				    basic += '</tr>';
				    basic += '<tr>';
				    basic += '<td><span style="color:red;">[ * ]</span> 客户名称</td>';
				    basic += '<td colspan="3">' + new_data.CUST_NAME + '</td>';
				    basic += '</tr>';
				    basic += '<tr>';
				    basic += '<td>设备地址</td>';
				    basic += '<td>' + new_data.CUSTADRESS + '</td>';
				    basic += '<td>相关人员</td>';
				    basic += '<td>' + new_data.EQ_MEMO + '</td>';
				    basic += '</tr>';
				    basic += '<tr>';
				    basic += '<td>更新时间</td>';
				    basic += '<td colspan="3">' + new_data.CREATE_DATE + '</td>';
				    basic += '</tr>';
				}
				
				$('#infoID').html("");
				$('#infoID').html(basic);
			}
		})
	}
};

var model = new viewModel();