var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;
	$(function() {
		self.GetGrid();
		self.GetTree();
	});

	//加载树
	this.GetTree = function() {
		var item = {
			height: 590,
			url: "/SystemManage/DataItem/GetTreeJson4ItemTypeCat",
			param: {
				productInfoId: keyValue
			},
			onnodeclick: function(item) {
				var itemType = item.id;
				self.load_tree_data(itemType);
			}
		};
		//初始化
		$("#itemTree").treeview(item);
	}
	//加载表格
	this.GetGrid = function() {
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/productbomattu/GetPageListJsonByItemType",
			datatype: "json",
			postData: {
				itemType: "0",
				productInfoId: keyValue
			},
			height: 530,
			width: 670,
			colModel: [{
					label: '物料流水号',
					name: 'productBomAttuId',
					hidden: true
				},
				{
					label: '物料类型流水号',
					name: 'productBomCatId',
					hidden: true
				},
				{
					label: '产品类型流水号',
					name: 'productInfoId',
					hidden: true
				},
				{
					label: '',
					name: 'isEnableOptVal',
					hidden: true
				},
				{
					label: '',
					name: 'OptionalValues',
					hidden: true
				},
				{
					label: '',
					name: 'defaultValue',
					hidden: true
				},
				{
					label: '物料名称',
					name: 'attributeName',
					index: 'attributeName',
					width: 120,
					align: 'center'
				},
				{
					label: "物料编码",
					name: "itemCode",
					index: "itemCode",
					width: 140,
					align: "center",

				},
				{
					label: '物料英文名称',
					name: 'attributeEnName',
					index: 'attributeEnName',
					width: 120,
					align: 'center'
				},
				{
					label: '供应商',
					name: 'vendor',
					index: 'vendor',
					width: 100,
					align: 'center'
				},
				{
					label: '规格',
					name: 'spec',
					index: 'spec',
					width: 110,
					align: 'center'
				},
				{
					label: "保修年限",
					name: "warrantYears",
					index: "warrantYears",
					width: 120,
					align: "center",

				},
				
				{
					label: "质保三包到期时间",
					name: "warrantyExpTime",
					index: "warrantyExpTime",
					width: 160,
					align: "left"
				},
				{
					label: "图号",
					name: "graphNo",
					index: "graphNo",
					width: 160,
					align: "left"
				},
				{
					label: "备注",
					name: "remark1",
					index: "remark1",
					width: 160,
					align: "left"
				}
			],
			trownumbers: true,
			shrinkToFit: false,
			gridview: true,
			viewrecords: true, // 确定是否显示总的记录条数。
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'warrantYears',
			sortorder: 'desc',

		});

	}
	this.load_tree_data = function(param) {
		$("#gridTable").jqGrid('setGridParam', {
			postData: {
				itemType: param,
				productInfoId: keyValue
			},
		}).trigger('reloadGrid');
	}

};

var model = new viewModel();