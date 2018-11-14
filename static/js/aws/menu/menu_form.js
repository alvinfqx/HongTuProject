var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var parentId = request('parentId');
	$('#ModuleId').val(keyValue);

	$(function() {
		self.initialPage();
		self.buttonOperation();
		self.getGridButton();
		self.getGridView();
	})
	//初始化页面
	this.initialPage = function() {
		//加载导向
		$('#wizard').wizard().on('change', function(e, data) {
			var $finish = $("#btn_finish");
			var $next = $("#btn_next");
			if(data.direction == "next") {
				if(data.step == 2) {
					$finish.removeAttr('disabled');
					$next.attr('disabled', 'disabled');
				} else {
					$finish.attr('disabled', 'disabled');
				}
			} else {
				$finish.attr('disabled', 'disabled');
				$next.removeAttr('disabled');
			}
		});
		self.initControl();
	}
	//初始化控件
	this.initControl = function() {
		//目标
		$("#Target").ComboBox({
			description: "==请选择==",
			height: "200px"
		});
		//上级
		$("#ParentId").ComboBoxTree({
			url: "/AuthorizeManage/Module/GetTreeJson",
			description: "==请选择==",
			height: "195px",
			allowSearch: true,
			cbiconpath:"../../monitorpage/util/tree/images/icons/"
		});
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
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AuthorizeManage/Module/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data);
					if(data.IsMenu == 1) {
						$("#btn_next").removeAttr('disabled');
						$("#btn_finish").attr('disabled', 'disabled');
					}
				}
			});
		} else {
			$("#ParentId").ComboBoxTreeSetValue(parentId);
		}
	}
	//选取图标
	this.SelectIcon = function() {
		dialogOpen({
			id: "SelectIcon",
			title: '选取图标',
			url: '/webpage/system/menu_icon.html?ControlId=Icon',
			width: "1000px",
			height: "600px",
			btn: false
		})
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
		postData["moduleButtonListJson"] = JSON.stringify(buttonJson);
		postData["moduleColumnListJson"] = JSON.stringify(columnJson);
		$.SaveForm({
			url: "/AuthorizeManage/Module/SaveForm?keyValue=" + keyValue,
			param: postData,			
			loading: "正在保存数据...",
			success: function() {
			      //$.currentIframe().$("#gridTable").trigger("reloadGrid");
                  $.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}

	//按钮操作（上一步、下一步、完成、关闭）
	this.buttonOperation = function() {
		var $last = $("#btn_last");
		var $next = $("#btn_next");
		var $finish = $("#btn_finish");
		//如果是菜单，开启 上一步、下一步
		$("#IsMenu").click(function() {
			if(!$(this).attr("checked")) {
				$(this).attr("checked", true)
				$next.removeAttr('disabled');
				$finish.attr('disabled', 'disabled');
			} else {
				$(this).attr("checked", false)
				$next.attr('disabled', 'disabled');
				$finish.removeAttr('disabled');
			}
		});
		//完成提交保存
		$finish.click(function() {
			self.AcceptClick();
		})
	}

	/*系统按钮being==================================*/
	var buttonJson = "";
	this.getGridButton = function() {
		var moduleId = $("#ModuleId").val();
		cm.ajax({
			url: "/AuthorizeManage/ModuleButton/GetListJson",
			type: "get",
			data: {
				moduleId: escape(moduleId)
			},
			dataType: "json",
			success: function(data) {
				buttonJson = data;
			},
		});

		var $grid = $("#gridTable-button");
		$grid.jqGrid({
			unwritten: false,
			url: "/AuthorizeManage/ModuleButton/GetTreeListJson",
			postData: {
				moduleId: escape(moduleId),
			},
			datatype: "json",
			height: $(window).height() - 165,
			width: $(window).width() - 11,
			colModel: [{
					label: "主键",
					name: "ModuleButtonId",
					hidden: true
				},
				{
					label: "名称",
					name: "FullName",
					width: 140,
					align: "left",
					sortable: false
				},
				{
					label: "编号",
					name: "EnCode",
					width: 140,
					align: "left",
					sortable: false
				},
				{
					label: "地址",
					name: "ActionAddress",
					width: 500,
					align: "left",
					sortable: false
				},
			],
			treeGrid: true,
			treeGridModel: "nested",
			ExpandColumn: "EnCode",
			rowNum: "all",
			rownumbers: true
		});
		//处理Json
		function ButtonListToListTreeJson(buttonJson) {
			cm.ajax({
				url: "/AuthorizeManage/ModuleButton/ListToListTreeJson",
				data: {
					moduleButtonJson: JSON.stringify(buttonJson)
				},
				type: "post",
				dataType: "json",
				success: function(data) {					
					$grid.clearGridData();					
					$grid[0].addJSONData(data);
				},
			});
		}
		//新增
		$("#lr-add-button").click(function() {
			var parentId = $("#gridTable-button").jqGridRowValue("ModuleButtonId");
			window.top.page_parameters.Caching.push(
				{
					URL: '/webpage/system/menu_moduleButton_form.html', 
					Parameters: buttonJson 
				});
			dialogOpen({
				id: "buttonForm",
				title: '添加按钮',
				url: '/webpage/system/menu_moduleButton_form.html?parentId=' + parentId + "&moduleId=" + escape(moduleId),
				width: "450px",
				height: "300px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick(function(data) {					
						buttonJson.push(data);						
						ButtonListToListTreeJson(buttonJson);				
					});
				}
			});
		})
		//编辑
		$("#lr-edit-button").click(function() {
			window.top.page_parameters.Caching.push({ URL: '/webpage/system/menu_moduleButton_form.html', Parameters: buttonJson });
			var moduleButtonId = $("#gridTable-button").jqGridRowValue("ModuleButtonId");			
			if(checkedRow(moduleButtonId)) {
				dialogOpen({
					id: "buttonForm",
					title: '编辑按钮',
					url: '/webpage/system/menu_moduleButton_form.html?moduleButtonId=' + moduleButtonId + "&moduleId=" + escape(moduleId),
					width: "450px",
					height: "300px",
					callBack: function(iframeId) {
						top.frames[iframeId].model.AcceptClick(function(data) {
							$.each(buttonJson, function(i) {
								if(buttonJson[i].ModuleButtonId == moduleButtonId) {
									buttonJson[i] = data;
								}
							});
							ButtonListToListTreeJson(buttonJson);							
						});
					}
				});
			}
		})
		//删除
		$("#lr-delete-button").click(function() {
			var moduleButtonId = $("#gridTable-button").jqGridRowValue("ModuleButtonId");
			if(checkedRow(moduleButtonId)) {
				$.each(buttonJson, function(i) {
					if(buttonJson[i].ModuleButtonId == moduleButtonId) {
						buttonJson.splice(i, 1);
						ButtonListToListTreeJson(buttonJson);
						return false;
					}
				});
			}
		});
		//复制
		$("#lr-copy-button").click(function() {
			var moduleButtonId = $("#gridTable-button").jqGridRowValue("ModuleButtonId");
			if(checkedRow(moduleButtonId)) {
				dialogOpen({
					id: "OptionModule",
					title: '将按钮复制到指定功能里面',
					url: '/webpage/system/menu_moduleBtn_optionModule.html?keyValue=' + moduleButtonId,
					width: "500px",
					height: "500px",
					callBack: function(iframeId) {
						top.frames[iframeId].model.AcceptClick();
					}
				});
			}
		});
	}
	/*系统按钮end====================================*/

	/*系统视图being==================================*/
	var columnJson = "";
	this.getGridView = function() {
		var moduleId = $("#ModuleId").val();
		cm.ajax({
			url: "/AuthorizeManage/ModuleColumn/GetListJson",
			data: {
				moduleId: escape(moduleId)
			},
			type: "get",
			dataType: "json",
			success: function(data) {
				columnJson = data;
			},
		});
		var $grid = $("#gridTable-view");
		$grid.jqGrid({
			unwritten: false,
			url: "/AuthorizeManage/ModuleColumn/GetTreeListJson",
			postData: {
				moduleId: escape(moduleId),
			},
			datatype: "json",
			height: $(window).height() - 165,
			width: $(window).width() - 11,
			colModel: [{
					label: "主键",
					name: "ModuleColumnId",
					index: "ModuleColumnId",
					hidden: true
				},
				{
					label: "名称",
					name: "FullName",
					index: "FullName",
					width: 140,
					align: "left",
					sortable: false,
				},
				{
					label: "编号",
					name: "EnCode",
					index: "EnCode",
					width: 140,
					align: "left",
					sortable: false
				},
				{
					label: "描述",
					name: "Description",
					index: "Description",
					width: 500,
					align: "left",
					sortable: false
				}
			],
			rowNum: 1000,
			rownumbers: true
		});
		//处理Json
		function ViewListToListTreeJson(columnJson) {
			cm.ajax({
				url: "/AuthorizeManage/ModuleColumn/ListToListTreeJson",
				data: {
					moduleColumnJson: JSON.stringify(columnJson)
				},
				type: "post",
				dataType: "json",
				success: function(data) {
					$grid.clearGridData();
					$grid[0].addJSONData(data);
				},
			});
		}
		//新增
		$("#lr-add-view").click(function() {
			window.top.page_parameters.Caching.push(
				{
					URL: '/webpage/system/menu_moduleColumn.html', 
					Parameters: columnJson 
				});
			dialogOpen({
				id: "viewForm",
				title: '添加视图',
				url: '/webpage/system/menu_moduleColumn.html?moduleId=' + escape(moduleId),
				width: "450px",
				height: "260px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick(function(data) {
						columnJson.push(data);
						ViewListToListTreeJson(columnJson);
					});
				}
			});
		})
		//编辑
		$("#lr-edit-view").click(function() {
			window.top.page_parameters.Caching.push(
				{
					URL: '/webpage/system/menu_moduleColumn.html', 
					Parameters: columnJson 
				});
			var moduleColumnId = $("#gridTable-view").jqGridRowValue("ModuleColumnId");
			if(checkedRow(moduleColumnId)) {
				dialogOpen({
					id: "viewForm",
					title: '编辑视图',
					url: '/webpage/system/menu_moduleColumn.html?moduleColumnId=' + moduleColumnId + "&moduleId=" + escape(moduleId),
					width: "450px",
					height: "260px",
					callBack: function(iframeId) {
						top.frames[iframeId].model.AcceptClick(function(data) {
							$.each(columnJson, function(i) {
								if(columnJson[i].ModuleColumnId == moduleColumnId) {
									columnJson[i] = data;
								}
							});
							ViewListToListTreeJson(columnJson);
						});
					}
				});
			}
		})
		//删除
		$("#lr-delete-view").click(function() {
			var moduleColumnId = $("#gridTable-view").jqGridRowValue("ModuleColumnId");
			if(checkedRow(moduleColumnId)) {
				$.each(columnJson, function(i) {
					if(columnJson[i].ModuleColumnId == moduleColumnId) {
						columnJson.splice(i, 1);
						ViewListToListTreeJson(columnJson);
						return false;
					}
				});
			}
		});
		//批量添加
		$("#lr-batch-addview").click(function() {
			dialogOpen({
				id: "viewForm",
				title: '批量添加视图',
				url: '/webpage/system/menu_moduleCol_batchAdd.html?moduleId=' + escape(moduleId),
				width: "450px",
				height: "300px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick(function(data) {
						columnJson = data;
						ViewListToListTreeJson(data);
					});
				}
			});
		})
	}
	/*系统视图end====================================*/
};
var model = new viewModel();

