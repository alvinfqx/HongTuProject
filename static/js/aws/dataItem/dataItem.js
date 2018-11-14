var viewModel = function() {
	var self = this;
	$(function() {
		self.InitialPage();
		self.GetGrid();
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设(表格、树形)宽高
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$("#gridTable").setGridHeight($(window).height() - 114.5);
			}, 200);
			e.stopPropagation();
		});
	}
	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/SystemManage/DataItem/GetTreeListJson",
			datatype: "json",
			height: $(window).height() - 114.5,
			autowidth: true,
			colModel: [{
					label: '主键',
					name: 'ItemId',
					hidden: true
				},
				{
					label: '名称',
					name: 'ItemName',
					index: 'ItemName',
					width: 200,
					align: 'left'
				},
				{
					label: '编号',
					name: 'ItemCode',
					index: 'ItemCode',
					width: 200,
					align: 'left'
				},
				{
					label: '排序',
					name: 'SortCode',
					index: 'SortCode',
					width: 80,
					align: 'left'
				},
				{
					label: "树型",
					name: "IsTree",
					index: "IsTree",
					width: 50,
					align: "center",
					formatter: function(cellvalue) {
						return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "有效",
					name: "EnabledMark",
					index: "EnabledMark",
					width: 50,
					align: "center",
					formatter: function(cellvalue) {
						return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "备注",
					name: "Description",
					index: "Description",
					width: 200,
					align: "left"
				}
			],
			treeGrid: true,
			treeGridModel: "nested",
			ExpandColumn: "ItemCode",
			rowNum: "10000",
			rownumbers: true,
			onSelectRow: function() {
				selectedRowIndex = $("#" + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$("#" + this.id).setSelection(selectedRowIndex, false);
			}
		});
		
		//查询事件
		$("#btn_Search").click(function() {
			$gridTable.jqGrid('setGridParam', {
				postData: {
					keyword: $("#txt_Keyword").val()
				},
			}).trigger('reloadGrid');
		});
	}
	//新增
	this.btn_add = function() {
		var parentId = $("#gridTable").jqGridRowValue("ItemId");
		dialogOpen({
			id: "Form",
			title: '添加分类',
			url: '/webpage/system/detaiItem_form.html?parentId=' + parentId+'&keyValue=',
			width: "500px",
			height: "400px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	};
	//编辑
	this.btn_edit = function() {
		var keyValue = $("#gridTable").jqGridRowValue("ItemId");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "Form",
				title: '编辑分类',
				url: '/webpage/system/detaiItem_form.html?keyValue=' + keyValue,
				width: "500px",
				height: "400px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("ItemId");	
		if(keyValue) {
			$.RemoveForm({
				url: "/SystemManage/DataItem/RemoveForm",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#gridTable").resetSelection();
					$("#gridTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的分类！', 0);
		}
	}

};

var model = new viewModel();