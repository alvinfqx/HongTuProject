var viewModel = function() {
	var self = this;
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
		$('.profile-nav').height($(window).height() - 20);
		$('.profile-content').height($(window).height() - 20);
		//resize重设(表格、树形)宽高
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$("#gridTable").setGridHeight($(window).height() - 137);
				$('.profile-nav').height($(window).height() - 20);
				$('.profile-content').height($(window).height() - 20);
			}, 200);
			e.stopPropagation();
		});
	}
	//加载表格
	this.GetGrid = function() {
		var queryJson = $("#filter-form").GetWebControls();
		queryJson["CategoryId"] = 1;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/SystemManage/Log/GetPageListJson",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			datatype: "json",
			height: $(window).height() - 137,
			autowidth: true,
			colModel: [{
					label: "主键",
					name: "LogId",
					hidden: true
				},
				{
					label: "操作时间",
					name: "OperateTime",
					index: "OperateTime",
					width: 150,
					align: "left",
					formatter: function(cellvalue, options, rowObject) {
						return formatDate(cellvalue, 'yyyy-MM-dd hh:mm:ss');
					}
				},
				{
					label: "操作用户",
					name: "OperateAccount",
					index: "OperateAccount",
					width: 150,
					align: "left"
				},
				{
					label: "IP地址",
					name: "IPAddress",
					index: "IPAddress",
					width: 150,
					align: "left"
				},
				{
					label: "系统功能",
					name: "Module",
					index: "Module",
					width: 150,
					align: "left"
				},
				{
					label: "操作类型",
					name: "OperateType",
					index: "OperateType",
					width: 70,
					align: "center"
				},
				{
					label: "执行结果",
					name: "ExecuteResult",
					index: "ExecuteResult",
					width: 70,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						if(cellvalue == '1') {
							return "<span class=\"label label-success\">成功</span>";
						} else {
							return "<span class=\"label label-danger\">失败</span>";
						}
					}
				},
				{
					label: "执行结果描述",
					name: "ExecuteResultJson",
					index: "ExecuteResultJson",
					width: 100,
					align: "left"
				}
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100, 500, 1000],
			pager: "#gridPager",
			sortname: 'OperateTime desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true
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
		queryJson["CategoryId"] = $(".profile-nav").find('li.active').attr('data-value');
		$("#gridTable").jqGrid('setGridParam', {
			url: "/SystemManage/Log/GetPageListJson",
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
			$("#OperateAccount").val("");
			$("#IPAddress").val("");
			$("#OperateType").val("");
			$("#Module").val("");
			self.SearchEvent();
			$(".ui-filter-text").trigger("click");
			$("#SelectedStartTime").html($("#StartTime").val());
			$("#SelectedEndTime").html($("#EndTime").val());
		});
	
	//清空日志
	this.btn_RemoveLog = function() {
		var categoryId = $(".profile-nav").find('li.active').attr('data-value');
		var categoryName = $(".profile-nav").find('li.active').html();
		dialogOpen({
			id: "RemoveLog",
			title: '清空' + categoryName,
			url: '/webpage/system/log_remove.html?categoryId=' + categoryId,
			width: "400px",
			height: "200px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	}
	//导出
	this.btn_export = function() {
		dialogOpen({
			id: "ExcelIExportDialog",
			title: '导出Excel数据',
			url: '/webpage/utility/excelExportForm.html?gridId=gridTable&filename=日志导出',
			width: "500px",
			height: "380px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			},
			btn: ['导出Excel', '关闭']
		});
	}
};

$('.toolbar').authorizeButton()
var model = new viewModel();