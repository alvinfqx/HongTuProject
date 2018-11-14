var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;
//	alert(keyValue)
	

	$(function() {
		
		$('body').on('click', function(e) {
			//获得哪个标签被点击
			var which_item = $(e.target)
			//弹出放大显示图片
			var img = which_item.attr('src')
			if(img != null) {
				popimg(img)
			}
		})
		
		self.documentData();
	});
//获取初始化文档资料
	this.documentData = function() {
		cm.ajax({
			url: "/AfterSaleManage/aw_workinfo/getOrderProductAttachment",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: keyValue
			},
			success: function(data) {
				console.log(data);
				console.log(data[0]);
				var aw_rqlist_html = '';
				var aw_rqlist_img = '';
				$.each(data, function(i, n) {
					var orderproduct_attachmentid = n.orderproduct_attachmentid;
					aw_rqlist_img += '<li id="req_id' + orderproduct_attachmentid + '">'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attachetype.toLowerCase()))) {
						aw_rqlist_img += '<img data-id=" ' + orderproduct_attachmentid + '"  src="' + cm.domain + '/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist= ' + n.filestorepath + '&token=' + cm.token + '" alt="' + n.attachename + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">';
					aw_rqlist_img += '<a href="' + cm.domain + '/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist= ' + n.filestorepath + '&token=' + cm.token;
					aw_rqlist_img += '" class="mailbox-attachment-name" download="' + n.attachename;
					aw_rqlist_img += '">';
					aw_rqlist_img += '<i class="fa fa-paperclip"></i>';
					aw_rqlist_img += n.attachename + '</a>';
					aw_rqlist_img += '<a onclick="model.delete_a(this)"  data-v="#req_id' + orderproduct_attachmentid + '" data-id="' + orderproduct_attachmentid + '"  href="#" class="btn btn-default btn-xs pull-left"><i class="fa fa-trash"></i></a>'
					aw_rqlist_img += '<a href="' + cm.domain + '/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=' + n.filestorepath + '&filename=' + n.attachename + '&needDownload=true&token=' + cm.token;
					aw_rqlist_img += '"class="btn btn-default btn-xs pull-right" download="';
					aw_rqlist_img += n.attachename + '"><i class="fa fa-cloud-download"></i></a>';
					aw_rqlist_img += '</div>';
					aw_rqlist_img += '</li>';
				})
				if(data == "" || data == null || data == undefined) {
					console.log("为空");
				} else {
					aw_rqlist_html += '<div class="file-item">';
					aw_rqlist_html += '<div class="file-item_time">' + data[0].createdate + '</div>';
					aw_rqlist_html += '<div class="file-element-data ">';
					aw_rqlist_html += '<ul class="mailbox-attachments clearfix">';
					aw_rqlist_html += aw_rqlist_img;
					aw_rqlist_html += '</ul>';
					aw_rqlist_html += '</div>';
					aw_rqlist_html += '</div>';
				}

				$("#aw_requirementEntityList").append(aw_rqlist_html);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
this.delete_a = function(e) { //删除文档资料图片
		var id = e.getAttribute("data-id");
//		alert(id);
		$.RemoveForm({
			url: "/AfterSaleManage/aw_workinfo/BatchDeleteWithID", //回访
			type: "POST",
			dataType: "json",
			param: {
				keyValue: id,
				tbname: "orderProduct_attachment"
			},
			success: function(data) {
				var v = e.getAttribute("data-v");
				$(v).remove();//清空
				$('#req_id').trigger('reloadGrid');
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	function popimg(img) {	//点击图片查看
		$('.popwindow').addClass('popwindow-show');
		$(".popwindow").find("img").attr("src", img);
		$(".popwindow").find("img").css("visibility", "inherit");
	}

	this.exit_img = function() {//点击关闭图片
		$('.popwindow').removeClass('popwindow-show');
	}

};

var model = new viewModel();