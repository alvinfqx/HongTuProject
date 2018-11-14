var viewModel = function() {
	var self = this;
	var keyValue = request("keyValue");
	
	$(function() {
		self.GetTree();
		self.InitTable();
	});

   
	//加载树
	var _itemId = "";
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 50,
			url: "/AfterSaleManage/aw_flowchart/GetProductNodeCatList",
			param: {
				productInfoId: keyValue
			},
			onnodeclick: function(item) {
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
			url: "/AfterSaleManage/productinfo/GetPageListByProductCat",
			postData: {
				productInfoId: keyValue,
				productCatId: ''
			},
			datatype: "json",
			height: $(window).height() - 108,
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
				{
					label: "采集点代号",
					name: 'NODE_CODE',
					width: 250,
					align: "center",
					sortable: true
				},
				{
					label: "采集点名称",
					name: 'NODE_NAME',
					width: 150,
					align: "center",
					sortable: true
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
			if(!_itemId){
				dialogMsg('请选择产品类型!',0);
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
			if(!_itemId){
				dialogMsg('请选择产品类型!',0);
				return false;
			}
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	};

	//确定按钮
	this.AcceptClick = function(callback) {
		try {
			var data = {};
			var rowId = $("#gridTable").jqGrid('getGridParam', 'selrow');
			var rowData = $("#gridTable").jqGrid('getRowData', rowId);			
			data = rowData;
			if(JSON.stringify(data)=="{}") {
              dialogMsg('请选择采集点！',0);
              return false;
			}
			callback(data);
			dialogClose();
		} catch(e) {
			var str = e.name + ":" + e.message;
			dialogMsg(str, 2);
		}
	}
};

var model = new viewModel();