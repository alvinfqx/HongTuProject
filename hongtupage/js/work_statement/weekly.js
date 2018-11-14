var viewModel = function() {
	var self = this;
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
	//	var _isTree = "";
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 58,
			url: "/AfterSaleManage/oa_workdaily/GetTreeJson4LayUI",
			onnodeclick: function(item) {
				console.log(item)
				_itemId = item.id;
				$('#btn_Search').trigger("click");
			}
		};
		//初始化
		$("#itemTree").treeview(item);
	}
	//加载表格
	this.pageInit = function() {
//		var begindata = $("#begindata").val();
//		var enddata = $("#enddata").val();
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		var queryJson = {
			keyword: _itemId,
			begindata:  $("#begindata").val(),
			enddata: $("#enddata").val()
		};
		var queryJson = JSON.stringify(queryJson);
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 136.5,
			url: "/AfterSaleManage/oa_workweekly/GetPageListJson",
			datatype: "json",
			postData: {
				queryJson: queryJson
			},
			colModel: [{
					label: '主键',
					name: 'fID',
					index: 'fID',
					hidden: true
				},
				{
					label: '版本',
					name: 'version',
					index: 'version',
					hidden: true
				},
				{
					label: '填报人',
					name: 'fPersonID',
					index: 'fPersonID',
					hidden: true
				},
				{
					label: '填报人名称',
					name: 'fPersonName',
					index: 'fPersonName',
					hidden: true
				},
				{
					label: '填报部门',
					name: 'fDeptID',
					index: 'fDeptID',
					hidden: true
				},
				{
					label: '填报部门名称',
					name: 'fDeptName',
					index: 'fDeptName',
					hidden: true
				},
				{
					label: '创建日期',
					name: 'fCreateTime',
					index: 'fCreateTime',
					hidden: true
				},
				{
					label: '填报日期',
					name: 'fDate',
					index: 'fDate',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '今日完成工作',
					name: 'fFinishWork',
					index: 'fFinishWork',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '明日工作计划',
					name: 'fWorkPlan',
					index: 'fWorkPlan',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '需协调与帮助',
					name: 'fNeedHelp',
					index: 'fNeedHelp',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '备注',
					name: 'fRemark',
					index: 'fRemark',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '图片路径',
					name: 'fImgURL',
					index: 'fImgURL',
					hidden: true
				},
				{
					label: '发布范围',
					name: 'fReleaseScope',
					index: 'fReleaseScope',
					hidden: true
				},
				{
					label: '发布范围ID',
					name: 'fReleaseScopeID',
					index: 'fReleaseScopeID',
					hidden: true
				},
			],
			viewrecords: true,
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			viewrecords: true,
			subGrid: false, //是否使用子表格，默认false		
			rowNum: 20, //一页显示多少条
			rowList: [10, 20, 30], //可供用户选择一页显示多少条
			pager: '#gridPager', //表格页脚的占位符(一般是div)的id
			sortname: 'fDate', //初始化的时候排序的字段
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
			},
			ondblClickRow: function(rowid, iCol, cellcontent, e) {
				self.btn_view(); //双击查看
			}
		});
		//查询事件
		$("#btn_Search").click(function() {
			var queryJson = JSON.stringify({
				keyword: _itemId,
				begindata: $("#begindata").val(),
				enddata: $("#enddata").val()
			});
//			alert($("#begindata").val());
//			alert($("#enddata").val());
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/oa_workweekly/GetPageListJson",
				postData: {
					queryJson: queryJson
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
	var keyValue = "";
	this.btn_view = function() {
		keyValue = $('#gridTable').jqGridRowValue('fID');
		if(checkedRow(keyValue)) {
		dialogOpen({
			id: "DataItem",
			title: '个人工作报告',
			url: '/hongtupage/view/work_statement/weekly_form.html?keyValue=' + keyValue,
			width: "460px",
			height: "460px",
			btn: null
		});
		}
	}
	
};
//工具按钮
$(".toolbar").authorizeButton();
var model = new viewModel();