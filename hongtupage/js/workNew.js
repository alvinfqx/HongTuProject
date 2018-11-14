var keyValue = request('keyValue');
//keyValue = "2018050813284857";
var mul_select;
var slseq = request('slSeq');

var receiver_id_list = []; //受理人员id
var receiver_name_list = []; //人员名称
var assistant_id_list = []; //接收人员id
var assistant_name_list = [];
var serviceStaff_id_list = []; //服务人员id
var serviceStaff_name_list = [];
var dispatchingPerson_id_list = []; //实施人员id
var dispatchingPerson_name_list = [];
var acceptor_id_list = []; //接单人员id
var acceptor_name_list = [];
/** 实施进度数据 */
$(function() {
	/*alert(2013614);*/
	cm.ajax({
		url: "/AfterSaleManage/aw_workinfo/GetImplementWithAtttachementList",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": keyValue
		},
		success: function(data) {
			console.log("实施进度数据")
			console.log(data)
			if(data.length == 0) {
				var time_html = "<h5>暂无进度数据</h5> ";
				$("#implementsProgress").append(time_html);
			} else {
				var time_html = " ";
				$.each(data, function(i, n) {
					var finis_d = n.CreateDate || "暂无时间"
					time_html += '<li>'
					time_html += '<i class="fa fa-envelope bg-blue"></i>'
					time_html += '<div class="timeline-item">'
					time_html += '<span class="time"><i class="fa fa-clock-o"></i>&nbsp;完成时间:&nbsp;' + finis_d + '</span>'
					time_html += '<h3 class="timeline-header">工作状态:&nbsp;' + '现场实施' + '</h3>'
					time_html += '<div class="timeline-body">'
					time_html += '<p>接收人名字:&nbsp;' + n.CreateUserName + '</p>'
					time_html += '<p>填写内容:&nbsp;' + n.content + '</p>'
					var aw_relist_imgdata = n.attachmentList
					for(var j = 0; j < aw_relist_imgdata.length; j++) {
						time_html += '<img src="' + aw_relist_imgdata[j].fileStorePath + '&token=' + cm.token + '"alt="..." class="margin" style="width: 150px;height: 100px;">'
					}
					time_html += '</div>'
					time_html += '</div>'
					time_html += '</li>'
				});
				$("#implementsProgress").append(time_html);
			}

		},
		error: function(data) {
			console.log(data)
		}
	});

	/** 进度数据 **/
	cm.ajax({
		url: "/AfterSaleManage/aw_workinfo/GetAwWorkInfoTreeJson",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": slseq
		},
		success: function(data) {
			console.log("progess data.....")

			console.log(data)
			if(data.length == 0) {
				var time_html = "<h5>暂无工单进度</h5> ";
				$("#progess").append(time_html);
			} else {
				var time_html = " ";
				$.each(data, function(i, n) {
					var finis_d = n.FinishedDate || "暂无时间"
					time_html += '<li>'
					time_html += '<i class="fa fa-envelope bg-blue"></i>'
					time_html += '<div class="timeline-item">'
					time_html += '<span class="time"><i class="fa fa-clock-o"></i>&nbsp;完成时间:&nbsp;' + finis_d + '</span>'
					time_html += '<h3 class="timeline-header">工作状态:&nbsp;' + n.StateID + '</h3>'
					time_html += '<div class="timeline-body">'
					time_html += '<p>接收人名字:&nbsp;' + n.Recipients + '</p>'
					time_html += '<p>填写内容:&nbsp;' + n.EntryContent + '</p>'
					var aw_relist_imgdata = n.attacheMentList
					if(aw_relist_imgdata == null) {} else {
						for(var j = 0; j < aw_relist_imgdata.length; j++) {
							time_html += '<img src="' + aw_relist_imgdata[j].fileStorePath + '&token=' + cm.token + '"alt="..." class="margin" style="width: 150px;height: 100px;">'
						}
					}

					time_html += '</div>'
					time_html += '</div>'
					time_html += '</li>'
				});
				$("#progess").append(time_html);
			}
		},
		error: function(data) {
			console.log(data)
		}

	});
});

