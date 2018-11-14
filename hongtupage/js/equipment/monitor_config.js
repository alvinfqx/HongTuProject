var viewModel = function() {
	var self = this;

	$(function() {
		self.InitialPage();
		self.GetTree();
		self.pageInit();
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
				$('#gridTable').setGridHeight($(window).height() - 138);
				$("#itemTree").setTreeHeight($(window).height() - 45);

			}, 200);
			e.stopPropagation();
		});
	}
	//加载树
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 52,
			url: "/SystemManage/DataItem/GetTreeJson4ProductCat",
			onnodeclick: function(item) {
				_itemId = item.id;
				$('#btn_Search').trigger("click");
			}
		};
		$("#itemTree").treeview(item);
	};

	//table
	this.pageInit = function() {
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/productinfo/GetPageListByProductCatWithParam",
			postData: {
				productCatId: '',
			},
			datatype: "json",
			height: $(window).height() - 138,
			autowidth: true,
			colModel: [{
					label: "产品id",
					name: "productInfoId",
					index: "productInfoId",
					hidden: true
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
					width: 150,
					align: "center",
					sortable: true
				},
				{
					label: "产品名称",
					name: 'productName',
					width: 150,
					align: "center",
					sortable: true
				},
				{
					label: "产品代号",
					name: 'productCode',
					width: 160,
					align: "center",
					sortable: true
				},
				{
					label: "产品描述",
					name: 'productDesc',
					align: "center",
					width: 200,
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
		$("#btn_Search").click(function(itemId) {
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
	};

	//刷新
	this.reload = function() {
		location.reload();
	};
	
	
    //工艺图类型设置
	this.btn_artwork = function() {
		var keyValue = $("#gridTable").jqGridRowValue("productInfoId");
		
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: 'ArtWork',
				title: '设备配置',
				url: '/hongtupage/view/equipment/monitor_artwork.html?keyValue=' + keyValue,
				width: '950px',
				height: '700px',
				btn: null,
			});
		}
	};
	
	
	//控制点类型设置
	this.btn_controller = function() {
		var keyValue = $('#gridTable').jqGridRowValue('productInfoId'),
		productCatId = $('#gridTable').jqGridRowValue('productCatId'),
		productType = $('#gridTable').jqGridRowValue('productType');
		
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: 'ControllerTypeForm',
				title: '控制点类型设置',
				url: '/hongtupage/view/equipment/monitor_art_controller.html?keyValue=' + keyValue  + '&productCatId=' + productCatId + '&productType=' + productType,
				width: '950px',
				height: '700px',
				btn: null,
			});
		}
	};

};
$('.toolbar').authorizeButton();
var model = new viewModel();