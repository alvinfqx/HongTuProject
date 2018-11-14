var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var objectId = request('objectId');
	var objectType = request('objectType');
	var visitType = request('visitType');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//性别
		$("#VisitType").ComboBox({
			description: "==请选择==",
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AuthorizeManage/FilterIP/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data);
					$("#StartIP").val(data.IPLimit.split(',')[0]);
					$("#EndIP").val(data.IPLimit.split(',')[1]);
				}
			});
		} else {
			$("#ObjectId").val(objectId);
			$("#ObjectType").val(objectType);
		}
	}
	//保存表单
	this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}
		var StartIP = $("#StartIP").val();
		var EndIP = $("#EndIP").val();
		if(self.compareIP(StartIP, EndIP) == -1) {
			ValidationMessage($("#EndIP"), "不在同一个网段内");
			return false;
		}
		if(self.compareIP(StartIP, EndIP) == 0) {
			ValidationMessage($("#EndIP"), "结束IP不能大于开始IP");
			return false;
		}
		var postData = $("#form1").GetWebControls(keyValue);
		postData["IPLimit"] = StartIP + "," + EndIP;
		postData["VisitType"] = visitType;
		$.SaveForm({
			url: "/AuthorizeManage/FilterIP/SaveForm?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				top.FilterIP.$("#gridTable").trigger("reloadGrid");
			}
		})
	}
	//验证IP地址
	this.compareIP = function(ipBegin, ipEnd) {
		var temp1 = ipBegin.split(".");
		var temp2 = ipEnd.split(".");
		if((temp1[0] + temp1[1] + temp1[2]) == (temp2[0] + temp2[1] + temp2[2])) {
			if(temp2[3] >= temp1[3]) {
				return 1;
			} else {
				return 0;
			}
		} else {
			return -1; //不在同一个网段内
		}
	}
};

var model = new viewModel();