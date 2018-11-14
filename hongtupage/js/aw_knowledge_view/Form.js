var viewModel = function() {
	var self = this;
	$(function() {
		self.initControl();
	})

	//初始化控件
	 this.initControl =function() {
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
				// console.log("ggggg");
				console.log(data);
				$("#page_body").append(self.analysis(data))
			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	 this.analysis = function(n) {

		return html = '<div class="box box-primary">' +
			'<div class="box-header with-border">' +

			'<h3 class="box-title">主题：' + n.title + '</h3>' +
			'</div>' +
			'<div class="box-body no-padding">' +
			'<div class="mailbox-read-info">' +
			'<h5>创建人:' + n.CreateUserName + '<span>所属分类：<b>' + n.media_type + '</b></span><span class="mailbox-read-time pull-right">' + n.CreateDate + '</span></h5>' +

			'</div>' +
			'<div class="mailbox-read-message page-conter">' +
			'<h5>详情：</h5>' +
			'<div style="margin-top:10px;">' +
			n.htmlContent +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>';
	}

	//保存表单;
	 this.AcceptClick = function() {
		dialogClose();
	}
};

var model = new viewModel();