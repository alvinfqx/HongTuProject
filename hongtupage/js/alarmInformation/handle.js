var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
//	alert(keyValue);
	var slseq = request('slSeq');
	var alarmItemID = request('alarmItemID');
//	alert(alarmItemID)
	$(function(){
		self.Initialization_s();
	});
	
	$('#simple_id').text(cm.smallSystemName);
	$('#logo_id').text(cm.comSystemName);

	this.Initialization_s = function(){
		cm.ajax({
			url: "/AfterSaleManage/dm_alarm/GetAlarmEntity", //
			type: "POST",
			dataType: "json",
			data: {
				AlarmID: alarmItemID
			},
			success: function(res) {
				var data = res[0];
				console.log(data);
				$("#form").SetWebControls(data);
				var alarmItemID = data.alarmItemID;//主键id
				var alarmGrade = data.alarmGrade;//等级
				var alarmType = data.alarmType;//类型
				var orderProductId = data.orderProductId;//产品id
				var producttype = data.producttype;//产品大类
//				alert(producttype)
				$("#productType").ComboBoxTreeSetValue(producttype);
				var productname = data.productname;//产品名称
				$("#productName").val(productname);
				var productcode = data.productcode;//产品编码
				$("#productCode").val(productcode);
				var clienT = data.client;//客户单位
				$("#client").val(clienT);
				var resource_Info = data.resource_Info;//来源
				var occuredTime_s = data.occuredtime;//报警发生时间
//				alert(occuredTime_s)
				var alarm_content_s = data.alarm_content;//报警内容
				$("#requirementInfo").val("报警内容："+alarm_content_s+"        报警时间："+occuredTime_s);
				var handle_status = data.handle_status;//处理状态
				var workInfoId = data.workInfoId;//相关工单id
				var memo = data.memo;//备注
				var CreateDate = data.CreateDate;//创建时间
				var CreateUserId = data.CreateUserId;//创建人id
				var CreateUserName = data.CreateUserName;//创建人名称
				var ModifyDate = data.ModifyDate;//修改时间
				var ModifyUserId = data.ModifyUserId;//修改人id
				var ModifyUserName = data.ModifyUserName;//修改人名称
				var slseq = data.slseq;//工单
				var organizationid = data.organizationid;//产品监控报警表id
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	
	//一键派单;
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
			url: "/AfterSaleManage/aw_AftersalesUpdateInfo/SaveFormData?keyValue=" + "", //回访
			type: "POST",
			dataType: "json",
			data: postData,
			success: function(data) {
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