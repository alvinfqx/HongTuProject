var viewModel = function() {
	var keyValue = request('keyValue');
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
			async: false,
			success: function(data) {
				var data = data[0];
				console.log(data)
				$("#form").SetWebControls(data);
				var month = data.month;
				var fullname = data.fullname;
				var price = data.price;
				var st_capacity = data.st_capacity;
				var cost = data.cost;
				var lastmontharrears = data.lastmontharrears;
				var returnmoney = data.returnmoney;
				var latefee = data.latefee;
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
};

var model = new viewModel();