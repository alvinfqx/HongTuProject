 var viewModel = function() {
 	var self = this;
 	var keyValue = request('keyValue');
 	var slseq = request('slSeq');

 	//var keyValue = request('keyValue');
 	$(function() {
 		self.Gettotaldata()
 		self.GetUserAvatar()
 		self.GetProgress()
 		self.GetImplementProgress()

 		var $li = $('#tab>li');
 		var $div = $('#main_body>section');

 		$li.click(function() {
 			var $this = $(this);
 			var $i = $this.index();
 			$li.removeClass();
 			$this.addClass('current');
 			$div.css('display', 'none');
 			$div.eq($i).css('display', 'block');
 		});

 		//add--zhu
 		$('body').on('click', function(e) {
 			//获得哪个标签被点击
 			var which_item = $(e.target)
 			//弹出放大显示图片
 			var img = which_item.attr('src')
 			if(img != null) {
 				popimg(img)
 			}
 		})

 		var appElement = document.querySelector('div .inmodal');
 		//requestMents
 		var myDropzone = new Dropzone("#dropzone1", {
 			// url: "/admin/upload",//文件提交地址
 			url: cm.domain +"/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_requirement_attachment&token=" + cm.token, //文件提交地址
 			method: "post", //也可用put
 			paramName: "file", //默认为file
 			maxFiles: 10, //一次性上传的文件数量上限
 			// maxFilesize: 2, //文件大小，单位：MB
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
 						// 						alert(message);
 					}
 				});
 				this.on("removedfile", function(file) {
 					console.log('removedfile');
 					console.log("File " + file.name + "removed");
 					//删除文件时触发的方法
 					//  var file_id = angular.element(appElement).scope().file_id;
 					var file_id = "11";
 					// 					alert(file_id);
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

 		//dropzoneSolution
 		var myDropzone = new Dropzone("#dropzoneSolution", {
 			// url: "/admin/upload",//文件提交地址
 			url: cm.domain +"/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_solution_attachment&token=" + cm.token, //文件提交地址
 			method: "post", //也可用put
 			paramName: "file", //默认为file
 			maxFiles: 10, //一次性上传的文件数量上限
 			// maxFilesize: 2, //文件大小，单位：MB
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
 						// 						alert(message);
 					}
 				});
 				this.on("removedfile", function(file) {
 					console.log('removedfile');
 					console.log("File " + file.name + "removed");
 					//删除文件时触发的方法
 					//  var file_id = angular.element(appElement).scope().file_id;
 					var file_id = "11";
 					// 					alert(file_id);
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

 		//dropzoneCause
 		var myDropzone = new Dropzone("#dropzoneCause", {
 			// url: "/admin/upload",//文件提交地址
 			url: cm.domain +"/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_cause_attachment&token=" + cm.token, //文件提交地址
 			method: "post", //也可用put
 			paramName: "file", //默认为file
 			maxFiles: 10, //一次性上传的文件数量上限
 			// maxFilesize: 2, //文件大小，单位：MB
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
 						// 						alert(message);
 					}
 				});
 				this.on("removedfile", function(file) {
 					console.log('removedfile');
 					console.log("File " + file.name + "removed");
 					//删除文件时触发的方法
 					//  var file_id = angular.element(appElement).scope().file_id;
 					var file_id = "11";
 					// 					alert(file_id);
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

 		//dropzoneDesc
 		var myDropzone = new Dropzone("#dropzoneDesc", {
 			// url: "/admin/upload",//文件提交地址
 			url:cm.domain + "/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_serviceDesc_attachment&token=" + cm.token, //文件提交地址
 			method: "post", //也可用put
 			paramName: "file", //默认为file
 			maxFiles: 10, //一次性上传的文件数量上限
 			// maxFilesize: 2, //文件大小，单位：MB
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

 		//$(".dropzone").dropzone({
 		//	url: " /AfterSaleManage/aw_workinfo/BatchUpload?keyValue=" + keyValue + "&tbname=" + "aw_requirement_attachment"
 		//});
 		/*  $(".dropzone").dropzone({
 		      url: " /AfterSaleManage/aw_workinfo/BatchUpload?keyValue=" + keyValue + "&tbname=" + "aw_requirement_attachment"
 		  });*/
 		//$("#dropzone1").dropzone({
 		//    url: " /AfterSaleManage/aw_workinfo/BatchUpload?keyValue=" + keyValue + "&tbname=" + "aw_requirement_attachment", addRemoveLinks: true, init: function () {
 		//        this.on("addedfile", function (file) {

 		//        });
 		//        this.on("queuecomplete", function (file) {
 		//            //上传完成后触发的方法
 		//        });
 		//        this.on("removedfile", function (file) {
 		//            //删除文件时触发的方法
 		//            console.log("删除")
 		//        });
 		//    }
 		//});
 		initControl();
 	});

 	//add----zhu
 	this.popimg = function(img) {
 		$('.popwindow').addClass('popwindow-show');
 		$(".popwindow").find("img").attr("src", img);
 		$(".popwindow").find("img").css("visibility", "inherit");
 	}

 	this.exit_img = function() {
 		$('.popwindow').removeClass('popwindow-show');
 	}

 	//初始化控件
 	this.initControl = function() {
 		//产品型号
 		$("#productType").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "product_type_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});
 		//工单状态
 		$("#workStatus").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "workstaus_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});
 		//信息分类
 		$("#infoType").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "info_type_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//信息来源
 		$("#infoSource").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "info_resource_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//服务性质
 		$("#serviceNature").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "sevice_nature_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//服务类型
 		$("#serviceType").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "service_type_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//服务方式
 		$("#serviceMode").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "service_mode_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//服务级别
 		$("#serviceClass").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "servie_class_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//是否索赔
 		$("#isNeededClaim").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "yes_or_no_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//是否出差
 		$("#isNeededTrip").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "yes_or_no_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//过程状态
 		$("#serviceStatus").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "norm_or_abnorm_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//结果确认
 		$("#resultConfirm").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "done_or_working"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//服务及时性
 		$("#serviceInTime").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "satisfy_degree_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//服务规范性
 		$("#serviceNormal").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "satisfy_degree_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		//服务有效性
 		$("#serviceEffective").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "satisfy_degree_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		$("#assistantDept").ComboBox({
 			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
 			param: {
 				EnCode: "rec_dept_as"
 				//  EnCode: "rec_dept_as"
 			},
 			id: "ItemValue",
 			text: "ItemName",
 			description: "==请选择==",
 			height: "200px"
 		});

 		$("#assistant").ComboBoxTree({
 			url: "/BaseManage/User/GetTreeJson",
 			param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
 			description: "==请选择==",
 			height: "200px",
 			allowSearch: true
 		});

 		//接单人
 		$("#acceptor").ComboBoxTree({
 			url: "/BaseManage/User/GetTreeJson",
 			param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
 			description: "==请选择==",
 			height: "200px",
 			allowSearch: true
 		});

 		//信息受理人
 		$("#receiver").ComboBoxTree({
 			url: "/BaseManage/User/GetTreeJson",
 			param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
 			description: "==请选择==",
 			height: "200px",
 			allowSearch: true
 		});

 		//派工人员
 		$("#dispatchingPerson").ComboBoxTree({
 			url: "/BaseManage/User/GetTreeJson",
 			param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
 			description: "==请选择==",
 			height: "200px",
 			allowSearch: true
 		});

 		//服务人员
 		$("#serviceStaff").ComboBoxTree({
 			url: "/BaseManage/User/GetTreeJson",
 			param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
 			description: "==请选择==",
 			height: "200px",
 			allowSearch: true
 		});

 		//回访人员
 		$("#returnVisitStaff").ComboBoxTree({
 			url: "/BaseManage/User/GetTreeJson",
 			param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
 			description: "==请选择==",
 			height: "200px",
 			allowSearch: true
 		});

 		//获取表单
 		/* if (!!keyValue) {
 		     $.SetForm({
 		         url: " /AfterSaleManage/aw_workinfo/GetFormJson",
 		         param: {
 		             keyValue: keyValue
 		         },
 		         success: function (data) {
 		             $("#form1").SetWebControls(data);
 		         }
 		     })
 		 }*/
 	}

 	//实施人员进度
 	this.GetImplementProgress = function() {

 		cm.ajax({
 			url: "/AfterSaleManage/aw_workinfo/GetImplementWithAtttachementList",
 			type: "POST",
 			dataType: "json",
 			data: {
 				"keyValue": keyValue
 			},
 			success: function(data) {
 				console.log("GetImplementProgress")
 			},
 			error: function(data) {
 				console.log(data)
 			}
 		});

 	}

 	this.Gettotaldata = function() {
 		cm.ajax({
 			url: "/AfterSaleManage/aw_workinfo/GetFormJsonWithEntity",
 			type: "POST",
 			dataType: "json",
 			data: {
 				"keyValue": keyValue
 			},
 			success: function(data) {
 				// 				alert(data);
 				//                  console.log(keyValue);
 				//                  console.log(data);
 				//                  $("#form").SetWebControls(data.baseEntity);
 				//                  var slseq_html = '<h1>工单号:&nbsp;' + data.baseEntity.slSeq + '&nbsp;[' + data.baseEntity.workStatus + ']</h1>';
 				//                  $("#slSeqStr").append(slseq_html);
 				//                  var aw_rqlist_data = data.aw_requirementEntityList
 				//                  var aw_rqlist_html = '';
 				//
 				//                  $.each(aw_rqlist_data, function (i, n) {
 				//                      var aw_rqlist_img = '';
 				//                      var aw_relist_imgdata = n.aw_requirement_attachmentList
 				//                      $.each(aw_relist_imgdata, function (i, n) {
 				//                          aw_rqlist_img += '<li>'
 				//                          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType)) {
 				//                              aw_rqlist_img += '<img src="' + n.fileStorePath + '" alt="' + n.attacheName + '" >'
 				//                          } else {
 				//                              aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'
 				//
 				//                          }
 				//                          aw_rqlist_img += '<div class="mailbox-attachment-info">'
 				//                          aw_rqlist_img += '<a href="' + n.fileStorePath + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
 				//                          aw_rqlist_img += '<a href="' + n.fileStorePath + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
 				//                          aw_rqlist_img += '</div>'
 				//                          aw_rqlist_img += '</li>'
 				//                      })
 				//                      aw_rqlist_html += '<div class="file-item">'
 				//                      aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
 				//                      aw_rqlist_html += '					<div class="file-element-data ">'
 				//                      aw_rqlist_html += '						<p>' + n.requirementInfo + '</p>'
 				//                      aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
 				//                      aw_rqlist_html += aw_rqlist_img
 				//                      aw_rqlist_html += '				</ul>'
 				//                      aw_rqlist_html += '				</div>'
 				//                      aw_rqlist_html += '				</div>'
 				//                  });
 				////                  console.log(aw_rqlist_html)
 				//                  $("#aw_requirementEntityList").append(aw_rqlist_html);

 				//service Desc
 				//                  console.log("service Desc");
 				aw_rqlist_data = data.aw_servicedescEntityList
 				aw_rqlist_html = '';

 				$.each(aw_rqlist_data, function(i, n) {
 					var aw_rqlist_img = '';
 					var aw_relist_imgdata = n.attachementList
 					$.each(aw_relist_imgdata, function(i, n) {
 						aw_rqlist_img += '<li>'
 						if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType)) {
 							aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token='+cm.token+'" alt="' + n.attacheName + '" >'
 						} else {
 							aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

 						}
 						aw_rqlist_img += '<div class="mailbox-attachment-info">'
 						aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
 						aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
 						aw_rqlist_img += '</div>'
 						aw_rqlist_img += '</li>'
 					})
 					aw_rqlist_html += '<div class="file-item">'
 					aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
 					aw_rqlist_html += '					<div class="file-element-data ">'
 					aw_rqlist_html += '						<p>' + n.serviceDesc + '</p>'
 					aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
 					aw_rqlist_html += aw_rqlist_img
 					aw_rqlist_html += '				</ul>'
 					aw_rqlist_html += '				</div>'
 					aw_rqlist_html += '				</div>'
 				});

 				$("#aw_servicedescEntityList").append(aw_rqlist_html)

 				//aw_causeconclusionEntityList
 				aw_rqlist_data = data.aw_causeconclusionEntityList
 				aw_rqlist_html = '';

 				$.each(aw_rqlist_data, function(i, n) {
 					var aw_rqlist_img = '';
 					var aw_relist_imgdata = n.aw_cause_attachementList
 					$.each(aw_relist_imgdata, function(i, n) {
 						aw_rqlist_img += '<li>'
 						if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType)) {
 							aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token='+ cm.token +'" alt="' + n.attacheName + '" >'
 						} else {
 							aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

 						}
 						aw_rqlist_img += '<div class="mailbox-attachment-info">'
 						aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token +  '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
 						aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token +  '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
 						aw_rqlist_img += '</div>'
 						aw_rqlist_img += '</li>'
 					})
 					aw_rqlist_html += '<div class="file-item">'
 					aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
 					aw_rqlist_html += '					<div class="file-element-data ">'
 					aw_rqlist_html += '						<p>' + n.causeConclusion + '</p>'
 					aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
 					aw_rqlist_html += aw_rqlist_img
 					aw_rqlist_html += '				</ul>'
 					aw_rqlist_html += '				</div>'
 					aw_rqlist_html += '				</div>'
 				});

 				$("#aw_causeconclusionEntityList").append(aw_rqlist_html)

 				//aw_solutionEntityList
 				aw_rqlist_data = data.aw_solutionEntityList
 				aw_rqlist_html = '';

 				$.each(aw_rqlist_data, function(i, n) {
 					var aw_rqlist_img = '';
 					var aw_relist_imgdata = n.aw_solution_attachmentEntityList
 					$.each(aw_relist_imgdata, function(i, n) {
 						aw_rqlist_img += '<li>'
 						if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType)) {
 							aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token='+ cm.token +'" alt="' + n.attacheName + '" >'
 						} else {
 							aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

 						}
 						aw_rqlist_img += '<div class="mailbox-attachment-info">'
 						aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token +  '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
 						aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token +  '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
 						aw_rqlist_img += '</div>'
 						aw_rqlist_img += '</li>'
 					})
 					aw_rqlist_html += '<div class="file-item">'
 					aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
 					aw_rqlist_html += '					<div class="file-element-data ">'
 					aw_rqlist_html += '						<p>' + n.solution + '</p>'
 					aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
 					aw_rqlist_html += aw_rqlist_img
 					aw_rqlist_html += '				</ul>'
 					aw_rqlist_html += '				</div>'
 					aw_rqlist_html += '				</div>'
 				});

 				/*
 				<ul class="mailbox-attachments clearfix">
 				                                                    <li>

 				                                                        <img src="img/user2-160x160.jpg" />
 				                                                        <div class="mailbox-attachment-info">
 				                                                            <a href="#" class="mailbox-attachment-name"><i class="fa fa-paperclip"></i> Sep2014fdafafdafaf-report.pdf</a>
 				                                                            <a href="#" class="btn btn-default btn-xs pull-right"><i class="fa fa-cloud-download"></i></a>
 				                                                        </div>
 				                                                    </li>
 				                                                    <li>
 				                                                        <!--<span class="mailbox-attachment-icon"><i class="fa fa-file-pdf-o"></i></span>-->
 				                                                        <span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>
 				                                                        <div class="mailbox-attachment-info">
 				                                                            <a href="#" class="mailbox-attachment-name"><i class="fa fa-paperclip"></i> Sep2014-report.pdf</a>
 				                                                            <a href="#" class="btn btn-default btn-xs pull-right"><i class="fa fa-cloud-download"></i></a>
 				                                                        </div>
 				                                                    </li>
 				                                                </ul>

 				*/

 				$("#aw_solutionEntityList").append(aw_rqlist_html)

 				var visitentity_data = data.aw_return_visitEntityList

 				var visi_head_html = '',
 					visi_body_html = '',
 					visi_data_html = ''

 				if(visitentity_data != null) {

 					if(visitentity_data.length == 0) {
 						visi_data_html = '<h5>暂无回访记录</h5>'
 					} else {
 						$.each(visitentity_data, function(i, n) {
 							visi_head_html += '<li class="' + (i == 0 ? "active" : "") + '">'
 							visi_head_html += '<a href="#' + i + '" data-toggle="tab">第' + (i + 1) + '次</a>'
 							visi_head_html += '</li>'

 							visi_body_html += '<div class="tab-pane ' + (i == 0 ? "active" : "") + ' " id="' + i + '">'
 							visi_body_html += '<div class="form-group">'

 							visi_body_html += '<label class="col-sm-2 ">回访人员</label>'
 							visi_body_html += '<div class="col-sm-2">'
 							visi_body_html += '<div>' + n.returnVisitStaff + '</div>'
 							visi_body_html += '</div>'

 							visi_body_html += '<label class="col-sm-2 ">回访时间</label>'
 							visi_body_html += '<div class="col-sm-2">'
 							visi_body_html += '<div>' + n.returnVisitTime + '</div>'
 							visi_body_html += '</div>'
 							visi_body_html += '</div>'
 							visi_body_html += '<div class="form-group">'
 							visi_body_html += '<label class="col-sm-2 ">服务及时性</label>'
 							visi_body_html += '<div class="col-sm-2">'
 							visi_body_html += '<div>' + n.serviceInTime + '</div>'
 							visi_body_html += '</div>'
 							visi_body_html += '<label class="col-sm-2">服务规范性</label>'
 							visi_body_html += '<div class="col-sm-2">'
 							visi_body_html += '<span>' + n.serviceNormal + '</span>'
 							visi_body_html += '</div>'

 							visi_body_html += '<label class="col-sm-2">服务有效性</label>'
 							visi_body_html += '<div class="col-sm-2">'
 							visi_body_html += '<div>' + n.serviceEffective + '</div>'
 							visi_body_html += '</div>'

 							visi_body_html += '</div>'

 							visi_body_html += '<div class="form-group">'

 							visi_body_html += '<label class="col-sm-1">客户意见</label>'
 							visi_body_html += '<div class="col-sm-10">'
 							visi_body_html += '<div>' + (n.clientComments || "无") + '</div>'
 							visi_body_html += '</div>'
 							visi_body_html += '</div>'

 							visi_body_html += '</div>'
 						});
 						visi_data_html += '<ul class="nav nav-tabs">'
 						visi_data_html += visi_head_html
 						visi_data_html += '</ul>'
 						visi_data_html += '<div class="tab-content">'
 						visi_data_html += visi_body_html
 						visi_data_html += '</div>'
 					}

 				} else {
 					visi_data_html = '<h5>暂无回访记录</h5>'

 				}

 				$("#visitentity").append(visi_data_html)
 			},
 			error: function(data) {
 				//                  console.log(data);

 			}
 		})
 	}

 	//成员列表
 	this.GetUserAvatar = function() {
 		cm.ajax({
 			url: "/AfterSaleManage/aw_workinfo/GetAwWrokUserJson",
 			type: "POST",
 			dataType: "json",
 			data: {
 				"keyValue": slseq
 			},
 			success: function(data) {
 				//                  console.log("getUserAvatar")
 				//                  console.log(data)
 				var avatar_html = " ";
 				$.each(data, function(i, n) {
 					/*avatar_html += '<div class="avatar_item ">';
 					avatar_html += '<h6 style="display: none; ">' + n.userid + '</h6>';
 					avatar_html += '<h6 style="display: none; ">' + n.Roleid + '</h6>';
 					avatar_html += '<div class="avatar_item_ld ">';
 					avatar_html += '<h3>' + n.fullname + '</h3>';
 					avatar_html += '<p>' + n.description + '</p>';
 					avatar_html += '</div>';
 					avatar_html += '</div>';*/

 					avatar_html += '<li>'
 					avatar_html += '<img src=" /AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=e://MES_CAT//TankPic//SL20170921084025//SL20170921084025_20170921084032636.jpg&token="' + cm.token;
// 					avatar_html += cm.token;
 					avatar_html += '<a class="users-list-name" href="#">' + n.realname + '</a>'
 					avatar_html += '<span class="users-list-date">' + n.fullname + '</span>'
 					avatar_html += '</li>'
 				});
 				$(".users-list").append(avatar_html);
 			},
 			error: function(data) {
 				//                  console.log(data)
 			}
 		});
 	}

 	this.GetProgress = function() {
 		// 		alert(slseq);
 		cm.ajax({
 			url: "/AfterSaleManage/aw_workinfo/GetAwWorkInfoTreeJson",
 			type: "POST",
 			dataType: "json",
 			data: {
 				"keyValue": slseq
 			},
 			success: function(data) {
 				//                  console.log(data)
 				var time_html = " ";
 				$.each(data, function(i, n) {
 					var finis_d = n.FinishedDate || "暂无时间"
 					time_html += '<li>'
 					time_html += '<i class="fa fa-envelope bg-blue"></i>'
 					time_html += '<div class="timeline-item">'
 					time_html += '<span class="time"><i class="fa fa-clock-o"></i>&nbsp;完成时间:&nbsp;' + finis_d + '</span>'
 					time_html += '<h3 class="timeline-header">工作状态:&nbsp;' + n.StateID + '</h3>'
 					time_html += '<div class="timeline-body">'
 					//time_html+='<h6>工作任务名: test</h6>'
 					time_html += '<p>接收人名字:&nbsp;' + n.Recipients + '</p>'
 					time_html += '<p>填写内容:&nbsp;' + n.EntryContent + '</p>'

 					time_html += '<img src=" /AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=e://MES_CAT//TankPic//SL20170921084025//SL20170921084025_20170921084032636.jpg&token="' + cm.token;
 					time_html += '" alt="..." class="margin" style="width: 150px;height: 100px;">';
 					time_html += '</div>'
 					time_html += '</div>'
 					time_html += '</li>'
 				});
 				$(".timeline").append(time_html);
 			},
 			error: function(data) {

 				console.log(data)
 			}
 		});
 	}
 	/*
 	 <li>
 	                        <i class="fa fa-envelope bg-blue"></i>
 	                        <div class="timeline-item">
 	                            <span class="time"><i class="fa fa-clock-o"></i>&nbsp;完成时间: 2017-8-16 17:11:14</span>
 	                            <h3 class="timeline-header">工作任务ID: w002333</h3>
 	                            <div class="timeline-body">
 	                                <h6>工作任务名: test</h6>
 	                                <p>填写内容: test</p>
 	                                <p>接收人名字: 1</p>
 	                                <img src="http://placehold.it/150x100" alt="..." class="margin">
 	                                <img src="http://placehold.it/150x100" alt="..." class="margin">
 	                                <img src="http://placehold.it/150x100" alt="..." class="margin">
 	                                <img src="http://placehold.it/150x100" alt="..." class="margin">
 	                            </div>
 	                        </div>
 	                    </li>
 	 * */

 	this.show_msage = function(target) {
 		console.log("cehi")
 		var $up_data = $(target).parent().parent().parent().find(".up-data")
 		var $dropzone = $up_data.find(".dropzone")
 		var $up_data_msg = $up_data.find(".up-data-msg")
 		if($up_data.css("display") == "none") {
 			//$up_data.show();
 			$up_data.css("display", "block");
 			$up_data_msg.css('display', 'block');
 			$dropzone.css('display', 'block');
 		} else {
 			//$up_data.hide();
 			$up_data.css("display", "none");
 			$up_data_msg.css('display', 'none');
 			$dropzone.css('display', 'none');
 		}
 	}

 	this.up_form_data = function() {

 		//    dialogClose();
 		/*if(!$('#form').Validform()) {
 		    return false;
 		}*/
 		// 		alert("commit up_form_data");
 		var postData = $("#form").GetWebControls();
 		console.log(postData)

 		cm.ajax({
 			//受理客户需求
 			url: "/AfterSaleManage/aw_CustomerAddNewRequire/SaveFormData?keyValue=" + keyValue, //回访
 			//填写最终实施结果
 			//  url: "http://localhost:4066/AfterSaleManage/aw_ServiceManageAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

 			//  url: "http://localhost:4066/AfterSaleManage/aw_AftersalesAssignedToNeed/SaveFormData?keyValue=SL_20170908001", //提出解决方案
 			// url: "http://localhost:4066/AfterSaleManage/aw_CustomerAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

 			type: "POST",
 			dataType: "json",
 			data: postData,
 			success: function(data) {
 				console.log(data);
 			},
 			error: function(data) {
 				console.log(data);
 			}
 		})
 	}

 	//保存表单;
 	this.AcceptClick = function() {
 		///alert("AcceptClick111233323");
 		//alert(keyValue);
 		var postData = $("#form").GetWebControls();
 		Loading(true, "正在拼了命为您处理。。。");
 		top.$("#loading_manage").attr('isTableLoading', 'true');
 		cm.ajax({
 			//受理客户需求
 			url: " /AfterSaleManage/aw_CustomerAddNewRequire/SaveFormData?keyValue=" + keyValue, //回访
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