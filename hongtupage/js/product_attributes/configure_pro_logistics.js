var viewModel = function() {
	var self = this;
	var orderProductId = request('orderProductId');
//	orderProductId="00388d33-132c-470f-8b16-cebcc48b7153"
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
			url: '/SystemManage/DataItem/GetBOMTreeListJson4SingleProduct',
			postData: {
				orderProductId:orderProductId
			},
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
					width: 100,
					align: 'center'
				},
				{
					label: '描述',
					name: 'Description',
					index: 'Description',
					width: 200,
					align: 'center'
				},
				{
					label: '排序',
					name: 'SortCode',
					index: 'SortCode',
					width: 80,
					hidden: true
				},
				{
					label: "备注",
					name: "EnabledMark",
					index: "EnabledMark",
					width: 200,
					hidden: true
				}
			],
			treeGrid: true,
			treeGridModel: "nested",
			ExpandColumn: "SortCode",
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
		dialogOpen({
			id: "LogForms",
			title: '添加分类',
			url: '/hongtupage/view/product_attributes/configure_pro_logistics_form.html?orderProductId=' + orderProductId,
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
				id: "BtnForms",
				title: '编辑分类',
				url: '/hongtupage/view/product_attributes/configure_pro_logistics_form.html?keyValue=' + keyValue+ '&orderProductId=' + orderProductId,
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
				url: "/AfterSaleManage/orderproductbomcat/RemoveForm",
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