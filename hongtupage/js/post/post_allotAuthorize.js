var viewModel = function() {
	var self = this;
	var postId = request('postId');
	var options_val = '';
	$(function() {
		
		//所属系统
		$("#Category").ComboBox({
			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
			param: {
				EnCode: "TypeOfSystem"
			},
			id: "ItemValue",
			text: "ItemName",
			description: "==请选择==",
			height: "200px"
		});
		
		self.initialPage();
		self.GetModuleTree();
		self.GetModuleButtonTree();
		self.GetModuleColumnTree();
		self.GetOrganizeTree();
	})
	
	//change暴露
	$("#Category").on("change",function(e){
		console.log(e)
		options_val = e.target.dataset.value
		self.GetModuleTree()
		
	})
	
	//初始化页面
	this.initialPage = function() {
		//加载导向
		$('#wizard').wizard().on('change', function(e, data) {

			var $finish = $("#btn_finish");
			var $next = $("#btn_next");
			if(data.direction == "next") {
				if(data.step == 1) {
					var ModuleId = $("#ModuleTree").getCheckedAllNodes();
					for(var i = 0; i < ModuleId.length; i++) {
						var $thisid = $("#ModuleButtonTree").find('ul').find('[data-value=' + ModuleId[i] + ']').parent().parent();
						$thisid.show();
						$thisid.parents('ul').find('.' + ModuleId[i]).parent().show();
					}
				}
				if(data.step == 2) {
					var ModuleId = $("#ModuleTree").getCheckedAllNodes();
					for(var i = 0; i < ModuleId.length; i++) {
						var $thisid = $("#ModuleColumnTree").find('ul').find('[data-value=' + ModuleId[i] + ']').parent().parent();
						$thisid.show();
						$thisid.parents('ul').find('.' + ModuleId[i]).parent().show();
					}
				}
				if(data.step == 3) {
					$finish.removeAttr('disabled');
					$next.attr('disabled', 'disabled');
				}
			} else {
				$finish.attr('disabled', 'disabled');
				$next.removeAttr('disabled');
			}
		});
		//数据权限 、点击类型触发事件
		$("input[name='authorizeType']").click(function() {
			var value = $(this).val();
			if(value == -5) {
				$("#OrganizeTreebackground").hide();
				//$("#OrganizeTree").find('a,span,i').css({ color: '#000' });
			} else {
				$("#OrganizeTreebackground").show();
				//$("#OrganizeTree").find('a,span,i').css({ color: '#d0d0d0' });
			}
		})
		self.buttonOperation();
	}
	//获取系统功能
	this.GetModuleTree = function() {
		var item = {
			height: 540,
			showcheck: true,
			url: "/AuthorizeManage/PermissionPost/ModuleTreeJsonByCurrentUser",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			param: {
				postId: postId,
				Category: options_val
			},
		};
		$("#ModuleTree").treeview(item);
	}
	//获取系统按钮
	this.GetModuleButtonTree = function() {
		var item = {
			height: 540,
			showcheck: true,
			url: "/AuthorizeManage/PermissionPost/ModuleButtonTreeJsonByCurrentUser",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			param: {
				postId: postId,
				Category :options_val
			}
		};
		$("#ModuleButtonTree").treeview(item);
		$("#ModuleButtonTree").find('.bbit-tree-node-el').hide();
	}
	//获取系统视图
	this.GetModuleColumnTree = function() {
		var item = {
			height: 540,
			showcheck: true,
			url: "/AuthorizeManage/PermissionPost/ModuleColumnTreeJsonByCurrentUser",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			param: {
				postId: postId,
				Category : options_val
			},
		};
		$("#ModuleColumnTree").treeview(item);
		$("#ModuleColumnTree").find('.bbit-tree-node-el').hide();
	}
	//获取组织架构
	this.GetOrganizeTree = function() {
		cm.ajax({
			url: "/AuthorizeManage/PermissionPost/OrganizeTreeJsonByCurrentUser",
			data: {
				postId: postId
			},
			type: "GET",
			dataType: "json",
			async: false,
			success: function(data) {
				var $treeJson = data.treeJson;
				var $authorizeType = data.authorizeType;
				var $authorizeData = data.authorizeData;
				var item = {
					height: 330,
					showcheck: true,
					data: JSON.parse($treeJson),
					cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/"
				};
				$("#OrganizeTree").treeview(item);
				$("input[name='authorizeType'][value=" + $authorizeType + "]").trigger("click");
				$("#OrganizeTree").find('li.bbit-tree-node').each(function() {
					var $li = $(this);
					$li.css({
						position: 'relative'
					});
					var _data_value = $li.find('a').find('span').attr('data-value');
					var _html = '<div style="position: absolute;right: 0px;top:4px;z-index: 1;"><div class="checkbox">';
					_html += '<label><input name="' + _data_value + '" type="checkbox" value="1" />只读</label>';
					_html += '</div></div>';
					$li.append(_html);
				});
				$.each($authorizeData, function(i) {
					var row = $authorizeData[i]
					var resourceId = row.ResourceId;
					var IsRead = row.IsRead;
					if(IsRead == 1) {
						$("input[name='" + resourceId + "']").attr("checked", true);
					}
				});
			}
		});
	}
	//按钮操作（上一步、下一步、完成、关闭）
	this.buttonOperation = function() {
		var $last = $("#btn_last");
		var $next = $("#btn_next");
		var $finish = $("#btn_finish");
		//完成提交保存
		$finish.click(function() {
			var postData = $("#form1").GetWebControls();
			postData["postId"] = postId;
			postData["moduleIds"] = String($("#ModuleTree").getCheckedAllNodes());
			postData["moduleButtonIds"] = String($("#ModuleButtonTree").getCheckedAllNodes());
			postData["moduleColumnIds"] = String($("#ModuleColumnTree").getCheckedAllNodes());
			postData["authorizeDataJson"] = JSON.stringify(self.GetDataAuthorize());
			$.SaveForm({
				url: "/AuthorizeManage/PermissionPost/SaveAuthorize",
				param: postData,
				loading: "正在保存岗位授权...",
				success: function() {
					$.parentIframe().$("#gridTable").trigger("reloadGrid");
				}
			})
		})
	}
	//获取数据范围权限选中值、返回Json
	this.GetDataAuthorize = function() {
		var dataAuthorize = [];
		var authorizeType = $("input[name='authorizeType']:checked").val();
		if(authorizeType == -5) {
			var selectedData = $("#OrganizeTree").getCheckedAllNodes();
			for(var i = 0; i < selectedData.length; i++) {
				var ResourceId = selectedData[i];
				var IsRead = $("input[name='" + ResourceId + "']:checked").val() == 1 ? 1 : 0;
				var rowdata = {
					ResourceId: ResourceId,
					IsRead: IsRead,
					AuthorizeType: -5
				}
				dataAuthorize.push(rowdata);
			}
		} else {
			var rowdata = {
				IsRead: 0,
				AuthorizeType: authorizeType
			}
			dataAuthorize.push(rowdata);
		}
		return dataAuthorize;
	}
};

var model = new viewModel();