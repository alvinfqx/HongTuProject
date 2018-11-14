var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');

	$(function() {
		self.initControl();
		self.init_product_type();
	});

	//初始化控件
	this.initControl = function() {
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AfterSaleManage/orderhead/GetOrderInfoByContractNo",
				param: {
					orderContractHeadId: keyValue
				},
				success: function(data) {
					$("#desciption").val(data[0].contractattu);
					$("#form1").SetWebControls(data[0]);
				}
			})
		}
	}

	//加载产品类型详情细表格
	this.init_product_type = function() {
		var $gridTable = $('#product_table');
		$gridTable.jqGrid({
			autowidth: true,
			height: 300,
			postData: {
				orderContractHeadId: keyValue
			},
			url: "/AfterSaleManage/orderhead/GetProductListByClientOrder",
			datatype: "json",
			colModel: [{
					label: '产品类型流水号',
					name: 'orderheadid',
					index: 'orderheadid',
					align: 'center',
					sortable: true,
					hidden: true,
					key: true
				},
				{
					label: '产品流水号',
					name: 'productinfoid',
					index: 'productinfoid',
					align: 'center',
					sortable: true,
					hidden: true,
				},
				{
					label: '合同订单号',
					name: 'ordertno',
					index: 'ordertno',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '产品类型',
					name: 'producttype',
					index: 'producttype',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '产品名称',
					name: 'productname',
					index: 'productname',
					width: 100,
					align: 'center',
					sortable: true
				},

				{
					label: '订单类型',
					name: 'ordertype',
					index: 'ordertype',
					width: 100,
					align: 'center',
					sortable: true
				}, {
					label: '总数量',
					name: 'totalquantity',
					index: 'totalquantity',
					width: 100,
					align: 'center',
					sortable: true,
					formatter: function(cellvalue, options, rowObject) {
						return '<a href="javascript:void(0)"   onclick="pro_number_btn(this);" data-value="' + cellvalue + '" data-id="' + options.rowId + '"  style="color:red;">' + cellvalue + '</a>';
					}
				},
				{
					label: '合同签署日期',
					name: 'signingdate',
					index: 'signingdate',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '合同交付日期',
					name: 'deliverydate',
					index: 'deliverydate',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '备注',
					name: 'remark',
					index: 'remark',
					align: 'center',
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#product_page",
			sortname: 'signingdate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			subGrid: false, //table收缩展开
			caption: "产品类型详情",
		});
	}

	this.init_product = function(id) {
		var $gridTable = $('#product_detail_table');
		$gridTable.jqGrid({
			autowidth: true,
			height: 300,
			postData: {
				orderHeadId: id
			},
			url: "/AfterSaleManage/orderhead/GetOrderProductListByClientOrder",
			datatype: "json",
			colModel: [{
					label: '产品流水号',
					name: 'orderproductid',
					index: 'orderproductid',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true,
					key: true
				},
				{
					label: '产品名称',
					name: 'productname',
					index: 'productname',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '产品类型',
					name: 'producttype',
					index: 'producttype',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '产品编码',
					name: 'productcode',
					index: 'productcode',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '产品批次号',
					name: 'batchno',
					index: 'batchno',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '出厂日期',
					name: 'deliverytime',
					index: 'deliverytime',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '下次质保期',
					name: 'nextwarrantdate',
					index: 'nextwarrantdate',
					width: 160,
					align: 'center',
					sortable: true
				},
				{
					label: '工作令',
					name: 'workorder',
					index: 'workorder',
					width: 120,
					align: 'center',
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#product_detail_page",
			sortname: 'nextwarrantdate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			caption: "产品详情列表",
		});
	}
};

var model = new viewModel();
// 产品类型数量点击事件
// 放进viewModel无法调用，故放出外面
var pro_number_btn = function(obj) {
	var $obj = $(obj);
	var row_id = $(obj).data('id');
	var rowdata = $("#product_table").jqGrid("getRowData", row_id);
	var orderHeadeId = rowdata.orderheadid;
	if(orderHeadeId && orderHeadeId.length > 0) {
		$("#product_detail_div").html("");
		$("#product_detail_div").html("<table id='product_detail_table'></table><div id='product_detail_page'></div>");
		model.init_product(orderHeadeId);
	} else {
		dialogMsg('值无效！', 0);
		return false;
	}
};