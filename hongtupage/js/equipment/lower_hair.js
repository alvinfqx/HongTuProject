var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	$(function() {
		$("#drive").ComboBox({
			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
			param: {
				EnCode: "monitor_driver_series"
			},
			id: "ItemValue",
			text: "ItemName",
			description: "==请选择==",
			height: "200px"
		});
		self.Initialization();
	});

	//获取初始化页面
	this.Initialization = function() {
		//		alert(productInfoId)
		cm.ajax({
			url: "/AfterSaleManage/orderproduct/GetProductInfo", //
			type: "POST",
			dataType: "json",
			data: {
				orderProductId: keyValue
			},
			success: function(res) {
				var data = res[0];
				console.log(res);
				$("#form").SetWebControls(data);
				var producttype = data.producttype;
				var productname = data.productname;
				var productcode = data.productcode;
				var producttoken = data.producttoken;
				var productdesc = data.productdesc;
				var client = data.client;
				var contact = data.contact;
				var gj = data.gj;
				var shengf = data.shengf;
				var chengs = data.chengs;
				var location = data.location;
				var pointstr = data.pointstr;
				$("#productType").val(producttype);
				$("#productName").val(productname);
				$("#model").val(productcode);
				$("#productCode").val(producttoken);
				$("#describe").val(productdesc);
				$("#customerName").val(client);

			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	this.drive_a = function() { //监听
		//		console.log(123);
		cm.ajax({
			url: "/AfterSaleManage/dm_terminalinfo/GetDataEntity", //
			type: "POST",
			dataType: "json",
			data: {
				keyValue: $("#productCode").val()
			},
			success: function(res) {
				var data = res[0];
				if(data == undefined){
					
				}else{
				$("#form").SetWebControls(data);
				var port = data.port;
				var txzdno = data.txzdno;
				var drive = $("#drive").attr('data-text');

				drive = drive.toLowerCase(); //转小写
				drive = drive.slice(0, drive.length - 3); //字符串分割
				$("#port").val(drive + "_channel_" + port);
				$("#txzdno").val("2:7786:4:"+txzdno)
				$("#frequency").val("50");
				console.log(drive);
				}
				console.log(data);
				

			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	this.AcceptClickAdd = function() { //下发
		var json_data = {};
		json_data.productCode = $("#model").val();
		json_data.productName = $("#productName").val();
		json_data.productToken = $("#productCode").val();
		json_data.channel_name = $("#port").val();
		json_data.device_driver = $("#drive").attr('data-text');
		json_data.device_address = $("#txzdno").val();
		json_data.collect_freq = $("#frequency").val();
		json_data.monitor_date = '';
		json_data.monitor_status = '';
		var json_data = JSON.stringify(json_data);
		cm.ajax({
			url: "/AfterSaleManage/orderproduct_monitor/SaveForm", //
			type: "POST",
			dataType: "json",
			data: {
				entity: json_data,
				keyValue: ""
			},
			success: function(data) {
				console.log(data);
				dialogMsg(data.message, 1);
				dialogClose();
			},
			error: function(data) {
				console.log(data);
				dialogMsg(data.message, 2);
			}
		})
	}
};

var model = new viewModel();