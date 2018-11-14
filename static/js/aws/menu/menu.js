var viewModel = function() {
	var self = this;
	var options_val = '';
	//加载树
	var _parentId = "";
	
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

		self.InitialPage();
		self.GetTree();
		self.GetGrid();
	});

	//change暴露
	$("#Category").on("change", function(e) {
		console.log(e)
		options_val = e.target.dataset.value
		self.GetTree();
		//		debugger
		//		self.GetGrid();
		$('#btn_Search').trigger("click");
		console.log(options_val);
	})

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
				$("#gridTable").setGridHeight($(window).height() - 141.5);
				$("#itemTree").setTreeHeight($(window).height() - 52);
			}, 200);
			e.stopPropagation();
		});
	}
	

	this.GetTree = function() {
		var item = {
			height: $(window).height() - 52,
			url: "/AuthorizeManage/Module/GetTreeJson",
			param: {
				category: options_val || ''
			},
			onnodeclick: function(item) {
				console.log(item);
				_parentId = item.id;

				$('#btn_Search').trigger("click");
			}
		};
		//初始化
		$("#itemTree").treeview(item);
	}

	//加载表格
	this.GetGrid = function() {
		//获取表格数据
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			url: "/AuthorizeManage/Module/GetListJson",
			datatype: "json",
			postData: {
				parentid: 0,
				Category: options_val || ''
			},
			height: $(window).height() - 141.5,
			autowidth: true,
			colModel: [{
					label: "主键",
					name: "ModuleId",
					index: "ModuleId",
					hidden: true
				},
				{
					label: "编号",
					name: "EnCode",
					index: "EnCode",
					width: 150,
					align: "left"
				},
				{
					label: "名称",
					name: "FullName",
					index: "FullName",
					width: 150,
					align: "left"
				},
				{
					label: "地址",
					name: "UrlAddress",
					index: "UrlAddress",
					width: 300,
					align: "left"
				},

				{
					label: "排序",
					name: "SortCode",
					index: "SortCode",
					width: 60,
					align: "left"
				},
				{
					label: "目标",
					name: "Target",
					index: "Target",
					width: 60,
					align: "center"
				},
				{
					label: "菜单",
					name: "IsMenu",
					index: "IsMenu",
					width: 50,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return cellvalue == 1 ? "<i value=" + cellvalue + " class=\"fa fa-toggle-on\"></i>" : "<i value=" + cellvalue + " class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "展开",
					name: "AllowExpand",
					index: "AllowExpand",
					width: 50,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "公共",
					name: "IsPublic",
					index: "IsPublic",
					width: 50,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "有效",
					name: "EnabledMark",
					index: "EnabledMark",
					width: 50,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "描述",
					name: "Description",
					index: "Description",
					width: 100,
					align: "left"
				},
				{
					label: "所属系统",
					name: "Category",
					index: "Category",
					width: 300,
					align: "left"
				}
			],
			pager: false,
			rowNum: "1000",
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
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
			$("#queryCondition .dropdown-text").html(text).attr('data-value', value);
		});
		//$gridTable.jqGrid('clearGridData');  //清空表格
		//查询事件
		$("#btn_Search").click(function() {
			$gridTable.jqGrid('setGridParam', {
				url: "/AuthorizeManage/Module/GetListJson",
				postData: {
					parentid: _parentId,
					condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
					keyword: $("#txt_Keyword").val(),
					Category: options_val || ''
				}
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
		dialogOpen({
			id: "Form",
			title: '添加功能',
			url: '/webpage/system/menu_form.html?keyValue=' + '&parentId=' + _parentId,
			width: "700px",
			height: "430px",
			btn: null
		});
	};
	//编辑
	this.btn_edit = function() {
		var keyValue = $("#gridTable").jqGridRowValue("ModuleId");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "Form",
				title: '编辑功能',
				url: '/webpage/system/menu_form.html?keyValue=' + keyValue,
				width: "700px",
				height: "430px",
				btn: null
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("ModuleId");
		if(keyValue) {
			$.RemoveForm({
				url: "/AuthorizeManage/Module/RemoveForm",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#gridTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的数据项！', 0);
		}
	}
};

//工具按钮
$('.toolbar').authorizeButton();
var model = new viewModel();