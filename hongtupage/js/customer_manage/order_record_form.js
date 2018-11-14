var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');

	$(function() {
		self.initControl();
		self.init_contactor();
		self.init_contract();
	});
	//初始化控件
	this.initControl = function() {
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/BaseManage/Organize/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#desciption").val(data.Description);
					$("#form1").SetWebControls(data);
				}
			})
		}
	}

	this.init_contactor = function() {
		var $gridTable = $('#contactor_table');
		$gridTable.jqGrid({
			autowidth: true,
			height: 200,
			url: "/AfterSaleManage/orderhead/GetLinkManListByClient",
			postData: {
				organizeId: $("#OrganizeId").val()
			},
			datatype: "json",
			colModel: [{
					label: '序号',
					name: 'customerid',
					index: 'customerid',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true,
					key: true
				},
				{
					label: '姓名',
					name: 'contact',
					index: 'contact',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '性别',
					name: 'gender',
					index: 'gender',
					width: 60,
					align: 'center',
					sortable: true,
					formatter: function(cellvalue, options, rowObject) {
						if(cellvalue == '1') {
							return '男';
						} else if(cellvalue == '0') {
							return '女';
						} else {
							return '';
						}
					}
				},
				{
					label: '电话',
					name: 'tel',
					index: 'tel',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '手机号码',
					name: 'mobile',
					index: 'mobile',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '职位',
					name: 'postid',
					index: 'postid',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '备注',
					name: 'description',
					index: 'description',
					width: 100,
					align: 'center',
					sortable: true
				},
			],
			rowNum: "1000",
			sortname: 'contact',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			viewrecords: true,
			caption: "联系人",
		});

	};

	this.init_contract = function() {
		var $gridTable = $("#contract_table");
		var queryJson = {
			organizeid: $("#OrganizeId").val()
		}
		$gridTable.jqGrid({
			url: "/AfterSaleManage/orderhead/GetPageListByClientOrder",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			datatype: "json",
			height: 350,
			autowidth: true,
			colModel: [{
					label: '合同流水号',
					name: 'contractheadid',
					align: 'center',
					sortable: true,
					hidden: true,
					key: true
				},
				{
					label: "合同号",
					name: "contractno",
					width: 160,
					align: "left",
					sortable: true,
				},

				{
					label: "合同类型",
					name: "contracttype",
					width: 120,
					align: "left",
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						if(cellvalue == '1') {
							return '线下订单';
						} else if(cellvalue == '2') {
							return '电商';
						} else {
							return '';
						}
					}
				},
				{
					label: "合同性质",
					name: "contractattu",
					width: 120,
					align: "left",
					sortable: false
				},
				{
					label: "合同价格",
					name: "contractprices",
					width: 120,
					align: "left",
					sortable: false
				},
				{
					label: "客户单位",
					name: "client",
					width: 190,
					align: "left",
					sortable: true,
				},
				{
					label: '客户地址',
					name: 'address',
					width: 150,
					align: "left",
					sortable: false,

				},
				{
					label: "联系人",
					name: "contact",
					width: 100,
					align: "left",
					sortable: false,

				},
				{
					label: "手机",
					name: "mobile",
					width: 100,
					align: "left",
					sortable: false
				},
				{
					label: "电话",
					name: "tel",
					width: 100,
					align: "left",
					sortable: false
				},
				{
					label: "组织id",
					name: "organizeid",
					width: 100,
					align: "left",
					sortable: false,
					hidden: true
				},
				{
					label: "销售经理",
					name: "saleman",
					align: "left",
					sortable: false
				}
			],
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			subGrid: true, //是否使用子表格，默认false
			rowNum: 1000,
			sortname: 'contractno',
			sortorder: 'desc',
			subGrid: true, //table树
			caption: "合同信息",
			subGridRowExpanded: function(subgrid_id, row_id) {
				var contract_id = $gridTable.jqGrid('getRowData', row_id).contractheadid;
			    subgrid_table_id = subgrid_id + "_t";
				//var pager_id = "p_"+subgrid_table_id;//用于子表格分页
				$("#" + subgrid_id).html("<table id='" + subgrid_table_id + "'></table>");
				$("#" + subgrid_table_id).jqGrid({
					url: "/AfterSaleManage/orderhead/GetProductListByClientOrder",
					postData: {
						orderContractHeadId: contract_id,
					},
					datatype: "json",
					height: "100%",
					colModel: [{
							label: '主键',
							name: 'orderheadid',
							hidden: true
						}, {
							label: "产品名称",
							name: "productname",
							index: "productname",
							width: 120,
							align: "center",
							sortable: true,
						}, {
							label: "产品型号",
							name: "producttype",
							index: "producttype",
							width: 150,
							sortable: true,
						},
						{
							label: "订单号",
							name: "ordertno",
							index: "ordertno",
							width: 100,
							align: "center",
							sortable: false
						},
						{
							label: "订单类型",
							name: "ordertype",
							index: "ordertype",
							width: 100,
							align: "center",
							sortable: false
						},
						{
							label: "总数量",
							name: "totalquantity",
							index: "totalquantity",
							width: 80,
							align: "center",
							sortable: false,
							formatter: function(cellvalue, options, rowObject) {
								return '<a href="javascript:void(0)"   onclick="number_btn(this);" data-value="' + cellvalue + '" data-id="'+ subgrid_table_id +'"  style="color:#f49c12;">' + cellvalue + '</a>';
							}
						},
						{
							label: "合同签订日期",
							name: "signingdate",
							index: "signingdate",
							width: 160,
							align: "center",
							sortable: false,
							
						},
						{
							label: "合同交付日期",
							name: "deliverydate",
							index: "deliverydate",
							width: 160,
							align: "center",
							sortable: false
						},
						{
							label: "备注",
							name: "remark",
							index: "remark",
							sortable: false
						}
					],
					caption: "合同产品类型信息",
					rowNum: "1000",
					/*
					 * 用于子表格分页
					 * rowNum: 20,
					 * pager: pager_id,
					 * sortname: 'num',
					 * sortorder: "asc",
					 */

					rownumbers: true,
					shrinkToFit: false,
					/*
					 * gridview:
					 * 读取大数据集会存在速度问题。
					 *主要原因就是每一个单元格都是用了5-6条jQuery调用被插入到grid中。
					 *设置gridview=true来解决这个问题。
					 *我们用一个jQuery追加一次插入整行的数据。
					 *比以前快了3-5倍。
					 *不能使用treeGrid，subGrid或者afterInsertRow事件。
					 */
					gridview: true,
					//设置grid的隐藏/显示按钮是否可用。
					hidegrid: false
				});
			}
		});
	}

	//加载表格
	this.init_product = function(id) {
		var $gridTable = $('#product_table');
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
			pager: "#product_page",
			sortname: 'nextwarrantdate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			caption: "订单产品列表详情",
		});
	}

};
var subgrid_table_id = '';
var model = new viewModel();

// 子表“数量”点击事件
// 放进viewModel无法调用，故放出外面
var number_btn = function(obj) {
	var $obj = $(obj);
	//获取该单元格所属行的某值
	var rowdata_val = $obj.parent().parent().find("[aria-describedby='"+subgrid_table_id+"_orderheadid']").text();
	var keyValue = rowdata_val;
	if(Number(keyValue) > 0) {
		$("#product_div").html("");
		$("#product_div").html("<table id='product_table'></table><div id='product_page'></div>");
		model.init_product(keyValue);
	} else {
		dialogMsg('值无效！', 0);
		return false;
	}
};