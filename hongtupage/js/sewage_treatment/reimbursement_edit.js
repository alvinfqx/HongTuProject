var viewModel = function() {
	var keyValue = request('keyValue');
	var  str_custId;
	var  str_month;
	var dataType;
	var str_ModifyUserName;
	var str_createUserId;
	var str_CreateUserName;
	//	alert(keyValue)
	var self = this;
	$(function() {
		self.receiver();
		self.getDetails();
	});
	$(document).ready(function() { //默认当前时间
		document.getElementById("ModifyDate").value = today();
	});
	this.AcceptClicks = function() {
		Loading(false)
		dialogClose();
	}

	function today() { //默认当前时间
		var today = new Date();
		var h = today.getFullYear();
		var m = today.getMonth() + 1;
		var d = today.getDate();
		var hh = today.getHours();
		var mm = today.getMinutes();
		var ss = today.getSeconds();
		m = m < 10 ? "0" + m : m;
		d = d < 10 ? "0" + d : d;
		hh = hh < 10 ? "0" + hh : hh;
		mm = mm < 10 ? "0" + mm : mm;
		ss = ss < 10 ? "0" + ss : ss;
		return h + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
	}
	this.receiver = function() {
		cm.ajax({
			url: "/AfterSaleManage/aw_workinfo/GetImplementUsers",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: keyValue
			},
			async: false,
			success: function(data) {
				//				var res = data[0];
				console.log(data)
				var html = '';
				$.each(data, function(i, n) {
					if(i == 0) {
						html += '<option value="' + n.id + '"  selected = "selected" >' + n.name + '</option>';
					} else {
						html += '<option value="' + n.id + '">' + n.name + '</option>'
					}

				})
				$('#receiver').html('');
				$('#receiver').append(html);
				$("#receiver").select2();
			},
			error: function(data) {

			}
		})
	}

	this.getDetails = function() { //初始化详情
		cm.ajax({
			url: "/AfterSaleManage/aw_sewagetreatrefund/GetFormJson",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: keyValue
			},
			success: function(data) {
				var data = data[0];
				console.log(data)
				$("#form").SetWebControls(data);
				var month = data.month;
				str_month=month;
				dataType=data.datatype;
				str_ModifyUserName=data.modifyusername;
				str_CreateUserName=data.createusername;
				var fullname = data.fullname;
				var price = data.price;
				var st_capacity = data.st_capacity;
				var cost = data.cost;
				var lastmontharrears = data.lastmontharrears;
				var returnmoney = data.returnmoney;
				var latefee = data.latefee;
				str_custId =data.cust_id;
				str_createUserId=data.createuserid;
				var thismonthshouldcost = data.thismonthshouldcost;
				var lastmonthrecovery = data.lastmonthrecovery;
				var modifydate = data.modifydate;
				$("#ReturnMoney").val(returnmoney);
				$("#ModifyDate").val(modifydate);
				$("#Month").val(month);
				$("#CUST_ID").val(fullname);
				$("#Price").val(price);
				$("#ST_Capacity").val(st_capacity);
				$("#Cost").val(cost);
				$("#LastMonthArrears").val(lastmontharrears);
				$("#LastMonthRecovery").val(lastmonthrecovery);
				$("#LateFee").val(latefee);
				$("#ThisMonthShouldCost").val(thismonthshouldcost);
			},
			error: function(data) {

			}
		})
	}
	this.AcceptClick = function() { //编辑保存
		var json_data = {};
		json_data.STR_ID = keyValue;
		json_data.CUST_ID = str_custId;
		json_data.DataType = dataType;
//		json_data.createdate = '';
		json_data.CreateUserName=str_CreateUserName;
		json_data.ModifyUserName = str_ModifyUserName;
		json_data.Month = str_month;
		json_data.LastMonthArrears = $('#LastMonthArrears').val();
		json_data.fullname =$("#CUST_ID").val();
		json_data.LastMonthRecovery = $("#LastMonthRecovery").val();
		json_data.LateFee = $("#LateFee").val();
		json_data.ThisMonthShouldCost = $('#ThisMonthShouldCost').val();
		json_data.ReturnMoney = $("#ReturnMoney").val();
		//json_data.ModifyUserId = $("#receiver").val();
		var strModifyUserId=$("#receiver").val();
		json_data.ModifyUserId = strModifyUserId;
		json_data.ST_Capacity = $("#ST_Capacity").val();
		json_data.ModifyDate = $("#ModifyDate").val();
		json_data.Price = $("#Price").val();
		json_data.Cost = $("#Cost").val();
		json_data.CreateUserId = str_createUserId;
		
		var aw_sewagetreatrefundEntity = JSON.stringify(json_data);
		console.log(typeof keyValue)
		console.log(typeof keyValue+"")
		
		cm.ajax({
			url: "/AfterSaleManage/aw_sewagetreatrefund/SaveForm",
			type: "POST",
			dataType: "json",
			data: {
				keyValue : keyValue,
				aw_sewagetreatrefundEntityStr: aw_sewagetreatrefundEntity
			},
			success: function(data) {
//				if(nodifyuserid != null) {
//					nodifyuserid = nodifyuserid.replace(/,/, ";");
//					$("#receiver").select2().select2("val", nodifyuserid.split(';'));
//				} else {
//					$("#receiver").select2();
//				}
				console.log(data)
				dialogMsg(data.message, 1);
				dialogClose();
			},
			error: function(data) {
				dialogMsg(data.message, 2);
			}
		})
	}
};

var model = new viewModel();