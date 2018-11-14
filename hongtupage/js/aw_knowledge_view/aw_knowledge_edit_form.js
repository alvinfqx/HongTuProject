var viewModel = function() {
	var self = this;
	var upFile_data = [];
	$(function() {
		self.initControl();
		//公司
		$("#Item_class_Id").ComboBoxTree({
			url: "/AfterSaleManage/aw_knowledge_dataitem/GetTreeJson",
			description: "==请选择==",
			height: "200px",
			allowSearch: true,
		}).bind("change", function() {
			var value = $(this).attr('data-value');
			//加载部门
		});
		var keyValue = request('keyValue');
		//加载已有附件
		cm.ajax({
			url: "/AfterSaleManage/aw_knowledge_attachment/GetEntityByItemDetailId", //回访
			type: "Get",
			dataType: "json",
			data: {
				"ItemDetailId": keyValue
			},
			success: function(data) {
				var $lis = "";
				for(var i = 0; i < data.length; i++) {
					var $li = "";
					var attacheType = data[i].attacheType
					if(attacheType != ".bmp" && attacheType != ".png" && attacheType != ".gif" && attacheType != ".jpg" && attacheType != ".jpeg") {
						$li = ("<li><img src='../../images/FilePreview.png' /><div class='file_dle'><span class='fname' style='display:block;'>" +
							data[i].attacheName + "</span> <a href=javascript:;' data-attachmentId='" +
							data[i].aw_knowlege_attachmentid + "'>删除</a></div></li>");
					} else {
						$li = ("<li><img src='" + cm.domain + "/AfterSaleManage/aw_knowledge_attachment/DownloadFile?filepath=" +
							(data[i].fileStorePath.indexOf("&amp;token") > 0 ? data[i].fileStorePath : (data[i].fileStorePath + '&token=' + cm.token)) +
							"&filename" + data[i].attacheName + "' /><div class='file_dle'><span class='fname' style='display:block;'>" +
							data[i].attacheName + "</span> <a href=javascript:;' data-attachmentId='" +
							data[i].aw_knowlege_attachmentid + "' onclick='model.del_file(this)'>删除</a></div></li>");
					}
					$lis += $li;
				}
				$lis += ("<li class='up_file'><img src='../../images/addImg.png' onclick='model.up_file()'/></li>");
				$("#ul_attachment").append($lis);
			},
			error: function(data) {
				console.log(data);
			}
		});

		var myDropzone = new Dropzone("#dropzone1", {
			url: cm.domain + "/AfterSaleManage/aw_knowledge_attachment/UploadFile?keyValue=" + keyValue + "&token=" + cm.token, //文件提交地址
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
					upFile_data.push(data);
					$(".dz-image").css({
						"z-index": "99999"
					});
				});
				this.on("error", function(file, data) {
					//上传失败触发的事件z
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
					//删除文件时触发的方法
					//					debugger;
					//					$.each(upFile_data, function(key, val) {
					//						var filejson = $.parseJSON(file.xhr.response);
					//						if(val != null && val.Id == filejson.Id) {
					//							$.post(cm.domain + '/AfterSaleManage/aw_knowledge_attachment/RemoveFile', {
					//									keyValue: filejson.fileStorePath,
					//									token: cm.token
					//								},
					//								function(data) {
					//									console.log('删除结果:' + data.Message);
					//								});
					//							delete upFile_data[key];
					//							return false;
					//						}
					//					});
					document.querySelector('div .dz-default').style.display = 'block';
				});
			}
		});
	})

	//初始化控件
	this.initControl = function() {

		var keyValue = request('keyValue');
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_knowledge_dataitemdetail/GetFormJsonEntity", //回访
			type: "POST",
			dataType: "json",
			data: {
				"keyValue": keyValue
			},
			success: function(data) {
				$("#page-box").SetWebControls(data);
				if(data.thumbnailPath == null || data.thumbnailPath == "") {

				} else {
					var data_img_url = data.thumbnailPath.indexOf("&token") > 0 ? data.thumbnailPath : (data.thumbnailPath + '&token=' + cm.token);
					$("#thumbnailPath").attr("src", data_img_url).css("visibility", "visible");
					$("#picPath").val(data_img_url);
//					debugger;
				}
				var markupStr = data.htmlContent;
				$('#htmlContent').summernote('code', markupStr);
			},
			error: function(data) {
				console.log(data);
			}
		})

	}

	//保存表单;
	this.AcceptClick = function() {
		var test = $('#htmlContent').summernote('code');
		var imgSrr = $("#picPath").val();

		if(imgSrr == "") {
			alert("请先上传缩略图。");
			return;
		}
		var keyValue = request('keyValue');
		var postData = $("#page-box").GetWebControls(keyValue);
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		console.log("2222");
		console.log(postData);
		postData["media_type"] = "文章类"
		postData["htmlContent"] = escape(test)
		postData["thumbnailPath"] = escape(imgSrr);
		postData["upFile_data"] = JSON.stringify(upFile_data);
		//		alert(JSON.stringify(postData));
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_knowledge_dataitemdetail/SaveFormData?keyValue=" + keyValue, //回访
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
		});
	}

	//Del
	this.delClick = function() {
		if(confirm("确认删除吗？")) {
			var keyValue = request('keyValue');
			Loading(true, "正在拼了命为您处理。。。");
			top.$("#loading_manage").attr('isTableLoading', 'true');
			cm.ajax({
				//受理客户需求
				url: "/AfterSaleManage/aw_knowledge_dataitemdetail/RemoveFormData", //回访
				type: "POST",
				dataType: "json",
				data: {
					"keyValue": keyValue
				},
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

	}
	$('#htmlContent').summernote({
		height: 280,
		tabsize: 2,
		lang: 'zh-CN'
	});
	this.up_file = function() {
		var $dropzone = $("#dropzone1");
		if($dropzone.css("display") == "none") {
			$dropzone.css('display', 'block');
		} else {
			$dropzone.css('display', 'none');
		}
	}
	this.del_file = function(target) {
		if(confirm("确认删除吗？")) {
			var attachmentId = $(target).data("attachmentid");
			$.post(cm.domain + '/AfterSaleManage/aw_knowledge_attachment/RemoveForm', {
					keyValue: attachmentId,
					token: cm.token
				},
				function(data) {
					$(target).parent().parent().remove();
					dialogMsg(data.message, 1);
					//					console.log('删除结果:' + data.Message);
				})
		}
	}
};

var model = new viewModel();