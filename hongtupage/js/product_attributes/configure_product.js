var viewModel = function() {
	var self = this;
	$(function() {
		self.InitialPage();
		self.GetTree();
		self.GetGrid();
		self.getChildGrid();
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
				$("#gridTable").setGridHeight(180);
				$('#gridChildTable').setGridWidth(($('.gridPanel').width()));
				$("#gridChildTable").setGridHeight($(window).height() - 455);
				$("#itemTree").setTreeHeight($(window).height() - 56);
			}, 200);
			e.stopPropagation();
		});
	}
	//加载树
	var _parentId = "";
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 56,
			url: "/SystemManage/DataItem/GetTreeJson4ProductCat",
			onnodeclick: function(item) {
				console.log(item);
				_parentId = item.id;
				$('#btn_Search').trigger("click");
				self.search_child_table('');
			}
		};
		//初始化
		$("#itemTree").treeview(item);
	}

	//加载表格
	this.GetGrid = function() {
		//获取表格数据
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			url: "/AfterSaleManage/orderproduct/GetPageListJson4WorkorderProduct",
			datatype: "json",
			height: 180,
			autowidth: true,
			colModel: [{
					label: "产品分类id",
					name: "productcatid",
					index: "productcatid",
					hidden: true
				},
				{
					label: "产品型号id",
					name: "productinfoid",
					index: "productinfoid",
					hidden: true
				},
				{
					label: "工作令",
					name: "workorder",
					index: "workorder",
					width: 120,
					align: "center"
				},
				{
					label: "工作令数量",
					name: "qty",
					index: "qty",
					width: 80,
					align: "center"
				},
				{
					label: "产品型号",
					name: "productcode",
					index: "productcode",
					width: 120,
					align: "center"
				},
				{
					label: "产品批号",
					name: "batchno",
					index: "batchno",
					width: 120,
					align: "center"
				},

				{
					label: "产品名称",
					name: "productname",
					index: "productname",
					width: 120,
					align: "center",

				},
				{
					label: "合同签署日期",
					name: "signingdate",
					index: "signingdate",
					width: 160,
					align: "center",

				},
				{
					label: "合同发货日期",
					name: "deliverydate",
					index: "deliverydate",
					width: 160,
					align: "center",

				},
				{
					label: "下次更新时间",
					name: "nextwarrantdate",
					index: "nextwarrantdate",
					width: 160,
					align: "center",
				},
				{
					label: "客户名称",
					name: "client",
					index: "client",
					width: 120,
					align: "center",

				},
				{
					label: "客户地址",
					name: "address",
					index: "address",
					width: 140,
					align: "center"
				},
			],

			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPage",
			sortname: 'signingdate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			caption: '产品概况',
			ondblClickRow: function(rowid, iRow, iCol, e) {
				//双击获取工作令刷新子表格
				var row_id = $gridTable.jqGrid('getRowData', rowid).workorder;
				self.search_child_table(row_id);
			},
			//表头的隐藏显示按钮事件
			onHeaderClick: function(gridstate) {
				if(gridstate == 'hidden') {
					$("#gridChildTable").setGridHeight($(window).height() - 220);
				} else if(gridstate == 'visible') {
					$("#gridChildTable").setGridHeight($(window).height() - 455);
				}
			},
		});

		//查询条件
		$("#queryCondition .dropdown-menu li").click(function() {
			var text = $(this).find('a').html();
			var value = $(this).find('a').attr('data-value');
			$("#queryCondition .dropdown-text").html(text).attr('data-value', value);
		});
		//查询事件
		$("#btn_Search").click(function() {
			var queryJson = {
				condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
				keyword: $("#txt_Keyword").val(),
				productCatId: _parentId
			}
			$gridTable.jqGrid('setGridParam', {
				postData: {
					queryJson: JSON.stringify(queryJson)
				},
				page: 1
			}).trigger('reloadGrid');
		});

		//查询回车
		$('#txt_Keyword').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	}

	//产品详情表格
	this.getChildGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $("#gridChildTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/orderproduct/GetPageListJsonProducts4Workorder",
			datatype: "json",
			height: $(window).height() - 455,
			autowidth: true,
			colModel: [{
					label: "产品id",
					name: "orderproductid",
					hidden: true
				},
				{
					label: "产品类型id",
					name: "productcatid",
					hidden: true
				},
				{
					label: "产品型号id",
					name: "productinfoid",
					hidden: true
				},
				{
					label: "工作令",
					name: "workorder",
					index: "workorder",
					width: 120,
					align: "center"

				},
				{
					label: "产品序列号",
					name: "producttoken",
					index: "producttoken",
					width: 120,
					align: "center"
				},

				{
					label: "产品名称",
					name: "productname",
					index: "productname",
					width: 120,
					align: "center"
				},
				{
					label: "产品型号",
					name: "productcode",
					index: "productcode",
					width: 120,
					align: "center"
				},
				{
					label: "产品批次号",
					name: "batchno",
					index: "batchno",
					width: 120,
					align: "center"
				},
				{
					label: "产品发货时间",
					name: "deliverytime",
					index: "deliverytime",
					width: 140,
					align: "center"
				},
				{
					label: "下次质保日期",
					name: "nextwarrantdate",
					index: "nextwarrantdate",
					width: 140,
					align: "center"
				},

				{
					label: "合同签署日期",
					name: "signingdate",
					index: "signingdate",
					width: 140,
					align: "center"
				},
				{
					label: "合同发货日期",
					name: "deliverydate",
					index: "deliverydate",
					width: 140,
					align: "center",

				},
				{
					label: "客户名称",
					name: "client",
					index: "client",
					width: 100,
					align: "center"
				},
				{
					label: "客户地址",
					name: "address",
					index: "address",
					width: 100,
					align: "center"
				},
			],

			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridChildPage",
			sortname: 'signingdate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			caption: "产品详情",
			hidegrid: false, //隐藏收缩按钮
			onSelectRow: function() {
				selectedRowIndex = $('#' + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$('#' + this.id).setSelection(selectedRowIndex, false);
			},
			ondblClickRow: function(rowid, iCol, cellcontent, e) {
				self.btn_viewa(); //双击查看
			}
		});
	}

	//查询子表格
	this.search_child_table = function(param) {
		$("#gridChildTable").jqGrid('setGridParam', {
			postData: {
				workorder: param,
			},
			page: 1
		}).trigger('reloadGrid');
	}

	//新增
	this.btn_add = function() {
		top.tablist.newTab({
			id: "tab" + (cm.format.guid()),
			title: "产品配置",
			closed: true,
			replace: false,
			icon: "fa fa-file-text-o",
			url: "/hongtupage/view/product_attributes/configure_product_add.html"
		});
		//		dialogOpen({
		//			id: "AddWorkOrderForm",
		//			title: '新增工作令',
		//			url: '/hongtupage/view/product_attributes/configure_product_add.html?parentId=' + _parentId,
		//			width: "700px",
		//			height: "430px",
		//			btn: ['保存', '取消'],
		//			callBack: function(iframeId) {
		//				top.frames[iframeId].model.AcceptClick();
		//			}
		//		});
	};
	//编辑
	this.btn_edit = function() {
		var keyValue = $("#gridTable").jqGridRowValue("productinfoid");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "EditWorkOrderForm",
				title: '编辑工作令',
				url: '/hongtupage/view/product_attributes/configure_product_edit.html?keyValue=' + keyValue,
				width: "700px",
				height: "430px",
				btn: ['保存', '取消'],
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("productinfoid");
		if(checkedRow(keyValue)) {
			$.RemoveForm({
				url: "",
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

	//详情删除
	this.btn_detail_delete = function() {
		var keyValue = $("#gridChildTable").jqGridRowValue("orderproductid");
		if(checkedRow(keyValue)) {
			$.RemoveForm({
				url: "",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#gridChildTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的数据项！', 0);
		}
	}

	//产品配置
	this.btn_pro_confit = function() {
		//产品型号ID
		var keyValue = $('#gridChildTable').jqGridRowValue('productinfoid');
		//产品流水号ID
		var orderProductId = $('#gridChildTable').jqGridRowValue('orderproductid');
		//产品类型ID
		var productCatId = $('#gridChildTable').jqGridRowValue('productcatid');
		
		if(!orderProductId && orderProductId.length <= 0){
			dialogMsg('请双击产品概况，然后选择产品详情！',0);
			return false;
		}
//
//		if(checkedRow(keyValue)) {
			dialogOpenMax({
				id: "EditProductForm",
				url: '/hongtupage/view/product_attributes/configure_product_attr_edit.html?keyValue=' + keyValue + '&orderProductId=' + orderProductId + '&productCatId=' + productCatId,
				width: 'px',
				height: 'px',
				btn: null,
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
//		}
	};

	//excel导入
	this.btn_excel_import = function() {
		dialogOpen({
			id: "ImportWorkOrder",
			title: 'excel导入',
			url: '/hongtupage/view/product_attributes/configure_product_import.html',
			width: "400px",
			height: "250px",
			btn: ['导入', '取消'],
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	}
	
	//查看
	this.btn_viewa = function() {
		var keyValue = $('#gridChildTable').jqGridRowValue('orderproductid');
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: 'Forms',
				title: '产品详情',
				url: '/hongtupage/view/customer_manage/order_product_detail.html?keyValue=' + keyValue,
				width: '900px',
			    height: '700px',
				btn: null,
			})
		}
	}

};
//工具按钮
$('.toolbar').authorizeButton();
var model = new viewModel();