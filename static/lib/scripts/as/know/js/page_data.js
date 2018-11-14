var view_model = function() {
	var self = this;
	$(function() {
//		$('#CreateDate').datepicker({
//			autoclose: true,
//			dateFormat: 'yyyy/MM/dd hh:mm:ss'
//			//format: 'yyyy/MM/dd hh:mm:ss'
//		})

		$('.summernote').summernote({
			height: 280,
			tabsize: 2,
			lang: 'zh-CN'
		});

		$('#up-data').click(function() {
			alert("111");
			var imgSrr = $("#picPath").val();
			var postData = $("#page-box").GetWebControls();
			postData["htmlContent"] = $('.summernote').summernote('code');
			postData["Item_class_Id"] = $("#media_type").attr('data-value');
			postData["thumbnailPath"] = imgSrr
			postData["ParentId"] = $("#media_type").attr("parentId")
			postData["media_type"] = "文章类"
			postData["organizationid"] = "1"
			delete postData["sn-checkbox-open-in-new-window"]
			console.log(postData)

			cm.ajax({
				type: "post",
				url: "/ebizstar/Knowledgefileuploaded/addfile",
				//				contentType: "application/json",
				data: JSON.stringify(postData),
				success: function(data) {
					console.log(data);
					alert("success");
				},
				error: function(data) {
					console.log(data);
					alert("网络错误,请稍后再试!")
				}
			});
		})

	})

	this.show_classify = function() {
		var item = $(".classify")
		if(item.is(":hidden")) {
			item.show()
		} else {
			item.hide()
		}
	}

	//上传图片
	this.upload = function(target) {
		// var addimgurl = 'http://10.99.35.201:8888/ebizstar/picture/upload'
		if($(target).prev()[0].value != 0) {
			var file_type = $(target).prev()[0].files[0].name;
			if(!/\.(gif|jpg|jpeg|png|gif|jpg|png)$/i.test(file_type.toLowerCase())) {     
				alert("请上传正确的图片格式!")
			} else {
				var objUrl = self.getObjectURL($(target).prev()[0].files[0]);
				if(objUrl) {
					console.log(objUrl)
				}
				var form = new FormData();
				form.append("file", $(target).prev()[0].files[0]);
				form.append("keyValue", "jdlsajdlkas");				
				form.append("token", cm.token);
				$(target).attr("disabled", true)
				$(target).css({
					"background-color": "#ddd",
					"color": "#908f8f",
					"border": "1px solid #ddd"
				});
				$.ajax({
					type: "post",
					url: cm.domain + '/AfterSaleManage/aw_knowledge_dataitem/UploadFile',
					async: true,
					crossDomain: true,
					processData: false,
					contentType: false,
					mimeType: "multipart/form-data",
					data: form,
					success: function(data) {
						
						if(data && data.length > 0) {
							var data = eval('(' + data + ')');
							if(data.Message != null) {
								$(target).parentsUntil("td").closest("div").parent().find('img').attr("value", data.Message)
								$("#picPath").val(data.Message);						
							} else {
								$(target).parent().prev().attr("value", "null");
							}
						}

					},
					error: function(data) {
						dialogMsg("上传图片失败,请重新上传!", 2);
					}
				});
			}
		} else {
			//			layer.msg("您未选择要上传的图片!", {
			//				icon: 5
			//			});
			dialogMsg("您未选择要上传的图片!", 2);
		}
	}

	this.getObjectURL = function(file) {
		var url = null;
		if(window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if(window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if(window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	}
	//上传时预览图片
	this.switch_img = function(target) {
		$(target).next().css({
			"background-color": "#D0EEFF",
			"color": "#1E88C7",
			"border": "1px solid #78C3F3"
		});
		$(target).next().attr("disabled", false);
		var img_tag = $(target).parent().parent().find('img');
		var reader = new FileReader();
		reader.readAsDataURL($(target)[0].files[0]);
		reader.onload = function(e) {
			img_tag.attr("src", this.result);
			$(img_tag).next().css("visibility", "inherit")
			img_tag.css("visibility", "inherit")
		}
	}

	//删除图片
	this.delte_img = function(target) {
		$(target).prev().attr("src", "");
		$(target).prev().attr("value", "");
		$(target).prev().css("visibility", "hidden");
		$(target).css("visibility", "hidden");
		var file_input = $(target).next().find("input[type='file']");
		file_input.after(file_input.clone().val(""));
		file_input.remove();
	}
};

var new_model = new view_model();