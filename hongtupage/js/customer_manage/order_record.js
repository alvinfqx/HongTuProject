var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var productCatId = request('productCatId');
	$(function() {
		self.InitialPage();
		self.GetGrid();
		self.init_product("");
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function() {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$("#gridTable").setGridHeight(270);
				$('#gridProductTable').setGridWidth(($('.gridPanel').width()));
				$("#gridProductTable").setGridHeight($(window).height() - 538);
			}, 200);
		});
	};
	/*
	 * 树形table初始化
	 */
	this.GetGrid = function() {
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/orderhead/GetPageListByClientOrder",
			postData: {

			},
			datatype: "json",
			height: 270,
			autowidth: true,
			colModel: [{
					label: '主键',
					name: 'contractheadid',
					hidden: true
				},
				{
					label: "合同号",
					name: "contractno",
					width: 160,
					align: "center",
					sortable: true,
					formatter: function(cellvalue, options, rowObject) {
						return '<a href="javascript:void(0)" class="alvin"  onclick="contact_btn(this);" data-value="' + cellvalue + '"  style="color:#b13c2e;">' + cellvalue + '</a>';
					}
				},
				{
					label: "客户单位",
					name: "client",
					width: 190,
					align: "center",
					sortable: true,
					//cellvalue - 当前cell的值  
					//options - 该cell的options设置，包括{rowId, colModel,pos,gid}  
					//rowObject - 当前cell所在row的值，如{ id=1, name="name1", price=123.1, ...}  
					formatter: function(cellvalue, options, rowObject) {
						return '<a href="javascript:void(0)"   onclick="customer_btn(this);" data-value="' + cellvalue + '"  style="color:#3b8dbc;">' + cellvalue + '</a>';
					}

				},
				{
					label: '客户地址',
					name: 'address',
					width: 150,
					align: "center",
					sortable: false,

				},
				{
					label: "联系人",
					name: "contact",
					width: 100,
					align: "center",
					sortable: false,

				},
				{
					label: "手机",
					name: "mobile",
					width: 100,
					align: "center",
					sortable: false
				},
				{
					label: "电话",
					name: "tel",
					width: 100,
					align: "center",
					sortable: false
				},
				{
					label: "合同类型",
					name: "contracttype",
					width: 120,
					align: "center",
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
					align: "center",
					sortable: false
				},
				{
					label: "合同价格",
					name: "contractprices",
					width: 120,
					align: "center",
					sortable: false
				},
				{
					label: "组织id",
					name: "organizeid",
					width: 100,
					align: "center",
					sortable: false,
					hidden: true
				},
				{
					label: "销售经理",
					name: "saleman",
					align: "center",
					sortable: false
				}
			],
			rownumbers: true,
			shrinkToFit: false,
			viewrecords: true, // 确定是否显示总的记录条数。
			subGrid: true, //是否使用子表格，默认false
			//rowNum: 1000,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'contractheadid',
			sortorder: 'desc',
			gridview: true,
			caption: "客户列表",
			//表头的隐藏显示按钮事件
			onHeaderClick: function(gridstate) {
				if(gridstate == 'hidden') {
					$("#gridProductTable").setGridHeight($(window).height() - 210);
				} else if(gridstate == 'visible') {
					$("#gridProductTable").setGridHeight($(window).height() - 524);
				}
			},
			subGridRowExpanded: function(subgrid_id, row_id) {
				/*
				 * 因为主table的客户单位需要点击事件，所以返回了<a>标签
				 * 这里需要做字符串的切割获取改单元格的值
				 * 
				 */
				var contract_id = $gridTable.jqGrid('getRowData', row_id).contractheadid;
//				alert(contract_id)
				subgrid_table_id = subgrid_id + "_t";
				//var pager_id = "p_"+subgrid_table_id;//用于子表格分页
				$("#" + subgrid_id).html("<table id='" + subgrid_table_id + "'></table>");
				$("#" + subgrid_table_id).jqGrid({
					url: "/AfterSaleManage/orderhead/GetProductListByClientOrder",
					postData: {
						orderContractHeadId: contract_id
					},
					datatype: "json",
					height: "100%",
					colModel: [{
							label: '主键',
							name: 'orderheadid',
							hidden: true
						},
						{
							label: '产品流水号',
							name: 'productinfoid',
							hidden: true
						},
						{
							label: "产品名称",
							name: "productname",
							index: "productname",
							width: 120,
							align: "center",
							sortable: true,
							formatter: function(cellvalue, options, rowObject) {
								return '<a href="javascript:void(0)"   onclick="product_btn(this);" data-value="' + cellvalue + '" data-id="' + subgrid_table_id + '"  style="color:#00a157;">' + cellvalue + '</a>';
							}
						}, {
							label: "产品类型",
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
								return '<a href="javascript:void(0)"   onclick="product_detail_btn(this);" data-value="' + cellvalue + '" data-id="' + options.rowId + '"  style="color:#f49c12;">' + cellvalue + '</a>';
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
							align: "center",
							sortable: false
						}
					],
					caption: "合同信息",
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
		//查询事件
		$("#btn_Search").click(function() {
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/orderhead/GetPageListByClientOrder",
				postData: {

				},
			}).trigger('reloadGrid');
		});
	}
	/*
	 * table初始化 END
	 */

	//=========子table初始化 Star==========
	this.init_product = function(id) {
//		alert(id)
		var $gridTable = $('#gridProductTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 538,
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
					align: "center",
					sortable: true,
					hidden: true,
					key: true
				},
				{
					label: '产品名称',
					name: 'productname',
					index: 'productname',
					width: 100,
					align: "center",
					sortable: true,
					formatter: function(cellvalue, options, rowObject) {
						return '<a href="javascript:void(0)"   onclick="product_name_btn(this);" data-value="' + cellvalue + '" data-id="' + options.rowId + '"  style="color:#9571bd;">' + cellvalue + '</a>';
					}
				},
				{
					label: '产品类型',
					name: 'producttype',
					index: 'producttype',
					width: 100,
					align: "center",
					sortable: true
				},
				{
					label: '产品编码',
					name: 'productcode',
					index: 'productcode',
					width: 100,
					align: "center",
					sortable: true
				},
				{
					label: '产品批次号',
					name: 'batchno',
					index: 'batchno',
					width: 120,
					align: "center",
					sortable: true
				},
				{
					label: '出厂日期',
					name: 'deliverytime',
					index: 'deliverytime',
					width: 120,
					align: "center",
					sortable: true
				},
				{
					label: '下次质保期',
					name: 'nextwarrantdate',
					index: 'nextwarrantdate',
					width: 160,
					align: "center",
					sortable: true
				},
				{
					label: '工作令',
					name: 'workorder',
					index: 'workorder',
					width: 120,
					align: "center",
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridProductPager",
			sortname: 'nextwarrantdate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			hidegrid: true,
			caption: "产品详情列表",
			//表头的隐藏显示按钮事件
			onHeaderClick: function(gridstate) {
				if(gridstate == 'hidden') {
					$("#gridTable").setGridHeight($(window).height() - 210);
				} else if(gridstate == 'visible') {
					$("#gridTable").setGridHeight(270);
				}
			}

		});
	};
	//==========子table初始化END==============

	//高级查询隐藏/显示
	this.show_hs = function() {
		if($(".hs-block ").css('display') != "block") {		
			$(".hs-block").slideDown('normal', function() {
				$(this).show();
			})
		} else {
			
			$(".hs-block").slideUp('normal', function() {
				$(this).hide();
			})
		}
	};
	
	

};
var subgrid_table_id = '';
var product_Info_ID = '';
//工具按钮
$('.toolbar').authorizeButton();
var model = new viewModel();

