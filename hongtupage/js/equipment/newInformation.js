var viewModel = function() {
	var self = this;
//	var productInfoId = request('productInfoId');
//	alert(productInfoId)
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//省份
		$("#shengf").ComboBox({
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
			$("#chengs").ComboBox({
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
		$("#chengs").ComboBox({
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
	dialogOpenATECustomer = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['确定', '取消'],
			callBack: null
		};
		var options = $.extend(defaults, options);
		var _url = options.url;
		var _width = top.$.windowWidth() > parseInt(options.width.replace('px', '')) ? options.width : top.$.windowWidth() + 'px';
		var _height = top.$.windowHeight() > parseInt(options.height.replace('px', '')) ? options.height : top.$.windowHeight() + 'px';
		top.layer.open({
			id: options.id,
			type: 2,
			shade: options.shade,
			title: options.title,
			fix: false,
			area: [_width, _height],
			content: top.mainPath + _url,
			btn: options.btn,
			yes: function() {
				//alert("yes");
				options.callBack(options.id)
			},
			cancel: function() {
				if(options.cancel != undefined) {
					options.cancel();
				}
				return true;

			},
			end: function() {
				$('#gridTable').trigger('reloadGrid');
			}
		});
	}
	//保存所有信息按钮
	this.AcceptClickAdd = function(){
		var json_data = {};
		json_data.OrderProductId = "";
		json_data.productInfoId = $('#productInfoId').val();
		json_data.ProductType = $("#productType").val();
		json_data.ProductTypeName = $("#productName").val();
		json_data.ProductTypeCode =  $("#model").val();
		json_data.ProductDesc =  $("#describe").val();
		json_data.clientId = $("#organizeid").val();
		json_data.Client = $("#customerName").val();
		json_data.LinkMan = $("#contacts").val();
		json_data.productToken = $("#productCode").val();
		json_data.location = $("#Address").val();
		json_data.GJ = 0;
		json_data.Shengf = $("#shengf").attr('data-value');
		json_data.Chengs = $("#chengs").attr('data-value');
		json_data.pointStr = $("#longlatitude").val();
		//
        json_data.ContractNo=$("#ContractNo").val();
        json_data.DeliveryDate4Contact=$("#DeliveryDate4Contact").val();
        json_data.SigningDate4Contact=$("#SigningDate4Contact").val();
        json_data.contractType=$("#contractType").val();
        json_data.SalesMan=$("#SalesMan").val();
        json_data.media=$("#media").val();
        json_data.spec=$("#spec").val();
        json_data.ProductDeliveryTime=$("#ProductDeliveryTime").val();
        json_data.WarrantyYears=$("#WarrantyYears").val();
        json_data.NextWarrantyTime=$("#NextWarrantyTime").val();
        //
		var str = JSON.stringify(json_data);
		console.log(JSON.stringify(json_data));
		cm.ajax({
			url: "/AfterSaleManage/orderproduct/saveOrderProduct", //
			type: "POST",
			dataType: "json",
			async:false, 
			data: json_data,
			success: function(data) {
				console.log(data);
				dialogMsg(data.message, 1);
			},
			error: function(data) {
				console.log(data);
				dialogMsg(data.message, 2);
			}
		})
		dialogClose();
	}
	//客户选择按钮
	this.btn_choice_s = function(){
		dialogOpenATECustomer({
			id: 'Choice',
			title: '客户选择',
			url: '/hongtupage/view/equipment/duanxin.html',
			width: '1100px',
			height: '700px',
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClickchoice_s(function(data){
//					alert(data.organizeid)
					$("#organizeid").val(data.organizeid)
					$("#customerName").val(data.client)		
					$("#contacts").val(data.linkman)	
				});
				
			}
		});
		
		
	}
	//产品选择按钮
	this.btn_choice = function(){
		dialogOpenATECustomer({
			id: 'Choice',
			title: '产品选择',
			url: '/hongtupage/view/equipment/attribute_configuration.html',
			width: '1100px',
			height: '700px',
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClickchoice(function(data){
//					alert(data.productInfoId)
					$("#productInfoId").val(data.productInfoId)
					$("#productType").val(data.productType)		
					$("#productName").val(data.productName)		
					$("#model").val(data.productCode)		
					$("#describe").val(data.productDesc)		
				});
				
			}
		});
		
		
	}
};

var model = new viewModel();