var viewModel = function(){
	var self = this;
	var orderproductid = request('orderproductid');
	keyValue = request('keyValue');
	var slseq = request('slSeq');
	/*初始化函数*/
	$(function() {
		self.InitializationProcessing();	//处理
	});
    $('#simple_id').text(cm.smallSystemName);
    $('#logo_id').text(cm.comSystemName);
    
    this.InitializationProcessing = function(){
    	cm.ajax({
			url: "/AfterSaleManage/orderproduct/GetProductInfo", //
			type: "POST",
			dataType: "json",
			data: {
				orderProductId: orderproductid
			},
			success: function(data) {
				var data = data[0];
//				alert(JSON.stringify(data));
				$("#form").SetWebControls(data);
				var producttypes = data.producttype;//产品类型
				$("#producttype").ComboBoxTreeSetValue(producttypes);
			},
			error: function(data) {
				console.log(data);
			}
		})
    }
    //形成售后工单;
	this.saveTaskClick = function() {
		//dialogClose();
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		var postData = $("#form").GetWebControls();
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_customerServiceInfo/SaveFormData?keyValue=" + keyValue, //回访
			type: "POST",
			dataType: "json",
			data: postData,
			success: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
				dialogClose();
			},
			error: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
				dialogClose();
			}
		})
	}
    //处理;
	this.AcceptClicks = function() {
		var test = $('#assistant').val();
		var contacts = $('#dispatchingPerson').val();
		if(contacts == undefined || contacts == "") {
			alert("请选择现场实施人员。");
			return;
		}
		if(test == undefined || test == "") {
			alert("请选择接收人。");
			return;
		}
		var postData = $("#form").GetWebControls();
//		alert(JSON.stringify(data));
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_AftersalesAssignedToNeed/directAssignWorkstatus?keyValue=" + keyValue, //回访
			type: "POST",
			dataType: "json",
			data: postData,
			success: function(data) {
				console.log(JSON.stringify(data))
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
//				alert(JSON.stringify(data))
				dialogClose();
			},
			error: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
				dialogClose();
			}
		})

	}

	this.show_msage = function(target) {
		var $up_data = $(target).parent().parent().parent().find(".up-data");	
		var $box_show = $(target).parent().parent().parent().find(".box_show");
		var $dropzone = $up_data.find(".dropzone");
		var $up_data_msg = $up_data.find(".up-data-msg");
		if($up_data.css("display") == "none") {			
			$box_show.css("display", "block");
			$up_data.css("display", "block");
			$up_data_msg.css('display', 'block');
			$dropzone.css('display', 'block');
		} else {
		   $box_show.css("display", "none");
			$up_data.css("display", "none");
			$up_data_msg.css('display', 'none');
			$dropzone.css('display', 'none');
		}
	}

	
	//服务信息
	this.div_fun = function(obj) {
		var $obj = $(obj);
		var $obj_div = $(obj).parents('.row').find('.div_status');
		if($obj_div.css('display') == "block") {
			$obj_div.css({
				"display": "none"
			});
			$obj.children().attr('class', 'fa fa-plus');
		} else if($obj_div.css('display') == "none") {
			$obj_div.css({
				"display": "block"
			});
			$obj.children().attr('class', 'fa fa-minus');
		}

	};

};

var model = new viewModel();