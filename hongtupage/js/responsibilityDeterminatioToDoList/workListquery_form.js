var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var slseq = request('slSeq');
	var aw_feed_back_client_ID;//操作全局变量赋值
	var aw_qc_processIdid;
	$('#simple_id').text(cm.smallSystemName);
	$('#logo_id').text(cm.comSystemName);
//	var receiver_id_list = []; //受理人员id
//	var receiver_name_list = []; //人员名称
//	var assistant_id_list = []; //接收人员id
//	var assistant_name_list = []; 
//	var serviceStaff_id_list = [];//服务人员id
//	var serviceStaff_name_list = [];
//	var dispatchingPerson_id_list = [];//实施人员id
//	var dispatchingPerson_name_list = [];
//	var acceptor_id_list = [];//接单人员id
//	var acceptor_name_list = [];\n
window.onunload = function() {
		sessionStorage.removeItem("tranfer_key")
	};
	//页面初始化
	$(function() {
		self.ServiceCenterSettings();
		self.Initializations();
		});
		this.AcceptClick = function() {
		dialogClose();
	}
		//初始化客户评价
	this.Initializations = function() {
		var jsondatd = {};
		jsondatd.workInfoId = keyValue;
		var da = JSON.stringify(jsondatd);
		cm.ajax({
			url: "/AfterSaleManage/aw_feed_back_client/GetListJson", //
			type: "POST",
			dataType: "json",
			data: {
				queryJson: da
			},
			success: function(res) {
				console.log(res);
//				alert(res.length);
				if(res.length > 0){
				var data = res[0];
				var aw_feed_back_client_id = data.aw_feed_back_client_id;
				aw_feed_back_client_ID = data.aw_feed_back_client_id;
				var aw_workInfo_id = data.aw_workInfo_id;
				var serviceInTime = data.serviceInTime;
				var serviceAttitude = data.serviceAttitude;
				var serviceResult = data.serviceResult;
				var feed_back_date = data.feed_back_date;
				var client = data.client;
				var clientComments = data.clientComments;
//				alert(clientComments);
				$("#dateTime").val(feed_back_date);
				$("#customer").val(client);
				$("#vendorDesc1").val(clientComments);
				var x = 1;
				if(serviceInTime == '非常满意') {
					x = 10;
				} else if(serviceInTime == '满意') {
					x = 8;
				} else if(serviceInTime == '非常不满意') {
					x = 2;
				} else if(serviceInTime == '不满意') {
					x = 4;
				} else if(serviceInTime == '一般') {
					x = 6;
				}
				var star = document.getElementById('stara');
				var items = star.getElementsByTagName("li");
				x = parseInt(x) - 1;
				var tem = -1;
				for(var i = 0; i < items.length; i++) {
					if(x > i * 2) {
						items[i].style.background = "url('../../images/star_solid.png') no-repeat";
						items[i].style.backgroundSize = "100% 100%";
					} else {
						if(tem == -1) {
							tem = i;
						}
						items[i].style.background = "url('../../images/star_hollow.png') no-repeat";
						items[i].style.backgroundSize = "100% 100%";
					}
				}
				document.getElementById('getgrade').innerHTML = parseInt(x) + 1 + '.0';

				
				var a = 1;
				if(serviceResult == '非常满意') {
					a = 10;
				} else if(serviceResult == '满意') {
					a = 8;
				} else if(serviceResult == '非常不满意') {
					a = 2;
				} else if(serviceResult == '不满意') {
					a = 4;
				} else if(serviceResult == '一般') {
					a = 6;
				}
				var stara = document.getElementById('starb');
				var items = stara.getElementsByTagName("li");
				a = parseInt(a) - 1;
				var tem = -1;
				for(var i = 0; i < items.length; i++) {
					if(a > i * 2) {
						items[i].style.background = "url('../../images/star_solid.png') no-repeat";
						items[i].style.backgroundSize = "100% 100%";
					} else {
						if(tem == -1) {
							tem = i;
						}
						items[i].style.background = "url('../../images/star_hollow.png') no-repeat";
						items[i].style.backgroundSize = "100% 100%";
					}
				}
				document.getElementById('getgradea').innerHTML = parseInt(a) + 1 + '.0';
				
				
				var b = 1;
				if(serviceAttitude == '非常满意') {
					b = 10;
				} else if(serviceAttitude == '满意') {
					b = 8;
				} else if(serviceAttitude == '非常不满意') {
					b = 2;
				} else if(serviceAttitude == '不满意') {
					b = 4;
				} else if(serviceAttitude == '一般') {
					b = 6;
				}
				var star = document.getElementById('starc');
				var items = star.getElementsByTagName("li");
				b = parseInt(b) - 1;
				var tem = -1;
				for(var i = 0; i < items.length; i++) {
					if(b > i * 2) {
						items[i].style.background = "url('../../images/star_solid.png') no-repeat";
						items[i].style.backgroundSize = "100% 100%";
					} else {
						if(tem == -1) {
							tem = i;
						}
						items[i].style.background = "url('../../images/star_hollow.png') no-repeat";
						items[i].style.backgroundSize = "100% 100%";
					}
				}
				document.getElementById('getgradeb').innerHTML = parseInt(b) + 1 + '.0';
			}else{
				var feed_back_date = new Date().format("yyyy-MM-dd hh:mm");
				$("#dateTime").val(feed_back_date);
			}
				
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	//客户评价保存按钮
	this.preservation_b = function(){
		var json_data = {};
		json_data.aw_feed_back_client_id = aw_feed_back_client_ID;
		json_data.aw_workInfo_id = keyValue;
		json_data.client = $("#customer").val();
		json_data.feed_back_date = $("#dateTime").val();
		json_data.clientComments = $("#vendorDesc1").val();
		//服务及时性
		var serviceInTimes = document.getElementById('getgrade').innerHTML;
		if(serviceInTimes == 2.0){
			serviceInTimes = "非常不满意";
		}else if(serviceInTimes == 4.0){
			serviceInTimes = "不满意";
		}else if(serviceInTimes == 6.0){
			serviceInTimes = "一般";
		}else if(serviceInTimes == 8.0){
			serviceInTimes = "满意";
		}else if(serviceInTimes == 10.0){
			serviceInTimes = "非常满意";
		}
		json_data.serviceInTime =  serviceInTimes;
//		alert(json_data.serviceInTime+"1")
		//服务结果
		var serviceResults = document.getElementById('getgradea').innerHTML;
		if(serviceResults == 2.0){
			serviceResults = "非常不满意";
		}else if(serviceResults == 4.0){
			serviceResults = "不满意";
		}else if(serviceResults == 6.0){
			serviceResults = "一般";
		}else if(serviceResults == 8.0){
			serviceResults = "满意";
		}else if(serviceResults == 10.0){
			serviceResults = "非常满意";
		}
		json_data.serviceResult = serviceResults;
//		alert(json_data.serviceResult+"2");
		//服务态度
		var serviceAttitudes = document.getElementById('getgradeb').innerHTML;
		if(serviceAttitudes == 2.0){
			serviceAttitudes = "非常不满意";
		}else if(serviceAttitudes == 4.0){
			serviceAttitudes = "不满意";
		}else if(serviceAttitudes == 6.0){
			serviceAttitudes = "一般";
		}else if(serviceAttitudes == 8.0){
			serviceAttitudes = "满意";
		}else if(serviceAttitudes == 10.0){
			serviceAttitudes = "非常满意";
		}
		json_data.serviceAttitude = serviceAttitudes;
//		alert(json_data.serviceAttitude+"3");
		var str = JSON.stringify(json_data);
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_feed_back_client/SaveForm", //回访
			type: "POST",
			dataType: "json",
			data:{
				entity : str,
				keyValue : aw_feed_back_client_ID
			},
			success: function(data) {
				dialogMsg(data.message, 1);
				console.log(data);
			},
			error: function(data) {
				dialogMsg(data.message, 2);
				console.log(data);
			}
		})
	}
	this.dianji = function(input_id) { //点击选择
		console.log(input_id)
		dialogOpenATECustomer({
			id: 'Selection_staff',
			title: '选择人员',
			url: '/hongtupage/view/reelection/reelection.html?keyValue='+input_id,
			width: "880px",
			height: "550px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.updateClick(function(id_list, text_array) {
					console.log(id_list)

					var text_list = "";

					$.each(text_array, function(i, n) {
						text_list += text_array[i] + " ";						
					})

					if(input_id == "receiver") {
						$("#receiver").text(text_list)
						receiver_id_list = id_list
						receiver_name_list = text_array
						console.log(receiver_name_list);
					} else if(input_id == "assistant") {
						$("#assistant").text(text_list)
						assistant_id_list = id_list
						assistant_name_list = text_array
					}else if(input_id == "serviceStaff") {
						$("#serviceStaff").text(text_list)
						serviceStaff_id_list = id_list
						serviceStaff_name_list = text_array
					}else if(input_id == "dispatchingPerson") {
						$("#dispatchingPerson").text(text_list)
						dispatchingPerson_id_list = id_list
						dispatchingPerson_name_list = text_array
					}else if(input_id == "acceptor") {
						$("#acceptor").text(text_list)
						acceptor_id_list = id_list
						acceptor_name_list = text_array
					}

				});
			}
		})

	}
	
	this.personnelSelection = function(){
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_workinfo/updateWorkinfoExtend", //回访
			type: "POST",
			dataType: "json",
			data:{
				workinfoIdExtend:$("#slSeq").val(),
				receiverNames:receiver_name_list.join(';'),
				assistantNames:assistant_name_list.join(';'),
				acceptorNames:assistant_name_list.join(';'),
				serviceStaffNames:dispatchingPerson_name_list.join(';'),
				dispatchingPersonNames:dispatchingPerson_name_list.join(';'),
				returnVisitStaffNames:''
			},
			success: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
//				dialogClose();
			},
			error: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
				dialogClose();
			}
		})
	}
	//获取服务中心设置初始化页面
	this.ServiceCenterSettings = function(){
		cm.ajax({
			url: "/AfterSaleManage/aw_qc_process/GetEntityByWorkInfoId", //
			type: "POST",
			dataType: "json",
			data: {
				workInfoId: keyValue
			},
			success: function(data) {
				var aw_qc_processId = data.aw_qc_processId;
				aw_qc_processIdid = data.aw_qc_processId;
				var workInfoId = data.workInfoId;
				var serviceType = data.serviceType;
				var accept_dept = data.accept_dept;
				var duty_dept = data.duty_dept;
				var relate_dept = data.relate_dept;
				var first_cause_conclusion = data.first_cause_conclusion;
				var confirm_cause_conclusion = data.confirm_cause_conclusion;
				var responsible_dept = data.responsible_dept;
				var cause_brief_confirm = data.cause_brief_confirm;
				var processed_results = data.processed_results;
				var memo = data.memo;
				var CreateDate = data.CreateDate;
				var CreateUserId = data.CreateUserId;
				var CreateUserName = data.CreateUserName;
				var ModifyDate = data.ModifyDate;
				var ModifyUserId = data.ModifyUserId;
				var ModifyUserName = data.ModifyUserName;
				var organizationid = data.organizationid;
				$("#serviceType_s").ComboBoxTreeSetValue(serviceType);
				$("#accept_dept").val(accept_dept);
				$("#duty_dept").val(duty_dept);
				$("#relate_dept").val(relate_dept);
				$("#first_cause_conclusion").val(first_cause_conclusion);
				$("#confirm_cause_conclusion").val(confirm_cause_conclusion);
				$("#responsible_dept").val(responsible_dept);
				$("#cause_brief_confir").ComboBoxTreeSetValue(cause_brief_confirm);
				$("#processed_results").val(processed_results);
				$("#memo").val(memo);
				console.log(data);
			},
			error: function(data) {
				console.log(data);
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
	this.div_fun = function(obj) {
		//	  	alert(11);
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
	this.halfStar = function(x) {
		var star = document.getElementById('stara');
		var items = star.getElementsByTagName("li");
		x = parseInt(x) - 1;
		var tem = -1;
		for(var i = 0; i < items.length; i++) {
			if(x > i * 2) {
				items[i].style.background = "url('../../images/star_solid.png') no-repeat";
				items[i].style.backgroundSize = "100% 100%";
			} else {
				if(tem == -1) {
					tem = i;
				}
				items[i].style.background = "url('../../images/star_hollow.png') no-repeat";
				items[i].style.backgroundSize = "100% 100%";
			}
		}
		document.getElementById('getgrade').innerHTML = parseInt(x) + 1 + '.0';
	}
	this.halfStar_a = function(x) {
		var star = document.getElementById('starb');
		var items = star.getElementsByTagName("li");
		x = parseInt(x) - 1;
		var tem = -1;
		for(var i = 0; i < items.length; i++) {
			if(x > i * 2) {
				items[i].style.background = "url('../../images/star_solid.png') no-repeat";
				items[i].style.backgroundSize = "100% 100%";
			} else {
				if(tem == -1) {
					tem = i;
				}
				items[i].style.background = "url('../../images/star_hollow.png') no-repeat";
				items[i].style.backgroundSize = "100% 100%";
			}
		}
		document.getElementById('getgradea').innerHTML = parseInt(x) + 1 + '.0';
	}
	this.halfStar_b = function(x) {
		var star = document.getElementById('starc');
		var items = star.getElementsByTagName("li");
		x = parseInt(x) - 1;
		var tem = -1;
		for(var i = 0; i < items.length; i++) {
			if(x > i * 2) {
				items[i].style.background = "url('../../images/star_solid.png') no-repeat";
				items[i].style.backgroundSize = "100% 100%";
			} else {
				if(tem == -1) {
					tem = i;
				}
				items[i].style.background = "url('../../images/star_hollow.png') no-repeat";
				items[i].style.backgroundSize = "100% 100%";
			}
		}
		document.getElementById('getgradeb').innerHTML = parseInt(x) + 1 + '.0';
	}
};

var model = new viewModel();