// 主列表“合同号”点击事件
var contact_btn = function(obj) {
	var $obj = $(obj);
	var rowdata_val = $obj.parent().parent().find("[aria-describedby='gridTable_contractheadid']").text();
	var keyValue = rowdata_val;
	if(keyValue.length > 0) {
		dialogOpen({
			id: 'ContactForm',
			title: '合同资料',
			url: '/hongtupage/view/customer_manage/order_record_contact.html?keyValue=' + keyValue,
			width: '1000px',
			height: '700px',
			btn: null,
		})
	} else {
		dialogMsg('值无效！', 0);
		return false;
	}
}

// 主列表“客户单位”点击事件
// 放进viewModel无法调用，故放出外面
var customer_btn = function(obj) {
	var $obj = $(obj);
	var rowdata_val = $obj.parent().parent().find("[aria-describedby='gridTable_organizeid']").text();
	var keyValue = rowdata_val;
	if(keyValue.length > 0) {
		dialogOpen({
			id: 'CustomerForm',
			title: '客户基本信息',
			url: '/hongtupage/view/customer_manage/order_record_form.html?keyValue=' + keyValue,
			width: '1000px',
			height: '700px',
			btn: null,
		})
	} else {
		dialogMsg('值无效！', 0);
		return false;
	}
};

//子列表“产品类型名称”点击事件
var product_btn = function(child_obj) {
	var $child_obj = $(child_obj);
	//获取该单元格所属行的某值
	var rowdata_val = $child_obj.parent().parent().find("[aria-describedby='" + subgrid_table_id + "_productinfoid']").text();
	var keyValue = rowdata_val;
	if(rowdata_val.length > 0) {
		dialogOpen({
			id: 'ProductTypeForm',
			title: '产品类型基本信息',
			url: '/hongtupage/view/customer_manage/order_record_product.html?keyValue=' + keyValue,
			width: '900px',
			height: '700px',
			btn: null,
		});
	} else {
		dialogMsg('值无效！', 0);
		return false;
	}
};

//子列表“总数量”点击事件---初始化产品列表
var product_detail_btn = function(child_obj) {
	var $child_obj = $(child_obj);
	//获取该单元格所属行的某值
	var rowdata_val = $child_obj.parent().parent().find("[aria-describedby='" + subgrid_table_id + "_productinfoid']").text();
	var keyValue = rowdata_val;
	alert(keyValue)
	product_Info_ID = rowdata_val;
	if(rowdata_val && rowdata_val.length > 0) {
		$("#product_detail_div").html("");
		$("#product_detail_div").html("<table id='gridProductTable'></table><div id='gridProductPager'></div>");
		model.init_product(keyValue);
	} else {
		dialogMsg('产品类型流水号无效！', 0);
		return false;
	}
};


//产品详细列表产品名称点击事件---开窗
var product_name_btn = function(child_obj) {
	var $child_obj = $(child_obj);
	//获取该单元格所属行的某值
	var row_data = $("#gridProductTable").jqGrid('getRowData',$child_obj.data('id'));
	var orderproductid = row_data.orderproductid;
	var keyValue = orderproductid;

	if(keyValue && keyValue.length > 0) {
		dialogOpen({
			id: 'ProductForm',
			title: '产品基本信息',
			url: '/hongtupage/view/customer_manage/order_product_detail.html?keyValue=' + keyValue,
			width: '900px',
			height: '700px',
			btn: null,
		});
	} else {
		dialogMsg('产品流水号无效！', 0);
		return false;
	}
};

