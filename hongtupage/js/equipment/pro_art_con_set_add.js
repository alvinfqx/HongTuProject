var viewModel = function() {
	var self = this;
	//流水号
	var keyvalue = request("keyValue");
	var productID = request("productID");
	var productinfoid = request("productinfoid");
	var productname = request("productname");
	var productcatid = request("productcatid");
	$("#orderproductInfoId").val(productID);
	$("#productname").val(productname);
	
	$(".radio_class input").iCheck({
		radioClass: 'iradio_square-blue',
		increaseArea: '20%' 
	});
	
	$(function() {
		self.initControl();
	})

	//初始化控件
	this.initControl = function() {
		//所属类型
		$("#NODE_Belong_TYPE").ComboBoxTree({
			url: "/AfterSaleManage/aw_flowchart/GetProductNodeCatList",
			param: {
				productInfoId: productinfoid
			},
			description: "==请选择==",
			height: "195px",
			allowSearch: true
		});
		$("#NODE_Belong_TYPE").ComboBoxTreeSetValue(productcatid);
		
	};

	//保存表单
	this.AcceptClick = function(callback) {
		if(!$('#form1').Validform()) {
			return false;
		}
		var postData = $("#form1").GetWebControls();
		if(postData["NODE_Belong_TYPE"] == "") {
			postData["NODE_Belong_TYPE"] = 0;
		};
		if($(".radio_class input").is(":checked")) {
			postData["ENABLE_R_W"] = $("input[name='ENABLE_R_W']:checked").val();
		}
		
		$.SaveForm({
			url: "/AfterSaleManage/aw_flowchart/OrderProductNodeSave",
			param: postData,
			loading: "正在保存数据...",
			success: function(data) {
				callback();
			}
		});
      
	}
};

var model = new viewModel();