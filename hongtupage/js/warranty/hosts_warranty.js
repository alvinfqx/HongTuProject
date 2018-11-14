var viewModel = function() {
	var self = this;
	var isDbClick = false;
	/*时间函数* 今天* 近7天* 近一个月* 近三个月*/
	var now_day = cm.format.Date(cm.format.getData('day', 0), 'yyyy-MM-dd'),
		pre_week = cm.format.Date(cm.format.getData('day', -7), 'yyyy-MM-dd'),
		pre_month = cm.format.Date(cm.format.getData('month', -1), 'yyyy-MM-dd'),
		pre_three_month = cm.format.Date(cm.format.getData('month', -3), 'yyyy-MM-dd');
	console.log(now_day + '/' + pre_week + '/' + pre_month + '/' + pre_three_month);
	$("#SelectedStartTime").html(pre_week);
	$("#SelectedEndTime").html(now_day);
	$("#StartTime").val(pre_week);
	$("#EndTime").val(now_day);
	/*初始化函数*/
	$(function() {
		self.InitialPage();
		self.GetGrid();
		//		self.getChildGrid("");
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设(表格、树形)宽高
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$("#gridTable").setGridHeight($(window).height() - 120);
				//				$("#gridTable").setGridHeight(200);
				//				$('#gridChildTable').setGridWidth(($('.gridPanel').width()));
				//				$("#gridChildTable").setGridHeight($(window).height() - 468);
			}, 200);
			e.stopPropagation();
		});
	}
	//加载表格
	this.GetGrid = function() {
		var queryJson = $("#filter-form").GetWebControls();
		queryJson["begindate"] = $("#StartTime").val();
		queryJson["endDate"] = $("#EndTime").val();

		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/orderproduct/GetProductWarrantReminderList",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			datatype: "json",
			height: $(window).height() - 140,
			autowidth: true,
			colModel: [{
					label: "主键流水号",
					name: "orderproductid",
					hidden: true
				},
				{
					label: "质保期",
					name: "nextwarrantdate",
					index: "nextwarrantdate",
					width: 120,
					align: "center",
					//					formatter: function(cellvalue, options, rowObject) {
					//   					return formatDate(cellvalue, 'yyyy-MM-dd');
					//					}
				},
				{
					label: "产品类型",
					name: "producttype",
					index: "producttype",
					width: 120,
					align: "center"
				},
				{
					label: "产品名称",
					name: "productName",
					index: "productName",
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
					label: "产品编码",
					name: "producttoken",
					index: "producttoken",
					width: 120,
					align: "center"
				},
				{
					label: "产品描述",
					name: "productdesc",
					index: "productdesc",
					width: 150,
					align: "center",
				},
				{
					label: "发货日期",
					name: "deliverytime",
					index: "deliverytime",
					width: 120,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return formatDate(cellvalue, 'yyyy-MM-dd');
					}
				},
				{
					label: "合同号",
					name: "contractno",
					index: "contractno",
					width: 120,
					align: "center"
				},
				{
					label: "联系人",
					name: "contact",
					index: "contact",
					width: 100,
					align: "center"
				},
				{
					label: "联系方式",
					name: "mobile",
					index: "mobile",
					width: 120,
					align: "center"
				}, {
					label: "销售经理",
					name: "salerid",
					index: "salerid",
					width: 120,
					align: "center"
				}

			],
			//表头的隐藏显示按钮事件
			//			onHeaderClick: function(gridstate) {
			//				if(isDbClick) {
			//					if(gridstate == 'hidden') {
			//						$("#gridChildTable").setGridHeight($(window).height() - 210);
			//					} else if(gridstate == 'visible') {
			//						$("#gridChildTable").setGridHeight($(window).height() - 452);
			//					}
			//				} else {
			//					
			//					if(gridstate == 'hidden') {
			//						$("#gridChildTable").setGridHeight($(window).height() - 210);
			//					} else if(gridstate == 'visible') {
			//						$("#gridChildTable").setGridHeight(0);
			//						
			//					}
			//				}
			//
			//			},
			//			ondblClickRow: function(rowid, iRow, iCol, e) {
			//				isDbClick = true;
			//				$("#gridTable").setGridHeight(200);
			//				$("#gridChildTable").setGridHeight($(window).height() - 468);
			//				var row_id = $gridTable.jqGrid('getRowData', rowid).LogId;
			//				self.search_child_table(1);
			//			},
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'nextwarrantdate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			//			gridview: true,
			//			caption: "产品概况",

		});
		//点击时间范围（今天、近7天、近一个月、近三个月）
		$("#time_horizon a.btn-default").click(function() {
			$("#time_horizon a.btn-default").removeClass("active");
			$(this).addClass("active");
			switch($(this).attr('data-value')) {
				case "1": //今天
					$("#StartTime").val(now_day);
					$("#EndTime").val(now_day);
					break;
				case "2": //近7天
					$("#StartTime").val(pre_week);
					$("#EndTime").val(now_day);
					break;
				case "3": //近一个月
					$("#StartTime").val(pre_month);
					$("#EndTime").val(now_day);
					break;
				case "4": //近三个月
					$("#StartTime").val(pre_three_month);
					$("#EndTime").val(now_day);
					break;
				default:
					break;
			}
			$("#SelectedStartTime").html($("#StartTime").val());
			$("#SelectedEndTime").html($("#EndTime").val());
			self.SearchEvent();
		});
		//查询点击事件
		$("#btn_Search").click(function() {
			self.SearchEvent();
			$(".ui-filter-text").trigger("click");
			$("#SelectedStartTime").html($("#StartTime").val());
			$("#SelectedEndTime").html($("#EndTime").val());
		});
		//左边分类点击事件
		$(".profile-nav li").click(function() {
			self.SearchEvent();
		
		})
	}
	//查询表格函数
	this.SearchEvent = function() {
		var queryJson = $("#filter-form").GetWebControls();
		queryJson["begindate"] = $("#StartTime").val();
		queryJson["endDate"] = $("#EndTime").val();
		$("#gridTable").jqGrid('setGridParam', {
			url: "/AfterSaleManage/orderproduct/GetProductWarrantReminderList",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	}

	//查询重置
	$("#btn_Reset").click(function() {
		$("#StartTime").val(pre_week);
		$("#EndTime").val(now_day);
		$("#productType").val("");
		$("#productName").val("");
		$("#productToken").val("");
		$("#productCode").val("");
		$("#client").val("");
		$("#linkman").val("");
		self.SearchEvent();
		//$(".ui-filter-text").trigger("click");
		$("#SelectedStartTime").html($("#StartTime").val());
		$("#SelectedEndTime").html($("#EndTime").val());
	});
	//处理
	dialogOpenHandle = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			title: '',
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['形成售后工单','一键派单', '关闭'],
			callBack: null
		};
		var options = $.extend(defaults, options);
		var _url = options.url;
		var _width = top.$.windowWidth() > parseInt(options.width.replace('px', '')) ? options.width : top.$.windowWidth() + 'px';
		var _height = top.$.windowHeight() > parseInt(options.height.replace('px', '')) ? options.height : top.$.windowHeight() + 'px';
		top.layer.open({
			id: options.id,
			type: 2,
			shade: options.shade,
			title: options.title,
			fix: false,
			area: [_width, _height],
			content: top.mainPath + _url,
			btn: options.btn,
			yes: function() {
				//alert("yes");
				options.callBack(options.id)
			},
			cancel: function() {
				if(options.cancel != undefined) {
					options.cancel();
				}
				return true;

			},
			btn3: function() {
				//alert("312223333");
				options.callBack2(options.id)
				//  dialogClose();
			},
			end: function() {
				$('#gridTable').trigger('reloadGrid');
			}
		});
	}
	
	//处理
	this.btn_deal = function() {
		var orderproductid = $('#gridTable').jqGridRowValue('orderproductid'),
		keyValue = "";
		if(!orderproductid&&orderproductid.length<=0){
			dialogMsg('您没有选中任何数据项,请选中后再操作！',0);
			return false;
		}
		dialogOpenHandle({
			id: "HandleForm",
			title: '',
			url: '/hongtupage/view/warranty/handle.html?keyValue='+ keyValue + '&orderproductid=' + orderproductid,
			width: 'px',
			height: 'px',
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClicks();
			},
			callBack2: function(iframeId) {
//				console.log(iframeId);
				// alert('callBack2');
//				console.log(top.frames[iframeId]);
				top.frames[iframeId].model.saveTaskClick();
			}
		});
	}
	
	
	
	
	//产品详情表格
	//	this.getChildGrid = function(param) {
	//		var queryJson = $("#filter-form").GetWebControls();
	//		queryJson["CategoryId"] = param;
	//		var $gridTable = $("#gridChildTable");
	//		$gridTable.jqGrid({
	//			url: "/SystemManage/Log/GetPageListJson",
	//			postData: {
	//				queryJson: JSON.stringify(queryJson)
	//			},
	//			datatype: "json",
	//			height: 0,
	//			autowidth: true,
	//			colModel: [{
	//					label: "主键",
	//					name: "LogId",
	//					hidden: true
	//				},
	//				{
	//					label: "质保期",
	//					name: "OperateTime",
	//					index: "OperateTime",
	//					width: 150,
	//					align: "left",
	//					formatter: function(cellvalue, options, rowObject) {
	//						return formatDate(cellvalue, 'yyyy-MM-dd hh:mm:ss');
	//					}
	//				},
	//				{
	//					label: "产品名称",
	//					name: "OperateAccount",
	//					index: "OperateAccount",
	//					width: 150,
	//					align: "left"
	//				},
	//				{
	//					label: "产品型号",
	//					name: "OperateAccount",
	//					index: "OperateAccount",
	//					width: 150,
	//					align: "left"
	//				},
	//				{
	//					label: "产品批号",
	//					name: "IPAddress",
	//					index: "IPAddress",
	//					width: 150,
	//					align: "left"
	//				},
	//				{
	//					label: "数量",
	//					name: "Module",
	//					index: "Module",
	//					width: 80,
	//					align: "left"
	//				},
	//				{
	//					label: "产品名称",
	//					name: "OperateType",
	//					index: "OperateType",
	//					width: 70,
	//					align: "center"
	//				},
	//				{
	//					label: "出厂日期",
	//					name: "ExecuteResult",
	//					index: "ExecuteResult",
	//					width: 70,
	//					align: "center",
	//					formatter: function(cellvalue, options, rowObject) {
	//						if(cellvalue == '1') {
	//							return "<span class=\"label label-success\">成功</span>";
	//						} else {
	//							return "<span class=\"label label-danger\">失败</span>";
	//						}
	//					}
	//				},
	//				{
	//					label: "客户名称",
	//					name: "ExecuteResultJson",
	//					index: "ExecuteResultJson",
	//					width: 100,
	//					align: "left"
	//				},
	//				{
	//					label: "客户地址",
	//					name: "ExecuteResultJson",
	//					index: "ExecuteResultJson",
	//					width: 100,
	//					align: "left"
	//				},
	//				{
	//					label: "合同号",
	//					name: "ExecuteResultJson",
	//					index: "ExecuteResultJson",
	//					width: 100,
	//					align: "left"
	//				}
	//			],
	//			viewrecords: true,
	//			rowNum: 30,
	//			rowList: [30, 50, 100],
	//			pager: "#gridChildPager",
	//			sortname: 'OperateTime',
	//			sortorder: 'desc',
	//			rownumbers: true,
	//			shrinkToFit: false,
	//			gridview: true,
	//			caption: "产品详情",
	//			hidegrid: false, //隐藏收缩按钮
	//		});
	//	}

	//查询子表格
	//	this.search_child_table = function(param) {
	//		var queryJson = {
	//			CategoryId: param
	//		};
	//		$("#gridChildTable").jqGrid('setGridParam', {
	//			url: "/SystemManage/Log/GetPageListJson",
	//			postData: {
	//				queryJson: JSON.stringify(queryJson)
	//			},
	//			page: 1
	//		}).trigger('reloadGrid');
	//	}

	
};

$('.toolbar').authorizeButton()
var model = new viewModel();