$(function() {
	Gettotaldata()
	GetUserAvatar()
	//	ReelectionPullDown();
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
		url: cm.domain + "/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_requirement_attachment&token=" + cm.token, //文件提交地址
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
				$(".dz-image").css({
					"z-index": "99999"
				});
				//			    angular.element(appElement).scope().file_id = data.data.id;
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
				//				var file_id = angular.element(appElement).scope().file_id;

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
				//				angular.element(appElement).scope().file_id = 0;
				document.querySelector('div .dz-default').style.display = 'block';
			});
		}
	});
	var myDropzone = new Dropzone("#dropzone4", {
		// url: "/admin/upload",//文件提交地址
		url: cm.domain + "/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_implementAttachment&token=" + cm.token, //文件提交地址
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
				$(".dz-image").css({
					"z-index": "99999"
				});
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
						tbname: 'aw_implementAttachment',
						token: cm.token
					}, function(data) {
						console.log('删除结果:' + data.Message);
					})
				}

				document.querySelector('div .dz-default').style.display = 'block';
			});
		}
	});
	//dropzoneSolution
	var myDropzone = new Dropzone("#dropzoneSolution", {
		// url: "/admin/upload",//文件提交地址
		url: cm.domain + "/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_solution_attachment&token=" + cm.token, //文件提交地址
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
				$(".dz-image").css({
					"z-index": "99999"
				});
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
				//alert(file_id);
				if(file_id) {
					$.post(cm.domain + '/AfterSaleManage/aw_workinfo/BatchDelete', {
						keyValue: file.name,
						tbname: 'aw_solution_attachment',
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
		url: cm.domain + "/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_cause_attachment&token=" + cm.token, //文件提交地址
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
				$(".dz-image").css({
					"z-index": "99999"
				});
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
				//  alert(file_id);
				if(file_id) {
					$.post(cm.domain + '/AfterSaleManage/aw_workinfo/BatchDelete', {
						keyValue: file.name,
						tbname: 'aw_cause_attachment',
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
		url: cm.domain + "/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_serviceDesc_attachment&token=" + cm.token, //文件提交地址
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
				$(".dz-image").css({
					"z-index": "99999"
				});
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
				//   alert(file_id);
				if(file_id) {
					$.post(cm.domain + '/AfterSaleManage/aw_workinfo/BatchDelete', {
						keyValue: file.name,
						tbname: 'aw_serviceDesc_attachment',
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
	initControl();
});

//add----zhu
function popimg(img) {
	$('.popwindow').addClass('popwindow-show');
	$(".popwindow").find("img").attr("src", img);
	$(".popwindow").find("img").css("visibility", "inherit");
}

function exit_img() {
	$('.popwindow').removeClass('popwindow-show');
}

//初始化控件
function initControl() {

	//产品型号
	$("#productType").ComboBox({
		url: "/SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "product_type_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		defSelect: true,
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
		defSelect: true,
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
		defSelect: true,
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
		defSelect: true,
		height: "200px"
	});
	//问题类型
	$("#serviceType_s").ComboBox({
		url: "/SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "question_type_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});
	//业务线
	$("#businessLine").ComboBox({
		url: "/SystemManage/DataItemDetail/GetDataItemListJson",
		defSelect: true,
		param: {
			EnCode: "businessLine_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});
	//原因分析
	$("#cause_brief_confir").ComboBox({
		url: "/SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "result_confirm_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});
	//故障类型
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
		defSelect: true,
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
		defSelect: true,
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
		defSelect: true,
		height: "200px"
	});

	//	$("#assistant").ComboBoxTree({
	//		url: "/BaseManage/User/GetTreeJson",
	//		param: {
	//			OrganizeId: sessionStorage.getItem("companyId")
	//		},
	//		description: "==请选择==",
	//		height: "200px",
	//		allowSearch: true
	//	});

	//接单人
	//	$("#acceptor").ComboBoxTree({
	//		url: "/BaseManage/User/GetTreeJson",
	//		param: {
	//			OrganizeId: sessionStorage.getItem("companyId")
	//		},
	//		description: "==请选择==",
	//		height: "200px",
	//		allowSearch: true
	//	});

	//信息受理人
	//		$("#receiver").ComboBoxTree({
	//			url: "/BaseManage/User/GetTreeJson",
	//			param: {
	//				OrganizeId: sessionStorage.getItem("companyId")
	//			},
	//			description: "==请选择==",
	//			height: "200px",
	//			allowSearch: true
	//		});

	//回访人员
	$("#returnVisitStaff").ComboBoxTree({
		url: "/BaseManage/User/GetTreeJson",
		param: {
			OrganizeId: sessionStorage.getItem("companyId")
		},
		description: "==请选择==",
		cbiconpath: "../../common/tree/images/icons/",
		height: "200px",
		allowSearch: true
	});

	//获取表单
	/* if (!!keyValue) {
	     $.SetForm({
	         url: "../../AfterSaleManage/aw_workinfo/GetFormJson",
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
function GetImplementProgress() {

	/*  cm.ajax({
	      url: "../../AfterSaleManage/aw_workinfo/GetImplementWithAtttachementList",
	      type: "POST",
	      dataType: "json",
	      data: {
	          "keyValue": keyValue
	      },
	      success: function (data) {
	          console.log("GetImplementProgress")
	      },
	      error: function (data) {
	          console.log(data)
	      }
	  });*/

	cm.ajax({
		url: "/AfterSaleManage/aw_workinfo/GetAwWorkInfoTreeJson",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": slseq
		},
		success: function(data) {
			console.log(data)
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
			$(".timeline_Implements").append(time_html);
		},
		error: function(data) {
			console.log(data)
		}

	});

}

function Gettotaldata() {
	var appointment = document.getElementById("appointment"); //服务类型
	var time_t = document.getElementById("time_t"); //预约时间
	var time_ts = document.getElementById("time_ts"); //上门时间
	var acceptance = document.getElementById("acceptance"); //受理
	var supplement = document.getElementById("supplement"); //div块
	var makes = document.getElementById("makes"); //上门服务
	var make = document.getElementById("make"); //到店预约
	cm.ajax({
		url: "/AfterSaleManage/aw_workinfo/GetFormJsonWithEntity",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": keyValue
		},
		success: function(data) {
			console.log(keyValue);
			console.log(data);
			var appointMentType = data.appointMentType;
			var appointMentType_cn = data.appointMentType_cn;
			var appointMentType_status = data.appointMentType_status;
			var appointMentTime = data.appointMentTime;
			if(appointMentType == 3) {
				$("#supplement").hide();
			} else if(appointMentType == 1) {
				$("#makes").hide();
				appointment.innerHTML = appointMentType_cn;
				acceptance.innerHTML = appointMentType_status;
				time_t.innerHTML = appointMentTime;
			} else if(appointMentType == 2) {
				$("#make").hide();
				appointment.innerHTML = appointMentType_cn;
				acceptance.innerHTML = appointMentType_status;
				time_ts.innerHTML = appointMentTime;
			}
			//			
			cm.ajax({
				url: "/AfterSaleManage/aw_workinfo/GetImplementUsers",
				type: "POST",
				dataType: "json",
				data: {
					"keyValue": keyValue
				},
				success: function(data2) {

					var html = ''
					$.each(data2, function(i, n) {
						if(n.id == cm.userId) {
							html += '<option value="' + n.id + '" selected >' + n.name + '</option>';
						} else {
							html += '<option value="' + n.id + '">' + n.name + '</option>'
						}
					})

					//					$('#dispatchingPerson').append(html)
					//					$('#serviceStaff').append(html)
					//					$('#receiver').append(html)
					//					$('#assistant').append(html)
					//					$('#acceptor').append(html)
					if(data.baseEntity) {
						if(data.baseEntity.dispatchingPerson) {
							var initvalue = data.baseEntity.dispatchingPerson;
						}
					}
					var userids = data.baseEntity.dispatchingPerson;      
					console.log(data.baseEntity.dispatchingPerson);   
					console.log(data.dispatchingPersonNames); 
					var username = data.dispatchingPersonNames; 
					if(userids != null && username != null) {
						var id = userids.split(';');       
						var name = username.split(';');
						dispatchingPerson_id_list = id;
						dispatchingPerson_name_list = name;
						var list = [];        

						for(var index = 0; index < id.length; index++) {            
							list.push({
								"UserId": id[index],
								"RealName": name[index]
							});
						}
						console.log(list)

						if(list != null) {
							var text_array = [];
							$.each(list, function(i, n) {
								text_array.push(n["RealName"])
							});
							$("#dispatchingPerson").text(text_array.join(","));
							tranfer.tranferSetSession("dispatchingPerson", list)
						}
					}     

					//					console.log("*******mulChoise");
					//					console.log(initvalue);
					//					if(initvalue != null) {
					//						initvalue = initvalue.replace(/,/, ";");
					//						$("#dispatchingPerson").select2().select2("val", initvalue.split(';'));
					//					} else {
					//						$("#dispatchingPerson").select2();
					//					}

					if(data.baseEntity) {
						if(data.baseEntity.serviceStaff) {
							var initvalue = data.baseEntity.serviceStaff;
						}
					}

					var userids = data.baseEntity.serviceStaff;      
					console.log(data.baseEntity.serviceStaff);   
					var username = data.serviceStaffNames;
					if(userids != null && username != null) {
						var id = userids.split(';');       
						var name = username.split(';');
						serviceStaff_id_list = id;
						serviceStaff_name_list = name;
						var list = [];        

						for(var index = 0; index < id.length; index++) {            
							list.push({
								"UserId": id[index],
								"RealName": name[index]
							});
						}
						console.log(list)

						if(list != null) {
							var text_array = [];
							$.each(list, function(i, n) {
								text_array.push(n["RealName"])
							});
							$("#serviceStaff").text(text_array.join(","));
							tranfer.tranferSetSession("serviceStaff", list)
						}
					}     

					//					console.log("*******mulChoise");
					//					console.log(initvalue);
					//					if(initvalue != null) {
					//						initvalue = initvalue.replace(/,/, ";");
					//						$("#serviceStaff").select2().select2("val", initvalue.split(';'));
					//					} else {
					//						$("#serviceStaff").select2();
					//					}

					if(data.baseEntity) {
						if(data.baseEntity.assistant) {
							var initvalue = data.baseEntity.assistant;
						}
					}

					var userids = data.baseEntity.assistant;    
					var username = data.assistantNames;
					if(userids != null && username != null) {
						var id = userids.split(';');       
						var name = username.split(';');
						assistant_id_list = id;
						assistant_name_list = name;
						var list = [];        

						for(var index = 0; index < id.length; index++) {            
							list.push({
								"UserId": id[index],
								"RealName": name[index]
							});
						}
						console.log(list)

						if(list != null) {
							var text_array = [];
							$.each(list, function(i, n) {
								text_array.push(n["RealName"])
							});
							$("#assistant").text(text_array.join(","));
							tranfer.tranferSetSession("assistant", list)
						}
					}     

					if(data.baseEntity) {
						if(data.baseEntity.receiver) {
							var initvalue = data.baseEntity.receiver;
						}
					}

					console.log("*******mulChoise2");
					console.log(initvalue);

					var userids = data.baseEntity.receiver;        
					var username = data.receiverNames;     
				
					if(userids != null && username != null) {
						var id = userids.split(';');    
						var name = username.split(';');
						receiver_id_list = id;
						receiver_name_list = name;
						console.log(receiver_id_list)
						var list = [];        

						for(var index = 0; index < id.length; index++) {            
							list.push({
								"UserId": id[index],
								"RealName": name[index]
							});
						}
						console.log(list)

						if(list != null) {
							var text_array = [];
							$.each(list, function(i, n) {
								text_array.push(n["RealName"])
							});
							$("#receiver").text(text_array.join(","));
							tranfer.tranferSetSession("receiver", list)
						}
					}

					if(data.baseEntity) {
						if(data.baseEntity.acceptor) {
							var initvalue = data.baseEntity.acceptor;
						}
					}
					var userids = data.baseEntity.acceptor;        
					var username = data.acceptorNames;     

					if(userids != null && username != null) {
						var id = userids.split(';');    
						var name = username.split(';');
						acceptor_id_list = id;
						acceptor_name_list = name;
						var list = [];        

						for(var index = 0; index < id.length; index++) {            
							list.push({
								"UserId": id[index],
								"RealName": name[index]
							});
						}
						console.log(list)

						if(list != null) {
							var text_array = [];
							$.each(list, function(i, n) {
								text_array.push(n["RealName"])
							});
							$("#acceptor").text(text_array.join(","));
							tranfer.tranferSetSession("acceptor", list)
						}
					}

					//					console.log("*******acceptorMulChoise");
					//					console.log(initvalue);
					//					if(initvalue != null) {
					//						initvalue = initvalue.replace(/,/, ";");
					//						$("#acceptor").select2().select2("val", initvalue.split(';'));
					//					} else {
					//						$("#acceptor").select2();
					//					}

				},
				error: function(data2) {
					console.log(data2)
				}
			});

			//
			$("#form").SetWebControls(data.baseEntity);
			if($("#slSeqStr") && data.baseEntity) {
				if(data.baseEntity.slSeq) {
					var slseq_html = '<h1>工单号:&nbsp;' + data.baseEntity.slSeq + '&nbsp;[' + data.baseEntity.workStatus + ']</h1>';
					$("#slSeqStr").append(slseq_html);
				}
			}

			var aw_rqlist_data = data.aw_requirementEntityList
			console.log(aw_rqlist_data)
			var aw_rqlist_html = '';
			//alvin
			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.aw_requirement_attachmentList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">';
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&token=' + cm.token;
					aw_rqlist_img += '" class="mailbox-attachment-name" download="' + n.attacheName;
					aw_rqlist_img += '">';
					aw_rqlist_img += '<i class="fa fa-paperclip"></i>';
					aw_rqlist_img += n.attacheName + '</a>';
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token;
					aw_rqlist_img += '"class="btn btn-default btn-xs pull-right" download="';
					aw_rqlist_img += n.attacheName + '"><i class="fa fa-cloud-download"></i></a>';
					aw_rqlist_img += '</div>';
					aw_rqlist_img += '</li>';

					//					aw_rqlist_img += '<div class="mailbox-attachment-info">';
					//					aw_rqlist_img += '<a  href="'+  n.fileStorePath +'&token='+ cm.token +'" download="图片.jpg">';
					//					aw_rqlist_img += '<a  href="../../../static/img/dog.png" download="图片.jpg">';
					//					aw_rqlist_img += '<i class="fa fa-paperclip"></i> 圖片測試.jpg';	
					//					aw_rqlist_img += '</a>';
					//					aw_rqlist_img += '</div>';
					//					aw_rqlist_img += '</li>';
				})
				aw_rqlist_html += '<div class="file-item">';
				aw_rqlist_html += '<div class="file-item_time">' + n.CreateDate + ' ---- [' + n.CreateUserName + ']' + '</div>';
				aw_rqlist_html += '<div class="file-element-data ">';
				aw_rqlist_html += '<p>' + n.requirementInfo + '</p>';
				aw_rqlist_html += '<ul class="mailbox-attachments clearfix">';
				aw_rqlist_html += aw_rqlist_img;
				aw_rqlist_html += '</ul>';
				aw_rqlist_html += '</div>';
				aw_rqlist_html += '</div>';
			});
			$("#aw_requirementEntityList").append(aw_rqlist_html);

			//service Desc
			aw_rqlist_data = data.aw_servicedescEntityList
			console.log(aw_rqlist_data)
			aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.attachementList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'

					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + ' ---- [' + n.CreateUserName + ']' + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.serviceDesc + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});

			$("#aw_servicedescEntityList").append(aw_rqlist_html)

			//aw_selfSoluctionEntityList
			aw_rqlist_data = data.aw_selfhelp_solutionEntityList
			aw_rqlist_html = '';
			if(aw_rqlist_data == null || aw_rqlist_data.length == 0) {
				visi_data_html = '<h5>无</h5>'
			} else {
				$.each(aw_rqlist_data, function(i, n) {
					var aw_rqlist_img = '';
					var aw_relist_imgdata = n.attachmentList
					$.each(aw_relist_imgdata, function(i, n) {
						aw_rqlist_img += '<li>'
						if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
							aw_rqlist_img += '<img src="' + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
						} else {
							aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

						}
						aw_rqlist_img += '<div class="mailbox-attachment-info">'
						aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
						aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
						aw_rqlist_img += '</div>'
						aw_rqlist_img += '</li>'
					})
					aw_rqlist_html += '<div class="file-item">'
					aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + ' ---- [' + n.CreateUserName + ']' + '</div>'
					aw_rqlist_html += '					<div class="file-element-data ">'
					aw_rqlist_html += '						<p>' + n.selfHelpSoluction + '</p>'
					aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
					aw_rqlist_html += aw_rqlist_img
					aw_rqlist_html += '				</ul>'
					aw_rqlist_html += '				</div>'
					aw_rqlist_html += '				</div>'
				});
			}

			$("#aw_selfhelp_solutionEntityList").append(aw_rqlist_html)

			//aw_causeconclusionEntityList
			aw_rqlist_data = data.aw_causeconclusionEntityList
			aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.aw_cause_attachementList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + ' ---- [' + n.CreateUserName + ']' + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.causeConclusion + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});

			$("#aw_causeconclusionEntityList").append(aw_rqlist_html)

			//aw_implementoperationhistoryEntityList
			aw_rqlist_data = data.aw_implementoperationhistoryEntityList
			aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.attachmentList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + ' ---- [' + n.CreateUserName + ']' + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.content + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});

			$("#aw_implementsEntityList").append(aw_rqlist_html)

			//aw_solutionEntityList
			aw_rqlist_data = data.aw_solutionEntityList
			aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.aw_solution_attachmentEntityList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath + '&filename=' + n.attacheName + '&needDownload=true&token=' + cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + ' ---- [' + n.CreateUserName + ']' + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.solution + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});

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

						visi_body_html += '<div>' + n.CreateUserName + '</div>'
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

			//派工人员

		},
		error: function(data) {
			console.log(data);

		}
	})
}

