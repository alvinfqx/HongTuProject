var viewModel = function() {
	var self = this;
	$('#simple_id').text(cm.smallSystemName);
	$('#logo_id').text(cm.comSystemName);
	var alarmItemID = request('alarmItemID');
//	alert(alarmItemID)
	//	alert(alarmItemID)
	$(function() {
		self.Initialization_s();
		self.handle();
	});
	var workinfoid;
	var slseq;
	this.Initialization_s = function() {
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
				var alarmItemID = data.alarmItemID; //主键id
				var alarmGrade = data.alarmgrade; //等级
				$("#alarmGrade").val(alarmGrade);
				var alarmType = data.alarmtype; //类型
				$("#alarmType").val(alarmType);
				var orderProductId = data.orderProductId; //产品id
				var producttype = data.producttype; //产品大类
				$("#productType").val(producttype);
				var productname = data.productname; //产品名称
				$("#productName").val(productname);
				var productcode = data.productcode; //产品编码
				$("#productCode").val(productcode);
				var clienT = data.client; //客户单位
				var resource_Info = data.resource_info; //来源
				$("#resource_Info").val(resource_Info);
				var occuredTime_s = data.occuredtime; //报警发生时间
				$("#occuredTime").val(occuredTime_s);
				var alarm_content_s = data.alarm_content; //报警内容
				var handle_statu = data.handle_status; //处理状态
//				alert(handle_statu);
//				$("#handle_statuS input[name='optionsRadiosinline'][value='"+handle_statu+"']").attr("checked",true)
				workinfoid = data.workinfoid; //相关工单id
				var memo = data.memo; //备注
				var CreateDate = data.CreateDate; //创建时间
				var CreateUserId = data.CreateUserId; //创建人id
//				var workcreateusername = data.workcreateusername; //创建人名称
//				$("#CreateUserName").val(workcreateusername);
//				var workcreatedate = data.workcreatedate;
//				$("#CreateDate").val(workcreatedate);
				var ModifyDate = data.ModifyDate; //修改时间
				var ModifyUserId = data.ModifyUserId; //修改人id
				var ModifyUserName = data.ModifyUserName; //修改人名称
//				var CreateUserName = data.createusername; //
				var CreateDate = data.CreateDate; //处理时间
				slseq = data.slseq; //工单
//				alert(slseq)
				$("#slseq").text(slseq);
				var organizationid = data.organizationid; //产品监控报警表id
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	var ID;
	//初始化处理
	this.handle = function(){
		cm.ajax({
			url: "/AfterSaleManage/dm_processalarm/GetEntityJson", //
			type: "GET",
			dataType: "json",
			data: {
				alarmId: alarmItemID
			},
			success: function(res) {
				var data = res[0];
				console.log(data);
				ID = data.ID; //修改时间
//				alert(ID)
				var AlarmID = data.AlarmID;
				var ProcessPerson = data.ProcessPerson;
				$("#CreateUserName").val(ProcessPerson);
				var ProcessDate = data.ProcessDate;
				$("#CreateDate").val(ProcessDate);
				var ProcessSuggest = data.ProcessSuggest;
				$("#ProcessSuggest").text(ProcessSuggest);
				var ProcessStatus = data.ProcessStatus;
//				alert(ProcessStatus)
				$("#handle_statuS input[name='optionsRadiosinline'][value='"+ProcessStatus+"']").attr("checked",true);
				var CreateUserID = data.CreateUserID;
				var CreateUserName = data.CreateUserName;
				
				var CreateDate = data.CreateDate;
				
				var ModifyUserID = data.ModifyUserID;
				var ModifyUserName = data.ModifyUserName;
				var ModifyDate = data.ModifyDate;
				
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	this.onclick_slseq = function() {
		var keyValue = workinfoid;
//		alert(keyValue)
		var slseQ = slseq;
			dialogOpenContent({
				id: 'key',
				url: '/hongtupage/view/customerWorkinfo/Form.html?keyValue=' + keyValue + '&slSeq=' + slseQ,
				width: 'px',
				height: 'px',
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			})
	}

	this.AcceptClick = function() {
		dialogClose();
	}
};

var model = new viewModel();