var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var itemId = request('itemId');
	var parentId = request('parentId');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/SystemManage/DataItemDetail/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {					
					$("#form1").SetWebControls(data);
				}
			});
		} else {
			$("#ParentId").val(parentId);
			$("#ItemId").val(itemId);
		}
	}
	//保存表单
	this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}
		var postData = $("#form1").GetWebControls(keyValue);
		if(postData["ParentId"] == "") {
			postData["ParentId"] = 0;
		}
		postData["keyValue"] = keyValue;
		$.SaveForm({
			url: "/SystemManage/DataItemDetail/SaveForm" ,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				$.parentIframe().$("#gridTable").resetSelection();
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
	//验证：项目值、项目名 不能重复
	this.OverrideExistField = function(id, url) {
		$.ExistField(id, url, {
			itemId: itemId
		});
	}
};

var model = new viewModel();