//成员列表
function GetUserAvatar() {
	cm.ajax({
		url: "/AfterSaleManage/aw_workinfo/GetAwWrokUserJson",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": slseq
		},
		success: function(data) {

			console.log("getUserAvatar")
			console.log(data)
			if(data.length == 0) {
				var avatar_html = "<h5 style='padding: 10px; color: #444;'>暂无成员！</h5> ";
				$(".users-list").append(avatar_html);
			} else {
				var avatar_html = " ";
				$.each(data, function(i, n) {
					avatar_html += '<li>'
					avatar_html += "<img  src=" + cm.domain + "/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=e://MES_CAT//TankPic//SL20170921084025//SL20170921084025_20170921084032636.jpg&token=" + cm.token + ">";
					avatar_html += '<a class="users-list-name" href="#">' + n.realname + '</a>';
					avatar_html += '<span class="users-list-date">' + n.fullname + '</span>';
					avatar_html += '</li>';
					console.log(avatar_html);
				});

				$(".users-list").append(avatar_html);
			}

		},
		error: function(data) {
			console.log(data)
		}
	});
}

function GetProgress() {
	// alert(slseq);
	cm.ajax({
		url: "/AfterSaleManage/aw_workinfo/GetAwWorkInfoTreeJson",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": slseq
		},
		success: function(data) {
			console.log(data)
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
				var aw_relist_imgdata = n.attachmentList
				if(aw_relist_imgdata = " ") {

				} else {
					for(var j = 0; j < aw_relist_imgdata.length; j++) {
						time_html += '<img src="' + aw_relist_imgdata[j].fileStorePath + '&token=' + cm.token + '"alt="..." class="margin" style="width: 150px;height: 100px;">'
					}
				}

				//  time_html += '<img src="../../AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=e://MES_CAT//TankPic//SL20170921084025//SL20170921084025_20170921084032636.jpg" alt="..." class="margin" style="width: 150px;height: 100px;">'
				time_html += '</div>'
				time_html += '</div>'
				time_html += '</li>'
			});
			$("#progess").append(time_html);
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

function show_msage(target) {

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

function up_form_data() {

	//    dialogClose();
	/*if(!$('#form').Validform()) {
	    return false;
	}*/
	alert("commit up_form_data");
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

//
//function ReelectionPullDown() { //复选树形下拉
//	cm.ajax({
//		url: "/BaseManage/User/GetTreeJson",
//		type: "get",
//		dataType: "json",
//		data: {
//			OrganizeId: "7a579db2-f4e3-489c-aed9-d39cf78a1cfe"
//		},
//		success: function(data2) {
//			console.log(JSON.stringify(data2));
//			$('#receiver').hsCheckData({
//				isShowCheckBox: true,
//				data: data2,
//				defText: "1-10"
//			});
//			
//		},
//		error: function(data2) {
//			console.log(data2)
//		}
//	});
//}