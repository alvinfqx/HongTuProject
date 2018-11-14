var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;

	$(function() {
		self.history_data();
	});

	this.history_data = function() {
		cm.ajax({
			type: "get",
			url: "/AfterSaleManage/aw_workinfo/GetAfterServiceResult4SingleProduct",
			data: {
				orderProductId: keyValue
			},
			async: false,
			success: function(data) {
				console.log(data);
				if(data == null) {
					$("#historyID").html("");
					var title = '<p style="font-size:20px;margin-top:50px;text-align: center;color:#ccc;">暂无历史服务工单</p>';
					$("#historyID").html(title);
					return false;
				} else {
					if(data.afterService4ProductModelList && data.afterService4ProductModelList.length > 0) {

						var html = '';
						for(var i = 0; i < data.afterService4ProductModelList.length; i++) {
							html += '<li class="time-label">';
							html += '<span class="bg-red">' + data.afterService4ProductModelList[i].workstatus + '</span>';
							html += '</li>';
							html += '<li>';
							html += '<i class="fa fa-file-text-o bg-blue"></i>';
							html += '<div class="timeline-item">';
							html += '<span class="time"><i class="fa fa-clock-o"></i>&nbsp;&nbsp;' + data.afterService4ProductModelList[i].postTime + '</span>';
							html += '<h3 class="timeline-header">服务单号：<a href="#" class="detail">' + data.afterService4ProductModelList[i].seqNo;
							html += '<input type="hidden" value="' + data.afterService4ProductModelList[i].workInfoId  + '" /></a></h3>';
							html += '<div class="timeline-body">';
							html += '<strong><i class="fa  fa-user margin-r-5"></i> ' + data.afterService4ProductModelList[i].client + '</strong>';
							html += '<p class="text-muted">';
							html += data.afterService4ProductModelList[i].requestInfo;
							html += '</p>';
							html += '<div>';
							if(data.afterService4ProductModelList[i].requestAttacheList && data.afterService4ProductModelList[i].requestAttacheList.length > 0) {
								for(var z = 0; z < data.afterService4ProductModelList[i].requestAttacheList.length; z++) {
									html += '<img src="' + data.afterService4ProductModelList[i].requestAttacheList[z].fileStorePath + '&token=' + cm.token + '" alt="..." class="img_class">';
								}
							} else {

							}
							html += '</div>';
							html += '</div>';
							html += '<hr>'
							html += '<div class="timeline-footer">';
							html += '<strong><i class="fa  fa-smile-o margin-r-5"></i> ' + data.afterService4ProductModelList[i].lastUpdater + '</strong>';
							html += '<p class="text-muted">';
							html += data.afterService4ProductModelList[i].lastContent;
							html += '</p>';
							html += '<p style="margin-left:18px;font-size:8px;color:#b7b7b7;">更新时间：' + data.afterService4ProductModelList[i].lastUpdateTime + '</p>';
							html += '<div>';

							if(data.afterService4ProductModelList[i].aw_chatAttachList && data.afterService4ProductModelList[i].aw_chatAttachList.length > 0) {

								for(var z = 0; z < data.afterService4ProductModelList[i].aw_chatAttachList.length; z++) {

									html += '<img src="' + data.afterService4ProductModelList[i].aw_chatAttachList[z].fileStorePath + '&token=' + cm.token + '" alt="..." class="margin">';
								}
							} else {

							}
							html += '</div>';
							html += '</div>';
							html += '</div>';
							html += '</li>';
						}
						html += '<li><i class="fa fa-clock-o bg-gray"></i></li>';

						$("#historyID").html("");
						$("#historyID").html(html);
					}

				}

			}
		});
	}

	//详细开窗
	$("body").on('click', '.detail', function() {
		var $obj = $(this);
		var sqlNo = $obj.text();
		var workinfoId = $obj.find('input').val();
		if(workinfoId && workinfoId.length > 0) {
			dialogOpenContent({
				id: 'DetailForm',
				url: '/hongtupage/view/customerWorkinfo/Form.html?keyValue=' + workinfoId + '&slSeq=' + sqlNo,
				width: 'px',
				height: 'px',
				btn: null,
			});
		} else {			
			dialogMsg('无效流水号!', 0);			
		}
	})

};

var model = new viewModel();