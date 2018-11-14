var viewModel = function() {
	var self = this;
	$('#simple_id').text(cm.smallSystemName);
	$('#logo_id').text(cm.comSystemName);
	$(function() {
		//页面加载完成之后执行
		self.InitialPage();
		self.pageInit();
		self.GetTree();

	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$('#gridTable').setGridHeight($(window).height() - 143);
				$("#itemTree").setTreeHeight($(window).height() - 45);
			}, 200);
			e.stopPropagation();
		});
	};

	//加载树
	var _itemId = "";
	var _itemName = "";
	var _isTree = "";
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 58,
			url: "/SystemManage/DataItem/GetTreeJson4ProductCat",
			onnodeclick: function(item) {
				_itemId = item.id;
				_itemName = item.text;
				_isTree = item.isTree;
//				alert(1)
				$('#btn_Search').trigger("click");
			}
		};
		//初始化
		$("#itemTree").treeview(item);
	}
	
	this.pageInit = function() {
		//创建jqGrid组件
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/productinfo/GetPageListByProductCatWithParam", //组件创建完成之后请求数据的url
			postData: {
				productCatId:'',
			},
			datatype: "json", //请求数据返回的类型。可选json,xml,txt
			height: $(window).height() - 143,
			autowidth: true,
			colModel: [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
			{
					label: "产品id",
					name: "productInfoId",
					index: "productInfoId",
					hidden: true,
					key: true
				},
				{
					label: "分类id",
					name: "productCatId",
					index: "productCatId",
					hidden: true
				},
				{
					label: "产品类别",
					name: 'productType',
					width: 100,
					align: "left",					
					sortable: true
				},
				{
					label: "产品名称",
					name: 'productName',
					width: 100,
					align: "left",		
					sortable: true
				},
				{
					label: "产品代号",
					name: 'productCode',
					width: 100,
					align: "left",		
					sortable: true
				},
				{
					label: "产品描述",
					name: 'productDesc',
					width: 100,
					align: "left",					
					sortable: true
				}

			],

			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			viewrecords: true,
			subGrid: false, //是否使用子表格，默认false		
			rowNum: 20, //一页显示多少条
			rowList: [10, 20, 30], //可供用户选择一页显示多少条
			pager: '#gridPager', //表格页脚的占位符(一般是div)的id
			sortname: 'productType', //初始化的时候排序的字段
			sortorder: "desc", //排序方式,可选desc,asc
			//mtype : "post",//向后台请求数据的ajax的类型。可选post,get
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
		$("#btn_Search").click(function() {
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/productinfo/GetPageListByProductCatWithParam",
				postData: {
					productCatId: _itemId,
					queryJson:$("#txt_Keyword").val()
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

	this.AcceptClickchoice = function(callback){
	
		var infoId = $('#gridTable').jqGridRowValue('productInfoId');
		var valueObj = $("#gridTable").jqGrid('getRowData',infoId);
		
		console.log(valueObj)
		
		if(checkedRow(infoId)){
		callback(valueObj);
			dialogClose();
			
		}else{
			
		}

		
	}
};
//工具按钮
$('.toolbar').authorizeButton();
var model = new viewModel();