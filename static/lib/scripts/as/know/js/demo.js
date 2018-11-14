$(function() {
	var pnode_url = 'http://10.99.35.201:8888/ebizstar/Knowledgelibrary/queryItemName'
	layui.use(['tree'], function() {
		var tree = layui.tree;
		pnode()

		function pnode() {
			$.ajax({
				type: "post",
				url: pnode_url,
				contentType: "application/json",
				success: function(data) {
					console.log("pnode", data);
					tree({
						elem: '#demo',
						skin: 'blue',
						nodes: data.content,
						click: function(node) {
							console.log(node)
							$("#media_type").text(node.item_class_Id).val(node.name).attr("parentId",node.parentId)
							$(".classify").hide()
						}
					});
				},
				error: function(data) {
					console.log(data);
					layer.msg("网络错误,请稍后再试!", {
						icon: 2
					});
				}
			});

		}
	})

	//Date picker
	$('#CreateDate').datepicker({
		autoclose: true,
		dateFormat: 'dd/MM/yyyy hh:mm:ss'
	})

	$('.summernote').summernote({
		height: 280,
		tabsize: 2,
		lang: 'zh-CN'
	});

	$('#up-data').click(function() {
		var postData = $("#page-box").GetWebControls();
		postData["htmlContent"] = $('.summernote').summernote('code');
		postData["Item_class_Id"] = $("#media_type").text()
		postData["ParentId"] = $("#media_type").attr("parentId")
		postData["media_type"] = "文章类"
		//console.log(postData)

		$.ajax({
			type: "post",
			url: "http://10.99.35.201:8888/ebizstar/Knowledgefileuploaded/addfile",
			contentType: "application/json",
			data: JSON.stringify(postData),
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
				alert("网络错误,请稍后再试!")
			}
		});
	})

})

function show_classify() {
	var item = $(".classify")
	if(item.is(":hidden")) {
		item.show()
	} else {
		item.hide()
	}
}

//上传图片
function upload(target) {
	var addimgurl = 'http://10.99.35.201:8888/ebizstar/picture/upload'
	if($(target).prev()[0].value != 0) {
		var file_type = $(target).prev()[0].files[0].name;
		if(!/\.(gif|jpg|jpeg|png|gif|jpg|png)$/i.test(file_type.toLowerCase())) {     
			alert("请上传正确的图片格式!")
		} else {
			var objUrl = getObjectURL($(target).prev()[0].files[0]);
			if(objUrl) {

				console.log(objUrl)
			}
			var form = new FormData();
			form.append("file", $(target).prev()[0].files[0]);
			form.append("name", "jdlsajdlkas");
			form.append("order", "1");
			$(target).attr("disabled", true)
			$(target).css({
				"background-color": "#ddd",
				"color": "#908f8f",
				"border": "1px solid #ddd"
			});

		}
	} else {
		layer.msg("您未选择要上传的图片!", {
			icon: 5
		});
	}
}

function getObjectURL(file) {
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
function switch_img(target) {
	$(target).next().css({
		"background-color": "#D0EEFF",
		"color": "#1E88C7",
		"border": "1px solid #78C3F3"
	});
	$(target).next().attr("disabled", false);
	var img_tag = $(target).parentsUntil("td").closest("div").parent().find('img');
	var reader = new FileReader();
	reader.readAsDataURL($(target)[0].files[0]);
	reader.onload = function(e) {
		img_tag.attr("src", this.result);
		$(img_tag).next().css("visibility", "inherit")
		img_tag.css("visibility", "inherit")
	}
}

//删除图片
function delte_img(target) {
	$(target).prev().attr("src", "");
	$(target).prev().attr("value", "");
	$(target).prev().css("visibility", "hidden");
	$(target).css("visibility", "hidden");
	var file_input = $(target).next().find("input[type='file']");
	file_input.after(file_input.clone().val(""));
	file_input.remove();
}