var viewModel = function() {
	var self = this;
	var keyValue = request("keyValue"),
		productCatId = request("productCatId"),
		productType = request("productType");

	$(function() {
		self.GetTree();
		self.InitTable();
	});

	//加载树
	var _itemId = "";
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 40,
			url: "/AfterSaleManage/aw_flowchart/GetProductNodeCatList",
			param: {
				productInfoId: keyValue
			},
			onnodeclick: function(item) {
				console.log(item)
				_itemId = item.id;
				$('#btn_Search').trigger("click");
			}
		};
		$("#itemTree").treeview(item);
	};

	//初始化table
	this.InitTable = function() {
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/aw_flowchart/GetProductNodeList",
			postData: {
				productInfoId: keyValue,
				productCatId: '',
				keyword: ''
			},
			datatype: "json",
			height: $(window).height() - 98,
			autowidth: true,
			colModel: [{
					label: "采集点id",
					name: "product_NODE_ID",
					index: "product_NODE_ID",
					hidden: true
				},
				{
					label: "产品分类id",
					name: "productInfoId",
					index: "productInfoId",
					hidden: true
				},
//				{
//					label: "节点类型",
//					name: 'NODE_FLAG',
//					width: 120,
//					align: "center",
//					sortable: true,
//					formatter: function(data) {
//						var formatter = '';
//						switch(data) {
//							case "0":
//								formatter = "模拟数据";
//								break;
//							case "1":
//								formatter = "开关量";
//								break;
//							case "3":
//								formatter = "故障信息";
//								break;
//							case "2":
//								formatter = "其它节点";
//								break;
//							default:
//								formatter = "";
//								break;
//						}
//						return formatter;
//					}
//				},
				{
					label: "检测项目名称",
					name: 'NODE_NAME',
					width: 120,
					align: "center",
					sortable: true
				},
				{
					label: "节点代码",
					name: 'NODE_CODE',
					width: 120,
					align: "center",
					sortable: true
				},
				{
					label: "关联节点代码",
					name: 'RELA_CODE',
					width: 120,
					align: "center",
					sortable: true
				},
				{
					label: "节点PLC地址",
					name: 'PARA_ADD',
					width: 120,
					align: "center",
					sortable: true
				},
				{
					label: "数据类型",
					name: 'DATA_TYPE',
					width: 120,
					align: "center",
					sortable: true,
					formatter: function(data) {
						var formatter = '';
						switch(data) {
							case "0":
								formatter = "BIT(1位)";
								break;
							case "1":
								formatter = "BYTE(8位)";
								break;
							case "2":
								formatter = "SHORT(16位)";
								break;
							case "3":
								formatter = "LONG(32位)";
								break;
							case "4":
								formatter = "FLOAT(32位)";
								break;
							default:
								formatter = "";
								break;
						}
						return formatter;
					}
				},
				{
					label: "是否可读",
					name: 'ENABLE_R_W',
					width: 80,
					align: "center",
					sortable: true,
					formatter: function(data) {
						var formatter = '';
						switch(data) {
							case "0":
								formatter = "只读";
								break;
							case "1":
								formatter = "可读写";
								break;
							default:
								formatter = "";
								break;
						}
						return formatter;
					}
				},

			],

			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			viewrecords: true,
			subGrid: false, //是否使用子表格，默认false		
			rowNum: 20, //一页显示多少条
			rowList: [10, 20, 30], //可供用户选择一页显示多少条
			pager: '#gridPager', //表格页脚的占位符(一般是div)的id
			sortname: 'CreateDate', //初始化的时候排序的字段
			sortorder: "desc", //排序方式,可选desc,asc
			onSelectRow: function() {
				selectedRowIndex = $('#' + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				console.log(selectedRowIndex);
				$('#' + this.id).setSelection(selectedRowIndex, false);
			},
			loadComplete: function(data) {
				console.log(data);
			}
		});
		//查询事件
		$("#btn_Search").click(function(itemId) {
			if(!_itemId) {
				dialogMsg('请选择产品类型!', 0);
				return false;
			}
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/aw_flowchart/GetProductNodeList",
				postData: {
					productCatId: _itemId,
					productInfoId: keyValue,
					keyword: $("#txt_Keyword").val()
				},
			}).trigger('reloadGrid');
		});
		//查询回车
		$('#txt_Keyword').bind('keypress', function(event) {
			if(!_itemId) {
				dialogMsg('请选择产品类型!', 0);
				return false;
			}
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	};
	var filename = "OrderEntry.xlsx";
	this.export_a = function() { //导出
			 window.location= cm.domain +"/AfterSaleManage/orderproduct_node/DownloadFile?filename=" + filename  + "&token="+cm.token;
		}
	this.reload = function() {
		location.reload();
	}

	//新增
	this.btn_add = function() {
		if(!_itemId) {
			dialogMsg('请先选择产品类型！', 0);
			return;
		} else {
			dialogOpen({
				id: 'AddControllerForm',
				title: '新增控制点',
				url: '/hongtupage/view/equipment/monitor_art_con_set_add.html?keyValue=' + keyValue + "&productcatid=" + _itemId + "&productType=" + productType,
				width: '650px',
				height: '600px',
				btn: ['确定', '取消'],
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick(function() {
						$("#gridTable").trigger("reloadGrid");
					});
				}
			});
		}
	};
	//编辑
	this.btn_edit = function() {
		var id = $('#gridTable').jqGridRowValue('product_NODE_ID');
		if(!_itemId) {
			dialogMsg('请先选择采集点类型！', 0);
			return false;
		} else if(!id) {
			dialogMsg('请先选择需要编辑的控制点！', 0);
			return false;
		} else {
			dialogOpen({
				id: 'EditControllerForm',
				title: '编辑控制点',
				url: '/hongtupage/view/equipment/monitor_art_con_set_edit.html?keyValue=' + id + '&productinfoid=' + keyValue + "&productcatid=" + _itemId + "&productType=" + productType,
				width: '650px',
				height: '600px',
				btn: ['确定', '取消'],
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick(function() {
						$("#gridTable").trigger("reloadGrid");
					});
				}
			});
		}
	};
	//excel导入
	this.btn_Import = function() {
		dialogOpen({
			id: "ImportWorkOrder",
			title: 'excel导入',
			url: '/hongtupage/view/equipment/Import.html',
			width: "400px",
			height: "250px",
			btn: ['导入', '取消'],
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("product_NODE_ID");
		if(keyValue) {
			$.RemoveForm({
				url: "/AfterSaleManage/aw_flowchart/ProductNodeRemove",
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
	};

};

var model = new viewModel();