var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var slseq = request('slSeq');
	var client = "";
	var aw_feed_back_client_ID; //操作全局变量赋值
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
	window.onunload = function() {
		sessionStorage.removeItem("tranfer_key")
	};
	//页面初始化
	$(function() {
		self.Initializations();

	});
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
				if(res.length > 0) {
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
				} else {
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
	this.preservation_b = function() {
		var json_data = {};
		json_data.aw_feed_back_client_id = aw_feed_back_client_ID;
		json_data.aw_workInfo_id = keyValue;
		json_data.client = $("#customer").val();
		json_data.feed_back_date = $("#dateTime").val();
		json_data.clientComments = $("#vendorDesc1").val();
		//服务及时性
		var serviceInTimes = document.getElementById('getgrade').innerHTML;
		if(serviceInTimes == 2.0) {
			serviceInTimes = "非常不满意";
		} else if(serviceInTimes == 4.0) {
			serviceInTimes = "不满意";
		} else if(serviceInTimes == 6.0) {
			serviceInTimes = "一般";
		} else if(serviceInTimes == 8.0) {
			serviceInTimes = "满意";
		} else if(serviceInTimes == 10.0) {
			serviceInTimes = "非常满意";
		}
		json_data.serviceInTime = serviceInTimes;
		//		alert(json_data.serviceInTime+"1")
		//服务结果
		var serviceResults = document.getElementById('getgradea').innerHTML;
		if(serviceResults == 2.0) {
			serviceResults = "非常不满意";
		} else if(serviceResults == 4.0) {
			serviceResults = "不满意";
		} else if(serviceResults == 6.0) {
			serviceResults = "一般";
		} else if(serviceResults == 8.0) {
			serviceResults = "满意";
		} else if(serviceResults == 10.0) {
			serviceResults = "非常满意";
		}
		json_data.serviceResult = serviceResults;
		//		alert(json_data.serviceResult+"2");
		//服务态度
		var serviceAttitudes = document.getElementById('getgradeb').innerHTML;
		if(serviceAttitudes == 2.0) {
			serviceAttitudes = "非常不满意";
		} else if(serviceAttitudes == 4.0) {
			serviceAttitudes = "不满意";
		} else if(serviceAttitudes == 6.0) {
			serviceAttitudes = "一般";
		} else if(serviceAttitudes == 8.0) {
			serviceAttitudes = "满意";
		} else if(serviceAttitudes == 10.0) {
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
			data: {
				entity: str,
				keyValue: aw_feed_back_client_ID
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

	this.delete_s = function(e) { //现象描述删除图片
		var id = e.getAttribute("data-id");
		$.RemoveForm({
			url: "/AfterSaleManage/aw_workinfo/BatchDeleteWithID", //回访
			type: "POST",
			dataType: "json",
			param: {
				keyValue: id,
				tbname: "aw_serviceDesc_attachment"
			},
			success: function(data) {
				var v = e.getAttribute("data-v");
				$(v).remove(); //清空
				$('#attachmentid').trigger('reloadGrid');
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	this.delete_a = function(e) { //客户服务需求信息摘要删除图片
		var id = e.getAttribute("data-id");
		$.RemoveForm({
			url: "/AfterSaleManage/aw_workinfo/BatchDeleteWithID", //回访
			type: "POST",
			dataType: "json",
			param: {
				keyValue: id,
				tbname: "aw_requirement_attachment"
			},
			success: function(data) {
				var v = e.getAttribute("data-v");
				$(v).remove(); //清空
				$('#req_id').trigger('reloadGrid');
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	this.delete_b = function(e) { //原因分析删除图片
		var id = e.getAttribute("data-id");
		$.RemoveForm({
			url: "/AfterSaleManage/aw_workinfo/BatchDeleteWithID", //回访
			type: "POST",
			dataType: "json",
			param: {
				keyValue: id,
				tbname: "aw_cause_attachment"
			},
			success: function(data) {
				var v = e.getAttribute("data-v");
				$(v).remove(); //清空
				$('#aw_attachmentid').trigger('reloadGrid');
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	this.delete_management = function(e) { //处置方案删除图片
		var id = e.getAttribute("data-id");
		$.RemoveForm({
			url: "/AfterSaleManage/aw_workinfo/BatchDeleteWithID", //回访
			type: "POST",
			dataType: "json",
			param: {
				keyValue: id,
				tbname: "aw_solution_attachment"
			},
			success: function(data) {
				var v = e.getAttribute("data-v");
				console.log(v)
				$(v).remove(); //清空
				$('#aw_solution_a').trigger('reloadGrid');
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	this.delete_Implementation = function(e) { //方案实施删除图片
		var id = e.getAttribute("data-id");
		$.RemoveForm({
			url: "/AfterSaleManage/aw_workinfo/BatchDeleteWithID", //回访
			type: "POST",
			dataType: "json",
			param: {
				keyValue: id,
				tbname: "aw_implementAttachment"
			},
			success: function(data) {
				var v = e.getAttribute("data-v");
				console.log(v)
				$(v).remove(); //清空
				$('#Implementation').trigger('reloadGrid');
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	//更新表单信息;
	this.updateClick = function() {
		var postData = $("#form").GetWebControls();
		postData["receiver"] = receiver_id_list.join(";");
		postData["assistant"] = assistant_id_list.join(";");
		postData["serviceStaff"] = serviceStaff_id_list.join(";");
		postData["dispatchingPerson"] = dispatchingPerson_id_list.join(";");
		postData["acceptor"] = acceptor_id_list.join(";");
		self.personnelSelection();
		var json_data = {};

		//		json_data.baseEntity = postData; 
		json_data.aw_requirementEntityList = []; //客户服务需求信息摘要
		json_data.aw_servicedescEntityList = []; //现象描述
		json_data.aw_causeconclusionEntityList = []; //原因分析
		json_data.aw_solutionEntityList = []; //处置方案
		json_data.aw_implementoperationhistoryEntityList = []; //方案实施
		json_data.aw_return_visitEntityList = []; //回访意见
		var visit = $("#visitentity").find('.tab-content').length; //回访意见

		for(var i = 0; i < visit; i++) { //回访意见
			var aw_return_visitids = $("#aw_return" + i).data("id"); //回访意见主键id
			var returnVisitStaff = $("#returnVisitStaff" + i).data("id_"); //回访人id
			var returnVisitTime = $("#returnVisitTime" + i).val(); //回访时间
			var serviceInTime = $("#serviceInTime" + i).attr('data-text'); //服务及时性
			var serviceNormal = $("#serviceNormal" + i).val(); //服务规范性
			var serviceEffective = $("#serviceEffective" + i).val(); //服务有效性
			var clientComments = $("#clientComments" + i).val(); //客户意见
			//			alert(clientComments)
			var json_index = {
				aw_return_visitid: aw_return_visitids,
				returnVisitStaff: returnVisitStaff,
				returnVisitTime: returnVisitTime,
				serviceInTime: serviceInTime,
				serviceNormal: serviceNormal,
				serviceEffective: serviceEffective,
				clientComments: clientComments
			}
			json_data.aw_return_visitEntityList.push(json_index);
		}

		var len = $("#aw_requirementEntityList").find('.file-item').length; //客户服务需求信息摘要

		for(var i = 0; i < len; i++) { //客户服务需求信息摘要
			var id_s = $("#text_" + i).data("id");
			var val_s = $("#text_" + i).text();
			var json_index = {
				requirementId: id_s,
				requirementInfo: val_s
			}
			json_data.aw_requirementEntityList.push(json_index);
		}

		var len_a = $("#aw_servicedescEntityList").find(".file-item").length; //现象描述
		for(var i = 0; i < len_a; i++) {
			var id_s = $("#text_a" + i).data("id");
			var val_s = $("#text_a" + i).text();
			var json_index = {
				serviceDescId: id_s,
				serviceDesc: val_s
			}
			json_data.aw_servicedescEntityList.push(json_index);
		}

		var len_c = $("#aw_causeconclusionEntityList").find(".file-item").length; //原因分析
		for(var i = 0; i < len_c; i++) {
			var id_s = $("#text_c" + i).data("id");
			var val_s = $("#text_c" + i).text();
			var json_index = {
				causeConclusionId: id_s,
				causeConclusion: val_s
			}
			json_data.aw_causeconclusionEntityList.push(json_index);
		}

		var len_b = $("#aw_solutionEntityList").find(".file-item").length; //处置方案
		for(var i = 0; i < len_b; i++) {
			var id_s = $("#text_b" + i).data("id");
			var val_s = $("#text_b" + i).text();
			var json_index = {
				solutionId: id_s,
				solution: val_s
			}
			json_data.aw_solutionEntityList.push(json_index);
		}

		var len_b = $("#aw_implementsEntityList").find(".file-item").length; //处置方案
		for(var i = 0; i < len_b; i++) {
			var id_s = $("#text_d" + i).data("id");
			var val_s = $("#text_d" + i).text();
			var json_index = {
				aw_implementOperationid: id_s,
				content: val_s
			}
			json_data.aw_implementoperationhistoryEntityList.push(json_index);
		}

		console.log(JSON.stringify({
			workInfoJson: json_data
		}));
		var str = JSON.stringify(json_data);
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_AftersalesUpdateInfo/SaveFormData?keyValue=" + keyValue, //回访
			type: "POST",
			dataType: "json",
			data: postData,
			success: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				dialogMsg(data.message, 1);
				Loading(false)
				console.log(data);
				//				dialogClose();
				cm.ajax({
					//受理客户需求
					url: "/AfterSaleManage/aw_AftersalesUpdateInfo/workorderFixData?keyValue=" + keyValue, //回访
					type: "POST",
					dataType: "json",
					data: {
						keyValue: keyValue,
						workInfoJson: str
					},
					success: function(data) {
						//						alert("success")
						top.$("#loading_manage").removeAttr('isTableLoading');
						dialogMsg(data.message, 1);
						Loading(false)
						console.log(data);
						dialogClose();
					},
					error: function(data) {
						//						alert("erreo")
						top.$("#loading_manage").removeAttr('isTableLoading');
						dialogMsg(data.message, 2);
						Loading(false)
						console.log(data);
						//				dialogClose();
					}
				})
			},
			error: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				dialogMsg(data.message, 2);
				Loading(false)
				console.log(data);
				dialogClose();
			}
		})

	}
	/** 关闭本工单信息 **/
	this.CloseTaskClick = function() {
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		var postData = $("#form").GetWebControls();
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_customerServiceInfo/SaveFormDataWithClose?keyValue=" + keyValue, //回访
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
	//编辑
	this.btn_edit = function(obj) { //客户服务需求信息摘要
		var $obj = $(obj),
			text_value = $obj.data('value'),
			index_id = $obj.data('index'),

			p_value = $("#text_" + index_id).text();
		dialogOpen({
			id: "EditForms",
			title: '编辑内容',
			url: '/hongtupage/view/aw_AftersalesUpdateInfo/revisedWorkList_form.html?index_id=' + index_id + '&text_value=' + p_value,
			width: "400px",
			height: "300px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick(function(json_data) {
					var index = json_data.id;
					var value_text = json_data.value;
					$("#text_" + index).text(value_text);
				});
			}
		});
	}

	//编辑
	this.btn_edit_a = function(obj) { //现象描述
		var $obj = $(obj),
			text_value = $obj.data('value'),
			index_id = $obj.data('index'),
			p_value = $("#text_a" + index_id).text();
		dialogOpen({
			id: "EditForms_a",
			title: '编辑分类',
			url: '/hongtupage/view/aw_AftersalesUpdateInfo/revisedWorkList_form.html?index_id=' + index_id + '&text_value=' + p_value,
			width: "400px",
			height: "300px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick(function(json_data) {
					var index = json_data.id;
					var value_text = json_data.value;
					$("#text_a" + index).text(value_text);
				});
			}
		});
	}

	//编辑
	this.btn_edit_c = function(obj) { //原因分析
		var $obj = $(obj),
			text_value = $obj.data('value'),
			index_id = $obj.data('index'),
			p_value = $("#text_c" + index_id).text();
		dialogOpen({
			id: "EditForms_b",
			title: '编辑分类',
			url: '/hongtupage/view/aw_AftersalesUpdateInfo/revisedWorkList_form.html?index_id=' + index_id + '&text_value=' + p_value,
			width: "400px",
			height: "300px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick(function(json_data) {
					var index = json_data.id;
					var value_text = json_data.value;
					$("#text_c" + index).text(value_text);
				});
			}
		});
	}

	//编辑
	this.btn_edit_b = function(obj) { //处置方案
		var $obj = $(obj),
			text_value = $obj.data('value'),
			index_id = $obj.data('index'),
			p_value = $("#text_b" + index_id).text();
		dialogOpen({
			id: "EditForms_a",
			title: '编辑分类',
			url: '/hongtupage/view/aw_AftersalesUpdateInfo/revisedWorkList_form.html?index_id=' + index_id + '&text_value=' + p_value,
			width: "400px",
			height: "300px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick(function(json_data) {
					var index = json_data.id;
					var value_text = json_data.value;
					$("#text_b" + index).text(value_text);
				});
			}
		});
	}

	//编辑
	this.btn_edit_d = function(obj) { //方案实施情况
		var $obj = $(obj),
			text_value = $obj.data('value'),
			index_id = $obj.data('index'),
			p_value = $("#text_d" + index_id).text();
		dialogOpen({
			id: "EditForms_d",
			title: '编辑分类',
			url: '/hongtupage/view/aw_AftersalesUpdateInfo/revisedWorkList_form.html?index_id=' + index_id + '&text_value=' + p_value,
			width: "400px",
			height: "300px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick(function(json_data) {
					var index = json_data.id;
					var value_text = json_data.value;
					$("#text_d" + index).text(value_text);
				});
			}
		});
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
	//var keyValue = request('keyValue');
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