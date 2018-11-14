var viewModel = function() {
	var self = this;
	var client = request('client');
//	alert(client)
	var keyValue = request('keyValue');
//	alert(keyValue)
	var slseq = request('slSeq');
	var client = "";
//	var receiver_id_list = []; //受理人员id
//	var receiver_name_list = []; //人员名称
//	var assistant_id_list = []; //接收人员id
//	var assistant_name_list = []; 
//	var serviceStaff_id_list = [];//服务人员id
//	var serviceStaff_name_list = [];
//	var dispatchingPerson_id_list = [];//实施人员id
//	var dispatchingPerson_name_list = [];
//	var acceptor_id_list = [];//接单人员id
//	var acceptor_name_list = [];
	
	$('#simple_id').text(cm.smallSystemName);
	$('#logo_id').text(cm.comSystemName);
//	this.today = function(){
//  var today=new Date();
//  var h=today.getFullYear();
//  var m=today.getMonth()+1;
//  var d=today.getDate();
//  var hh=today.getHours();
//  var mm=today.getMinutes();
//  var ss=today.getSeconds();
//  m= m<10?"0"+m:m;     
//  d= d<10?"0"+d:d;
//  hh = hh < 10 ? "0" + hh:hh;
//  mm = mm < 10 ? "0" +  mm:mm;
//  ss = ss < 10 ? "0" + ss:ss;
//  return h+"-"+m+"-"+d+" "+hh+":"+mm+":"+ss;
//}
//	$(document).ready(function() {
////      alert(self.today());
//       
//      document.getElementById("partition").value = self.today();
//  });
window.onunload = function() {
		sessionStorage.removeItem("tranfer_key")
	};

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

	//一键派单;
	this.AcceptClicks = function() {
		var test = $('#assistant').text();
		var contacts = $('#dispatchingPerson').text();
		var productCode = $('#productCode').val(); //产品编码
		var acceptTime = $('#acceptTime').val(); //接单时间
		var receiverTime = $('#receiverTime').val(); //受理时间
		var productName = $('#productName').val(); //产品名称
		var productType = $('#productType').attr('data-text'); //产品大类
		var productionDate = $('#productionDate').val(); //制造日期
		var serviceMode = $("#serviceMode").attr('data-text'); //服务方式
		var serviceType = $("#serviceType").attr('data-text'); //故障类型
		client = $("#client").val();
		if(productCode == undefined || productCode == "") {
			alert("请输入产品编码。");
			return;
		}
		if(acceptTime == undefined || acceptTime == "") {
			alert("请输入接单时间。");
			return;
		}
		if(receiverTime == undefined || receiverTime == "") {
			alert("请输入受理时间。");
			return;
		}
		if(productName == undefined || productName == "") {
			alert("请输入产品名称。");
			return;
		}
		if(productType == undefined || productType == "") {
			alert("请选择产品大类。");
			return;
		}
		if(productionDate == undefined || productionDate == "") {
			alert("请输入制造日期。");
			return;
		}
		if(serviceMode == undefined || serviceMode == "") {
			alert("请选择服务方式。");
			return;
		}
		if(serviceType == undefined || serviceType == "") {
			alert("请选择故障类型	。");
			return;
		}

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
		console.log(receiver_id_list)
		postData["receiver"] = receiver_id_list.join(";");
		postData["assistant"] = assistant_id_list.join(";");
		postData["serviceStaff"] = serviceStaff_id_list.join(";");
		postData["dispatchingPerson"] = dispatchingPerson_id_list.join(";");
		postData["acceptor"] = acceptor_id_list.join(";");
		self.personnelSelection();
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_AftersalesAssignedToNeed/directAssignWorkstatus?keyValue=" + keyValue, //回访
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

	//转发解决方案;
	this.ForwardSolutionClicks = function() {
		var test = $('#assistant').text();
		var contacts = $('#dispatchingPerson').text();
		var productCode = $('#productCode').val(); //产品编码
		var acceptTime = $('#acceptTime').val(); //接单时间
		var receiverTime = $('#receiverTime').val(); //受理时间
		var productName = $('#productName').val(); //产品名称
		var productType = $('#productType').attr('data-text'); //产品大类
		var productionDate = $('#productionDate').val(); //制造日期
		var serviceMode = $("#serviceMode").attr('data-text'); //服务方式
		var serviceType = $("#serviceType").attr('data-text'); //故障类型
		if(productCode == undefined || productCode == "") {
			alert("请输入产品编码。");
			return;
		}
		if(acceptTime == undefined || acceptTime == "") {
			alert("请输入接单时间。");
			return;
		}
		if(receiverTime == undefined || receiverTime == "") {
			alert("请输入受理时间。");
			return;
		}
		if(productName == undefined || productName == "") {
			alert("请输入产品名称。");
			return;
		}
		if(productType == undefined || productType == "") {
			alert("请选择产品大类。");
			return;
		}
		if(productionDate == undefined || productionDate == "") {
			alert("请输入制造日期。");
			return;
		}
		if(serviceMode == undefined || serviceMode == "") {
			alert("请选择服务方式。");
			return;
		}
		if(serviceType == undefined || serviceType == "") {
			alert("请选择故障类型	。");
			return;
		}

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
		postData["receiver"] = receiver_id_list.join(";");
		postData["assistant"] = assistant_id_list.join(";");
		postData["serviceStaff"] = serviceStaff_id_list.join(";");
		postData["dispatchingPerson"] = dispatchingPerson_id_list.join(";");
		postData["acceptor"] = acceptor_id_list.join(";");
		self.personnelSelection();
//		debugger
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_AftersalesAssignedToNeed/directAssignSolution?keyValue=" + keyValue, //回访
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
	//客户选择按钮
	this.btn_choice_s = function() {
		dialogOpenATECustomer({
			id: 'Choice',
			title: '客户选择',
			url: '/hongtupage/view/equipment/duanxin.html',
			width: '1100px',
			height: '700px',
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClickchoice_s(function(data) {
					//					alert(data.organizeid)			
					$("#organizeid").val(data.organizeid)
					$("#client").val(data.client)
					$("#address").val(data.address)
					$("#linkman").val(data.linkman)
					$("#cellPhone").val(data.cellphone)

					client = $("#client").val();
				});
			}
		});
	}
	//产品选择按钮
	this.btn_choice = function() {
		dialogOpenATECustomer({
			id: 'Choice',
			title: '产品选择',
			url: '/hongtupage/view/equipment/customerProduct.html?client=' + client,
			width: '1100px',
			height: '700px',
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClickchoice_s(function(data) {
					//					alert(data.organizeid)
					$("#orderproductid").val(data.orderproductid)
					$("#productCode").val(data.productcode)
					$("#productName").val(data.producttype)
					$("#memo4").val(data.producttoken)
					$("#memo5").val(data.productdesc);
					$("#productionDate").val(data.deliverytime)
				});
			}
		});

	}

};

var model = new viewModel();