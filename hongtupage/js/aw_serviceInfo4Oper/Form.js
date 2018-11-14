var viewModel = function() {
	var self = this;
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
var client = "";
window.onunload = function() {
		sessionStorage.removeItem("tranfer_key")
	};
	$(function() {
		//requestMents
		var myDropzone = new Dropzone("#selfSolutioDesc", {
			// url: "/admin/upload",//文件提交地址
			url: cm.domain +"/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_selfhelp_so_attachment&token=" + cm.token, //文件提交地址
			method: "post", //也可用put
			paramName: "file", //默认为file
			maxFiles: 10, //一次性上传的文件数量上限
			maxFilesize: 10, //文件大小，单位：MB
			//   acceptedFiles: ".jpg,.gif,.png,.jpeg", //上传的类型
			addRemoveLinks: true,
			parallelUploads: 1, //一次上传的文件数量
			//previewsContainer:"#preview",//上传图片的预览窗口
			dictDefaultMessage: '拖动文件至此或者点击上传',
			dictMaxFilesExceeded: "您最多只能上传10个文件！",
			dictResponseError: '文件上传失败!',
			dictInvalidFileType: "文件类型只能是*.jpg,*.gif,*.png,*.jpeg。",
			dictFallbackMessage: "浏览器不受支持",
			dictFileTooBig: "文件过大上传文件最大支持.",
			dictRemoveLinks: "删除",
			dictCancelUpload: "取消",
			init: function() {
				this.on("addedfile", function(file) {
					//上传文件时触发的事件
					document.querySelector('div .dz-default').style.display = 'none';
				});
				this.on("success", function(file, data) {
					//上传成功触发的事件
					console.log('ok');
					$(".dz-image").css({"z-index":"99999"});
					// angular.element(appElement).scope().file_id = data.data.id;
				});
				this.on("error", function(file, data) {
					//上传失败触发的事件
					console.log('fail');
					var message = '';
					//lavarel框架有一个表单验证，
					//对于ajax请求，JSON 响应会发送一个 422 HTTP 状态码，
					//对应file.accepted的值是false，在这里捕捉表单验证的错误提示
					if(file.accepted) {
						$.each(data, function(key, val) {
							message = message + val[0] + ';';
						})
						//控制器层面的错误提示，file.accepted = true的时候；
						alert(message);
					}
				});
				this.on("removedfile", function(file) {
					console.log('removedfile');
					console.log("File " + file.name + "removed");
					//删除文件时触发的方法
					//  var file_id = angular.element(appElement).scope().file_id;
					var file_id = "11";
					// alert(file_id);
					if(file_id) {
						$.post(cm.domain + '/AfterSaleManage/aw_workinfo/BatchDelete', {
							keyValue: file.name,
							tbname: 'aw_requirement_attachment',
							token: cm.token
						}, function(data) {
							console.log('删除结果:' + data.Message);
						})
					}
					//   angular.element(appElement).scope().file_id = 0;
					document.querySelector('div .dz-default').style.display = 'block';
				});
			}
		});

	});

	var keyValue = request('keyValue');
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
	/** 关闭本工单信息 **/
	this.CloseTaskClick = function() {

		//dialogClose();
		var postData = $("#form").GetWebControls();
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_customerServiceInfo/SaveFormDataWithClose?keyValue=" + keyValue, //回访
			//填写最终实施结果
			//  url: "http://localhost:4066/AfterSaleManage/aw_ServiceManageAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

			//  url: "http://localhost:4066/AfterSaleManage/aw_AftersalesAssignedToNeed/SaveFormData?keyValue=SL_20170908001", //提出解决方案
			// url: "http://localhost:4066/AfterSaleManage/aw_CustomerAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

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

	//新建工单;
	this.AcceptClick = function() {
		// alert("AcceptClick111233323");
		//alert(keyValue);
		var postData = $("#form").GetWebControls();
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		postData["receiver"] = receiver_id_list.join(";");
		postData["assistant"] = assistant_id_list.join(";");
		postData["serviceStaff"] = serviceStaff_id_list.join(";");
		postData["dispatchingPerson"] = dispatchingPerson_id_list.join(";");
		postData["acceptor"] = acceptor_id_list.join(";");
		self.personnelSelection();
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_customerServiceInfo/SaveFormDataWithClose?keyValue=" + keyValue, //回访
			//填写最终实施结果
			//  url: "http://localhost:4066/AfterSaleManage/aw_ServiceManageAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访
			//  url: "http://localhost:4066/AfterSaleManage/aw_AftersalesAssignedToNeed/SaveFormData?keyValue=SL_20170908001", //提出解决方案
			// url: "http://localhost:4066/AfterSaleManage/aw_CustomerAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

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