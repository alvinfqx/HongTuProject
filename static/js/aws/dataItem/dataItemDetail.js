var viewModel = function() {
	var self = this;
	$(function() {
		self.InitialPage();
		self.GetTree();
		self.GetGrid();
	});
	//初始化页面
	this.InitialPage = function() {
		//layout布局
		$('#layout').layout({
			applyDemoStyles: true,
			onresize: function() {
				$(window).resize()
			}
		});
		//resize重设(表格、树形)宽高
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$("#gridTable").setGridHeight($(window).height() - 141);
				$("#itemTree").setTreeHeight($(window).height() - 52);
			}, 200);
			e.stopPropagation();
		});
	}
	//加载树
	var _itemId = "";
	var _itemName = "";
	var _isTree = "";
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 52,
			url: "/SystemManage/DataItem/GetTreeJson",
			onnodeclick: function(item) {
				_itemId = item.id;
				_itemName = item.text;
				_isTree = item.isTree;
				$("#titleinfo").html(_itemName + "(" + item.value + ")");
				$("#txt_Keyword").val("");
				$('#btn_Search').trigger("click");
			}
		};
		//初始化
		$("#itemTree").treeview(item);
	}
	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/SystemManage/DataItemDetail/GetTreeListJson",
			datatype: "json",
			height: $(window).height() - 141,
			autowidth: true,
			colModel: [{
					label: '主键',
					name: 'ItemDetailId',
					hidden: true
				},
				{
					label: '&nbsp;&nbsp;&nbsp;&nbsp;项目名',
					name: 'ItemName',
					index: 'ItemName',
					width: 200,
					align: 'center',
					sortable: false
				},
				{
					label: '项目值',
					name: 'ItemValue',
					index: 'ItemValue',
					width: 200,
					align: 'center',
					sortable: false
				},
				{
					label: '简拼',
					name: 'SimpleSpelling',
					index: 'SimpleSpelling',
					width: 150,
					align: 'center',
					sortable: false
				},
				{
					label: '排序',
					name: 'SortCode',
					index: 'SortCode',
					width: 80,
					align: 'center',
					sortable: false
				},
				{
					label: "默认",
					name: "IsDefault",
					index: "IsDefault",
					width: 50,
					align: "center",
					sortable: false,
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
					sortable: false,
					formatter: function(cellvalue) {
						return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "备注",
					name: "Description",
					index: "Description",
					width: 200,
					align: "left",
					sortable: false
				}
			],
			treeGrid: true,
			treeGridModel: "nested",
			ExpandColumn: "ItemValue",
			rowNum: "10000",
			rownumbers: true,
			onSelectRow: function() {
				selectedRowIndex = $("#" + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$("#" + this.id).setSelection(selectedRowIndex, false);
			}
		});
		//查询条件
		$("#queryCondition .dropdown-menu li").click(function() {
			var text = $(this).find('a').html();
			var value = $(this).find('a').attr('data-value');
			$("#queryCondition .dropdown-text").html(text).attr('data-value', value)
		});
		//查询事件
		$("#btn_Search").click(function() {
			$gridTable.jqGrid('setGridParam', {
				url: "/SystemManage/DataItemDetail/GetTreeListJson",
				postData: {
					itemId: _itemId,
					condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
					keyword: $("#txt_Keyword").val()
				},
			}).trigger('reloadGrid');
		});
		//查询回车
		$('#txt_Keyword').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	}
	//新增
	this.btn_add = function() {
		if(!_itemId) {
			dialogMsg('请选择字典分类!', 0);
			return false;
		}
		var parentId = $("#gridTable").jqGridRowValue("ItemDetailId");
		if(_isTree != 1) {
			parentId = 0;
		}
		dialogOpen({
			id: "Form",
			title: '添加字典',
			url: '/webpage/system/detailItemDetail_form.html?parentId=' + parentId + "&itemId=" + _itemId,
			width: "500px",
			height: "370px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	};
	//编辑
	this.btn_edit = function() {
		var keyValue = $("#gridTable").jqGridRowValue("ItemDetailId");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "Form",
				title: '编辑字典',
				url: '/webpage/system/detailItemDetail_form.html?keyValue=' + keyValue,
				width: "500px",
				height: "370px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();

				}
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("ItemDetailId");
		if(keyValue) {
			$.RemoveForm({
				url: "/SystemManage/DataItemDetail/RemoveForm",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#gridTable").resetSelection();
					$("#gridTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的字典！', 0);
		}
	}
	//详细
	this.btn_detail = function() {
		var keyValue = $("#gridTable").jqGridRowValue("ItemDetailId");

		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "Detail",
				title: '字典信息',
				url: '/webpage/system/detailItemD_detail.html?keyValue=' + keyValue,
				width: "500px",
				height: "480px",
				btn: null
			});
		}
	}
	//字典分类
	this.btn_datacategory = function() {
		dialogOpen({
			id: "DataItemSort",
			title: '字典分类',
			url: '/webpage/system/detaItem.html',
			width: "800px",
			height: "500px",
			btn: null
		});
	}
};
$('.toolbar').authorizeButton();
var model = new viewModel();